<?php
header('Content-Type: text/plain');
$logs = ['debug.log', 'php_error.log'];
foreach ($logs as $log) {
    echo "--- $log ---\n";
    if (file_exists($log)) {
        $lines = file($log);
        echo implode('', array_slice($lines, -20));
    } else {
        echo "Not found\n";
    }
    echo "\n";
}
?>