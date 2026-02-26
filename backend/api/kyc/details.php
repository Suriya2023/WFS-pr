<?php
// backend/api/kyc/details.php
require_once __DIR__ . '/../../config.php';

// Safe error reporting for debugging
ini_set('display_errors', 0); // Turn off for production-like behavior but kept log_errors
error_reporting(E_ALL);

try {
    $authHeader = '';
    if (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    }
    if (!$authHeader) {
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        }
    }

    if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        sendResponse(array("message" => "Unauthorized"), 401);
    }

    $tokenData = json_decode(base64_decode($matches[1]), true);
    $tokenUserId = isset($tokenData['id']) ? $tokenData['id'] : null;

    if (!$tokenUserId) {
        sendResponse(array("message" => "Invalid token"), 401);
    }

    $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute(array($tokenUserId));
    $requester = $stmt->fetch();
    $role = isset($requester['role']) ? $requester['role'] : 'user';

    // Admin context: allow overriding userId via GET param
    $userId = $tokenUserId;
    if (isset($_GET['user_id']) && $role === 'admin') {
        $userId = intval($_GET['user_id']);
    }

    // 1. Get KYC Status & Profile Data
    $stmt = $pdo->prepare("SELECT kyc_status, mobile, billing_pincode, billing_city, billing_state, billing_address FROM users WHERE id = ?");
    $stmt->execute(array($userId));
    $user = $stmt->fetch();

    // 2. Get Details from kyc_details table
    $stmt = $pdo->prepare("SELECT * FROM kyc_details WHERE user_id = ?");
    $stmt->execute(array($userId));
    $details = $stmt->fetch();

    if (!$details && (!$user || !isset($user['kyc_status']) || $user['kyc_status'] === 'not_submitted')) {
        sendResponse(array("status" => "not_submitted"));
    }

    // Process address_details if it's JSON
    $addressDetails = isset($details['address_details']) ? $details['address_details'] : '';
    if ($addressDetails && strpos($addressDetails, '{') === 0) {
        $addrObj = json_decode($addressDetails, true);
        if ($addrObj) {
            $parts = array();
            if (!empty($addrObj['addressLine1']))
                $parts[] = $addrObj['addressLine1'];
            if (!empty($addrObj['addressLine2']))
                $parts[] = $addrObj['addressLine2'];
            if (!empty($addrObj['city']))
                $parts[] = $addrObj['city'];
            if (!empty($addrObj['state']))
                $parts[] = $addrObj['state'];
            if (!empty($addrObj['pincode']))
                $parts[] = $addrObj['pincode'];
            if (!empty($parts))
                $addressDetails = implode(", ", $parts);
        }
    }

    sendResponse(array(
        "status" => isset($user['kyc_status']) ? $user['kyc_status'] : 'not_submitted',
        "mobile" => isset($user['mobile']) ? $user['mobile'] : '',
        "profile_pincode" => isset($user['billing_pincode']) ? $user['billing_pincode'] : '',
        "profile_city" => isset($user['billing_city']) ? $user['billing_city'] : '',
        "profile_state" => isset($user['billing_state']) ? $user['billing_state'] : '',
        "profile_address" => isset($user['billing_address']) ? $user['billing_address'] : '',
        "fullName" => isset($details['full_name']) ? $details['full_name'] : '',
        "aadhaarNumber" => isset($details['aadhaar_number']) ? $details['aadhaar_number'] : '',
        "panNumber" => isset($details['pan_number']) ? $details['pan_number'] : '',
        "aadhaarFrontImage" => isset($details['aadhaar_front']) ? $details['aadhaar_front'] : null,
        "aadhaarBackImage" => isset($details['aadhaar_back']) ? $details['aadhaar_back'] : null,
        "panCardImage" => isset($details['pan_card']) ? $details['pan_card'] : null,
        "electricityBillImage" => isset($details['electricity_bill']) ? $details['electricity_bill'] : null,
        "addressDetails" => $addressDetails,
        "aadhaar_front" => isset($details['aadhaar_front']) ? $details['aadhaar_front'] : null,
        "aadhaar_back" => isset($details['aadhaar_back']) ? $details['aadhaar_back'] : null,
        "pan_card" => isset($details['pan_card']) ? $details['pan_card'] : null,
        "account_type" => isset($details['account_type']) ? $details['account_type'] : 'personal',
        "kycId" => isset($details['id']) ? $details['id'] : null
    ));

} catch (PDOException $e) {
    debugLog("KYC Details PDO Error: " . $e->getMessage());
    sendResponse(array("message" => "Database error: " . $e->getMessage()), 500);
} catch (Exception $e) {
    debugLog("KYC Details General Error: " . $e->getMessage());
    sendResponse(array("message" => "Error: " . $e->getMessage()), 500);
}