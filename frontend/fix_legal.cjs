const fs = require('fs');

let file = 'src/pages/Home.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "No Purchase Necessary. Void Where Prohibited.",
  "{lang === 'es' ? 'NO REQUIERE COMPRA. NULO DONDE ESTÉ PROHIBIDO.' : 'NO PURCHASE NECESSARY. VOID WHERE PROHIBITED.'}"
);

content = content.replace(
  "Official Rules ?\" No Purchase Necessary", // Depending on encoding
  "{lang === 'es' ? 'Reglas Oficiales - No Requiere Compra' : 'Official Rules - No Purchase Necessary'}"
);
content = content.replace(
  "Official Rules \u2013 No Purchase Necessary", 
  "{lang === 'es' ? 'Reglas Oficiales - No Requiere Compra' : 'Official Rules - No Purchase Necessary'}"
);
content = content.replace(
  "Official Rules ?\" No Purchase Necessary", 
  "{lang === 'es' ? 'Reglas Oficiales - No Requiere Compra' : 'Official Rules - No Purchase Necessary'}"
);
content = content.replace(
  /Official Rules [^N]*No Purchase Necessary/g, 
  "{lang === 'es' ? 'Reglas Oficiales - No Requiere Compra' : 'Official Rules - No Purchase Necessary'}"
);

fs.writeFileSync(file, content);
