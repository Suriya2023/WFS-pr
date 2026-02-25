<?php
require_once '../../config.php';

// Auth Check using the same logic as config.php's verifyToken()
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
if (!$authHeader && function_exists('apache_request_headers')) {
    $headers = apache_request_headers();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
}

if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    sendResponse(["message" => "Unauthorized"], 401);
}

$token = $matches[1];
$tokenData = json_decode(base64_decode($token), true);
$adminId = $tokenData['id'] ?? null;

if (!$adminId)
    sendResponse(["message" => "Unauthorized"], 401);

// Role check
$stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
$stmt->execute([$adminId]);
$admin = $stmt->fetch();
if (!$admin || $admin['role'] !== 'admin')
    sendResponse(["message" => "Forbidden - Admin access required"], 403);

$input = json_decode(file_get_contents("php://input"), true);
$shipmentId = $input['shipment_id'] ?? $input['id'] ?? $_GET['id'] ?? null;

if (!$shipmentId)
    sendResponse(["message" => "Shipment ID required"], 400);

try {
    $stmt = $pdo->prepare("DELETE FROM shipments WHERE id = ?");
    $stmt->execute([$shipmentId]);

    if ($stmt->rowCount() > 0) {
        sendResponse(["message" => "Shipment deleted successfully", "success" => true]);
    } else {
        sendResponse(["message" => "Shipment not found or already deleted"], 404);
    }
} catch (PDOException $e) {
    sendResponse(["message" => "Database error: " . $e->getMessage()], 500);
}
?>