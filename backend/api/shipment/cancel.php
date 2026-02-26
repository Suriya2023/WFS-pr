<?php
// backend/api/shipment/cancel.php
require_once __DIR__ . '/../../config.php';

// Auth Check
$authHeader = '';
if (function_exists('apache_request_headers')) {
    $headers = apache_request_headers();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
}
if (!$authHeader) {
    $authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION']) ? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] : '');
}

if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    sendResponse(["message" => "Unauthorized"], 401);
}

$tokenData = json_decode(base64_decode($matches[1]), true);
$userId = isset($tokenData['id']) ? $tokenData['id'] : null;
$role = isset($tokenData['role']) ? $tokenData['role'] : 'user';

if (!$userId)
    sendResponse(["message" => "Unauthorized"], 401);

// Get the AWB/ID from URL if using rewrite, or from input
// For simplicity, we'll check multiple sources
$awb = isset($_GET['awb']) ? $_GET['awb'] : null;
$input = json_decode(file_get_contents("php://input"), true);
$reason = isset($input['reason']) ? $input['reason'] : 'Customer request';

if (!$awb) {
    // Check if it's in the path (api/shipment/{awb}/cancel)
    $uri = $_SERVER['REQUEST_URI'];
    if (preg_match('/\/api\/shipment\/([^\/]+)\/cancel/', $uri, $pathMatches)) {
        $awb = $pathMatches[1];
    }
}

if (!$awb) {
    sendResponse(["message" => "Shipment identifier is missing"], 400);
}

try {
    // 1. Find the shipment by tracking_id OR id
    $stmt = $pdo->prepare("SELECT * FROM shipments WHERE (tracking_id = ? OR id = ?) " . ($role !== 'admin' ? "AND user_id = ?" : ""));
    $params = [$awb, $awb];
    if ($role !== 'admin')
        $params[] = $userId;

    $stmt->execute($params);
    $shipment = $stmt->fetch();

    if (!$shipment) {
        sendResponse(["message" => "Shipment not found or access denied"], 404);
    }

    if ($shipment['status'] === 'cancelled') {
        sendResponse(["message" => "Shipment is already cancelled"], 400);
    }

    // 2. Perform cancellation
    $stmt = $pdo->prepare("UPDATE shipments SET status = 'cancelled' WHERE id = ?");
    $stmt->execute([$shipment['id']]);

    // 3. Log or handle refund if needed (Future improvement)

    sendResponse(["message" => "Shipment cancelled successfully", "success" => true]);

} catch (PDOException $e) {
    sendResponse(["message" => "Database error: " . $e->getMessage()], 500);
}
?>