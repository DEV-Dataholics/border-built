<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\CouponModel;

class AdminCouponController extends ResourceController
{
    protected $modelName = 'App\Models\CouponModel';
    protected $format    = 'json';

    public function options()
    {
        return $this->response->setStatusCode(200);
    }

    public function index()
    {
        $coupons = $this->model->orderBy('created_at', 'DESC')->findAll();

        // Calcular Métricas
        $totalCoupons = count($coupons);
        $usedCoupons = 0;
        $totalEntriesGifted = 0;
        $totalDiscountsGiven = 0;

        foreach ($coupons as $c) {
            $used = (int)$c['usage_count'];
            $usedCoupons += $used;
            if ($c['reward_type'] === 'entries') {
                $totalEntriesGifted += ($used * (int)$c['entries_count']);
            }
        }

        $redemptionRate = $totalCoupons > 0 ? round(($usedCoupons / $totalCoupons) * 100, 1) : 0;

        return $this->respond([
            'coupons' => $coupons,
            'metrics' => [
                'totalCoupons'       => $totalCoupons,
                'usedCoupons'        => $usedCoupons,
                'redemptionRate'     => $redemptionRate,
                'totalEntriesGifted' => $totalEntriesGifted,
            ]
        ]);
    }

    public function create()
    {
        $json = $this->request->getJSON(true);
        if (!$json || empty($json['code'])) {
            return $this->fail('Código de cupón es requerido', 400);
        }

        $code = strtoupper(trim($json['code']));
        $existing = $this->model->findByCode($code);
        if ($existing) {
            return $this->fail('Ya existe un cupón con este código', 400);
        }

        $rewardType = $json['reward_type'] ?? 'discount';

        $data = [
            'code'          => $code,
            'reward_type'   => $rewardType,
            'discount_type'  => $json['discount_type'] ?? 'percentage',
            'value'         => (float)($json['value'] ?? 0),
            'entries_count' => (int)($json['entries_count'] ?? 0),
            'min_purchase'  => (float)($json['min_purchase'] ?? 0),
            'max_discount'  => !empty($json['max_discount']) ? (float)$json['max_discount'] : null,
            'usage_limit'   => !empty($json['usage_limit']) ? (int)$json['usage_limit'] : 1,
            'campaign_name' => !empty($json['campaign_name']) ? trim($json['campaign_name']) : 'Campaña General',
            'start_date'    => !empty($json['start_date']) ? $json['start_date'] : null,
            'expires_at'    => !empty($json['expires_at']) ? $json['expires_at'] : null,
            'is_active'     => isset($json['is_active']) ? (int)$json['is_active'] : 1,
        ];

        $id = $this->model->insert($data);
        if (!$id) {
            return $this->fail('Error al crear el cupón', 500);
        }

        $created = $this->model->find($id);
        return $this->respondCreated($created);
    }

    public function update($id = null)
    {
        if (!$id || !$coupon = $this->model->find($id)) {
            return $this->failNotFound('Cupón no encontrado');
        }

        $json = $this->request->getJSON(true);
        if (!$json) {
            return $this->fail('Datos inválidos', 400);
        }

        $data = [];
        if (isset($json['code'])) $data['code'] = strtoupper(trim($json['code']));
        if (isset($json['reward_type'])) $data['reward_type'] = $json['reward_type'];
        if (isset($json['discount_type'])) $data['discount_type'] = $json['discount_type'];
        if (isset($json['value'])) $data['value'] = (float)$json['value'];
        if (isset($json['entries_count'])) $data['entries_count'] = (int)$json['entries_count'];
        if (array_key_exists('min_purchase', $json)) $data['min_purchase'] = (float)($json['min_purchase'] ?? 0);
        if (array_key_exists('usage_limit', $json)) $data['usage_limit'] = !empty($json['usage_limit']) ? (int)$json['usage_limit'] : 1;
        if (isset($json['campaign_name'])) $data['campaign_name'] = trim($json['campaign_name']);
        if (isset($json['is_active'])) $data['is_active'] = (int)$json['is_active'];

        $this->model->update($id, $data);
        return $this->respond($this->model->find($id));
    }

    public function delete($id = null)
    {
        if (!$id || !$coupon = $this->model->find($id)) {
            return $this->failNotFound('Cupón no encontrado');
        }

        $this->model->delete($id);
        return $this->respondDeleted(['id' => $id, 'message' => 'Cupón eliminado exitosamente']);
    }
}
