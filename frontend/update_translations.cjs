const en = require('./src/i18n/en.json');
const es = require('./src/i18n/es.json');
const fs = require('fs');

en.checkout.chanceToWin = "Your Chance To Win";
es.checkout.chanceToWin = "Tu Oportunidad de Ganar";

en.checkout.haveCoupon = "Have a discount coupon?";
es.checkout.haveCoupon = "¿Tienes un cupón de descuento?";

en.checkout.entriesToGiveaway = "entries to the giveaway";
es.checkout.entriesToGiveaway = "entradas al giveaway";

en.checkout.discountOf = "discount";
es.checkout.discountOf = "de descuento";

en.checkout.discount = "Discount";
es.checkout.discount = "Descuento";

en.checkout.entries = "entries";
es.checkout.entries = "entradas";

en.checkout.total = "Total";
es.checkout.total = "Total";

en.checkout.payWithStripe = "CONFIRM & PAY WITH STRIPE";
es.checkout.payWithStripe = "CONFIRMAR Y PAGAR CON STRIPE";

fs.writeFileSync('./src/i18n/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('./src/i18n/es.json', JSON.stringify(es, null, 2));
