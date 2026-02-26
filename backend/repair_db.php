<?php
// backend/repair_db.php
// ⚠️  Run this ONCE to fix InnoDB corruption (table doesn't exist in engine)
// URL: http://localhost/WFS-pr/backend/repair_db.php

header('Content-Type: text/html; charset=utf-8');

define('DB_HOST', 'localhost');
define('DB_NAME', 'user_dash_db');
define('DB_USER', 'root');
define('DB_PASS', '');

$steps = [];
$errors = [];

function ok($msg)
{
    global $steps;
    $steps[] = $msg;
}
function err($msg)
{
    global $errors;
    $errors[] = $msg;
}

try {
    // Connect WITHOUT selecting a database first
    $pdo = new PDO("mysql:host=" . DB_HOST . ";charset=utf8mb4", DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    ok("✅ Connected to MySQL");

    // Drop corrupted database entirely and recreate fresh
    $pdo->exec("DROP DATABASE IF EXISTS `" . DB_NAME . "`");
    ok("🗑️  Dropped old database '" . DB_NAME . "'");

    $pdo->exec("CREATE DATABASE `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    ok("✅ Created fresh database '" . DB_NAME . "'");

    $pdo->exec("USE `" . DB_NAME . "`");

    // ── 1. users ──────────────────────────────────────────────────────────────
    $pdo->exec("CREATE TABLE `users` (
        `id`             int(11)       NOT NULL AUTO_INCREMENT,
        `firstname`      varchar(100)  NOT NULL,
        `lastname`       varchar(100)  DEFAULT NULL,
        `email`          varchar(150)  NOT NULL UNIQUE,
        `mobile`         varchar(20)   DEFAULT NULL,
        `password`       varchar(255)  NOT NULL,
        `role`           enum('user','admin') DEFAULT 'user',
        `wallet_balance` decimal(15,2) DEFAULT 0.00,
        `kyc_status`     enum('not_submitted','pending','verified','rejected') DEFAULT 'not_submitted',
        `company_name`   varchar(255)  DEFAULT NULL,
        `gst_number`     varchar(15)   DEFAULT NULL,
        `created_at`     timestamp     NOT NULL DEFAULT current_timestamp(),
        PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    ok("✅ Table 'users' created");

    // ── 2. pending_users ──────────────────────────────────────────────────────
    $pdo->exec("CREATE TABLE `pending_users` (
        `id`         int(11)      NOT NULL AUTO_INCREMENT,
        `firstname`  varchar(100) NOT NULL,
        `lastname`   varchar(100) DEFAULT NULL,
        `email`      varchar(150) NOT NULL UNIQUE,
        `mobile`     varchar(20)  DEFAULT NULL,
        `password`   varchar(255) NOT NULL,
        `otp`        varchar(6)   NOT NULL,
        `otp_expiry` datetime     NOT NULL,
        `created_at` timestamp    NOT NULL DEFAULT current_timestamp(),
        PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    ok("✅ Table 'pending_users' created");

    // ── 3. kyc_details ────────────────────────────────────────────────────────
    $pdo->exec("CREATE TABLE `kyc_details` (
        `id`               int(11)      NOT NULL AUTO_INCREMENT,
        `user_id`          int(11)      NOT NULL UNIQUE,
        `full_name`        varchar(150) DEFAULT NULL,
        `aadhaar_number`   varchar(20)  DEFAULT NULL,
        `pan_number`       varchar(20)  DEFAULT NULL,
        `address_details`  text         DEFAULT NULL,
        `status`           enum('pending','verified','rejected') DEFAULT 'pending',
        `rejection_reason` text         DEFAULT NULL,
        `aadhaar_front`    varchar(255) DEFAULT NULL,
        `aadhaar_back`     varchar(255) DEFAULT NULL,
        `pan_card`         varchar(255) DEFAULT NULL,
        `created_at`       timestamp    NOT NULL DEFAULT current_timestamp(),
        PRIMARY KEY (`id`),
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    ok("✅ Table 'kyc_details' created");

    // ── 4. orders ─────────────────────────────────────────────────────────────
    $pdo->exec("CREATE TABLE `orders` (
        `id`                   int(11)      NOT NULL AUTO_INCREMENT,
        `user_id`              int(11)      NOT NULL,
        `tracking_id`          varchar(50)  DEFAULT NULL UNIQUE,
        `awb_number`           varchar(100) DEFAULT NULL,
        `consignee_name`       varchar(150) DEFAULT NULL,
        `consignee_phone`      varchar(20)  DEFAULT NULL,
        `consignee_address`    text         DEFAULT NULL,
        `destination_country`  varchar(100) DEFAULT NULL,
        `weight`               float        DEFAULT NULL,
        `status`               enum('draft','paid','ready','packed','manifested','dispatched','received','cancelled','disputed') DEFAULT 'draft',
        `shippingCost`         decimal(15,2) DEFAULT NULL,
        `payment_status`       enum('pending','paid','failed') DEFAULT 'pending',
        `created_at`           timestamp    NOT NULL DEFAULT current_timestamp(),
        PRIMARY KEY (`id`),
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    ok("✅ Table 'orders' created");

    // ── 5. wallet_transactions ────────────────────────────────────────────────
    $pdo->exec("CREATE TABLE `wallet_transactions` (
        `id`          int(11)       NOT NULL AUTO_INCREMENT,
        `user_id`     int(11)       NOT NULL,
        `amount`      decimal(15,2) NOT NULL,
        `type`        enum('credit','debit') NOT NULL,
        `description` varchar(255)  DEFAULT NULL,
        `status`      enum('pending','success','failed') DEFAULT 'success',
        `created_at`  timestamp     NOT NULL DEFAULT current_timestamp(),
        PRIMARY KEY (`id`),
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    ok("✅ Table 'wallet_transactions' created");

    // ── 6. user_addresses ─────────────────────────────────────────────────────
    $pdo->exec("CREATE TABLE `user_addresses` (
        `id`        int(11)      NOT NULL AUTO_INCREMENT,
        `user_id`   int(11)      NOT NULL,
        `name`      varchar(100) NOT NULL,
        `phone`     varchar(20)  DEFAULT NULL,
        `address1`  text         DEFAULT NULL,
        `city`      varchar(100) DEFAULT NULL,
        `state`     varchar(100) DEFAULT NULL,
        `pincode`   varchar(20)  DEFAULT NULL,
        `isDefault` tinyint(1)   DEFAULT 0,
        PRIMARY KEY (`id`),
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    ok("✅ Table 'user_addresses' created");

    // ── 7. Seed admin user ────────────────────────────────────────────────────
    $adminPass = password_hash('Admin@123', PASSWORD_BCRYPT);
    $pdo->prepare("INSERT INTO users (firstname, lastname, email, password, role) VALUES (?, ?, ?, ?, ?)")
        ->execute(['Admin', 'BGL', 'admin@bglexpress.com', $adminPass, 'admin']);
    ok("✅ Admin user created → Email: admin@bglexpress.com | Password: Admin@123");

} catch (PDOException $e) {
    err("❌ FATAL: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>DB Repair - WFS</title>
    <style>
        body {
            font-family: monospace;
            max-width: 800px;
            margin: 40px auto;
            padding: 0 20px;
            background: #0d1117;
            color: #c9d1d9;
        }

        h1 {
            color: #58a6ff;
        }

        .step {
            background: #161b22;
            border-left: 3px solid #3fb950;
            padding: 8px 12px;
            margin: 6px 0;
            border-radius: 4px;
        }

        .error {
            background: #161b22;
            border-left: 3px solid #f85149;
            padding: 8px 12px;
            margin: 6px 0;
            border-radius: 4px;
            color: #f85149;
        }

        .success-box {
            background: #0d4429;
            border: 1px solid #3fb950;
            padding: 16px;
            border-radius: 8px;
            margin-top: 20px;
        }

        .fail-box {
            background: #3b0d0c;
            border: 1px solid #f85149;
            padding: 16px;
            border-radius: 8px;
            margin-top: 20px;
        }

        a {
            color: #58a6ff;
        }
    </style>
</head>

<body>
    <h1>🔧 Database Repair Tool</h1>

    <?php foreach ($steps as $s): ?>
        <div class="step">
            <?= htmlspecialchars($s) ?>
        </div>
    <?php endforeach; ?>

    <?php foreach ($errors as $e): ?>
        <div class="error">
            <?= htmlspecialchars($e) ?>
        </div>
    <?php endforeach; ?>

    <?php if (empty($errors)): ?>
        <div class="success-box">
            <strong>✅ Database repaired successfully!</strong><br><br>
            Admin login: <code>admin@bglexpress.com</code> / <code>Admin@123</code><br><br>
            <a href="http://localhost:5173/login">→ Go to Login Page</a>
        </div>
        <p style="color:#8b949e; margin-top:20px;">⚠️ Delete <code>repair_db.php</code> after use for security.</p>
    <?php else: ?>
        <div class="fail-box"><strong>❌ Repair failed. Check errors above.</strong></div>
    <?php endif; ?>
</body>

</html>