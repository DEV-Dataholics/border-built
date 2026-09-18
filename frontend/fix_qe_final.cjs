const fs = require('fs');
let file = 'src/components/features/QuickEntriesSection.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add name_es and description_es to FALLBACK_QUICK_ENTRIES
content = content.replace(
  "name: 'Bronze Package',",
  "name: 'Bronze Package',\n      name_es: 'PAQUETE BRONCE',"
);
content = content.replace(
  "name: 'Silver Package',",
  "name: 'Silver Package',\n      name_es: 'PAQUETE PLATA',"
);
content = content.replace(
  "name: 'Gold Package',",
  "name: 'Gold Package',\n      name_es: 'PAQUETE ORO',"
);

// 2. Translate the hardcoded heading
content = content.replace(
  'QUICK <span className="text-primary italic">ENTRIES</span>',
  '{lang === \'es\' ? <span className="text-white">ENTRADAS <span className="text-primary italic">RÁPIDAS</span></span> : <span className="text-white">QUICK <span className="text-primary italic">ENTRIES</span></span>}'
);

fs.writeFileSync(file, content);
