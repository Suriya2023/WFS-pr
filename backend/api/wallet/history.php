<?php
// backend/api/wallet/history.php
require_once '../../config.php';

$headers = apache_request_headers();
$authHeader = $headers['Authorization'] ?? '';
if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    sendResponse(["message" => "Unauthorized"], 401);
}
$tokenData = json_decode(base64_decode($matches[1]), true);
$userId = $tokenData['id'] ?? null;
$role = $tokenData['role'] ?? 'user';

// Allow admin to see other users' history
if ($role === 'admin' && isset($_GET['user_id'])) {
    $userId = $_GET['user_id'];
}

try {
    $stmt = $pdo->prepare("SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$userId]);
    $transactions = $stmt->fetchAll();
    sendResponse($transactions);
} catch (PDOException $e) {
    sendResponse(["message" => "Database error: " . $e->getMessage()], 500);
}
?>