<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ConfigModel;
use App\Models\GiveawayModel;

class AdminConfigController extends ResourceController
{
    public function index()
    {
        $configModel = new ConfigModel();
        $giveawayModel = new GiveawayModel();

        $configs = $configModel->findAll();
        $activeGiveaway = $giveawayModel->where('is_active', true)->first();

        $response = [
            'configs' => $configs,
            'activeGiveaway' => $activeGiveaway
        ];

        return $this->respond($response);
    }

    public function options()
    {
        return $this->response->setStatusCode(200);
    }

    public function updateConfigs()
    {
        $configModel = new ConfigModel();
        $giveawayModel = new GiveawayModel();
        $data = $this->request->getJSON(true);

        if (isset($data['configs'])) {
            foreach ($data['configs'] as $key => $value) {
                $config = $configModel->where('key', $key)->first();
                if ($config) {
                    $configModel->update($config['id'], ['value' => $value]);
                } else {
                    $configModel->insert(['key' => $key, 'value' => $value]);
                }
            }
        }

        if (isset($data['giveaway'])) {
            $active = $giveawayModel->where('is_active', true)->first();
            if ($active) {
                $giveawayModel->update($active['id'], $data['giveaway']);
            }
        }

        return $this->respond(['status' => 'success']);
    }
}
