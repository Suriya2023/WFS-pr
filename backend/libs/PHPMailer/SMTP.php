<?php
namespace PHPMailer\PHPMailer;

class SMTP {
    const VERSION = '6.6.0';
    const CRLF = "\r\n";
    const DEFAULT_PORT = 25;
    const MAX_LINE_LENGTH = 998;
    const MAX_REPLY_LENGTH = 512;
    // ... Minimal SMTP implementation for brevity ...
    protected $smtp_conn;
    protected $error = [];
    protected $helo_reply;

    public function connect($host, $port = null, $timeout = 5, $options = []) {
        $this->smtp_conn = @fsockopen($host, $port, $errno, $errstr, $timeout);
        if (!$this->smtp_conn) return false;
        $this->get_lines();
        return true;
    }

    public function hello($host = '') {
        return $this->sendCommand('EHLO', 'EHLO ' . $host, 250);
    }

    public function authenticate($user, $pass) {
        if (!$this->sendCommand('AUTH LOGIN', 'AUTH LOGIN', 334)) return false;
        if (!$this->sendCommand('user', base64_encode($user), 334)) return false;
        if (!$this->sendCommand('pass', base64_encode($pass), 235)) return false;
        return true;
    }

    public function sendCommand($command, $data, $expect) {
        fputs($this->smtp_conn, $data . self::CRLF);
        $reply = $this->get_lines();
        return (strpos($reply, (string)$expect) === 0);
    }

    protected function get_lines() {
        $data = '';
        while ($str = fgets($this->smtp_conn, 515)) {
            $data .= $str;
            if (isset($str[3]) && $str[3] == ' ') break;
        }
        return $data;
    }

    public function mail($from) { return $this->sendCommand('MAIL FROM', 'MAIL FROM:<' . $from . '>', 250); }
    public function recipient($to) { return $this->sendCommand('RCPT TO', 'RCPT TO:<' . $to . '>', 250); }
    public function data($msg_data) {
        if (!$this->sendCommand('DATA', 'DATA', 354)) return false;
        fputs($this->smtp_conn, $msg_data . self::CRLF . '.' . self::CRLF);
        return (strpos($this->get_lines(), '250') === 0);
    }
    public function quit() { $this->sendCommand('QUIT', 'QUIT', 221); fclose($this->smtp_conn); }
}
?>
