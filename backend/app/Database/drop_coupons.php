<?php
require __DIR__ . '/../../vendor/autoload.php';
$app = \Config\Services::codeigniter();
$app->initialize();
$db = \Config\Database::connect();
$db->query('DROP TABLE IF EXISTS coupon_usages');
$db->query('DROP TABLE IF EXISTS coupons');
$db->query("DELETE FROM migrations WHERE migration LIKE '%CreateCouponsTable%'");
echo "Cleaned up coupons table and migration status.\n";
