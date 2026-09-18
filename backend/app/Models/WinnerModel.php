<?php

namespace App\Models;

use CodeIgniter\Model;

class WinnerModel extends Model
{
    protected $table            = 'winners';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'id',
        'user_id',
        'giveaway_id',
        'name',
        'location',
        'country',
        'flag',
        'car',
        'car_image',
        'badge_text',
        'total_entries',
        'won_at',
        'created_at',
        'updated_at',
            'car_es',
        'location_es',
        'badge_es',
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
}
