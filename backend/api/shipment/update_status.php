<?php
// backend/api/shipment/update_status.php
require_once '../../config.php';

$input = json_decode(file_get_contents("php://input"), true);
$shipmentId = $input['shipment_id'] ?? null;
$newStatus = $input['status'] ?? null; // e.g., 'ready', 'packed', 'cancelled'

if (!$shipmentId || !$newStatus) {
    sendResponse(["message" => "Shipment ID and logic required"], 400);
}

try {
    $stmt = $pdo->prepare("UPDATE shipments SET status = ? WHERE id = ?");
    $stmt->execute([$newStatus, $shipmentId]);

    // Log the change (Audit Log placeholder)
    
    sendResponse(["message" => "Status updated to $newStatus", "success" => true]);
} catch (PDOException $e) {
    sendResponse(["message" => "Error: " . $e->getMessage()], 500);
}
?>
