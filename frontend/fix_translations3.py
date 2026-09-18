def patch_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

patch_file('src/pages/VipLounge.jsx', [
    ('El <strong className="text-amber-400">VIP Lounge</strong> es un espacio reservado para miembros VIP de BORDERBUILT. Aqu definimos en comunidad el prximo auto a construir y modificar.', "{lang === 'es' ? <>El <strong className=\\\"text-amber-400\\\">VIP Lounge</strong> es un espacio reservado para miembros VIP de BORDERBUILT. Aqu definimos en comunidad el prximo auto a construir y modificar.</> : <>The <strong className=\\\"text-amber-400\\\">VIP Lounge</strong> is a reserved space for BORDERBUILT VIP members. Here we collectively decide the next car to build and modify.</>}"),
    ('Votaciones Activas', "{lang === 'es' ? 'Votaciones Activas' : 'Active Polls'}"),
    ('Cargando encuestas VIP...', "{lang === 'es' ? 'Cargando encuestas VIP...' : 'Loading VIP polls...'}"),
    ('No hay encuestas activas en este momento.', "{lang === 'es' ? 'No hay encuestas activas en este momento.' : 'No active polls at this moment.'}"),
    ('OPCIONES', "{lang === 'es' ? 'OPCIONES' : 'OPTIONS'}"),
    ('Votar', "{lang === 'es' ? 'Votar' : 'Vote'}")
])

with open('src/pages/VipLounge.jsx', 'r', encoding='utf-8') as f:
    cc = f.read()
if 'const { lang }' not in cc:
    cc = cc.replace('const VipLounge = () => {', 'const VipLounge = () => {\n  const { lang } = useTranslation();')
    if 'useTranslation' not in cc:
        cc = "import { useTranslation } from '../i18n/useTranslation';\n" + cc
with open('src/pages/VipLounge.jsx', 'w', encoding='utf-8') as f:
    f.write(cc)

print("Patched VipLounge.jsx")
