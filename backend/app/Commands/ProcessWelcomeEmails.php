<?php

namespace App\Commands;

use App\Libraries\WelcomeEmailService;
use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

class ProcessWelcomeEmails extends BaseCommand
{
    protected $group = 'Email';
    protected $name = 'welcome:process';
    protected $description = 'Processes queued welcome emails without blocking the registration API response.';

    public function run(array $params): int
    {
        $service = new WelcomeEmailService();
        $result = $service->processQueue();

        CLI::write(sprintf('Processed: %d | Failed permanently: %d', $result['processed'], $result['failed']));

        return EXIT_SUCCESS;
    }
}
