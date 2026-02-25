<?php
// backend/api/admin.php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);

// Get token
$token = verifyToken();
if (!$token) {
    sendResponse(false, "Unauthorized");
}

// Decode token
$tokenData = json_decode(base64_decode($token), true);
$role = $tokenData['role'] ?? 'user';

if ($role !== 'admin') {
    sendResponse(false, "Access Denied");
}

if ($method == 'GET') {
    // Admin sees ALL shipments
    $stmt = $pdo->query("SELECT shipments.*, users.name as user_name FROM shipments JOIN users ON shipments.user_id = users.id ORDER BY shipments.created_at DESC");
    $shipments = $stmt->fetchAll();
    
    foreach ($shipments as &$s) {
        $s['items'] = json_decode($s['items'], true);
    }
    
    sendResponse(true, "All Shipments", $shipments);

} elseif ($method == 'PUT') {
    // Admin Updates Status
    $shipmentId = $data['id'] ?? null;
    $status = $data['status'] ?? null;
    
    if (!$shipmentId || !$status) {
        sendResponse(false, "ID and Status required");
    }

    $stmt = $pdo->prepare("UPDATE shipments SET status = ? WHERE id = ?");
    if ($stmt->execute([$status, $shipmentId])) {
        sendResponse(true, "Status updated successfully");
    } else {
        sendResponse(false, "Failed to update status");
    }
}
?>
