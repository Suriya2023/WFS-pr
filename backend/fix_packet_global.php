<?php
header('Content-Type: text/plain');
require_once 'config.php';

try {
    echo "Attempting to increase GLOBAL max_allowed_packet to 16MB...\n";
    $pdo->exec("SET GLOBAL max_allowed_packet = 16777216");
    echo "Success! Please restart your MySQL for it to be absolutely sure, but GLOBAL change should affect new connections.\n";

    $stmt = $pdo->query("SHOW GLOBAL VARIABLES LIKE 'max_allowed_packet'");
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "New Global Value: " . ($row['Value'] / 1024 / 1024) . " MB\n";

} catch (Exception $e) {
    echo "Failed to set Global: " . $e->getMessage() . "\n";
    echo "You must manually edit your xampp/mysql/bin/my.ini file.\n";
    echo "Find [mysqld] section and add/change: max_allowed_packet=16M\n";
}
?>