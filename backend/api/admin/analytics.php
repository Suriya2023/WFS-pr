<?php
// backend/api/admin/analytics.php
require_once __DIR__ . '/../../config.php';

$token = verifyToken();
if (!$token) {
    sendResponse(array("message" => "Unauthorized access."), 401);
}

$tokenData = json_decode(base64_decode($token), true);
$userId = isset($tokenData['id']) ? $tokenData['id'] : null;

try {
    $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute(array($userId));
    $user = $stmt->fetch();

    if (!$user || $user['role'] !== 'admin') {
        sendResponse(array("message" => "Access restricted to admin only."), 403);
    }

    $uCount = $pdo->query("SELECT COUNT(*) FROM users WHERE role != 'admin'")->fetchColumn();
    $sCount = $pdo->query("SELECT COUNT(*) FROM shipments")->fetchColumn();
    $dispatchedCount = $pdo->query("SELECT COUNT(*) FROM shipments WHERE status = 'dispatched'")->fetchColumn();
    $csbCount = $pdo->query("SELECT COUNT(*) FROM shipments WHERE destination_country != 'India' AND destination_country != ''")->fetchColumn();

    $manifestCount = 0;
    $check = $pdo->query("SHOW TABLES LIKE 'manifests'")->fetch();
    if ($check) {
        $manifestCount = $pdo->query("SELECT COUNT(*) FROM manifests")->fetchColumn();
    }

    $pickupCount = $pdo->query("SELECT COUNT(*) FROM shipments WHERE status = 'ready' OR status = 'paid'")->fetchColumn();

    sendResponse(array(
        "totalUsers" => (int) $uCount,
        "totalShipments" => (int) $sCount,
        "dispatchedOrders" => (int) $dispatchedCount,
        "csbOrders" => (int) $csbCount,
        "totalManifests" => (int) $manifestCount,
        "activePickups" => (int) $pickupCount
    ));

} catch (PDOException $e) {
    debugLog("Analytics API Database Error: " . $e->getMessage());
    sendResponse(array("message" => "Database error: " . $e->getMessage()), 500);
} catch (Exception $e) {
    debugLog("Analytics API General Error: " . $e->getMessage());
    sendResponse(array("message" => "General error: " . $e->getMessage()), 500);
}
?>