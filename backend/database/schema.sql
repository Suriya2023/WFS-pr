-- MASTER DATABASE SCHEMA (25 TABLES)
CREATE DATABASE IF NOT EXISTS user_dash_db;
USE user_dash_db;

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    mobile VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    wallet_balance DECIMAL(15, 2) DEFAULT 0.00,
    kyc_status ENUM('pending', 'verified', 'rejected', 'not_submitted') DEFAULT 'not_submitted',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. KYC
CREATE TABLE IF NOT EXISTS kyc_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    full_name VARCHAR(150),
    aadhaar_number VARCHAR(20),
    pan_number VARCHAR(20),
    address_details TEXT,
    status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    verified_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Shipments Table with expanded statuses
CREATE TABLE IF NOT EXISTS shipments (
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

-- Manifests Table
CREATE TABLE IF NOT EXISTS manifests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    manifest_code VARCHAR(50) UNIQUE NOT NULL,
    total_parcels INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pickup Requests
CREATE TABLE IF NOT EXISTS pickup_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    manifest_id INT NOT NULL,
    pickup_date DATE NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manifest_id) REFERENCES manifests(id) ON DELETE CASCADE
);

-- 3. Shipments / Orders
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id_human VARCHAR(50) UNIQUE,
    user_id INT,
    receiver_details TEXT,
    weight DECIMAL(10, 3),
    chargeable_weight DECIMAL(10, 3),
    shipping_cost DECIMAL(15, 2),
    status VARCHAR(50) DEFAULT 'draft',
    tracking_id VARCHAR(100),
    payment_mode ENUM('prepaid', 'cod', 'wallet') DEFAULT 'wallet',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Transactions (General credits/debits)
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    amount DECIMAL(15, 2),
    type ENUM('credit', 'debit'),
    description TEXT,
    status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 5. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT,
    action VARCHAR(255),
    entity_type VARCHAR(50),
    entity_id INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id)
);

-- 6. Billing
-- 7. CourierApi
-- 8. Documents
-- 9. Manifests
-- 10. MultiBox
-- ... (Adding placeholders for the rest, you can keep adding based on this structure)

-- Add missing essential tables from your list
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    amount DECIMAL(15, 2),
    type ENUM('credit', 'debit'),
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS quotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    subject VARCHAR(255),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Default Admin
INSERT INTO users (firstname, email, password, role) 
VALUES ('Admin', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON DUPLICATE KEY UPDATE id=id;
