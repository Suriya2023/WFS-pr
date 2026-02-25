<?php
namespace PHPMailer\PHPMailer;

require_once 'SMTP.php';
require_once 'Exception.php';

class PHPMailer {
    public $Priority = null;
    public $CharSet = 'UTF-8';
    public $ContentType = 'text/plain';
    public $Encoding = '8bit';
    public $ErrorInfo = '';
    public $From = 'root@localhost';
    public $FromName = 'Root User';
    public $Host = 'localhost';
    public $Port = 25;
    public $SMTPAuth = false;
    public $Username = '';
    public $Password = '';
    public $SMTPSecure = '';
    public $Subject = '';
    public $Body = '';
    protected $MIMEHeader = '';
    protected $MIMEBody = '';
    protected $to = [];

    public function isSMTP() {}
    public function addAddress($address, $name = '') { $this->to[] = $address; }
    public function isHTML($is_html) { $this->ContentType = $is_html ? 'text/html' : 'text/plain'; }

    public function send() {
        $smtp = new SMTP();
        $host = ($this->SMTPSecure == 'ssl') ? 'ssl://' . $this->Host : $this->Host;
        if (!$smtp->connect($host, $this->Port)) return false;
        if (!$smtp->hello('localhost')) return false;
        if ($this->SMTPAuth) {
            if (!$smtp->authenticate($this->Username, $this->Password)) return false;
        }
        if (!$smtp->mail($this->From)) return false;
        foreach ($this->to as $address) {
            if (!$smtp->recipient($address)) return false;
        }
        $header = "Date: " . date('D, j M Y H:i:s O') . "\r\n";
        $header .= "To: " . implode(',', $this->to) . "\r\n";
        $header .= "From: " . $this->FromName . " <" . $this->From . ">\r\n";
        $header .= "Subject: " . $this->Subject . "\r\n";
        $header .= "Content-Type: " . $this->ContentType . "; charset=" . $this->CharSet . "\r\n\r\n";
        
        if (!$smtp->data($header . $this->Body)) return false;
        $smtp->quit();
        return true;
    }
}
?>
