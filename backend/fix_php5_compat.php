<?php
// backend/fix_php5_compat.php
require_once 'config.php';

$files = array(
    'api/shipment/update.php',
    'api/shipment/cancel.php',
    'api/orders.php',
    'api/shipment/delete.php',
    'api/reports/list.php',
    'api/admin/verify_shipment.php',
    'api/admin/update_shipment_status.php',
    'api/admin/dashboard_data.php'
);

foreach ($files as $file) {
    $path = __DIR__ . '/' . $file;
    if (file_exists($path)) {
        $content = file_get_contents($path);

        // Replace ?? operator (Null Coalescing) with legacy ternary + isset
        // Pattern: ($a ?? $b) or $a ?? $b
        // This is a simple regex for most cases found in this project
        $newContent = preg_replace('/(\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*(\[[\'"]?[a-zA-Z0-9_\x7f-\xff]+[\'"]?\])?)\s*\?\?\s*([^;,\)]+)/', '(isset($1) ? $1 : $3)', $content);

        if ($newContent !== $content) {
            file_put_contents($path, $newContent);
            echo "Fixed: $file\n";
        } else {
            echo "No changes needed: $file\n";
        }
    }
}
?>