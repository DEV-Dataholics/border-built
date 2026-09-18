<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddSpanishTranslationsToProductsAndWinners extends Migration
{
    public function up()
    {
        // Products
        $this->forge->addColumn('products', [
            'name_es' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
                'after'      => 'name',
            ],
            'description_es' => [
                'type'       => 'TEXT',
                'null'       => true,
                'after'      => 'description',
            ],
        ]);

        // Winners
        $this->forge->addColumn('winners', [
            'car_es' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
                'after'      => 'car',
            ],
            'location_es' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
                'after'      => 'location',
            ],
            'badge_es' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
                'after'      => 'badge',
            ],
        ]);

        // Community Highlights
        $this->forge->addColumn('community_highlights', [
            'title_es' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
                'after'      => 'title',
            ],
            'location_es' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
                'after'      => 'location',
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('products', ['name_es', 'description_es']);
        $this->forge->dropColumn('winners', ['car_es', 'location_es', 'badge_es']);
        $this->forge->dropColumn('community_highlights', ['title_es', 'location_es']);
    }
}
