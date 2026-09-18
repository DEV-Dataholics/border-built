const fs = require('fs');
let file = fs.readFileSync('src/pages/Home.jsx', 'utf8');

file = file.replace(
  "const { activeGiveaway, loadGiveaways } = useGiveawayStore();",
  "const { activeGiveaway, loadGiveaways } = useGiveawayStore();\n  const getLocal = (field) => lang === 'es' && activeGiveaway?.[field + '_es'] ? activeGiveaway[field + '_es'] : activeGiveaway?.[field];"
);

const fieldsToReplace = [
  'hero_subtitle',
  'hero_headline',
  'hero_badge_event',
  'car_engine',
  'car_color',
  'spec_title',
  'spec_subtitle',
  'scarcity_title',
  'scarcity_headline',
  'scarcity_subheadline',
  'scarcity_product_title',
  'scarcity_product_desc'
];

fieldsToReplace.forEach(f => {
  const regex = new RegExp("activeGiveaway\\?\\." + f, "g");
  file = file.replace(regex, "getLocal('" + f + "')");
});

fs.writeFileSync('src/pages/Home.jsx', file);
