<?php

namespace App\Libraries;

class WelcomeEmailQueue
{
    protected string $queueDir;

    public function __construct(?string $queueDir = null)
    {
        $this->queueDir = $queueDir ?? WRITEPATH . 'welcome_emails';

        if (!is_dir($this->queueDir) && !@mkdir($this->queueDir, 0775, true) && !is_dir($this->queueDir)) {
            throw new \RuntimeException('Unable to create the welcome email queue directory.');
        }
    }

    public function enqueue(array $payload): string
    {
        $jobId = 'welcome_' . bin2hex(random_bytes(6));
        $job = [
            'id' => $jobId,
            'status' => 'QUEUED',
            'created_at' => gmdate('c'),
            'updated_at' => gmdate('c'),
            'attempts' => 0,
            'payload' => $payload,
        ];

        $filePath = $this->queueDir . DIRECTORY_SEPARATOR . $jobId . '.json';
        file_put_contents($filePath, json_encode($job, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        return $jobId;
    }

    public function getPendingJobs(): array
    {
        $files = glob($this->queueDir . DIRECTORY_SEPARATOR . '*.json') ?: [];
        sort($files, SORT_STRING);

        $jobs = [];
        foreach ($files as $file) {
            $data = json_decode((string) file_get_contents($file), true);
            if (is_array($data)) {
                $jobs[] = ['file' => $file, 'job' => $data];
            }
        }

        return $jobs;
    }

    public function markStatus(string $file, string $status, array $extra = []): void
    {
        if (!is_file($file)) {
            return;
        }

        $data = json_decode((string) file_get_contents($file), true);
        if (!is_array($data)) {
            return;
        }

        $data['status'] = $status;
        $data['updated_at'] = gmdate('c');
        foreach ($extra as $key => $value) {
            $data[$key] = $value;
        }

        file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    }

    public function delete(string $file): void
    {
        if (is_file($file)) {
            @unlink($file);
        }
    }
}
