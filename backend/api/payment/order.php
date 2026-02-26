<?php
// backend/api/payment/order.php
require_once __DIR__ . '/../../config.php';

$input = json_decode(file_get_contents("php://input"), true);
$amount = isset($input['amount']) ? $input['amount'] : 0;
$currency = isset($input['currency']) ? $input['currency'] : 'INR';
$gateway = isset($input['gateway']) ? $input['gateway'] : 'razorpay';

if ($amount <= 0) {
    sendResponse(array("message" => "Invalid amount"), 400);
}

// Razorpay Keys
$keyId = "rzp_test_RxLxOuoJcABUSb";
$keySecret = "GzCyKqhBqNejyE78LB1gmmda";

if ($gateway === 'razorpay') {
    $url = "https://api.razorpay.com/v1/orders";
    $data = array(
        "amount" => $amount * 100, // in paise
        "currency" => $currency,
        "receipt" => "rcpt_" . time()
    );

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_USERPWD, $keyId . ":" . $keySecret);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200) {
        $result = json_decode($response, true);
        $result['key'] = $keyId;
        sendResponse($result);
    } else {
        debugLog("Razorpay Order Failed: " . $response);
        sendResponse(array("message" => "Failed to create payment order."), 500);
    }
} else {
    sendResponse(array("message" => "Gateway not supported"), 400);
}
?>