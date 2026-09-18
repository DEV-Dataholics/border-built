const fs = require('fs');
let file = 'src/components/features/QuickEntriesSection.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("const { t, lang } = useTranslation();")) {
  content = content.replace("const { t } = useTranslation();", "const { t, lang } = useTranslation();");
}

content = content.replace(
  /product\.name\b/g,
  "(lang === 'es' && product.name_es ? product.name_es : product.name)"
);
content = content.replace(
  /product\.description\b/g,
  "(lang === 'es' && product.description_es ? product.description_es : product.description)"
);

// We must revert product.name.toLowerCase() because product.name is now an expression
content = content.replace(
  "const nameLower = (lang === 'es' && product.name_es ? product.name_es : product.name).toLowerCase();",
  "const nameLower = product.name.toLowerCase();"
);

fs.writeFileSync(file, content);
