<?php
// backend/utils/mailer.php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../libs/PHPMailer/Exception.php';
require_once __DIR__ . '/../libs/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/../libs/PHPMailer/SMTP.php';

function sendEmail($to, $subject, $message, $attachment = null)
{
    if (SMTP_PASS === 'xxxx-xxxx-xxxx-xxxx' || empty(SMTP_PASS)) {
        debugLog("EMAIL SIMULATION to $to: $message");
        return true;
    }

    $mail = new PHPMailer();
    try {
        $mail->SMTPDebug = 2; // Added for debugging
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USER;
        $mail->Password = SMTP_PASS;
        $mail->Port = SMTP_PORT;
        $mail->SMTPSecure = SMTP_SECURE; // Dynamic from config.php

        // Workaround for missing CA bundle on local environment
        $mail->SMTPOptions = array(
            'ssl' => array(
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            )
        );

        $mail->From = SMTP_USER;
        $mail->FromName = 'WFS Express';
        $mail->addAddress($to);
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $message;

        return $mail->send();
    } catch (Exception $e) {
        // FAIL-SOFT: Don't stop registration if email fails (firewall issues, etc.)
        debugLog("Mailer Error (Non-blocking): " . $e->getMessage());
        return false;
    } catch (\Throwable $t) {
        debugLog("Mailer Critical Error: " . $t->getMessage());
        return false;
    }
}
?>