<?php
// backend/api/shipment/list.php
require_once __DIR__ . '/../../config.php';

$token = verifyToken();
if (!$token) {
    sendResponse(array("message" => "Unauthorized"), 401);
}

$tokenData = json_decode(base64_decode($token), true);
$userId = isset($tokenData['id']) ? $tokenData['id'] : null;

if (!$userId) {
    sendResponse(array("message" => "Unauthorized"), 401);
}

try {
    $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute(array($userId));
    $user = $stmt->fetch();

    if (!$user) {
        sendResponse(array("message" => "User account not found."), 404);
    }

    $viewAll = isset($_GET['all']) && $_GET['all'] === 'true' && $user['role'] === 'admin';
    $targetUserId = isset($_GET['user_id']) ? $_GET['user_id'] : $userId;

    if ($viewAll) {
        $stmt = $pdo->prepare("SELECT s.*, u.email as creator_email, u.firstname, u.lastname
                             FROM shipments s
                             JOIN users u ON s.user_id = u.id
                             ORDER BY s.created_at DESC");
        $stmt->execute();
    } else {
        if ($user['role'] !== 'admin') {
            $targetUserId = $userId;
        }

        $stmt = $pdo->prepare("SELECT s.*, u.email as creator_email, u.firstname, u.lastname
                             FROM shipments s
                             JOIN users u ON s.user_id = u.id
                             WHERE s.user_id = ?
                             ORDER BY s.created_at DESC");
        $stmt->execute(array($targetUserId));
    }

    $shipments = $stmt->fetchAll();

    foreach ($shipments as &$s) {
        $s['_id'] = $s['id'];
    }

    sendResponse($shipments);

} catch (PDOException $e) {
    debugLog("Shipment List API Error: " . $e->getMessage());
    sendResponse(array("message" => "Error: " . $e->getMessage()), 500);
}
?>