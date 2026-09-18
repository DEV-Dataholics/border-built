<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\GiveawayModel;
use App\Models\OrderModel;
use App\Models\UserModel;
use App\Models\CouponModel;
use App\Models\CouponUsageModel;

class AdminGiveawayController extends ResourceController
{
    public function options()
    {
        return $this->response->setStatusCode(200);
    }

    public function index()
    {
        $model = new GiveawayModel();
        // Return newest first
        $giveaways = $model->orderBy('created_at', 'DESC')->findAll();
        
        foreach ($giveaways as &$giveaway) {
            $this->castGiveawayFields($giveaway);
        }

        return $this->respond($giveaways);
    }

    public function show($id = null)
    {
        $model = new GiveawayModel();
        $giveaway = $model->find($id);

        if (!$giveaway) {
            return $this->failNotFound('Giveaway not found');
        }

        $this->castGiveawayFields($giveaway);
        return $this->respond($giveaway);
    }

    public function create()
    {
        $model = new GiveawayModel();
        $data = $this->request->getJSON(true);

        // If this is set to active, make sure others are completed
        if (isset($data['isActive']) && $data['isActive']) {
            $model->builder()->where('is_active', 1)->update(['is_active' => 0]);
        }

        $insertData = [
            'name' => $data['name'],
            'start_date' => $data['startDate'] ?? null,
            'end_date' => $data['endDate'] ?? null,
            'active_multiplier' => $data['activeMultiplier'] ?? 1,
            'prize_cost' => $data['prizeCost'] ?? 0.00,
            'ticket_promedio' => $data['ticketPromedio'] ?? 1000.00,
            'average_margin' => $data['averageMargin'] ?? 0.00,
            'is_active' => $data['isActive'] ?? false,
        ];

        $model->insert($insertData);
        return $this->respondCreated(['status' => 'success']);
    }

    public function update($id = null)
    {
        $model = new GiveawayModel();
        $data = $this->request->getJSON(true);
        
        if (isset($data['isActive']) && $data['isActive']) {
            $model->builder()->where('is_active', 1)->where('id !=', $id)->update(['is_active' => 0]);
        }

        $updateData = [];
        // Original fields
        if (isset($data['name'])) $updateData['name'] = $data['name'];
        if (isset($data['startDate'])) $updateData['start_date'] = $data['startDate'];
        if (isset($data['endDate'])) $updateData['end_date'] = $data['endDate'];
        if (isset($data['activeMultiplier'])) $updateData['active_multiplier'] = $data['activeMultiplier'];
        if (isset($data['prizeCost'])) $updateData['prize_cost'] = $data['prizeCost'];
        if (isset($data['ticketPromedio'])) $updateData['ticket_promedio'] = $data['ticketPromedio'];
        if (isset($data['averageMargin'])) $updateData['average_margin'] = $data['averageMargin'];
        if (isset($data['isActive'])) $updateData['is_active'] = $data['isActive'];

        $model->update($id, $updateData);
        return $this->respond(['status' => 'success']);
    }

    /**
     * Update only the Home CMS content for a giveaway.
     */
    public function updateHomeContent($id = null)
    {
        $model = new GiveawayModel();
        $giveaway = $model->find($id);

        if (!$giveaway) {
            return $this->failNotFound('Giveaway not found');
        }

        $data = $this->request->getJSON(true);
        $updateData = [];

        // Home CMS field mapping (camelCase from frontend -> snake_case in DB)
        $fieldMap = [
            'endDate'             => 'end_date',
            'startDate'           => 'start_date',
            'heroImage'           => 'hero_image',
            'heroSubtitle'        => 'hero_subtitle',
            'heroSubtitleEs'      => 'hero_subtitle_es',
            'heroHeadline'        => 'hero_headline',
            'heroHeadlineEs'      => 'hero_headline_es',
            'heroBadgeEvent'      => 'hero_badge_event',
            'heroBadgeEventEs'    => 'hero_badge_event_es',
            'heroBadgeReqid'      => 'hero_badge_reqid',
            'carMake'             => 'car_make',
            'carModel'            => 'car_model',
            'carEngine'           => 'car_engine',
            'carEngineEs'         => 'car_engine_es',
            'carHorsepower'       => 'car_horsepower',
            'carColor'            => 'car_color',
            'carColorEs'          => 'car_color_es',
            'specTitle'           => 'spec_title',
            'specTitleEs'         => 'spec_title_es',
            'specSubtitle'        => 'spec_subtitle',
            'specSubtitleEs'      => 'spec_subtitle_es',
            'scarcityTitle'       => 'scarcity_title',
            'scarcityTitleEs'     => 'scarcity_title_es',
            'scarcityHeadline'    => 'scarcity_headline',
            'scarcityHeadlineEs'  => 'scarcity_headline_es',
            'scarcitySubheadline' => 'scarcity_subheadline',
            'scarcitySubheadlineEs'=> 'scarcity_subheadline_es',
            'scarcityProductTitle'=> 'scarcity_product_title',
            'scarcityProductTitleEs'=>'scarcity_product_title_es',
            'scarcityProductDesc' => 'scarcity_product_desc',
            'scarcityProductDescEs'=> 'scarcity_product_desc_es',
            'scarcityPercentSold' => 'scarcity_percent_sold',
            'prizeCost'           => 'prize_cost',
            'prize_cost'          => 'prize_cost',
            'breakdownBlocks'     => 'breakdown_blocks',
        ];

        foreach ($fieldMap as $camel => $snake) {
            if (array_key_exists($camel, $data)) {
                $val = $data[$camel];
                if ($snake === 'prize_cost' && is_numeric($val) && $val > 99999999.99) {
                    $val = 99999999.99;
                }
                $updateData[$snake] = $val;
            }
        }

        // Handle breakdown_blocks as JSON
        if (array_key_exists('breakdownBlocks', $data)) {
            $updateData['breakdown_blocks'] = json_encode($data['breakdownBlocks']);
        }

        if (empty($updateData)) {
            return $this->respond(['status' => 'no_changes']);
        }

        $model->update($id, $updateData);

        // Return the updated giveaway
        $updated = $model->find($id);
        $this->castGiveawayFields($updated);
        return $this->respond($updated);
    }

    /**
     * Upload an image for a giveaway.
     */
    public function uploadImage($id = null)
    {
        $model = new GiveawayModel();
        $giveaway = $model->find($id);

        if (!$giveaway) {
            return $this->failNotFound('Giveaway not found');
        }

        $file = $this->request->getFile('image');

        if (!$file || !$file->isValid()) {
            return $this->fail('No valid image file provided', 400);
        }

        // Validate file type
        $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!in_array($file->getMimeType(), $allowedTypes)) {
            return $this->fail('Invalid file type. Allowed: jpg, png, webp, gif', 400);
        }

        // Max 5MB
        if ($file->getSize() > 5 * 1024 * 1024) {
            return $this->fail('File too large. Max 5MB.', 400);
        }

        // Create upload directory
        $uploadDir = WRITEPATH . 'uploads' . DIRECTORY_SEPARATOR . 'giveaways' . DIRECTORY_SEPARATOR . $id;
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $newName = $file->getRandomName();
        $file->move($uploadDir, $newName);

        // Return the URL path that can be used to access the image via API route
        $url = base_url("api/uploads/giveaways/{$id}/{$newName}");

        return $this->respond([
            'status' => 'success',
            'url'    => $url,
            'name'   => $newName,
        ]);
    }

    public function delete($id = null)
    {
        $model = new GiveawayModel();
        $model->delete($id);
        return $this->respondDeleted(['id' => $id]);
    }

    public function reports($id = null)
    {
        $orderModel = new OrderModel();
        $userModel = new UserModel();
        $giveawayModel = new GiveawayModel();
        $couponUsageModel = new CouponUsageModel();
        $couponModel = new CouponModel();
        
        $giveaway = $giveawayModel->find($id);
        if (!$giveaway) {
            return $this->failNotFound('Giveaway not found');
        }

        // Filter orders with valid completed/shipped status
        $orders = $orderModel->whereIn('status', ['completed', 'shipped'])->findAll();
        
        // Fetch coupon usages with entries awarded (in-person purchases claimed in Garage)
        $couponUsages = $couponUsageModel->where('entries_awarded >', 0)->findAll();

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

        return $this->respond([
            'giveaway' => $giveaway,
            'report' => $entries
        ]);
    }

    /**
     * Cast giveaway fields to proper types for JSON response.
     */
    private function castGiveawayFields(array &$giveaway): void
    {
        $giveaway['prize_cost'] = (float) ($giveaway['prize_cost'] ?? 0);
        $giveaway['ticket_promedio'] = (float) ($giveaway['ticket_promedio'] ?? 1000.00);
        $giveaway['average_margin'] = (float) ($giveaway['average_margin'] ?? 0);
        $giveaway['active_multiplier'] = (int) ($giveaway['active_multiplier'] ?? 1);
        $giveaway['is_active'] = (bool) ($giveaway['is_active'] ?? false);
        $giveaway['scarcity_percent_sold'] = (int) ($giveaway['scarcity_percent_sold'] ?? 85);

        // Decode breakdown_blocks JSON
        if (!empty($giveaway['breakdown_blocks']) && is_string($giveaway['breakdown_blocks'])) {
            $giveaway['breakdown_blocks'] = json_decode($giveaway['breakdown_blocks'], true);
        } else {
            $giveaway['breakdown_blocks'] = $giveaway['breakdown_blocks'] ?? [];
        }
    }
}
