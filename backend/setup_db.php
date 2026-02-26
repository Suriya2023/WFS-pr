<?php
//  http://localhost/WFS-pr/backend/setup_db.php
// backend/setup_db.php
require_once 'config.php';

try {
  // 1. Create Users Table
  $pdo->exec("CREATE TABLE IF NOT EXISTS `users` (
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
    ) ENGINE=InnoDB;");

  // 2. Create KYC Details Table
  $pdo->exec("CREATE TABLE IF NOT EXISTS `kyc_details` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `user_id` int(11) NOT NULL UNIQUE,
      `full_name` varchar(150) DEFAULT NULL,
      `aadhaar_number` varchar(20) DEFAULT NULL,
      `pan_number` varchar(20) DEFAULT NULL,
      `address_details` text DEFAULT NULL,
      `status` enum('pending','verified','rejected') DEFAULT 'pending',
      `rejection_reason` text DEFAULT NULL,
      `aadhaar_front` varchar(255) DEFAULT NULL,
      `aadhaar_back` varchar(255) DEFAULT NULL,
      `pan_card` varchar(255) DEFAULT NULL,
      `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
      PRIMARY KEY (`id`),
      FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB;");

  // 3. Create Orders Table
  $pdo->exec("CREATE TABLE IF NOT EXISTS `orders` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `user_id` int(11) NOT NULL,
      `tracking_id` varchar(50) DEFAULT NULL UNIQUE,
      `awb_number` varchar(100) DEFAULT NULL,
      `consignee_name` varchar(150) DEFAULT NULL,
      `consignee_phone` varchar(20) DEFAULT NULL,
      `consignee_address` text DEFAULT NULL,
      `destination_country` varchar(100) DEFAULT NULL,
      `weight` float DEFAULT NULL,
      `status` enum('draft','paid','ready','packed','manifested','dispatched','received','cancelled','disputed') DEFAULT 'draft',
      `shippingCost` decimal(15,2) DEFAULT NULL,
      `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
      PRIMARY KEY (`id`),
      FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB;");

  // 4. Create Wallet Transactions
  $pdo->exec("CREATE TABLE IF NOT EXISTS `wallet_transactions` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `user_id` int(11) NOT NULL,
      `amount` decimal(15,2) NOT NULL,
      `type` enum('credit','debit') NOT NULL,
      `description` varchar(255) DEFAULT NULL,
      `status` enum('pending','success','failed') DEFAULT 'success',
      `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
      PRIMARY KEY (`id`),
      FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB;");

  // 5. Create Address Book
  $pdo->exec("CREATE TABLE IF NOT EXISTS `user_addresses` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `user_id` int(11) NOT NULL,
      `name` varchar(100) NOT NULL,
      `phone` varchar(20) DEFAULT NULL,
      `address1` text DEFAULT NULL,
      `city` varchar(100) DEFAULT NULL,
      `state` varchar(100) DEFAULT NULL,
      `pincode` varchar(20) DEFAULT NULL,
      `isDefault` tinyint(1) DEFAULT 0,
      PRIMARY KEY (`id`),
      FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB;");

  echo "<h1>Database Setup Successfully!</h1>";
  echo "<p>Saari tables ban chuki hain. Ab aap register kar sakte hain.</p>";
  echo "<a href='http://localhost:5173/register'>Go to Registration</a>";

} catch (PDOException $e) {
  echo "<h1>Error during setup:</h1>";
  echo "<p>" . $e->getMessage() . "</p>";
}
?>