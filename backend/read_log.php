<?php
header('Content-Type: text/plain');
$logFile = 'debug.log';
if (file_exists($logFile)) {
    echo file_get_contents($logFile);
} else {
    echo "Log file not found.";
}
?>