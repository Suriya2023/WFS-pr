<?php
// backend/api/orders.php
require_once __DIR__ . '/../config.php';

// Safe error reporting
ini_set('display_errors', 0);

$token = verifyToken();
if (!$token) {
    sendResponse(array("message" => "Unauthorized"), 401);
}

$tokenData = json_decode(base64_decode($token), true);
$userId = isset($tokenData['id']) ? $tokenData['id'] : null;

$idQuery = isset($_GET['id']) ? $_GET['id'] : null;

// Helper to repair truncated JSON
function repairTruncatedJson($json)
{
    if (empty($json))
        return '[]';
    $json = trim($json);
    if (json_decode($json) !== null)
        return $json;

    // Try to find the last complete object in the array
    $lastComma = strrpos($json, '},{');
    if ($lastComma !== false) {
        $repaired = substr($json, 0, $lastComma + 1) . ']';
        if (json_decode($repaired) !== null)
            return $repaired;
    }

    // Even more aggressive: find the last property that looks complete
    $lastProp = strrpos($json, ',"');
    if ($lastProp !== false) {
        $repaired = substr($json, 0, $lastProp) . '}]';
        if (json_decode($repaired) !== null)
            return $repaired;
    }

    return '[]';
}

try {
    if ($idQuery) {
        $stmt = $pdo->prepare("SELECT s.*, 
                             u.email as creator_email,
                             ua.name as pa_name, ua.phone as pa_phone,
                             ua.address1 as pa_address, ua.city as pa_city,
                             ua.state as pa_state, ua.pincode as pa_pincode
                             FROM shipments s 
                             JOIN users u ON s.user_id = u.id 
                             LEFT JOIN user_addresses ua ON s.pickup_address_id = ua.id
                             WHERE s.id = ? OR s.tracking_id = ?");
        $stmt->execute(array($idQuery, $idQuery));
        $order = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$order) {
            sendResponse(array("message" => "Order not found"), 404);
            exit;
        }

        // Repair items JSON if truncated (common for older records)
        $items_raw = isset($order['items']) ? $order['items'] : '[]';
        $items_dec = json_decode($items_raw, true);
        if ($items_dec === null && !empty($items_raw) && $items_raw !== 'null') {
            $repaired = repairTruncatedJson($items_raw);
            $items_dec = json_decode($repaired, true);
        }
        $order['items'] = $items_dec ? $items_dec : array();

        // Ensure fallback for top-level fields
        $order['orderId'] = $order['tracking_id'] ? $order['tracking_id'] : 'ORD-' . str_pad($order['id'], 6, '0', STR_PAD_LEFT);
        $order['trackingId'] = $order['tracking_id'];
        $order['_id'] = $order['id'];

        $order['deadWeight'] = isset($order['deadWeight']) ? $order['deadWeight'] : (isset($order['weight']) ? $order['weight'] : 0);
        $order['shippingCost'] = isset($order['shippingCost']) ? $order['shippingCost'] : 0;

        // Pickup Object
        $p = array(
            'name' => (isset($order['pa_name']) && $order['pa_name']) ? $order['pa_name'] : (isset($order['pickup_name']) ? $order['pickup_name'] : ''),
            'phone' => (isset($order['pa_phone']) && $order['pa_phone']) ? $order['pa_phone'] : (isset($order['pickup_phone']) ? $order['pickup_phone'] : ''),
            'address' => (isset($order['pa_address']) && $order['pa_address']) ? $order['pa_address'] : (isset($order['pickup_address']) ? $order['pickup_address'] : ''),
            'city' => (isset($order['pa_city']) && $order['pa_city']) ? $order['pa_city'] : (isset($order['pickup_city']) ? $order['pickup_city'] : ''),
            'state' => (isset($order['pa_state']) && $order['pa_state']) ? $order['pa_state'] : (isset($order['pickup_state']) ? $order['pickup_state'] : ''),
            'pincode' => (isset($order['pa_pincode']) && $order['pa_pincode']) ? $order['pa_pincode'] : (isset($order['pickup_pincode']) ? $order['pickup_pincode'] : '')
        );
        $order['pickup'] = $p;

        // Spread back to top level for frontend {order.pa_name} etc
        $order['pa_name'] = $p['name'];
        $order['pa_phone'] = $p['phone'];
        $order['pa_address'] = $p['address'];
        $order['pa_city'] = $p['city'];
        $order['pa_state'] = $p['state'];
        $order['pa_pincode'] = $p['pincode'];

        // Ensure destination fields for top level
        $order['consignee_name'] = isset($order['consignee_name']) ? $order['consignee_name'] : (isset($order['receiver_name']) ? $order['receiver_name'] : '');
        $order['consignee_phone'] = isset($order['consignee_phone']) ? $order['consignee_phone'] : (isset($order['receiver_mobile']) ? $order['receiver_mobile'] : '');
        $order['consignee_address'] = isset($order['consignee_address']) ? $order['consignee_address'] : (isset($order['receiver_address']) ? $order['receiver_address'] : '');

        // Fetch History
        $histStmt = $pdo->prepare("SELECT * FROM shipment_history WHERE shipment_id = ? ORDER BY created_at DESC");
        $histStmt->execute(array($order['id']));
        $history = $histStmt->fetchAll(PDO::FETCH_ASSOC);
        $order['history'] = $history;

        if (empty($order['history'])) {
            $order['history'] = array(
                array(
                    'id' => 0,
                    'status' => $order['status'],
                    'location' => 'WFS System',
                    'remark' => 'Order recognized by network.',
                    'created_at' => $order['created_at']
                )
            );
        }

        sendResponse($order);
    } else {
        $status = isset($_GET['status']) ? $_GET['status'] : 'all';
        $params = array($userId);
        $sql = "SELECT * FROM shipments WHERE user_id = ?";
        if ($status !== 'all') {
            $sql .= " AND status = ?";
            $params[] = $status;
        }
        $sql .= " ORDER BY created_at DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $formatted = array();
        foreach ($orders as $o) {
            $o['_id'] = $o['id'];
            $formatted[] = $o;
        }

        sendResponse($formatted);
    }
} catch (PDOException $e) {
    sendResponse(array("message" => "Database error"), 500);
}
?>