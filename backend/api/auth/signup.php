<?php
// backend/api/auth/signup.php
require_once '../../config.php';

debugLog("Signup request received");

// Get JSON input
$input = json_decode(file_get_contents("php://input"), true);

// Validate required fields
if (!$input || empty($input['email']) || empty($input['password']) || empty($input['firstname'])) {
    debugLog("Invalid input error sent - Missing required fields");
    debugLog("Received data: " . json_encode($input));
    sendResponse(["message" => "Invalid input. Please provide all required fields."], 400);
}

$firstname = trim($input['firstname']);
$lastname  = trim($input['lastname'] ?? '');
$email     = trim($input['email']);
$mobile    = trim($input['mobile'] ?? '');
$password  = password_hash($input['password'], PASSWORD_BCRYPT);

// Note: confirmPassword is handled by frontend validation, not needed in backend

debugLog("Processing signup for: $email");

try {
    // AUTO-REPAIR: Ensure table exists
    $pdo->exec("CREATE TABLE IF NOT EXISTS pending_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstname VARCHAR(100) NOT NULL,
        lastname VARCHAR(100),
        email VARCHAR(150) UNIQUE NOT NULL,
        mobile VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        otp_expiry DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // Generate 6-digit OTP
    $otp = rand(100000, 999999);
    $expiry = date('Y-m-d H:i:s', strtotime('+15 minutes'));

    // 1. Check if email already exists in main users table
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        sendResponse(["message" => "Email already registered and verified. Please login."], 400);
    }

    // 2. Save to PENDING_USERS (Upsert logic)
    $stmt = $pdo->prepare("INSERT INTO pending_users (firstname, lastname, email, mobile, password, otp, otp_expiry) 
                          VALUES (?, ?, ?, ?, ?, ?, ?) 
                          ON DUPLICATE KEY UPDATE 
                          firstname = VALUES(firstname), 
                          lastname = VALUES(lastname), 
                          password = VALUES(password), 
                          otp = VALUES(otp), 
                          otp_expiry = VALUES(otp_expiry)");
    $stmt->execute([$firstname, $lastname, $email, $mobile, $password, $otp, $expiry]);

    debugLog("OTP for $email: $otp (Saved in pending_users)");

    // 3. Attempt to send email
    require_once '../../utils/mailer.php';
    
    // Premium HTML Template
    $template = '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Email Verification</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:20px 0;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:6px;overflow:hidden;">
          <tr>
            <td align="center" style="background:#f2b705;padding:20px;">
              <h2 style="margin:0;color:#c62828;letter-spacing:1px;">
                BGL <span style="font-weight:normal;">EXPRESS</span>
              </h2>
              <p style="margin:5px 0 0;color:#5d4037;font-size:13px;">
                Fast. Secure. Global.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:30px;color:#333;">
              <p style="font-size:16px;">Hi <b>{{name}}</b>,</p>
              <p style="font-size:14px;line-height:1.6;">
                Here is your new verification code. Please use the code below
                to confirm your email address.
              </p>
              <div style="margin:30px 0;text-align:center;">
                <span style="
                  display:inline-block;
                  padding:15px 35px;
                  font-size:26px;
                  letter-spacing:6px;
                  font-weight:bold;
                  background:#fff7cc;
                  border:2px dashed #f2b705;
                  border-radius:6px;
                  color:#000;">
                  {{otp}}
                </span>
              </div>
              <p style="font-size:13px;color:#555;">
                ⏰ This OTP is valid for <b>15 minutes</b>.
              </p>
              <p style="font-size:13px;color:#777;">
                If you did not request this code, you can safely ignore this email.
              </p>
              <p style="margin-top:30px;font-size:14px;">
                Regards,<br>
                <b>BGL Express Team</b>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>';

    $fullName = trim($firstname . ' ' . $lastname);
    $message = str_replace(['{{name}}', '{{otp}}'], [$fullName, $otp], $template);
    
    // Send email with branded template
    $emailSent = sendEmail($email, "Registration OTP - BGL Express", $message);

    sendResponse([
        "message" => "OTP sent to your email. Please verify to complete registration.", 
        "success" => true,
        "email_sent" => $emailSent
    ], 201);

} catch (PDOException $e) {
    debugLog("Signup DB Error: " . $e->getMessage());
    sendResponse(["message" => "Database error occurred."], 500);
} catch (Exception $e) {
    debugLog("Signup General Error: " . $e->getMessage());
    sendResponse(["message" => "An error occurred during signup."], 500);
}
?>
