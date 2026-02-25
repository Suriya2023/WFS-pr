<?php
// backend/api/orders.php
require_once '../config.php';

$headers = apache_request_headers();
$authHeader = $headers['Authorization'] ?? '';
if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    sendResponse(["message" => "Unauthorized"], 401);
}
$tokenData = json_decode(base64_decode($matches[1]), true);
$userId = $tokenData['id'] ?? null;

$idQuery = $_GET['id'] ?? null;

// Ensure user_addresses table exists
$pdo->exec("CREATE TABLE IF NOT EXISTS user_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address1 TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    country VARCHAR(100) DEFAULT 'India',
    isDefault TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)");

try {
    if ($idQuery) {
        // Fetch Single Order with all fields including pickup address
        $stmt = $pdo->prepare("SELECT s.*, 
                             u.email as creator_email,
                             ua.name as pa_name, ua.phone as pa_phone,
                             ua.address1 as pa_address, ua.city as pa_city,
                             ua.state as pa_state, ua.pincode as pa_pincode
                             FROM shipments s 
                             JOIN users u ON s.user_id = u.id 
                             LEFT JOIN user_addresses ua ON s.pickup_address_id = ua.id
                             WHERE s.id = ? OR s.tracking_id = ?");
        $stmt->execute([$idQuery, $idQuery]);
        $order = $stmt->fetch();

        if (!$order) {
            sendResponse(["message" => "Order not found"], 404);
            exit;
        }

        // We send the whole database object as well as some formatted keys for retro-compatibility
        $order['orderId'] = $order['tracking_id'] ?: 'ORD-' . str_pad($order['id'], 6, '0', STR_PAD_LEFT);
        $order['trackingId'] = $order['tracking_id'];
        $order['_id'] = $order['id'];
        $order['deadWeight'] = $order['deadWeight'] ?: $order['weight'];
        $order['shippingCost'] = $order['shippingCost'] ?: 0;
        $order['items'] = json_decode($order['items'] ?? '[]', true);
        // Attach resolved pickup address (from joined pickup_addresses table or stored pickup_* fields)
        $order['pickup'] = [
            'name' => $order['pa_name'] ?: $order['pickup_name'] ?: '',
            'phone' => $order['pa_phone'] ?: $order['pickup_phone'] ?: '',
            'address' => $order['pa_address'] ?: $order['pickup_address'] ?: '',
            'city' => $order['pa_city'] ?: $order['pickup_city'] ?: '',
            'state' => $order['pa_state'] ?: $order['pickup_state'] ?: '',
            'pincode' => $order['pa_pincode'] ?: $order['pickup_pincode'] ?: ''
        ];

        // Fetch History
        $histStmt = $pdo->prepare("SELECT * FROM shipment_history WHERE shipment_id = ? ORDER BY created_at DESC");
        $histStmt->execute([$order['id']]);
        $order['history'] = $histStmt->fetchAll();

        if (empty($order['history'])) {
            $order['history'] = [
                [
                    'id' => 0,
                    'status' => $order['status'],
                    'location' => 'BGL System',
                    'remark' => 'Order recognized by network.',
                    'created_at' => $order['created_at']
                ]
            ];
        }

        sendResponse($order);
        exit;
    }

    // List logic (original)
    $status = $_GET['status'] ?? 'all';
    if ($status === 'all') {
        $stmt = $pdo->prepare("SELECT * FROM shipments WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$userId]);
    } else {
        $stmt = $pdo->prepare("SELECT * FROM shipments WHERE user_id = ? AND status = ? ORDER BY created_at DESC");
        $stmt->execute([$userId, $status]);
    }
    $orders = $stmt->fetchAll();

    $formatted = array_map(function ($o) {
        $o['_id'] = $o['id'];
        return $o;
    }, $orders);

    sendResponse($formatted);
} catch (PDOException $e) {
    sendResponse(["message" => "Database error: " . $e->getMessage()], 500);
}
?>