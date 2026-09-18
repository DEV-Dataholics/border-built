<?php

namespace App\Models;

use CodeIgniter\Model;

class OrderItemModel extends Model
{
    protected $table = 'order_items';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'order_id',
        'product_id',
        'name',
        'size',
        'color',
        'quantity',
        'price',
        'bundle_items'
    ];
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
}
