<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateProductVariantsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'product_id' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
            ],
            'size' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
            ],
            'color' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
            ],
            'stock' => [
                'type'       => 'INT',
                'constraint' => 11,
                'default'    => 0,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('product_id', 'products', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('product_variants');
    }

    public function down()
    {
        $this->forge->dropTable('product_variants');
    }
}
