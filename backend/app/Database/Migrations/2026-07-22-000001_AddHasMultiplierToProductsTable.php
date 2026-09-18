<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddHasMultiplierToProductsTable extends Migration
{
    public function up()
    {
        $fields = [
            'has_multiplier' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'default'    => 0,
                'after'      => 'entry_multiplier',
            ],
        ];

        // Add column if it doesn't already exist
        if (!$this->db->fieldExists('has_multiplier', 'products')) {
            $this->forge->addColumn('products', $fields);
        }
    }

    public function down()
    {
        if ($this->db->fieldExists('has_multiplier', 'products')) {
            $this->forge->dropColumn('products', 'has_multiplier');
        }
    }
}
