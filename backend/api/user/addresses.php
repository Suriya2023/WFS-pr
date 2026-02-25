<?php
require_once '../../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$token = verifyToken();

if (!$token) {
    sendResponse(false, "Unauthorized", null);
}

$tokenData = json_decode(base64_decode($token), true);
$userId = $tokenData['id'];

if ($method == 'GET') {
    // List addresses
    try {
        $stmt = $pdo->prepare("SELECT * FROM user_addresses WHERE user_id = ? ORDER BY isDefault DESC, created_at DESC");
        $stmt->execute([$userId]);
        $addresses = $stmt->fetchAll(PDO::FETCH_ASSOC);
        sendResponse(true, "Addresses fetched", $addresses);
    } catch (PDOException $e) {
        sendResponse(false, "Error: " . $e->getMessage());
    }
} elseif ($method == 'POST') {
    // Add or Update address
    $data = json_decode(file_get_contents("php://input"), true);

    $id = $data['id'] ?? null;
    $name = $data['name'] ?? '';
    $phone = $data['phone'] ?? '';
    $address1 = $data['address1'] ?? '';
    $city = $data['city'] ?? '';
    $state = $data['state'] ?? '';
    $pincode = $data['pincode'] ?? '';
    $country = $data['country'] ?? 'India';
    $isDefault = isset($data['isDefault']) ? ($data['isDefault'] ? 1 : 0) : 0;

    $action = $data['action'] ?? null;

    if ($action === 'clear_all') {
        try {
            $stmt = $pdo->prepare("DELETE FROM user_addresses WHERE user_id = ?");
            $stmt->execute([$userId]);
            sendResponse(true, "All addresses cleared");
            exit;
        } catch (PDOException $e) {
            sendResponse(false, "Bulk clear failed: " . $e->getMessage());
            exit;
        }
    }

    if ($action === 'set_default') {
        try {
            $id = $data['id'] ?? null;
            if (!$id)
                sendResponse(false, "ID required for default update");

            // Remove previous default
            $pdo->prepare("UPDATE user_addresses SET isDefault = 0 WHERE user_id = ?")->execute([$userId]);

            // Set new default
            $stmt = $pdo->prepare("UPDATE user_addresses SET isDefault = 1 WHERE id = ? AND user_id = ?");
            $stmt->execute([$id, $userId]);
            sendResponse(true, "Address set as primary");
            exit;
        } catch (PDOException $e) {
            sendResponse(false, "Update failed: " . $e->getMessage());
            exit;
        }
    }

    if (!$name || !$address1 || !$city || !$pincode) {
        sendResponse(false, "Required fields missing");
    }

    try {
        if ($isDefault == 1) {
            // Remove previous default
            $pdo->prepare("UPDATE user_addresses SET isDefault = 0 WHERE user_id = ?")->execute([$userId]);
        }

        if ($id) {
            // Update
            $stmt = $pdo->prepare("UPDATE user_addresses SET name=?, phone=?, address1=?, city=?, state=?, pincode=?, country=?, isDefault=? WHERE id=? AND user_id=?");
            $stmt->execute([$name, $phone, $address1, $city, $state, $pincode, $country, $isDefault, $id, $userId]);
            sendResponse(true, "Address updated");
        } else {
            // Insert
            $stmt = $pdo->prepare("INSERT INTO user_addresses (user_id, name, phone, address1, city, state, pincode, country, isDefault) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$userId, $name, $phone, $address1, $city, $state, $pincode, $country, $isDefault]);
            sendResponse(true, "Address added");
        }
    } catch (PDOException $e) {
        sendResponse(false, "Error: " . $e->getMessage());
    }
} elseif ($method == 'DELETE') {
    // Delete address
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? null;

    if (!$id) {
        sendResponse(false, "ID missing");
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM user_addresses WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $userId]);
        sendResponse(true, "Address deleted");
    } catch (PDOException $e) {
        sendResponse(false, "Error: " . $e->getMessage());
    }
} else {
    sendResponse(false, "Method not allowed");
}
