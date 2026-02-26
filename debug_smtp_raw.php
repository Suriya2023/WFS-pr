<?php
$host = 'ssl://smtp.gmail.com';
$port = 465;
echo "Testing connection to $host:$port...\n";
$errno = 0;
$errstr = '';
$timeout = 10;

$fp = fsockopen($host, $port, $errno, $errstr, $timeout);

if (!$fp) {
    echo "CONNECTION FAILED: $errstr ($errno)\n";
} else {
    echo "SUCCESS: Connected to server.\n";
    echo "Reading response...\n";
    $response = fgets($fp, 515);
    echo "Server said: $response\n";

    echo "Sending EHLO...\n";
    fputs($fp, "EHLO localhost\r\n");
    $ehlo = "";
    while ($line = fgets($fp, 515)) {
        $ehlo .= $line;
        if (isset($line[3]) && $line[3] == ' ')
            break;
    }
    echo "EHLO Answer:\n$ehlo\n";

    fclose($fp);
}

echo "\n--- SSL/TLS Connectivity Test ---\n";
$host_tls = 'smtp.gmail.com';
$port_tls = 587;
echo "Testing connection to $host_tls:$port_tls...\n";
$fp2 = fsockopen($host_tls, $port_tls, $errno, $errstr, $timeout);
if (!$fp2) {
    echo "CONNECTION FAILED (TLS): $errstr ($errno)\n";
} else {
    echo "SUCCESS: Connected to server.\n";
    $response = fgets($fp2, 515);
    echo "Server said: $response\n";
    fclose($fp2);
}
?>