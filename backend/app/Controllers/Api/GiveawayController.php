<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\GiveawayModel;
use App\Models\OrderModel;
use App\Models\CouponUsageModel;

class GiveawayController extends ResourceController
{
    public function getActive()
    {
        $model = new GiveawayModel();
        $activeGiveaway = $model->where('is_active', 1)->first();

        if (!$activeGiveaway) {
            return $this->failNotFound('No active giveaway found');
        }

        // Calculate real revenue & entries from valid orders (completed/shipped) + claimed coupon entries
        $orderModel = new OrderModel();
        $orders = $orderModel->whereIn('status', ['completed', 'shipped'])->findAll();

        $totalRevenue = 0;
        $totalEntries = 0;
        foreach ($orders as $order) {
            $totalRevenue += (float) ($order['total'] ?? 0);
            $totalEntries += (int) ($order['entries_earned'] ?? 0);
        }

        $couponUsageModel = new CouponUsageModel();
        $couponUsages = $couponUsageModel->where('entries_awarded >', 0)->findAll();
        foreach ($couponUsages as $cu) {
            $totalEntries += (int) ($cu['entries_awarded'] ?? 0);
        }

        $activeGiveaway['current_revenue'] = $totalRevenue;
        $activeGiveaway['total_entries_sold'] = $totalEntries;

        // Cast types for Home CMS fields
        $activeGiveaway['prize_cost'] = (float) ($activeGiveaway['prize_cost'] ?? 0);
        $activeGiveaway['scarcity_percent_sold'] = (int) ($activeGiveaway['scarcity_percent_sold'] ?? 85);
        
        // Decode breakdown_blocks JSON
        if (!empty($activeGiveaway['breakdown_blocks']) && is_string($activeGiveaway['breakdown_blocks'])) {
            $activeGiveaway['breakdown_blocks'] = json_decode($activeGiveaway['breakdown_blocks'], true);
        } else {
            $activeGiveaway['breakdown_blocks'] = $activeGiveaway['breakdown_blocks'] ?? [];
        }

        return $this->respond($activeGiveaway);
    }
}
