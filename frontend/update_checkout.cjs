const fs = require('fs');
let file = 'src/pages/Checkout.jsx';
let content = fs.readFileSync(file, 'utf8');

// Also need to get translation function in the Checkout element
// Let's check if `t` is available in `Checkout` component
content = content.replace(
  "const Checkout = () => {",
  "const Checkout = () => {\n  const { t, lang } = useTranslation();"
);
content = content.replace(
  "locale: 'auto',",
  "locale: lang === 'es' ? 'es' : 'en',"
);

// We need to check if locale was already present or if we need to insert it
if (!content.includes("locale: lang === 'es' ? 'es' : 'en',")) {
  content = content.replace(
    "theme: 'night',",
    "theme: 'night',\n    locale: lang === 'es' ? 'es' : 'en',"
  );
}

// Replace strings
content = content.replace(
  ">CONFIRMAR Y PAGAR CON STRIPE ($${total.toFixed(2)})<",
  ">{t('checkout.payWithStripe')} ($${total.toFixed(2)})<"
);
content = content.replace(
  "Tu Oportunidad de Ganar",
  "{t('checkout.chanceToWin')}"
);
content = content.replace(
  "¿Tienes un cupón de descuento?",
  "{t('checkout.haveCoupon')}"
);
content = content.replace(
  "`+${appliedCoupon.entries_count?.toLocaleString() || 0} entradas al giveaway`",
  "`+${appliedCoupon.entries_count?.toLocaleString() || 0} ${t('checkout.entriesToGiveaway')}`"
);
content = content.replace(
  "`${appliedCoupon.value}% de descuento`",
  "`${appliedCoupon.value}% ${t('checkout.discountOf')}`"
);
content = content.replace(
  "`$${appliedCoupon.value} de descuento`",
  "`$${appliedCoupon.value} ${t('checkout.discountOf')}`"
);
content = content.replace(
  ">Descuento ({appliedCoupon.code})<",
  ">{t('checkout.discount')} ({appliedCoupon.code})<"
);
content = content.replace(
  ">+${appliedCoupon.entries_count?.toLocaleString() || 0} entradas<",
  ">+${appliedCoupon.entries_count?.toLocaleString() || 0} ${t('checkout.entries')}<"
);
content = content.replace(
  ">Total<",
  ">{t('checkout.total')}<"
);

fs.writeFileSync(file, content);
