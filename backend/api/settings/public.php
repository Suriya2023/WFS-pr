<?php
// backend/api/settings/public.php
require_once '../../config.php';
sendResponse([
    "default_item_value" => "1000",
    "shipping_base_price" => "150",
    "shipping_weight_price" => "40"
]);
?>
