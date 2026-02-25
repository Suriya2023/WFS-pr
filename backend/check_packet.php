<?php
header('Content-Type: text/plain');
require_once 'config.php';

try {
    $stmt = $pdo->query("SHOW VARIABLES LIKE 'max_allowed_packet'");
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "Current max_allowed_packet: " . ($row['Value'] / 1024 / 1024) . " MB\n";

    echo "Trying to increase it for this session...\n";
    $pdo->exec("SET SESSION max_allowed_packet = 33554432"); // 32MB

    $stmt = $pdo->query("SHOW VARIABLES LIKE 'max_allowed_packet'");
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "New session max_allowed_packet: " . ($row['Value'] / 1024 / 1024) . " MB\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>