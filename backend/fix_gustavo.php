<?php
require __DIR__ . '/../app/Config/Paths.php';
$paths = new Config\Paths();
require $paths->systemDirectory . '/bootstrap.php';

$orderModel = new \App\Models\OrderModel();
$pendingOrders = $orderModel->where('status', 'pending')->where('user_id', 'usr_29749b3fc4')->findAll();

foreach ($pendingOrders as $order) {
    $orderModel->update($order['id'], ['status' => 'completed']);
    \App\Libraries\EmailHelper::sendOrderReceipt($order['id']);
}
echo "Fixed " . count($pendingOrders) . " orders.";
