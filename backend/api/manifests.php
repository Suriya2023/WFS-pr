<?php
// backend/api/manifests.php
require_once '../config.php';

$token = verifyToken();
if (!$token) {
    sendResponse(["message" => "Unauthorized"], 401);
}

$tokenData = json_decode(base64_decode($token), true);
$userId = isset($tokenData['id']) ? $tokenData['id'] : null;

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? $_GET['id'] : null;

try {
    if ($method === 'GET') {
        if ($id) {
            // Get single manifest detail
            $stmt = $pdo->prepare("SELECT m.*, 
                                 (SELECT COUNT(*) FROM shipments WHERE manifest_id = m.id) as packetCount,
                                 (SELECT SUM(shippingCost) FROM shipments WHERE manifest_id = m.id) as manifestValue
                                 FROM manifests m 
                                 JOIN shipments s ON m.id = s.manifest_id 
                                 WHERE (m.id = ? OR m.manifest_code = ?) AND s.user_id = ? 
                                 LIMIT 1");
            $stmt->execute([$id, $id, $userId]);
            $manifest = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$manifest) {
                sendResponse(["message" => "Manifest not found"], 404);
            }

            // Fetch shipments for this manifest
            $stmt = $pdo->prepare("SELECT id as _id, tracking_id as orderId, consignee_name, consignee_phone, consignee_address, consignee_city, consignee_country, deadWeight, weight, shippingCost, courierPartner, status, items FROM shipments WHERE manifest_id = ? AND user_id = ?");
            $stmt->execute([$manifest['id'], $userId]);
            $shipments = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($shipments as &$s) {
                $s['consignee'] = [
                    'name' => $s['consignee_name'],
                    'city' => $s['consignee_city'],
                    'country' => $s['consignee_country']
                ];
                $s['weight'] = ['charged' => $s['deadWeight'] ?: $s['weight']];
            }

            $manifest['orders'] = $shipments; // Frontend expects .orders
            $manifest['shipments'] = $shipments;

            // Mock pickup address from first shipment or some default
            $manifest['pickupAddress'] = [
                'name' => 'Main Warehouse',
                'address1' => 'Plot 12, Sector 18',
                'city' => 'Gurugram',
                'state' => 'Haryana',
                'pincode' => '122015',
                'phone' => '9999999999'
            ];

            sendResponse($manifest);

        } else {
            // List all manifests for user
            $stmt = $pdo->prepare("SELECT DISTINCT m.*, 
                                 (SELECT COUNT(*) FROM shipments s2 WHERE s2.manifest_id = m.id) as packetCount,
                                 (SELECT SUM(shippingCost) FROM shipments s3 WHERE s3.manifest_id = m.id) as manifestValue
                                 FROM manifests m 
                                 JOIN shipments s ON m.id = s.manifest_id 
                                 WHERE s.user_id = ? 
                                 ORDER BY m.created_at DESC");
            $stmt->execute([$userId]);
            $manifests = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($manifests as &$m) {
                $m['manifestCode'] = $m['manifest_code'];
                $m['createdAt'] = $m['created_at'];
                // Again, mock or fetch pickup city
                $m['pickupAddress'] = ['city' => 'Gurugram'];
            }

            sendResponse($manifests);
        }
    } else {
        sendResponse(["message" => "Method not allowed"], 405);
    }
} catch (PDOException $e) {
    sendResponse(["message" => "Database error: " . $e->getMessage()], 500);
}
?>