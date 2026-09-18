<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateOrdersTable extends Migration
{
    public function up()
    {
        // Dummy to bypass error if table exists, although we want the real schema here usually.
        // Actually I will restore the full table since it's safer.
        $this->forge->addField([
            'id' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
            ],
            'user_id' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
            ],
            'subtotal' => [
                'type' => 'DECIMAL',
                'constraint' => '10,2',
            ],
            'shipping' => [
                'type' => 'DECIMAL',
                'constraint' => '10,2',
                'default' => 0.00,
            ],
            'total' => [
                'type' => 'DECIMAL',
                'constraint' => '10,2',
            ],
            'entries_earned' => [
                'type' => 'INT',
                'constraint' => 11,
                'default' => 0,
            ],
            'multiplier_used' => [
                'type' => 'INT',
                'constraint' => 11,
                'default' => 1,
            ],
            'status' => [
                'type' => 'ENUM',
                'constraint' => ['pending_payment', 'completed', 'refunded', 'cancelled'],
                'default' => 'pending_payment',
            ],
            'shipping_address' => [
                'type' => 'TEXT',
            ],
            'stripe_payment_intent_id' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
            ],
            'idempotency_key' => [
                'type' => 'VARCHAR',
                'constraint' => 36,
                'null' => true,
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
        $this->forge->addUniqueKey('idempotency_key');
        $this->forge->createTable('orders', true); // Added TRUE to 'if not exists'
    }

    public function down()
    {
        $this->forge->dropTable('orders', true);
    }
}
