<?php

namespace App\Models;

use CodeIgniter\Model;

class CouponModel extends Model
{
    protected $table            = 'coupons';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'code',
        'reward_type',
        'discount_type',
        'value',
        'entries_count',
        'min_purchase',
        'max_discount',
        'usage_limit',
        'usage_count',
        'campaign_name',
        'start_date',
        'expires_at',
        'is_active'
    ];

    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    public function findByCode(string $code)
    {
        return $this->where('code', strtoupper(trim($code)))->first();
    }
}
