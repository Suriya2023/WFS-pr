-- MASTER DATABASE RESET & SCHEMA (BGL EXPRESS)
-- Warning: This will delete ALL existing data in user_dash_db.

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS kyc_details;
DROP TABLE IF EXISTS shipments;
DROP TABLE IF EXISTS manifests;
DROP TABLE IF EXISTS pickup_requests;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS wallet_transactions;
DROP TABLE IF EXISTS quotes;
DROP TABLE IF EXISTS audit_logs;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Users Table (Core Auth & Profile)
CREATE TABLE users (
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
    profile_image VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1.1 Pending Users (Temporary storage before OTP)
CREATE TABLE IF NOT EXISTS pending_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    mobile VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    otp_expiry DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE kyc_details (
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
);

-- 3. Shipments Table (Manual Entry)
CREATE TABLE shipments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tracking_id VARCHAR(50) UNIQUE NOT NULL,
    receiver_name VARCHAR(100) NOT NULL,
    receiver_mobile VARCHAR(20) NOT NULL,
    receiver_address TEXT NOT NULL,
    weight DECIMAL(10, 2),
    dimensions VARCHAR(50),
    status ENUM('draft', 'ready', 'packed', 'manifested', 'picked', 'cancelled') DEFAULT 'draft',
    manifest_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Transactions Table (Wallet & Payments)
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    type ENUM('credit', 'debit') NOT NULL,
    description VARCHAR(255),
    status ENUM('pending', 'success', 'failed') DEFAULT 'success',
    gateway_id VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Manifests Table
CREATE TABLE manifests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    manifest_code VARCHAR(50) UNIQUE NOT NULL,
    total_parcels INT DEFAULT 0,
    status ENUM('open', 'closed', 'picked') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Pickup Requests
CREATE TABLE pickup_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    manifest_id INT NOT NULL,
    pickup_date DATE NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manifest_id) REFERENCES manifests(id) ON DELETE CASCADE
);

-- 7. Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    invoice_number VARCHAR(50) UNIQUE,
    amount DECIMAL(15, 2),
    status ENUM('paid', 'unpaid', 'cancelled') DEFAULT 'unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Default Admin User
INSERT INTO users (firstname, email, password, role, is_verified) 
VALUES ('Admin', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 1)
ON DUPLICATE KEY UPDATE id=id;
