<?php
// backend/api/notifications.php
require_once '../config.php';

$token = verifyToken();
if (!$token) {
    sendResponse(["message" => "Unauthorized"], 401);
}

$tokenData = json_decode(base64_decode($token), true);
$userId = $tokenData['id'] ?? null;

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $stmt = $pdo->prepare("SELECT id as _id, title, message, type, isRead, createdAt FROM notifications WHERE user_id = ? ORDER BY createdAt DESC LIMIT 20");
        $stmt->execute([$userId]);
        $notifications = $stmt->fetchAll();
        sendResponse($notifications);
    } elseif ($method === 'PUT') {
        // Mark as read (e.g., api/notifications.php?id=1)
        // Note: Frontend uses /api/notifications/${id}/read
        // Since we use .htaccess for extensionless, we need to handle the ID

        $uri = $_SERVER['REQUEST_URI'];
        if (preg_match('/notifications\/(\d+)\/read/', $uri, $matches)) {
            $notifId = $matches[1];
            $stmt = $pdo->prepare("UPDATE notifications SET isRead = 1 WHERE id = ? AND user_id = ?");
            $stmt->execute([$notifId, $userId]);
            sendResponse(["message" => "Notification marked as read"]);
        }
    }
} catch (PDOException $e) {
    sendResponse(["message" => "Database error: " . $e->getMessage()], 500);
}
?>