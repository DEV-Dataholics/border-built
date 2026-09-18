const fs = require('fs');
let file = 'src/pages/Home.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "const scarcityTitle = getLocal('scarcity_title') || 'Stock Limitado';",
  "const scarcityTitle = getLocal('scarcity_title') || (lang === 'es' ? 'STOCK LIMITADO' : 'LIMITED STOCK');"
);
content = content.replace(
  "const scarcityHeadline = getLocal('scarcity_headline') || 'Mystery Boxes';",
  "const scarcityHeadline = getLocal('scarcity_headline') || (lang === 'es' ? 'CAJAS MISTERIOSAS' : 'MYSTERY BOXES');"
);
content = content.replace(
  "const scarcitySubheadline = getLocal('scarcity_subheadline') || 'Casi Agotadas';",
  "const scarcitySubheadline = getLocal('scarcity_subheadline') || (lang === 'es' ? 'OBTÉN EL TUYO HOY' : 'GET YOURS TODAY');"
);
content = content.replace(
  "const scarcityProductTitle = getLocal('scarcity_product_title') || 'Compra Misteriosa';",
  "const scarcityProductTitle = getLocal('scarcity_product_title') || (lang === 'es' ? 'CAJA MISTERIOSA' : 'MYSTERY BOX');"
);
content = content.replace(
  "const scarcityProductDesc = getLocal('scarcity_product_desc') || 'Incluye 500 entradas + Merch exclusiva';",
  "const scarcityProductDesc = getLocal('scarcity_product_desc') || (lang === 'es' ? 'EXCLUSIVA MERCH + 500 ENTRADAS' : 'EXCLUSIVE MERCH + 500 ENTRIES');"
);

fs.writeFileSync(file, content);
