<?php
// backend/api/manifest/create.php
require_once '../../config.php';

$input = json_decode(file_get_contents("php://input"), true);
$shipmentIds = isset($input['shipment_ids']) ? $input['shipment_ids'] : []; // Array of IDs

if (empty($shipmentIds)) {
    sendResponse(["message" => "No shipments selected for manifesting"], 400);
}

$manifestCode = "MAN-" . strtoupper(uniqid());

try {
    $pdo->beginTransaction();

    // 1. Create Manifest record
    $stmt = $pdo->prepare("INSERT INTO manifests (manifest_code, total_parcels) VALUES (?, ?)");
    $stmt->execute([$manifestCode, count($shipmentIds)]);
    $manifestId = $pdo->lastInsertId();

    // 2. Update Shipments status and link manifest
    $placeholders = implode(',', array_fill(0, count($shipmentIds), '?'));
    $sql = "UPDATE shipments SET status = 'manifested', manifest_id = ? WHERE id IN ($placeholders)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(array_merge([$manifestId], $shipmentIds));

    $pdo->commit();
    sendResponse(["message" => "Manifest created successfully: $manifestCode", "manifest_id" => $manifestId], 201);

} catch (PDOException $e) {
    $pdo->rollBack();
    sendResponse(["message" => "Error: " . $e->getMessage()], 500);
}
?>
