<?php
header('Content-Type: text/plain');
require_once 'config.php';

echo "--- SHIPMENTS COLUMN DETAILS ---\n";
try {
    $stmt = $pdo->query("DESCRIBE shipments");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo sprintf(
            "%-25s | Null: %-3s | Default: %-10s\n",
            $row['Field'],
            $row['Null'],
            $row['Default'] === NULL ? 'NULL' : $row['Default']
        );
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>