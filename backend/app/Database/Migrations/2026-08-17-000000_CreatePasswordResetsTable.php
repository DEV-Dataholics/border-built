<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreatePasswordResetsTable extends Migration
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
            'email' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
            ],
            'token' => [
                'type'       => 'VARCHAR',
                'constraint' => 64,
            ],
            'expires_at' => [
                'type' => 'DATETIME',
            ],
            'used' => [
                'type'    => 'TINYINT',
                'constraint' => 1,
                'default' => 0,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('token');
        $this->forge->addKey('email');
        $this->forge->createTable('password_resets', true);
    }

    public function down()
    {
        $this->forge->dropTable('password_resets', true);
    }
}
