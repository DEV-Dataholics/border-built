<?php
$pdo = new PDO('mysql:host=localhost;dbname=border_built_db', 'root', '');
$stmt = $pdo->query('SELECT id, status, stripe_payment_intent_id FROM orders ORDER BY created_at DESC LIMIT 5');
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
