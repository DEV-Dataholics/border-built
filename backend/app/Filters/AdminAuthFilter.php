<?php
namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use App\Models\UserModel;

class AdminAuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $userId = $request->getHeaderLine('X-User-ID');
        if (empty($userId)) {
            return \Config\Services::response()->setStatusCode(401)->setJSON(['error' => 'Unauthorized - No User ID provided']);
        }

        $userModel = new UserModel();
        $user = $userModel->find($userId);

        if (!$user || $user['role'] !== 'admin') {
            return \Config\Services::response()->setStatusCode(403)->setJSON(['error' => 'Forbidden - Requires Admin role']);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
    }
}
