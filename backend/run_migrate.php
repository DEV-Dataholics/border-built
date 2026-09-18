<?php
// One-time migration runner — DELETE THIS FILE AFTER RUNNING
require __DIR__ . '/../app/Config/Paths.php';
$paths = new Config\Paths();
require $paths->systemDirectory . '/bootstrap.php';

$migrate = \Config\Services::migrations();
try {
    $migrate->latest();
    echo json_encode(['success' => true, 'message' => 'Migrations ran successfully.']);
} catch (\Throwable $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
