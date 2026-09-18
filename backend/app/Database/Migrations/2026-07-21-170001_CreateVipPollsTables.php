<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateVipPollsTables extends Migration
{
    public function up()
    {
        // 1. Tabla polls
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'title' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
            ],
            'description' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'is_active' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'default'    => 1,
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
        $this->forge->createTable('polls');

        // 2. Tabla poll_options
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'poll_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
            ],
            'name' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
            ],
            'image_url' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('poll_id', 'polls', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('poll_options');

        // 3. Tabla poll_votes (con índice ÚNICO (poll_id, user_id))
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'poll_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
            ],
            'option_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
            ],
            'user_id' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey(['poll_id', 'user_id']); // 🚨 Garantiza 1 Voto por usuario por encuesta a nivel DB
        $this->forge->addForeignKey('poll_id', 'polls', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('option_id', 'poll_options', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('poll_votes');
    }

    public function down()
    {
        $this->forge->dropTable('poll_votes');
        $this->forge->dropTable('poll_options');
        $this->forge->dropTable('polls');
    }
}
