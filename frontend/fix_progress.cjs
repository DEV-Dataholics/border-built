const fs = require('fs');

let file = 'src/pages/Home.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /label=\{\`\$\{progressPercent\.toFixed\(0\)\}% entradas proyectadas\`\}/g,
  "label={`\\${progressPercent.toFixed(0)}% ${lang === 'es' ? 'ENTRADAS PROYECTADAS' : 'PROJECTED ENTRIES'}`}"
);

fs.writeFileSync(file, content);
