<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\OrderModel;

class WebhookController extends ResourceController
{
    public function options()
    {
        return $this->response->setStatusCode(200);
    }

    public function stripe()
    {
        $payload = @file_get_contents('php://input');
        $event = json_decode($payload, true);

        if (json_last_error() !== JSON_ERROR_NONE || !isset($event['type'])) {
            return $this->fail('Invalid payload', 400);
        }

        // Webhook handler
        switch ($event['type']) {
            case 'payment_intent.succeeded':
                $paymentIntent = $event['data']['object'];
                $this->handlePaymentSucceeded($paymentIntent);
                break;
            default:
                // Ignore other events
                break;
        }

        return $this->respond(['status' => 'success']);
    }

    private function handlePaymentSucceeded($paymentIntent)
    {
        $stripePaymentIntentId = $paymentIntent['id'] ?? null;
        if (!$stripePaymentIntentId) return;

        $orderModel = new OrderModel();
        $order = $orderModel->where('stripe_payment_intent_id', $stripePaymentIntentId)->first();

        if ($order && $order['status'] === 'pending') {
            // Cambiar la orden a completada
            $orderModel->update($order['id'], [
                'status' => 'completed'
            ]);
            
            // Send email receipt
            \App\Libraries\EmailHelper::sendOrderReceipt($order['id']);
            
            // Nota: Las entradas al sorteo se calculan dinámicamente en UserController
            // cuando el status es 'completed', por lo que no es necesario modificar
            // la tabla de usuarios aquí manualmente.
        }
    }
}
