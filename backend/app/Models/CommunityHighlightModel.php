<?php

namespace App\Models;

use CodeIgniter\Model;

class CommunityHighlightModel extends Model
{
    protected $table            = 'community_highlights';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'id',
        'title',
        'location',
        'emoji',
        'image',
        'link_url',
        'created_at',
        'updated_at',
            'title_es',
        'location_es',
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
}
