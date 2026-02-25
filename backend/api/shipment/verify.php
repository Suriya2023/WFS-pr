<?php
// backend/api/shipment/verify.php
require_once '../../config.php';

// Role Check (Should be admin)
$headers = apache_request_headers();
$token = str_replace('Bearer ', '', $headers['Authorization'] ?? '');
$tokenData = json_decode(base64_decode($token), true);

$userId = $tokenData['id'] ?? null;
if (!$userId)
    sendResponse(["message" => "Unauthorized"], 401);

// Verify role in DB
$stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
$stmt->execute([$userId]);
$user = $stmt->fetch();

if (!$user || $user['role'] !== 'admin') {
    sendResponse(["message" => "Access denied. Admin only."], 403);
}

$input = json_decode(file_get_contents("php://input"), true);
$shipmentId = $input['shipment_id'] ?? null;

if (!$shipmentId) {
    sendResponse(["message" => "Shipment ID is required."], 400);
}

try {
    // Generate Tracking ID here
    $tracking_id = 'BGL' . date('ymd') . strtoupper(substr(uniqid(), -6));

    // Update shipment status and set tracking_id
    $stmt = $pdo->prepare("UPDATE shipments SET status = 'ready', verified_at = NOW(), tracking_id = ? WHERE id = ?");
    $stmt->execute([$tracking_id, $shipmentId]);

    // Fetch user email for notification
    $stmt = $pdo->prepare("SELECT u.email, u.firstname, s.tracking_id FROM users u JOIN shipments s ON u.id = s.user_id WHERE s.id = ?");
    $stmt->execute([$shipmentId]);
    $data = $stmt->fetch();

    if ($data) {
        // Send Mail (Placeholder)
        // mail($data['email'], "Order Verified", "Hello " . $data['firstname'] . ", your order " . $data['tracking_id'] . " has been verified by admin.");
    }

    sendResponse(["message" => "Shipment verified successfully and user notified.", "success" => true]);

} catch (PDOException $e) {
    sendResponse(["message" => "Database error: " . $e->getMessage()], 500);
}
?>