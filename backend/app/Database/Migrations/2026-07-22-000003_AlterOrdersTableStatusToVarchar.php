<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AlterOrdersTableStatusToVarchar extends Migration
{
    public function up()
    {
        $fields = [
            'status' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
                'default'    => 'pending',
            ],
        ];

        $this->forge->modifyColumn('orders', $fields);
    }

    public function down()
    {
        $fields = [
            'status' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
                'default'    => 'pending',
            ],
        ];

        $this->forge->modifyColumn('orders', $fields);
    }
}
