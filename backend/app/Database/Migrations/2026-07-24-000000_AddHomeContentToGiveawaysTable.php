<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddHomeContentToGiveawaysTable extends Migration
{
    public function up()
    {
        // Hero Section fields
        $this->forge->addColumn('giveaways', [
            'hero_image' => [
                'type'       => 'VARCHAR',
                'constraint' => 500,
                'null'       => true,
                'after'      => 'is_active',
            ],
            'hero_subtitle' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
                'after'      => 'hero_image',
            ],
            'hero_headline' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
                'after'      => 'hero_subtitle',
            ],
            'hero_badge_event' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => true,
                'after'      => 'hero_headline',
            ],
            'hero_badge_reqid' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => true,
                'after'      => 'hero_badge_event',
            ],
        ]);

        // Car / Specs HUD fields
        $this->forge->addColumn('giveaways', [
            'car_make' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => true,
                'after'      => 'hero_badge_reqid',
            ],
            'car_model' => [
                'type'       => 'VARCHAR',
                'constraint' => 200,
                'null'       => true,
                'after'      => 'car_make',
            ],
            'car_engine' => [
                'type'       => 'VARCHAR',
                'constraint' => 200,
                'null'       => true,
                'after'      => 'car_model',
            ],
            'car_horsepower' => [
                'type'       => 'VARCHAR',
                'constraint' => 200,
                'null'       => true,
                'after'      => 'car_engine',
            ],
            'car_color' => [
                'type'       => 'VARCHAR',
                'constraint' => 200,
                'null'       => true,
                'after'      => 'car_horsepower',
            ],
        ]);

        // Spec sheet section titles
        $this->forge->addColumn('giveaways', [
            'spec_title' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
                'after'      => 'car_color',
            ],
            'spec_subtitle' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
                'after'      => 'spec_title',
            ],
        ]);

        // Breakdown blocks (JSON array)
        $this->forge->addColumn('giveaways', [
            'breakdown_blocks' => [
                'type' => 'JSON',
                'null' => true,
                'after' => 'spec_subtitle',
            ],
        ]);

        // Scarcity Banner fields
        $this->forge->addColumn('giveaways', [
            'scarcity_title' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
                'after'      => 'breakdown_blocks',
            ],
            'scarcity_headline' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
                'after'      => 'scarcity_title',
            ],
            'scarcity_subheadline' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
                'after'      => 'scarcity_headline',
            ],
            'scarcity_product_title' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
                'after'      => 'scarcity_subheadline',
            ],
            'scarcity_product_desc' => [
                'type'       => 'VARCHAR',
                'constraint' => 500,
                'null'       => true,
                'after'      => 'scarcity_product_title',
            ],
            'scarcity_percent_sold' => [
                'type'       => 'INT',
                'constraint' => 3,
                'null'       => true,
                'default'    => 85,
                'after'      => 'scarcity_product_desc',
            ],
        ]);
    }

    public function down()
    {
        $fields = [
            'hero_image',
            'hero_subtitle',
            'hero_headline',
            'hero_badge_event',
            'hero_badge_reqid',
            'car_make',
            'car_model',
            'car_engine',
            'car_horsepower',
            'car_color',
            'spec_title',
            'spec_subtitle',
            'breakdown_blocks',
            'scarcity_title',
            'scarcity_headline',
            'scarcity_subheadline',
            'scarcity_product_title',
            'scarcity_product_desc',
            'scarcity_percent_sold',
        ];

        $this->forge->dropColumn('giveaways', $fields);
    }
}
