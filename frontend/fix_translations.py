import os
import re

def patch_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# ClaimCoupon.jsx
patch_file('src/pages/ClaimCoupon.jsx', [
    ('BORDERBUILT // CANJE', "{lang === 'es' ? 'BORDERBUILT // CANJE' : 'BORDERBUILT // REDEEM'}"),
    ('Canjea tu cdigo promocional o entradas ganadas.', "{lang === 'es' ? 'Canjea tu cdigo promocional o entradas ganadas.' : 'Redeem your promotional code or bonus entries.'}"),
    ('CUPN CANJEADO CON XITO!', "{lang === 'es' ? 'CUPN CANJEADO CON XITO!' : 'COUPON SUCCESSFULLY REDEEMED!'}"),
    ('Cdigo: <strong', "{lang === 'es' ? 'Cdigo: ' : 'Code: '}<strong"),
    ('Entradas Acreditadas', "{lang === 'es' ? 'Entradas Acreditadas' : 'Entries Credited'}"),
    ('ENTRADAS TOTALES', "{lang === 'es' ? 'ENTRADAS TOTALES' : 'TOTAL ENTRIES'}"),
    ('Ir al Garage', "{lang === 'es' ? 'Ir al Garage' : 'Go to Garage'}"),
    ('Cdigo Promocional', "{lang === 'es' ? 'Cdigo Promocional' : 'Promotional Code'}"),
    ('Ej. BORDER700', "{lang === 'es' ? 'Ej. BORDER700' : 'E.g. BORDER700'}"),
    ('VALIDAR', "{lang === 'es' ? 'VALIDAR' : 'VALIDATE'}"),
    ('Campaa:', "{lang === 'es' ? 'Campaa: ' : 'Campaign: '}"),
    ('Recompensa', "{lang === 'es' ? 'Recompensa' : 'Reward'}"),
    ('ENTRADAS', "{lang === 'es' ? 'ENTRADAS' : 'ENTRIES'}"),
    ('Descuento de Tienda', "{lang === 'es' ? 'Descuento de Tienda' : 'Store Discount'}"),
    ('CANJEAR AHORA', "{lang === 'es' ? 'CANJEAR AHORA' : 'REDEEM NOW'}")
])

# Import useTranslation in ClaimCoupon.jsx if not present
with open('src/pages/ClaimCoupon.jsx', 'r', encoding='utf-8') as f:
    cc = f.read()
if 'const { lang }' not in cc:
    cc = cc.replace('const ClaimCoupon = () => {', 'const ClaimCoupon = () => {\n  const { lang } = useTranslation();')
with open('src/pages/ClaimCoupon.jsx', 'w', encoding='utf-8') as f:
    f.write(cc)

print("Patched ClaimCoupon.jsx")
