<?php
require_once 'config.php';
header('Content-Type: text/plain');

function describeTable($pdo, $table)
{
    try {
        echo "--- $table ---\n";
        $stmt = $pdo->query("DESCRIBE $table");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo $row['Field'] . "\n";
        }
        echo "\n";
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage() . "\n\n";
    }
}

describeTable($pdo, 'transactions');
describeTable($pdo, 'user_addresses');
describeTable($pdo, 'wallet_transactions');
?>