<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\OrderModel;
use App\Models\UserModel;
use App\Models\ProductModel;
use App\Models\CouponModel;
use App\Models\CouponUsageModel;
use App\Models\OrderItemModel;

class OrderController extends ResourceController
{
    public function options()
    {
        return $this->response->setStatusCode(200);
    }

    public static function getStateTaxRate(string $stateInput): float
    {
        $rates = [
            'AL' => 0.04, 'AK' => 0.00, 'AZ' => 0.056, 'AR' => 0.065, 'CA' => 0.0725,
            'CO' => 0.029, 'CT' => 0.0635, 'DE' => 0.00, 'DC' => 0.06, 'FL' => 0.06,
            'GA' => 0.04, 'HI' => 0.04, 'ID' => 0.06, 'IL' => 0.0625, 'IN' => 0.07,
            'IA' => 0.06, 'KS' => 0.065, 'KY' => 0.06, 'LA' => 0.0445, 'ME' => 0.055,
            'MD' => 0.06, 'MA' => 0.0625, 'MI' => 0.06, 'MN' => 0.06875, 'MS' => 0.07,
            'MO' => 0.04225, 'MT' => 0.00, 'NE' => 0.055, 'NV' => 0.0685, 'NH' => 0.00,
            'NJ' => 0.06625, 'NM' => 0.05125, 'NY' => 0.04, 'NC' => 0.0475, 'ND' => 0.05,
            'OH' => 0.0575, 'OK' => 0.045, 'OR' => 0.00, 'PA' => 0.06, 'RI' => 0.07,
            'SC' => 0.06, 'SD' => 0.042, 'TN' => 0.07, 'TX' => 0.0825, 'UT' => 0.061,
            'VT' => 0.06, 'VA' => 0.053, 'WA' => 0.065, 'WV' => 0.06, 'WI' => 0.05,
            'WY' => 0.04,
            // Full names
            'ALABAMA' => 0.04, 'ALASKA' => 0.00, 'ARIZONA' => 0.056, 'ARKANSAS' => 0.065,
            'CALIFORNIA' => 0.0725, 'COLORADO' => 0.029, 'CONNECTICUT' => 0.0635,
            'DELAWARE' => 0.00, 'DISTRICT OF COLUMBIA' => 0.06, 'FLORIDA' => 0.06,
            'GEORGIA' => 0.04, 'HAWAII' => 0.04, 'IDAHO' => 0.06, 'ILLINOIS' => 0.0625,
            'INDIANA' => 0.07, 'IOWA' => 0.06, 'KANSAS' => 0.065, 'KENTUCKY' => 0.06,
            'LOUISIANA' => 0.0445, 'MAINE' => 0.055, 'MARYLAND' => 0.06,
            'MASSACHUSETTS' => 0.0625, 'MICHIGAN' => 0.06, 'MINNESOTA' => 0.06875,
            'MISSISSIPPI' => 0.07, 'MISSOURI' => 0.04225, 'MONTANA' => 0.00,
            'NEBRASKA' => 0.055, 'NEVADA' => 0.0685, 'NEW HAMPSHIRE' => 0.00,
            'NEW JERSEY' => 0.06625, 'NEW MEXICO' => 0.05125, 'NEW YORK' => 0.04,
            'NORTH CAROLINA' => 0.0475, 'NORTH DAKOTA' => 0.05, 'OHIO' => 0.0575,
            'OKLAHOMA' => 0.045, 'OREGON' => 0.00, 'PENNSYLVANIA' => 0.06,
            'RHODE ISLAND' => 0.07, 'SOUTH CAROLINA' => 0.06, 'SOUTH DAKOTA' => 0.042,
            'TENNESSEE' => 0.07, 'TEXAS' => 0.0825, 'UTAH' => 0.061,
            'VERMONT' => 0.06, 'VIRGINIA' => 0.053, 'WASHINGTON' => 0.065,
            'WEST VIRGINIA' => 0.06, 'WISCONSIN' => 0.05, 'WYOMING' => 0.04
        ];

        $clean = strtoupper(trim($stateInput));
        return $rates[$clean] ?? 0.00;
    }

    public function checkoutStatus()
    {
        $db = \Config\Database::connect();
        $cfgRow = $db->table('configs')->where('key', 'checkout_enabled')->get()->getRowArray();
        $enabled = ($cfgRow && $cfgRow['value'] === 'true');
        return $this->respond([
            'checkoutEnabled' => $enabled,
            'salesTaxEnabled' => true,
            'supportedStatesCount' => 51,
            'message' => $enabled ? 'Checkout is active' : 'Checkout is temporarily paused for launch preparations.'
        ]);
    }

    public function create()
    {
        $db = \Config\Database::connect();

        // Launch Guard: reject orders if checkout is paused
        $cfgRow = $db->table('configs')->where('key', 'checkout_enabled')->get()->getRowArray();
        $isCheckoutEnabled = ($cfgRow && $cfgRow['value'] === 'true');
        if (!$isCheckoutEnabled) {
            return $this->response->setStatusCode(423)->setJSON([
                'status' => 'error',
                'message' => 'Online checkout is temporarily paused for final launch preparations. Please check back shortly.'
            ]);
        }

        $orderModel = new OrderModel();
        $userModel = new UserModel();
        $productModel = new ProductModel();
        $couponModel = new CouponModel();
        $couponUsageModel = new CouponUsageModel();
        $orderItemModel = new OrderItemModel();

        $data = $this->request->getJSON(true);

        if (!$data) {
            return $this->fail('Invalid JSON');
        }

        $userId = $data['userId'] ?? 'guest';

        // Sequential Order Counter starting on Order 1
        try {
            $db->query("CREATE TABLE IF NOT EXISTS order_sequence (
                id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4");
            $db->query("INSERT INTO order_sequence () VALUES ()");
            $orderNumber = (int) $db->insertID();
        } catch (\Throwable $e) {
            $maxRow = $db->query("SELECT MAX(CAST(id AS UNSIGNED)) AS max_id FROM orders")->getRow();
            $orderNumber = ($maxRow && $maxRow->max_id) ? ((int)$maxRow->max_id + 1) : 1;
        }
        $orderId = (string) $orderNumber;

        $subtotal = (float)($data['subtotal'] ?? 0);
        $shipping = (float)($data['shipping'] ?? 0);
        $couponCode = !empty($data['couponCode']) ? strtoupper(trim($data['couponCode'])) : null;
        $discountAmount = 0.00;
        $appliedCoupon = null;

        // Validar y recalcular cupón en servidor
        if ($couponCode) {
            $coupon = $couponModel->findByCode($couponCode);
            if ($coupon && (int)$coupon['is_active'] === 1) {
                $now = date('Y-m-d H:i:s');
                $isDateValid = (empty($coupon['start_date']) || $coupon['start_date'] <= $now) &&
                               (empty($coupon['expires_at']) || $coupon['expires_at'] >= $now);
                $isLimitValid = ($coupon['usage_limit'] === null || (int)$coupon['usage_count'] < (int)$coupon['usage_limit']);
                $isMinValid = ($subtotal >= (float)($coupon['min_purchase'] ?? 0));

                if ($isDateValid && $isLimitValid && $isMinValid) {
                    $val = (float)$coupon['value'];
                    if ($coupon['reward_type'] === 'discount') {
                        if (($coupon['discount_type'] ?? 'percentage') === 'percentage') {
                            $discountAmount = $subtotal * ($val / 100.0);
                            if (!empty($coupon['max_discount']) && (float)$coupon['max_discount'] > 0) {
                                $discountAmount = min($discountAmount, (float)$coupon['max_discount']);
                            }
                        } else {
                            $discountAmount = min($subtotal, $val);
                        }
                    }
                    $discountAmount = round($discountAmount, 2);
                    $appliedCoupon = $coupon;
                }
            }
        }

        // 1. Calculate Tax (All 50 US States + DC)
        $shippingState = strtoupper(trim($data['shippingState'] ?? ''));
        if (empty($shippingState) && !empty($data['shippingAddress'])) {
            $addr = strtoupper($data['shippingAddress']);
            foreach (['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'] as $st) {
                if (preg_match('/\b' . $st . '\b/', $addr)) {
                    $shippingState = $st;
                    break;
                }
            }
        }

        $taxRate = self::getStateTaxRate($shippingState);

        $taxableAmount = max(0, $subtotal - $discountAmount);
        $taxAmount = round($taxableAmount * $taxRate, 2);

        $finalTotal = max(0, round($taxableAmount + $taxAmount + $shipping, 2));

        // Deducción de Stock (Standard & Mystery Box bundle items)
        if (isset($data['items']) && is_array($data['items'])) {
            foreach ($data['items'] as $item) {
                if (isset($item['productId']) && isset($item['quantity'])) {
                    $itemQty = (int) $item['quantity'];
                    $product = $productModel->find($item['productId']);

                    // Deduct stock for main product
                    if ($product && isset($product['stock'])) {
                        $newStock = max(0, (int)$product['stock'] - $itemQty);
                        $productModel->update($product['id'], ['stock' => $newStock]);
                    }

                    // Deduct stock for bundled items inside Mystery Box
                    $bundleItems = $item['bundleItems'] ?? [];
                    if (!empty($bundleItems) && is_array($bundleItems)) {
                        foreach ($bundleItems as $bundle) {
                            $bundledProdId = $bundle['productId'] ?? null;
                            $bundledQty    = (int) ($bundle['quantity'] ?? 1);
                            if ($bundledProdId) {
                                $bundledProd = $productModel->find($bundledProdId);
                                if ($bundledProd && isset($bundledProd['stock'])) {
                                    $deductQty = $bundledQty * $itemQty;
                                    $newBundledStock = max(0, (int)$bundledProd['stock'] - $deductQty);
                                    $productModel->update($bundledProdId, ['stock' => $newBundledStock]);
                                }
                            }
                        }
                    }
                }
            }
        }

        // Crear PaymentIntent en Stripe via REST API
        $stripePaymentIntentId = null;
        $stripeClientSecret = null;
        $stripeSecretKey = getenv('STRIPE_SECRET_KEY') ?: '';

        $stripeError = null;
        if (!empty($stripeSecretKey) && $finalTotal > 0) {
            $stripeResult = $this->createStripePaymentIntent($stripeSecretKey, [
                'amount' => (int)round($finalTotal * 100),
                'currency' => getenv('STRIPE_CURRENCY') ?: 'usd',
                'description' => 'Orden ' . $orderId . ' - BorderApp',
                'metadata' => [
                    'order_id' => $orderId,
                    'user_id' => $userId,
                    'coupon_code' => $couponCode ?? 'NONE',
                    'discount_amount' => $discountAmount,
                    'subtotal' => $subtotal,
                    'tax' => $taxAmount,
                    'shipping' => $shipping,
                    'total' => $finalTotal,
                ]
            ]);

            if (isset($stripeResult['error'])) {
                $stripeError = $stripeResult['error'];
            } elseif ($stripeResult && !empty($stripeResult['id'])) {
                $stripePaymentIntentId = $stripeResult['id'];
                $stripeClientSecret = $stripeResult['client_secret'] ?? null;
            }
        }

        $orderData = [
            'id'                       => $orderId,
            'user_id'                  => $userId,
            'subtotal'                 => $subtotal,
            'shipping'                 => $shipping,
            'coupon_code'              => $couponCode,
            'discount'                 => $discountAmount,
            'tax'                      => $taxAmount,
            'total'                    => $finalTotal,
            'entries_earned'           => $data['entriesEarned'] ?? 0,
            'multiplier_used'          => $data['multiplierUsed'] ?? 1,
            'status'                   => ($finalTotal <= 0) ? 'completed' : ($data['status'] ?? 'completed'),
            'shipping_address'         => $data['shippingAddress'] ?? '',
            'stripe_payment_intent_id' => $stripePaymentIntentId,
        ];

        $orderModel->insert($orderData);

        // Insert items into order_items
        if (isset($data['items']) && is_array($data['items'])) {
            foreach ($data['items'] as $item) {
                $bundleItems = $item['bundleItems'] ?? null;
                $orderItemModel->insert([
                    'order_id'     => $orderId,
                    'product_id'   => $item['productId'] ?? 0,
                    'name'         => $item['name'] ?? '',
                    'size'         => $item['size'] ?? null,
                    'color'        => $item['color'] ?? null,
                    'quantity'     => $item['quantity'] ?? 1,
                    'price'        => $item['price'] ?? 0.00,
                    'bundle_items' => !empty($bundleItems) ? json_encode($bundleItems) : null,
                ]);
            }
        }

        // Incrementar uso de cupón y guardar log de uso
        if ($appliedCoupon) {
            $couponModel->update($appliedCoupon['id'], [
                'usage_count' => (int)$appliedCoupon['usage_count'] + 1
            ]);

            $couponUsageModel->insert([
                'coupon_id' => $appliedCoupon['id'],
                'order_id' => $orderId,
                'user_id' => $userId,
                'discount_amount' => $discountAmount,
            ]);
        }

        // NOTE: We no longer increment users.entries / users.total_spent here.
        // Entries and total_spent are computed dynamically from valid orders
        // (status IN 'completed','shipped') in UserController::show().
        // This prevents inflation from test orders, cancelled payments, etc.

        // Send email receipt immediately if the order is free ($0 total)
        if ($finalTotal <= 0) {
            \App\Libraries\EmailHelper::sendOrderReceipt($orderId);
        }

        return $this->respondCreated([
            'status' => 'success',
            'orderId' => $orderId,
            'couponCode' => $couponCode,
            'discount' => $discountAmount,
            'total' => $finalTotal,
            'stripePaymentIntentId' => $stripePaymentIntentId,
            'stripeClientSecret' => $stripeClientSecret,
            'stripeError' => $stripeError
        ]);
    }

    private function createStripePaymentIntent(string $secretKey, array $params)
    {
        if (!function_exists('curl_init')) {
            return null;
        }

        $ch = curl_init('https://api.stripe.com/v1/payment_intents');
        
        $postFields = [
            'amount' => $params['amount'],
            'currency' => $params['currency'],
            'description' => $params['description'],
            'automatic_payment_methods[enabled]' => 'true',
        ];

        if (!empty($params['metadata']) && is_array($params['metadata'])) {
            foreach ($params['metadata'] as $key => $val) {
                $postFields["metadata[{$key}]"] = (string)$val;
            }
        }

        curl_setopt($ch, \CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, \CURLOPT_POST, true);
        curl_setopt($ch, \CURLOPT_POSTFIELDS, http_build_query($postFields));
        curl_setopt($ch, \CURLOPT_USERPWD, $secretKey . ':');
        curl_setopt($ch, \CURLOPT_TIMEOUT, 10);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode >= 200 && $httpCode < 300 && $response) {
            return json_decode($response, true);
        }

        if ($response) {
            $decoded = json_decode($response, true);
            if (isset($decoded['error'])) {
                return ['error' => $decoded['error']];
            }
            // Include raw response in message so we can see it in frontend
            return ['error' => ['message' => 'Stripe HTTP ' . $httpCode . ' Raw: ' . strip_tags($response)]];
        }

        return ['error' => ['message' => 'Unknown cURL error to Stripe']];
    }

    public function userOrders($userId)
    {
        $orderModel = new OrderModel();
        $orderItemModel = new OrderItemModel();

        // Get orders for the user, ordered by newest first
        $orders = $orderModel->where('user_id', $userId)
                             ->orderBy('created_at', 'DESC')
                             ->findAll();

        foreach ($orders as &$order) {
            $order['total'] = (float) $order['total'];
            $order['entries_earned'] = (int) $order['entries_earned'];
            $order['status'] = !empty($order['status']) ? $order['status'] : 'pending';
            
            // Attach items
            $items = $orderItemModel->where('order_id', $order['id'])->findAll();
            $order['items'] = $items;
        }

        return $this->respond($orders);
    }
    public function confirmStripePayment()
    {
        $json = $this->request->getJSON(true);
        if (!$json || empty($json['paymentIntentId'])) {
            return $this->failValidationErrors('Payment Intent ID required');
        }

        $paymentIntentId = $json['paymentIntentId'];
        $stripeSecretKey = getenv('STRIPE_SECRET_KEY') ?: '';

        $ch = curl_init('https://api.stripe.com/v1/payment_intents/' . $paymentIntentId);
        curl_setopt($ch, \CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, \CURLOPT_USERPWD, $stripeSecretKey . ':');
        curl_setopt($ch, \CURLOPT_TIMEOUT, 10);
        $response = curl_exec($ch);
        curl_close($ch);

        if (!$response) {
            return $this->fail('Failed to connect to Stripe');
        }

        $stripeData = json_decode($response, true);
        if (isset($stripeData['status']) && $stripeData['status'] === 'succeeded') {
            $orderModel = new OrderModel();
            $order = $orderModel->where('stripe_payment_intent_id', $paymentIntentId)->first();

            if ($order && $order['status'] === 'pending') {
                $orderModel->update($order['id'], ['status' => 'completed']);
                \App\Libraries\EmailHelper::sendOrderReceipt($order['id']);
                return $this->respond(['status' => 'success', 'message' => 'Order completed']);
            }
            return $this->respond(['status' => 'already_processed']);
        }

        return $this->fail('Payment not successful in Stripe');
    }
}
