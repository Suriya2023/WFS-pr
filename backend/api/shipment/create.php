<?php
// backend/api/shipment/create.php
require_once __DIR__ . '/../../config.php';

// Auth Check
$authHeader = '';
if (function_exists('apache_request_headers')) {
    $headers = apache_request_headers();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
}
if (!$authHeader) {
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }
}

if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    sendResponse(array("message" => "Unauthorized - No token found"), 401);
}

$tokenData = json_decode(base64_decode($matches[1]), true);
$userId = isset($tokenData['id']) ? $tokenData['id'] : null;
$role = isset($tokenData['role']) ? $tokenData['role'] : 'user';

if (!$userId) {
    sendResponse(array("message" => "Unauthorized - Invalid token data"), 401);
}

// LOG INPUT FOR DEBUGGING
$rawInput = file_get_contents("php://input");
debugLog("CREATE SHIPMENT INPUT: " . $rawInput);

$input = json_decode($rawInput, true);
if (!$input) {
    sendResponse(array("message" => "Empty payload"), 400);
}

// Allow Admin to create for specific user
if (isset($input['admin_user_id']) && $role === 'admin') {
    $userId = $input['admin_user_id'];
}

$consignee = isset($input['consignee']) ? $input['consignee'] : array();
$firstName = isset($consignee['firstName']) ? $consignee['firstName'] : '';
$lastName = isset($consignee['lastName']) ? $consignee['lastName'] : '';
$consignee_name = trim($firstName . ' ' . $lastName);
$consignee_phone = isset($consignee['mobile']) ? $consignee['mobile'] : '';
$consignee_address = isset($consignee['address1']) ? $consignee['address1'] : '';
$destination_country = isset($consignee['country']) ? $consignee['country'] : 'India';

$deadWeight = floatval(isset($input['deadWeight']) ? $input['deadWeight'] : (isset($input['weight']) ? $input['weight'] : 0));
$shippingCost = floatval(isset($input['shippingCost']) ? $input['shippingCost'] : 0);
$courierPartner = isset($input['courierPartner']) ? $input['courierPartner'] : '';
$pickup_address_id = isset($input['pickupAddressId']) ? $input['pickupAddressId'] : null;
if ($pickup_address_id === '')
    $pickup_address_id = null;

$payment_id = isset($input['paymentId']) ? $input['paymentId'] : (isset($input['payment_id']) ? $input['payment_id'] : null);
if ($payment_id === '')
    $payment_id = null;

$payment_order_id = isset($input['paymentOrderId']) ? $input['paymentOrderId'] : (isset($input['payment_order_id']) ? $input['payment_order_id'] : null);
if ($payment_order_id === '')
    $payment_order_id = null;

$payment_signature = isset($input['paymentSignature']) ? $input['paymentSignature'] : (isset($input['payment_signature']) ? $input['payment_signature'] : null);
if ($payment_signature === '')
    $payment_signature = null;

$itemsArr = isset($input['items']) ? $input['items'] : array();
$items = json_encode($itemsArr);
$status = isset($input['status']) ? $input['status'] : 'draft';

try {
    $pdo->beginTransaction();

    $paymentMode = isset($input['paymentMode']) ? $input['paymentMode'] : '';
    if ($paymentMode === 'Wallet' && $shippingCost > 0) {
        $stmt = $pdo->prepare("SELECT wallet_balance FROM users WHERE id = ? FOR UPDATE");
        $stmt->execute(array($userId));
        $user = $stmt->fetch();

        if (!$user || $user['wallet_balance'] < $shippingCost) {
            $pdo->rollBack();
            sendResponse(array("message" => "Insufficient wallet balance."), 400);
        }

        $stmt = $pdo->prepare("UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?");
        $stmt->execute(array($shippingCost, $userId));

        // Use correct table and column for transaction
        $useWalletTrans = $pdo->query("SHOW TABLES LIKE 'wallet_transactions'")->fetch();
        if ($useWalletTrans) {
            $cols = $pdo->query("DESCRIBE `wallet_transactions`")->fetchAll(PDO::FETCH_COLUMN);
            $descCol = in_array('reason', $cols) ? 'reason' : 'description';
            $stmt = $pdo->prepare("INSERT INTO wallet_transactions (user_id, amount, type, `$descCol`) VALUES (?, ?, 'debit', 'Shipment payment (Wallet)')");
            $stmt->execute(array($userId, $shippingCost));
        } else {
            $cols = $pdo->query("DESCRIBE `transactions`")->fetchAll(PDO::FETCH_COLUMN);
            $descCol = in_array('description', $cols) ? 'description' : 'reason';
            $stmt = $pdo->prepare("INSERT INTO transactions (user_id, amount, type, `$descCol`, status) VALUES (?, ?, 'debit', 'Shipment payment (Wallet)', 'success')");
            $stmt->execute(array($userId, $shippingCost));
        }
    }

    // Populate redundant columns for compatibility
    $sql = "INSERT INTO shipments (
        user_id, pickup_address_id, tracking_id, 
        consignee_name, consignee_phone, consignee_address,
        consignee_city, consignee_state, consignee_pincode, consignee_email,
        receiver_name, receiver_mobile, receiver_address,
        pickup_name, pickup_phone, pickup_address, pickup_city, pickup_state, pickup_pincode,
        destination_country, deadWeight, weight, shippingCost, total_amount,
        courierPartner, payment_mode, payment_id, payment_order_id, payment_signature, items, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $pickupDetails = isset($input['pickupDetails']) ? $input['pickupDetails'] : array();
    $totalAmountValue = floatval(isset($input['totalAmount']) ? $input['totalAmount'] : (isset($input['total_amount']) ? $input['total_amount'] : ($shippingCost * 1.18)));

    $params = array(
        $userId,
        $pickup_address_id,
        null,
        $consignee_name,
        $consignee_phone,
        $consignee_address,
        isset($consignee['city']) ? $consignee['city'] : '',
        isset($consignee['state']) ? $consignee['state'] : '',
        isset($consignee['pincode']) ? $consignee['pincode'] : '',
        isset($consignee['email']) ? $consignee['email'] : '',
        $consignee_name,
        $consignee_phone,
        $consignee_address,
        isset($pickupDetails['name']) ? $pickupDetails['name'] : '',
        isset($pickupDetails['phone']) ? $pickupDetails['phone'] : '',
        isset($pickupDetails['address']) ? $pickupDetails['address'] : '',
        isset($pickupDetails['city']) ? $pickupDetails['city'] : '',
        isset($pickupDetails['state']) ? $pickupDetails['state'] : '',
        isset($pickupDetails['pincode']) ? $pickupDetails['pincode'] : '',
        $destination_country,
        $deadWeight,
        $deadWeight,
        $shippingCost,
        $totalAmountValue,
        $courierPartner,
        $paymentMode ? $paymentMode : 'Prepaid',
        $payment_id,
        $payment_order_id,
        $payment_signature,
        $items,
        $status
    );

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $shipmentId = $pdo->lastInsertId();
    $pdo->commit();

    sendResponse(array(
        "message" => "Shipment created successfully.",
        "status" => $status,
        "_id" => $shipmentId
    ), 201);

} catch (PDOException $e) {
    $err = $e->getMessage();
    debugLog("CREATE SHIPMENT SQL ERROR: " . $err);
    if ($pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    sendResponse(array("message" => "Database Error: " . $err), 500);
} catch (Exception $e) {
    debugLog("CREATE SHIPMENT GENERAL ERROR: " . $e->getMessage());
    if ($pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    sendResponse(array("message" => "General Error: " . $e->getMessage()), 500);
}
?>