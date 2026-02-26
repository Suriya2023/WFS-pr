<?php
// backend/api/shipment/update_status.php
require_once '../../config.php';

$input = json_decode(file_get_contents("php://input"), true);
$shipmentId = isset($input['shipment_id']) ? $input['shipment_id'] : null;
$newStatus = isset($input['status']) ? $input['status'] : null; // e.g., 'ready', 'packed', 'cancelled'

if (!$shipmentId || !$newStatus) {
    sendResponse(["message" => "Shipment ID and logic required"], 400);
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

    $stmt = $pdo->prepare("UPDATE shipments SET status = ? WHERE id = ?");
    $stmt->execute([$newStatus, $shipmentId]);

    // Log the change in history
    $location = isset($input['location']) ? $input['location'] : 'BGL Hub';
    $remark = isset($input['remark']) ? $input['remark'] : "Shipment status changed to " . ucfirst($newStatus);

    $historyStmt = $pdo->prepare("INSERT INTO shipment_history (shipment_id, status, location, remark) VALUES (?, ?, ?, ?)");
    $historyStmt->execute([$shipmentId, $newStatus, $location, $remark]);

    $pdo->commit();
    sendResponse(["message" => "Status updated to $newStatus", "success" => true]);
} catch (PDOException $e) {
    if ($pdo->inTransaction())
        $pdo->rollBack();
    sendResponse(["message" => "Error: " . $e->getMessage()], 500);
}
?>