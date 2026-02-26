<?php
// backend/api/kyc/verify.php
require_once '../../config.php';

$input = json_decode(file_get_contents("php://input"), true);
$kycId = $input['kycId'] ?? null;
$status = $input['status'] ?? 'verified';

if (!$kycId)
    sendResponse(["message" => "KYC ID required"], 400);

try {
    $pdo->beginTransaction();

    // Get user_id first
    $stmt = $pdo->prepare("SELECT user_id FROM kyc_details WHERE id = ?");
    $stmt->execute([$kycId]);
    $kycRecord = $stmt->fetch();

    if (!$kycRecord) {
        throw new Exception("KYC record not found");
    }

    $userId = $kycRecord['user_id'];

    if ($status === 'rejected') {
        // If rejected, remove the data and let them re-apply
        $stmt = $pdo->prepare("DELETE FROM kyc_details WHERE id = ?");
        $stmt->execute([$kycId]);

        $stmt = $pdo->prepare("UPDATE users SET kyc_status = 'not_submitted' WHERE id = ?");
        $stmt->execute([$userId]);

        $pdo->commit();
        sendResponse(["message" => "KYC Rejected: Data cleared and user reset to Not Submitted"]);
    } else {
        // Normal verification
        $stmt = $pdo->prepare("UPDATE kyc_details SET status = ? WHERE id = ?");
        $stmt->execute([$status, $kycId]);

        $stmt = $pdo->prepare("UPDATE users SET kyc_status = ? WHERE id = ?");
        $stmt->execute([$status, $userId]);

        $pdo->commit();
        sendResponse(["message" => "KYC status updated successfully to $status"]);
    }

} catch (Exception $e) {
    if ($pdo->inTransaction())
        $pdo->rollBack();
    sendResponse(["message" => $e->getMessage()], 500);
}
?>