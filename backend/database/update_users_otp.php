<?php
// backend/database/update_users_otp.php
require_once '../config.php';

try {
    // 1. Add otp column
    $pdo->exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS otp VARCHAR(6) DEFAULT NULL");
    
    // 2. Add is_verified column
    $pdo->exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified TINYINT(1) DEFAULT 0");
    
    // 3. Add otp_expiry column
    $pdo->exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_expiry DATETIME DEFAULT NULL");

    sendResponse(["message" => "Database updated successfully with OTP columns."]);
} catch (PDOException $e) {
    sendResponse(["message" => "Update failed: " . $e->getMessage()], 500);
}
?>
