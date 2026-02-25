<?php
// backend/migrate_v2.php
require_once 'config.php';
header('Content-Type: text/plain');

try {
    // 1. Create user_addresses table
    $pdo->exec("CREATE TABLE IF NOT EXISTS user_addresses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        address1 TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        pincode VARCHAR(20),
        country VARCHAR(100) DEFAULT 'India',
        isDefault TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )");
    echo "user_addresses table ensured.\n";

    // 2. Ensure users table columns
    $userCols = [
        'company_name' => "VARCHAR(255) DEFAULT NULL",
        'gst_number' => "VARCHAR(20) DEFAULT NULL",
        'pan_number' => "VARCHAR(20) DEFAULT NULL",
        'aadhaar_number' => "VARCHAR(20) DEFAULT NULL",
        'shipping_margin' => "DECIMAL(10, 2) DEFAULT 0.00",
        'billing_address' => "TEXT DEFAULT NULL",
        'billing_city' => "VARCHAR(100) DEFAULT NULL",
        'billing_state' => "VARCHAR(100) DEFAULT NULL",
        'billing_pincode' => "VARCHAR(20) DEFAULT NULL",
        'billing_country' => "VARCHAR(100) DEFAULT 'India'"
    ];

    foreach ($userCols as $col => $def) {
        try {
            $pdo->exec("ALTER TABLE users ADD COLUMN $col $def");
            echo "Added column $col to users.\n";
        } catch (Exception $e) {
            // Probably already exists
        }
    }

    // 3. Fix notifications table
    try {
        $pdo->exec("ALTER TABLE notifications ADD COLUMN type VARCHAR(50) DEFAULT 'info' AFTER message");
        echo "Added type to notifications.\n";
    } catch (Exception $e) {
    }

    // Check for isRead/createdAt presence and rename if needed
    $stmt = $pdo->query("DESCRIBE notifications");
    $cols = $stmt->fetchAll(PDO::FETCH_COLUMN);
    if (in_array('is_read', $cols) && !in_array('isRead', $cols)) {
        $pdo->exec("ALTER TABLE notifications CHANGE is_read isRead TINYINT(1) DEFAULT 0");
        echo "Renamed is_read to isRead.\n";
    }
    if (in_array('created_at', $cols) && !in_array('createdAt', $cols)) {
        $pdo->exec("ALTER TABLE notifications CHANGE created_at createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
        echo "Renamed created_at to createdAt.\n";
    }

    // 4. Ensure shipments table has all columns for create.php
    $shipmentCols = [
        'pickup_address_id' => "INT DEFAULT NULL",
        'consignee_name' => "VARCHAR(255)",
        'consignee_phone' => "VARCHAR(20)",
        'consignee_address' => "TEXT",
        'consignee_city' => "VARCHAR(100)",
        'consignee_state' => "VARCHAR(100)",
        'consignee_pincode' => "VARCHAR(20)",
        'consignee_email' => "VARCHAR(150)",
        'pickup_name' => "VARCHAR(100)",
        'pickup_phone' => "VARCHAR(20)",
        'pickup_address' => "TEXT",
        'pickup_city' => "VARCHAR(100)",
        'pickup_state' => "VARCHAR(100)",
        'pickup_pincode' => "VARCHAR(20)",
        'deadWeight' => "DECIMAL(10, 2)",
        'shippingCost' => "DECIMAL(15, 2)",
        'courierPartner' => "VARCHAR(100)",
        'payment_mode' => "VARCHAR(50)",
        'payment_id' => "VARCHAR(100)",
        'payment_order_id' => "VARCHAR(100)",
        'payment_signature' => "VARCHAR(255)",
        'items' => "TEXT",
        'destination_country' => "VARCHAR(100)"
    ];

    foreach ($shipmentCols as $col => $def) {
        try {
            $pdo->exec("ALTER TABLE shipments ADD COLUMN $col $def");
            echo "Added column $col to shipments.\n";
        } catch (Exception $e) {
        }
    }

    // 5. Ensure manifests table has status
    try {
        $pdo->exec("ALTER TABLE manifests ADD COLUMN status ENUM('open', 'closed', 'picked', 'Completed') DEFAULT 'open'");
        echo "Ensured status in manifests.\n";
    } catch (Exception $e) {
    }

    echo "Migration completed successfully.\n";

} catch (Exception $e) {
    echo "Migration Error: " . $e->getMessage() . "\n";
}
?>