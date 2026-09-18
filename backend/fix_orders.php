<?php
require __DIR__ . '/../app/Config/Paths.php';
$paths = new Config\Paths();
require $paths->systemDirectory . '/bootstrap.php';

// Send email for the first order that failed to send earlier
\App\Libraries\EmailHelper::sendOrderReceipt('ord_6a8359f3c802d');
\App\Libraries\EmailHelper::sendOrderReceipt('ord_6a835ab8316c8');
echo json_encode(['success' => true]);
