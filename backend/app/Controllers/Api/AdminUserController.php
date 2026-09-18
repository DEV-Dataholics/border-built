<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;

class AdminUserController extends ResourceController
{
    public function index()
    {
        $userModel = new UserModel();
        $users = $userModel->orderBy('created_at', 'DESC')->findAll();
        
        // Remove passwords from response
        foreach ($users as &$user) {
            unset($user['password']);
        }

        return $this->respond($users);
    }

    public function create()
    {
        $userModel = new UserModel();
        $data = $this->request->getJSON(true);

        if (!$data || !isset($data['email']) || !isset($data['name'])) {
            return $this->fail('Email and name are required.');
        }

        $existingUser = $userModel->where('email', $data['email'])->first();
        if ($existingUser) {
            return $this->fail('Email already in use.');
        }

        $userId = 'usr_' . uniqid();
        $password = isset($data['password']) && !empty($data['password']) 
            ? password_hash($data['password'], PASSWORD_DEFAULT) 
            : password_hash('border123', PASSWORD_DEFAULT);

        $insertData = [
            'id'       => $userId,
            'name'     => $data['name'],
            'email'    => $data['email'],
            'role'     => isset($data['role']) ? $data['role'] : 'user',
            'password' => $password,
            'location' => isset($data['location']) ? $data['location'] : null,
            'phone'    => isset($data['phone']) ? $data['phone'] : null,
            'address'  => isset($data['address']) ? $data['address'] : null,
            'city'     => isset($data['city']) ? $data['city'] : null,
            'state'    => isset($data['state']) ? $data['state'] : null,
            'zip_code' => isset($data['zip_code']) ? $data['zip_code'] : null,
            'country'  => isset($data['country']) ? $data['country'] : null,
            'avatar'   => isset($data['avatar']) ? $data['avatar'] : null,
        ];

        if ($userModel->insert($insertData)) {
            unset($insertData['password']);
            return $this->respondCreated($insertData);
        }

        return $this->fail('Failed to create user');
    }

    public function update($id = null)
    {
        $userModel = new UserModel();
        $data = $this->request->getJSON(true);

        $user = $userModel->find($id);
        if (!$user) {
            return $this->failNotFound('User not found');
        }

        $updateData = [];
        
        if (isset($data['name'])) $updateData['name'] = $data['name'];
        if (isset($data['email'])) {
            // Check if email belongs to someone else
            $existing = $userModel->where('email', $data['email'])->where('id !=', $id)->first();
            if ($existing) {
                return $this->fail('Email already in use by another user.');
            }
            $updateData['email'] = $data['email'];
        }
        if (isset($data['role'])) $updateData['role'] = $data['role'];
        if (isset($data['is_vip'])) $updateData['is_vip'] = $data['is_vip'] ? 1 : 0;
        if (isset($data['location'])) $updateData['location'] = $data['location'];
        if (isset($data['phone'])) $updateData['phone'] = $data['phone'];
        if (isset($data['address'])) $updateData['address'] = $data['address'];
        if (isset($data['city'])) $updateData['city'] = $data['city'];
        if (isset($data['state'])) $updateData['state'] = $data['state'];
        if (isset($data['zip_code'])) $updateData['zip_code'] = $data['zip_code'];
        if (isset($data['country'])) $updateData['country'] = $data['country'];
        if (isset($data['avatar'])) $updateData['avatar'] = $data['avatar'];
        
        if (isset($data['password']) && !empty($data['password'])) {
            $updateData['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        if (empty($updateData)) {
            return $this->respondUpdated(['message' => 'Nothing to update']);
        }

        if ($userModel->update($id, $updateData)) {
            return $this->respondUpdated(['message' => 'User updated successfully']);
        }

        return $this->fail('Failed to update user');
    }

    public function toggleVip($id = null)
    {
        $userModel = new UserModel();
        $user = $userModel->find($id);
        if (!$user) {
            return $this->failNotFound('Usuario no encontrado.');
        }

        $data = $this->request->getJSON(true);
        $newStatus = isset($data['is_vip']) ? ($data['is_vip'] ? 1 : 0) : (empty($user['is_vip']) ? 1 : 0);

        if ($userModel->update($id, ['is_vip' => $newStatus])) {
            return $this->respondUpdated([
                'message' => 'Estatus VIP actualizado correctamente.',
                'id'      => $id,
                'is_vip'  => (bool)$newStatus,
            ]);
        }

        return $this->fail('No se pudo actualizar el estatus VIP.');
    }

    public function delete($id = null)
    {
        $userModel = new UserModel();
        
        $user = $userModel->find($id);
        if (!$user) {
            return $this->failNotFound('User not found');
        }

        if ($userModel->delete($id)) {
            return $this->respondDeleted(['message' => 'User deleted successfully']);
        }

        return $this->fail('Failed to delete user');
    }

    public function options()
    {
        return $this->response->setStatusCode(200);
    }
}
