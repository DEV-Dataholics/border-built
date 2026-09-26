<?php

namespace App\Libraries;

use App\Models\OrderModel;
use App\Models\OrderItemModel;
use App\Models\UserModel;

class EmailHelper
{
    public static function sendShippingEmail($orderId)
    {
        $orderModel = new \App\Models\OrderModel();
        $order = $orderModel->find($orderId);
        if (!$order) return false;

        $userModel = new \App\Models\UserModel();
        $user = $userModel->find($order['user_id']);
        if (!$user) return false;

        $emailService = \Config\Services::email();
        $emailService->setFrom(
            getenv('email.fromEmail') ?: 'noreply@border-built.com',
            getenv('email.fromName')  ?: 'BorderBuilt'
        );
        $emailService->setTo($user['email']);
        $emailService->setSubject('Your Order has Shipped! - Order #' . $orderId);

        $html = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #222;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background:#111;padding:32px 40px;border-bottom:1px solid #1a1a1a;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:900;letter-spacing:4px;color:#6af425;font-family:monospace;">[ BORDERBUILT ]</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;text-align:center;">
              <p style="color:#fff;font-size:20px;margin:0 0 15px;font-weight:bold;">Great news, {$user['name']}!</p>
              <p style="color:#aaa;font-size:15px;margin:0 0 32px;line-height:1.6;">
                Your order <strong>#{$orderId}</strong> is now on its way! We've packed it up and handed it over to our shipping partners. 
              </p>
              <p style="color:#aaa;font-size:15px;margin:0 0 32px;line-height:1.6;">
                Your entries for the giveaway are safely logged in our system. Thank you for your support!
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #1a1a1a;text-align:center;">
              <p style="color:#333;font-size:11px;margin:0;">&copy; 2026 BorderBuilt &bull; border-built.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;

        $emailService->setMessage($html);
        return $emailService->send();
    }

    public static function sendOrderReceipt($orderId)
    {
        $orderModel = new OrderModel();
        $order = $orderModel->find($orderId);
        
        if (!$order) {
            return false;
        }

        $userModel = new UserModel();
        $user = $userModel->find($order['user_id']);
        
        if (!$user) {
            return false;
        }

        $orderItemModel = new OrderItemModel();
        $items = $orderItemModel->where('order_id', $orderId)->findAll();

        $emailService = \Config\Services::email();
        $emailService->setFrom(
            getenv('email.fromEmail') ?: 'noreply@border-built.com',
            getenv('email.fromName')  ?: 'BorderBuilt'
        );
        $emailService->setTo($user['email']);
        $emailService->setSubject('Your BorderBuilt Receipt - Order #' . $orderId);

        // Build items HTML
        $itemsHtml = '';
        foreach ($items as $item) {
            $price = number_format($item['price'], 2);
            $total = number_format($item['price'] * $item['quantity'], 2);
            $itemsHtml .= "
                <tr>
                    <td style='padding: 10px 0; border-bottom: 1px solid #222; color: #fff;'>{$item['name']}</td>
                    <td style='padding: 10px 0; border-bottom: 1px solid #222; color: #aaa; text-align: center;'>{$item['quantity']}</td>
                    <td style='padding: 10px 0; border-bottom: 1px solid #222; color: #fff; text-align: right;'>\${$total}</td>
                </tr>
            ";
        }

        $subtotal = number_format($order['subtotal'], 2);
        $shipping = number_format($order['shipping'], 2);
        $discount = number_format($order['discount'], 2);
        $taxVal   = (float) ($order['tax'] ?? 0);
        $taxFormatted = number_format($taxVal, 2);
        $taxHtml  = ($taxVal > 0) ? "<tr><td style=\"padding: 5px 0; color: #aaa;\">Tax (TX 8.25%)</td><td style=\"padding: 5px 0; color: #fff; text-align: right;\">\${$taxFormatted}</td></tr>" : "";
        $total    = number_format($order['total'], 2);

        $html = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #222;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background:#111;padding:32px 40px;border-bottom:1px solid #1a1a1a;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:900;letter-spacing:4px;color:#6af425;font-family:monospace;">[ BORDERBUILT ]</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="color:#fff;font-size:18px;margin:0 0 10px;font-weight:bold;">Thank you for your order, {$user['name']}!</p>
              <p style="color:#aaa;font-size:14px;margin:0 0 32px;line-height:1.6;">
                We've received your order <strong>#{$orderId}</strong> and are getting it ready to ship. 
                You earned <strong style="color:#6af425;">{$order['entries_earned']} entries</strong> into the giveaway!
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <thead>
                  <tr>
                    <th style="text-align: left; padding-bottom: 10px; border-bottom: 1px solid #444; color: #888; text-transform: uppercase; font-size: 12px;">Item</th>
                    <th style="text-align: center; padding-bottom: 10px; border-bottom: 1px solid #444; color: #888; text-transform: uppercase; font-size: 12px;">Qty</th>
                    <th style="text-align: right; padding-bottom: 10px; border-bottom: 1px solid #444; color: #888; text-transform: uppercase; font-size: 12px;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {$itemsHtml}
                </tbody>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 5px 0; color: #aaa;">Subtotal</td>
                  <td style="padding: 5px 0; color: #fff; text-align: right;">\${$subtotal}</td>
                </tr>
                {$taxHtml}
                <tr>
                  <td style="padding: 5px 0; color: #aaa;">Shipping</td>
                  <td style="padding: 5px 0; color: #fff; text-align: right;">\${$shipping}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #aaa;">Discount</td>
                  <td style="padding: 5px 0; color: #f87171; text-align: right;">-\${$discount}</td>
                </tr>
                <tr>
                  <td style="padding: 15px 0 0; color: #fff; font-weight: bold; font-size: 18px; border-top: 1px solid #333;">Total</td>
                  <td style="padding: 15px 0 0; color: #6af425; font-weight: bold; font-size: 18px; text-align: right; border-top: 1px solid #333;">\${$total}</td>
                </tr>
              </table>

              <div style="margin-top: 40px; padding: 20px; background: #1a1a1a; border-radius: 8px;">
                <p style="color: #888; font-size: 12px; margin: 0 0 5px; text-transform: uppercase;">Shipping Address</p>
                <p style="color: #ddd; font-size: 14px; margin: 0;">{$order['shipping_address']}</p>
              </div>

            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #1a1a1a;text-align:center;">
              <p style="color:#333;font-size:11px;margin:0;">© 2026 BorderBuilt · border-built.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;

        $emailService->setMessage($html);
        return $emailService->send();
    }

    public static function sendWelcomeEmail($user)
    {
        $emailService = \Config\Services::email();
        $emailService->setFrom(
            getenv('email.fromEmail') ?: 'noreply@border-built.com',
            getenv('email.fromName')  ?: 'BorderBuilt'
        );
        $emailService->setTo($user['email']);
        $emailService->setSubject('Welcome to BorderBuilt!');

        $html = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #222;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background:#111;padding:32px 40px;border-bottom:1px solid #1a1a1a;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:900;letter-spacing:4px;color:#6af425;font-family:monospace;">[ BORDERBUILT ]</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;text-align:center;">
              <p style="color:#fff;font-size:20px;margin:0 0 15px;font-weight:bold;">Welcome to the family, {$user['name']}!</p>
              <p style="color:#aaa;font-size:15px;margin:0 0 32px;line-height:1.6;">
                Your account has been successfully created. You can now track your orders, view your giveaway entries, and get exclusive access to our drops.
              </p>
              <a href="https://border-built.com/login" style="display:inline-block;background:#6af425;color:#000;font-weight:bold;text-decoration:none;padding:12px 24px;border-radius:4px;text-transform:uppercase;font-size:14px;">Log In to Your Garage</a>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #1a1a1a;text-align:center;">
              <p style="color:#333;font-size:11px;margin:0;">© 2026 BorderBuilt · border-built.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;

        $emailService->setMessage($html);
        return $emailService->send();
    }
}
