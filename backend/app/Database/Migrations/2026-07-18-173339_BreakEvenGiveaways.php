<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class BreakEvenGiveaways extends Migration
{
    public function up()
    {
        // Drop the old table if it exists to replace with new schema
        $this->forge->dropTable('giveaways', true);

        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'name' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
            ],
            'start_date' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'end_date' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'active_multiplier' => [
                'type'       => 'INT',
                'constraint' => 11,
                'default'    => 1,
            ],
            'prize_cost' => [
                'type'       => 'DECIMAL',
                'constraint' => '10,2',
                'default'    => 0.00,
            ],
            'average_margin' => [
                'type'       => 'DECIMAL',
                'constraint' => '3,2',
                'default'    => 0.00,
            ],
            'is_active' => [
                'type'       => 'BOOLEAN',
                'default'    => false,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'deleted_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('giveaways');
    }

    public function down()
    {
        $this->forge->dropTable('giveaways', true);
    }
}
