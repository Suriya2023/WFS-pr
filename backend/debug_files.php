<?php
// backend/debug_files.php
header('Content-Type: text/plain');
$files = [
    'config.php',
    'api/user/profile.php',
    'api/notifications.php',
    'api/shipment/create.php',
    'api/manifests.php'
];

foreach ($files as $file) {
    echo "Checking $file... ";
    $content = file_get_contents($file);
    if ($content === false) {
        echo "FAILED to read.\n";
        continue;
    }

    // Check for syntax errors by including it (might exit, so we use a sub-request or just check tags)
    if (strpos($content, '<?php') === false) {
        echo "WARNING: No PHP tag found.\n";
    } else {
        echo "Read OK.\n";
    }
}
?>