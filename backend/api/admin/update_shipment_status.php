<?php
// backend/api/admin/update_shipment_status.php
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

// Always fetch role from DB — don't trust token-stored role (supports old tokens)
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
$newStatus = isset($input['status']) ? $input['status'] : null;

if (!$shipmentId || !$newStatus) {
    sendResponse(["message" => "Shipment ID and Status required"], 400);
}

// Valid transitions
$validStatuses = ['draft', 'ready', 'packed', 'manifested', 'dispatched', 'received', 'cancelled', 'blocked'];
if (!in_array($newStatus, $validStatuses)) {
    sendResponse(["message" => "Invalid status: $newStatus"], 400);
}

try {
    $stmt = $pdo->prepare("UPDATE shipments SET status = ? WHERE id = ?");
    $stmt->execute([$newStatus, $shipmentId]);

    sendResponse([
        "success" => true,
        "message" => "Status updated to " . ucfirst($newStatus),
        "status" => $newStatus
    ]);
} catch (PDOException $e) {
    sendResponse(["message" => "Database error: " . $e->getMessage()], 500);
}