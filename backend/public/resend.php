<?php
define('ENVIRONMENT', 'development');
require '../vendor/autoload.php';
$app = new \Config\Paths();
require '../vendor/codeigniter4/framework/system/bootstrap.php';

$userModel = new \App\Models\UserModel();
$user = $userModel->where('email', 'sotelonahum@gmail.com')->first();
if (!$user) {
    echo 'User not found.';
    exit;
}

$orderModel = new \App\Models\OrderModel();
$orders = $orderModel->where('user_id', $user['id'])->findAll();

echo 'Resending welcome email... ';
$res1 = \App\Libraries\EmailHelper::sendWelcomeEmail($user);
echo $res1 ? 'Success <br>' : 'Failed <br>';

foreach ($orders as $order) {
    echo 'Resending receipt for order ' . $order['id'] . '... ';
    $res2 = \App\Libraries\EmailHelper::sendOrderReceipt($order['id']);
    echo $res2 ? 'Success <br>' : 'Failed <br>';
}
