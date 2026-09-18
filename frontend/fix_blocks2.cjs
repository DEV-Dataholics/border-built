const fs = require('fs');

let file = 'src/pages/Home.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "    const breakdownBlocks = (activeGiveaway?.breakdown_blocks && activeGiveaway.breakdown_blocks.length > 0)\n      ? activeGiveaway.breakdown_blocks\n      : defaultBreakdownBlocks;",
  "    const breakdownBlocks = (activeGiveaway?.breakdown_blocks && activeGiveaway.breakdown_blocks.length > 0)\n      ? activeGiveaway.breakdown_blocks.map(b => ({\n          ...b,\n          title: (lang === 'es' && b.title_es) ? b.title_es : b.title,\n          description: (lang === 'es' && b.description_es) ? b.description_es : b.description\n        }))\n      : defaultBreakdownBlocks;"
);

content = content.replace(
  ">QUICK ENTRIES<",
  ">{lang === 'es' ? 'ENTRADAS RÁPIDAS' : 'QUICK ENTRIES'}<"
);
content = content.replace(
  "PARA QUIENES BUSCAN LA MÁXIMA CANTIDAD DE ENTRADAS DIRECTAMENTE.",
  "{lang === 'es' ? 'PARA QUIENES BUSCAN LA MÁXIMA CANTIDAD DE ENTRADAS DIRECTAMENTE.' : 'FOR THOSE LOOKING FOR THE MAXIMUM AMOUNT OF ENTRIES DIRECTLY.'}"
);

fs.writeFileSync(file, content);
