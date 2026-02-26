<?php
// backend/api/notifications.php
require_once __DIR__ . '/../config.php';

$token = verifyToken();
if (!$token) {
    sendResponse(array("message" => "Unauthorized"), 401);
}

$tokenData = json_decode(base64_decode($token), true);
$userId = isset($tokenData['id']) ? $tokenData['id'] : null;

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        // Match exact DB schema: id, user_id, title, message, is_read, created_at
        $stmt = $pdo->prepare("SELECT id as _id, title, message, is_read as isRead, created_at as createdAt FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20");
        $stmt->execute(array($userId));
        $notifications = $stmt->fetchAll();
        sendResponse($notifications);

    } elseif ($method === 'PUT') {
        $uri = $_SERVER['REQUEST_URI'];
        if (preg_match('/notifications\/(\d+)\/read/', $uri, $matches)) {
            $notifId = $matches[1];
            $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?");
            $stmt->execute(array($notifId, $userId));
            sendResponse(array("message" => "Notification marked as read"));
        }
    }
} catch (PDOException $e) {
    debugLog("Notifications API Error: " . $e->getMessage());
    sendResponse(array("message" => "Database error: " . $e->getMessage()), 500);
}
?>