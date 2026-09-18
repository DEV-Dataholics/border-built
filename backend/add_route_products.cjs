const fs = require('fs');
let file = 'app/Config/Routes.php';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "        return 'Filled';",
  "        $db->table('products')->where('slug', 'bronze-package')->update(['name_es' => 'PAQUETE BRONCE', 'description_es' => 'Paquete de 30,000 entradas directas con super multiplicador 500X. Incluye Merch oficial y calcomanías exclusivas.']);\n        $db->table('products')->where('slug', 'silver-package')->update(['name_es' => 'PAQUETE PLATA', 'description_es' => 'Paquete de 75,000 entradas directas con super multiplicador 500X. Incluye Merch oficial + gorra tuner + stickers.']);\n        $db->table('products')->where('slug', 'gold-package')->update(['name_es' => 'PAQUETE ORO', 'description_es' => 'Paquete máximo de 150,000 entradas directas con super multiplicador 500X. Incluye hoodie oficial + merch pack + acceso VIP.']);\n        return 'Filled';"
);

fs.writeFileSync(file, content);
