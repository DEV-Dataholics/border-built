<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddBundleItemsToOrderItemsTable extends Migration
{
    public function up()
    {
        $fields = [
            'bundle_items' => [
                'type' => 'JSON',
                'null' => true,
                'after' => 'price',
            ],
        ];

        if (!$this->db->fieldExists('bundle_items', 'order_items')) {
            $this->forge->addColumn('order_items', $fields);
        }
    }

    public function down()
    {
        if ($this->db->fieldExists('bundle_items', 'order_items')) {
            $this->forge->dropColumn('order_items', 'bundle_items');
        }
    }
}
