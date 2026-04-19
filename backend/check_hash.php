<?php
require 'vendor/autoload.php';

$hash = '$2y$12$gnRVY3Pf/P7uyvHWsD9l/ea9.uu03gynxblCJDW238fymWdVVDyzu';
$passwords = ['password', 'admin', '123456', '12345678', 'password123', 'admin123', 'secret', 'root', 'cdc_portal', 'cdcportal'];

foreach ($passwords as $p) {
    if (password_verify($p, $hash)) {
        echo "MATCH FOUND: $p\n";
        exit;
    }
}
echo "NO MATCH FOUND\n";
