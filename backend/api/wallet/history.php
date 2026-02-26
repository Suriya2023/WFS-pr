<?php
// backend/api/wallet/history.php
require_once __DIR__ . '/../../config.php';

$token = verifyToken();
if (!$token) {
    sendResponse(array("message" => "Unauthorized"), 401);
}

$tokenData = json_decode(base64_decode($token), true);
$userId = isset($tokenData['id']) ? $tokenData['id'] : null;
$role = isset($tokenData['role']) ? $tokenData['role'] : 'user';

// Allow admin to see other users' history
if ($role === 'admin' && isset($_GET['user_id'])) {
    $userId = $_GET['user_id'];
}

try {
    // Check which table exists and what its columns are
    $table = 'transactions';
    $check = $pdo->query("SHOW TABLES LIKE 'wallet_transactions'")->fetch();

    if ($check) {
        $table = 'wallet_transactions';
        $cols = $pdo->query("DESCRIBE `wallet_transactions`")->fetchAll(PDO::FETCH_COLUMN);
        $descCol = in_array('reason', $cols) ? 'reason' : 'description';

        $stmt = $pdo->prepare("SELECT id, user_id, amount, type, created_at, `$descCol` as description, 'success' as status FROM `$table` WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute(array($userId));
    } else {
        $cols = $pdo->query("DESCRIBE `transactions`")->fetchAll(PDO::FETCH_COLUMN);
        $descCol = in_array('description', $cols) ? 'description' : 'reason';

        $stmt = $pdo->prepare("SELECT id, user_id, amount, type, created_at, status, `$descCol` as description FROM `$table` WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute(array($userId));
    }

    $transactions = $stmt->fetchAll();

    // Final check for status field
    foreach ($transactions as &$t) {
        if (!isset($t['status'])) {
            $t['status'] = 'success';
        }
    }

    sendResponse($transactions);
} catch (PDOException $e) {
    debugLog("Wallet History API Error: " . $e->getMessage());
    sendResponse(array("message" => "Database error: " . $e->getMessage()), 500);
}
?>