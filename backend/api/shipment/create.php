<?php
// backend/api/shipment/create.php
require_once __DIR__ . '/../../config.php';

// Auth Check
$authHeader = '';
if (function_exists('apache_request_headers')) {
    $headers = apache_request_headers();
    $authHeader = $headers['Authorization'] ?? '';
}
if (!$authHeader) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
}

if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    sendResponse(["message" => "Unauthorized - No token found"], 401);
}

$tokenData = json_decode(base64_decode($matches[1]), true);
$userId = $tokenData['id'] ?? null;
$role = $tokenData['role'] ?? 'user';

if (!$userId) {
    sendResponse(["message" => "Unauthorized - Invalid token data"], 401);
}

// LOG INPUT FOR DEBUGGING
$rawInput = file_get_contents("php://input");
debugLog("CREATE SHIPMENT INPUT: " . $rawInput);

$input = json_decode($rawInput, true);
if (!$input) {
    sendResponse(["message" => "Empty payload"], 400);
}

// Allow Admin to create for specific user
if (isset($input['admin_user_id']) && $role === 'admin') {
    $userId = $input['admin_user_id'];
}

$consignee = $input['consignee'] ?? [];
$consignee_name = trim(($consignee['firstName'] ?? '') . ' ' . ($consignee['lastName'] ?? ''));
$consignee_phone = $consignee['mobile'] ?? '';
$consignee_address = $consignee['address1'] ?? '';
$destination_country = $consignee['country'] ?? 'India';

$deadWeight = floatval($input['deadWeight'] ?? $input['weight'] ?? 0);
$shippingCost = floatval($input['shippingCost'] ?? 0);
$courierPartner = $input['courierPartner'] ?? '';
$pickup_address_id = $input['pickupAddressId'] ?? null;
if ($pickup_address_id === '')
    $pickup_address_id = null;

$payment_id = $input['paymentId'] ?? $input['payment_id'] ?? null;
if ($payment_id === '')
    $payment_id = null;

$payment_order_id = $input['paymentOrderId'] ?? $input['payment_order_id'] ?? null;
if ($payment_order_id === '')
    $payment_order_id = null;

$payment_signature = $input['paymentSignature'] ?? $input['payment_signature'] ?? null;
if ($payment_signature === '')
    $payment_signature = null;

$items = json_encode($input['items'] ?? []);
$status = $input['status'] ?? 'draft';

try {
    $pdo->beginTransaction();

    if (($input['paymentMode'] ?? '') === 'Wallet' && $shippingCost > 0) {
        $stmt = $pdo->prepare("SELECT wallet_balance FROM users WHERE id = ? FOR UPDATE");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();

        if (!$user || $user['wallet_balance'] < $shippingCost) {
            $pdo->rollBack();
            sendResponse(["message" => "Insufficient wallet balance."], 400);
        }

        $stmt = $pdo->prepare("UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?");
        $stmt->execute([$shippingCost, $userId]);

        $stmt = $pdo->prepare("INSERT INTO transactions (user_id, amount, type, description, status) VALUES (?, ?, 'debit', 'Shipment payment (Wallet)', 'success')");
        $stmt->execute([$userId, $shippingCost]);
    }

    // Populate redundant columns for compatibility with different dashboard versions
    $sql = "INSERT INTO shipments (
        user_id, pickup_address_id, tracking_id, 
        consignee_name, consignee_phone, consignee_address,
        consignee_city, consignee_state, consignee_pincode, consignee_email,
        receiver_name, receiver_mobile, receiver_address,
        pickup_name, pickup_phone, pickup_address, pickup_city, pickup_state, pickup_pincode,
        destination_country, deadWeight, weight, shippingCost, total_amount,
        courierPartner, payment_mode, payment_id, payment_order_id, payment_signature, items, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $pickupDetails = $input['pickupDetails'] ?? [];
    $totalAmountValue = floatval($input['totalAmount'] ?? $input['total_amount'] ?? ($shippingCost * 1.18));

    // DEBUG: Final Params check
    $params = [
        $userId,
        $pickup_address_id,
        null, // tracking_id is null until admin verification
        $consignee_name,
        $consignee_phone,
        $consignee_address,
        $consignee['city'] ?? '',
        $consignee['state'] ?? '',
        $consignee['pincode'] ?? '',
        $consignee['email'] ?? '',
        $consignee_name,
        $consignee_phone,
        $consignee_address,
        $pickupDetails['name'] ?? '',
        $pickupDetails['phone'] ?? '',
        $pickupDetails['address'] ?? '',
        $pickupDetails['city'] ?? '',
        $pickupDetails['state'] ?? '',
        $pickupDetails['pincode'] ?? '',
        $destination_country,
        $deadWeight,
        $deadWeight,
        $shippingCost,
        $totalAmountValue,
        $courierPartner,
        $input['paymentMode'] ?? 'Prepaid',
        $payment_id,
        $payment_order_id,
        $payment_signature,
        $items,
        $status
    ];

    debugLog("INSERT PARAMS COUNT: " . count($params));

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $shipmentId = $pdo->lastInsertId();
    $pdo->commit();

    sendResponse([
        "message" => "Shipment created successfully.",
        "status" => $status,
        "_id" => $shipmentId
    ], 201);

} catch (PDOException $e) {
    $err = $e->getMessage();
    debugLog("CREATE SHIPMENT SQL ERROR: " . $err);
    if ($pdo && $pdo->inTransaction()) {
        try {
            $pdo->rollBack();
        } catch (Exception $rbEx) {
            debugLog("Rollback failed: " . $rbEx->getMessage());
        }
    }
    sendResponse(["message" => "Database Error: " . $err], 500);
} catch (Exception $e) {
    debugLog("CREATE SHIPMENT GENERAL ERROR: " . $e->getMessage());
    if ($pdo && $pdo->inTransaction()) {
        try {
            $pdo->rollBack();
        } catch (Exception $rbEx) {
        }
    }
    sendResponse(["message" => "General Error: " . $e->getMessage()], 500);
}
?>