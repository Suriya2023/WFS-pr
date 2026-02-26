<?php
// backend/api/auth.php
require_once '../config.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';
$data = json_decode(file_get_contents("php://input"), true);
if (!is_array($data))
    $data = array();

// ─── Shared Table Definitions ────────────────────────────────────────────────
$usersTableSQL = "CREATE TABLE IF NOT EXISTS `users` (
    `id`            int(11)       NOT NULL AUTO_INCREMENT,
    `firstname`     varchar(100)  NOT NULL,
    `lastname`      varchar(100)  DEFAULT NULL,
    `email`         varchar(150)  NOT NULL UNIQUE,
    `mobile`        varchar(20)   DEFAULT NULL,
    `password`      varchar(255)  NOT NULL,
    `role`          enum('user','admin') DEFAULT 'user',
    `wallet_balance` decimal(15,2) DEFAULT 0.00,
    `kyc_status`    enum('not_submitted','pending','verified','rejected') DEFAULT 'not_submitted',
    `company_name`  varchar(255)  DEFAULT NULL,
    `gst_number`    varchar(15)   DEFAULT NULL,
    `created_at`    timestamp     NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

$pendingUsersTableSQL = "CREATE TABLE IF NOT EXISTS `pending_users` (
    `id`         int(11)       NOT NULL AUTO_INCREMENT,
    `firstname`  varchar(100)  NOT NULL,
    `lastname`   varchar(100)  DEFAULT NULL,
    `email`      varchar(150)  NOT NULL UNIQUE,
    `mobile`     varchar(20)   DEFAULT NULL,
    `password`   varchar(255)  NOT NULL,
    `otp`        varchar(6)    NOT NULL,
    `otp_expiry` datetime      NOT NULL,
    `created_at` timestamp     NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

/**
 * Ensures a table exists and is accessible.
 * If InnoDB corruption is detected (table metadata exists but data files are gone),
 * it drops and recreates the table automatically.
 */
function ensureTable($pdo, $tableName, $createSQL)
{
    try {
        $pdo->exec($createSQL);
        // Verify the table is actually accessible (catches InnoDB error 1932)
        $pdo->query("SELECT 1 FROM `$tableName` LIMIT 1");
    } catch (PDOException $e) {
        // InnoDB corruption — drop stale metadata and recreate fresh
        debugLog("InnoDB corruption detected on '$tableName': " . $e->getMessage() . " — auto-repairing...");
        try {
            $pdo->exec("SET FOREIGN_KEY_CHECKS=0");
            $pdo->exec("DROP TABLE IF EXISTS `$tableName`");
            $pdo->exec("SET FOREIGN_KEY_CHECKS=1");
            $pdo->exec($createSQL);
            debugLog("Table '$tableName' repaired successfully.");
        } catch (PDOException $e2) {
            sendResponse(false, "Critical DB error repairing '$tableName': " . $e2->getMessage());
        }
    }
}

// ─── REGISTER ────────────────────────────────────────────────────────────────
if ($action == 'register') {
    $firstname = trim(isset($data['firstname']) ? $data['firstname'] : '');
    $lastname = trim(isset($data['lastname']) ? $data['lastname'] : '');
    $email = trim(isset($data['email']) ? $data['email'] : '');
    $mobile = trim(isset($data['mobile']) ? $data['mobile'] : '');
    $password = isset($data['password']) ? $data['password'] : '';

    if (!$firstname || !$email || !$password) {
        sendResponse(false, "First Name, Email and Password are required");
    }

    // 1. Ensure tables exist (auto-repairs InnoDB corruption)
    ensureTable($pdo, 'users', $usersTableSQL);
    ensureTable($pdo, 'pending_users', $pendingUsersTableSQL);

    // 2. Check if email already registered
    try {
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            sendResponse(false, "Email already exists. Please login.");
        }
    } catch (PDOException $e) {
        sendResponse(false, "Database error checking email: " . $e->getMessage());
    }

    // 3. Prepare OTP & hashed password
    $otp = rand(100000, 999999);
    $expiry = date('Y-m-d H:i:s', strtotime('+15 minutes'));
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);

    // 4. Upsert into pending_users
    try {
        $stmt = $pdo->prepare("INSERT INTO pending_users (firstname, lastname, email, mobile, password, otp, otp_expiry)
                               VALUES (?, ?, ?, ?, ?, ?, ?)
                               ON DUPLICATE KEY UPDATE
                                   firstname  = VALUES(firstname),
                                   lastname   = VALUES(lastname),
                                   mobile     = VALUES(mobile),
                                   password   = VALUES(password),
                                   otp        = VALUES(otp),
                                   otp_expiry = VALUES(otp_expiry)");
        $stmt->execute([$firstname, $lastname, $email, $mobile, $hashed_password, $otp, $expiry]);
    } catch (PDOException $e) {
        sendResponse(false, "Database error saving registration: " . $e->getMessage());
    }

    // 5. Send OTP email (non-blocking — failure won't stop registration)
    require_once '../utils/mailer.php';

    $template = "<h2>BGL Express Verification</h2>
                 <p>Hi $firstname,</p>
                 <p>Your verification code is: <b>$otp</b></p>
                 <p>This code is valid for 15 minutes.</p>";

    $emailSent = sendEmail($email, "Registration OTP - WFS Express", $template);

    sendResponse(true, "OTP sent to your email. Please verify to complete registration.", ["email_sent" => $emailSent]);

    // ─── LOGIN ────────────────────────────────────────────────────────────────────
} elseif ($action == 'login') {
    $email = trim(isset($data['email']) ? $data['email'] : '');
    $password = isset($data['password']) ? $data['password'] : '';

    if (!$email || !$password) {
        sendResponse(false, "Email and Password are required");
    }

    // Ensure users table exists (auto-repairs InnoDB corruption)
    ensureTable($pdo, 'users', $usersTableSQL);

    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            $token = base64_encode(json_encode([
                'id' => $user['id'],
                'role' => $user['role'],
                'time' => time()
            ]));

            unset($user['password']); // Never send password back

            sendResponse([
                "success" => true,
                "message" => "Login successful",
                "token" => $token,
                "user" => $user
            ], 200);
        } else {
            sendResponse(["success" => false, "message" => "Invalid email or password."], 401);
        }
    } catch (PDOException $e) {
        sendResponse(false, "Database error during login: " . $e->getMessage());
    }

} else {
    sendResponse(false, "Invalid action");
}
?>