<?php
// backend/api/kyc/delete.php
require_once __DIR__ . '/../../config.php';

$token = verifyToken();
if (!$token) {
    sendResponse(array("message" => "Unauthorized"), 401);
}

// Verify if admin
$tokenData = json_decode(base64_decode($token), true);
$userId = isset($tokenData['id']) ? $tokenData['id'] : null;

try {
    $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute(array($userId));
    $user = $stmt->fetch();
    if (!$user || $user['role'] !== 'admin') {
        sendResponse(array("message" => "Forbidden"), 403);
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $kycId = isset($data['kycId']) ? $data['kycId'] : null;

    if (!$kycId) {
        sendResponse(array("message" => "KYC ID required"), 400);
    }

    // Before deleting, update the user's kyc_status back to not_submitted
    $stmt = $pdo->prepare("SELECT user_id FROM kyc_details WHERE id = ?");
    $stmt->execute(array($kycId));
    $kyc = $stmt->fetch();

    if ($kyc) {
        $stmt = $pdo->prepare("UPDATE users SET kyc_status = 'not_submitted' WHERE id = ?");
        $stmt->execute(array($kyc['user_id']));
    }

    $stmt = $pdo->prepare("DELETE FROM kyc_details WHERE id = ?");
    $stmt->execute(array($kycId));

    sendResponse(array("message" => "KYC record deleted successfully"));
} catch (PDOException $e) {
    sendResponse(array("message" => "Database error: " . $e->getMessage()), 500);
}
?>