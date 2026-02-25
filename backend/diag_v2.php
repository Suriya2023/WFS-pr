<?php
header('Content-Type: text/plain');
require_once 'config.php';

echo "--- SHIPMENTS TABLE STRICTURE CHECK ---\n";
try {
    $stmt = $pdo->query("DESCRIBE shipments");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        if ($row['Null'] === 'NO' && $row['Default'] === NULL && $row['Extra'] !== 'auto_increment') {
            echo "STRICT COLUMN: " . $row['Field'] . " (Type: " . $row['Type'] . ")\n";
        }
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

echo "\n--- RECENT LOG MESSAGES ---\n";
if (file_exists('php_error.log')) {
    $content = file_get_contents('php_error.log');
    // Strip non-printable characters
    $clean = preg_replace('/[[:cntrl:]]/', '', substr($content, -2000));
    echo $clean;
}
?>