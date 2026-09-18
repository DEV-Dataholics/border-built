const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.jsx', 'utf8');

content = content.replace(
  "style={{ backgroundImage: `url('${img}')` }}",
  "style={{ backgroundImage: `url('${img || '/images/products/placeholder.webp'}')` }}"
);

fs.writeFileSync('src/pages/Home.jsx', content);
