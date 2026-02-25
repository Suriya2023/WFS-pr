<?php
header('Content-Type: text/plain');
$log = 'php_error.log';
if (file_exists($log)) {
    $lines = file($log);
    $last_lines = array_slice($lines, -20);
    foreach ($last_lines as $line) {
        echo $line;
    }
} else {
    echo "Log not found";
}
?>