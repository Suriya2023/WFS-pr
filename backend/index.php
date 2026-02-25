// backend/index.php
// Central API Entry Point
require_once 'config.php';

// Get request path or query param
// For simplicity in this setup: ?endpoint=auth&action=login
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';

switch ($endpoint) {
    case 'auth':
        require_once 'api/auth.php';
        break;
    case 'orders':
        require_once 'api/shipment.php'; // Mapping orders to shipment logic
        break;
    case 'shipment':
        require_once 'api/shipment.php';
        break;
    case 'admin':
        require_once 'api/admin.php';
        break;
    case 'tracking':
        require_once 'api/tracking.php'; // If exists
        break;
    case 'kyc':
        require_once 'api/kyc.php'; // If exists
        break;
    case 'settings':
         // Minimal settings handler if needed
         sendResponse(true, "Settings", ["default_item_value" => 500, "shipping_base_price" => 100]);
         break;
    default:
        // Default Landing / Status
        echo json_encode([
            "status" => "online",
            "message" => "BGL Express Backend API v1.0",
            "usage" => "?endpoint={auth|orders|shipment|admin}&action={...}"
        ]);
        break;
}
exit();
