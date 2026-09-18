const fs = require('fs');

let file = 'src/pages/Home.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "PROGRESO DEL SORTEO",
  "{lang === 'es' ? 'PROGRESO DEL SORTEO' : 'GIVEAWAY PROGRESS'}"
);

content = content.replace(
  "ENTRADAS PROYECTADAS",
  "{lang === 'es' ? 'ENTRADAS PROYECTADAS' : 'PROJECTED ENTRIES'}"
);

content = content.replace(
  "VALOR DE PREMIO",
  "{lang === 'es' ? 'VALOR DE PREMIO' : 'PRIZE VALUE'}"
);

content = content.replace(
  "<span>{t('hero.buyAndEnter')}</span>",
  "<span>{lang === 'es' ? 'COMPRAR Y PARTICIPAR' : 'BUY & ENTER'}</span>"
);

fs.writeFileSync(file, content);
