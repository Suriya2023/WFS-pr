<?php
// backend/api/orders/upload-images.php
require_once '../../config.php';

$token = verifyToken();
if (!$token) {
    sendResponse(["message" => "Unauthorized"], 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(["message" => "Only POST allowed"], 405);
}

if (!isset($_FILES['images'])) {
    sendResponse(["message" => "No images uploaded"], 400);
}

$uploadDir = '../../uploads/products/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$uploadedUrls = [];
$files = $_FILES['images'];

// Handle multiple files
$count = is_array($files['name']) ? count($files['name']) : 1;

for ($i = 0; $i < $count; $i++) {
    $name = is_array($files['name']) ? $files['name'][$i] : $files['name'];
    $tmpName = is_array($files['tmp_name']) ? $files['tmp_name'][$i] : $files['tmp_name'];
    $error = is_array($files['error']) ? $files['error'][$i] : $files['error'];

    if ($error === UPLOAD_ERR_OK) {
        $ext = pathinfo($name, PATHINFO_EXTENSION);
        $newName = uniqid('prod_') . '.' . $ext;
        if (move_uploaded_file($tmpName, $uploadDir . $newName)) {
            $uploadedUrls[] = '/backend/uploads/products/' . $newName;
        }
    }
}

sendResponse(["imageUrls" => $uploadedUrls, "success" => true]);
?>