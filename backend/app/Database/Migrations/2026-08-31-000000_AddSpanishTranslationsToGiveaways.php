<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddSpanishTranslationsToGiveaways extends Migration
{
    public function up()
    {
        $this->forge->addColumn('giveaways', [
            'hero_subtitle_es' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
            ],
            'hero_headline_es' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
            ],
            'hero_badge_event_es' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => true,
            ],
            'car_engine_es' => [
                'type'       => 'VARCHAR',
                'constraint' => 200,
                'null'       => true,
            ],
            'car_color_es' => [
                'type'       => 'VARCHAR',
                'constraint' => 200,
                'null'       => true,
            ],
            'spec_title_es' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
            ],
            'spec_subtitle_es' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
            ],
            'scarcity_title_es' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
            ],
            'scarcity_headline_es' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
            ],
            'scarcity_subheadline_es' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
            ],
            'scarcity_product_title_es' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
            ],
            'scarcity_product_desc_es' => [
                'type'       => 'VARCHAR',
                'constraint' => 500,
                'null'       => true,
            ],
        ]);
    }

    public function down()
    {
        $fields = [
            'hero_subtitle_es',
            'hero_headline_es',
            'hero_badge_event_es',
            'car_engine_es',
            'car_color_es',
            'spec_title_es',
            'spec_subtitle_es',
            'scarcity_title_es',
            'scarcity_headline_es',
            'scarcity_subheadline_es',
            'scarcity_product_title_es',
            'scarcity_product_desc_es',
        ];

        $this->forge->dropColumn('giveaways', $fields);
    }
}
