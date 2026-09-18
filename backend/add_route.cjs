const fs = require('fs');
let file = 'app/Config/Routes.php';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "    $routes->get('migrate_now', function() {",
  "    $routes->get('fill_es', function() {\n        $db = \\Config\\Database::connect();\n        $db->table('giveaways')->update([\n            'hero_headline_es' => 'GANA ESTE AUTO',\n            'hero_subtitle_es' => 'Malas decisiones hacen buenas historias',\n            'hero_badge_event_es' => 'EVENTO LIMITADO',\n            'car_color_es' => 'BLANCO PERLA',\n            'spec_title_es' => 'TEMA RÁPIDOS Y FURIOSOS',\n            'scarcity_title_es' => 'STOCK LIMITADO',\n            'scarcity_subheadline_es' => 'OBTÉN EL TUYO HOY',\n            'scarcity_product_title_es' => 'CAJA MISTERIOSA'\n        ], ['id' => 2]);\n        return 'Filled';\n    });\n\n    $routes->get('migrate_now', function() {"
);

fs.writeFileSync(file, content);
