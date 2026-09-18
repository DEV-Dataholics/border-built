const fs = require('fs');
let file = fs.readFileSync('src/pages/Home.jsx', 'utf8');

// Fix `const { t } = useTranslation();` inside `Home` to be `const { t, lang } = useTranslation();`
file = file.replace(
  "const Home = () => {\n  const navigate = useNavigate();\n  const { t } = useTranslation();",
  "const Home = () => {\n  const navigate = useNavigate();\n  const { t, lang } = useTranslation();"
);

// Fix breakdown blocks rendering
file = file.replace(
  '<Feature\n              key={idx}\n              title={block.title}\n              desc={block.description}',
  '<Feature\n              key={idx}\n              title={lang === \'es\' && block.title_es ? block.title_es : block.title}\n              desc={lang === \'es\' && block.description_es ? block.description_es : block.description}'
);

fs.writeFileSync('src/pages/Home.jsx', file);
