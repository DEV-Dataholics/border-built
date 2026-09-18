<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddCouponToOrdersTable extends Migration
{
    public function up()
    {
        $fields = [
            'coupon_code' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
                'null'       => true,
                'after'      => 'shipping_address',
            ],
            'discount' => [
                'type'       => 'DECIMAL',
                'constraint' => '10,2',
                'default'    => 0.00,
                'after'      => 'coupon_code',
            ],
        ];

        $this->forge->addColumn('orders', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('orders', ['coupon_code', 'discount']);
    }
}
