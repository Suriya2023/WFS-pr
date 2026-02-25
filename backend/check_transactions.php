<?php
require_once 'config.php';
header('Content-Type: text/plain');
$stmt = $pdo->query("DESCRIBE transactions");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo $row['Field'] . " (" . $row['Type'] . ")\n";
}
?>