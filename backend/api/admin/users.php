<?php
// backend/api/admin/users.php
require_once __DIR__ . '/../../config.php';

$token = verifyToken();
if (!$token) {
    sendResponse(array("message" => "Unauthorized access."), 401);
}

try {
    $tokenData = json_decode(base64_decode($token), true);
    $currentUserId = isset($tokenData['id']) ? $tokenData['id'] : null;

    $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute(array($currentUserId));
    $currentUser = $stmt->fetch();

    if (!$currentUser || $currentUser['role'] !== 'admin') {
        sendResponse(array("message" => "Access denied. Admin only."), 403);
    }

    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'POST') {
        $input = json_decode(file_get_contents("php://input"), true);
        $action = isset($input['action']) ? $input['action'] : '';
        $targetUserId = isset($input['user_id']) ? $input['user_id'] : '';

        if ($action === 'toggle_block') {
            $update = $pdo->prepare("UPDATE users SET is_blocked = NOT is_blocked WHERE id = ?");
            $update->execute(array($targetUserId));
            sendResponse(true, "User status updated.");
        }

        if ($action === 'update_user') {
            $firstname = isset($input['firstname']) ? $input['firstname'] : '';
            $lastname = isset($input['lastname']) ? $input['lastname'] : '';
            $email = isset($input['email']) ? $input['email'] : '';
            $mobile = isset($input['mobile']) ? $input['mobile'] : '';
            $wallet_balance = (float) (isset($input['wallet_balance']) ? $input['wallet_balance'] : 0);

            $update = $pdo->prepare("UPDATE users SET firstname = ?, lastname = ?, email = ?, mobile = ?, wallet_balance = ? WHERE id = ?");
            $update->execute(array($firstname, $lastname, $email, $mobile, $wallet_balance, $targetUserId));
            sendResponse(true, "User updated successfully.");
        }

        if ($action === 'delete_user') {
            $delete = $pdo->prepare("DELETE FROM users WHERE id = ?");
            $delete->execute(array($targetUserId));
            sendResponse(true, "User deleted successfully.");
        }
    }

    // Default: GET Users List
    $sql = "SELECT id, firstname, lastname, email, role, kyc_status, is_blocked, wallet_balance, created_at, mobile FROM users WHERE role != 'admin' ORDER BY created_at DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $users = $stmt->fetchAll();

    foreach ($users as &$u) {
        $u['wallet_balance'] = (float) $u['wallet_balance'];
        $u['is_blocked'] = (int) $u['is_blocked'];
    }

    sendResponse($users);

} catch (PDOException $e) {
    debugLog("Admin Users API Error: " . $e->getMessage());
    sendResponse(array("message" => "Database error: " . $e->getMessage()), 500);
} catch (Exception $e) {
    debugLog("Admin Users API Error: " . $e->getMessage());
    sendResponse(array("message" => "Error: " . $e->getMessage()), 500);
}
?>