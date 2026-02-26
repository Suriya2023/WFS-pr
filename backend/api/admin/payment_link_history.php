<?php
// backend/api/admin/payment_link_history.php
require_once '../../config.php';

// Auth Check
$headers = apache_request_headers();
$token = str_replace('Bearer ', '', isset($headers['Authorization']) ? $headers['Authorization'] : '');
$tokenData = json_decode(base64_decode($token), true);
$userId = isset($tokenData['id']) ? $tokenData['id'] : null;

if (!$userId)
    sendResponse(["message" => "Unauthorized"], 401);

$targetUserId = isset($_GET['user_id']) ? $_GET['user_id'] : null;
if (!$targetUserId)
    sendResponse(["message" => "User ID required"], 400);

try {
    $stmt = $pdo->prepare("SELECT * FROM payment_links WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$targetUserId]);
    $history = $stmt->fetchAll();

    // Add alias for _id if needed
    $history = array_map(function ($h) {
        $h['_id'] = $h['id'];
        return $h;
    }, $history);

    sendResponse($history);
} catch (PDOException $e) {
    sendResponse(["message" => "Error: " . $e->getMessage()], 500);
}
?>