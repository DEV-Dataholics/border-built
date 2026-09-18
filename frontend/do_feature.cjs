const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.jsx', 'utf8');

content = content.replace(
  "const Feature = ({ title, desc, img, reverse }) => (",
  "const Feature = ({ title, desc, img, reverse }) => {\n  const { t } = useTranslation();\n  return ("
);

content = content.replace(
  "<span className=\"text-primary block text-[10px] sm:text-xs not-italic font-mono mb-1 tracking-[0.2em]\">BUILD HIGHLIGHT // BORDERBUILT</span>",
  "<span className=\"text-primary block text-[10px] sm:text-xs not-italic font-mono mb-1 tracking-[0.2em]\">{t('hero.buildHighlight', { defaultValue: 'BUILD HIGHLIGHT // BORDERBUILT' })}</span>"
);

content = content.replace(
  "  </div>\n);\n\n// Default breakdown blocks",
  "  </div>\n  );\n};\n\n// Default breakdown blocks"
);

fs.writeFileSync('src/pages/Home.jsx', content);
