<?php
// backend/api/auth/login.php
require_once '../../config.php';

debugLog("=== LOGIN REQUEST RECEIVED ===");

// Get JSON input
$input = json_decode(file_get_contents("php://input"), true);
debugLog("Login input data: " . json_encode($input));

if (!$input || empty($input['email']) || empty($input['password'])) {
    debugLog("Login failed: Missing email or password");
    sendResponse(["message" => "Email and password are required."], 400);
}

$email = $input['email'];
$password = $input['password'];
debugLog("Login attempt for email: $email");

try {
    // Fetch user
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        debugLog("Login successful for user ID: " . $user['id']);
        
        // Generate Token (demonstration only)
        $token = generateToken($user['id']);
        
        // Remove password from response
        unset($user['password']);

        sendResponse([
            "message" => "Login successful",
            "token" => $token,
            "user" => [
                "id" => $user['id'],
                "firstname" => $user['firstname'],
                "lastname" => $user['lastname'],
                "email" => $user['email'],
                "role" => $user['role'],
                "wallet_balance" => $user['wallet_balance']
            ]
        ], 200);
    } else {
        debugLog("Login failed: Invalid credentials for email: $email");
        sendResponse(["message" => "Invalid email or password."], 401);
    }

} catch (PDOException $e) {
    sendResponse(["message" => "Database error: " . $e->getMessage()], 500);
}
?>
