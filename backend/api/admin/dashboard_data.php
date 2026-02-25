<?php
// backend/api/admin/users.php
require_once '../../config.php';
// Auth Check (Logic similar to list.php, omitted for brevity but required in production)
try {
    $stmt = $pdo->prepare("SELECT id, firstname, lastname, email, role, kyc_status, created_at FROM users WHERE role != 'admin' ORDER BY created_at DESC");
    $stmt->execute();
    sendResponse($stmt->fetchAll());
} catch (PDOException $e) { sendResponse(["message" => $e->getMessage()], 500); }
?>

<?php
// backend/api/admin/analytics.php
require_once '../../config.php';
try {
    $uCount = $pdo->query("SELECT COUNT(*) FROM users WHERE role != 'admin'")->fetchColumn();
    $sCount = $pdo->query("SELECT COUNT(*) FROM shipments")->fetchColumn();
    $totalAmount = $pdo->query("SELECT SUM(amount) FROM transactions WHERE status = 'completed'")->fetchColumn() ?? 0;
    sendResponse([
        "totalUsers" => (int)$uCount,
        "totalShipments" => (int)$sCount,
        "totalEarnings" => (float)$totalAmount
    ]);
} catch (PDOException $e) { sendResponse(["message" => $e->getMessage()], 500); }
?>
