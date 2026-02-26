<?php
$file = 'backend/debug.log';
if (file_exists($file)) {
    $f = fopen($file, 'rb');
    fseek($f, -5000, SEEK_END);
    $data = fread($f, 5000);
    fclose($f);
    echo "--- Last 5000 bytes of debug.log ---\n";
    echo $data;
} else {
    echo "File not found: $file";
}
echo "\n--- PHP OpenSSL Status ---\n";
echo "OpenSSL Extension: " . (extension_loaded('openssl') ? 'LOADED' : 'NOT LOADED') . "\n";
?>