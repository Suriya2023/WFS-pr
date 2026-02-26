<?php
// backend/api/shipment.php
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
$userId = $tokenData['id'];

if ($method == 'POST') {
    // 1. Check KYC Status (Bypass for admin)
    $stmt = $pdo->prepare("SELECT kyc_status, role FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if ($user && $user['role'] !== 'admin') {
        if ($user['kyc_status'] !== 'verified') {
            sendResponse(false, "KYC verification is required to create shipments. Your current status is: " . (isset($user['kyc_status']) ? $user['kyc_status'] : 'not_submitted'));
        }
    }

    // 2. Create Shipment
    $pickupAddressId = isset($data['pickupAddressId']) ? $data['pickupAddressId'] : '';

    // Consignee details
    $consignee = isset($data['consignee']) ? $data['consignee'] : [];
    $consignee_name = trim((isset($consignee['firstName']) ? $consignee['firstName'] : '') . ' ' . (isset($consignee['lastName']) ? $consignee['lastName'] : ''));
    $consignee_phone = isset($consignee['mobile']) ? $consignee['mobile'] : '';
    $consignee_address = isset($consignee['address1']) ? $consignee['address1'] : '';
    $destination_country = isset($consignee['country']) ? $consignee['country'] : '';

    $deadWeight = isset($data['deadWeight']) ? $data['deadWeight'] : 0;
    $shippingCost = isset($data['shippingCost']) ? $data['shippingCost'] : 0;
    $courierPartner = isset($data['courierPartner']) ? $data['courierPartner'] : '';
    $items = json_encode(isset($data['items']) ? $data['items'] : []);

    // Generate Tracking ID (Delayed until admin verification)
    $tracking_id = null;

    $sql = "INSERT INTO shipments 
            (user_id, tracking_id, consignee_name, consignee_phone, consignee_address, destination_country, deadWeight, shippingCost, courierPartner, items, status, pickup_address_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?)";

    $stmt = $pdo->prepare($sql);

    $params = [
        $userId,
        $tracking_id,
        $consignee_name,
        $consignee_phone,
        $consignee_address,
        $destination_country,
        $deadWeight,
        $shippingCost,
        $courierPartner,
        $items,
        $pickupAddressId
    ];

    if ($stmt->execute($params)) {
        $lastId = $pdo->lastInsertId();
        sendResponse(true, "Shipment created successfully", ["_id" => $lastId, "tracking_id" => $tracking_id]);
    } else {
        sendResponse(false, "Failed to create shipment");
    }

} elseif ($method == 'GET') {
    // Get Shipments
    if (isset($_GET['id'])) {
        // Single Shipment
        $stmt = $pdo->prepare("SELECT * FROM shipments WHERE id = ? AND user_id = ?");
        $stmt->execute([$_GET['id'], $userId]);
        $shipment = $stmt->fetch();
        if ($shipment) {
            $shipment['items'] = json_decode(isset($shipment['items']) ? $shipment['items'] : '[]', true);
            $shipment['orderId'] = $shipment['tracking_id'] ?: 'ORD-' . str_pad($shipment['id'], 6, '0', STR_PAD_LEFT);
            sendResponse(true, "Shipment details", $shipment);
        } else {
            sendResponse(false, "Shipment not found");
        }
    } else {
        // List Shipments
        $status = isset($_GET['status']) && $_GET['status'] != 'all' ? $_GET['status'] : null;

        $sql = "SELECT * FROM shipments WHERE user_id = ?";
        $params = [$userId];

        if ($status) {
            $sql .= " AND status = ?";
            $params[] = $status;
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $shipments = $stmt->fetchAll();

        // Decode items and add temporary orderId
        foreach ($shipments as &$s) {
            $s['items'] = json_decode(isset($s['items']) ? $s['items'] : '[]', true);
            $s['orderId'] = $s['tracking_id'] ?: 'ORD-' . str_pad($s['id'], 6, '0', STR_PAD_LEFT);
        }

        sendResponse(true, "Shipments list", $shipments);
    }

} elseif ($method == 'PUT') {
    // Update Shipment (e.g., Cancel)
    $shipmentId = isset($data['id']) ? $data['id'] : null;
    $status = isset($data['status']) ? $data['status'] : null;

    if (!$shipmentId || !$status) {
        sendResponse(false, "ID and Status required");
    }

    $stmt = $pdo->prepare("UPDATE shipments SET status = ? WHERE id = ? AND user_id = ?");
    if ($stmt->execute([$status, $shipmentId, $userId])) {
        sendResponse(true, "Shipment updated successfully");
    } else {
        sendResponse(false, "Failed to update shipment");
    }

} elseif ($method == 'DELETE') {
    // Delete Shipment
    if (!isset($_GET['id'])) {
        sendResponse(false, "ID required");
    }

    $stmt = $pdo->prepare("DELETE FROM shipments WHERE id = ? AND user_id = ?");
    if ($stmt->execute([$_GET['id'], $userId])) {
        sendResponse(true, "Shipment deleted successfully");
    } else {
        sendResponse(false, "Failed to delete shipment");
    }
}
?>