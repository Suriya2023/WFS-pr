<?php
// backend/api/admin/send_payment_link.php
require_once '../../config.php';
require_once '../../utils/mailer.php';

// Auth Check
$headers = apache_request_headers();
$token = str_replace('Bearer ', '', isset($headers['Authorization']) ? $headers['Authorization'] : '');
$tokenData = json_decode(base64_decode($token), true);
$adminId = isset($tokenData['id']) ? $tokenData['id'] : null;

if (!$adminId)
    sendResponse(["message" => "Unauthorized"], 401);

$stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
$stmt->execute([$adminId]);
$admin = $stmt->fetch();
if (!$admin || $admin['role'] !== 'admin')
    sendResponse(["message" => "Forbidden"], 403);

$input = json_decode(file_get_contents("php://input"), true);
$targetUserId = isset($input['user_id']) ? $input['user_id'] : null;
$amount = floatval(isset($input['amount']) ? $input['amount'] : 0);
$description = isset($input['description']) ? $input['description'] : 'Custom Payment Link';

if (!$targetUserId || $amount <= 0)
    sendResponse(["message" => "Invalid target user or amount"], 400);

// Fetch User Email
$stmt = $pdo->prepare("SELECT email, firstname, lastname FROM users WHERE id = ?");
$stmt->execute([$targetUserId]);
$targetUser = $stmt->fetch();
if (!$targetUser)
    sendResponse(["message" => "User not found"], 404);

// Razorpay Credentials
$keyId = "rzp_test_RxLxOuoJcABUSb";
$keySecret = "GzCyKqhBqNejyE78LB1gmmda";

try {
    // 1. Create Razorpay Payment Link
    $url = "https://api.razorpay.com/v1/payment_links";
    $data = [
        "amount" => $amount * 100, // in paise
        "currency" => "INR",
        "accept_partial" => false,
        "description" => $description,
        "customer" => [
            "name" => $targetUser['firstname'] . ' ' . $targetUser['lastname'],
            "email" => $targetUser['email']
        ],
        "notify" => [
            "sms" => false,
            "email" => true
        ],
        "reminder_enable" => true,
        "notes" => [
            "user_id" => $targetUserId,
            "admin_id" => $adminId
        ],
        "callback_url" => "https://example.com/payment-callback",
        "callback_method" => "get"
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_USERPWD, $keyId . ":" . $keySecret);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200 && $httpCode !== 201) {
        debugLog("Razorpay Link Creation Failed: " . $response);
        sendResponse(["message" => "Failed to create payment link"], 500);
    }

    $result = json_decode($response, true);
    $plinkId = $result['id'];
    $shortUrl = $result['short_url'];

    // 2. Save to database (Auto-repair/Create table first)
    $pdo->exec("CREATE TABLE IF NOT EXISTS payment_links (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        amount DECIMAL(15,2),
        description TEXT,
        razorpay_link_id VARCHAR(100),
        short_url TEXT,
        status VARCHAR(20) DEFAULT 'created',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    $stmt = $pdo->prepare("INSERT INTO payment_links (user_id, amount, description, razorpay_link_id, short_url) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$targetUserId, $amount, $description, $plinkId, $shortUrl]);

    // 3. Send Email (Secondary notification)
    $emailTemplate = "
    <h2>Payment Request from BGL Express</h2>
    <p>Hi " . $targetUser['firstname'] . ",</p>
    <p>An admin has requested a payment of <b>₹$amount</b> for: <i>$description</i></p>
    <p>Please use the link below to complete your payment:</p>
    <p><a href='$shortUrl' style='padding: 10px 20px; background: #c62828; color: white; text-decoration: none; border-radius: 5px;'>Pay Now</a></p>
    <p>Or copy this URL: $shortUrl</p>
    <p>Thank you,<br>BGL Express Team</p>
    ";
    sendEmail($targetUser['email'], "Payment Link - BGL Express", $emailTemplate);

    sendResponse(["message" => "Payment link sent successfully", "short_url" => $shortUrl]);

} catch (Exception $e) {
    sendResponse(["message" => "Error: " . $e->getMessage()], 500);
}
?>