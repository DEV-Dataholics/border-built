<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\OrderModel;
use App\Models\UserModel;
use App\Models\GiveawayModel;
use App\Models\CouponModel;
use App\Models\CouponUsageModel;

class AdminReportController extends ResourceController
{
    public function index()
    {
        $orderModel = new OrderModel();
        $userModel = new UserModel();
        $couponUsageModel = new CouponUsageModel();
        $couponModel = new CouponModel();
        
        $startDate = $this->request->getGet('start_date');
        $endDate   = $this->request->getGet('end_date');

        $builder = $orderModel->whereIn('status', ['completed', 'shipped']);

        if (!empty($startDate)) {
            $builder->where('created_at >=', $startDate . ' 00:00:00');
        }
        if (!empty($endDate)) {
            $builder->where('created_at <=', $endDate . ' 23:59:59');
        }

        $orders = $builder->orderBy('created_at', 'DESC')->findAll();
        
        // Fetch coupon usages with entries awarded (in-person purchases claimed in Garage)
        $cuBuilder = $couponUsageModel->where('entries_awarded >', 0);
        if (!empty($startDate)) {
            $cuBuilder->where('created_at >=', $startDate . ' 00:00:00');
        }
        if (!empty($endDate)) {
            $cuBuilder->where('created_at <=', $endDate . ' 23:59:59');
        }
        $couponUsages = $cuBuilder->orderBy('created_at', 'DESC')->findAll();

        // Fetch all unique users in a single query to avoid N+1 problem
        $orderUserIds = array_column($orders, 'user_id');
        $couponUserIds = array_column($couponUsages, 'user_id');
        $userIds = array_unique(array_filter(array_merge($orderUserIds, $couponUserIds)));

        $usersMap = [];
        if (!empty($userIds)) {
            $users = $userModel->whereIn('id', $userIds)->findAll();
            foreach ($users as $u) {
                $usersMap[$u['id']] = $u;
            }
        }

        // Fetch coupons map
        $couponIds = array_unique(array_filter(array_column($couponUsages, 'coupon_id')));
        $couponsMap = [];
        if (!empty($couponIds)) {
            $coupons = $couponModel->whereIn('id', $couponIds)->findAll();
            foreach ($coupons as $c) {
                $couponsMap[$c['id']] = $c;
            }
        }
        
        $entries = [];
        foreach ($orders as $order) {
            $user = $usersMap[$order['user_id']] ?? null;
            $entries[] = [
                'orderId' => $order['id'],
                'userId' => $order['user_id'],
                'timestamp' => $order['created_at'],
                'userName' => $user ? $user['name'] : 'Unknown',
                'userEmail' => $user ? $user['email'] : 'Unknown',
                'entriesEarned' => (int) $order['entries_earned'],
                'multiplierUsed' => $order['multiplier_used'],
                'orderTotal' => (float) $order['total'],
                'orderStatus' => $order['status'],
                'verificationHash' => substr(base64_encode($order['id'] . ':' . $order['user_id'] . ':' . $order['entries_earned'] . ':' . $order['created_at']), 0, 16)
            ];
        }

        foreach ($couponUsages as $usage) {
            $user = $usersMap[$usage['user_id']] ?? null;
            $coupon = $couponsMap[$usage['coupon_id']] ?? null;
            $code = (!empty($coupon) && !empty($coupon['code'])) ? $coupon['code'] : ('TICKET_' . $usage['id']);
            $entries[] = [
                'orderId' => 'GARAGE-' . $code,
                'userId' => $usage['user_id'],
                'timestamp' => $usage['created_at'],
                'userName' => $user ? $user['name'] : 'Unknown',
                'userEmail' => $user ? $user['email'] : 'Unknown',
                'entriesEarned' => (int) $usage['entries_awarded'],
                'multiplierUsed' => 1,
                'orderTotal' => 0.00,
                'orderStatus' => 'completed',
                'verificationHash' => substr(base64_encode('coupon:' . $usage['id'] . ':' . $usage['user_id'] . ':' . $usage['entries_awarded'] . ':' . $usage['created_at']), 0, 16)
            ];
        }

        // Sort newest first
        usort($entries, function ($a, $b) {
            return strtotime($b['timestamp'] ?? '1970-01-01') - strtotime($a['timestamp'] ?? '1970-01-01');
        });

        return $this->respond($entries);
    }
}
