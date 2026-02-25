<?php
// backend/migrate_v7.php
require_once 'config.php';
header('Content-Type: text/plain');

try {
    // 1. Force all shipments columns to be nullable to prevent "Field doesn't have default value"
    $stmt = $pdo->query("DESCRIBE shipments");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $field = $row['Field'];
        if ($field === 'id' || $field === 'user_id' || $field === 'created_at')
            continue;

        $type = $row['Type'];
        $sql = "ALTER TABLE shipments MODIFY COLUMN `$field` $type NULL";
        try {
            $pdo->exec($sql);
            echo "Made $field nullable.\n";
        } catch (Exception $e) {
            echo "Error making $field nullable: " . $e->getMessage() . "\n";
        }
    }

    // 2. Ensure transactions table is robust
    try {
        $pdo->exec("ALTER TABLE transactions MODIFY COLUMN amount DECIMAL(15, 2) DEFAULT 0.00");
        $pdo->exec("ALTER TABLE transactions MODIFY COLUMN description VARCHAR(255) DEFAULT NULL");
        $pdo->exec("ALTER TABLE transactions MODIFY COLUMN gateway_id VARCHAR(100) DEFAULT NULL");
    } catch (Exception $e) {
    }

    echo "\nMigration V7 completed successfully.\n";

} catch (Exception $e) {
    echo "Migration Error: " . $e->getMessage() . "\n";
}
?>