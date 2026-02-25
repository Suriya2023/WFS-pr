<?php
// backend/migrate_v4.php
require_once 'config.php';
header('Content-Type: text/plain');

try {
    // 1. Ensure transactions table has correct structure
    $pdo->exec("CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        type ENUM('credit', 'debit') NOT NULL,
        description VARCHAR(255),
        status ENUM('pending', 'success', 'failed') DEFAULT 'success',
        gateway_id VARCHAR(100) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )");
    echo "Transactions table ensured.\n";

    // 2. Double check shipments columns for nullable/defaults
    // We already saw the columns exist, but let's make sure things like payment_id can be null
    $pdo->exec("ALTER TABLE shipments MODIFY COLUMN payment_id VARCHAR(100) DEFAULT NULL");
    $pdo->exec("ALTER TABLE shipments MODIFY COLUMN payment_order_id VARCHAR(100) DEFAULT NULL");
    $pdo->exec("ALTER TABLE shipments MODIFY COLUMN payment_signature VARCHAR(255) DEFAULT NULL");
    $pdo->exec("ALTER TABLE shipments MODIFY COLUMN items LONGTEXT DEFAULT NULL");
    $pdo->exec("ALTER TABLE shipments MODIFY COLUMN courierPartner VARCHAR(100) DEFAULT NULL");

    // Add dimensions if missed in a clean way (though it exists)
    try {
        $pdo->exec("ALTER TABLE shipments ADD COLUMN IF NOT EXISTS dimensions VARCHAR(50) DEFAULT NULL");
    } catch (Exception $e) {
    }

    echo "Shipment column constraints updated.\n";

    // 3. Fix potential transaction status enum mismatch
    // If 'success' isn't in the enum, add it.
    try {
        $pdo->exec("ALTER TABLE transactions MODIFY COLUMN status ENUM('pending', 'success', 'failed') DEFAULT 'success'");
    } catch (Exception $e) {
    }

    echo "Migration V4 completed successfully.\n";

} catch (Exception $e) {
    echo "Migration Error: " . $e->getMessage() . "\n";
}
?>