<?php
// backend/api/shipment/update.php
require_once '../../config.php';

$token = verifyToken();
if (!$token) {
    sendResponse(["message" => "Unauthorized"], 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(["message" => "Method not allowed"], 405);
}

$id = $_GET['id'] ?? null;
$input = json_decode(file_get_contents("php://input"), true);

if (!$id) {
    sendResponse(["message" => "ID required"], 400);
}

try {
    // Consignee details
    $consignee = $input['consignee'] ?? [];
    $name = trim(($consignee['firstName'] ?? '') . ' ' . ($consignee['lastName'] ?? ''));
    $phone = $consignee['mobile'] ?? '';
    $address = $consignee['address1'] ?? '';
    $country = $consignee['country'] ?? '';

    $deadWeight = $input['deadWeight'] ?? 0;
    $items = json_encode($input['items'] ?? []);
    $status = $input['status'] ?? 'draft';

    $sql = "UPDATE shipments SET 
            consignee_name = ?, 
            consignee_phone = ?, 
            consignee_address = ?, 
            consignee_city = ?,
            consignee_state = ?,
            consignee_pincode = ?,
            consignee_email = ?,
            destination_country = ?, 
            deadWeight = ?, 
            items = ?, 
            status = ?,
            receiver_name = ?,
            receiver_mobile = ?,
            receiver_address = ?,
            pickup_name = ?,
            pickup_phone = ?,
            pickup_address = ?,
            pickup_city = ?,
            pickup_state = ?,
            pickup_pincode = ?,
            payment_mode = ?,
            weight = ?,
            shippingCost = ?,
            total_amount = ?,
            payment_id = ?,
            payment_order_id = ?,
            payment_signature = ?,
            courierPartner = ?
            WHERE id = ?";

    $pickupDetails = $input['pickupDetails'] ?? [];

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $name,
        $phone,
        $address,
        $consignee['city'] ?? '',
        $consignee['state'] ?? '',
        $consignee['pincode'] ?? '',
        $consignee['email'] ?? '',
        $country,
        $deadWeight,
        $items,
        $status,
        $name,
        $phone,
        $address,
        $pickupDetails['name'] ?? '',
        $pickupDetails['phone'] ?? '',
        $pickupDetails['address'] ?? '',
        $pickupDetails['city'] ?? '',
        $pickupDetails['state'] ?? '',
        $pickupDetails['pincode'] ?? '',
        $input['paymentMode'] ?? 'Prepaid',
        $input['weight'] ?? $deadWeight,
        $input['shippingCost'] ?? 0,
        $input['totalAmount'] ?? $input['total_amount'] ?? (($input['shippingCost'] ?? 0) * 1.18),
        $input['paymentId'] ?? null,
        $input['paymentOrderId'] ?? null,
        $input['paymentSignature'] ?? null,
        $input['courierPartner'] ?? null,
        $id
    ]);

    sendResponse(["message" => "Shipment updated successfully", "success" => true]);
} catch (PDOException $e) {
    sendResponse(["message" => "Error: " . $e->getMessage()], 500);
}
?>