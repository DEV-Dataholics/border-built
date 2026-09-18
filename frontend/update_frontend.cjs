const fs = require('fs');

let shopFile = 'src/pages/Shop.jsx';
let shopContent = fs.readFileSync(shopFile, 'utf8');

// For Shop, there are product cards using product.name and product.category.
// Also product.description maybe? Actually the card uses `product.name`
shopContent = shopContent.replace(
  /{product\.name}/g,
  "{lang === 'es' && product.name_es ? product.name_es : product.name}"
);
fs.writeFileSync(shopFile, shopContent);

let detailFile = 'src/pages/ProductDetail.jsx';
let detailContent = fs.readFileSync(detailFile, 'utf8');

detailContent = detailContent.replace(
  /<h1>{product\.name}<\/h1>/g,
  "<h1>{lang === 'es' && product.name_es ? product.name_es : product.name}</h1>"
);
detailContent = detailContent.replace(
  /<p className="text-gray-400 text-sm md:text-base leading-relaxed break-words whitespace-pre-line">\s*\{product\.description\}\s*<\/p>/g,
  '<p className="text-gray-400 text-sm md:text-base leading-relaxed break-words whitespace-pre-line">\n                  {lang === \'es\' && product.description_es ? product.description_es : product.description}\n                </p>'
);
// Make sure lang is destructured in ProductDetail
if (!detailContent.includes("const { t, lang } = useTranslation();")) {
  detailContent = detailContent.replace(
    "const { t } = useTranslation();",
    "const { t, lang } = useTranslation();"
  );
}
fs.writeFileSync(detailFile, detailContent);

let winnersFile = 'src/pages/Winners.jsx';
let winnersContent = fs.readFileSync(winnersFile, 'utf8');
winnersContent = winnersContent.replace(
  /{winner\.car}/g,
  "{lang === 'es' && winner.car_es ? winner.car_es : winner.car}"
);
winnersContent = winnersContent.replace(
  /{winner\.location}/g,
  "{lang === 'es' && winner.location_es ? winner.location_es : winner.location}"
);
winnersContent = winnersContent.replace(
  /{winner\.badge_text}/g,
  "{lang === 'es' && winner.badge_es ? winner.badge_es : winner.badge_text}"
);
if (!winnersContent.includes("const { t, lang } = useTranslation();")) {
  winnersContent = winnersContent.replace(
    "const { t } = useTranslation();",
    "const { t, lang } = useTranslation();"
  );
}
fs.writeFileSync(winnersFile, winnersContent);
