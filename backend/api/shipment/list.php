<?php
// backend/api/shipment/list.php
require_once '../../config.php';

// Auth Check - robust header detection
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
if (!$authHeader && function_exists('apache_request_headers')) {
    $headers = apache_request_headers();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
}
if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    sendResponse(["message" => "Unauthorized"], 401);
}
$tokenData = json_decode(base64_decode($matches[1]), true);
$userId = $tokenData['id'] ?? null;

if (!$userId)
    sendResponse(["message" => "Unauthorized"], 401);

// Role check from DB
$stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
$stmt->execute([$userId]);
$user = $stmt->fetch();

$viewAll = isset($_GET['all']) && $_GET['all'] === 'true' && $user['role'] === 'admin';
$targetUserId = $_GET['user_id'] ?? $userId;

try {
    if ($viewAll) {
        // Fetch all shipments with user details
        $stmt = $pdo->prepare("SELECT s.*, u.email as creator_email, u.firstname, u.lastname 
                             FROM shipments s 
                             JOIN users u ON s.user_id = u.id 
                             ORDER BY s.created_at DESC");
        $stmt->execute();
    } else {
        if ($user['role'] !== 'admin')
            $targetUserId = $userId;

        $stmt = $pdo->prepare("SELECT s.*, u.email as creator_email, u.firstname, u.lastname 
                             FROM shipments s 
                             JOIN users u ON s.user_id = u.id 
                             WHERE s.user_id = ? 
                             ORDER BY s.created_at DESC");
        $stmt->execute([$targetUserId]);
    }
    $shipments = $stmt->fetchAll();

    $shipments = array_map(function ($s) {
        $s['_id'] = $s['id'];
        return $s;
    }, $shipments);

    sendResponse($shipments);

} catch (PDOException $e) {
    sendResponse(["message" => "Error: " . $e->getMessage()], 500);
}
?>