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

    public function toggleCheckout()
    {
        $db = \Config\Database::connect();
        $json = $this->request->getJSON(true);
        
        $cfgRow = $db->table('configs')->where('key', 'checkout_enabled')->get()->getRowArray();
        $current = ($cfgRow && $cfgRow['value'] === 'true');
        $newStatus = isset($json['enabled']) ? (bool) $json['enabled'] : !$current;
        $val = $newStatus ? 'true' : 'false';

        if ($cfgRow) {
            $db->table('configs')->where('key', 'checkout_enabled')->update(['value' => $val]);
        } else {
            $db->table('configs')->insert(['key' => 'checkout_enabled', 'value' => $val]);
        }

        return $this->respond([
            'status' => 'success',
            'checkoutEnabled' => $newStatus,
            'message' => $newStatus ? 'Checkout re-enabled successfully' : 'Checkout paused'
        ]);
    }
}
