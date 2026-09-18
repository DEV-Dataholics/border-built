<?php

namespace App\Models;

use CodeIgniter\Model;

class OrderModel extends Model
{
    protected $table            = 'orders';
    protected $primaryKey       = 'id';
    // 'id' is a string like 'ord_001', so auto increment is false
    protected $useAutoIncrement = false; 
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'id',
        'user_id',
        'subtotal',
        'shipping',
        'total',
        'entries_earned',
        'multiplier_used',
        'status',
        'shipping_address',
        'coupon_code',
        'discount',
        'stripe_payment_intent_id',
        'idempotency_key'
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
}
