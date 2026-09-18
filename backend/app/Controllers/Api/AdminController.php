<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;
use App\Models\OrderModel;
use App\Models\GiveawayModel;
use App\Models\ProductModel;

class AdminController extends ResourceController
{
    public function dashboard()
    {
        $userModel = new UserModel();
        $orderModel = new OrderModel();
        $giveawayModel = new GiveawayModel();

        $range = $this->request->getGet('range') ?? 'all';
        $startDateParam = $this->request->getGet('start_date');
        $endDateParam = $this->request->getGet('end_date');

        $startDate = null;
        $endDate = null;

        if ($range === 'today') {
            $startDate = date('Y-m-d 00:00:00');
            $endDate = date('Y-m-d 23:59:59');
        } elseif ($range === '7days') {
            $startDate = date('Y-m-d 00:00:00', strtotime('-7 days'));
            $endDate = date('Y-m-d 23:59:59');
        } elseif ($range === 'month') {
            $startDate = date('Y-m-01 00:00:00');
            $endDate = date('Y-m-d 23:59:59');
        } elseif ($range === 'custom') {
            if (!empty($startDateParam)) {
                $startDate = date('Y-m-d 00:00:00', strtotime($startDateParam));
            }
            if (!empty($endDateParam)) {
                $endDate = date('Y-m-d 23:59:59', strtotime($endDateParam));
            }
        }

        $totalUsers = $userModel->countAllResults();

        // BUG FIX: Only count orders with valid statuses (completed, shipped)
        $orderQuery = $orderModel->whereIn('status', ['completed', 'shipped']);
        if ($startDate) {
            $orderQuery->where('created_at >=', $startDate);
        }
        if ($endDate) {
            $orderQuery->where('created_at <=', $endDate);
        }
        $orders = $orderQuery->findAll();
        
        $totalOrders = count($orders);
        $totalRevenue = 0;
        $totalEntries = 0;
        
        // Prepare chart grouping by date
        $chartDataMap = [];
        
        foreach ($orders as $order) {
            $totalRevenue += (float) $order['total'];
            $totalEntries += (int) $order['entries_earned'];
            
            $sortKey = date('Y-m-d', strtotime($order['created_at']));
            $displayDate = date('M d', strtotime($order['created_at']));
            if (!isset($chartDataMap[$sortKey])) {
                $chartDataMap[$sortKey] = [
                    'date' => $displayDate,
                    'revenue' => 0
                ];
            }
            $chartDataMap[$sortKey]['revenue'] += (float) $order['total'];
        }

        $aov = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;
        $eff_mult = $totalRevenue > 0 ? $totalEntries / $totalRevenue : 0;

        // Chart data format for Recharts
        $chartData = [];
        if ($range === '7days') {
            for ($i = 6; $i >= 0; $i--) {
                $sortKey = date('Y-m-d', strtotime("-$i days"));
                $displayDate = date('M d', strtotime("-$i days"));
                $chartData[] = [
                    'date' => $displayDate,
                    'revenue' => isset($chartDataMap[$sortKey]) ? $chartDataMap[$sortKey]['revenue'] : 0
                ];
            }
        } else {
            ksort($chartDataMap);
            $chartData = array_values($chartDataMap);
        }

        return $this->respond([
            'totalUsers' => $totalUsers,
            'totalOrders' => $totalOrders,
            'totalRevenue' => $totalRevenue,
            'totalEntries' => $totalEntries,
            'aov' => $aov,
            'effMult' => $eff_mult,
            'chartData' => $chartData,
            'topProducts' => $this->getTopProducts($startDate, $endDate)
        ]);
    }

    /**
     * Get top-selling products from order_items joined with orders.
     * Only considers orders with valid status (completed, shipped).
     */
    private function getTopProducts($startDate = null, $endDate = null)
    {
        $db = \Config\Database::connect();
        $builder = $db->table('order_items oi')
            ->select('oi.name, oi.product_id, SUM(oi.quantity) as sold, SUM(oi.quantity * oi.price) as revenue')
            ->join('orders o', 'o.id = oi.order_id')
            ->whereIn('o.status', ['completed', 'shipped'])
            ->groupBy('oi.name, oi.product_id')
            ->orderBy('revenue', 'DESC')
            ->limit(5);

        if ($startDate) {
            $builder->where('o.created_at >=', $startDate);
        }
        if ($endDate) {
            $builder->where('o.created_at <=', $endDate);
        }

        $results = $builder->get()->getResultArray();

        // Attach product images when product_id is available
        $productModel = new ProductModel();
        foreach ($results as &$row) {
            $row['sold'] = (int) $row['sold'];
            $row['revenue'] = (float) $row['revenue'];
            $row['id'] = $row['product_id'];
            $row['image'] = null;

            if (!empty($row['product_id']) && $row['product_id'] !== '0') {
                $product = $productModel->find($row['product_id']);
                if ($product && !empty($product['images'])) {
                    $images = json_decode($product['images'], true);
                    $row['image'] = is_array($images) && count($images) > 0 ? $images[0] : null;
                }
            }
        }

        return $results;
    }
}
