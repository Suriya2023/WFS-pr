<?php
// backend/api/kyc/submit.php
require_once '../../config.php';

$headers = apache_request_headers();
$authHeader = $headers['Authorization'] ?? '';
if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    sendResponse(["message" => "Unauthorized"], 401);
}
$tokenData = json_decode(base64_decode($matches[1]), true);
$userId = $tokenData['id'] ?? null;

// Handle File Uploads
$uploadDir = '../../uploads/kyc/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// In a real app, we would process $_FILES here
// For now, we simulate success and update the status to 'pending'

try {
    // 1. Update user status
    $stmt = $pdo->prepare("UPDATE users SET kyc_status = 'pending' WHERE id = ?");
    $stmt->execute([$userId]);

    // 2. Process Files
    $uploadedFiles = [];
    $fileFields = ['aadhaarFront', 'aadhaarBack', 'panCard', 'electricityBill'];

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

    // 3. Save details to kyc_details table
    $fullName = $_POST['fullName'] ?? '';
    $aadhaar = $_POST['aadhaarNumber'] ?? '';
    $pan = $_POST['panNumber'] ?? '';
    $addressData = json_decode($_POST['address'] ?? '{}', true);
    // Save as JSON string for better parsing later
    $address = json_encode($addressData);

    $stmt = $pdo->prepare("INSERT INTO kyc_details (user_id, full_name, aadhaar_number, pan_number, address_details, status, aadhaar_front, aadhaar_back, pan_card, electricity_bill) 
                          VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?) 
                          ON DUPLICATE KEY UPDATE 
                            full_name = VALUES(full_name), 
                            aadhaar_number = VALUES(aadhaar_number), 
                            pan_number = VALUES(pan_number),
                            address_details = VALUES(address_details),
                            status = 'pending',
                            aadhaar_front = VALUES(aadhaar_front),
                            aadhaar_back = VALUES(aadhaar_back),
                            pan_card = VALUES(pan_card),
                            electricity_bill = VALUES(electricity_bill)");

    $stmt->execute([
        $userId,
        $fullName,
        $aadhaar,
        $pan,
        $address,
        $uploadedFiles['aadhaarFront'] ?? null,
        $uploadedFiles['aadhaarBack'] ?? null,
        $uploadedFiles['panCard'] ?? null,
        $uploadedFiles['electricityBill'] ?? null
    ]);

    sendResponse(["message" => "KYC submitted successfully", "success" => true]);
} catch (PDOException $e) {
    sendResponse(["message" => "Database error: " . $e->getMessage()], 500);
}
?>