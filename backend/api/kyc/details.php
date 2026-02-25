<?php
// backend/api/kyc/details.php
require_once '../../config.php';

$headers = function_exists('apache_request_headers') ? apache_request_headers() : [];
$authHeader = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';

if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    sendResponse(["message" => "Unauthorized"], 401);
}

$tokenData = json_decode(base64_decode($matches[1]), true);
$tokenUserId = $tokenData['id'] ?? null;

if (!$tokenUserId) {
    sendResponse(["message" => "Invalid token"], 401);
}

// Always fetch role from DB — don't trust token role (supports old tokens)
try {
    $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute([$tokenUserId]);
    $requester = $stmt->fetch();
    $role = $requester['role'] ?? 'user';
} catch (PDOException $e) {
    sendResponse(["message" => "Auth DB error"], 500);
}

// Admin context: allow overriding userId via GET param
$userId = $tokenUserId;
if (isset($_GET['user_id']) && $role === 'admin') {
    $userId = intval($_GET['user_id']);
}

try {
    // 1. Get KYC Status & Profile Data from users table
    $stmt = $pdo->prepare("SELECT kyc_status, mobile, billing_pincode, billing_city, billing_state, billing_address FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    // 2. Get Details from kyc_details table
    $stmt = $pdo->prepare("SELECT * FROM kyc_details WHERE user_id = ?");
    $stmt->execute([$userId]);
    $details = $stmt->fetch();

    if (!$details && (!$user || $user['kyc_status'] === 'not_submitted' || !$user['kyc_status'])) {
        sendResponse(["status" => "not_submitted"]);
    }

    sendResponse([
        "status" => $user['kyc_status'] ?? 'not_submitted',
        "mobile" => $user['mobile'] ?? '',
        "profile_pincode" => $user['billing_pincode'] ?? '',
        "profile_city" => $user['billing_city'] ?? '',
        "profile_state" => $user['billing_state'] ?? '',
        "profile_address" => $user['billing_address'] ?? '',
        // camelCase keys for frontend
        "fullName" => $details['full_name'] ?? '',
        "full_name" => $details['full_name'] ?? '',
        "aadhaarNumber" => $details['aadhaar_number'] ?? '',
        "aadhaar_number" => $details['aadhaar_number'] ?? '',
        "panNumber" => $details['pan_number'] ?? '',
        "pan_number" => $details['pan_number'] ?? '',
        // Image paths (both camelCase and snake_case)
        "aadhaarFrontImage" => $details['aadhaar_front'] ?? null,
        "aadhaar_front" => $details['aadhaar_front'] ?? null,
        "aadhaarBackImage" => $details['aadhaar_back'] ?? null,
        "aadhaar_back" => $details['aadhaar_back'] ?? null,
        "panCardImage" => $details['pan_card'] ?? null,
        "pan_card" => $details['pan_card'] ?? null,
        "address_details" => $details['address_details'] ?? '',
        "account_type" => $details['account_type'] ?? 'personal',
        "kycId" => $details['id'] ?? null,
    ]);

} catch (PDOException $e) {
    sendResponse(["message" => "Database error: " . $e->getMessage()], 500);
}
