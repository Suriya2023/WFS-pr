<?php
header('Content-Type: application/json');
require_once 'config.php';

try {
    $stmt = $pdo->query("DESCRIBE shipments");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmt = $pdo->query("DESCRIBE transactions");
    $trans_columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "shipments_columns" => $columns,
        "transactions_columns" => $trans_columns,
        "php_version" => PHP_VERSION,
        "mysql_version" => $pdo->getAttribute(PDO::ATTR_SERVER_VERSION)
    ], JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>