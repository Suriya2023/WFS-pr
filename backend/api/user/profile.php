<?php
// backend/api/user/profile.php
require_once __DIR__ . '/../../config.php';

// Auth Check
$authHeader = '';
if (function_exists('apache_request_headers')) {
    $headers = apache_request_headers();
    $authHeader = $headers['Authorization'] ?? '';
}
if (!$authHeader) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
}

if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    sendResponse(["message" => "Unauthorized access."], 401);
}

$tokenData = json_decode(base64_decode($matches[1]), true);
$userId = $tokenData['id'] ?? null;

if (!$userId) {
    sendResponse(["message" => "Invalid token."], 401);
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method == 'GET') {
        // Fetch User Data
        $stmt = $pdo->prepare("SELECT id, firstname, lastname, email, mobile, role, wallet_balance, kyc_status, profile_image, company_name, gst_number, pan_number, aadhaar_number, shipping_margin, billing_address, billing_city, billing_state, billing_pincode, billing_country FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();

        if (!$user) {
            sendResponse(["message" => "User not found."], 404);
        }

        // Rename profile_image to profileImage for frontend compatibility
        $user['profileImage'] = $user['profile_image'];
        $user['kycStatus'] = $user['kyc_status'];

        sendResponse($user);

    } elseif ($method == 'PUT' || $method == 'POST') {
        // Update User Data
        $input = json_decode(file_get_contents("php://input"), true);

        $firstname = $input['firstname'] ?? '';
        $lastname = $input['lastname'] ?? '';
        $mobile = $input['mobile'] ?? '';
        $company_name = $input['company_name'] ?? '';
        $gst_number = $input['gst_number'] ?? '';
        $pan_number = $input['pan_number'] ?? '';
        $aadhaar_number = $input['aadhaar_number'] ?? '';
        $shipping_margin = $input['shipping_margin'] ?? 0;
        $billing_address = $input['billing_address'] ?? '';
        $billing_city = $input['billing_city'] ?? '';
        $billing_state = $input['billing_state'] ?? '';
        $billing_pincode = $input['billing_pincode'] ?? '';
        $billing_country = $input['billing_country'] ?? 'India';

        $sql = "UPDATE users SET 
                firstname = ?, 
                lastname = ?, 
                mobile = ?, 
                company_name = ?, 
                gst_number = ?, 
                pan_number = ?, 
                aadhaar_number = ?, 
                shipping_margin = ?, 
                billing_address = ?, 
                billing_city = ?, 
                billing_state = ?, 
                billing_pincode = ?, 
                billing_country = ?
                WHERE id = ?";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $firstname,
            $lastname,
            $mobile,
            $company_name,
            $gst_number,
            $pan_number,
            $aadhaar_number,
            $shipping_margin,
            $billing_address,
            $billing_city,
            $billing_state,
            $billing_pincode,
            $billing_country,
            $userId
        ]);

        sendResponse(["message" => "Profile updated successfully.", "success" => true]);
    }

} catch (PDOException $e) {
    sendResponse(["message" => "Database error: " . $e->getMessage()], 500);
}
