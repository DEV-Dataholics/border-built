def patch_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

patch_file('src/pages/HowItWorks.jsx', [
    ('>Cmo Funciona BORDERBUILT<', ">{lang === 'es' ? 'Cmo Funciona BORDERBUILT' : 'How BORDERBUILT Works'}<"),
    ('>La mecnica es sencilla: Por cada dlar que gastes en nuestra tienda, recibes entradas directas para ganar nuestros vehculos modificados.<', ">{lang === 'es' ? 'La mecnica es sencilla: Por cada dlar que gastes en nuestra tienda, recibes entradas directas para ganar nuestros vehculos modificados.' : 'The mechanics are simple: For every dollar spent in our store, you receive direct entries to win our modified vehicles.'}<"),
    ('Entradas de Bono', "{lang === 'es' ? 'Entradas de Bono' : 'Bonus Entries'}"),
    ('Efectivo', "{lang === 'es' ? 'Efectivo' : 'Cash'}"),
    ('Tiempo Restante', "{lang === 'es' ? 'Tiempo Restante' : 'Time Remaining'}"),
    ('>Ir a la tienda<', ">{lang === 'es' ? 'Ir a la tienda' : 'Go to Store'}<"),
    ('Stock Limitado', "{lang === 'es' ? 'Stock Limitado' : 'Limited Stock'}"),
    ('Casi Agotadas', "{lang === 'es' ? 'Casi Agotadas' : 'Almost Sold Out'}"),
    ('>Compra Misteriosa<', ">{lang === 'es' ? 'Compra Misteriosa' : 'Mystery Purchase'}<"),
    ('>Las cajas misteriosas contienen merch exclusiva y otorgan entradas multiplicadas. Solo habr 50 disponibles.<', ">{lang === 'es' ? 'Las cajas misteriosas contienen merch exclusiva y otorgan entradas multiplicadas. Solo habr 50 disponibles.' : 'Mystery boxes contain exclusive merch and grant multiplied entries. Only 50 available.'}<"),
    ('>3 Pasos Para <', ">{lang === 'es' ? '3 Pasos Para ' : '3 Steps To '}<"),
    ('>Ganar<', ">{lang === 'es' ? 'Ganar' : 'Win'}<"),
    ('>1. Compra en la Tienda<', ">{lang === 'es' ? '1. Compra en la Tienda' : '1. Shop at the Store'}<"),
    ('>Adquiere hoodies, accesorios, o digital drops. Cada USD gastado = 1 entrada (o ms durante multiplicadores).<', ">{lang === 'es' ? 'Adquiere hoodies, accesorios, o digital drops. Cada USD gastado = 1 entrada (o ms durante multiplicadores).' : 'Get hoodies, accessories, or digital drops. Every USD spent = 1 entry (or more during multipliers).'}<"),
    ('>2. Revisa tu Garage<', ">{lang === 'es' ? '2. Revisa tu Garage' : '2. Check your Garage'}<"),
    ('>Tus entradas se acreditan automticamente a tu perfil. En tu Garage podrs ver tus nmeros oficiales.<', ">{lang === 'es' ? 'Tus entradas se acreditan automticamente a tu perfil. En tu Garage podrs ver tus nmeros oficiales.' : 'Your entries are automatically credited to your profile. In your Garage you can view your official numbers.'}<"),
    ('>3. Sorteo en Vivo<', ">{lang === 'es' ? '3. Sorteo en Vivo' : '3. Live Draw'}<"),
    ('>Al llenarse el porcentaje de entradas o llegar la fecha, realizamos el sorteo auditado en vivo por redes sociales.<', ">{lang === 'es' ? 'Al llenarse el porcentaje de entradas o llegar la fecha, realizamos el sorteo auditado en vivo por redes sociales.' : 'Once the entry percentage is filled or the date arrives, we conduct an audited live draw on social media.'}<")
])

with open('src/pages/HowItWorks.jsx', 'r', encoding='utf-8') as f:
    cc = f.read()
if 'const { lang }' not in cc:
    cc = cc.replace('const HowItWorks = () => {', 'const HowItWorks = () => {\n  const { lang } = useTranslation();')
    if 'useTranslation' not in cc:
        cc = "import { useTranslation } from '../i18n/useTranslation';\n" + cc
with open('src/pages/HowItWorks.jsx', 'w', encoding='utf-8') as f:
    f.write(cc)

print("Patched HowItWorks.jsx")
