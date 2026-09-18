<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateGiveawaysTable extends Migration
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
            'car_make' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
            ],
            'car_model' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
            ],
            'max_entries' => [
                'type'       => 'INT',
                'constraint' => 11,
            ],
            'total_entries_sold' => [
                'type'       => 'INT',
                'constraint' => 11,
                'default'    => 0,
            ],
            'cash_prize' => [
                'type'       => 'DECIMAL',
                'constraint' => '10,2',
                'null'       => true,
            ],
            'end_date' => [
                'type' => 'DATETIME',
            ],
            'status' => [
                'type'       => 'ENUM',
                'constraint' => ['active', 'completed', 'cancelled'],
                'default'    => 'active',
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
        $this->forge->createTable('giveaways');
    }

    public function down()
    {
        $this->forge->dropTable('giveaways');
    }
}
