<?php
// backend/api/pickup/request.php
require_once '../../config.php';

$input = json_decode(file_get_contents("php://input"), true);
$manifestId = $input['manifest_id'] ?? null;
$pickupDate = $input['pickup_date'] ?? date('Y-m-d');

if (!$manifestId) {
    sendResponse(["message" => "Manifest ID is required"], 400);
}

try {
    $stmt = $pdo->prepare("INSERT INTO pickup_requests (manifest_id, pickup_date, status) VALUES (?, ?, 'scheduled')");
    $stmt->execute([$manifestId, $pickupDate]);

    // Optional: Update shipments to 'picked' status early or wait for courier update
    
    sendResponse(["message" => "Pickup scheduled successfully for manifest #$manifestId", "success" => true], 201);
} catch (PDOException $e) {
    sendResponse(["message" => "Error: " . $e->getMessage()], 500);
}
?>
