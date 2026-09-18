<?php

namespace App\Libraries;

use CodeIgniter\Email\Email;
use RuntimeException;

class WelcomeEmailService
{
    protected WelcomeEmailQueue $queue;

    public function __construct(?WelcomeEmailQueue $queue = null)
    {
        $this->queue = $queue ?? new WelcomeEmailQueue();
    }

    public function queueWelcomeEmail(array $user): string
    {
        $payload = [
            'user_id' => (string) ($user['id'] ?? $user['user_id'] ?? 'unknown'),
            'first_name' => trim((string) ($user['name'] ?? $user['first_name'] ?? '')),
            'user_name' => trim((string) ($user['name'] ?? $user['first_name'] ?? '')),
            'account_email' => trim((string) ($user['email'] ?? '')),
            'action_url' => rtrim((string) getenv('APP_URL') ?: 'https://border-built.com', '/') . '/login',
            'support_url' => 'https://border-built.com/contact',
        ];

        if ($payload['account_email'] === '') {
            throw new RuntimeException('Account email is required for welcome email queueing.');
        }

        $jobId = $this->queue->enqueue($payload);
        log_message('info', 'Welcome email queued for user {user_id} [{job_id}]', ['user_id' => $payload['user_id'], 'job_id' => $jobId]);

        return $jobId;
    }

    public function processQueue(): array
    {
        $processed = 0;
        $failed = 0;

        foreach ($this->queue->getPendingJobs() as $entry) {
            $file = $entry['file'];
            $job = $entry['job'];
            $payload = $job['payload'] ?? [];
            $attempts = (int) ($job['attempts'] ?? 0);

            try {
                $this->deliver($payload);
                $this->queue->delete($file);
                $processed++;
                log_message('info', 'Welcome email status SENT user_id={user_id}', ['user_id' => $payload['user_id'] ?? 'unknown']);
            } catch (\Throwable $e) {
                $attempts++;
                $job['attempts'] = $attempts;
                $this->queue->markStatus($file, $attempts >= 5 ? 'FAILED' : 'QUEUED', ['attempts' => $attempts, 'last_error' => $e->getMessage()]);

                if ($attempts >= 5) {
                    $failed++;
                    log_message('error', 'Welcome email status FAILED user_id={user_id}: {message}', ['user_id' => $payload['user_id'] ?? 'unknown', 'message' => $e->getMessage()]);
                } else {
                    log_message('warning', 'Welcome email retry scheduled for user_id={user_id} attempt={attempt}', ['user_id' => $payload['user_id'] ?? 'unknown', 'attempt' => $attempts]);
                }
            }
        }

        return ['processed' => $processed, 'failed' => $failed];
    }

    public function deliver(array $payload): bool
    {
        $emailEnabled = filter_var((string) (getenv('EMAIL_ENABLED') ?: getenv('email.enabled') ?: true), FILTER_VALIDATE_BOOLEAN);
        if (!$emailEnabled) {
            log_message('info', 'Welcome email delivery disabled for user_id={user_id}', ['user_id' => $payload['user_id'] ?? 'unknown']);
            return true;
        }

        $emailService = new Email();
        $emailService->setFrom(
            getenv('email.fromEmail') ?: 'noreply@border-built.com',
            getenv('email.fromName') ?: 'BorderBuilt'
        );
        $emailService->setTo($payload['account_email']);
        $emailService->setSubject('Welcome to BorderBuilt!');
        $emailService->setMessage($this->buildWelcomeHtml($payload));
        $emailService->setAltMessage($this->buildWelcomeText($payload));

        $host = getenv('email.SMTPHost') ?: '';
        if ($host !== '') {
            $emailService->setProtocol('smtp');
            $emailService->SMTPHost = $host;
            $emailService->SMTPUser = getenv('email.SMTPUser') ?: '';
            $emailService->SMTPPass = getenv('email.SMTPPass') ?: '';
            $emailService->SMTPPort = (int) (getenv('email.SMTPPort') ?: 465);
            $emailService->SMTPCrypto = getenv('email.SMTPCrypto') ?: 'ssl';
        }

        $sent = $emailService->send();
        if (!$sent) {
            throw new RuntimeException('Welcome email send operation returned false.');
        }

        return true;
    }

    protected function buildWelcomeHtml(array $payload): string
    {
        $userName = htmlspecialchars((string) ($payload['user_name'] ?? $payload['first_name'] ?? 'friend'), ENT_QUOTES, 'UTF-8');
        $email = htmlspecialchars((string) ($payload['account_email'] ?? ''), ENT_QUOTES, 'UTF-8');
        $actionUrl = htmlspecialchars((string) ($payload['action_url'] ?? 'https://border-built.com/login'), ENT_QUOTES, 'UTF-8');
        $supportUrl = htmlspecialchars((string) ($payload['support_url'] ?? 'https://border-built.com/contact'), ENT_QUOTES, 'UTF-8');

        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to BorderBuilt</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#111;border:1px solid #222;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background:#111;padding:32px 40px;border-bottom:1px solid #1a1a1a;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:900;letter-spacing:4px;color:#6af425;font-family:monospace;">[ BORDERBUILT ]</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="color:#fff;font-size:20px;margin:0 0 15px;font-weight:bold;">Welcome to the family, {$userName}!</p>
              <p style="color:#aaa;font-size:15px;margin:0 0 24px;line-height:1.6;">
                Your BorderBuilt account has been created successfully for <strong style="color:#fff;">{$email}</strong>.
                Your dashboard is ready and you can start exploring the platform right away.
              </p>
              <div style="text-align:center;margin:0 0 28px;">
                <a href="{$actionUrl}" style="display:inline-block;background:#6af425;color:#000;font-weight:900;text-decoration:none;padding:14px 28px;border-radius:8px;text-transform:uppercase;font-size:14px;letter-spacing:1px;">Log In</a>
              </div>
              <p style="color:#aaa;font-size:14px;margin:0;line-height:1.6;">
                Need help? Reach us at <a href="{$supportUrl}" style="color:#6af425;text-decoration:none;">Support</a>.
              </p>
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
    }

    protected function buildWelcomeText(array $payload): string
    {
        $userName = (string) ($payload['user_name'] ?? $payload['first_name'] ?? 'friend');
        $email = (string) ($payload['account_email'] ?? '');
        $actionUrl = (string) ($payload['action_url'] ?? 'https://border-built.com/login');
        $supportUrl = (string) ($payload['support_url'] ?? 'https://border-built.com/contact');

        return "Welcome to BorderBuilt, {$userName}!\n\n" .
            "Your account was created successfully for {$email}.\n" .
            "Login here: {$actionUrl}\n\n" .
            "Need help? Contact support: {$supportUrl}\n";
    }
}
