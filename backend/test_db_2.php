<?php
require_once 'config.php';
header('Content-Type: text/plain');
$tables = ['user_addresses', 'shipments', 'manifests', 'orders'];
foreach ($tables as $table) {
    try {
        echo "--- $table ---\n";
        $stmt = $pdo->query("DESCRIBE $table");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo $row['Field'] . "\n";
        }
        echo "\n";
    } catch (Exception $e) {
        echo "Error describing $table: " . $e->getMessage() . "\n\n";
    }
}
