import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../i18n/useTranslation';
import PageTransition from '../components/layout/PageTransition';

const Legal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, lang } = useTranslation();
  const isEs = lang === 'es';

  // Read tab from query params, default to 'rules'
  const query = new URLSearchParams(location.search);
  const initialTab = query.get('tab') || 'rules';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const currentTab = query.get('tab') || 'rules';
    setActiveTab(currentTab);
    window.scrollTo(0, 0);
  }, [location.search]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    navigate(`/legal?tab=${tabKey}`, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tabs = [
    { id: 'rules', labelEn: 'Official Rules', labelEs: 'Reglas Oficiales', icon: 'gavel' },
    { id: 'shipping', labelEn: 'Shipping & Delivery', labelEs: 'Envíos y Entregas', icon: 'local_shipping' },
    { id: 'returns', labelEn: 'Returns & Exchanges', labelEs: 'Devoluciones y Cambios', icon: 'sync' },
    { id: 'scams', labelEn: 'Prevent Scams', labelEs: 'Evitar Estafas', icon: 'security' },
    { id: 'terms', labelEn: 'Terms of Service', labelEs: 'Términos de Servicio', icon: 'description' },
    { id: 'privacy', labelEn: 'Privacy Policy', labelEs: 'Política de Privacidad', icon: 'lock' },
  ];

  return (
    <PageTransition className="min-h-screen bg-[#0a0a0a] text-white pb-24 font-sans">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors text-gray-400 hover:text-white text-xs uppercase font-mono"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span>{isEs ? 'Volver' : 'Back'}</span>
          </button>
          
          <h1 className="text-xs md:text-sm font-bold uppercase tracking-wider font-mono text-primary">
            [ BORDERBUILT // {tabs.find(t => t.id === activeTab)?.[isEs ? 'labelEs' : 'labelEn']} ]
          </h1>
          
          <div className="w-16" />
        </div>

        {/* Tab Navigation */}
        <div className="max-w-5xl mx-auto px-4 flex gap-2 overflow-x-auto no-scrollbar py-2 border-t border-white/5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary text-black font-bold shadow-[0_0_12px_rgba(106,244,37,0.4)]'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                <span>{isEs ? tab.labelEs : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">

        {/* ============================================================ */}
        {/* TAB 1: OFFICIAL RULES                                       */}
        {/* ============================================================ */}
        {activeTab === 'rules' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-2 border-red-500/30 rounded-xl p-6 relative overflow-hidden bg-[#0d0d0d]">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                <span className="text-red-500 text-8xl font-black italic uppercase rotate-[-30deg]">
                  CLASSIFIED
                </span>
              </div>
              <div className="relative z-10 text-center">
                <p className="text-red-400/60 text-[10px] font-mono uppercase tracking-[0.3em] mb-2">
                  {t('legal.clearance')}
                </p>
                <h1 className="text-3xl font-black italic uppercase text-white mb-1">
                  {t('legal.title')}
                </h1>
                <p className="text-gray-500 text-xs font-mono">
                  BORDERBUILT LLC - SWEEPSTAKES REGULATIONS - V.24
                </p>
              </div>
            </div>

            <div className="font-mono text-sm text-gray-300 leading-relaxed space-y-6 bg-[#121212] p-6 md:p-8 rounded-xl border border-white/10">
              <section>
                <h2 className="text-primary text-xs uppercase tracking-widest font-bold mb-3 border-b border-white/10 pb-2">
                  {isEs ? '▶ 1. ELEGIBILIDAD' : '▶ 1. ELIGIBILITY'}
                </h2>
                <p>
                  {isEs 
                    ? 'El Sorteo BORDERBUILT (la "Promoción") está abierto a residentes legales de los Estados Unidos que tengan al menos dieciocho (18) años de edad al momento de participar y que cuenten con una licencia de conducir válida de EE. UU. Ciudadanos mexicanos no son elegibles para participar. Empleados, oficiales, directores y agentes de BORDERBUILT LLC no son elegibles para participar.' 
                    : 'The BORDERBUILT Giveaway (the "Promotion") is open to legal residents of the United States who are at least eighteen (18) years of age at the time of entry and hold a valid U.S. driver\'s license. Mexican citizens are not eligible to participate. Employees, officers, directors, and agents of BORDERBUILT LLC are not eligible to participate.'}
                </p>
              </section>

              <section>
                <h2 className="text-primary text-xs uppercase tracking-widest font-bold mb-3 border-b border-white/10 pb-2">
                  {isEs ? '▶ 2. NO REQUIERE COMPRA' : '▶ 2. NO PURCHASE NECESSARY'}
                </h2>
                <p>
                  {isEs 
                    ? 'NO ES NECESARIA NINGUNA COMPRA PARA PARTICIPAR O GANAR. Una compra no mejorará sus posibilidades de ganar. Método alternativo de entrada: Envíe una tarjeta manuscrita de 3"x5" con su nombre completo, dirección, número de teléfono y dirección de correo electrónico a: BORDERBUILT LLC, P.O. Box XXXXX, El Paso, TX 79901. Límite de una (1) entrada gratuita por persona por sobre. Debe tener matasellos antes de la fecha de finalización de la Promoción y ser recibida dentro de los siete (7) días posteriores.' 
                    : 'NO PURCHASE NECESSARY TO ENTER OR WIN. A purchase will not improve your chances of winning. Alternative method of entry: Send a handwritten 3"x5" card with your full name, address, phone number, and email address to: BORDERBUILT LLC, P.O. Box XXXXX, El Paso, TX 79901. Limit one (1) free entry per person per envelope. Must be postmarked by the Promotion end date and received within seven (7) days thereafter.'}
                </p>
              </section>

              <section>
                <h2 className="text-primary text-xs uppercase tracking-widest font-bold mb-3 border-b border-white/10 pb-2">
                  {isEs ? '▶ 3. PERÍODO Y MÉTODOS DE PARTICIPACIÓN' : '▶ 3. ENTRY PERIOD & METHOD'}
                </h2>
                <p>
                  {isEs 
                    ? 'Las entradas se obtienen a través de compras elegibles en borderbuilt.com. Cada $1.00 USD gastado en mercancía elegible otorga al participante entradas según el multiplicador activo mostrado al momento de la compra. La tasa del multiplicador está sujeta a cambios durante los períodos promocionales. Las cantidades de entrada se calculan y asignan después de la confirmación del pago a través del sistema de validación del webhook de pago.' 
                    : 'Entries are earned through qualifying purchases at borderbuilt.com. Each $1.00 USD spent on eligible merchandise earns the participant entries based on the current active multiplier displayed at the time of purchase. The multiplier rate is subject to change during promotional periods. Entry quantities are calculated and assigned after payment confirmation via the checkout webhook validation system.'}
                </p>
              </section>

              <section>
                <h2 className="text-primary text-xs uppercase tracking-widest font-bold mb-3 border-b border-white/10 pb-2">
                  {isEs ? '▶ 4. DESCRIPCIÓN DEL PREMIO' : '▶ 4. PRIZE DESCRIPTION'}
                </h2>
                <p>
                  {isEs 
                    ? 'El Premio Mayor consiste en un (1) vehículo modificado como se describe en la página de inicio de la Promoción, más un premio en efectivo según se anuncie (colectivamente, el "Premio"). El valor aproximado al por menor (ARV) se mostrará en el sitio web. El ganador es responsable de todos los impuestos federales, estatales y locales, título, registro, seguro y cualquier otro costo asociado con el Premio.' 
                    : 'The Grand Prize consists of one (1) modified vehicle as described on the Promotion landing page, plus cash prize as advertised (collectively, the "Prize"). The approximate retail value (ARV) will be displayed on the website. Winner is responsible for all federal, state, and local taxes, title, registration, insurance, and any other costs associated with the Prize.'}
                </p>
              </section>

              <section>
                <h2 className="text-primary text-xs uppercase tracking-widest font-bold mb-3 border-b border-white/10 pb-2">
                  {isEs ? '▶ 5. SELECCIÓN DEL GANADOR' : '▶ 5. WINNER SELECTION'}
                </h2>
                <p>
                  {isEs 
                    ? 'El ganador será seleccionado en un sorteo al azar realizado por una entidad de verificación de terceros independiente. El sorteo será transmitido en vivo en los canales oficiales de redes sociales de BORDERBUILT. El ganador será notificado vía correo electrónico y/o teléfono dentro de las cuarenta y ocho (48) horas posteriores al sorteo. El ganador debe responder dentro de los catorce (14) días o el premio será anulado y se seleccionará un ganador alternativo.' 
                    : 'The winner will be selected in a random drawing conducted by an independent third-party verification entity. The drawing will be broadcast live on BORDERBUILT\'s official social media channels. The winner will be notified via email and/or phone within forty-eight (48) hours of the drawing. Winner must respond within fourteen (14) days or the prize will be forfeited and an alternate winner selected.'}
                </p>
              </section>

              <section>
                <h2 className="text-primary text-xs uppercase tracking-widest font-bold mb-3 border-b border-white/10 pb-2">
                  {isEs ? '▶ 6. VERIFICACIÓN Y TRANSPARENCIA' : '▶ 6. VERIFICATION & TRANSPARENCY'}
                </h2>
                <p>
                  {isEs 
                    ? 'Todas las entradas se rastrean con hashes de verificación criptográfica, marcas de tiempo e identificadores de orden. Los informes de entrada se generan y son auditables. El registro completo de entradas se pondrá a disposición de la entidad de verificación independiente antes del sorteo. BORDERBUILT LLC mantiene el derecho de auditar y descalificar cualquier entrada obtenida a través de medios fraudulentos.' 
                    : 'All entries are tracked with cryptographic verification hashes, timestamps, and order identifiers. Entry reports are generated and auditable. The complete entry ledger will be made available to the independent verification entity prior to the drawing. BORDERBUILT LLC maintains the right to audit and disqualify any entries obtained through fraudulent means.'}
                </p>
              </section>

              <section>
                <h2 className="text-primary text-xs uppercase tracking-widest font-bold mb-3 border-b border-white/10 pb-2">
                  {isEs ? '▶ 7. CONDICIONES GENERALES' : '▶ 7. GENERAL CONDITIONS'}
                </h2>
                <p>
                  {isEs 
                    ? 'Al participar, los concursantes aceptan estar obligados por estas Reglas Oficiales y las decisiones de BORDERBUILT LLC, las cuales son definitivas y vinculantes. BORDERBUILT LLC se reserva el derecho de cancelar, suspender o modificar la Promoción si algún fraude, fallas técnicas u otros factores más allá del control razonable perjudican la integridad o el funcionamiento adecuado de la Promoción.' 
                    : 'By participating, entrants agree to be bound by these Official Rules and the decisions of BORDERBUILT LLC, which are final and binding. BORDERBUILT LLC reserves the right to cancel, suspend, or modify the Promotion if any fraud, technical failures, or other factors beyond reasonable control impair the integrity or proper functioning of the Promotion.'}
                </p>
              </section>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: SHIPPING & DELIVERIES                                */}
        {/* ============================================================ */}
        {activeTab === 'shipping' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 md:p-10 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">local_shipping</span>
                </div>
                <div>
                  <h2 className="text-2xl font-black italic uppercase text-white">
                    {isEs ? 'Envíos y Entregas' : 'Shipping & Deliveries'}
                  </h2>
                  <p className="text-xs font-mono text-gray-400">
                    {isEs ? 'Información sobre tiempos de entrega y logística' : 'Delivery times, tracking, and fulfillment policies'}
                  </p>
                </div>
              </div>

              <div className="space-y-6 text-sm text-gray-300 leading-relaxed font-normal">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <h3 className="text-white font-bold uppercase font-mono text-xs text-primary">
                    {isEs ? '01. Procesamiento de Órdenes' : '01. Order Processing Time'}
                  </h3>
                  <p>
                    {isEs 
                      ? 'Todos los pedidos de ropa, gorras y accesorios oficiales de Border Built se procesan e inspeccionan dentro de 1 a 3 días hábiles desde nuestras instalaciones en El Paso, TX.'
                      : 'All orders of official Border Built apparel, caps, and accessories are processed and quality-checked within 1-3 business days from our El Paso, TX facility.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <h3 className="text-white font-bold uppercase font-mono text-xs text-primary">
                    {isEs ? '02. Tiempos de Tránsito y Paquetería' : '02. Shipping Rates & Transit Times'}
                  </h3>
                  <p>
                    {isEs 
                      ? 'Realizamos envíos a los 48 estados contiguos de EE. UU. mediante USPS Priority Mail y UPS Ground. El tiempo estimado de entrega estándar es de 3 a 7 días hábiles después del despacho.'
                      : 'We ship across the contiguous United States via USPS Priority Mail and UPS Ground. Standard delivery transit time typically ranges between 3 to 7 business days following dispatch.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <h3 className="text-white font-bold uppercase font-mono text-xs text-primary">
                    {isEs ? '03. Rastreo en Tiempo Real' : '03. Tracking Your Order'}
                  </h3>
                  <p>
                    {isEs 
                      ? 'Tan pronto como tu paquete sea recolectado por la paquetería, recibirás un correo electrónico automático con tu número de rastreo. También puedes monitorear el estado de tu pedido en la sección "Mi Garage".'
                      : 'As soon as your package is picked up by the courier, you will receive an automated shipping confirmation email with a tracking link. You can also view your order status inside "My Garage".'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <h3 className="text-white font-bold uppercase font-mono text-xs text-primary">
                    {isEs ? '04. Envío Gratis' : '04. Free Shipping'}
                  </h3>
                  <p>
                    {isEs 
                      ? 'Ofrecemos envío estándar gratuito en todos los pedidos que superen los $100.00 USD antes de impuestos y descuentos.'
                      : 'We offer free standard shipping on all qualifying merchandise orders exceeding $100.00 USD before taxes and discounts.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: RETURNS & EXCHANGES                                 */}
        {/* ============================================================ */}
        {activeTab === 'returns' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 md:p-10 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">sync</span>
                </div>
                <div>
                  <h2 className="text-2xl font-black italic uppercase text-white">
                    {isEs ? 'Cambios y Devoluciones' : 'Returns & Exchanges'}
                  </h2>
                  <p className="text-xs font-mono text-gray-400">
                    {isEs ? 'Garantía de satisfacción y políticas de reembolso' : 'Satisfaction guarantee and exchange guidelines'}
                  </p>
                </div>
              </div>

              <div className="space-y-6 text-sm text-gray-300 leading-relaxed font-normal">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <h3 className="text-white font-bold uppercase font-mono text-xs text-primary">
                    {isEs ? '01. Plazo de Devolución de 30 Días' : '01. 30-Day Return Window'}
                  </h3>
                  <p>
                    {isEs 
                      ? 'Aceptamos devoluciones de prendas de vestir y accesorios sin usar, sin lavar y con sus etiquetas y empaques originales intactos dentro de los 30 días posteriores a la fecha de entrega.'
                      : 'We accept returns on unworn, unwashed apparel and accessories with original tags and packaging intact within 30 days from delivery date.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 p-4 rounded-xl space-y-2">
                  <h3 className="font-bold uppercase font-mono text-xs flex items-center gap-2">
                    <span>⚠️</span>
                    {isEs ? 'Aviso Importante Sobre Entradas al Sorteo' : 'Important Sweepstakes Entry Notice'}
                  </h3>
                  <p className="text-xs leading-relaxed">
                    {isEs 
                      ? 'Dado que las compras en Border Built generan boletos oficiales para el sorteo del vehículo activo, cualquier devolución y reembolso monetario total anulará de forma automática las entradas promocionales otorgadas con dicha orden para garantizar la legalidad y transparencia del concurso.'
                      : 'Because merchandise purchases generate official entries into active vehicle sweepstakes, any approved return resulting in a full monetary refund will automatically void and revoke the entries generated by that purchase to maintain the legal integrity of the promotion.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <h3 className="text-white font-bold uppercase font-mono text-xs text-primary">
                    {isEs ? '02. Artículos Dañados o Defectuosos' : '02. Damaged or Defective Items'}
                  </h3>
                  <p>
                    {isEs 
                      ? 'Si recibes un artículo con algún defecto de fábrica o daño de paquetería, contáctanos a support@border-built.com con fotos del producto dentro de los 7 días posteriores a su recepción para enviarte un reemplazo gratuito de inmediato sin afectar tus entradas.'
                      : 'If you receive a defective or damaged product, email support@border-built.com with photo evidence within 7 days of delivery. We will immediately ship an exact replacement at zero cost, without affecting your giveaway entries.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <h3 className="text-white font-bold uppercase font-mono text-xs text-primary">
                    {isEs ? '03. Cómo Iniciar un Cambio' : '03. How to Initiate a Return or Exchange'}
                  </h3>
                  <p>
                    {isEs 
                      ? 'Envía un correo electrónico a support@border-built.com con tu número de orden (#BB-XXXXX) y el motivo del cambio o devolución. Nuestro equipo de soporte responderá con las instrucciones y la guía de envío.'
                      : 'Send an email to support@border-built.com containing your order number (#BB-XXXXX) and the reason for return/exchange. Our support team will respond within 24-48 hours with return shipping instructions.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: PREVENT SCAMS                                        */}
        {/* ============================================================ */}
        {activeTab === 'scams' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 md:p-10 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <span className="material-symbols-outlined">security</span>
                </div>
                <div>
                  <h2 className="text-2xl font-black italic uppercase text-white">
                    {isEs ? 'Prevención de Estafas' : 'Prevent Scams & Impersonators'}
                  </h2>
                  <p className="text-xs font-mono text-gray-400">
                    {isEs ? 'Aprende a identificar cuentas oficiales y protegerte de fraudes' : 'How to identify official Border Built channels and avoid fraud'}
                  </p>
                </div>
              </div>

              <div className="space-y-6 text-sm text-gray-300 leading-relaxed font-normal">
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 space-y-2">
                  <h3 className="font-bold uppercase font-mono text-xs flex items-center gap-2">
                    <span>🛑</span>
                    {isEs ? 'BORDERBUILT NUNCA HARÁ LO SIGUIENTE:' : 'BORDERBUILT WILL NEVER:'}
                  </h3>
                  <ul className="list-disc list-inside text-xs space-y-1 ml-1 text-gray-200">
                    <li>{isEs ? 'NUNCA te enviaremos mensajes privados diciendo "¡Felicidades, ganaste!" pidiéndote dinero para pagar impuestos, envío o trámites.' : 'NEVER send you direct messages claiming "Congratulations, you won!" asking for money to cover taxes, processing, or shipping fees.'}</li>
                    <li>{isEs ? 'NUNCA te solicitaremos pagos por Zelle, CashApp, Venmo, PayPal Amigos, transferencias bancarias o tarjetas de regalo.' : 'NEVER ask for payment via Zelle, CashApp, Venmo, wire transfer, cryptocurrency, or gift cards to release a prize.'}</li>
                    <li>{isEs ? 'NUNCA te pediremos contraseñas o números completos de tarjetas de crédito por mensaje de WhatsApp, Instagram o Facebook.' : 'NEVER ask for your login passwords or credit card numbers via direct messaging or social media.'}</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <h3 className="text-white font-bold uppercase font-mono text-xs text-primary">
                    {isEs ? 'Canales Oficiales Únicos' : 'Official Verified Channels'}
                  </h3>
                  <p>
                    {isEs 
                      ? 'Nuestra única página web oficial de compras y sorteos es: border-built.com. Revisa siempre la barra de direcciones de tu navegador antes de ingresar datos.'
                      : 'Our only official website for giveaways and merchandise is border-built.com. Always verify the address in your browser before entering sensitive information.'}
                  </p>
                  <p className="text-xs font-mono text-gray-400 mt-2">
                    Email: support@border-built.com | Instagram: @borderbuilt | TikTok: @borderbuilt
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <h3 className="text-white font-bold uppercase font-mono text-xs text-primary">
                    {isEs ? '¿Cómo se Contacta al Ganador Real?' : 'How the Real Winner is Contacted'}
                  </h3>
                  <p>
                    {isEs 
                      ? 'El sorteo se transmite en vivo en redes sociales. El ganador seleccionado al azar por la entidad verificadora es contactado formalmente por llamada telefónica y correo electrónico oficial registrado en su orden. No se le cobra un solo centavo para recibir su vehículo.'
                      : 'The drawing is conducted and verified by an independent administrator and broadcasted live. The official winner is contacted directly via phone call and registered email. Winners are NEVER asked to pay fees to claim their prize.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: TERMS OF SERVICE                                     */}
        {/* ============================================================ */}
        {activeTab === 'terms' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 md:p-10 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <div>
                  <h2 className="text-2xl font-black italic uppercase text-white">
                    {isEs ? 'Términos y Condiciones' : 'Terms & Conditions'}
                  </h2>
                  <p className="text-xs font-mono text-gray-400">
                    {isEs ? 'Términos generales de uso de la plataforma' : 'General terms of website use and transactions'}
                  </p>
                </div>
              </div>

              <div className="space-y-6 text-sm text-gray-300 leading-relaxed font-normal">
                <p>
                  {isEs 
                    ? 'Al acceder y utilizar el sitio web border-built.com, aceptas cumplir y estar sujeto a los siguientes términos y condiciones de servicio. Si no estás de acuerdo con alguna parte de estos términos, debes abstenerte de utilizar la plataforma.'
                    : 'By accessing and utilizing border-built.com, you agree to comply with and be legally bound by these terms of service. If you disagree with any portion of these terms, please discontinue use of the site.'}
                </p>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <h3 className="text-white font-bold uppercase font-mono text-xs text-primary">
                    {isEs ? 'Uso de la Cuenta' : 'Account Responsibility'}
                  </h3>
                  <p>
                    {isEs 
                      ? 'Eres responsable de mantener la confidencialidad de tus credenciales de acceso y de restringir el acceso a tu computadora o dispositivo móvil. Aceptas asumir la responsabilidad de todas las actividades realizadas bajo tu cuenta.'
                      : 'You are responsible for maintaining the confidentiality of your account credentials. You agree to accept responsibility for all activities that occur under your account.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <h3 className="text-white font-bold uppercase font-mono text-xs text-primary">
                    {isEs ? 'Precios y Disponibilidad' : 'Pricing & Inventory'}
                  </h3>
                  <p>
                    {isEs 
                      ? 'Todos los precios están expresados en dólares estadounidenses (USD). Border Built se reserva el derecho de modificar precios, descontinuar productos o corregir errores tipográficos en cualquier momento sin previo aviso.'
                      : 'All prices are stated in United States Dollars (USD). Border Built reserves the right to modify pricing, discontinue items, or correct typographical errors at any time without prior notice.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <h3 className="text-white font-bold uppercase font-mono text-xs text-primary">
                    {isEs ? 'Jurisdicción Legal' : 'Governing Law'}
                  </h3>
                  <p>
                    {isEs 
                      ? 'Estos términos se rigen e interpretan de acuerdo con las leyes del Estado de Texas y los Estados Unidos de América, sin dar efecto a ningún principio de conflictos de leyes.'
                      : 'These terms and conditions are governed by and construed in accordance with the laws of the State of Texas and the United States of America.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 6: PRIVACY POLICY                                       */}
        {/* ============================================================ */}
        {activeTab === 'privacy' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 md:p-10 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <div>
                  <h2 className="text-2xl font-black italic uppercase text-white">
                    {isEs ? 'Política de Privacidad' : 'Privacy Policy'}
                  </h2>
                  <p className="text-xs font-mono text-gray-400">
                    {isEs ? 'Protección y uso de tus datos personales' : 'How we collect, protect, and handle your data'}
                  </p>
                </div>
              </div>

              <div className="space-y-6 text-sm text-gray-300 leading-relaxed font-normal">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <h3 className="text-white font-bold uppercase font-mono text-xs text-primary">
                    {isEs ? 'Información que Recopilamos' : 'Information We Collect'}
                  </h3>
                  <p>
                    {isEs 
                      ? 'Recopilamos información necesaria para procesar tus pedidos y registrar tus participaciones en el sorteo: nombre completo, dirección de envío, dirección de correo electrónico y número de teléfono.'
                      : 'We collect personal information required to fulfill your orders and register your giveaway entries: full name, shipping address, email address, and phone number.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <h3 className="text-white font-bold uppercase font-mono text-xs text-primary">
                    {isEs ? 'Seguridad en los Pagos con Stripe' : 'Payment Security with Stripe'}
                  </h3>
                  <p>
                    {isEs 
                      ? 'Toda transacción con tarjeta de crédito/débito se procesa mediante Stripe con cifrado bancario SSL de 256 bits. Border Built nunca almacena ni tiene acceso a tus números completos de tarjeta de crédito o códigos de seguridad.'
                      : 'All credit and debit card transactions are securely handled via Stripe utilizing 256-bit bank-level SSL encryption. Border Built never stores or accesses your complete payment card credentials.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <h3 className="text-white font-bold uppercase font-mono text-xs text-primary">
                    {isEs ? 'No Venta de Datos a Terceros' : 'We Never Sell Your Data'}
                  </h3>
                  <p>
                    {isEs 
                      ? 'No vendemos, rentamos ni comercializamos tu información personal a empresas de publicidad de terceros. Tus datos se utilizan estrictamente para el envío de productos, confirmación de pedidos y auditorías legales del sorteo.'
                      : 'We do not sell, trade, or rent personal data to third-party marketing companies. Information is used exclusively for order delivery, customer communications, and sweepstakes compliance verification.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer stamp */}
        <div className="border-t border-white/10 pt-6 mt-12 text-center">
          <p className="text-gray-600 text-[10px] font-mono uppercase tracking-widest">
            BORDERBUILT LLC © {new Date().getFullYear()} - El Paso, TX / Cd. Juárez, CHIH
          </p>
          <p className="text-gray-600 text-[10px] font-mono mt-1">
            Questions? Contact: support@border-built.com
          </p>
        </div>

      </main>
    </PageTransition>
  );
};

export default Legal;
