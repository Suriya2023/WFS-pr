<?php
require_once 'config.php';
header('Content-Type: text/plain');
$stmt = $pdo->query("DESCRIBE users");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo $row['Field'] . "\n";
}
?>