<?php
namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class AuditFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        $method = $request->getMethod(true);
        if (!in_array($method, ['POST', 'PUT', 'DELETE'])) {
            return;
        }

        $uri = $request->getUri()->getPath();
        $payload = [];
        try {
            if (strpos($request->getHeaderLine('Content-Type'), 'application/json') !== false) {
                $payload = $request->getJSON(true) ?? [];
            } else {
                $payload = $request->getPost() ?? [];
            }
        } catch (\Throwable $e) {
            $payload = [];
        }

        $sensitiveKeys = ['password', 'token', 'secret', 'bearer', 'stripe'];
        if (is_array($payload)) {
            foreach ($payload as $k => $v) {
                foreach ($sensitiveKeys as $sk) {
                    if (stripos($k, $sk) !== false) {
                        $payload[$k] = '[REDACTED]';
                    }
                }
            }
        }

        $actorId = $request->getHeaderLine('X-User-ID') ?: 'guest';
        $status = $response->getStatusCode() >= 400 ? 'FAIL' : 'SUCCESS';
        $level = $response->getStatusCode() >= 500 ? 'ERROR' : ($response->getStatusCode() >= 400 ? 'WARN' : 'INFO');

        register_shutdown_function(function() use ($actorId, $uri, $method, $status, $level, $payload) {
            try {
                $db = \Config\Database::connect();
                $id = uniqid('log_');
                $action = strtoupper($method) . ' ' . $uri;
                $metadata = json_encode(['payload' => $payload]);
                $sql = "INSERT INTO audit_logs (id, actor_id, action, status, level, metadata, created_at) 
                        VALUES (?, ?, ?, ?, ?, ?, NOW())";
                $db->query($sql, [$id, $actorId, $action, $status, $level, $metadata]);
            } catch (\Exception $e) {
            }
        });
    }
}
