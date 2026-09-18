<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateWinnersAndCommunityTables extends Migration
{
    public function up()
    {
        // 1. Tabla winners
        $this->forge->addField([
            'id' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
            ],
            'user_id' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
                'null'       => true,
            ],
            'giveaway_id' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
                'null'       => true,
            ],
            'name' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
            ],
            'location' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
            ],
            'country' => [
                'type'       => 'VARCHAR',
                'constraint' => 10,
                'null'       => true,
            ],
            'flag' => [
                'type'       => 'VARCHAR',
                'constraint' => 20,
                'null'       => true,
            ],
            'car' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
            ],
            'car_image' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
            ],
            'badge_text' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => true,
            ],
            'total_entries' => [
                'type'       => 'INT',
                'constraint' => 11,
                'default'    => 0,
            ],
            'won_at' => [
                'type' => 'DATETIME',
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
        $this->forge->createTable('winners', true);

        // 2. Tabla community_highlights
        $this->forge->addField([
            'id' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
            ],
            'title' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
            ],
            'location' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
            ],
            'emoji' => [
                'type'       => 'VARCHAR',
                'constraint' => 20,
                'null'       => true,
            ],
            'image' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
            ],
            'link_url' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
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
        $this->forge->createTable('community_highlights', true);
    }

    public function down()
    {
        $this->forge->dropTable('winners', true);
        $this->forge->dropTable('community_highlights', true);
    }
}
