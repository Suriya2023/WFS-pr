<?php
// backend/api/dashboard/stats.php
require_once '../../config.php';

$headers = apache_request_headers();
$authHeader = $headers['Authorization'] ?? '';
if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    sendResponse(["message" => "Unauthorized"], 401);
}
$tokenData = json_decode(base64_decode($matches[1]), true);
$userId = $tokenData['id'] ?? null;

try {
    // AUTO-FIX: Ensure transactions table exists
    $pdo->exec("CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        type ENUM('credit', 'debit') NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'success',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // Fetch User Details for Banner
    $stmt = $pdo->prepare("SELECT firstname, lastname, kyc_status, wallet_balance FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) {
        sendResponse(["message" => "User not found"], 404);
    }

    // Fetch Order Stats
    $stmt = $pdo->prepare("SELECT status, COUNT(*) as count FROM shipments WHERE user_id = ? GROUP BY status");
    $stmt->execute([$userId]);
    $orderStats = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

    // Fetch Wallet Activity (Last 15 transactions)
    $stmt = $pdo->prepare("SELECT id as _id, amount, type, description, status, created_at as createdAt 
                         FROM transactions 
                         WHERE user_id = ? 
                         ORDER BY created_at DESC 
                         LIMIT 15");
    $stmt->execute([$userId]);
    $walletActivity = $stmt->fetchAll();

    sendResponse([
        "user" => [
            "name" => ($user['firstname'] ?? 'User') . ' ' . ($user['lastname'] ?? ''),
            "kycStatus" => $user['kyc_status'] ?? 'not_submitted',
            "walletBalance" => $user['wallet_balance'] ?? 0
        ],
        "orders" => [
            "total" => array_sum($orderStats),
            "draft" => $orderStats['draft'] ?? 0,
            "ready" => $orderStats['ready'] ?? 0,
            "packed" => $orderStats['packed'] ?? 0,
            "dispatched" => $orderStats['dispatched'] ?? 0,
            "manifested" => $orderStats['manifested'] ?? 0,
            "disputed" => $orderStats['disputed'] ?? 0
        ],
        "walletActivity" => $walletActivity
    ]);
} catch (PDOException $e) {
    sendResponse(["message" => "Database error: " . $e->getMessage()], 500);
}
?>