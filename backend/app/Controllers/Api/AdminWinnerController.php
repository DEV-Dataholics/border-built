<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\WinnerModel;

class AdminWinnerController extends ResourceController
{
    public function options()
    {
        return $this->response->setStatusCode(200);
    }

    public function index()
    {
        $model = new WinnerModel();
        $winners = $model->orderBy('created_at', 'DESC')->findAll();

        $formatted = array_map(function ($w) {
            return [
                'id'           => $w['id'],
                'userId'       => $w['user_id'],
                'giveawayId'   => $w['giveaway_id'],
                'name'         => $w['name'],
                'location'     => $w['location'],
                'country'      => $w['country'],
                'flag'         => $w['flag'],
                'car'          => $w['car'],
                'carImage'     => $w['car_image'],
                'badgeText'    => $w['badge_text'],
                'totalEntries' => (int) $w['total_entries'],
                'wonAt'        => $w['won_at'],
                'createdAt'    => $w['created_at'],
                'updatedAt'    => $w['updated_at'],
            ];
        }, $winners);

        return $this->respond($formatted);
    }

    public function create()
    {
        $model = new WinnerModel();
        $data = $this->request->getJSON(true);

        if (!$data || empty($data['name']) || empty($data['car'])) {
            return $this->fail('El nombre y el vehículo son campos obligatorios.');
        }

        $id = $data['id'] ?? ('win_' . bin2hex(random_bytes(4)));

        $insertData = [
            'id'            => $id,
            'user_id'       => $data['userId'] ?? null,
            'giveaway_id'   => $data['giveawayId'] ?? null,
            'name'          => $data['name'],
            'location'      => $data['location'] ?? '',
            'location_es'   => $data['locationEs'] ?? null,
            'country'       => $data['country'] ?? 'US',
            'flag'          => $data['flag'] ?? '🇺🇸',
            'car'           => $data['car'],
            'car_es'        => $data['carEs'] ?? null,
            'car_image'     => $data['carImage'] ?? ($data['car_image'] ?? ''),
            'badge_text'    => $data['badgeText'] ?? ($data['badge_text'] ?? 'Grand Prize Winner'),
            'badge_es'      => $data['badgeEs'] ?? null,
            'total_entries' => (int) ($data['totalEntries'] ?? ($data['total_entries'] ?? 5000)),
            'won_at'        => date('Y-m-d H:i:s'),
        ];

        $model->insert($insertData);
        $created = $model->find($id);

        return $this->respondCreated([
            'id'           => $created['id'],
            'userId'       => $created['user_id'],
            'giveawayId'   => $created['giveaway_id'],
            'name'         => $created['name'],
            'location'     => $created['location'],
            'country'      => $created['country'],
            'flag'         => $created['flag'],
            'car'          => $created['car'],
            'carImage'     => $created['car_image'],
            'badgeText'    => $created['badge_text'],
            'totalEntries' => (int) $created['total_entries'],
            'wonAt'        => $created['won_at'],
            'createdAt'    => $created['created_at'],
            'updatedAt'    => $created['updated_at'],
        ]);
    }

    public function update($id = null)
    {
        if (!$id) {
            return $this->fail('ID no proporcionado.');
        }

        $model = new WinnerModel();
        $existing = $model->find($id);
        if (!$existing) {
            return $this->failNotFound('Ganador no encontrado.');
        }

        $data = $this->request->getJSON(true);

        $updateData = [];
        if (isset($data['name'])) $updateData['name'] = $data['name'];
        if (isset($data['car'])) $updateData['car'] = $data['car'];
        if (isset($data['carEs'])) $updateData['car_es'] = $data['carEs'];
        if (isset($data['location'])) $updateData['location'] = $data['location'];
        if (isset($data['locationEs'])) $updateData['location_es'] = $data['locationEs'];
        if (isset($data['country'])) $updateData['country'] = $data['country'];
        if (isset($data['flag'])) $updateData['flag'] = $data['flag'];
        if (isset($data['carImage'])) $updateData['car_image'] = $data['carImage'];
        if (isset($data['badgeText'])) $updateData['badge_text'] = $data['badgeText'];
        if (isset($data['badgeEs'])) $updateData['badge_es'] = $data['badgeEs'];
        if (isset($data['totalEntries'])) $updateData['total_entries'] = (int) $data['totalEntries'];



        if (!empty($updateData)) {
            $model->update($id, $updateData);
        }

        $updated = $model->find($id);

        return $this->respond([
            'id'           => $updated['id'],
            'userId'       => $updated['user_id'],
            'giveawayId'   => $updated['giveaway_id'],
            'name'         => $updated['name'],
            'location'     => $updated['location'],
            'country'      => $updated['country'],
            'flag'         => $updated['flag'],
            'car'          => $updated['car'],
            'carImage'     => $updated['car_image'],
            'badgeText'    => $updated['badge_text'],
            'totalEntries' => (int) $updated['total_entries'],
            'wonAt'        => $updated['won_at'],
            'createdAt'    => $updated['created_at'],
            'updatedAt'    => $updated['updated_at'],
        ]);
    }

    public function delete($id = null)
    {
        if (!$id) {
            return $this->fail('ID no proporcionado.');
        }

        $model = new WinnerModel();
        $existing = $model->find($id);
        if (!$existing) {
            return $this->failNotFound('Ganador no encontrado.');
        }

        $model->delete($id);

        return $this->respondDeleted(['id' => $id, 'message' => 'Ganador eliminado con éxito.']);
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

        $uploadDir = WRITEPATH . 'uploads' . DIRECTORY_SEPARATOR . 'winners';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $newName = $file->getRandomName();
        $file->move($uploadDir, $newName);

        $url = base_url("api/uploads/winners/{$newName}");

        return $this->respond([
            'status' => 'success',
            'url'    => $url,
            'name'   => $newName,
        ]);
    }
}
