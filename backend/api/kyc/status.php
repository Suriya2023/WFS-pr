<?php
// backend/api/kyc/status.php
require_once __DIR__ . '/../../config.php';

$token = verifyToken();
if (!$token) {
    sendResponse(array("message" => "Unauthorized"), 401);
}
$tokenData = json_decode(base64_decode($token), true);
$userId = isset($tokenData['id']) ? $tokenData['id'] : null;

try {
    $stmt = $pdo->prepare("SELECT kyc_status FROM users WHERE id = ?");
    $stmt->execute(array($userId));
    $user = $stmt->fetch();

    if (!$user) {
        sendResponse(array("message" => "User not found"), 404);
    }

    $stmt = $pdo->prepare("SELECT * FROM kyc_details WHERE user_id = ?");
    $stmt->execute(array($userId));
    $details = $stmt->fetch();

    sendResponse(array(
        "status" => $user['kyc_status'] ? $user['kyc_status'] : 'not_submitted',
        "rejectionReason" => isset($details['rejection_reason']) ? $details['rejection_reason'] : null,
        "fullName" => isset($details['full_name']) ? $details['full_name'] : null,
        "aadhaarNumber" => isset($details['aadhaar_number']) ? $details['aadhaar_number'] : null,
        "panNumber" => isset($details['pan_number']) ? $details['pan_number'] : null,
        "address" => isset($details['address_details']) ? json_decode($details['address_details'], true) : null,
        "documentPaths" => array(
            "aadhaarFront" => isset($details['aadhaar_front']) ? $details['aadhaar_front'] : null,
            "aadhaarBack" => isset($details['aadhaar_back']) ? $details['aadhaar_back'] : null,
            "panCard" => isset($details['pan_card']) ? $details['pan_card'] : null,
            "electricityBill" => isset($details['electricity_bill']) ? $details['electricity_bill'] : null
        )
    ));
} catch (PDOException $e) {
    sendResponse(array("message" => "Database error"), 500);
}
?>