<?php
// backend/api/kyc/verify.php
require_once __DIR__ . '/../../config.php';

$token = verifyToken();
if (!$token) {
    sendResponse(array("message" => "Unauthorized"), 401);
}

$input = json_decode(file_get_contents("php://input"), true);
$kycId = isset($input['kycId']) ? $input['kycId'] : null;
$status = isset($input['status']) ? $input['status'] : 'verified';

if (!$kycId) {
    sendResponse(array("message" => "KYC ID required"), 400);
}

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("SELECT user_id FROM kyc_details WHERE id = ?");
    $stmt->execute(array($kycId));
    $kycRecord = $stmt->fetch();

    if (!$kycRecord) {
        throw new Exception("KYC record not found");
    }

    $userId = $kycRecord['user_id'];

    if ($status === 'rejected') {
        $stmt = $pdo->prepare("DELETE FROM kyc_details WHERE id = ?");
        $stmt->execute(array($kycId));

        $stmt = $pdo->prepare("UPDATE users SET kyc_status = 'not_submitted' WHERE id = ?");
        $stmt->execute(array($userId));

        $pdo->commit();
        sendResponse(array("message" => "KYC Rejected: Data cleared and user reset to Not Submitted"));
    } else {
        $stmt = $pdo->prepare("UPDATE kyc_details SET status = ? WHERE id = ?");
        $stmt->execute(array($status, $kycId));

        $stmt = $pdo->prepare("UPDATE users SET kyc_status = ? WHERE id = ?");
        $stmt->execute(array($status, $userId));

        $pdo->commit();
        sendResponse(array("message" => "KYC status updated successfully to $status"));
    }
} catch (Exception $e) {
    if ($pdo && $pdo->inTransaction())
        $pdo->rollBack();
    sendResponse(array("message" => $e->getMessage()), 500);
}
?>