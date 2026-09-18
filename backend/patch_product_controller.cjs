const fs = require('fs');
let file = 'app/Controllers/Api/AdminProductController.php';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /'name'\s*=>\s*\$data\['name'\],/g,
  "'name'             => \$data['name'],\n            'name_es'          => \$data['nameEs'] ?? null,"
);

content = content.replace(
  /'description'\s*=>\s*\$data\['description'\],/g,
  "'description'      => \$data['description'],\n            'description_es'   => \$data['descriptionEs'] ?? null,"
);

fs.writeFileSync(file, content);
