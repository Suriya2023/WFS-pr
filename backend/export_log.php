<?php
header('Content-Type: text/plain');
$log = 'php_error.log';
if (file_exists($log)) {
    echo base64_encode(file_get_contents($log));
} else {
    echo "NONE";
}
?>