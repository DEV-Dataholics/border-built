<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class ExpandUserProfile extends Migration
{
    public function up()
    {
        $this->forge->addColumn('users', [
            'phone' => [
                'type' => 'VARCHAR',
                'constraint' => 20,
                'null' => true,
                'after' => 'email',
            ],
            'address' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
                'after' => 'phone',
            ],
            'city' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
                'null' => true,
                'after' => 'address',
            ],
            'state' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
                'null' => true,
                'after' => 'city',
            ],
            'zip_code' => [
                'type' => 'VARCHAR',
                'constraint' => 20,
                'null' => true,
                'after' => 'state',
            ],
            'country' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
                'null' => true,
                'after' => 'zip_code',
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('users', ['phone', 'address', 'city', 'state', 'zip_code', 'country']);
    }
}
