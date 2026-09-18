<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;
use App\Models\OrderModel;
use App\Models\CouponUsageModel;

class UserController extends ResourceController
{
    protected $format = 'json';

    public function show($id = null)
    {
        $userModel = new UserModel();
        $user = $userModel->find($id);

        if (!$user) {
            return $this->failNotFound('User not found');
        }

        // Compute entries and total_spent dynamically from valid orders + claimed coupons
        $orderModel = new OrderModel();
        $validOrders = $orderModel
            ->where('user_id', $id)
            ->whereIn('status', ['completed', 'shipped'])
            ->findAll();

        $computedEntries = 0;
        $computedSpent = 0.0;
        foreach ($validOrders as $order) {
            $computedEntries += (int) $order['entries_earned'];
            $computedSpent += (float) $order['total'];
        }

        // Also add entries from claimed coupons in coupon_usages
        $couponUsageModel = new CouponUsageModel();
        $couponUsages = $couponUsageModel
            ->where('user_id', $id)
            ->where('entries_awarded >', 0)
            ->findAll();
        foreach ($couponUsages as $cu) {
            $computedEntries += (int) ($cu['entries_awarded'] ?? 0);
        }

        $user['entries']     = $computedEntries;
        $user['total_spent'] = round($computedSpent, 2);

        // Remover contraseña en la respuesta
        unset($user['password']);

        return $this->respond($user);
    }
}
