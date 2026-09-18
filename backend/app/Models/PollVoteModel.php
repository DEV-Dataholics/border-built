<?php

namespace App\Models;

use CodeIgniter\Model;

class PollVoteModel extends Model
{
    protected $table            = 'poll_votes';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $protectFields    = true;
    protected $allowedFields    = ['poll_id', 'option_id', 'user_id'];

    // Timestamps
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = '';
}
