<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once 'backend/config.php';
require_once 'backend/utils/mailer.php';

echo "Attempting to send test email to dkpssurajrajput@gmail.com...\n";

// Use a simple message first
$success = sendEmail('dkpssurajrajput@gmail.com', 'Test Mail from BGL Express', '<h1>Test OTP: 123456</h1>');

if ($success) {
    echo "SUCCESS: Email sent successfully!\n";
} else {
    echo "FAILED: Email could not be sent. Check debug.log or error output above.\n";
}
?>