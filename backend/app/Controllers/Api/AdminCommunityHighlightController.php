<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\CommunityHighlightModel;

class AdminCommunityHighlightController extends ResourceController
{
    public function options()
    {
        return $this->response->setStatusCode(200);
    }

    public function index()
    {
        $model = new CommunityHighlightModel();
        $highlights = $model->orderBy('created_at', 'DESC')->findAll();

        $formatted = array_map(function ($h) {
            return [
                'id'        => $h['id'],
                'title'     => $h['title'],
                'location'  => $h['location'],
                'emoji'     => $h['emoji'],
                'image'     => $h['image'],
                'linkUrl'   => $h['link_url'] ?? null,
                'createdAt' => $h['created_at'],
                'updatedAt' => $h['updated_at'],
            ];
        }, $highlights);

        return $this->respond($formatted);
    }

    public function create()
    {
        $model = new CommunityHighlightModel();
        $data = $this->request->getJSON(true);

        if (!$data || empty($data['title']) || empty($data['image'])) {
            return $this->fail('El título y la imagen son obligatorios.');
        }

        $id = $data['id'] ?? ('comm_' . bin2hex(random_bytes(4)));
        $rawLink = $data['linkUrl'] ?? ($data['link_url'] ?? null);
        $linkUrl = !empty(trim((string)$rawLink)) ? trim((string)$rawLink) : null;

        $insertData = [
            'id'       => $id,
            'title'         => $data['title'],
            'title_es'      => $data['titleEs'] ?? null,
            'location' => $data['location'] ?? '',
            'emoji'    => $data['emoji'] ?? '🇲🇽',
            'image'    => $data['image'],
            'link_url' => $linkUrl,
        ];

        $model->insert($insertData);
        $created = $model->find($id);

        return $this->respondCreated([
            'id'        => $created['id'],
            'title'     => $created['title'],
            'location'  => $created['location'],
            'emoji'     => $created['emoji'],
            'image'     => $created['image'],
            'linkUrl'   => $created['link_url'] ?? null,
            'createdAt' => $created['created_at'],
            'updatedAt' => $created['updated_at'],
        ]);
    }

    public function update($id = null)
    {
        if (!$id) {
            return $this->fail('ID no proporcionado.');
        }

        $model = new CommunityHighlightModel();
        $existing = $model->find($id);
        if (!$existing) {
            return $this->failNotFound('Foto de comunidad no encontrada.');
        }

        $data = $this->request->getJSON(true);

        $updateData = [];
        if (isset($data['title'])) $updateData['title'] = $data['title'];
        if (isset($data['titleEs'])) $updateData['title_es'] = $data['titleEs'];
        if (isset($data['location'])) $updateData['location'] = $data['location'];
        if (isset($data['locationEs'])) $updateData['location_es'] = $data['locationEs'];
        if (isset($data['emoji'])) $updateData['emoji'] = $data['emoji'];
        if (isset($data['image'])) $updateData['image'] = $data['image'];
        if (array_key_exists('linkUrl', $data) || array_key_exists('link_url', $data)) {
            $rawLink = $data['linkUrl'] ?? ($data['link_url'] ?? null);
            $updateData['link_url'] = !empty(trim((string)$rawLink)) ? trim((string)$rawLink) : null;
        }

        if (isset($data['locationEs'])) $updateData['location_es'] = $data['locationEs'];
        if (isset($data['emoji'])) $updateData['emoji'] = $data['emoji'];
        if (isset($data['image'])) $updateData['image'] = $data['image'];
        if (array_key_exists('linkUrl', $data) || array_key_exists('link_url', $data)) {
            $rawLink = $data['linkUrl'] ?? ($data['link_url'] ?? null);
            $updateData['link_url'] = !empty(trim((string)$rawLink)) ? trim((string)$rawLink) : null;
        }

        if (!empty($updateData)) {
            $model->update($id, $updateData);
        }

        $updated = $model->find($id);

        return $this->respond([
            'id'        => $updated['id'],
            'title'     => $updated['title'],
            'location'  => $updated['location'],
            'emoji'     => $updated['emoji'],
            'image'     => $updated['image'],
            'linkUrl'   => $updated['link_url'] ?? null,
            'createdAt' => $updated['created_at'],
            'updatedAt' => $updated['updated_at'],
        ]);
    }

    public function delete($id = null)
    {
        if (!$id) {
            return $this->fail('ID no proporcionado.');
        }

        $model = new CommunityHighlightModel();
        $existing = $model->find($id);
        if (!$existing) {
            return $this->failNotFound('Foto de comunidad no encontrada.');
        }

        $model->delete($id);

        return $this->respondDeleted(['id' => $id, 'message' => 'Foto de comunidad eliminada con éxito.']);
    }

    public function uploadImage()
    {
        $file = $this->request->getFile('image');

        if (!$file || !$file->isValid()) {
            return $this->fail('No se proporcionó un archivo de imagen válido.', 400);
        }

        $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!in_array($file->getMimeType(), $allowedTypes)) {
            return $this->fail('Tipo de archivo inválido. Permitidos: JPG, PNG, WEBP, GIF.', 400);
        }

        if ($file->getSize() > 10 * 1024 * 1024) {
            return $this->fail('El archivo es demasiado grande. Máximo 10MB.', 400);
        }

        $uploadDir = WRITEPATH . 'uploads' . DIRECTORY_SEPARATOR . 'community';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $newName = $file->getRandomName();
        $file->move($uploadDir, $newName);

        $url = base_url("api/uploads/community/{$newName}");

        return $this->respond([
            'status' => 'success',
            'url'    => $url,
            'name'   => $newName,
        ]);
    }
}
