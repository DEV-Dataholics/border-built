const fs = require('fs');

let file = 'src/components/features/ProductCard.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("const { t, lang } = useTranslation();")) {
  content = content.replace(
    "const { t } = useTranslation();",
    "const { t, lang } = useTranslation();"
  );
}

content = content.replace(
  />\s*\{product\.name\}\s*<\/h3>/g,
  ">{lang === 'es' && product.name_es ? product.name_es : product.name}</h3>"
);

fs.writeFileSync(file, content);
