<?php
require_once 'backend/config.php';
header('Content-Type: text/plain');

try {
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

    if (empty($tables)) {
        echo "No tables found in " . DB_NAME . ".\n";
    } else {
        echo "Tables in " . DB_NAME . ":\n";
        foreach ($tables as $table) {
            echo "- $table\n";
        }
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
