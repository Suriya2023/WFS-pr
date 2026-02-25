<?php
// backend/api/user.php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$data = json_decode(file_get_contents("php://input"), true);

$token = verifyToken();
if (!$token) {
    sendResponse(false, "Unauthorized");
}
$tokenData = json_decode(base64_decode($token), true);
$userId = $tokenData['id'];

// Allow admin to view other user's data if passed
if (isset($_GET['user_id']) && $tokenData['role'] === 'admin') {
    $userId = $_GET['user_id'];
}

if ($method == 'GET' && $action == 'addresses') {
    try {
        $stmt = $pdo->prepare("SELECT id as _id, name, phone, address1, city, state, pincode, country FROM user_addresses WHERE user_id = ?");
        $stmt->execute([$userId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        sendResponse(true, "Addresses", $rows);
    } catch (PDOException $e) {
        sendResponse(true, "Addresses", []);
    }
} elseif ($method == 'GET' && $action == 'profile') {
    $stmt = $pdo->prepare("SELECT id, firstname, lastname, email, mobile, role FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    sendResponse(true, "Profile", $user);
}
?>