<?php
// Temporary diagnostic - DELETE after use
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once 'config.php';

echo "<h2>DB Connection: OK</h2>";

// Test creating users table
$sql = "CREATE TABLE IF NOT EXISTS `users` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `firstname` varchar(100) NOT NULL,
    `lastname` varchar(100) DEFAULT NULL,
    `email` varchar(150) NOT NULL UNIQUE,
    `mobile` varchar(20) DEFAULT NULL,
    `password` varchar(255) NOT NULL,
    `role` enum('user','admin') DEFAULT 'user',
    `wallet_balance` decimal(15,2) DEFAULT 0.00,
    `kyc_status` enum('not_submitted','pending','verified','rejected') DEFAULT 'not_submitted',
    `company_name` varchar(255) DEFAULT NULL,
    `gst_number` varchar(15) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

try {
    $pdo->exec($sql);
    echo "<h3>users table: OK</h3>";
    $pdo->query("SELECT 1 FROM users LIMIT 1");
    echo "<h3>users table SELECT: OK</h3>";
} catch (PDOException $e) {
    echo "<h3 style='color:red'>users table ERROR: " . $e->getMessage() . "</h3>";
}

$sql2 = "CREATE TABLE IF NOT EXISTS `pending_users` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `firstname` varchar(100) NOT NULL,
    `lastname` varchar(100) DEFAULT NULL,
    `email` varchar(150) NOT NULL UNIQUE,
    `mobile` varchar(20) DEFAULT NULL,
    `password` varchar(255) NOT NULL,
    `otp` varchar(6) NOT NULL,
    `otp_expiry` datetime NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

try {
    $pdo->exec($sql2);
    echo "<h3>pending_users table: OK</h3>";
    $pdo->query("SELECT 1 FROM pending_users LIMIT 1");
    echo "<h3>pending_users table SELECT: OK</h3>";
} catch (PDOException $e) {
    echo "<h3 style='color:red'>pending_users table ERROR: " . $e->getMessage() . "</h3>";
}

// Check mailer
try {
    require_once 'utils/mailer.php';
    echo "<h3>mailer.php: OK</h3>";
} catch (Throwable $e) {
    echo "<h3 style='color:red'>mailer.php ERROR: " . $e->getMessage() . "</h3>";
}

echo "<h2 style='color:green'>Diagnostics complete!</h2>";
?>