<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\OrderModel;
use App\Models\UserModel;
use App\Models\OrderItemModel;

class AdminOrderController extends ResourceController
{
    public function options()
    {
        return $this->response->setStatusCode(200);
    }

    public function index()
    {
        $orderModel = new OrderModel();
        $userModel = new UserModel();
        $orderItemModel = new OrderItemModel();

        $orders = $orderModel->orderBy('created_at', 'DESC')->findAll();

        foreach ($orders as &$order) {
            $user = $userModel->find($order['user_id']);
            $order['user'] = $user ? ['name' => $user['name'], 'email' => $user['email']] : null;
            $order['subtotal'] = (float) ($order['subtotal'] ?? 0);
            $order['shipping'] = (float) ($order['shipping'] ?? 0);
            $order['discount'] = (float) ($order['discount'] ?? 0);
            $order['tax'] = (float) ($order['tax'] ?? 0);
            $order['shippingStatus'] = !empty($order['status']) ? $order['status'] : 'pending';
            
            // Fetch items from order_items table
            $items = $orderItemModel->where('order_id', $order['id'])->findAll();
            foreach ($items as &$it) {
                if (!empty($it['bundle_items'])) {
                    $it['bundleItems'] = json_decode($it['bundle_items'], true);
                }
            }
            $order['items'] = $items;
        }

        return $this->respond($orders);
    }

    public function update($id = null)
    {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        if (!$data || !is_array($data)) {
            $data = $this->request->getJSON(true) ?? $this->request->getRawInput();
        }

        if (!$id) {
            $segments = $this->request->getUri()->getSegments();
            $id = end($segments);
        }

        $status = $data['shippingStatus'] ?? $data['status'] ?? null;
        
        if ($status && $id) {
            $orderModel = new OrderModel();
            
            // Fetch old order to check if status changed to shipped
            $oldOrder = $orderModel->find($id);
            $orderModel->update($id, ['status' => $status]);
            
            // Only send email if it wasn't already shipped, and now it is
            if ($status === 'shipped' && $oldOrder && $oldOrder['status'] !== 'shipped') {
                \App\Libraries\EmailHelper::sendShippingEmail($id);
            }
        }
        return $this->respond(['status' => 'success', 'orderId' => $id, 'shippingStatus' => $status]);
    }
}
