<?php

use App\Libraries\WelcomeEmailQueue;
use CodeIgniter\Test\CIUnitTestCase;

final class WelcomeEmailQueueTest extends CIUnitTestCase
{
    public function testQueueCreatesJsonJobFile(): void
    {
        $queueDir = sys_get_temp_dir() . '/bb_welcome_queue_' . uniqid('', true);
        $queue = new WelcomeEmailQueue($queueDir);

        $jobId = $queue->enqueue([
            'user_id' => 'usr_123',
            'first_name' => 'Ana',
            'account_email' => 'ana@example.com',
            'action_url' => 'https://border-built.com/login',
            'support_url' => 'https://border-built.com/contact'
        ]);

        $this->assertNotEmpty($jobId);
        $this->assertDirectoryExists($queueDir);
        $this->assertNotSame([], glob($queueDir . '/*.json'));
    }
}
