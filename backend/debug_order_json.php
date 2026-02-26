<?php
// d:\WFS\htdocs\WFS-pr\backend\debug_order_json.php
require_once 'config.php';
$token = generateToken(1); // Assuming user 1
$orderId = isset($_GET['id']) ? $_GET['id'] : 1;

$url = "http://localhost/WFS-pr/backend/api/orders.php?id=" . $orderId;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    "Authorization: Bearer " . $token
));
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

$response = curl_exec($ch);
curl_close($ch);

header('Content-Type: application/json');
echo $response;
?>