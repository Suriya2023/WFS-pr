<?php
// backend/api/payment/verify.php
require_once __DIR__ . '/../../config.php';

$input = json_decode(file_get_contents("php://input"), true);
$razorpayOrderId = isset($input['razorpay_order_id']) ? $input['razorpay_order_id'] : '';
$razorpayPaymentId = isset($input['razorpay_payment_id']) ? $input['razorpay_payment_id'] : '';
$razorpaySignature = isset($input['razorpay_signature']) ? $input['razorpay_signature'] : '';

$token = verifyToken();
if (!$token) {
    sendResponse(array("message" => "Unauthorized"), 401);
}

try {
    $tokenData = json_decode(base64_decode($token), true);
    $userId = isset($tokenData['id']) ? $tokenData['id'] : null;

    if (!$userId) {
        sendResponse(array("message" => "Invalid session token."), 401);
    }

    $keySecret = "GzCyKqhBqNejyE78LB1gmmda";
    $generatedSignature = hash_hmac('sha256', $razorpayOrderId . "|" . $razorpayPaymentId, $keySecret);

    if ($generatedSignature === $razorpaySignature) {
        $pdo->beginTransaction();

        $url = "https://api.razorpay.com/v1/orders/" . $razorpayOrderId;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_USERPWD, "rzp_test_RxLxOuoJcABUSb:" . $keySecret);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        $res = curl_exec($ch);
        curl_close($ch);

        $orderData = json_decode($res, true);
        $amount = (isset($orderData['amount']) ? $orderData['amount'] : 0) / 100;

        if ($amount <= 0) {
            throw new Exception("Could not retrieve amount from Razorpay");
        }

        // 2. Update Wallet
        $stmt = $pdo->prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?");
        $stmt->execute(array($amount, $userId));

        // 3. Log Transaction - Detect schema
        $useWalletTrans = $pdo->query("SHOW TABLES LIKE 'wallet_transactions'")->fetch();

        if ($useWalletTrans) {
            // Check for 'reason' vs 'description' in wallet_transactions
            $cols = $pdo->query("DESCRIBE `wallet_transactions`")->fetchAll(PDO::FETCH_COLUMN);
            $descCol = in_array('reason', $cols) ? 'reason' : 'description';

            $stmt = $pdo->prepare("INSERT INTO wallet_transactions (user_id, amount, type, `$descCol`) VALUES (?, ?, 'credit', 'Wallet Recharge via Razorpay')");
            $stmt->execute(array($userId, $amount));
        } else {
            // Check for 'description' vs 'reason' in transactions
            $cols = $pdo->query("DESCRIBE `transactions`")->fetchAll(PDO::FETCH_COLUMN);
            $descCol = in_array('description', $cols) ? 'description' : 'reason';

            $stmt = $pdo->prepare("INSERT INTO transactions (user_id, amount, type, `$descCol`, status) VALUES (?, ?, 'credit', 'Wallet Recharge via Razorpay', 'success')");
            $stmt->execute(array($userId, $amount));
        }

        $pdo->commit();
        sendResponse(array("message" => "Payment verified and wallet updated.", "success" => true));

    } else {
        sendResponse(array("message" => "Invalid payment signature"), 400);
    }
} catch (Exception $e) {
    if ($pdo->inTransaction())
        $pdo->rollBack();
    debugLog("Verify API Error: " . $e->getMessage());
    sendResponse(array("message" => "Internal error: " . $e->getMessage()), 500);
}
?>