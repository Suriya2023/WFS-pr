<?php
// backend/api/auth/verify-otp.php
require_once '../../config.php';

debugLog("VERIFY OTP REQUEST: " . file_get_contents("php://input"));

$input = json_decode(file_get_contents("php://input"), true);
$email = isset($input['email']) ? $input['email'] : '';
$otp = isset($input['otp']) ? $input['otp'] : '';

if (!$email || !$otp) {
    debugLog("VERIFY OTP FAILED: Missing Email or OTP");
    sendResponse(["message" => "Email and OTP required"], 400);
}

try {
    $pdo->beginTransaction();

    // 1. Check pending_users
    $stmt = $pdo->prepare("SELECT * FROM pending_users WHERE email = ?");
    $stmt->execute([$email]);
    $pendingUser = $stmt->fetch();

    if (!$pendingUser) {
        sendResponse(["message" => "No pending registration found for this email."], 404);
    }

    // 2. Verify OTP and Expiry
    if ($pendingUser['otp'] !== $otp) {
        sendResponse(["message" => "Invalid OTP code."], 400);
    }

    if (strtotime($pendingUser['otp_expiry']) < time()) {
        sendResponse(["message" => "OTP has expired. Please signup again."], 400);
    }

    // 3. Move to main users table
    $stmt = $pdo->prepare("INSERT INTO users (firstname, lastname, email, mobile, password, role)
                          VALUES (?, ?, ?, ?, ?, 'user')");
    $stmt->execute([
        $pendingUser['firstname'],
        $pendingUser['lastname'],
        $pendingUser['email'],
        $pendingUser['mobile'],
        $pendingUser['password']
    ]);

    // 4. Delete from pending_users
    $stmt = $pdo->prepare("DELETE FROM pending_users WHERE email = ?");
    $stmt->execute([$email]);

    $pdo->commit();
    sendResponse(["message" => "Email verified and registration complete. You can now login.", "success" => true]);

} catch (PDOException $e) {
    try {
        $pdo->rollBack();
    } catch (Exception $re) {
    }
    debugLog("VERIFY OTP DB ERROR: " . $e->getMessage());
    sendResponse(["message" => "Verification failed: " . $e->getMessage()], 500);
}
?>