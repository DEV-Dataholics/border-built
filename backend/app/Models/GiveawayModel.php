<?php

namespace App\Models;

use CodeIgniter\Model;

class GiveawayModel extends Model
{
    protected $table            = 'giveaways';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = true;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'name',
        'start_date',
        'end_date',
        'active_multiplier',
        'prize_cost',
        'ticket_promedio',
        'average_margin',
        'is_active',
        // Home CMS: Hero
        'hero_image',
        'hero_subtitle',
        'hero_headline',
        'hero_badge_event',
        'hero_badge_reqid',
        // Home CMS: Car / Specs HUD
        'car_make',
        'car_model',
        'car_engine',
        'car_horsepower',
        'car_color',
        // Home CMS: Spec Sheet
        'spec_title',
        'spec_subtitle',
        // Home CMS: Breakdown Blocks (JSON)
        'breakdown_blocks',
        // Home CMS: Scarcity Banner
        'scarcity_title',
        'scarcity_headline',
        'scarcity_subheadline',
        'scarcity_product_title',
        'scarcity_product_desc',
        'scarcity_percent_sold',
        // Spanish Translations
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

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';
}
