<?php
require_once '../../config.php';
// Auth Check
$headers = apache_request_headers();
$authHeader = $headers['Authorization'] ?? '';
if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    sendResponse(["message" => "Unauthorized"], 401);
}
$tokenData = json_decode(base64_decode($matches[1]), true);
$userId = $tokenData['id'] ?? null;
$role = $tokenData['role'] ?? 'user';

// Admin context: allow overriding userId via GET
if (isset($_GET['user_id']) && $role === 'admin') {
    $userId = $_GET['user_id'];
}

// NOTE: Since the current database schema (db_setup.php) doesn't have a separate addresses table,
// we return an empty array for now. Users can add a 'new address' in the modal which is processed on shipment creation.
sendResponse([]); 
?>
