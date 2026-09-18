<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;
use App\Models\UserModel;
use App\Models\ProductModel;
use App\Models\ProductVariantModel;

class InitialDataSeeder extends Seeder
{
    public function run()
    {
        $userModel = new UserModel();
        $productModel = new ProductModel();
        $variantModel = new ProductVariantModel();

        // Limpiar tablas para evitar duplicados
        $this->db->table('product_variants')->emptyTable();
        $this->db->table('products')->emptyTable();

        // 1. Usuarios
        $userModel->ignore(true)->insertBatch([
            [
                'id'          => 'usr_admin',
                'email'       => 'admin@borderbuilt.com',
                'name'        => 'Admin BB',
                'role'        => 'admin',
                'password'    => password_hash('admin123', PASSWORD_DEFAULT),
                'entries'     => 0,
                'total_spent' => 0.00,
                'location'    => null,
            ]
        ]);

        // 2. Productos Originales del Mock
        $productModel->insertBatch([
            [
                'id'               => 'prod_001',
                'name'             => 'BORDERBUILT Hoodie',
                'slug'             => 'border-spec-hoodie',
                'category'         => 'hoodies',
                'description'      => 'Premium heavyweight hoodie with neon BORDERBUILT logo. Represents the binational car culture of Juárez-El Paso.',
                'price'            => 65,
                'compare_at_price' => 78,
                'images'           => json_encode(["/images/products/hoodie-black-neon.png"]),
                'tags'             => json_encode(["BEST SELLER"]),
                'entry_multiplier' => null,
                'featured'         => 1,
            ],
            [
                'id'               => 'prod_002',
                'name'             => 'R34 Legacy Tee',
                'slug'             => 'r34-legacy-tee',
                'category'         => 'tshirts',
                'description'      => 'Heavy cotton tee featuring the legendary Skyline R34 silhouette. JDM heritage meets border culture.',
                'price'            => 35,
                'compare_at_price' => 42,
                'images'           => json_encode(["/images/products/r34-legacy-tee.png"]),
                'tags'             => json_encode(["NEW DROP"]),
                'entry_multiplier' => null,
                'featured'         => 1,
            ],
            [
                'id'               => 'prod_003',
                'name'             => 'Drift Keytag',
                'slug'             => 'drift-keytag',
                'category'         => 'accessories',
                'description'      => 'Flight crew style embroidered keytag. \'Remove Before Flight\' meets \'Remove Before Drift\'.',
                'price'            => 15,
                'compare_at_price' => 18,
                'images'           => json_encode(["/images/products/accessories-group.png"]),
                'tags'             => json_encode([]),
                'entry_multiplier' => null,
                'featured'         => 0,
            ],
            [
                'id'               => 'prod_004',
                'name'             => 'Tuner Cap',
                'slug'             => 'tuner-cap',
                'category'         => 'accessories',
                'description'      => 'Snapback cap with flat brim. Embroidered BORDERBUILT logo with neon green stitching.',
                'price'            => 30,
                'compare_at_price' => 36,
                'images'           => json_encode(["/images/products/tuner-cap.png"]),
                'tags'             => json_encode([]),
                'entry_multiplier' => null,
                'featured'         => 0,
            ],
            [
                'id'               => 'prod_005',
                'name'             => 'Decal Pack V1',
                'slug'             => 'decal-pack-v1',
                'category'         => 'accessories',
                'description'      => 'Holographic vinyl decal pack. Includes BORDERBUILT logo, JZ-EPTX badge, and speed marks.',
                'price'            => 12,
                'compare_at_price' => 15,
                'images'           => json_encode(["/images/products/accessories-group.png"]),
                'tags'             => json_encode([]),
                'entry_multiplier' => null,
                'featured'         => 0,
            ],
            [
                'id'               => 'prod_006',
                'name'             => 'Mystery Box',
                'slug'             => 'mystery-box',
                'category'         => 'mystery',
                'description'      => 'Limited edition mystery box. Contains 3-5 exclusive items not available in the store. High entry multiplier.',
                'price'            => 100,
                'compare_at_price' => 150,
                'images'           => json_encode(["/images/products/mystery-box.png"]),
                'tags'             => json_encode(["HIGH VALUE"]),
                'entry_multiplier' => 15,
                'featured'         => 1,
            ],
            [
                'id'               => 'prod_007',
                'name'             => 'JZ-EPTX Racing Jacket',
                'slug'             => 'jz-eptx-racing-jacket',
                'category'         => 'hoodies',
                'description'      => 'Lightweight racing-style jacket with reflective BORDERBUILT patches. Built for car meets and night drives.',
                'price'            => 95,
                'compare_at_price' => 120,
                'images'           => json_encode(["/images/products/racing-jacket.png"]),
                'tags'             => json_encode(["NEW DROP"]),
                'entry_multiplier' => null,
                'featured'         => 1,
            ],
            [
                'id'               => 'prod_008',
                'name'             => 'Boost Gauge Tee',
                'slug'             => 'boost-gauge-tee',
                'category'         => 'tshirts',
                'description'      => 'Graphic tee with oversized boost gauge print. \'Running 22 PSI on the border.\'',
                'price'            => 35,
                'compare_at_price' => 42,
                'images'           => json_encode(["/images/products/r34-legacy-tee.png"]),
                'tags'             => json_encode([]),
                'entry_multiplier' => null,
                'featured'         => 0,
            ],
            [
                'id'               => 'prod_009',
                'name'             => 'Carbon Fiber Phone Case',
                'slug'             => 'carbon-fiber-phone-case',
                'category'         => 'accessories',
                'description'      => 'Real carbon fiber weave phone case with BORDERBUILT logo. Available for iPhone and Samsung.',
                'price'            => 45,
                'compare_at_price' => 55,
                'images'           => json_encode(["/images/products/accessories-group.png"]),
                'tags'             => json_encode([]),
                'entry_multiplier' => null,
                'featured'         => 0,
            ],
            [
                'id'               => 'prod_010',
                'name'             => 'Sin Fronteras Joggers',
                'slug'             => 'sin-fronteras-joggers',
                'category'         => 'hoodies',
                'description'      => 'Technical joggers with tapered fit. \'Sin Fronteras para la Velocidad\' embroidered on the thigh.',
                'price'            => 55,
                'compare_at_price' => 68,
                'images'           => json_encode(["/images/products/sin-fronteras-joggers.png"]),
                'tags'             => json_encode(["BEST SELLER"]),
                'entry_multiplier' => null,
                'featured'         => 1,
            ],
            [
                'id'               => 'prod_011',
                'name'             => 'Turbo Timer Beanie',
                'slug'             => 'turbo-timer-beanie',
                'category'         => 'accessories',
                'description'      => 'Knit beanie with embroidered turbo timer icon. Perfect for cold desert nights at the car meet.',
                'price'            => 25,
                'compare_at_price' => 30,
                'images'           => json_encode(["/images/products/turbo-beanie.png"]),
                'tags'             => json_encode([]),
                'entry_multiplier' => null,
                'featured'         => 0,
            ],
            [
                'id'               => 'prod_012',
                'name'             => 'Spec Sheet Poster',
                'slug'             => 'spec-sheet-poster',
                'category'         => 'accessories',
                'description'      => '24x36 matte poster with R34 technical spec sheet blueprint. Museum quality print.',
                'price'            => 28,
                'compare_at_price' => 35,
                'images'           => json_encode(["/images/products/spec-poster.png"]),
                'tags'             => json_encode([]),
                'entry_multiplier' => null,
                'featured'         => 0,
            ],
        ]);

        // 3. Variantes Originales
        $variantModel->insertBatch([
            ['product_id' => 'prod_001', 'size' => 'S', 'color' => 'Black/Neon', 'stock' => 50],
            ['product_id' => 'prod_001', 'size' => 'M', 'color' => 'Black/Neon', 'stock' => 80],
            ['product_id' => 'prod_001', 'size' => 'L', 'color' => 'Black/Neon', 'stock' => 60],
            ['product_id' => 'prod_001', 'size' => 'XL', 'color' => 'Black/Neon', 'stock' => 40],
            ['product_id' => 'prod_001', 'size' => 'XXL', 'color' => 'Black/Neon', 'stock' => 20],
            ['product_id' => 'prod_002', 'size' => 'S', 'color' => 'Black', 'stock' => 100],
            ['product_id' => 'prod_002', 'size' => 'M', 'color' => 'Black', 'stock' => 120],
            ['product_id' => 'prod_002', 'size' => 'L', 'color' => 'Black', 'stock' => 90],
            ['product_id' => 'prod_002', 'size' => 'XL', 'color' => 'Black', 'stock' => 60],
            ['product_id' => 'prod_002', 'size' => 'S', 'color' => 'Charcoal', 'stock' => 40],
            ['product_id' => 'prod_002', 'size' => 'M', 'color' => 'Charcoal', 'stock' => 50],
            ['product_id' => 'prod_002', 'size' => 'L', 'color' => 'Charcoal', 'stock' => 45],
            ['product_id' => 'prod_003', 'size' => 'ONE SIZE', 'color' => 'Neon Green', 'stock' => 200],
            ['product_id' => 'prod_003', 'size' => 'ONE SIZE', 'color' => 'Red', 'stock' => 150],
            ['product_id' => 'prod_004', 'size' => 'ONE SIZE', 'color' => 'Black', 'stock' => 80],
            ['product_id' => 'prod_004', 'size' => 'ONE SIZE', 'color' => 'Carbon Grey', 'stock' => 60],
            ['product_id' => 'prod_005', 'size' => '6 inch', 'color' => 'Holographic', 'stock' => 300],
            ['product_id' => 'prod_005', 'size' => '10 inch', 'color' => 'Holographic', 'stock' => 200],
            ['product_id' => 'prod_006', 'size' => 'Standard', 'color' => 'Surprise', 'stock' => 50],
            ['product_id' => 'prod_007', 'size' => 'S', 'color' => 'Black/Green', 'stock' => 30],
            ['product_id' => 'prod_007', 'size' => 'M', 'color' => 'Black/Green', 'stock' => 45],
            ['product_id' => 'prod_007', 'size' => 'L', 'color' => 'Black/Green', 'stock' => 35],
            ['product_id' => 'prod_007', 'size' => 'XL', 'color' => 'Black/Green', 'stock' => 25],
            ['product_id' => 'prod_008', 'size' => 'S', 'color' => 'Black', 'stock' => 70],
            ['product_id' => 'prod_008', 'size' => 'M', 'color' => 'Black', 'stock' => 90],
            ['product_id' => 'prod_008', 'size' => 'L', 'color' => 'Black', 'stock' => 75],
            ['product_id' => 'prod_008', 'size' => 'XL', 'color' => 'Black', 'stock' => 50],
            ['product_id' => 'prod_009', 'size' => 'iPhone 15', 'color' => 'Carbon', 'stock' => 60],
            ['product_id' => 'prod_009', 'size' => 'iPhone 15 Pro', 'color' => 'Carbon', 'stock' => 70],
            ['product_id' => 'prod_009', 'size' => 'Samsung S24', 'color' => 'Carbon', 'stock' => 40],
            ['product_id' => 'prod_010', 'size' => 'S', 'color' => 'Black', 'stock' => 40],
            ['product_id' => 'prod_010', 'size' => 'M', 'color' => 'Black', 'stock' => 55],
            ['product_id' => 'prod_010', 'size' => 'L', 'color' => 'Black', 'stock' => 50],
            ['product_id' => 'prod_010', 'size' => 'XL', 'color' => 'Black', 'stock' => 30],
            ['product_id' => 'prod_011', 'size' => 'ONE SIZE', 'color' => 'Black', 'stock' => 100],
            ['product_id' => 'prod_011', 'size' => 'ONE SIZE', 'color' => 'Dark Green', 'stock' => 80],
            ['product_id' => 'prod_012', 'size' => '24x36', 'color' => 'Black/Neon', 'stock' => 150],
        ]);

        // 4. Giveaway Activo
        $giveawayModel = new \App\Models\GiveawayModel();
        $this->db->table('giveaways')->emptyTable();
        $giveawayModel->insert([
            'name' => 'Nissan Skyline R34 GTR Giveaway',
            'start_date' => date('Y-m-d H:i:s'),
            'end_date' => date('Y-m-d H:i:s', strtotime('+30 days')),
            'active_multiplier' => 10,
            'prize_cost' => 50000,
            'ticket_promedio' => 1000,
            'average_margin' => 0.25,
            'is_active' => 1,
            // Home CMS: Hero
            'hero_image' => '/images/nissan-350z-tokyo-garage.png',
            'hero_subtitle' => 'Bad Choices make good stories',
            'hero_headline' => 'GANA ESTE AUTO',
            'hero_badge_event' => 'EVENTO LIMITADO',
            'hero_badge_reqid' => '#FF-R34',
            // Home CMS: Car / Specs
            'car_make' => 'Nissan',
            'car_model' => 'Skyline R34 GTR',
            'car_engine' => 'RB26DETT Twin-Turbo',
            'car_horsepower' => '550 WHP',
            'car_color' => 'Bayside Blue',
            // Home CMS: Spec Sheet
            'spec_title' => 'FICHA TÉCNICA DEL PROYECTO',
            'spec_subtitle' => 'SPEC SHEET // R34 GTR // EDITION V.26',
            // Home CMS: Breakdown Blocks
            'breakdown_blocks' => json_encode([
                ['title' => 'Motor RB26DETT Twin-Turbo', 'description' => 'El legendario motor de 2.6L con doble turbo. Ajustado a precisión para entregar 550 caballos directos a las cuatro ruedas mediante el sistema ATTESA E-TS.', 'image_url' => '/images/gtr-engine.jpg'],
                ['title' => 'Interior Racing', 'description' => 'Cabina simplificada y funcional. Asientos Bride con arneses Takata de 4 puntos, jaula antivuelco Cusco homologada y volante Nardi de liberación rápida.', 'image_url' => '/images/gtr-interior.jpg'],
                ['title' => 'Rines & Frenos', 'description' => 'Rines Work Equip clásicos en bronce y garganta profunda, montados en neumáticos semi-slick Nitto, con frenos Brembo sobredimensionados de 6 pistones.', 'image_url' => '/images/gtr-wheels.jpg'],
            ]),
            // Home CMS: Scarcity Banner
            'scarcity_title' => 'Stock Limitado',
            'scarcity_headline' => 'Mystery Boxes',
            'scarcity_subheadline' => 'Casi Agotadas',
            'scarcity_product_title' => 'Compra Misteriosa',
            'scarcity_product_desc' => 'Incluye 500 entradas + Merch exclusiva',
            'scarcity_percent_sold' => 85,
        ]);

        // 5. Configuración del Multiplicador
        $configModel = new \App\Models\ConfigModel();
        $this->db->table('configs')->emptyTable();
        $configModel->insertBatch([
            ['key' => 'global_multiplier', 'value' => '10'],
            ['key' => 'fomo_banner_enabled', 'value' => 'true'],
            ['key' => 'fomo_deadline', 'value' => date('Y-m-d H:i:s', strtotime('+3 days'))],
        ]);

        // 6. Ganadores Iniciales
        $this->db->table('winners')->emptyTable();
        $this->db->table('winners')->insertBatch([
            [
                'id'            => 'win_001',
                'user_id'       => 'usr_carlos',
                'giveaway_id'   => 'gw_2023_mustang',
                'name'          => 'Carlos M.',
                'location'      => 'El Paso, TX',
                'country'       => 'US',
                'flag'          => '🇺🇸',
                'car'           => 'Mustang GT 5.0',
                'car_image'     => '/images/winners/winner-mustang.png',
                'badge_text'    => 'Grand Prize Winner',
                'total_entries' => 8750,
                'won_at'        => '2024-01-05 20:00:00',
                'created_at'    => date('Y-m-d H:i:s'),
            ],
            [
                'id'            => 'win_002',
                'user_id'       => 'usr_ana',
                'giveaway_id'   => 'gw_2023_supra',
                'name'          => 'Ana R.',
                'location'      => 'Cd. Juárez',
                'country'       => 'MX',
                'flag'          => '🇲🇽',
                'car'           => 'Toyota Supra MK5',
                'car_image'     => '/images/winners/winner-supra.png',
                'badge_text'    => 'Previous Winner',
                'total_entries' => 9200,
                'won_at'        => '2023-07-05 18:00:00',
                'created_at'    => date('Y-m-d H:i:s'),
            ],
            [
                'id'            => 'win_003',
                'user_id'       => 'usr_luis',
                'giveaway_id'   => 'gw_2023_mustang',
                'name'          => 'Luis G.',
                'location'      => 'El Paso, TX',
                'country'       => 'US',
                'flag'          => '🇺🇸',
                'car'           => 'Nissan GTR',
                'car_image'     => '/images/winners/winner-gtr.png',
                'badge_text'    => 'Previous Winner',
                'total_entries' => 6500,
                'won_at'        => '2023-03-15 19:00:00',
                'created_at'    => date('Y-m-d H:i:s'),
            ],
        ]);

        // 7. Fotos Destacadas de la Comunidad
        $this->db->table('community_highlights')->emptyTable();
        $this->db->table('community_highlights')->insertBatch([
            [
                'id'         => 'comm_001',
                'title'      => 'Reunión Fronteriza',
                'location'   => 'Cd. Juárez',
                'emoji'      => '🇲🇽',
                'image'      => '/images/winners/event-reunion.png',
                'link_url'   => 'https://instagram.com',
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id'         => 'comm_002',
                'title'      => 'Progreso del Build',
                'location'   => 'El Paso, TX',
                'emoji'      => '🇺🇸',
                'image'      => '/images/winners/event-build.png',
                'link_url'   => 'https://instagram.com',
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id'         => 'comm_003',
                'title'      => 'Noche de Drift',
                'location'   => 'El Paso, TX',
                'emoji'      => '🇺🇸',
                'image'      => '/images/winners/event-drift.png',
                'link_url'   => 'https://instagram.com',
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id'         => 'comm_004',
                'title'      => 'Cars & Coffee',
                'location'   => 'Cd. Juárez',
                'emoji'      => '🇲🇽',
                'image'      => '/images/winners/event-coffee.png',
                'link_url'   => 'https://instagram.com',
                'created_at' => date('Y-m-d H:i:s'),
            ],
        ]);
    }
}
