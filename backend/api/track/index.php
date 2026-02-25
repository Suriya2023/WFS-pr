<?php
// backend/api/track/index.php
require_once '../../config.php';

$trackingId = $_GET['id'] ?? '';

if (empty($trackingId)) {
    sendResponse(["message" => "Tracking ID required"], 400);
    exit;
}

try {
    $searchId = $trackingId;
    $isOrderId = false;

    // Handle ORD-000001 format
    if (strpos(strtoupper($trackingId), 'ORD-') === 0) {
        $searchId = (int) substr($trackingId, 4);
        $isOrderId = true;
    }

    $query = "SELECT s.*, u.firstname, u.lastname FROM shipments s JOIN users u ON s.user_id = u.id WHERE ";
    if ($isOrderId) {
        $query .= "s.id = ?";
    } else {
        $query .= "s.tracking_id = ?";
    }

    $stmt = $pdo->prepare($query);
    $stmt->execute([$searchId]);
    $shipment = $stmt->fetch();

    if (!$shipment) {
        sendResponse(["message" => "Tracking ID or Order ID not found"], 404);
        exit;
    }

    // Comprehensive Status List
    $statuses = ['draft', 'ready', 'paid', 'packed', 'manifested', 'dispatched', 'received', 'delivered'];
    $labels = [
        'draft' => 'Order Received',
        'ready' => 'Verification',
        'paid' => 'Payment Confirmed',
        'packed' => 'Label Generating',
        'manifested' => 'Pickup Scheduled',
        'dispatched' => 'Dispatched',
        'received' => 'At Delivery Hub',
        'delivered' => 'Delivered',
        'cancelled' => 'Cancelled'
    ];

    $shipmentStatus = strtolower($shipment['status']);

    // Fallback for unexpected statuses
    if (!in_array($shipmentStatus, $statuses) && $shipmentStatus !== 'cancelled') {
        $statuses[] = $shipmentStatus;
        $labels[$shipmentStatus] = ucfirst($shipmentStatus);
    }

    // Determine current progress
    $currentIndex = array_search($shipmentStatus, $statuses);
    if ($shipmentStatus === 'cancelled') {
        $currentIndex = -1; // Special handling for cancelled
    }

    // Prepare data structure to match React UI
    $response = [
        "trackingId" => $shipment['tracking_id'] ?: "ORD-" . $shipment['id'],
        "orderId" => "ORD-" . $shipment['id'],
        "status" => $shipment['status'],
        "courierPartner" => strtoupper($shipment['courierPartner'] ?: "BGL PREMIUM"),
        "origin" => [
            "city" => "Warehouse Node",
            "pincode" => "MANIFEST NODE"
        ],
        "destination" => [
            "name" => $shipment['consignee_name'] ?: $shipment['receiver_name'],
            "mobile" => $shipment['consignee_phone'] ?: $shipment['receiver_mobile'],
            "address" => $shipment['consignee_address'] ?: $shipment['receiver_address'],
            "city" => $shipment['consignee_city'] ?: "TERMINAL HUB",
            "state" => $shipment['consignee_state'] ?: "",
            "pincode" => $shipment['consignee_pincode'] ?: "TERMINAL PORT"
        ],
        "package" => [
            "weight" => floatval($shipment['weight'] ?: 0.5),
            "declaredValue" => 0,
            "items" => json_decode($shipment['items'], true) ?: []
        ],
        "timeline" => []
    ];

    // Build timeline from history
    $historyStmt = $pdo->prepare("SELECT * FROM shipment_history WHERE shipment_id = ? ORDER BY created_at DESC");
    $historyStmt->execute([$shipment['id']]);
    $history = $historyStmt->fetchAll();

    $response['timeline'] = [];
    foreach ($history as $h) {
        $response['timeline'][] = [
            "status" => $h['status'],
            "label" => $h['remark'] ?: ucfirst($h['status']),
            "completed" => true,
            "timestamp" => $h['created_at'],
            "location" => $h['location']
        ];
    }

    // Add initial entry if history is empty
    if (empty($response['timeline'])) {
        $response['timeline'][] = [
            "status" => $shipmentStatus,
            "label" => "Shipment Received",
            "completed" => true,
            "timestamp" => $shipment['created_at'],
            "location" => "BGL System"
        ];
    }

    sendResponse($response);

} catch (PDOException $e) {
    sendResponse(["message" => "Server error: " . $e->getMessage()], 500);
}
?>