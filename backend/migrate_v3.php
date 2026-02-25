<?php
// backend/migrate_v3.php
require_once 'config.php';
header('Content-Type: text/plain');

try {
    // 1. Fix KYC Details table
    $kycCols = [
        'aadhaar_front' => "VARCHAR(255) DEFAULT NULL",
        'aadhaar_back' => "VARCHAR(255) DEFAULT NULL",
        'pan_card' => "VARCHAR(255) DEFAULT NULL",
        'electricity_bill' => "VARCHAR(255) DEFAULT NULL"
    ];

    foreach ($kycCols as $col => $def) {
        try {
            $pdo->exec("ALTER TABLE kyc_details ADD COLUMN $col $def");
            echo "Added column $col to kyc_details.\n";
        } catch (Exception $e) {
            // Already exists
        }
    }

    // 2. Fix Shipments table (double checking all columns for create.php)
    $shipmentCols = [
        'pickup_address_id' => "INT DEFAULT NULL",
        'consignee_name' => "VARCHAR(255)",
        'consignee_phone' => "VARCHAR(20)",
        'consignee_address' => "TEXT",
        'consignee_city' => "VARCHAR(100)",
        'consignee_state' => "VARCHAR(100)",
        'consignee_pincode' => "VARCHAR(20)",
        'consignee_email' => "VARCHAR(150)",
        'receiver_name' => "VARCHAR(255)",
        'receiver_mobile' => "VARCHAR(20)",
        'receiver_address' => "TEXT",
        'pickup_name' => "VARCHAR(100)",
        'pickup_phone' => "VARCHAR(20)",
        'pickup_address' => "TEXT",
        'pickup_city' => "VARCHAR(100)",
        'pickup_state' => "VARCHAR(100)",
        'pickup_pincode' => "VARCHAR(20)",
        'deadWeight' => "DECIMAL(10, 2)",
        'weight' => "DECIMAL(10, 2)",
        'shippingCost' => "DECIMAL(15, 2)",
        'courierPartner' => "VARCHAR(100)",
        'payment_mode' => "VARCHAR(50)",
        'payment_id' => "VARCHAR(100)",
        'payment_order_id' => "VARCHAR(100)",
        'payment_signature' => "VARCHAR(255)",
        'items' => "TEXT",
        'status' => "VARCHAR(50) DEFAULT 'draft'",
        'destination_country' => "VARCHAR(100)"
    ];

    foreach ($shipmentCols as $col => $def) {
        try {
            $pdo->exec("ALTER TABLE shipments ADD COLUMN $col $def");
            echo "Added column $col to shipments.\n";
        } catch (Exception $e) {
            // Already exists or slightly different def
        }
    }

    echo "Migration V3 completed successfully.\n";

} catch (Exception $e) {
    echo "Migration Error: " . $e->getMessage() . "\n";
}
?>