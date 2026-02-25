<?php
// backend/api/orders/calculate-payment-preview.php
require_once '../../config.php';

$token = verifyToken();
if (!$token) {
    sendResponse(["message" => "Unauthorized"], 401);
}

$input = json_decode(file_get_contents("php://input"), true);

// Estimate payment logic
// Usually involves GST (18%) and other surcharges.
$shippingCost = $input['shippingCost'] ?? 0;
$gst = round($shippingCost * 0.18, 2);
$total = $shippingCost + $gst;

sendResponse([
    "baseCost" => $shippingCost,
    "gst" => $gst,
    "total" => $total,
    "currency" => "INR"
]);
?>