<?php
// backend/api/payment/order.php
require_once '../../config.php';

$input = json_decode(file_get_contents("php://input"), true);
$amount = $input['amount'] ?? 0;
$currency = $input['currency'] ?? 'INR';
$gateway = $input['gateway'] ?? 'razorpay';

if ($amount <= 0) {
    sendResponse(["message" => "Invalid amount"], 400);
}

// Razorpay Keys from config/env (Using the ones in .env)
$keyId = "rzp_test_RxLxOuoJcABUSb";
$keySecret = "GzCyKqhBqNejyE78LB1gmmda";

if ($gateway === 'razorpay') {
    // Create Razorpay Order via cURL
    $url = "https://api.razorpay.com/v1/orders";
    $data = [
        "amount" => $amount * 100, // in paise
        "currency" => $currency,
        "receipt" => "rcpt_" . time()
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_USERPWD, $keyId . ":" . $keySecret);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200) {
        $result = json_decode($response, true);
        $result['key'] = $keyId; // Pass key back for frontend
        sendResponse($result);
    } else {
        debugLog("Razorpay Order Creation Failed: " . $response);
        sendResponse(["message" => "Failed to create payment order"], 500);
    }
} else {
    sendResponse(["message" => "Gateway not supported"], 400);
}
?>
