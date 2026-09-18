const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.jsx', 'utf8');

content = content.replace(
  "{scarcityPercentSold}% VENDIDO",
  "{scarcityPercentSold}% {lang === 'es' ? 'VENDIDO' : 'SOLD'}"
);

fs.writeFileSync('src/pages/Home.jsx', content);
