<?php
require_once 'config.php';

try {
    $sql = "CREATE TABLE IF NOT EXISTS shipment_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        shipment_id INT NOT NULL,
        status VARCHAR(50) NOT NULL,
        location VARCHAR(100),
        remark TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (shipment_id)
    )";
    $pdo->exec($sql);
    echo "Table shipment_history created or already exists.\n";
} catch (PDOException $e) {
    echo "Error creating table: " . $e->getMessage() . "\n";
}
?>