<?php
require_once 'config.php';
header('Content-Type: text/plain');

try {
    // Add columns to users
    $pdo->exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS company_name VARCHAR(255) DEFAULT NULL AFTER profile_image");
    $pdo->exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS gst_number VARCHAR(20) DEFAULT NULL AFTER company_name");
    $pdo->exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS pan_number VARCHAR(20) DEFAULT NULL AFTER gst_number");
    $pdo->exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS aadhaar_number VARCHAR(20) DEFAULT NULL AFTER pan_number");
    $pdo->exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS shipping_margin DECIMAL(10, 2) DEFAULT 0.00 AFTER aadhaar_number");
    $pdo->exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_address TEXT DEFAULT NULL AFTER shipping_margin");
    $pdo->exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_city VARCHAR(100) DEFAULT NULL AFTER billing_address");
    $pdo->exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_state VARCHAR(100) DEFAULT NULL AFTER billing_city");
    $pdo->exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_pincode VARCHAR(20) DEFAULT NULL AFTER billing_state");
    $pdo->exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_country VARCHAR(100) DEFAULT 'India' AFTER billing_pincode");

    echo "Users table updated.\n";

    // Update notifications table
    $pdo->exec("ALTER TABLE notifications ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'info' AFTER message");

    // Check if isRead and createdAt exist
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

    echo "Notifications table updated.\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
