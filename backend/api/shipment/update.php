<?php
// backend/api/shipment/update.php
require_once '../../config.php';

// Safe error reporting
ini_set('display_errors', 0);

$token = verifyToken();
if (!$token) {
    sendResponse(array("message" => "Unauthorized"), 401);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    if (!$id) {
        sendResponse(array("message" => "ID required"), 400);
    }
    try {
        $stmt = $pdo->prepare("SELECT s.*, 
                               COALESCE(s.pickup_name, a.name) as pickup_name,
                               COALESCE(s.pickup_phone, a.phone) as pickup_phone,
                               COALESCE(s.pickup_address, a.address1) as pickup_address,
                               COALESCE(s.pickup_city, a.city) as pickup_city,
                               COALESCE(s.pickup_state, a.state) as pickup_state,
                               COALESCE(s.pickup_pincode, a.pincode) as pickup_pincode
                               FROM shipments s 
                               LEFT JOIN user_addresses a ON s.pickup_address_id = a.id
                               WHERE s.id = ?");
        $stmt->execute(array($id));
        $shipment = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$shipment) {
            sendResponse(array("message" => "Shipment not found"), 404);
        }
        sendResponse($shipment);
    } catch (PDOException $e) {
        sendResponse(array("message" => "Database error: " . $e->getMessage()), 500);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(array("message" => "Method not allowed"), 405);
}

$id = isset($_GET['id']) ? $_GET['id'] : null;
$rawInput = file_get_contents("php://input");
$input = json_decode($rawInput, true);

if (!$id) {
    sendResponse(array("message" => "ID required"), 400);
}

try {
    // Consignee details
    $consignee = isset($input['consignee']) ? $input['consignee'] : array();
    $firstName = isset($consignee['firstName']) ? $consignee['firstName'] : '';
    $lastName = isset($consignee['lastName']) ? $consignee['lastName'] : '';
    $name = trim($firstName . ' ' . $lastName);
    $phone = isset($consignee['mobile']) ? $consignee['mobile'] : '';
    $address = isset($consignee['address1']) ? $consignee['address1'] : '';
    $country = isset($consignee['country']) ? $consignee['country'] : '';

    $deadWeight = isset($input['deadWeight']) ? $input['deadWeight'] : 0;
    $items = json_encode(isset($input['items']) ? $input['items'] : array());
    $status = isset($input['status']) ? $input['status'] : 'draft';

    $pickup_id = isset($input['pickupAddressId']) ? $input['pickupAddressId'] : null;
    if ($pickup_id === '')
        $pickup_id = null;

    $sql = "UPDATE shipments SET 
            pickup_address_id = ?,
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

    $pickupDetails = isset($input['pickupDetails']) ? $input['pickupDetails'] : array();

    $shippingCost = isset($input['shippingCost']) ? floatval($input['shippingCost']) : 0;
    $totalAmount = isset($input['totalAmount']) ? floatval($input['totalAmount']) : (isset($input['total_amount']) ? floatval($input['total_amount']) : ($shippingCost * 1.18));

    $params = array(
        $pickup_id,
        $name,
        $phone,
        $address,
        isset($consignee['city']) ? $consignee['city'] : '',
        isset($consignee['state']) ? $consignee['state'] : '',
        isset($consignee['pincode']) ? $consignee['pincode'] : '',
        isset($consignee['email']) ? $consignee['email'] : '',
        $country,
        $deadWeight,
        $items,
        $status,
        $name,
        $phone,
        $address,
        isset($pickupDetails['name']) ? $pickupDetails['name'] : '',
        isset($pickupDetails['phone']) ? $pickupDetails['phone'] : '',
        isset($pickupDetails['address']) ? $pickupDetails['address'] : '',
        isset($pickupDetails['city']) ? $pickupDetails['city'] : '',
        isset($pickupDetails['state']) ? $pickupDetails['state'] : '',
        isset($pickupDetails['pincode']) ? $pickupDetails['pincode'] : '',
        isset($input['paymentMode']) ? $input['paymentMode'] : 'Prepaid',
        isset($input['weight']) ? $input['weight'] : $deadWeight,
        $shippingCost,
        $totalAmount,
        isset($input['paymentId']) ? $input['paymentId'] : null,
        isset($input['paymentOrderId']) ? $input['paymentOrderId'] : null,
        isset($input['paymentSignature']) ? $input['paymentSignature'] : null,
        isset($input['courierPartner']) ? $input['courierPartner'] : null,
        $id
    );

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    sendResponse(array("message" => "Shipment updated successfully", "success" => true));
} catch (PDOException $e) {
    sendResponse(array("message" => "Error: " . $e->getMessage()), 500);
}
?>