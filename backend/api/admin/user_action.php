<?php
require_once '../../config.php';

// Auth Check
$headers = apache_request_headers();
$token = str_replace('Bearer ', '', isset($headers['Authorization']) ? $headers['Authorization'] : '');
$tokenData = json_decode(base64_decode($token), true);
$adminId = isset($tokenData['id']) ? $tokenData['id'] : null;

if (!$adminId)
    sendResponse(["message" => "Unauthorized"], 401);

// Role check
$stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
$stmt->execute([$adminId]);
$admin = $stmt->fetch();
if (!$admin || $admin['role'] !== 'admin')
    sendResponse(["message" => "Forbidden"], 403);

$input = json_decode(file_get_contents("php://input"), true);
$action = isset($input['action']) ? $input['action'] : '';
$targetUserId = isset($input['user_id']) ? $input['user_id'] : null;

if (!$targetUserId)
    sendResponse(["message" => "User ID required"], 400);

try {
    switch ($action) {
        case 'block':
            $stmt = $pdo->prepare("UPDATE users SET is_blocked = 1 WHERE id = ?");
            $stmt->execute([$targetUserId]);
            sendResponse(["message" => "User blocked successfully"]);
            break;
        case 'unblock':
            $stmt = $pdo->prepare("UPDATE users SET is_blocked = 0 WHERE id = ?");
            $stmt->execute([$targetUserId]);
            sendResponse(["message" => "User unblocked successfully"]);
            break;
        case 'update':
            $firstname = isset($input['firstname']) ? $input['firstname'] : '';
            $lastname = isset($input['lastname']) ? $input['lastname'] : '';
            $email = isset($input['email']) ? $input['email'] : '';
            $mobile = isset($input['mobile']) ? $input['mobile'] : '';
            $kyc_status = isset($input['kyc_status']) ? $input['kyc_status'] : 'pending';

            if (!$firstname || !$email)
                sendResponse(["message" => "Firstname and Email required"], 400);

            $stmt = $pdo->prepare("UPDATE users SET firstname = ?, lastname = ?, email = ?, mobile = ?, kyc_status = ? WHERE id = ?");
            $stmt->execute([$firstname, $lastname, $email, $mobile, $kyc_status, $targetUserId]);
            sendResponse(["message" => "User details updated successfully"]);
            break;
        case 'wallet_recharge':
            $amount = floatval(isset($input['amount']) ? $input['amount'] : 0);
            if ($amount <= 0)
                sendResponse(["message" => "Invalid amount"], 400);

            $pdo->beginTransaction();
            $stmt = $pdo->prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?");
            $stmt->execute([$amount, $targetUserId]);

            $stmt = $pdo->prepare("INSERT INTO transactions (user_id, amount, type, description, status) VALUES (?, ?, 'credit', 'Manual Credit by Admin', 'success')");
            $stmt->execute([$targetUserId, $amount]);
            $pdo->commit();

            sendResponse(["message" => "Wallet recharged successfully"]);
            break;
        default:
            sendResponse(["message" => "Invalid action"], 400);
    }
} catch (PDOException $e) {
    sendResponse(["message" => "Database error: " . $e->getMessage()], 500);
}
?>