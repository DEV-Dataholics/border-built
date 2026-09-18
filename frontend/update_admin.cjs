const fs = require('fs');
let file = fs.readFileSync('src/pages/admin/AdminHomeEditor.jsx', 'utf8');

// Update state
file = file.replace(
  "heroSubtitle: '',",
  "heroSubtitle: '', heroSubtitleEs: '',"
).replace(
  "heroHeadline: '',",
  "heroHeadline: '', heroHeadlineEs: '',"
).replace(
  "heroBadgeEvent: '',",
  "heroBadgeEvent: '', heroBadgeEventEs: '',"
).replace(
  "carEngine: '',",
  "carEngine: '', carEngineEs: '',"
).replace(
  "carColor: '',",
  "carColor: '', carColorEs: '',"
).replace(
  "specTitle: '',",
  "specTitle: '', specTitleEs: '',"
).replace(
  "specSubtitle: '',",
  "specSubtitle: '', specSubtitleEs: '',"
).replace(
  "scarcityTitle: '',",
  "scarcityTitle: '', scarcityTitleEs: '',"
).replace(
  "scarcityHeadline: '',",
  "scarcityHeadline: '', scarcityHeadlineEs: '',"
).replace(
  "scarcitySubheadline: '',",
  "scarcitySubheadline: '', scarcitySubheadlineEs: '',"
).replace(
  "scarcityProductTitle: '',",
  "scarcityProductTitle: '', scarcityProductTitleEs: '',"
).replace(
  "scarcityProductDesc: '',",
  "scarcityProductDesc: '', scarcityProductDescEs: '',"
);

// Update fetch
file = file.replace(
  "heroSubtitle: data.hero_subtitle || '',",
  "heroSubtitle: data.hero_subtitle || '', heroSubtitleEs: data.hero_subtitle_es || '',"
).replace(
  "heroHeadline: data.hero_headline || '',",
  "heroHeadline: data.hero_headline || '', heroHeadlineEs: data.hero_headline_es || '',"
).replace(
  "heroBadgeEvent: data.hero_badge_event || '',",
  "heroBadgeEvent: data.hero_badge_event || '', heroBadgeEventEs: data.hero_badge_event_es || '',"
).replace(
  "carEngine: data.car_engine || '',",
  "carEngine: data.car_engine || '', carEngineEs: data.car_engine_es || '',"
).replace(
  "carColor: data.car_color || '',",
  "carColor: data.car_color || '', carColorEs: data.car_color_es || '',"
).replace(
  "specTitle: data.spec_title || '',",
  "specTitle: data.spec_title || '', specTitleEs: data.spec_title_es || '',"
).replace(
  "specSubtitle: data.spec_subtitle || '',",
  "specSubtitle: data.spec_subtitle || '', specSubtitleEs: data.spec_subtitle_es || '',"
).replace(
  "scarcityTitle: data.scarcity_title || '',",
  "scarcityTitle: data.scarcity_title || '', scarcityTitleEs: data.scarcity_title_es || '',"
).replace(
  "scarcityHeadline: data.scarcity_headline || '',",
  "scarcityHeadline: data.scarcity_headline || '', scarcityHeadlineEs: data.scarcity_headline_es || '',"
).replace(
  "scarcitySubheadline: data.scarcity_subheadline || '',",
  "scarcitySubheadline: data.scarcity_subheadline || '', scarcitySubheadlineEs: data.scarcity_subheadline_es || '',"
).replace(
  "scarcityProductTitle: data.scarcity_product_title || '',",
  "scarcityProductTitle: data.scarcity_product_title || '', scarcityProductTitleEs: data.scarcity_product_title_es || '',"
).replace(
  "scarcityProductDesc: data.scarcity_product_desc || '',",
  "scarcityProductDesc: data.scarcity_product_desc || '', scarcityProductDescEs: data.scarcity_product_desc_es || '',"
);

// Add breakdown block fields
file = file.replace(
  "{ title: '', description: '', image_url: '' }",
  "{ title: '', title_es: '', description: '', description_es: '', image_url: '' }"
);

// Add breakdown block inputs
file = file.replace(
  '<Input\n                            value={block.title}\n                            onChange={(e) => updateBlock(idx, \'title\', e.target.value)}\n                            placeholder="Ej: Custom Interior"\n                          />',
  '<Input value={block.title} onChange={(e) => updateBlock(idx, \'title\', e.target.value)} placeholder="Ej: Custom Interior" />\n                          <Input value={block.title_es} onChange={(e) => updateBlock(idx, \'title_es\', e.target.value)} placeholder="TRADUCCIÓN ES" className="border-primary/50 bg-[#111111]" />'
);

file = file.replace(
  '<textarea\n                            value={block.description}\n                            onChange={(e) => updateBlock(idx, \'description\', e.target.value)}\n                            placeholder="Ej: Custom seats with red accents..."\n                            rows={3}\n                            className="w-full bg-black/50 border border-white/10 rounded-md p-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors resize-none"\n                          />',
  '<textarea value={block.description} onChange={(e) => updateBlock(idx, \'description\', e.target.value)} placeholder="Ej: Custom seats with red accents..." rows={2} className="w-full bg-black/50 border border-white/10 rounded-md p-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors resize-none" />\n                          <textarea value={block.description_es} onChange={(e) => updateBlock(idx, \'description_es\', e.target.value)} placeholder="TRADUCCIÓN ES" rows={2} className="w-full bg-black/50 border border-primary/50 rounded-md p-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors resize-none" />'
);

fs.writeFileSync('src/pages/admin/AdminHomeEditor.jsx', file);
