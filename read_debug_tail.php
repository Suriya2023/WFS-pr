<?php
$file = 'backend/debug.log';
if (file_exists($file)) {
    $data = file($file);
    $last_lines = array_slice($data, -50);
    echo implode("", $last_lines);
} else {
    echo "File not found: $file";
}
