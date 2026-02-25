<?php
header('Content-Type: text/plain');
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "--- SYSTEM STATUS ---\n";
require_once 'config.php';
if ($pdo)
    echo "PDO: Connected\n";

echo "\n--- PHP ERROR LOG (LAST 50 LINES) ---\n";
$log = 'php_error.log';
if (file_exists($log)) {
    $content = file_get_contents($log);
    // Sanitize output for safe display
    echo str_replace("\x00", "", $content);
} else {
    echo "No log file found.";
}
?>