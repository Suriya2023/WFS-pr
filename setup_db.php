<?php
// ============================================================
// BGL Express — COMPLETE Database Setup Script
// Run once: D:\WFS\php\php.exe d:\WFS\htdocs\WFS-pr\setup_db.php
// OR visit: http://localhost/WFS-pr/setup_db.php
// ============================================================

// Direct DB connection (skip config.php to avoid header issues when running from CLI)
$DB_HOST = 'localhost';
$DB_NAME = 'user_dash_db';
$DB_USER = 'root';
$DB_PASS = '';

try {
    $pdo = new PDO("mysql:host=$DB_HOST;charset=utf8", $DB_USER, $DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("CREATE DATABASE IF NOT EXISTS $DB_NAME");
    $pdo->exec("USE $DB_NAME");
} catch (PDOException $e) {
    die("[FATAL] DB Connection Failed: " . $e->getMessage() . "\n");
}

echo "=== BGL EXPRESS — FULL DATABASE SETUP ===\n\n";

// ============================================================
// OPTION: Pass ?fresh=1 or --fresh to DROP all tables first
// ============================================================
$fresh = false;
if (php_sapi_name() === 'cli') {
    $fresh = in_array('--fresh', isset($argv) ? $argv : []);
} else {
    $fresh = isset($_GET['fresh']) && $_GET['fresh'] == '1';
}

if ($fresh) {
    echo ">> FRESH MODE: Dropping all tables first...\n";
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
    $tables = ['notifications', 'audit_logs', 'wallet_transactions', 'pickup_addresses', 'invoices', 'pickup_requests', 'manifests', 'transactions', 'shipments', 'kyc_details', 'pending_users', 'user_addresses', 'orders', 'vouchers', 'users'];
    foreach ($tables as $t) {
        $pdo->exec("DROP TABLE IF EXISTS `$t`");
        echo "   Dropped: $t\n";
    }
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");
    echo "\n";
}

try {
    // ============================================================
    // 1. USERS TABLE (all columns used across the codebase)
    // ============================================================
    $pdo->exec("CREATE TABLE IF NOT EXISTS `users` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `firstname` VARCHAR(100) NOT NULL,
        `lastname` VARCHAR(100) DEFAULT NULL,
        `email` VARCHAR(150) UNIQUE NOT NULL,
        `mobile` VARCHAR(20) DEFAULT NULL,
        `password` VARCHAR(255) NOT NULL,
        `role` ENUM('user', 'admin') DEFAULT 'user',
        `wallet_balance` DECIMAL(15, 2) DEFAULT 0.00,
        `kyc_status` ENUM('not_submitted', 'pending', 'verified', 'rejected') DEFAULT 'not_submitted',
        `otp` VARCHAR(6) DEFAULT NULL,
        `otp_expiry` DATETIME DEFAULT NULL,
        `is_verified` TINYINT(1) DEFAULT 0,
        `is_blocked` TINYINT(1) DEFAULT 0,
        `profile_image` VARCHAR(255) DEFAULT NULL,
        `company_name` VARCHAR(150) DEFAULT NULL,
        `gst_number` VARCHAR(30) DEFAULT NULL,
        `pan_number` VARCHAR(20) DEFAULT NULL,
        `aadhaar_number` VARCHAR(20) DEFAULT NULL,
        `shipping_margin` DECIMAL(10, 2) DEFAULT 0,
        `billing_address` TEXT DEFAULT NULL,
        `billing_city` VARCHAR(100) DEFAULT NULL,
        `billing_state` VARCHAR(100) DEFAULT NULL,
        `billing_pincode` VARCHAR(20) DEFAULT NULL,
        `billing_country` VARCHAR(50) DEFAULT 'India',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    echo "[OK] users\n";

    // ============================================================
    // 2. PENDING USERS (for OTP-based registration)
    // ============================================================
    $pdo->exec("CREATE TABLE IF NOT EXISTS `pending_users` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `firstname` VARCHAR(100) NOT NULL,
        `lastname` VARCHAR(100) DEFAULT NULL,
        `email` VARCHAR(150) UNIQUE NOT NULL,
        `mobile` VARCHAR(20) DEFAULT NULL,
        `password` VARCHAR(255) NOT NULL,
        `otp` VARCHAR(6) NOT NULL,
        `otp_expiry` DATETIME NOT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    echo "[OK] pending_users\n";

    // ============================================================
    // 3. KYC DETAILS (with document upload columns)
    // ============================================================
    $pdo->exec("CREATE TABLE IF NOT EXISTS `kyc_details` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `user_id` INT UNIQUE,
        `full_name` VARCHAR(150) DEFAULT NULL,
        `aadhaar_number` VARCHAR(20) DEFAULT NULL,
        `pan_number` VARCHAR(20) DEFAULT NULL,
        `address_details` TEXT DEFAULT NULL,
        `status` ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
        `rejection_reason` TEXT DEFAULT NULL,
        `aadhaar_front` VARCHAR(255) DEFAULT NULL,
        `aadhaar_back` VARCHAR(255) DEFAULT NULL,
        `pan_card` VARCHAR(255) DEFAULT NULL,
        `electricity_bill` VARCHAR(255) DEFAULT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    )");
    echo "[OK] kyc_details\n";

    // ============================================================
    // 4. SHIPMENTS TABLE (comprehensive — all columns used in code)
    // ============================================================
    $pdo->exec("CREATE TABLE IF NOT EXISTS `shipments` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `user_id` INT NOT NULL,
        `tracking_id` VARCHAR(50) UNIQUE DEFAULT NULL,
        `pickup_address_id` INT DEFAULT NULL,

        -- Receiver / Consignee columns
        `receiver_name` VARCHAR(100) DEFAULT '',
        `receiver_mobile` VARCHAR(20) DEFAULT '',
        `receiver_address` TEXT,
        `consignee_name` VARCHAR(150) DEFAULT '',
        `consignee_phone` VARCHAR(20) DEFAULT '',
        `consignee_address` TEXT,
        `consignee_city` VARCHAR(100) DEFAULT '',
        `consignee_state` VARCHAR(100) DEFAULT '',
        `consignee_pincode` VARCHAR(20) DEFAULT '',
        `consignee_email` VARCHAR(150) DEFAULT '',
        `consignee_country` VARCHAR(100) DEFAULT '',

        -- Pickup origin columns
        `pickup_name` VARCHAR(150) DEFAULT '',
        `pickup_phone` VARCHAR(20) DEFAULT '',
        `pickup_address` TEXT,
        `pickup_city` VARCHAR(100) DEFAULT '',
        `pickup_state` VARCHAR(100) DEFAULT '',
        `pickup_pincode` VARCHAR(20) DEFAULT '',

        -- Package
        `weight` DECIMAL(10, 2) DEFAULT 0,
        `deadWeight` DECIMAL(10, 2) DEFAULT 0,
        `dimensions` VARCHAR(50) DEFAULT '',
        `items` TEXT DEFAULT NULL,
        `destination_country` VARCHAR(100) DEFAULT 'India',
        `order_type` VARCHAR(50) DEFAULT 'Standard',

        -- Pricing & Payment
        `shippingCost` DECIMAL(15, 2) DEFAULT 0.00,
        `total_amount` DECIMAL(15, 2) DEFAULT 0.00,
        `courierPartner` VARCHAR(100) DEFAULT '',
        `payment_mode` VARCHAR(50) DEFAULT 'Prepaid',
        `payment_id` VARCHAR(100) DEFAULT NULL,
        `payment_order_id` VARCHAR(100) DEFAULT NULL,
        `payment_signature` VARCHAR(255) DEFAULT NULL,

        -- Status
        `status` VARCHAR(50) DEFAULT 'draft',

        -- Manifest / Grouping
        `manifest_id` INT DEFAULT NULL,

        -- Timestamps
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `verified_at` TIMESTAMP NULL,

        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    )");
    echo "[OK] shipments\n";

    // ============================================================
    // 5. TRANSACTIONS
    // ============================================================
    $pdo->exec("CREATE TABLE IF NOT EXISTS `transactions` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `user_id` INT NOT NULL,
        `amount` DECIMAL(15, 2) NOT NULL,
        `type` ENUM('credit', 'debit') NOT NULL,
        `description` VARCHAR(255) DEFAULT NULL,
        `status` ENUM('pending', 'success', 'failed') DEFAULT 'success',
        `gateway_id` VARCHAR(100) DEFAULT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    )");
    echo "[OK] transactions\n";

    // ============================================================
    // 6. MANIFESTS
    // ============================================================
    $pdo->exec("CREATE TABLE IF NOT EXISTS `manifests` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `manifest_code` VARCHAR(50) UNIQUE NOT NULL,
        `total_parcels` INT DEFAULT 0,
        `status` ENUM('open', 'closed', 'picked') DEFAULT 'open',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    echo "[OK] manifests\n";

    // ============================================================
    // 7. PICKUP REQUESTS
    // ============================================================
    $pdo->exec("CREATE TABLE IF NOT EXISTS `pickup_requests` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `manifest_id` INT NOT NULL,
        `pickup_date` DATE NOT NULL,
        `status` ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (`manifest_id`) REFERENCES `manifests`(`id`) ON DELETE CASCADE
    )");
    echo "[OK] pickup_requests\n";

    // ============================================================
    // 8. INVOICES
    // ============================================================
    $pdo->exec("CREATE TABLE IF NOT EXISTS `invoices` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `user_id` INT DEFAULT NULL,
        `invoice_number` VARCHAR(50) UNIQUE DEFAULT NULL,
        `amount` DECIMAL(15, 2) DEFAULT NULL,
        `status` ENUM('paid', 'unpaid', 'cancelled') DEFAULT 'unpaid',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
    )");
    echo "[OK] invoices\n";

    // ============================================================
    // 9. PICKUP ADDRESSES (legacy table)
    // ============================================================
    $pdo->exec("CREATE TABLE IF NOT EXISTS `pickup_addresses` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `user_id` INT NOT NULL,
        `name` VARCHAR(150) DEFAULT NULL,
        `phone` VARCHAR(20) DEFAULT NULL,
        `email` VARCHAR(150) DEFAULT NULL,
        `address1` TEXT DEFAULT NULL,
        `address2` TEXT DEFAULT NULL,
        `city` VARCHAR(100) DEFAULT NULL,
        `state` VARCHAR(100) DEFAULT NULL,
        `pincode` VARCHAR(20) DEFAULT NULL,
        `country` VARCHAR(50) DEFAULT 'India',
        `is_default` TINYINT(1) DEFAULT 0,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    )");
    echo "[OK] pickup_addresses\n";

    // ============================================================
    // 10. USER ADDRESSES (used by frontend for pickup addresses)
    // ============================================================
    $pdo->exec("CREATE TABLE IF NOT EXISTS `user_addresses` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `user_id` INT NOT NULL,
        `name` VARCHAR(150) DEFAULT NULL,
        `phone` VARCHAR(20) DEFAULT NULL,
        `address1` TEXT DEFAULT NULL,
        `city` VARCHAR(100) DEFAULT NULL,
        `state` VARCHAR(100) DEFAULT NULL,
        `pincode` VARCHAR(20) DEFAULT NULL,
        `country` VARCHAR(50) DEFAULT 'India',
        `isDefault` TINYINT(1) DEFAULT 0,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    )");
    echo "[OK] user_addresses\n";

    // ============================================================
    // 11. WALLET TRANSACTIONS
    // ============================================================
    $pdo->exec("CREATE TABLE IF NOT EXISTS `wallet_transactions` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `user_id` INT DEFAULT NULL,
        `amount` DECIMAL(15, 2) DEFAULT NULL,
        `type` ENUM('credit', 'debit') DEFAULT NULL,
        `reason` VARCHAR(255) DEFAULT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
    )");
    echo "[OK] wallet_transactions\n";

    // ============================================================
    // 12. AUDIT LOGS
    // ============================================================
    $pdo->exec("CREATE TABLE IF NOT EXISTS `audit_logs` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `admin_id` INT DEFAULT NULL,
        `action` VARCHAR(255) DEFAULT NULL,
        `entity_type` VARCHAR(50) DEFAULT NULL,
        `entity_id` INT DEFAULT NULL,
        `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`)
    )");
    echo "[OK] audit_logs\n";

    // ============================================================
    // 13. NOTIFICATIONS
    // ============================================================
    $pdo->exec("CREATE TABLE IF NOT EXISTS `notifications` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `user_id` INT DEFAULT NULL,
        `title` VARCHAR(255) DEFAULT NULL,
        `message` TEXT DEFAULT NULL,
        `is_read` TINYINT(1) DEFAULT 0,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    )");
    echo "[OK] notifications\n";

    // ============================================================
    // 14. VOUCHERS (if used)
    // ============================================================
    $pdo->exec("CREATE TABLE IF NOT EXISTS `vouchers` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `code` VARCHAR(50) UNIQUE NOT NULL,
        `discount_type` ENUM('percentage', 'flat', 'wallet_credit') DEFAULT 'flat',
        `discount_value` DECIMAL(10, 2) DEFAULT 0,
        `min_order` DECIMAL(10, 2) DEFAULT 0,
        `max_uses` INT DEFAULT 1,
        `used_count` INT DEFAULT 0,
        `is_active` TINYINT(1) DEFAULT 1,
        `expires_at` DATETIME DEFAULT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    echo "[OK] vouchers\n";

    // ============================================================
    // 15. ORDERS (legacy compatibility)
    // ============================================================
    $pdo->exec("CREATE TABLE IF NOT EXISTS `orders` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `user_id` INT DEFAULT NULL,
        `shipment_id` INT DEFAULT NULL,
        `status` VARCHAR(50) DEFAULT 'pending',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    )");
    echo "[OK] orders\n";

    // ============================================================
    // DEFAULT ADMIN ACCOUNT
    // ============================================================
    $adminHash = password_hash('password', PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (firstname, email, password, role, is_verified) 
                           VALUES ('Admin', 'admin@bglexpress.com', ?, 'admin', 1) 
                           ON DUPLICATE KEY UPDATE id=id");
    $stmt->execute([$adminHash]);
    echo "[OK] Default admin (admin@bglexpress.com / password)\n";

    // ============================================================
    // ADD MISSING COLUMNS TO EXISTING TABLES (safe — uses IF NOT EXISTS logic)
    // ============================================================
    echo "\n--- Checking & adding any missing columns ---\n";

    $columnsToAdd = [
        'users' => [
            'company_name' => 'VARCHAR(150) DEFAULT NULL',
            'gst_number' => 'VARCHAR(30) DEFAULT NULL',
            'pan_number' => 'VARCHAR(20) DEFAULT NULL',
            'aadhaar_number' => 'VARCHAR(20) DEFAULT NULL',
            'shipping_margin' => 'DECIMAL(10,2) DEFAULT 0',
            'billing_address' => 'TEXT DEFAULT NULL',
            'billing_city' => 'VARCHAR(100) DEFAULT NULL',
            'billing_state' => 'VARCHAR(100) DEFAULT NULL',
            'billing_pincode' => 'VARCHAR(20) DEFAULT NULL',
            'billing_country' => "VARCHAR(50) DEFAULT 'India'",
            'is_verified' => 'TINYINT(1) DEFAULT 0',
            'is_blocked' => 'TINYINT(1) DEFAULT 0',
        ],
        'kyc_details' => [
            'aadhaar_front' => 'VARCHAR(255) DEFAULT NULL',
            'aadhaar_back' => 'VARCHAR(255) DEFAULT NULL',
            'pan_card' => 'VARCHAR(255) DEFAULT NULL',
            'electricity_bill' => 'VARCHAR(255) DEFAULT NULL',
            'rejection_reason' => 'TEXT DEFAULT NULL',
        ],
        'shipments' => [
            'total_amount' => 'DECIMAL(15,2) DEFAULT 0.00',
            'consignee_country' => "VARCHAR(100) DEFAULT ''",
        ],
        'user_addresses' => [
            'country' => "VARCHAR(50) DEFAULT 'India'",
            'created_at' => 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
        ],
    ];

    foreach ($columnsToAdd as $table => $columns) {
        foreach ($columns as $col => $definition) {
            try {
                $check = $pdo->query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='$DB_NAME' AND TABLE_NAME='$table' AND COLUMN_NAME='$col'");
                if ($check->rowCount() == 0) {
                    $pdo->exec("ALTER TABLE `$table` ADD COLUMN `$col` $definition");
                    echo "   [ADDED] $table.$col\n";
                }
            } catch (Exception $e) {
                echo "   [SKIP] $table.$col — " . $e->getMessage() . "\n";
            }
        }
    }

    echo "\n=== ALL TABLES CREATED SUCCESSFULLY ===\n";
    echo "You can now register/login at http://localhost:5173\n";

} catch (Exception $e) {
    echo "[ERROR] " . $e->getMessage() . "\n";
}
?>