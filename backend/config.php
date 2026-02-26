<?php
// backend/config.php
ob_start();

// 1. CORS HEADERS - ROBUST FIX
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// If development, you can allow specific or all origins
if (!$origin || $origin == 'http://localhost:5173' || $origin == 'http://127.0.0.1:5173') {
    $origin = 'http://localhost:5173'; // Default to Vite port
}

header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Handle preflight (OPTIONS) request immediately
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

ini_set('display_errors', 0);
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
    $pdo = new PDO("mysql:host=" . DB_HOST . ";charset=utf8", DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("CREATE DATABASE IF NOT EXISTS " . DB_NAME);
    $pdo->exec("USE " . DB_NAME);
} catch (PDOException $e) {
    if (ob_get_length())
        ob_clean();
    die(json_encode(["success" => false, "message" => "DB Connection Failed: " . $e->getMessage()]));
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
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (!$authHeader && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $authHeader = $headers['Authorization'] ?? '';
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