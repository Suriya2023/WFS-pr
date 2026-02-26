<?php
// backend/api/kyc/submit.php
require_once __DIR__ . '/../../config.php';

$token = verifyToken();
if (!$token) {
    sendResponse(array("message" => "Unauthorized"), 401);
}
$tokenData = json_decode(base64_decode($token), true);
$userId = isset($tokenData['id']) ? $tokenData['id'] : null;

if (!$userId) {
    sendResponse(array("message" => "Invalid session"), 401);
}

// Handle File Uploads
$uploadDir = __DIR__ . '/../../uploads/kyc/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

try {
    $uploadedFiles = array();
    $fileFields = array('aadhaarFront', 'aadhaarBack', 'panCard', 'electricityBill');

    foreach ($fileFields as $field) {
        if (isset($_FILES[$field]) && $_FILES[$field]['error'] === UPLOAD_ERR_OK) {
            $tmpName = $_FILES[$field]['tmp_name'];
            $extension = pathinfo($_FILES[$field]['name'], PATHINFO_EXTENSION);
            $fileName = $userId . '_' . $field . '_' . time() . '.' . $extension;
            $targetPath = $uploadDir . $fileName;

            if (move_uploaded_file($tmpName, $targetPath)) {
                $uploadedFiles[$field] = 'uploads/kyc/' . $fileName;
            } else {
                debugLog("Failed to move uploaded file: $field");
            }
        }
    }

    // 1. Update user status
    $stmt = $pdo->prepare("UPDATE users SET kyc_status = 'pending' WHERE id = ?");
    $stmt->execute(array($userId));

    // 2. Save details to kyc_details table
    $fullName = isset($_POST['fullName']) ? $_POST['fullName'] : '';
    $aadhaar = isset($_POST['aadhaarNumber']) ? $_POST['aadhaarNumber'] : '';
    $pan = isset($_POST['panNumber']) ? $_POST['panNumber'] : '';
    $addressData = json_decode(isset($_POST['address']) ? $_POST['address'] : '{}', true);
    $address = json_encode($addressData);

    $stmt = $pdo->prepare("INSERT INTO kyc_details (user_id, full_name, aadhaar_number, pan_number, address_details, status, aadhaar_front, aadhaar_back, pan_card, electricity_bill) 
                          VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?) 
                          ON DUPLICATE KEY UPDATE 
                            full_name = VALUES(full_name), 
                            aadhaar_number = VALUES(aadhaar_number), 
                            pan_number = VALUES(pan_number),
                            address_details = VALUES(address_details),
                            status = 'pending',
                            aadhaar_front = COALESCE(VALUES(aadhaar_front), aadhaar_front),
                            aadhaar_back = COALESCE(VALUES(aadhaar_back), aadhaar_back),
                            pan_card = COALESCE(VALUES(pan_card), pan_card),
                            electricity_bill = COALESCE(VALUES(electricity_bill), electricity_bill)");

    $stmt->execute(array(
        $userId,
        $fullName,
        $aadhaar,
        $pan,
        $address,
        isset($uploadedFiles['aadhaarFront']) ? $uploadedFiles['aadhaarFront'] : null,
        isset($uploadedFiles['aadhaarBack']) ? $uploadedFiles['aadhaarBack'] : null,
        isset($uploadedFiles['panCard']) ? $uploadedFiles['panCard'] : null,
        isset($uploadedFiles['electricityBill']) ? $uploadedFiles['electricityBill'] : null
    ));

    sendResponse(array("message" => "KYC submitted successfully", "success" => true));
} catch (PDOException $e) {
    sendResponse(array("message" => "Database error: " . $e->getMessage()), 500);
}
?>