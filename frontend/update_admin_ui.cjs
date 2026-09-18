const fs = require('fs');

let file = 'src/pages/admin/AdminProducts.jsx';
let content = fs.readFileSync(file, 'utf8');

// State initialization
content = content.replace(
  "sizes: '',",
  "sizes: '',\n      nameEs: '',\n      descriptionEs: '',"
);

// Map on edit
content = content.replace(
  "sizes: product.variants?.filter(v => v.size).map(v => v.size).join(', ') || '',",
  "sizes: product.variants?.filter(v => v.size).map(v => v.size).join(', ') || '',\n      nameEs: product.name_es || '',\n      descriptionEs: product.description_es || '',"
);

// Form Inputs
content = content.replace(
  /<Input\s*label="Product Name"\s*name="name"\s*value={formData\.name}\s*onChange={handleChange}\s*required\s*\/>/g,
  '<Input label="Product Name" name="name" value={formData.name} onChange={handleChange} required />\n                  <Input label="[ES] Nombre del Producto" name="nameEs" value={formData.nameEs} onChange={handleChange} className="border-primary/50 bg-[#111111]" />'
);
content = content.replace(
  /<Input\s*label="Description"\s*name="description"\s*value={formData\.description}\s*onChange={handleChange}\s*\/>/g,
  '<Input label="Description" name="description" value={formData.description} onChange={handleChange} />\n                <Input label="[ES] DescripciA3n" name="descriptionEs" value={formData.descriptionEs} onChange={handleChange} className="border-primary/50 bg-[#111111]" />'
);

fs.writeFileSync(file, content);

let winnerFile = 'src/pages/admin/AdminWinners.jsx';
let winnerContent = fs.readFileSync(winnerFile, 'utf8');

winnerContent = winnerContent.replace(
  "badgeText: '',",
  "badgeText: '',\n      carEs: '',\n      locationEs: '',\n      badgeEs: '',"
);

winnerContent = winnerContent.replace(
  "badgeText: winner.badge_text || '',",
  "badgeText: winner.badge_text || '',\n      carEs: winner.car_es || '',\n      locationEs: winner.location_es || '',\n      badgeEs: winner.badge_es || '',"
);

winnerContent = winnerContent.replace(
  /<input\s*type="text"\s*value={winnerForm\.car}\s*onChange={\(e\) => setWinnerForm\({ \.\.\.winnerForm, car: e\.target\.value }\)}\s*className="w-full bg-white\/5 border border-white\/10 rounded-lg p-2\.5 text-sm text-white focus:border-primary outline-none"\s*\/>/g,
  '<input type="text" value={winnerForm.car} onChange={(e) => setWinnerForm({ ...winnerForm, car: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none" />\n                  <input type="text" placeholder="VERSIÓN ESPAÑOL" value={winnerForm.carEs} onChange={(e) => setWinnerForm({ ...winnerForm, carEs: e.target.value })} className="w-full mt-1 bg-[#111111] border border-primary/50 rounded-lg p-2.5 text-sm text-white outline-none" />'
);
winnerContent = winnerContent.replace(
  /<input\s*type="text"\s*value={winnerForm\.location}\s*onChange={\(e\) => setWinnerForm\({ \.\.\.winnerForm, location: e\.target\.value }\)}\s*className="w-full bg-white\/5 border border-white\/10 rounded-lg p-2\.5 text-sm text-white focus:border-primary outline-none"\s*\/>/g,
  '<input type="text" value={winnerForm.location} onChange={(e) => setWinnerForm({ ...winnerForm, location: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none" />\n                    <input type="text" placeholder="VERSIÓN ESPAÑOL" value={winnerForm.locationEs} onChange={(e) => setWinnerForm({ ...winnerForm, locationEs: e.target.value })} className="w-full mt-1 bg-[#111111] border border-primary/50 rounded-lg p-2.5 text-sm text-white outline-none" />'
);
winnerContent = winnerContent.replace(
  /<input\s*type="text"\s*value={winnerForm\.badgeText}\s*onChange={\(e\) => setWinnerForm\({ \.\.\.winnerForm, badgeText: e\.target\.value }\)}\s*className="w-full bg-white\/5 border border-white\/10 rounded-lg p-2\.5 text-sm text-white focus:border-primary outline-none"\s*\/>/g,
  '<input type="text" value={winnerForm.badgeText} onChange={(e) => setWinnerForm({ ...winnerForm, badgeText: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none" />\n                  <input type="text" placeholder="VERSIÓN ESPAÑOL" value={winnerForm.badgeEs} onChange={(e) => setWinnerForm({ ...winnerForm, badgeEs: e.target.value })} className="w-full mt-1 bg-[#111111] border border-primary/50 rounded-lg p-2.5 text-sm text-white outline-none" />'
);

fs.writeFileSync(winnerFile, winnerContent);

