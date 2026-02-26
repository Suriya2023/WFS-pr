<?php
// backend/config.php
ob_start();

// 1. CORS - handled by .htaccess (Apache sets headers before PHP runs)
// Only early-exit OPTIONS so PHP doesn't process preflight requests
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_error.log');
error_reporting(E_ALL);

// 2. DATABASE CREDENTIALS
define('DB_HOST', 'localhost');
define('DB_NAME', 'user_dash_db');
define('DB_USER', 'root');
define('DB_PASS', '');

// 3. DATABASE CONNECTION
try {
    // Step 1: Connect without DB to create it if needed
    $pdo = new PDO("mysql:host=" . DB_HOST . ";charset=utf8mb4", DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    // Step 2: Reconnect with the database selected
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    if (ob_get_length())
        ob_clean();
    http_response_code(500);
    die(json_encode(array("success" => false, "message" => "DB Connection Failed: " . $e->getMessage())));
}

// 4. HELPER FUNCTIONS
function debugLog($message)
{
    $logFile = __DIR__ . '/debug.log';
    $timestamp = date('[Y-m-d H:i:s] ');
    $formattedMessage = $timestamp . (is_array($message) ? json_encode($message) : $message) . PHP_EOL;
    file_put_contents($logFile, $formattedMessage, FILE_APPEND | LOCK_EX);
}

function sendResponse($success, $message = '', $data = null)
{
    if (ob_get_length())
        ob_clean();
    if (is_array($success)) {
        if (is_numeric($message))
            http_response_code((int) $message);
        echo json_encode($success);
    } else {
        if ($success) {
            if ($data !== null) {
                echo json_encode(["success" => true, "message" => $message, "data" => $data]);
            } else {
                echo json_encode(["success" => true, "message" => $message]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => $message, "success" => false]);
        }
    }
    exit();
}

function verifyToken()
{
    $authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION']) ? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] : '');
    if (!$authHeader && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    }
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches))
        return $matches[1];
    return null;
}

function generateToken($userId)
{
    return base64_encode(json_encode(['id' => $userId, 'time' => time()]));
}

// 5. SMTP SETTINGS
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_USER', 'dkpssurajrajput@gmail.com');
define('SMTP_PASS', 'stghtplchlziupwl');
define('SMTP_PORT', 465);
define('SMTP_SECURE', 'ssl');