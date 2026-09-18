const fs = require('fs');

let file = 'src/pages/Home.jsx';
let content = fs.readFileSync(file, 'utf8');

// For breakdown blocks, we need to map over them and use title_es and description_es if available
content = content.replace(
  "const breakdownBlocks = (activeGiveaway?.breakdown_blocks && activeGiveaway.breakdown_blocks.length > 0)",
  "const breakdownBlocks = (activeGiveaway?.breakdown_blocks && activeGiveaway.breakdown_blocks.length > 0)\n      ? activeGiveaway.breakdown_blocks.map(b => ({\n          ...b,\n          title: (lang === 'es' && b.title_es) ? b.title_es : b.title,\n          description: (lang === 'es' && b.description_es) ? b.description_es : b.description\n        }))"
);

// Quick entries title translation
content = content.replace(
  ">QUICK ENTRIES<",
  ">{lang === 'es' ? 'ENTRADAS RÁPIDAS' : 'QUICK ENTRIES'}<"
);
content = content.replace(
  "PARA QUIENES BUSCAN LA MÁXIMA CANTIDAD DE ENTRADAS DIRECTAMENTE.",
  "{lang === 'es' ? 'PARA QUIENES BUSCAN LA MÁXIMA CANTIDAD DE ENTRADAS DIRECTAMENTE.' : 'FOR THOSE LOOKING FOR THE MAXIMUM AMOUNT OF ENTRIES DIRECTLY.'}"
);

fs.writeFileSync(file, content);

let adminFile = 'src/pages/admin/AdminGiveaways.jsx';
let adminContent = fs.readFileSync(adminFile, 'utf8');

// The breakdown blocks editor needs _es fields
adminContent = adminContent.replace(
  /<input\s*type="text"\s*value=\{block\.title\}\s*onChange=\{\(e\) => handleBlockChange\(index, 'title', e\.target\.value\)\}/g,
  '<input type="text" value={block.title} onChange={(e) => handleBlockChange(index, \'title\', e.target.value)} />\n                      <input type="text" placeholder="[ES] Título" className="w-full bg-[#111111] border border-primary/50 rounded-lg p-2 mt-1 text-sm text-white" value={block.title_es || \'\'} onChange={(e) => handleBlockChange(index, \'title_es\', e.target.value)}'
);

adminContent = adminContent.replace(
  /<textarea\s*value=\{block\.description\}\s*onChange=\{\(e\) => handleBlockChange\(index, 'description', e\.target\.value\)\}/g,
  '<textarea value={block.description} onChange={(e) => handleBlockChange(index, \'description\', e.target.value)} />\n                      <textarea placeholder="[ES] Descripción" className="w-full bg-[#111111] border border-primary/50 rounded-lg p-2 mt-1 text-sm text-white h-20" value={block.description_es || \'\'} onChange={(e) => handleBlockChange(index, \'description_es\', e.target.value)}'
);

fs.writeFileSync(adminFile, adminContent);
