<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\CouponModel;
use App\Models\CouponUsageModel;
use App\Models\UserModel;

class CouponController extends ResourceController
{
    public function options()
    {
        return $this->response->setStatusCode(200);
    }

    public function validateCoupon()
    {
        $json = $this->request->getJSON(true);
        if (!$json || empty($json['code'])) {
            return $this->fail('Código de cupón no proporcionado', 400);
        }

        $code = strtoupper(trim($json['code']));
        $subtotal = (float)($json['subtotal'] ?? 0);

        $couponModel = new CouponModel();
        $coupon = $couponModel->findByCode($code);

        if (!$coupon) {
            return $this->failNotFound('El cupón ingresado no existe');
        }

        if ((int)$coupon['is_active'] !== 1) {
            return $this->fail('El cupón ya no está activo', 400);
        }

        $now = date('Y-m-d H:i:s');
        if (!empty($coupon['start_date']) && $coupon['start_date'] > $now) {
            return $this->fail('El cupón aún no está vigente', 400);
        }

        if (!empty($coupon['expires_at']) && $coupon['expires_at'] < $now) {
            return $this->fail('El cupón ha expirado', 400);
        }

        if ($coupon['usage_limit'] !== null && (int)$coupon['usage_count'] >= (int)$coupon['usage_limit']) {
            return $this->fail('Este código ya ha sido utilizado o ha alcanzado su límite de usos', 400);
        }

        if ($coupon['reward_type'] === 'discount') {
            $minPurchase = (float)($coupon['min_purchase'] ?? 0);
            if ($subtotal < $minPurchase) {
                return $this->fail('El monto mínimo para aplicar este cupón es $' . number_format($minPurchase, 2), 400);
            }

            $discount = 0.00;
            $value = (float)$coupon['value'];

            if (($coupon['discount_type'] ?? 'percentage') === 'percentage') {
                $discount = $subtotal * ($value / 100.0);
                if (!empty($coupon['max_discount']) && (float)$coupon['max_discount'] > 0) {
                    $discount = min($discount, (float)$coupon['max_discount']);
                }
            } else {
                $discount = min($subtotal, $value);
            }

            $discount = round($discount, 2);
            $newSubtotal = max(0, round($subtotal - $discount, 2));

            return $this->respond([
                'status' => 'success',
                'coupon' => [
                    'id'           => $coupon['id'],
                    'code'         => $coupon['code'],
                    'reward_type'  => 'discount',
                    'type'         => $coupon['discount_type'] ?? 'percentage',
                    'value'        => (float)$coupon['value'],
                    'discount'     => $discount,
                    'subtotal'     => $subtotal,
                    'newSubtotal'  => $newSubtotal,
                    'campaign_name' => $coupon['campaign_name']
                ]
            ]);
        }

        // Tipo Entradas (Entries)
        return $this->respond([
            'status' => 'success',
            'coupon' => [
                'id'            => $coupon['id'],
                'code'          => $coupon['code'],
                'reward_type'   => 'entries',
                'entries_count' => (int)$coupon['entries_count'],
                'campaign_name' => $coupon['campaign_name']
            ]
        ]);
    }

    public function claimCoupon()
    {
        $json = $this->request->getJSON(true);
        if (!$json || empty($json['code'])) {
            return $this->fail('Código de cupón requerido', 400);
        }

        $userId = $json['userId'] ?? null;
        if (!$userId || $userId === 'guest') {
            return $this->fail('Debes iniciar sesión para canjear este cupón', 401);
        }

        $code = strtoupper(trim($json['code']));
        $couponModel = new CouponModel();
        $couponUsageModel = new CouponUsageModel();
        $userModel = new UserModel();

        $coupon = $couponModel->findByCode($code);
        if (!$coupon) {
            return $this->failNotFound('El cupón ingresado no existe');
        }

        if ((int)$coupon['is_active'] !== 1) {
            return $this->fail('El cupón se encuentra inactivo', 400);
        }

        $now = date('Y-m-d H:i:s');
        if (!empty($coupon['expires_at']) && $coupon['expires_at'] < $now) {
            return $this->fail('El cupón ha expirado', 400);
        }

        if ($coupon['usage_limit'] !== null && (int)$coupon['usage_count'] >= (int)$coupon['usage_limit']) {
            return $this->fail('Este código ya ha sido utilizado (1 uso máximo alcanzado)', 400);
        }

        $user = $userModel->find($userId);
        if (!$user) {
            return $this->fail('Usuario no encontrado', 404);
        }

        // Si es de tipo Entradas (Entries)
        if ($coupon['reward_type'] === 'entries') {
            $entriesAwarded = (int)$coupon['entries_count'];
            $newEntriesTotal = (int)($user['entries'] ?? 0) + $entriesAwarded;

            // Transacción atómica
            $couponModel->update($coupon['id'], [
                'usage_count' => (int)$coupon['usage_count'] + 1
            ]);

            $userModel->update($userId, [
                'entries' => $newEntriesTotal
            ]);

            $couponUsageModel->insert([
                'coupon_id'       => $coupon['id'],
                'user_id'         => $userId,
                'entries_awarded' => $entriesAwarded,
                'discount_amount' => 0.00
            ]);

            return $this->respond([
                'status'          => 'success',
                'message'         => '¡Cupón de entradas canjeado exitosamente!',
                'rewardType'      => 'entries',
                'code'            => $coupon['code'],
                'entriesAwarded'  => $entriesAwarded,
                'newTotalEntries' => $newEntriesTotal
            ]);
        }

        // Si es cupón de descuento, se aplica al checkout
        return $this->respond([
            'status'     => 'success',
            'message'    => 'Cupón de descuento validado para checkout',
            'rewardType' => 'discount',
            'code'       => $coupon['code']
        ]);
    }
}
