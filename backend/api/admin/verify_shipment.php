<?php
// backend/api/admin/verify_shipment.php
require_once '../../config.php';

$headers = function_exists('apache_request_headers') ? apache_request_headers() : [];
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : (isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) ? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] : '';

if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    sendResponse(["message" => "Unauthorized"], 401);
}

$tokenData = json_decode(base64_decode($matches[1]), true);
$userId = isset($tokenData['id']) ? $tokenData['id'] : null;

if (!$userId) {
    sendResponse(["message" => "Invalid token"], 401);
}

// Always fetch role from DB — don't trust token-stored role
try {
    $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $userRow = $stmt->fetch();
    $role = isset($userRow['role']) ? $userRow['role'] : 'user';
} catch (PDOException $e) {
    sendResponse(["message" => "DB error during auth"], 500);
}

if ($role !== 'admin') {
    sendResponse(["message" => "Forbidden: Admins only"], 403);
}

$input = json_decode(file_get_contents("php://input"), true);
$shipmentId = isset($input['shipment_id']) ? $input['shipment_id'] : null;

if (!$shipmentId) {
    sendResponse(["message" => "Shipment ID required"], 400);
}

try {
    // Check if already verified
    $stmt = $pdo->prepare("SELECT tracking_id, status FROM shipments WHERE id = ?");
    $stmt->execute([$shipmentId]);
    $shipment = $stmt->fetch();

    if (!$shipment) {
        sendResponse(["message" => "Shipment not found"], 404);
    }

    if ($shipment['tracking_id']) {
        sendResponse(["message" => "Shipment already verified. ID: " . $shipment['tracking_id']], 400);
    }

    // Generate BGL Tracking ID
    $newTrackingId = "BGL" . date('ymd') . strtoupper(substr(uniqid(), -4));

    // Update Shipment
    $stmt = $pdo->prepare("UPDATE shipments SET tracking_id = ?, status = 'ready', verified_at = CURRENT_TIMESTAMP WHERE id = ?");
    $stmt->execute([$newTrackingId, $shipmentId]);

    sendResponse([
        "success" => true,
        "message" => "Shipment verified successfully.",
        "tracking_id" => $newTrackingId,
        "status" => "ready"
    ]);

} catch (PDOException $e) {
    sendResponse(["message" => "Database error: " . $e->getMessage()], 500);
}