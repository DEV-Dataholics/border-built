<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// Grupo API asignado al namespace 'App\\Controllers\\Api'
$routes->group('api', ['namespace' => 'App\\Controllers\\Api'], static function ($routes) {
    $routes->get('fill_es', function() {
        $db = \Config\Database::connect();
        $db->table('giveaways')->update([
            'hero_headline_es' => 'GANA ESTE AUTO',
            'hero_subtitle_es' => 'Malas decisiones hacen buenas historias',
            'hero_badge_event_es' => 'EVENTO LIMITADO',
            'car_color_es' => 'BLANCO PERLA',
            'spec_title_es' => 'TEMA RÁPIDOS Y FURIOSOS',
            'scarcity_title_es' => 'STOCK LIMITADO',
            'scarcity_subheadline_es' => 'OBTÉN EL TUYO HOY',
            'scarcity_product_title_es' => 'CAJA MISTERIOSA'
        ], ['id' => 2]);
        $db->table('products')->where('slug', 'bronze-package')->update(['name_es' => 'PAQUETE BRONCE', 'description_es' => 'Paquete de 30,000 entradas directas con super multiplicador 500X. Incluye Merch oficial y calcomanías exclusivas.']);
        $db->table('products')->where('slug', 'silver-package')->update(['name_es' => 'PAQUETE PLATA', 'description_es' => 'Paquete de 75,000 entradas directas con super multiplicador 500X. Incluye Merch oficial + gorra tuner + stickers.']);
        $db->table('products')->where('slug', 'gold-package')->update(['name_es' => 'PAQUETE ORO', 'description_es' => 'Paquete máximo de 150,000 entradas directas con super multiplicador 500X. Incluye hoodie oficial + merch pack + acceso VIP.']);
        $db->table('products')->where('slug', 'mystery-box')->update(['name_es' => 'CAJA MISTERIOSA', 'description_es' => 'Caja misteriosa con mercancía exclusiva.']);
        $giveaway = $db->table('giveaways')->where('id', 2)->get()->getRowArray();
        if ($giveaway && !empty($giveaway['breakdown_blocks'])) {
            $blocks = json_decode($giveaway['breakdown_blocks'], true);
            foreach($blocks as &$block) {
                if (stripos($block['title'], 'EXHAUST') !== false) {
                    $block['title_es'] = 'RENDIMIENTO Y ESCAPE';
                    $block['description_es'] = 'EQUIPADO CON UNA TOMA DE AIRE Z1 Y UN ESCAPE COMPLETO CAT-BACK PULIDO REV9 CON TUBO EN Y Y PUNTAS DE 4.5", OFRECIENDO MEJOR FLUJO DE AIRE, UN TONO MÁS PROFUNDO Y UNA PRESENCIA DE RENDIMIENTO MÁS AGRESIVA.';
                } elseif (stripos($block['title'], 'STANCE') !== false || stripos($block['title'], 'WHEELS') !== false) {
                    $block['title_es'] = 'SUSPENSIÓN Y POSTURA';
                    $block['description_es'] = 'EQUIPADO CON SUSPENSIÓN BC RACING COILOVERS COMPLETAMENTE AJUSTABLE Y RINES DE ALEACIÓN FORJADA DE 19 PULGADAS CON LLANTAS DE RENDIMIENTO NITTO INVO. PRESENCIA AGRESIVA PERO CONDUCCIÓN SUAVE.';
                } elseif (stripos($block['title'], 'INTERIOR') !== false || stripos($block['title'], 'RACING') !== false) {
                    $block['title_es'] = 'INTERIOR DE CARRERAS';
                    $block['description_es'] = 'CABINA SIMPLIFICADA CON ASIENTOS DE CUBO SPARCO EVO, ARNESES DE SEGURIDAD DE 5 PUNTOS, JAULA ANTIVUELCO HOMOLOGADA Y VOLANTE DE LIBERACIÓN RÁPIDA NARDI.';
                } elseif (stripos($block['title'], 'BODY') !== false || stripos($block['title'], 'VEILSIDE') !== false || stripos($block['title'], 'AERO') !== false) {
                     $block['title_es'] = 'KIT AERODINÁMICO VEILSIDE';
                     $block['description_es'] = 'KIT DE CARROCERÍA COMPLETO VEILSIDE V3 QUE INCLUYE FASCIAS DELANTERA Y TRASERA, ESTRIBOS LATERALES Y ALERÓN TRASERO, TERMINADO EN UN LLAMATIVO BLANCO PERLA, DÁNDOLE AL Z UNA POSTURA MÁS BAJA, ANCHA Y AGRESIVA MIENTRAS MANTIENE SU CARÁCTER JDM ICÓNICO.';
                }
            }
            $db->table('giveaways')->where('id', 2)->update(['breakdown_blocks' => json_encode($blocks, JSON_UNESCAPED_UNICODE)]);
        }
        return 'Filled';
    });

    $routes->get('migrate_now', function() {
        $migrate = \Config\Services::migrations();
        try {
            $migrate->latest();
            return 'Migrations ran successfully.';
        } catch (\Throwable $e) {
            return 'Migration error: ' . $e->getMessage();
        }
    });

    $routes->get('setup_shop', function() {
        $db = \Config\Database::connect();
        
        // 1. Re-enable checkout
        $cfg = $db->table('configs')->where('key', 'checkout_enabled')->get()->getRowArray();
        if ($cfg) {
            $db->table('configs')->where('key', 'checkout_enabled')->update(['value' => 'true']);
        } else {
            $db->table('configs')->insert(['key' => 'checkout_enabled', 'value' => 'true']);
        }

        // 2. Setup categories config
        $catCfg = $db->table('configs')->where('key', 'product_categories')->get()->getRowArray();
        $defaultCategories = [
            ['key' => 'hoodies', 'name_en' => 'Hoodies', 'name_es' => 'Hoodies'],
            ['key' => 'tshirts', 'name_en' => 'T-Shirts', 'name_es' => 'Playeras'],
            ['key' => 'hats', 'name_en' => 'Hats', 'name_es' => 'Gorras'],
            ['key' => 'accessories', 'name_en' => 'Accessories', 'name_es' => 'Accesorios'],
            ['key' => 'mystery', 'name_en' => 'Mystery Boxes', 'name_es' => 'Cajas Misteriosas'],
            ['key' => 'quick_entries', 'name_en' => 'Quick Entries', 'name_es' => 'Entradas Rápidas'],
        ];
        if (!$catCfg) {
            $db->table('configs')->insert([
                'key' => 'product_categories',
                'value' => json_encode($defaultCategories, JSON_UNESCAPED_UNICODE)
            ]);
        }

        // 3. Move all hats to 'hats' category
        $db->query("UPDATE products SET category = 'hats' WHERE id IN ('prod_002', 'prod_003', 'prod_004', 'prod_e4fdba42') OR name LIKE '%HAT%' OR name LIKE '%Snapback%' OR name LIKE '%Gorra%'");

        return json_encode([
            'status' => 'success',
            'checkout_enabled' => true,
            'hats_updated' => true
        ]);
    });

    $routes->get('setup_winners_instagram', function() {
        $db = \Config\Database::connect();
        $fields = $db->getFieldNames('winners');
        $error = null;
        if (!in_array('instagram', $fields)) {
            try {
                $db->query("ALTER TABLE winners ADD COLUMN instagram VARCHAR(255) NULL");
            } catch (\Throwable $e) {
                $error = $e->getMessage();
            }
        }
        return json_encode([
            'status' => 'success',
            'error' => $error,
            'fields' => $db->getFieldNames('winners')
        ]);
    });

    $routes->get('alter-db', 'ProductController::alterDb');
    $routes->get('products', 'ProductController::index');
    $routes->get('products/(:segment)', 'ProductController::show/$1');
    $routes->get('categories', 'ProductController::categories');
    $routes->options('categories', 'ProductController::options');
    $routes->get('users/(:segment)', 'UserController::show/$1');
    $routes->get('giveaways/active', 'GiveawayController::getActive');
    $routes->get('checkout-status', 'OrderController::checkoutStatus');
    $routes->options('checkout-status', 'OrderController::options');

    // Auth Routes
    $routes->post('auth/register', 'AuthController::register');
    $routes->post('auth/login', 'AuthController::login');
    $routes->post('auth/forgot-password', 'AuthController::forgotPassword');
    $routes->post('auth/reset-password', 'AuthController::resetPassword');
    $routes->options('auth/register', 'AuthController::options');
    $routes->options('auth/login', 'AuthController::options');
    $routes->options('auth/forgot-password', 'AuthController::options');
    $routes->options('auth/reset-password', 'AuthController::options');

    // Serve uploaded files
    $routes->get('uploads/giveaways/(:num)/(:any)', 'UploadController::serveGiveaway/$1/$2');
    $routes->get('uploads/community/(:any)', 'UploadController::serveCommunity/$1');
    $routes->get('uploads/winners/(:any)', 'UploadController::serveWinners/$1');
    $routes->get('uploads/(:any)', 'UploadController::serve/$1');

    $routes->get('winners', 'WinnerController::index');
    $routes->get('community-highlights', 'WinnerController::communityHighlights');
    $routes->options('winners', 'WinnerController::options');
    $routes->options('community-highlights', 'WinnerController::options');

    $routes->post('orders', 'OrderController::create');
    $routes->post('orders/confirm', 'OrderController::confirmStripePayment');
    $routes->get('orders/user/(:segment)', 'OrderController::userOrders/$1');
    $routes->options('orders', 'OrderController::options');
    $routes->options('orders/confirm', 'OrderController::options');
    $routes->options('orders/user/(:segment)', 'OrderController::options');

    $routes->post('coupons/validate', 'CouponController::validateCoupon');
    $routes->options('coupons/validate', 'CouponController::options');
    $routes->post('coupons/claim', 'CouponController::claimCoupon');
    $routes->options('coupons/claim', 'CouponController::options');

    // Stripe Webhooks
    $routes->post('webhook/stripe', 'WebhookController::stripe');
    $routes->options('webhook/stripe', 'WebhookController::options');

    // Admin Routes
    $routes->group('admin', static function ($routes) {
        $routes->get('dashboard', 'AdminController::dashboard');

        $routes->resource('coupons', ['controller' => 'AdminCouponController']);
        $routes->options('coupons', 'AdminCouponController::options');
        $routes->options('coupons/(:segment)', 'AdminCouponController::options');

        $routes->get('products', 'AdminProductController::index');
        $routes->post('products', 'AdminProductController::create');
        $routes->put('products/(:segment)', 'AdminProductController::update/$1');
        $routes->delete('products/(:segment)', 'AdminProductController::delete/$1');
        $routes->options('products', 'AdminProductController::options');
        $routes->options('products/(:segment)', 'AdminProductController::options');

        $routes->get('orders', 'AdminOrderController::index');
        $routes->put('orders/(:segment)', 'AdminOrderController::update/$1');
        $routes->options('orders', 'AdminOrderController::options');
        $routes->options('orders/(:segment)', 'AdminOrderController::options');

        $routes->put('users/(:segment)/vip', 'AdminUserController::toggleVip/$1');
        $routes->options('users/(:segment)/vip', 'AdminUserController::options');
        $routes->resource('users', ['controller' => 'AdminUserController']);
        $routes->options('users', 'AdminUserController::options');
        $routes->options('users/(:segment)', 'AdminUserController::options');

        $routes->get('giveaways/(:segment)/reports', 'AdminGiveawayController::reports/$1');
        $routes->put('giveaways/(:segment)/home-content', 'AdminGiveawayController::updateHomeContent/$1');
        $routes->post('giveaways/(:segment)/upload', 'AdminGiveawayController::uploadImage/$1');
        $routes->resource('giveaways', ['controller' => 'AdminGiveawayController']);
        $routes->options('giveaways', 'AdminGiveawayController::options');
        $routes->options('giveaways/(:segment)', 'AdminGiveawayController::options');
        $routes->options('giveaways/(:segment)/home-content', 'AdminGiveawayController::options');
        $routes->options('giveaways/(:segment)/upload', 'AdminGiveawayController::options');

        $routes->get('reports', 'AdminReportController::index');

        $routes->get('categories', 'AdminProductController::getCategories');
        $routes->put('categories', 'AdminProductController::updateCategories');
        $routes->options('categories', 'AdminProductController::options');

        $routes->post('checkout-status/toggle', 'AdminConfigController::toggleCheckout');
        $routes->options('checkout-status/toggle', 'AdminConfigController::options');

        $routes->get('config', 'AdminConfigController::index');
        $routes->put('config', 'AdminConfigController::updateConfigs');
        $routes->options('config', 'AdminConfigController::options');

        $routes->resource('polls', ['controller' => 'AdminPollController']);
        $routes->options('polls', 'AdminPollController::options');
        $routes->options('polls/(:segment)', 'AdminPollController::options');

        $routes->post('winners/upload', 'AdminWinnerController::uploadImage');
        $routes->options('winners/upload', 'AdminWinnerController::options');
        $routes->resource('winners', ['controller' => 'AdminWinnerController']);
        $routes->options('winners', 'AdminWinnerController::options');
        $routes->options('winners/(:segment)', 'AdminWinnerController::options');

        $routes->post('community-highlights/upload', 'AdminCommunityHighlightController::uploadImage');
        $routes->options('community-highlights/upload', 'AdminCommunityHighlightController::options');
        $routes->resource('community-highlights', ['controller' => 'AdminCommunityHighlightController']);
        $routes->options('community-highlights', 'AdminCommunityHighlightController::options');
        $routes->options('community-highlights/(:segment)', 'AdminCommunityHighlightController::options');

        // Audit Logging
        $routes->group('logs', ['filter' => 'adminAuth'], function($routes) {
            $routes->get('stream', 'AdminAuditLogController::stream');
            $routes->get('export', 'AdminAuditLogController::export');
            $routes->get('', 'AdminAuditLogController::index');
        });
    });

    // VIP Lounge & Polls
    $routes->group('vip', static function ($routes) {
        $routes->get('polls', 'VipPollController::index');
        $routes->post('polls/(:segment)/vote', 'VipPollController::vote/$1');
        $routes->options('polls', 'VipPollController::options');
        $routes->options('polls/(:segment)/vote', 'VipPollController::options');
    });
});
