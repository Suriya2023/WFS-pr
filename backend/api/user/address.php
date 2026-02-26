<?php
// backend/api/user/address.php
require_once '../../config.php';

$token = verifyToken();
if (!$token) {
    sendResponse(["message" => "Unauthorized"], 401);
}

$id = isset($_GET['id']) ? $_GET['id'] : null;
$method = $_SERVER['REQUEST_METHOD'];

if (!$id) {
    sendResponse(["message" => "ID required"], 400);
}

if ($method === 'PUT') {
    $input = json_decode(file_get_contents("php://input"), true);
    try {
        $stmt = $pdo->prepare("UPDATE user_addresses SET name=?, phone=?, address1=?, city=?, state=?, pincode=? WHERE id=?");
        $stmt->execute([
            isset($input['name']) ? $input['name'] : '',
            isset($input['phone']) ? $input['phone'] : '',
            isset($input['address1']) ? $input['address1'] : '',
            isset($input['city']) ? $input['city'] : '',
            isset($input['state']) ? $input['state'] : '',
            isset($input['pincode']) ? $input['pincode'] : '',
            $id
        ]);
        sendResponse(["message" => "Address updated successfully", "success" => true]);
    } catch (PDOException $e) {
        sendResponse(["message" => "Update failed: " . $e->getMessage()], 500);
    }
} elseif ($method === 'DELETE') {
    try {
        $stmt = $pdo->prepare("DELETE FROM user_addresses WHERE id = ?");
        $stmt->execute([$id]);
        sendResponse(["message" => "Address deleted", "success" => true]);
    } catch (PDOException $e) {
        sendResponse(["message" => "Delete failed"], 500);
    }
}
?>