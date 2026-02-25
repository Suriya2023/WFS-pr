<?php
// backend/migrate_v6.php
require_once 'config.php';
header('Content-Type: text/plain');

try {
    // 1. Expand column sizes to prevent truncation errors
    $pdo->exec("ALTER TABLE shipments MODIFY COLUMN receiver_name VARCHAR(255) DEFAULT NULL");
    $pdo->exec("ALTER TABLE shipments MODIFY COLUMN consignee_name VARCHAR(255) DEFAULT NULL");
    $pdo->exec("ALTER TABLE shipments MODIFY COLUMN pickup_name VARCHAR(255) DEFAULT NULL");
    echo "Expanded column sizes in shipments.\n";

    // 2. Ensure transactions table has all columns
    try {
        $pdo->exec("ALTER TABLE transactions ADD COLUMN IF NOT EXISTS gateway_id VARCHAR(100) DEFAULT NULL");
    } catch (Exception $e) {
    }

    // 3. Ensure status column in shipments can hold 'pending_payment'
    $pdo->exec("ALTER TABLE shipments MODIFY COLUMN status VARCHAR(50) DEFAULT 'draft'");
    echo "Ensured status column length.\n";

    echo "Migration V6 completed successfully.\n";

} catch (Exception $e) {
    echo "Migration Error: " . $e->getMessage() . "\n";
}
?>