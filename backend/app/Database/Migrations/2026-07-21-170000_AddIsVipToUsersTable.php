<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddIsVipToUsersTable extends Migration
{
    public function up()
    {
        $fields = [
            'is_vip' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'default'    => 0,
                'after'      => 'role',
            ],
        ];

        $this->forge->addColumn('users', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('users', 'is_vip');
    }
}
