<?php
// Test API Profile Endpoint
$url = 'http://localhost/WFS-pr/backend/api/user/profile';
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// Simulate a dummy token or just see what happens without one
$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

echo "URL: $url\n";
echo "Status Code: " . $info['http_code'] . "\n";
echo "Response: " . $response . "\n";
?>