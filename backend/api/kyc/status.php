<?php
// backend/api/kyc/status.php
require_once '../../config.php';

$headers = apache_request_headers();
$authHeader = $headers['Authorization'] ?? '';
if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    sendResponse(["message" => "Unauthorized"], 401);
}
$tokenData = json_decode(base64_decode($matches[1]), true);
$userId = $tokenData['id'] ?? null;

try {
    $stmt = $pdo->prepare("SELECT kyc_status FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) {
        sendResponse(["message" => "User not found"], 404);
    }

    // Fetch detailed KYC data
    $stmt = $pdo->prepare("SELECT * FROM kyc_details WHERE user_id = ?");
    $stmt->execute([$userId]);
    $details = $stmt->fetch();

    sendResponse([
        "status" => $user['kyc_status'] ?: 'not_submitted',
        "rejectionReason" => $details['rejection_reason'] ?? null,
        "fullName" => $details['full_name'] ?? null,
        "aadhaarNumber" => $details['aadhaar_number'] ?? null,
        "panNumber" => $details['pan_number'] ?? null,
        "address" => isset($details['address_details']) ? json_decode($details['address_details'], true) : null,
        "documentPaths" => [
            "aadhaarFront" => $details['aadhaar_front'] ?? null,
            "aadhaarBack" => $details['aadhaar_back'] ?? null,
            "panCard" => $details['pan_card'] ?? null,
            "electricityBill" => $details['electricity_bill'] ?? null
        ]
    ]);
} catch (PDOException $e) {
    sendResponse(["message" => "Database error"], 500);
}
?>