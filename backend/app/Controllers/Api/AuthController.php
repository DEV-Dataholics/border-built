<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;

class AuthController extends ResourceController
{
    protected $format = 'json';

    public function options()
    {
        return $this->response->setStatusCode(200);
    }

    public function register()
    {
        $json = $this->request->getJSON(true);
        if (!$json) {
            return $this->failValidationErrors('Invalid JSON payload');
        }

        $email    = $json['email']    ?? '';
        $name     = $json['name']     ?? '';
        $password = $json['password'] ?? '';

        if (empty($email) || empty($password) || empty($name)) {
            return $this->failValidationErrors('Name, email and password are required');
        }

        $userModel = new UserModel();

        if ($userModel->where('email', $email)->first()) {
            return $this->failResourceExists('Email already in use');
        }

        $userId = 'usr_' . substr(md5(uniqid(rand(), true)), 0, 10);

        $userData = [
            'id'       => $userId,
            'name'     => $name,
            'email'    => $email,
            'password' => password_hash($password, PASSWORD_DEFAULT),
            'role'     => 'user',
            'entries'  => 0,
            'total_spent' => 0.00,
        ];

        if ($userModel->insert($userData)) {
            try {
                \App\Libraries\EmailHelper::sendWelcomeEmail($userData);
                log_message('info', 'Registration completed and welcome email sent to user {userId}', [
                    'userId' => $userId,
                ]);
            } catch (\Throwable $e) {
                log_message('error', 'Welcome email failed for user {userId}: {message}', [
                    'userId' => $userId,
                    'message' => $e->getMessage(),
                ]);
            }

            unset($userData['password']);
            return $this->respondCreated(['success' => true, 'user' => $userData]);
        }

        return $this->failServerError('Failed to create user');
    }

    private function dispatchWelcomeEmailBackgroundJob(string $jobId): void
    {
        $sparkPath = ROOTPATH . 'spark';
        $command = 'php ' . escapeshellarg($sparkPath) . ' welcome:process >/dev/null 2>&1 &';

        if (DIRECTORY_SEPARATOR === '\\') {
            $command = 'start /B php "' . str_replace('/', '\\', $sparkPath) . '" welcome:process > NUL 2>&1';
        }

        @exec($command, $output, $status);
        log_message('info', 'Background welcome email worker invoked for job {jobId}, status={status}', [
            'jobId' => $jobId,
            'status' => $status,
        ]);
    }

    public function login()
    {
        $json = $this->request->getJSON(true);
        if (!$json) {
            return $this->failValidationErrors('Invalid JSON payload');
        }

        $email    = $json['email']    ?? '';
        $password = $json['password'] ?? '';

        if (empty($email) || empty($password)) {
            return $this->failValidationErrors('Email and password are required');
        }

        $userModel = new UserModel();
        $user = $userModel->where('email', $email)->first();

        if (!$user || !password_verify($password, $user['password'])) {
            return $this->failUnauthorized('Invalid email or password');
        }

        unset($user['password']);

        $orderModel   = new \App\Models\OrderModel();
        $validOrders  = $orderModel
            ->where('user_id', $user['id'])
            ->whereIn('status', ['completed', 'shipped'])
            ->findAll();

        $computedEntries = 0;
        $computedSpent   = 0.0;
        foreach ($validOrders as $order) {
            $computedEntries += (int)   $order['entries_earned'];
            $computedSpent   += (float) $order['total'];
        }

        $couponUsageModel = new \App\Models\CouponUsageModel();
        $couponUsages = $couponUsageModel
            ->where('user_id', $user['id'])
            ->where('entries_awarded >', 0)
            ->findAll();
        foreach ($couponUsages as $cu) {
            $computedEntries += (int) ($cu['entries_awarded'] ?? 0);
        }

        $user['entries']     = $computedEntries;
        $user['total_spent'] = round($computedSpent, 2);

        return $this->respond(['success' => true, 'user' => $user]);
    }

    // ----------------------------------------------------------------
    // FORGOT PASSWORD — generate token & send email
    // ----------------------------------------------------------------
    public function forgotPassword()
    {
        $json  = $this->request->getJSON(true);
        $email = trim($json['email'] ?? '');

        if (empty($email)) {
            return $this->failValidationErrors('Email is required');
        }

        $userModel = new UserModel();
        $user      = $userModel->where('email', $email)->first();

        // Always respond with success to prevent email enumeration
        if (!$user) {
            return $this->respond(['success' => true, 'message' => 'If that email exists, a reset link has been sent.']);
        }

        // Generate a secure random token
        $token     = bin2hex(random_bytes(32)); // 64-char hex string
        $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));

        // Save token to DB
        $db = \Config\Database::connect();
        $db->table('password_resets')->insert([
            'email'      => $email,
            'token'      => $token,
            'expires_at' => $expiresAt,
            'used'       => 0,
            'created_at' => date('Y-m-d H:i:s'),
        ]);

        // Build reset URL
        $resetUrl = 'https://border-built.com/reset-password?token=' . $token;

        // Send email
        $emailService = \Config\Services::email();
        $emailService->setFrom(
            getenv('email.fromEmail') ?: 'noreply@border-built.com',
            getenv('email.fromName')  ?: 'BorderBuilt'
        );
        $emailService->setTo($email);
        $emailService->setSubject('Reset your BorderBuilt password');
        $emailService->setMessage($this->buildResetEmailHtml($user['name'], $resetUrl));

        $emailService->send();

        return $this->respond(['success' => true, 'message' => 'If that email exists, a reset link has been sent.']);
    }

    // ----------------------------------------------------------------
    // RESET PASSWORD — validate token & update password
    // ----------------------------------------------------------------
    public function resetPassword()
    {
        $json     = $this->request->getJSON(true);
        $token    = trim($json['token']    ?? '');
        $password = trim($json['password'] ?? '');

        if (empty($token) || empty($password)) {
            return $this->failValidationErrors('Token and new password are required');
        }

        if (strlen($password) < 6) {
            return $this->failValidationErrors('Password must be at least 6 characters');
        }

        $db    = \Config\Database::connect();
        $reset = $db->table('password_resets')
            ->where('token', $token)
            ->where('used', 0)
            ->where('expires_at >', date('Y-m-d H:i:s'))
            ->get()
            ->getRowArray();

        if (!$reset) {
            return $this->failUnauthorized('This reset link is invalid or has expired.');
        }

        // Update the user's password
        $userModel = new UserModel();
        $user      = $userModel->where('email', $reset['email'])->first();

        if (!$user) {
            return $this->failNotFound('User not found');
        }

        $userModel->update($user['id'], [
            'password' => password_hash($password, PASSWORD_DEFAULT),
        ]);

        // Mark token as used
        $db->table('password_resets')->where('token', $token)->update(['used' => 1]);

        return $this->respond(['success' => true, 'message' => 'Password updated successfully.']);
    }

    // ----------------------------------------------------------------
    // Private helper: HTML email template
    // ----------------------------------------------------------------
    private function buildResetEmailHtml(string $name, string $resetUrl): string
    {
        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your password</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #222;border-radius:12px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:#111;padding:32px 40px;border-bottom:1px solid #1a1a1a;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:900;letter-spacing:4px;color:#6af425;font-family:monospace;">[ BORDERBUILT ]</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="color:#fff;font-size:16px;margin:0 0 16px;">Hey {$name},</p>
              <p style="color:#aaa;font-size:14px;margin:0 0 32px;line-height:1.6;">
                We received a request to reset the password for your BorderBuilt account.
                Click the button below to set a new password. This link expires in <strong style="color:#fff;">1 hour</strong>.
              </p>
              <div style="text-align:center;margin:0 0 32px;">
                <a href="{$resetUrl}"
                   style="display:inline-block;background:#6af425;color:#000;font-weight:900;font-size:14px;
                          letter-spacing:2px;text-transform:uppercase;padding:16px 40px;border-radius:8px;
                          text-decoration:none;">
                  Reset My Password
                </a>
              </div>
              <p style="color:#555;font-size:12px;margin:0;line-height:1.6;">
                If you didn't request a password reset, you can safely ignore this email.
                Your password will not be changed.<br><br>
                Or copy this link:<br>
                <a href="{$resetUrl}" style="color:#6af425;word-break:break-all;">{$resetUrl}</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
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
    }
}
