<?php
// backend/api/kyc/list.php
require_once '../../config.php';

$token = verifyToken();
if (!$token) {
    sendResponse(["message" => "Unauthorized"], 401);
}

// Verify if admin (simplified for now, token decode logic)
$tokenData = json_decode(base64_decode($token), true);
$userId = $tokenData['id'] ?? null;

// Basic role check - should be improved with a proper check
$stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
$stmt->execute([$userId]);
$user = $stmt->fetch();
if ($user['role'] !== 'admin') {
    sendResponse(["message" => "Forbidden"], 403);
}

try {
    $stmt = $pdo->prepare("
        SELECT k.*, u.id as u_id, u.firstname, u.lastname, u.email, u.mobile, u.company_name, u.gst_number
        FROM kyc_details k 
        JOIN users u ON k.user_id = u.id 
        ORDER BY k.created_at DESC
    ");
    $stmt->execute();
    $results = $stmt->fetchAll();

    $formatted = array_map(function ($row) {
        return [
            '_id' => $row['id'],
            'fullName' => $row['full_name'],
            'aadhaarNumber' => $row['aadhaar_number'],
            'panNumber' => $row['pan_number'],
            'status' => $row['status'],
            'addressDetails' => $row['address_details'],
            'submittedAt' => $row['created_at'],
            'user' => [
                'id' => $row['u_id'],
                'firstname' => $row['firstname'],
                'lastname' => $row['lastname'],
                'email' => $row['email'],
                'mobile' => $row['mobile'],
                'company_name' => $row['company_name'],
                'gst_number' => $row['gst_number']
            ]
        ];
    }, $results);

    sendResponse($formatted);
} catch (PDOException $e) {
    sendResponse(["message" => "Database error: " . $e->getMessage()], 500);
}
?>