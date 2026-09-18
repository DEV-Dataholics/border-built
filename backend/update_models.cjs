const fs = require('fs');

const updateModel = (file, additions) => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/(protected \$allowedFields\s*=\s*\[[\s\S]*?)(];)/, (match, p1, p2) => {
    return p1 + additions + '\n    ' + p2;
  });
  fs.writeFileSync(file, content);
};

updateModel('app/Models/CommunityHighlightModel.php', "        'title_es',\n        'location_es',");
