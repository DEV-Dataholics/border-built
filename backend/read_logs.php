<?php
$logDir = __DIR__ . '/writable/logs/';
$files = glob($logDir . '*.log');
if (empty($files)) { echo 'No logs'; exit; }
rsort($files);
$content = file_get_contents($files[0]);
echo substr($content, -2000);
