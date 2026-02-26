<?php
// backend/api/user/profile.php
require_once __DIR__ . '/../../config.php';

$method = $_SERVER['REQUEST_METHOD'];

$token = verifyToken();
if (!$token) {
    sendResponse(array("message" => "Unauthorized access."), 401);
}

try {
    $tokenData = json_decode(base64_decode($token), true);
    $userId = isset($tokenData['id']) ? $tokenData['id'] : null;

    if (!$userId) {
        sendResponse(array("message" => "Invalid session token."), 401);
    }

    if ($method == 'GET') {
        $sql = "SELECT id, firstname, lastname, email, mobile, role, wallet_balance, kyc_status, profile_image, company_name, gst_number, pan_number, aadhaar_number, shipping_margin, billing_address, billing_city, billing_state, billing_pincode, billing_country FROM users WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(array($userId));
        $user = $stmt->fetch();

        if (!$user) {
            sendResponse(array("message" => "User account not found."), 404);
        }

        $user['profileImage'] = isset($user['profile_image']) ? $user['profile_image'] : '';
        $user['kycStatus'] = isset($user['kyc_status']) ? $user['kyc_status'] : 'not_submitted';

        header('Content-Type: application/json');
        echo json_encode($user);
        exit;

    } elseif ($method == 'PUT' || $method == 'POST') {
        $input = json_decode(file_get_contents("php://input"), true);
        if (!$input) {
            sendResponse(array("message" => "No data provided."), 400);
        }

        $fields = array('firstname', 'lastname', 'mobile', 'company_name', 'gst_number', 'pan_number', 'aadhaar_number', 'billing_address', 'billing_city', 'billing_state', 'billing_pincode', 'billing_country');

        $setParts = array();
        $params = array();
        foreach ($fields as $field) {
            if (isset($input[$field])) {
                $setParts[] = "`$field` = ?";
                $params[] = $input[$field];
            }
        }

        if (isset($input['shipping_margin'])) {
            $setParts[] = "`shipping_margin` = ?";
            $params[] = (float) $input['shipping_margin'];
        }

        if (empty($setParts)) {
            sendResponse(array("message" => "No fields to update."), 400);
        }

        $sql = "UPDATE users SET " . implode(", ", $setParts) . " WHERE id = ?";
        $params[] = $userId;

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        sendResponse(true, "Profile updated successfully.");
    }

} catch (PDOException $e) {
    debugLog("Profile API PDO Error: " . $e->getMessage());
    sendResponse(array("message" => "Database error: " . $e->getMessage()), 500);
} catch (Exception $e) {
    debugLog("Profile API Error: " . $e->getMessage());
    sendResponse(array("message" => "Error: " . $e->getMessage()), 500);
}
?>