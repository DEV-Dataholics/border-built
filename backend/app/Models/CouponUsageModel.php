<?php

namespace App\Models;

use CodeIgniter\Model;

class CouponUsageModel extends Model
{
    protected $table            = 'coupon_usages';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $protectFields    = true;
    protected $allowedFields    = [
        'coupon_id',
        'order_id',
        'user_id',
        'discount_amount',
        'entries_awarded'
    ];

    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = '';
}
