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
        "walletActivity" => [] // Placeholder
    ]);
} catch (PDOException $e) {
    sendResponse(["message" => "Database error: " . $e->getMessage()], 500);
}
?>