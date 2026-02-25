<?php
// backend/api/kyc/verify.php
require_once '../../config.php';

$input = json_decode(file_get_contents("php://input"), true);
$kycId = $input['kycId'] ?? null;
$status = $input['status'] ?? 'verified';

if (!$kycId) sendResponse(["message" => "KYC ID required"], 400);

try {
    $stmt = $pdo->prepare("UPDATE kyc_details SET status = ? WHERE id = ?");
    $stmt->execute([$status, $kycId]);
    
    // Also update user's kyc_status
    $stmt = $pdo->prepare("UPDATE users SET kyc_status = ? WHERE id = (SELECT user_id FROM kyc_details WHERE id = ?)");
    $stmt->execute([$status, $kycId]);

    sendResponse(["message" => "KYC updated"]);
} catch (PDOException $e) { sendResponse(["message" => $e->getMessage()], 500); }
?>
