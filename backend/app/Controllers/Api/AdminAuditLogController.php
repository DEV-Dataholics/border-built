<?php
namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\AuditLogModel;

class AdminAuditLogController extends ResourceController
{
    public function index()
    {
        $model = new AuditLogModel();
        
        $level = $this->request->getGet('level');
        $action = $this->request->getGet('action');
        
        if ($level) {
            $model->where('level', $level);
        }
        if ($action) {
            $model->like('action', $action);
        }
        
        $logs = $model->orderBy('created_at', 'DESC')->findAll(50);
        
        foreach ($logs as &$log) {
            $log['metadata'] = json_decode($log['metadata'] ?? '{}', true);
        }
        
        return $this->respond($logs);
    }
    
    public function stream()
    {
        // Validate user from query param (EventSource cannot send headers)
        $userId = $this->request->getGet('userId');
        $userModel = new \App\Models\UserModel();
        $user = $userId ? $userModel->find($userId) : null;
        if (!$user || $user['role'] !== 'admin') {
            header('HTTP/1.1 403 Forbidden');
            echo 'data: ' . json_encode(['error' => 'Forbidden']) . "\n\n";
            exit;
        }
        
        header('Content-Type: text/event-stream');
        header('Cache-Control: no-cache');
        header('Connection: keep-alive');
        header('X-Accel-Buffering: no'); // Nginx
        
        // Disable output buffering
        while (ob_get_level() > 0) {
            ob_end_flush();
        }
        
        $model = new AuditLogModel();
        $lastId = $this->request->getGet('lastId');
        
        // Simple polling for new logs
        $startTime = time();
        while (true) {
            if (connection_aborted() || time() - $startTime > 30) {
                break; // End stream after 30s to prevent infinite hanging procs, client reconnects
            }
            
            $query = $model->orderBy('created_at', 'DESC');
            if ($lastId) {
                // Approximate new logs by fetching recent. Real prod might use ID sequence or created_at > lastTime
                $query->limit(1);
            } else {
                $query->limit(5);
            }
            
            $logs = $query->findAll();
            if (!empty($logs)) {
                $latest = $logs[0];
                if ($latest['id'] !== $lastId) {
                    echo "data: " . json_encode($latest) . "\n\n";
                    flush();
                    $lastId = $latest['id'];
                }
            }
            sleep(2);
        }
        exit;
    }
    
    public function export()
    {
        $model = new AuditLogModel();
        $logs = $model->orderBy('created_at', 'DESC')->findAll();
        
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="audit_logs.csv"');
        
        $output = fopen('php://output', 'w');
        fputcsv($output, ['ID', 'Date', 'Actor', 'Action', 'Status', 'Level', 'Metadata']);
        
        foreach ($logs as $log) {
            fputcsv($output, [
                $log['id'],
                $log['created_at'],
                $log['actor_id'],
                $log['action'],
                $log['status'],
                $log['level'],
                $log['metadata']
            ]);
        }
        
        fclose($output);
        exit;
    }
}
