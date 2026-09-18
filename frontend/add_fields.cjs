const fs = require('fs');
let file = fs.readFileSync('src/pages/admin/AdminHomeEditor.jsx', 'utf8');

const fields = [
  'heroSubtitle',
  'heroHeadline',
  'heroBadgeEvent',
  'carEngine',
  'carColor',
  'specTitle',
  'specSubtitle',
  'scarcityTitle',
  'scarcityHeadline',
  'scarcitySubheadline',
  'scarcityProductTitle',
  'scarcityProductDesc'
];

fields.forEach(f => {
  const regex = new RegExp('<Input[^>]*name="' + f + '"[^>]*>[^<]*(?:</Input>)?|<Input[^>]*name="' + f + '"[^>]*/>', 'g');
  file = file.replace(regex, match => {
    return match + '\n                <Input name="' + f + 'Es" value={formData.' + f + 'Es} onChange={handleChange} placeholder="VERSIÓN ESPAÑOL" className="mt-1 border-primary/50 bg-[#111111]" />';
  });
});

fs.writeFileSync('src/pages/admin/AdminHomeEditor.jsx', file);
