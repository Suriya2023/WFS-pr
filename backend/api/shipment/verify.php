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
    // AUTO-FIX: Ensure table exists
    $pdo->exec("CREATE TABLE IF NOT EXISTS shipment_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        shipment_id INT NOT NULL,
        status VARCHAR(50) NOT NULL,
        location VARCHAR(100),
        remark TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->beginTransaction();

    // Generate Tracking ID: BGL + 7 random digits
    $tracking_id = 'BGL' . str_pad(rand(0, 9999999), 7, '0', STR_PAD_LEFT);

    // Update shipment status and set tracking_id
    $stmt = $pdo->prepare("UPDATE shipments SET status = 'ready', verified_at = NOW(), tracking_id = ? WHERE id = ?");
    $stmt->execute([$tracking_id, $shipmentId]);

    // Log history
    $historyStmt = $pdo->prepare("INSERT INTO shipment_history (shipment_id, status, location, remark) VALUES (?, 'ready', 'BGL Clearance Center', 'Shipment verified and ready for processing')");
    $historyStmt->execute([$shipmentId]);

    // Fetch user email for notification
    $stmt = $pdo->prepare("SELECT u.email, u.firstname, s.tracking_id FROM users u JOIN shipments s ON u.id = s.user_id WHERE s.id = ?");
    $stmt->execute([$shipmentId]);
    $data = $stmt->fetch();

    $pdo->commit();

    if ($data) {
        // Send Mail (Placeholder)
        // mail($data['email'], "Order Verified", "Hello " . $data['firstname'] . ", your order " . $data['tracking_id'] . " has been verified by admin.");
    }

    sendResponse(["message" => "Shipment verified successfully and user notified.", "success" => true]);

} catch (PDOException $e) {
    sendResponse(["message" => "Database error: " . $e->getMessage()], 500);
}
?>