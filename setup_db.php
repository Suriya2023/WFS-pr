<?php
// BGL Express — Full Database Setup Script
// Run once to create all tables with correct columns
require_once 'backend/config.php';

echo "=== BGL EXPRESS DATABASE SETUP ===\n\n";

try {
    // 1. USERS TABLE
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstname VARCHAR(100) NOT NULL,
        lastname VARCHAR(100),
        email VARCHAR(150) UNIQUE NOT NULL,
        mobile VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        wallet_balance DECIMAL(15, 2) DEFAULT 0.00,
        kyc_status ENUM('not_submitted', 'pending', 'verified', 'rejected') DEFAULT 'not_submitted',
        otp VARCHAR(6) DEFAULT NULL,
        otp_expiry DATETIME DEFAULT NULL,
        is_verified TINYINT(1) DEFAULT 0,
        is_blocked TINYINT(1) DEFAULT 0,
        profile_image VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    echo "[OK] users\n";

    // 1.1 PENDING USERS
    $pdo->exec("CREATE TABLE IF NOT EXISTS pending_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstname VARCHAR(100) NOT NULL,
        lastname VARCHAR(100),
        email VARCHAR(150) UNIQUE NOT NULL,
        mobile VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        otp_expiry DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    echo "[OK] pending_users\n";

    // 2. KYC DETAILS
    $pdo->exec("CREATE TABLE IF NOT EXISTS kyc_details (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNIQUE,
        full_name VARCHAR(150),
        aadhaar_number VARCHAR(20),
        pan_number VARCHAR(20),
        address_details TEXT,
        status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
        rejection_reason TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )");
    echo "[OK] kyc_details\n";

    // 3. SHIPMENTS TABLE — comprehensive with ALL needed columns
    $pdo->exec("CREATE TABLE IF NOT EXISTS shipments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        tracking_id VARCHAR(50) UNIQUE DEFAULT NULL,
        pickup_address_id INT DEFAULT NULL,

        -- Receiver / Consignee columns (redundant for compatibility)
        receiver_name VARCHAR(100) DEFAULT '',
        receiver_mobile VARCHAR(20) DEFAULT '',
        receiver_address TEXT,
        consignee_name VARCHAR(150) DEFAULT '',
        consignee_phone VARCHAR(20) DEFAULT '',
        consignee_address TEXT,
        consignee_city VARCHAR(100) DEFAULT '',
        consignee_state VARCHAR(100) DEFAULT '',
        consignee_pincode VARCHAR(20) DEFAULT '',
        consignee_email VARCHAR(150) DEFAULT '',

        -- Pickup origin columns
        pickup_name VARCHAR(150) DEFAULT '',
        pickup_phone VARCHAR(20) DEFAULT '',
        pickup_address TEXT,
        pickup_city VARCHAR(100) DEFAULT '',
        pickup_state VARCHAR(100) DEFAULT '',
        pickup_pincode VARCHAR(20) DEFAULT '',

        -- Package
        weight DECIMAL(10, 2) DEFAULT 0,
        deadWeight DECIMAL(10, 2) DEFAULT 0,
        dimensions VARCHAR(50) DEFAULT '',
        items JSON DEFAULT NULL,
        destination_country VARCHAR(100) DEFAULT 'India',
        order_type VARCHAR(50) DEFAULT 'Standard',

        -- Pricing & Payment
        shippingCost DECIMAL(15, 2) DEFAULT 0.00,
        courierPartner VARCHAR(100) DEFAULT '',
        payment_mode VARCHAR(50) DEFAULT 'Prepaid',
        payment_id VARCHAR(100) DEFAULT NULL,
        payment_order_id VARCHAR(100) DEFAULT NULL,
        payment_signature VARCHAR(255) DEFAULT NULL,

        -- Status (VARCHAR to avoid ENUM restriction issues)
        status VARCHAR(50) DEFAULT 'draft',

        -- Manifest / Grouping
        manifest_id INT DEFAULT NULL,

        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        verified_at TIMESTAMP NULL,

        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )");
    echo "[OK] shipments\n";

    // 4. TRANSACTIONS
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
    echo "[OK] transactions\n";

    // 5. MANIFESTS
    $pdo->exec("CREATE TABLE IF NOT EXISTS manifests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        manifest_code VARCHAR(50) UNIQUE NOT NULL,
        total_parcels INT DEFAULT 0,
        status ENUM('open', 'closed', 'picked') DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    echo "[OK] manifests\n";

    // 6. PICKUP REQUESTS
    $pdo->exec("CREATE TABLE IF NOT EXISTS pickup_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        manifest_id INT NOT NULL,
        pickup_date DATE NOT NULL,
        status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (manifest_id) REFERENCES manifests(id) ON DELETE CASCADE
    )");
    echo "[OK] pickup_requests\n";

    // 7. INVOICES
    $pdo->exec("CREATE TABLE IF NOT EXISTS invoices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        invoice_number VARCHAR(50) UNIQUE,
        amount DECIMAL(15, 2),
        status ENUM('paid', 'unpaid', 'cancelled') DEFAULT 'unpaid',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )");
    echo "[OK] invoices\n";

    // 8. USER ADDRESSES (Pickup Addresses)
    $pdo->exec("CREATE TABLE IF NOT EXISTS pickup_addresses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(150),
        phone VARCHAR(20),
        email VARCHAR(150),
        address1 TEXT,
        address2 TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        pincode VARCHAR(20),
        country VARCHAR(50) DEFAULT 'India',
        is_default TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )");
    echo "[OK] pickup_addresses\n";

    // 9. WALLET TRANSACTIONS
    $pdo->exec("CREATE TABLE IF NOT EXISTS wallet_transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        amount DECIMAL(15, 2),
        type ENUM('credit', 'debit'),
        reason VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )");
    echo "[OK] wallet_transactions\n";

    // 10. AUDIT LOGS
    $pdo->exec("CREATE TABLE IF NOT EXISTS audit_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        admin_id INT,
        action VARCHAR(255),
        entity_type VARCHAR(50),
        entity_id INT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES users(id)
    )");
    echo "[OK] audit_logs\n";

    // 11. NOTIFICATIONS
    $pdo->exec("CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        title VARCHAR(255),
        message TEXT,
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )");
    echo "[OK] notifications\n";

    // DEFAULT ADMIN (password: 'password')
    $adminHash = password_hash('password', PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (firstname, email, password, role, is_verified) VALUES ('Admin', 'admin@bglexpress.com', ?, 'admin', 1) ON DUPLICATE KEY UPDATE id=id");
    $stmt->execute([$adminHash]);
    echo "[OK] Default admin (admin@bglexpress.com / password)\n";

    echo "\n=== ALL TABLES CREATED SUCCESSFULLY ===\n";

} catch (Exception $e) {
    echo "[ERROR] " . $e->getMessage() . "\n";
}
?>