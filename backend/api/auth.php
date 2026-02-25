<?php
// backend/api/auth.php
require_once '../config.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';
$data = json_decode(file_get_contents("php://input"), true);

if ($action == 'register') {
    $firstname = trim($data['firstname'] ?? '');
    $lastname = trim($data['lastname'] ?? '');
    $email = trim($data['email'] ?? '');
    $mobile = trim($data['mobile'] ?? '');
    $password = $data['password'] ?? '';

    if (!$firstname || !$email || !$password) {
        sendResponse(false, "First Name, Email and Password are required");
    }

    // 1. Check if user already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        sendResponse(false, "Email already exists. Please login.");
    }

    // 2. Prepare OTP
    $otp = rand(100000, 999999);
    $expiry = date('Y-m-d H:i:s', strtotime('+15 minutes'));
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);

    try {
        // Ensure pending_users table exists
        $pdo->exec("CREATE TABLE IF NOT EXISTS pending_users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            firstname VARCHAR(100) NOT NULL,
            lastname VARCHAR(100),
            email VARCHAR(150) UNIQUE NOT NULL,
            mobile VARCHAR(20),
            password VARCHAR(255) NOT NULL,
            otp VARCHAR(6) NOT NULL,
            otp_expiry DATETIME NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        // Upsert into pending_users
        $stmt = $pdo->prepare("INSERT INTO pending_users (firstname, lastname, email, mobile, password, otp, otp_expiry) 
                              VALUES (?, ?, ?, ?, ?, ?, ?) 
                              ON DUPLICATE KEY UPDATE 
                              firstname = VALUES(firstname), 
                              lastname = VALUES(lastname), 
                              password = VALUES(password), 
                              otp = VALUES(otp), 
                              otp_expiry = VALUES(otp_expiry)");
        $stmt->execute([$firstname, $lastname, $email, $mobile, $hashed_password, $otp, $expiry]);

        // 3. Send Email
        require_once '../utils/mailer.php';

        $template = "<h2>BGL Express Verification</h2>
                     <p>Hi $firstname,</p>
                     <p>Your verification code is: <b>$otp</b></p>
                     <p>This code is valid for 15 minutes.</p>";

        $emailSent = sendEmail($email, "Registration OTP - BGL Express", $template);

        sendResponse(true, "OTP sent to your email. Please verify to complete registration.", ["email_sent" => $emailSent]);

    } catch (PDOException $e) {
        sendResponse(false, "Database error: " . $e->getMessage());
    }


} elseif ($action == 'login') {
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        // Generate a simple token - INCLUDE ROLE for admin checks
        $token = base64_encode(json_encode([
            'id' => $user['id'],
            'role' => $user['role'],
            'time' => time()
        ]));

        unset($user['password']); // Don't send password back

        sendResponse([
            "success" => true,
            "message" => "Login successful",
            "token" => $token,
            "user" => $user
        ], 200);

    } else {
        sendResponse(["success" => false, "message" => "Invalid email or password."], 401);
    }
} else {
    sendResponse(false, "Invalid action");
}
?>