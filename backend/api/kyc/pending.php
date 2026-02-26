<?php
// backend/api/kyc/pending.php
require_once __DIR__ . '/../../config.php';

try {
    $stmt = $pdo->prepare("SELECT k.*, u.id as u_id, u.firstname, u.lastname FROM kyc_details k JOIN users u ON k.user_id = u.id WHERE k.status = 'pending'");
    $stmt->execute();
    $results = $stmt->fetchAll();

    $formatted = array();
    foreach ($results as $row) {
        $formatted[] = array(
            '_id' => $row['id'],
            'fullName' => $row['full_name'],
            'aadhaarNumber' => $row['aadhaar_number'],
            'panNumber' => $row['pan_number'],
            'aadhaarFrontImage' => $row['aadhaar_front'],
            'aadhaarBackImage' => $row['aadhaar_back'],
            'panCardImage' => $row['pan_card'],
            'electricityBillImage' => $row['electricity_bill'],
            'userId' => array(
                '_id' => $row['u_id'],
                'firstname' => $row['firstname'],
                'lastname' => $row['lastname']
            )
        );
    }

    sendResponse($formatted);
} catch (PDOException $e) {
    sendResponse(array());
}
?>