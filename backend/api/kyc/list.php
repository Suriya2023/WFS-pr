<?php
// backend/api/kyc/list.php
require_once __DIR__ . '/../../config.php';

$token = verifyToken();
if (!$token) {
    sendResponse(array("message" => "Unauthorized"), 401);
}

$tokenData = json_decode(base64_decode($token), true);
$userId = isset($tokenData['id']) ? $tokenData['id'] : null;

$stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
$stmt->execute(array($userId));
$user = $stmt->fetch();

if (!$user || $user['role'] !== 'admin') {
    sendResponse(array("message" => "Forbidden"), 403);
}

try {
    $stmt = $pdo->prepare("
        SELECT 
            u.id as u_id, u.firstname, u.lastname, u.email, u.mobile, u.company_name, u.gst_number, u.kyc_status,
            k.id as k_id, k.full_name, k.aadhaar_number, k.pan_number, k.address_details, k.created_at as submitted_at, k.status as kyc_record_status
        FROM users u
        LEFT JOIN kyc_details k ON u.id = k.user_id 
        WHERE u.role = 'user'
        ORDER BY k.created_at DESC, u.id DESC
    ");
    $stmt->execute();
    $results = $stmt->fetchAll();

    $formatted = array();
    foreach ($results as $row) {
        $address = $row['address_details'];
        if ($address && strpos($address, '{') === 0) {
            try {
                $addrObj = json_decode($address, true);
                if ($addrObj) {
                    $parts = array();
                    $normalized = array_change_key_case($addrObj, CASE_LOWER);
                    if (!empty($normalized['addressline1']))
                        $parts[] = $normalized['addressline1'];
                    if (!empty($normalized['addressline2']))
                        $parts[] = $normalized['addressline2'];
                    if (!empty($normalized['city']))
                        $parts[] = $normalized['city'];
                    if (!empty($normalized['state']))
                        $parts[] = $normalized['state'];
                    if (!empty($normalized['pincode']))
                        $parts[] = $normalized['pincode'];
                    if (!empty($parts))
                        $address = implode(", ", $parts);
                }
            } catch (Exception $e) {
            }
        }

        $finalStatus = $row['kyc_record_status'] ? $row['kyc_record_status'] : ($row['kyc_status'] ? $row['kyc_status'] : 'not_submitted');

        $formatted[] = array(
            '_id' => $row['k_id'] ? $row['k_id'] : 'user_' . $row['u_id'],
            'fullName' => $row['full_name'] ? $row['full_name'] : ($row['firstname'] . ' ' . $row['lastname']),
            'aadhaarNumber' => $row['aadhaar_number'] ? $row['aadhaar_number'] : '',
            'panNumber' => $row['pan_number'] ? $row['pan_number'] : '',
            'status' => $finalStatus,
            'addressDetails' => $address ? $address : 'No Address Provided',
            'submittedAt' => $row['submitted_at'],
            'user' => array(
                'id' => $row['u_id'],
                'firstname' => $row['firstname'],
                'lastname' => $row['lastname'],
                'email' => $row['email'],
                'mobile' => $row['mobile'],
                'company_name' => $row['company_name'],
                'gst_number' => $row['gst_number']
            )
        );
    }

    sendResponse($formatted);
} catch (PDOException $e) {
    sendResponse(array("message" => "Database error: " . $e->getMessage()), 500);
}
?>