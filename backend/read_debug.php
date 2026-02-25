<?php
header('Content-Type: text/plain');
$log = 'debug.log';
if (file_exists($log)) {
    $c = file_get_contents($log);
    echo "--- RAW LOG (Base64 for safety) ---\n";
    echo base64_encode($c) . "\n";
    echo "--- CLEAN LOG ---\n";
    echo mb_convert_encoding($c, 'UTF-8', 'UTF-8');
} else {
    echo "Log not found";
}
?>