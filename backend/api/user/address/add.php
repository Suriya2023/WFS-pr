<?php
// backend/api/user/address/add.php
require_once '../../../config.php';

$token = verifyToken();
if (!$token) {
    sendResponse(["message" => "Unauthorized"], 401);
}

$tokenData = json_decode(base64_decode($token), true);
$userId = $tokenData['id'];

$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    sendResponse(["message" => "No data provided"], 400);
}

try {
    // We don't have a separate addresses table in schema.sql yet.
    // Let's create it if it doesn't exist.
    $pdo->exec("CREATE TABLE IF NOT EXISTS user_addresses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        address1 TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        pincode VARCHAR(20),
        country VARCHAR(100) DEFAULT 'India',
        isDefault TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )");

    $stmt = $pdo->prepare("INSERT INTO user_addresses (user_id, name, phone, address1, city, state, pincode, country, isDefault) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $stmt->execute([
        $userId,
        isset($input['name']) ? $input['name'] : '',
        isset($input['phone']) ? $input['phone'] : '',
        isset($input['address1']) ? $input['address1'] : '',
        isset($input['city']) ? $input['city'] : '',
        isset($input['state']) ? $input['state'] : '',
        isset($input['pincode']) ? $input['pincode'] : '',
        isset($input['country']) ? $input['country'] : 'India',
        isset($input['isDefault']) ? (int) $input['isDefault'] : 0
    ]);

    $lastId = $pdo->lastInsertId();
    sendResponse(["message" => "Address added successfully", "_id" => $lastId, "success" => true]);

} catch (PDOException $e) {
    sendResponse(["message" => "Database error: " . $e->getMessage()], 500);
}
?>