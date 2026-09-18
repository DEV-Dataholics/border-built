<?php

namespace App\Models;

use CodeIgniter\Model;

class PollOptionModel extends Model
{
    protected $table            = 'poll_options';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $protectFields    = true;
    protected $allowedFields    = ['poll_id', 'name', 'image_url'];

    // Timestamps
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = '';
}
