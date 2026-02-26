<?php
require_once 'backend/config.php';

try {
    // Drop existing tables to ensure a clean start since user said they deleted it
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
    $tables = ['users', 'pending_users', 'kyc_details', 'shipments', 'transactions', 'manifests', 'pickup_requests', 'invoices', 'pickup_addresses', 'wallet_transactions', 'audit_logs', 'notifications'];
    foreach ($tables as $table) {
        $pdo->exec("DROP TABLE IF EXISTS $table");
    }
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");
    
    echo "Tables dropped. Running setup script...\n";
    include 'setup_db.php';
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
