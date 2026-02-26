<?php
// backend/api/reports/list.php
require_once __DIR__ . '/../../config.php';

// Auth Check
$authHeader = '';
if (function_exists('apache_request_headers')) {
    $headers = apache_request_headers();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
}
if (!$authHeader) {
    $authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION']) ? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] : '');
}

if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    sendResponse(["message" => "Unauthorized access."], 401);
}

$tokenData = json_decode(base64_decode($matches[1]), true);
$userId = isset($tokenData['id']) ? $tokenData['id'] : null;

if (!$userId) {
    sendResponse(["message" => "Invalid token."], 401);
}

try {
    // For now, let's provide a "Daily Orders Report" auto-generated from shipments
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM shipments WHERE user_id = ?");
    $stmt->execute([$userId]);
    $res = $stmt->fetch();
    $totalOrders = isset($res['total']) ? $res['total'] : 0;

    $reports = [];
    if ($totalOrders > 0) {
        $reports[] = [
            "id" => 1,
            "date" => date('Y-m-d'),
            "jobType" => "Orders Summary Report",
            "totalRecords" => $totalOrders,
            "status" => "Completed",
            "downloadUrl" => "#"
        ];

        $reports[] = [
            "id" => 2,
            "date" => date('Y-m-d', strtotime('-1 day')),
            "jobType" => "Monthly Performance Report",
            "totalRecords" => $totalOrders, // Mocking
            "status" => "Completed",
            "downloadUrl" => "#"
        ];
    }

    sendResponse($reports);

} catch (PDOException $e) {
    sendResponse(["message" => "Database error: " . $e->getMessage()], 500);
}
