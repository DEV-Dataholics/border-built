const fs = require('fs');
let file = fs.readFileSync('src/pages/admin/AdminHomeEditor.jsx', 'utf8');

file = file.replace(
  /<Input\s+value=\{block\.title \|\| ''\}\s+onChange=\{\(e\) => updateBlock\(idx, 'title', e\.target\.value\)\}\s+placeholder="Ej: Motor VQ35DE Twin-Turbo"\s+className="text-xs"\s+\/>/g,
  '<Input value={block.title || \'\'} onChange={(e) => updateBlock(idx, \'title\', e.target.value)} placeholder="Ej: Motor VQ35DE Twin-Turbo" className="text-xs" />\n<Input value={block.title_es || \'\'} onChange={(e) => updateBlock(idx, \'title_es\', e.target.value)} placeholder="TRADUCCIÓN ES" className="text-xs border-primary/50 mt-1" />'
);

file = file.replace(
  /<textarea\s+value=\{block\.description \|\| ''\}\s+onChange=\{\(e\) => updateBlock\(idx, 'description', e\.target\.value\)\}\s+placeholder="Ej: El legendario motor V6\.\.\."\s+rows=\{3\}\s+className="w-full bg-black\/50 border border-white\/10 rounded-md p-3 text-xs text-white focus:outline-none focus:border-primary\/50 transition-colors resize-none"\s+\/>/g,
  '<textarea value={block.description || \'\'} onChange={(e) => updateBlock(idx, \'description\', e.target.value)} placeholder="Ej: El legendario motor V6..." rows={2} className="w-full bg-black/50 border border-white/10 rounded-md p-3 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors resize-none" />\n<textarea value={block.description_es || \'\'} onChange={(e) => updateBlock(idx, \'description_es\', e.target.value)} placeholder="TRADUCCIÓN ES" rows={2} className="w-full bg-black/50 border border-primary/50 rounded-md p-3 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors resize-none mt-1" />'
);

fs.writeFileSync('src/pages/admin/AdminHomeEditor.jsx', file);
