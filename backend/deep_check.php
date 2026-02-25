<?php
require_once 'config.php';
header('Content-Type: text/plain');

function checkTable($pdo, $name)
{
    echo "\nTable: $name\n";
    try {
        $stmt = $pdo->query("DESCRIBE $name");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "  " . $row['Field'] . " (" . $row['Type'] . ") - Null: " . $row['Null'] . "\n";
        }
    } catch (Exception $e) {
        echo "  Error: " . $e->getMessage() . "\n";
    }
}

checkTable($pdo, 'shipments');
checkTable($pdo, 'transactions');
checkTable($pdo, 'users');
checkTable($pdo, 'kyc_details');
?>