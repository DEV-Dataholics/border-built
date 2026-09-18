<?php
namespace App\Models;
use CodeIgniter\Model;

class AuditLogModel extends Model
{
    protected $table            = 'audit_logs';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'id', 'created_at', 'actor_id', 'actor_role', 'actor_ip', 
        'action', 'resource_type', 'resource_id', 'status', 'level', 'metadata'
    ];

    protected $useTimestamps = false; // We manage created_at manually if needed, or use DB default
}

