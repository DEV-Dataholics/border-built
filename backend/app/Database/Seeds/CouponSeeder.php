<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class CouponSeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'code'          => 'BORDER700',
                'reward_type'   => 'entries',
                'discount_type' => null,
                'value'         => 0.00,
                'entries_count' => 700,
                'min_purchase'  => 0.00,
                'usage_limit'   => 1,
                'usage_count'   => 0,
                'campaign_name' => 'Demo Promocional 700 Entradas',
                'is_active'     => 1,
                'created_at'    => date('Y-m-d H:i:s'),
                'updated_at'    => date('Y-m-d H:i:s'),
            ],
            [
                'code'          => 'BORDER2026',
                'reward_type'   => 'discount',
                'discount_type' => 'percentage',
                'value'         => 15.00,
                'entries_count' => 0,
                'min_purchase'  => 0.00,
                'usage_limit'   => 500,
                'usage_count'   => 0,
                'campaign_name' => 'Descuento Especial 15%',
                'is_active'     => 1,
                'created_at'    => date('Y-m-d H:i:s'),
                'updated_at'    => date('Y-m-d H:i:s'),
            ],
            [
                'code'          => 'WELCOME10',
                'reward_type'   => 'discount',
                'discount_type' => 'fixed',
                'value'         => 10.00,
                'entries_count' => 0,
                'min_purchase'  => 20.00,
                'usage_limit'   => 100,
                'usage_count'   => 0,
                'campaign_name' => 'Bienvenida $10 USD Off',
                'is_active'     => 1,
                'created_at'    => date('Y-m-d H:i:s'),
                'updated_at'    => date('Y-m-d H:i:s'),
            ]
        ];

        $db = \Config\Database::connect();
        foreach ($data as $row) {
            $existing = $db->table('coupons')->where('code', $row['code'])->get()->getRow();
            if ($existing) {
                $db->table('coupons')->where('id', $existing->id)->update($row);
            } else {
                $db->table('coupons')->insert($row);
            }
        }
    }
}
