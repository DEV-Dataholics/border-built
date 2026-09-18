<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

class ResetCoupons extends BaseCommand
{
    protected $group       = 'Database';
    protected $name        = 'db:reset-coupons';
    protected $description = 'Resets coupons tables and re-runs migration on default and tests DBs';

    public function run(array $params)
    {
        $group = $params[0] ?? 'default';
        $db = \Config\Database::connect($group);

        $db->query('DROP TABLE IF EXISTS coupon_usages');
        $db->query('DROP TABLE IF EXISTS coupons');

        $sqlCoupons = "CREATE TABLE IF NOT EXISTS `coupons` (
            `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `code` VARCHAR(50) NOT NULL UNIQUE,
            `reward_type` ENUM('discount', 'entries') NOT NULL DEFAULT 'discount',
            `discount_type` ENUM('percentage', 'fixed') NULL DEFAULT 'percentage',
            `value` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            `entries_count` INT(11) UNSIGNED NOT NULL DEFAULT 0,
            `min_purchase` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            `max_discount` DECIMAL(10,2) NULL,
            `usage_limit` INT(11) NULL DEFAULT 1,
            `usage_count` INT(11) NOT NULL DEFAULT 0,
            `campaign_name` VARCHAR(100) NULL,
            `start_date` DATETIME NULL,
            `expires_at` DATETIME NULL,
            `is_active` TINYINT(1) NOT NULL DEFAULT 1,
            `created_at` DATETIME NULL,
            `updated_at` DATETIME NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

        $sqlUsages = "CREATE TABLE IF NOT EXISTS `coupon_usages` (
            `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `coupon_id` INT(11) UNSIGNED NOT NULL,
            `order_id` VARCHAR(50) NULL,
            `user_id` VARCHAR(50) NOT NULL,
            `discount_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            `entries_awarded` INT(11) NOT NULL DEFAULT 0,
            `created_at` DATETIME NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

        $sqlUsers = "CREATE TABLE IF NOT EXISTS `users` (
            `id` VARCHAR(50) PRIMARY KEY,
            `email` VARCHAR(100) NOT NULL,
            `name` VARCHAR(100) NOT NULL,
            `role` VARCHAR(20) DEFAULT 'user',
            `password` VARCHAR(255) NOT NULL,
            `entries` INT(11) DEFAULT 0,
            `total_spent` DECIMAL(10,2) DEFAULT 0.00,
            `created_at` DATETIME NULL,
            `updated_at` DATETIME NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

        $db->query($sqlUsers);
        $db->query($sqlCoupons);
        $db->query($sqlUsages);

        CLI::write("Tabla de cupones recreada exitosamente en grupo '{$group}'.", 'green');
    }
}
