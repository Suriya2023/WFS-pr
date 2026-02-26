<?php
require_once 'backend/config.php';
header('Content-Type: text/plain');

try {
    $stmt = $pdo->query("SELECT email, otp, created_at FROM pending_users ORDER BY created_at DESC LIMIT 5");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($rows)) {
        echo "No pending users found.\n";
    } else {
        echo "Recent OTPs in pending_users:\n";
        print_r($rows);
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
