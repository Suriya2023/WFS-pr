<?php
// backend/api/kyc/delete.php
require_once '../../config.php';

$token = verifyToken();
if (!$token) {
    sendResponse(["message" => "Unauthorized"], 401);
}

// Verify if admin
$tokenData = json_decode(base64_decode($token), true);
$userId = $tokenData['id'] ?? null;

$stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
$stmt->execute([$userId]);
$user = $stmt->fetch();
if ($user['role'] !== 'admin') {
    sendResponse(["message" => "Forbidden"], 403);
}

$data = json_decode(file_get_contents("php://input"), true);
$kycId = $data['kycId'] ?? null;

if (!$kycId) {
    sendResponse(["message" => "KYC ID required"], 400);
}

try {
    // Before deleting, update the user's kyc_status back to not_submitted
    $stmt = $pdo->prepare("SELECT user_id FROM kyc_details WHERE id = ?");
    $stmt->execute([$kycId]);
    $kyc = $stmt->fetch();

    if ($kyc) {
        $stmt = $pdo->prepare("UPDATE users SET kyc_status = 'not_submitted' WHERE id = ?");
        $stmt->execute([$kyc['user_id']]);
    }

    $stmt = $pdo->prepare("DELETE FROM kyc_details WHERE id = ?");
    $stmt->execute([$kycId]);

    sendResponse(["message" => "KYC record deleted successfully"]);
} catch (PDOException $e) {
    sendResponse(["message" => "Database error: " . $e->getMessage()], 500);
}
?>