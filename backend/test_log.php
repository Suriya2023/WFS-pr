<?php
// backend/test_log.php
require_once 'config.php';
header('Content-Type: text/plain');
echo "Testing debugLog...\n";
debugLog("TEST LOG MESSAGE AT " . date('Y-m-d H:i:s'));
echo "Check debug.log now.";
?>