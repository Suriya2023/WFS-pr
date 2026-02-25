<?php
require_once '../../config.php';
try {
    $uCount = $pdo->query("SELECT COUNT(*) FROM users WHERE role != 'admin'")->fetchColumn();
    $sCount = $pdo->query("SELECT COUNT(*) FROM shipments")->fetchColumn();

    // Status counts
    $dispatchedCount = $pdo->query("SELECT COUNT(*) FROM shipments WHERE status = 'dispatched'")->fetchColumn();
    $csbCount = $pdo->query("SELECT COUNT(*) FROM shipments WHERE destination_country != 'India' AND destination_country != ''")->fetchColumn();

    // For manifests and pickups, we can simulate or count if tables exist
    $manifestCount = $pdo->query("SELECT COUNT(*) FROM manifests")->fetchColumn() ?? 0;
    $pickupCount = $pdo->query("SELECT COUNT(*) FROM shipments WHERE status = 'ready'")->fetchColumn(); // Active pickups could be 'ready' shipments

    sendResponse([
        "totalUsers" => (int) $uCount,
        "totalShipments" => (int) $sCount,
        "dispatchedOrders" => (int) $dispatchedCount,
        "csbOrders" => (int) $csbCount,
        "totalManifests" => (int) $manifestCount,
        "activePickups" => (int) $pickupCount
    ]);
} catch (PDOException $e) {
    sendResponse(["message" => $e->getMessage()], 500);
}
?>