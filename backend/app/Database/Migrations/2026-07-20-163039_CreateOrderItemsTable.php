<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateOrderItemsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'order_id' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
            ],
            'product_id' => [
                'type' => 'INT',
                'constraint' => 11,
            ],
            'name' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
            ],
            'size' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
                'null' => true,
            ],
            'color' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
                'null' => true,
            ],
            'quantity' => [
                'type' => 'INT',
                'constraint' => 11,
                'default' => 1,
            ],
            'price' => [
                'type' => 'DECIMAL',
                'constraint' => '10,2',
                'default' => 0.00,
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
        $this->forge->addKey('order_id');
        $this->forge->createTable('order_items', true);
    }

    public function down()
    {
        $this->forge->dropTable('order_items', true);
    }
}
