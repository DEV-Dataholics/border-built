const fs = require('fs');

let file = 'app/Controllers/Api/AdminWinnerController.php';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /'car'\s*=>\s*\$data\['car'\],/g,
  "'car'           => \$data['car'],\n            'car_es'        => \$data['carEs'] ?? null,"
);
content = content.replace(
  /'location'\s*=>\s*\$data\['location'\] \?\? '',/g,
  "'location'      => \$data['location'] ?? '',\n            'location_es'   => \$data['locationEs'] ?? null,"
);
content = content.replace(
  /'badge_text'\s*=>\s*\$data\['badgeText'\] \?\? \(\$data\['badge_text'\] \?\? 'Grand Prize Winner'\),/g,
  "'badge_text'    => \$data['badgeText'] ?? (\$data['badge_text'] ?? 'Grand Prize Winner'),\n            'badge_es'      => \$data['badgeEs'] ?? null,"
);

// For updateData
content = content.replace(
  "if (isset($data['car'])) $updateData['car'] = $data['car'];",
  "if (isset(\$data['car'])) \$updateData['car'] = \$data['car'];\n        if (isset(\$data['carEs'])) \$updateData['car_es'] = \$data['carEs'];"
);
content = content.replace(
  "if (isset($data['location'])) $updateData['location'] = $data['location'];",
  "if (isset(\$data['location'])) \$updateData['location'] = \$data['location'];\n        if (isset(\$data['locationEs'])) \$updateData['location_es'] = \$data['locationEs'];"
);
content = content.replace(
  "if (isset($data['badgeText'])) $updateData['badge_text'] = $data['badgeText'];",
  "if (isset(\$data['badgeText'])) \$updateData['badge_text'] = \$data['badgeText'];\n        if (isset(\$data['badgeEs'])) \$updateData['badge_es'] = \$data['badgeEs'];"
);

fs.writeFileSync(file, content);

let file2 = 'app/Controllers/Api/AdminCommunityHighlightController.php';
let content2 = fs.readFileSync(file2, 'utf8');

content2 = content2.replace(
  /'title'\s*=>\s*\$data\['title'\],/g,
  "'title'         => \$data['title'],\n            'title_es'      => \$data['titleEs'] ?? null,"
);
content2 = content2.replace(
  /'location'\s*=>\s*\$data\['location'\],/g,
  "'location'      => \$data['location'],\n            'location_es'   => \$data['locationEs'] ?? null,"
);

content2 = content2.replace(
  "if (isset($data['title'])) $updateData['title'] = $data['title'];",
  "if (isset(\$data['title'])) \$updateData['title'] = \$data['title'];\n        if (isset(\$data['titleEs'])) \$updateData['title_es'] = \$data['titleEs'];"
);
content2 = content2.replace(
  "if (isset($data['location'])) $updateData['location'] = $data['location'];",
  "if (isset(\$data['location'])) \$updateData['location'] = \$data['location'];\n        if (isset(\$data['locationEs'])) \$updateData['location_es'] = \$data['locationEs'];"
);

fs.writeFileSync(file2, content2);
