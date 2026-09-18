<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddTicketPromedioToGiveaways extends Migration
{
    public function up()
    {
        $this->forge->addColumn('giveaways', [
            'ticket_promedio' => [
                'type'       => 'DECIMAL',
                'constraint' => '10,2',
                'default'    => 1000.00,
                'after'      => 'prize_cost',
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('giveaways', 'ticket_promedio');
    }
}
