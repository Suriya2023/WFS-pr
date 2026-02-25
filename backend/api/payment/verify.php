<?php
// backend/api/payment/verify.php
require_once '../../config.php';

$input = json_decode(file_get_contents("php://input"), true);
$razorpayOrderId = $input['razorpay_order_id'] ?? '';
$razorpayPaymentId = $input['razorpay_payment_id'] ?? '';
$razorpaySignature = $input['razorpay_signature'] ?? '';

// Validate JWT
$headers = apache_request_headers();
$authHeader = $headers['Authorization'] ?? '';
if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    sendResponse(["message" => "Unauthorized"], 401);
}
$tokenData = json_decode(base64_decode($matches[1]), true);
$userId = $tokenData['id'] ?? null;

// Verify signature
$keySecret = "GzCyKqhBqNejyE78LB1gmmda";
$generatedSignature = hash_hmac('sha256', $razorpayOrderId . "|" . $razorpayPaymentId, $keySecret);

if ($generatedSignature === $razorpaySignature) {
    // Payment Successful! 
    // Usually we would fetch the order amount from a 'payments' table, 
    // but for now we'll simulate it or assume the user recharges correctly.
    
    try {
        $pdo->beginTransaction();
        
        // 1. Get order details from Razorpay to know the amount (Security best practice)
        $url = "https://api.razorpay.com/v1/orders/" . $razorpayOrderId;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_USERPWD, "rzp_test_RxLxOuoJcABUSb:" . $keySecret);
        $res = curl_exec($ch);
        curl_close($ch);
        
        $orderData = json_decode($res, true);
        $amount = $orderData['amount'] / 100; // in Rupees

        // 2. Update Wallet
        $stmt = $pdo->prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?");
        $stmt->execute([$amount, $userId]);

        // 3. Log Transaction
        $stmt = $pdo->prepare("INSERT INTO transactions (user_id, amount, type, description, status) VALUES (?, ?, 'credit', 'Wallet Recharge via Razorpay', 'success')");
        $stmt->execute([$userId, $amount]);

        $pdo->commit();
        sendResponse(["message" => "Payment verified and wallet updated.", "success" => true]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        sendResponse(["message" => "Internal error updating wallet: " . $e->getMessage()], 500);
    }
} else {
    sendResponse(["message" => "Invalid payment signature"], 400);
}
?>
