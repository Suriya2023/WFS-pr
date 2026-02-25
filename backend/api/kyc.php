<?php
// backend/api/kyc.php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$data = json_decode(file_get_contents("php://input"), true);

$token = verifyToken();
if (!$token) {
    sendResponse(false, "Unauthorized");
}
$tokenData = json_decode(base64_decode($token), true);
$userId = $tokenData['id'];

if (isset($_GET['user_id']) && $tokenData['role'] === 'admin') {
    $userId = $_GET['user_id'];
}

if ($method == 'GET' && $action == 'details') {
    $stmt = $pdo->prepare("SELECT k.*, u.mobile as user_mobile, u.firstname, u.lastname 
                          FROM kyc_details k 
                          JOIN users u ON k.user_id = u.id 
                          WHERE k.user_id = ?");
    $stmt->execute([$userId]);
    $kyc = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($kyc) {
        // Fallback for mobile if not in kyc_details (depending on implementation)
        if (!isset($kyc['mobile']))
            $kyc['mobile'] = $kyc['user_mobile'];
        sendResponse(true, "KYC Details", $kyc);
    } else {
        // Return null or false so frontend knows no KYC exists
        echo json_encode(null); // specific for frontend check
        exit();
    }
} elseif ($method == 'POST' && $action == 'submit') {
    // Handle KYC Submission from FormData
    $fullName = $_POST['fullName'] ?? '';
    $alternateContact = $_POST['alternateContact'] ?? '';
    $aadhaarNumber = $_POST['aadhaarNumber'] ?? '';
    $panNumber = $_POST['panNumber'] ?? '';
    $accountType = $_POST['accountType'] ?? 'personal';
    $address = $_POST['address'] ?? ''; // JSON string
    $billing = $_POST['billing'] ?? ''; // JSON string
    $businessData = $_POST['businessData'] ?? ''; // JSON string

    // Check if exists
    $stmt = $pdo->prepare("SELECT id FROM kyc_details WHERE user_id = ?");
    $stmt->execute([$userId]);
    $existing = $stmt->fetch();

    if ($existing) {
        $sql = "UPDATE kyc_details SET 
                full_name = ?, 
                aadhaar_number = ?, 
                pan_number = ?, 
                address_details = ?, 
                status = 'pending',
                created_at = CURRENT_TIMESTAMP
                WHERE user_id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$fullName, $aadhaarNumber, $panNumber, $address, $userId]);
    } else {
        $sql = "INSERT INTO kyc_details (user_id, full_name, aadhaar_number, pan_number, address_details, status) 
                VALUES (?, ?, ?, ?, ?, 'pending')";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$userId, $fullName, $aadhaarNumber, $panNumber, $address]);
    }

    // Update user table status and mobile if needed
    $stmt = $pdo->prepare("UPDATE users SET kyc_status = 'pending', mobile = IF(mobile IS NULL OR mobile = '', ?, mobile) WHERE id = ?");
    $stmt->execute([$alternateContact, $userId]);

    sendResponse(true, "KYC Submitted successfully.");
}
?>