const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.jsx', 'utf8');

content = content.replace(
  'const { activeGiveaway, loadGiveaways } = useGiveawayStore();',
  'const { activeGiveaway, loadGiveaways } = useGiveawayStore();\n  const getLocal = (field) => lang === \'es\' && activeGiveaway?.[field + \'_es\'] ? activeGiveaway[field + \'_es\'] : activeGiveaway?.[field];'
);

const fields = [
  'hero_subtitle', 'hero_headline', 'hero_badge_event',
  'car_engine', 'car_color', 'spec_title', 'spec_subtitle',
  'scarcity_title', 'scarcity_headline', 'scarcity_subheadline',
  'scarcity_product_title', 'scarcity_product_desc'
];

fields.forEach(f => {
  content = content.replace(new RegExp('activeGiveaway\\?\\.' + f, 'g'), "getLocal('" + f + "')");
});

content = content.replace(
  'const { t } = useTranslation();',
  'const { t, lang } = useTranslation();'
);

content = content.replace(
  'title={block.title}',
  'title={lang === \'es\' && block.title_es ? block.title_es : block.title}'
).replace(
  'desc={block.description}',
  'desc={lang === \'es\' && block.description_es ? block.description_es : block.description}'
);

fs.writeFileSync('src/pages/Home.jsx', content);
