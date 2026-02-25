<?php
// backend/api/payment/gateway-status.php
require_once '../../config.php';
sendResponse([
    "activeGateway" => "razorpay",
    "razorpay" => [
        "configured" => true,
        "enabled" => true
    ]
]);
?>
