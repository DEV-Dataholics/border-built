const fs = require('fs');
let file = 'src/components/features/QuickEntriesSection.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove descriptions of Merch from fallbacks
content = content.replace(
  "Paquete de 30,000 entradas directas con super multiplicador 500X. Incluye Merch oficial y calcomanías exclusivas.",
  "Paquete de 30,000 entradas directas con super multiplicador 500X."
);
content = content.replace(
  "Paquete de 75,000 entradas directas con super multiplicador 500X. Incluye Merch oficial + Gorra Tuner + Stickers.",
  "Paquete de 75,000 entradas directas con super multiplicador 500X."
);
content = content.replace(
  "Paquete mA!ximo de 150,000 entradas directas con super multiplicador 500X. Incluye Hoodie oficial + Merch Pack + Acceso VIP.",
  "Paquete mA!ximo de 150,000 entradas directas con super multiplicador 500X."
);
content = content.replace(
  "Paquete máximo de 150,000 entradas directas con super multiplicador 500X. Incluye Hoodie oficial + Merch Pack + Acceso VIP.",
  "Paquete máximo de 150,000 entradas directas con super multiplicador 500X."
);

// 2. Remove the size selector JSX
// Use regex to remove the entire block
content = content.replace(
  /\{\/\* Optional Size Selector if apparel included \*\/\}(.|\n)*?<\/div>\n\s*\}\)/g,
  ""
);

// We need a more precise regex.
content = content.replace(
  /\{\/\* Optional Size Selector if apparel included \*\/\}[\s\S]*?\}\)/g,
  ""
);
// Wait, the block ends with })\n                  </div>\n                )}
// Let's just string replace it out.
content = content.replace(
  "                {/* Optional Size Selector if apparel included */}\n" +
  "                {product.category === 'quick_entries' && (\n" +
  "                  <div className=\"flex items-center justify-between bg-white/5 border border-white/10 px-3 py-2 rounded-xl\">\n" +
  "                    <span className=\"text-gray-400 text-[10px] font-mono uppercase font-bold\">\n" +
  "                      {t('quickEntries.selectSize')}\n" +
  "                    </span>\n" +
  "                    <div className=\"flex gap-1\">\n" +
  "                      {['S', 'M', 'L', 'XL', '2XL'].map(sz => (\n" +
  "                        <button\n" +
  "                          key={sz}\n" +
  "                          type=\"button\"\n" +
  "                          onClick={() => handleSizeChange(product.id, sz)}\n" +
  "                          className={`w-7 h-7 rounded-lg text-[10px] font-mono font-bold transition-colors ${\n" +
  "                            selectedSize === sz\n" +
  "                              ? 'bg-primary text-black'\n" +
  "                              : 'bg-white/5 text-gray-400 hover:text-white'\n" +
  "                          }`}\n" +
  "                        >\n" +
  "                          {sz}\n" +
  "                        </button>\n" +
  "                      ))}\n" +
  "                    </div>\n" +
  "                  </div>\n" +
  "                )}\n",
  ""
);

fs.writeFileSync(file, content);
