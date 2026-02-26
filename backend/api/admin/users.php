<?php
// backend/api/admin/users.php
require_once '../../config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'POST') {
        $input = json_decode(file_get_contents("php://input"), true);
        $action = $input['action'] ?? '';
        $userId = $input['user_id'] ?? '';

        if ($action === 'toggle_block' && !empty($userId)) {
            // Get current state
            $stmt = $pdo->prepare("SELECT is_blocked FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch();

            if ($user) {
                $newState = $user['is_blocked'] ? 0 : 1;
                $update = $pdo->prepare("UPDATE users SET is_blocked = ? WHERE id = ?");
                $update->execute([$newState, $userId]);
                sendResponse(["success" => true, "message" => $newState ? "User blocked" : "User unblocked"]);
                exit;
            }
        }

        if ($action === 'update_user' && !empty($userId)) {
            $firstname = $input['firstname'] ?? '';
            $lastname = $input['lastname'] ?? '';
            $email = $input['email'] ?? '';
            $phone = $input['phone'] ?? '';
            $wallet_balance = $input['wallet_balance'] ?? 0;

            $update = $pdo->prepare("UPDATE users SET firstname = ?, lastname = ?, email = ?, phone = ?, wallet_balance = ? WHERE id = ?");
            $update->execute([$firstname, $lastname, $email, $phone, $wallet_balance, $userId]);
            sendResponse(["success" => true, "message" => "User updated successfully"]);
            exit;
        }

        if ($action === 'delete_user' && !empty($userId)) {
            $delete = $pdo->prepare("DELETE FROM users WHERE id = ?");
            $delete->execute([$userId]);
            sendResponse(["success" => true, "message" => "User deleted successfully"]);
            exit;
        }

        sendResponse(["message" => "Invalid action"], 400);
        exit;
    }

    // Default GET: Return all users
    $stmt = $pdo->prepare("SELECT id, firstname, lastname, email, role, kyc_status, is_blocked, wallet_balance, created_at, phone, mobile FROM users WHERE role != 'admin' ORDER BY created_at DESC");
    $stmt->execute();
    sendResponse($stmt->fetchAll());

} catch (PDOException $e) {
    sendResponse(["message" => $e->getMessage()], 500);
}
?>