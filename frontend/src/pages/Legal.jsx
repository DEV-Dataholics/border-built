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
            {/* Header Card */}
            <div className="border-2 border-primary/40 rounded-xl p-6 relative overflow-hidden bg-[#0d0d0d] shadow-[0_0_25px_rgba(106,244,37,0.15)]">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                <span className="text-primary text-8xl font-black italic uppercase rotate-[-30deg]">
                  OFFICIAL
                </span>
              </div>
              <div className="relative z-10 text-center">
                <p className="text-primary text-[10px] font-mono uppercase tracking-[0.3em] mb-2 font-bold">
                  {isEs ? 'DOCUMENTO LEGAL OFICIAL' : 'OFFICIAL LEGAL REGULATIONS'}
                </p>
                <h1 className="text-2xl md:text-4xl font-black italic uppercase text-white mb-2 leading-tight">
                  BorderBuilt 350Z Fast &amp; Furious Sweepstakes
                </h1>
                <p className="text-primary font-mono text-sm uppercase tracking-widest font-bold">
                  {isEs ? 'REGLAS OFICIALES' : 'OFFICIAL RULES'}
                </p>
              </div>
            </div>

            {/* Mandatory Disclaimer Box */}
            <div className="bg-red-500/10 border-2 border-red-500/40 rounded-xl p-5 text-red-200 text-xs md:text-sm font-mono font-bold leading-relaxed shadow-lg">
              <p className="mb-2">
                ⚠️ {isEs 
                  ? 'NO ES NECESARIA NINGUNA COMPRA O PAGO DE DINERO PARA PARTICIPAR O GANAR ESTE SORTEO. UNA COMPRA O PAGO DE DINERO NO MEJORARÁ LAS POSIBILIDADES DE GANAR.' 
                  : 'NO PURCHASE OR PAYMENT OF MONEY IS NECESSARY TO ENTER OR WIN THIS SWEEPSTAKES. A PURCHASE OR PAYMENT OF MONEY WILL NOT IMPROVE THE CHANCES OF WINNING.'}
              </p>
              <p className="text-[11px] font-normal text-gray-300">
                {isEs 
                  ? 'El "BorderBuilt 350Z Fast & Furious Sweepstakes" (el "Sorteo") está destinado a residentes legales de los Estados Unidos de América ("EE. UU.") y se interpretará y evaluará únicamente de acuerdo con las leyes aplicables de EE. UU. y las leyes estatales correspondientes. No participe en este Sorteo si no tiene residencia principal en los EE. UU. o si no es elegible para participar de acuerdo con estas Reglas Oficiales al momento de la participación.' 
                  : 'The "BorderBuilt 350Z Fast & Furious Sweepstakes” (the “Sweepstakes”) is intended for legal residents of the United States of America (“USA”) and shall only be construed and evaluated according to applicable USA law and applicable state law. Do not enter this Sweepstakes if you do not have primary residence in the USA or are otherwise ineligible to enter in accordance with these Official Rules at the time of entry.'}
              </p>
            </div>

            {/* Structured Rules Content */}
            <div className="font-mono text-sm text-gray-300 leading-relaxed space-y-8 bg-[#121212] p-6 md:p-8 rounded-xl border border-white/10">
              
              {/* Sponsor & Administrator */}
              <section className="border-b border-white/10 pb-6">
                <h2 className="text-primary text-xs uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                  <span>▶</span> {isEs ? 'PATROCINADOR Y ADMINISTRADOR' : 'SPONSOR / ADMINISTRATOR'}
                </h2>
                <p>
                  {isEs 
                    ? 'El Sorteo es patrocinado por BorderBuilt LLC, 11394 James Watt Dr., Suite 307, El Paso, TX 79936 (el "Patrocinador") y administrado por American Sweepstakes & Promotion Co., Inc., 300 State St. Suite 402, Rochester, NY 14614 (el "Administrador").' 
                    : 'The Sweepstakes is sponsored by BorderBuilt LLC, 11394 James Watt Dr., Suite 307, El Paso, TX 79936 (the “Sponsor”) and administered by American Sweepstakes & Promotion Co., Inc., 300 State St. Suite 402, Rochester, NY 14614 (the “Administrator”).'}
                </p>
              </section>

              {/* Eligibility */}
              <section className="border-b border-white/10 pb-6">
                <h2 className="text-primary text-xs uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                  <span>▶</span> {isEs ? 'ELEGIBILIDAD' : 'ELIGIBILITY'}
                </h2>
                <p>
                  {isEs 
                    ? 'El Sorteo está abierto a residentes legales de los EE. UU. que tengan al menos dieciocho (18) años de edad o hayan alcanzado la mayoría de edad en su respectivo estado de residencia al momento de participar (los "Participantes"). El Patrocinador, el Administrador, sus respectivas compañías matrices, empleados, funcionarios, directores, subsidiarias, afiliadas, distribuidores, representantes de ventas y agencias de publicidad y promoción, así como los funcionarios, directores, agentes y empleados de cada uno de los anteriores (colectivamente, las "Partes Liberadas"), y los miembros de sus familias inmediatas (definidos como cónyuge, padres biológicos, adoptivos y padrastros, abuelos, hermanos, hijos y nietos, y cada uno de sus respectivos cónyuges, independientemente de dónde residan) o miembros del hogar (estén relacionados o no) de cualquiera de los anteriores NO son elegibles para participar en este Sorteo. La no elegibilidad o el incumplimiento de cualquiera de estas Reglas Oficiales resultará en descalificación. Nulo donde esté prohibido o restringido por ley. (Para evitar dudas, cualquier referencia en estas Reglas a los Participantes también incluirá al Participante que sea considerado el Ganador (como se define a continuación)).' 
                    : 'The Sweepstakes is open to legal residents of the USA who are at least eighteen (18) years of age or have reached the age of majority in their respective state of residence at the time of entry (the “Entrants”). The Sponsor, the Administrator, their respective parent companies, employees, officers, directors, subsidiaries, affiliates, distributors, sales representatives and advertising and promotional agencies, and the officers, directors, agents, and employees of each of the foregoing (collectively, the “Released Parties”), and members of their immediate families (defined as including spouse, biological, adoptive and step-parents, grandparents, siblings, children and grandchildren, and each of their respective spouses, regardless of where they reside) or households (whether related or not) of any of the above are NOT eligible to participate in this Sweepstakes. Non-eligibility or non-compliance with any of these Official Rules will result in disqualification. Void where prohibited or restricted by law. (For the avoidance of doubt, any references in these Rules to Entrants shall also include the Entrant who is deemed the Winner (as defined below)).'}
                </p>
              </section>

              {/* Agreement to Official Rules */}
              <section className="border-b border-white/10 pb-6">
                <h2 className="text-primary text-xs uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                  <span>▶</span> {isEs ? 'ACUERDO CON LAS REGLAS OFICIALES' : 'AGREEMENT TO OFFICIAL RULES'}
                </h2>
                <p>
                  {isEs 
                    ? 'Al participar, los Participantes aceptan cumplir y estar sujetos a estas Reglas Oficiales y a las decisiones del Patrocinador, las cuales son finales y vinculantes en todos los asuntos relacionados con el Sorteo. Ganar el Gran Premio (como se define a continuación) está condicionado al cumplimiento de todos los requisitos aquí establecidos.' 
                    : 'By participating, Entrants agree to abide by and be bound by these Official Rules and the decisions of the Sponsor, which are final and binding in all matters relating to the Sweepstakes. Winning the Grand Prize (as defined below) is contingent upon fulfilling all requirements set forth herein.'}
                </p>
              </section>

              {/* How to Enter */}
              <section className="border-b border-white/10 pb-6 space-y-4">
                <h2 className="text-primary text-xs uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                  <span>▶</span> {isEs ? 'CÓMO PARTICIPAR' : 'HOW TO ENTER'}
                </h2>
                <p className="font-semibold text-white">
                  {isEs 
                    ? 'El Sorteo comienza a las 12:00:01 a.m. EST del 11 de octubre de 2026 y finaliza a las 11:59:59 p.m. EST del 11 de marzo de 2027 ("Período del Sorteo"). La computadora de la base de datos del Patrocinador es el dispositivo oficial de control de tiempo para el Sorteo. Los tres (3) métodos de participación son los siguientes:' 
                    : 'The Sweepstakes begins at 12:00:01 a.m. EST on October 11, 2026, and ends at 11:59:59 p.m. EST on March 11, 2027 (“Sweepstakes Period”). The Sponsor’s database computer is the official time-keeping device for the Sweepstakes. Three (3) methods of entry are as follows:'}
                </p>

                {/* Method 1: Online Purchase */}
                <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5 space-y-2">
                  <h3 className="text-white font-bold text-xs uppercase tracking-wider text-primary">
                    {isEs ? '1. Compra en Línea (Online Purchase)' : '1. Online Purchase'}
                  </h3>
                  <p>
                    {isEs 
                      ? 'Durante el Período del Sorteo, los Participantes que realicen una compra a través de la tienda en línea del Patrocinador en https://www.border-built.com (el "Sitio Web") recibirán automáticamente la cantidad de entradas basada en el multiplicador de producto activo que se muestre al momento de la compra. La tasa del multiplicador de producto está sujeta a cambios durante el período del Sorteo a discreción del Patrocinador. La cantidad de entradas recibidas se basará en el monto antes de impuestos de su compra elegible, excluyendo los cargos de envío y manejo, menos cualquier descuento. A lo largo del Período del Sorteo, el Patrocinador puede anunciar Entradas de Bono en el Sitio Web y/o en sus páginas de redes sociales, oportunidades para obtener entradas adicionales ("Períodos de Entrada de Bono"). Durante el Período de Entrada de Bono, los Participantes que realicen una compra en el Sitio Web recibirán automáticamente entre dos (2) y diez (10) entradas (definidas por el Patrocinador) en el Sorteo por cada un (1) dólar entero gastado.' 
                      : 'During the Sweepstakes Period, Entrants who make a purchase through the Sponsor’s online shop at https://www.border-built.com (the “Website”) will automatically receive the number of entries based on the active product multiplier displayed at the time of purchase. The product multiplier rate is subject to change during the Sweepstakes period at the discretion of the Sponsor. The number of entries received will be based on the pre-tax amount of your eligible purchase excluding shipping/handling charges, less any discounts. Throughout the Sweepstakes Period, the Sponsor may announce Bonus Entries at the Website, and/or on its social media pages, opportunities to earn additional entries (“Bonus Entry Periods”). During the Bonus Entry Period, Entrants who make a purchase at the Website will automatically receive between two (2) and ten (10) entries (defined by Sponsor) into the Sweepstakes for each one (1) whole dollar spent.'}
                  </p>
                </div>

                {/* Method 2: In Person Purchase */}
                <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5 space-y-2">
                  <h3 className="text-white font-bold text-xs uppercase tracking-wider text-primary">
                    {isEs ? '2. Compra en Persona (In Person Purchase)' : '2. In Person Purchase'}
                  </h3>
                  <p>
                    {isEs 
                      ? 'Durante el Período del Sorteo, los Participantes que realicen una compra en persona en eventos y exhibiciones de autos participantes a los que asista el Patrocinador recibirán automáticamente una (1) entrada en el Sorteo por cada un (1) dólar entero gastado. La cantidad de entradas recibidas se basará en el monto antes de impuestos de su compra elegible, excluyendo los cargos de envío y manejo, menos cualquier descuento. A lo largo del Período del Sorteo, el Patrocinador puede anunciar Entradas de Bono en el Sitio Web y/o en sus páginas de redes sociales ("Períodos de Entrada de Bono"), recibiendo automáticamente entre dos (2) y diez (10) entradas por cada un (1) dólar entero gastado.' 
                      : 'During the Sweepstakes Period, Entrants who make a purchase in person at participating car shows and other events the Sponsor will be attending will automatically receive one (1) entry into the Sweepstakes for each one (1) whole dollar spent. The number of entries received will be based on the pre-tax amount of your eligible purchase excluding shipping/handling charges, less any discounts. Throughout the Sweepstakes Period, the Sponsor may announce Bonus Entries at the Website, and/or on its social media pages, opportunities to earn additional entries (“Bonus Entry Periods”). During the Bonus Entry Period, Entrants who make a purchase at the Website will automatically receive between two (2) and ten (10) entries (defined by Sponsor) into the Sweepstakes for each one (1) whole dollar spent.'}
                  </p>
                </div>

                {/* Fraud Notice */}
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1">
                  <span className="font-bold uppercase tracking-wider block text-amber-400">
                    ⚠️ {isEs ? 'AVISO CONTRA EL FRAUDE' : 'FRAUD WARNING'}
                  </span>
                  <p>
                    {isEs 
                      ? 'CUALQUIER ACTIVIDAD FRAUDULENTA EN RELACIÓN CON ESTE SORTEO ESTÁ ESTRICTAMENTE PROHIBIDA. ES FRAUDULENTO COMPRAR ARTÍCULOS PARA OBTENER ENTRADAS CON LA INTENCIÓN DE DEVOLVERLOS DESPUÉS DE QUE TERMINE EL SORTEO. SI EL PATROCINADOR IDENTIFICA O SOSPECHA QUE USTED PARTICIPA EN ESTA O CUALQUIER OTRA ACTIVIDAD FRAUDULENTA, SERÁ DESCALIFICADO Y SE LE PROHIBIRÁ PARTICIPAR EN CUALQUIER SORTEO POSTERIOR OFRECIDO POR EL PATROCINADOR.' 
                      : 'NOTE: ANY FRAUDULENT ACTIVITY IN CONNECTION WITH THIS SWEEPSTAKES IS STRICTLY PROHIBITED. IT IS FRAUDULENT TO PURCHASE ITEMS TO OBTAIN ENTRIES WITH THE INTENT TO RETURN THESE ITEMS AFTER THE SWEEPSTAKES ENDS. IF THE SPONSOR IDENTIFIES OR SUSPECTS THAT YOU ARE ENGAGED IN THIS OR ANY OTHER FRAUDULENT ACTIVITY, YOU WILL BE DISQUALIFIED AND BANNED FROM ANY FURTHER SWEEPSTAKES OFFERED BY THE SPONSOR.'}
                  </p>
                </div>

                {/* Method 3: Via Mail (Free Alternate Method) */}
                <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5 space-y-3">
                  <h3 className="text-white font-bold text-xs uppercase tracking-wider text-primary">
                    {isEs ? '3. Por Correo Postal - Sin Compra Necesaria (Via Mail)' : '3. Via Mail (Free Alternate Method of Entry)'}
                  </h3>
                  <p>
                    {isEs 
                      ? 'Durante el Período del Sorteo, los Participantes pueden obtener entradas para el Sorteo escribiendo a mano de forma legible, en una tarjeta o papel de 3”x 5”, su nombre completo, dirección postal completa, número de teléfono, fecha de nacimiento, dirección de correo electrónico, y enviando la tarjeta por correo en un sobre comercial #10 con el franqueo correspondiente a:' 
                      : 'During the Sweepstakes Period, Entrants can obtain Sweepstakes entries by legible hand-printing, on a 3”x 5” card or paper, their full name, complete mailing address, phone number, date of birth, email address, mailing the card in a #10 business-sized envelope, with proper postage affixed, to:'}
                  </p>
                  
                  <div className="p-3 bg-black/60 rounded border border-primary/30 text-primary font-mono text-center font-bold">
                    BorderBuilt LLC Sweepstakes<br />
                    PO Box 279<br />
                    Macedon, NY 14502-0279
                  </div>

                  <p>
                    {isEs 
                      ? 'Todas las participaciones por correo deben tener matasellos del 11 de marzo de 2027 a más tardar y recibirse antes del 16 de marzo de 2027. Cada participación por correo recibida valdrá doscientas (200) entradas al Sorteo. Si una participación por correo tiene matasellos durante un Período de Entrada de Bono, valdrá entre cuatrocientas (400) y dos mil (2,000) entradas según el nivel de Período de Bono definido en el Sitio Web. Para que las entradas de bono sean válidas, el Participante debe escribir el multiplicador correspondiente en el reverso del sobre para indicar durante qué Período de Entrada de Bono está participando. Si indica un Período que no coincide con la fecha del matasellos, será descalificada. **NOTA: La tarjeta y el sobre deben ser escritos a mano únicamente por el Participante. Cada sobre debe enviarse individualmente. No se aceptarán envíos masivos. Si no puede completar físicamente la tarjeta, alguien puede completarla en su nombre con sus datos como Participante.' 
                      : 'All mail-in entries must be postmarked by March 11, 2027, and received by March 16, 2027. Each mail-in entry received will be worth two hundred (200) Sweepstakes entries. If a mail-in entry is postmarked during a Bonus Entry Period, it will be worth between four hundred (400) and two thousand (2,000) Sweepstakes entries depending on the level of Bonus Period defined by Sponsor at the Website. In order for bonus entries to be valid, the Entrant must write the corresponding multiplier on the backside of the envelope to signify what Bonus Entry Period they are entering during. If an Entrant lists a Bonus Period that is inaccurate with the postmark date, the entry will be disqualified. **NOTE: Mail-in entry card and envelope must be hand-printed by the Entrant only. In addition, Entrants are not permitted to use any 3rd party organization to assist with the entry process in any way (as determined by the Administrator). Each Envelope must be mailed individually. Bulk shipments of entries will not be accepted. If you are unable to physically complete the 3" x 5" card, you can have someone complete the card on your behalf with your information as the Entrant. No correspondence will be acknowledged; request for confirmation of receipt of mail-in entries will not be acknowledged.'}
                  </p>
                </div>

                <p className="text-xs text-gray-400">
                  {isEs 
                    ? 'Las Partes Liberadas no son responsables por entradas tardías, incompletas, demoradas, no entregadas o mal dirigidas. Toda la información enviada será tratada de acuerdo con la Política de Privacidad del Patrocinador, disponible en https://www.border-built.com/legal?tab=privacy.' 
                    : 'The Released Parties are not responsible for late, incomplete, delayed, undelivered, or misdirected entries. All entries become the exclusive property of Sponsor and will not be acknowledged or returned except as provided herein. All information submitted by Entrants will be treated according to Sponsor’s Privacy Policy, available at https://www.border-built.com/legal?tab=privacy. By participating in the Sweepstakes and providing any personal contact information, Entrants hereby agree to Sponsor’s collection and usage of their personal information and acknowledge that they have read and accepted Sponsor’s Privacy Policy.'}
                </p>
              </section>

              {/* General Conditions */}
              <section className="border-b border-white/10 pb-6 space-y-3">
                <h2 className="text-primary text-xs uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                  <span>▶</span> {isEs ? 'CONDICIONES GENERALES' : 'GENERAL CONDITIONS'}
                </h2>
                <p>
                  {isEs 
                    ? 'Si por alguna razón la operación o administración de este Sorteo se ve afectada o no puede llevarse a cabo según lo planeado, incluyendo (i) infección por virus informáticos, errores, (ii) alteración, intervención no autorizada, (iii) fraude, (iv) fallas técnicas o (v) cualquier otra causa más allá del control del Patrocinador, el Patrocinador se reserva el derecho, a su entera discreción, de descalificar a cualquier individuo que altere el proceso de participación y de cancelar, terminar, modificar o suspender el Sorteo en su totalidad o en parte, en cualquier momento y sin previo aviso, y adjudicar el Gran Premio utilizando todas las participaciones elegibles no sospechosas recibidas.' 
                    : 'If for any reason the operation or administration of this Sweepstakes is impaired or incapable of running as planned for any reason, including but not limited to (i) infection by computer virus, bugs, (ii) tampering, unauthorized intervention, (iii) fraud, (iv) technical failures, or (v) any other causes beyond the control of the Sponsor which corrupt or affect the administration, security, fairness, integrity or proper conduct of this Sweepstakes, the Sponsor reserves the right at its sole discretion, to disqualify any individual who tampers with the entry process, and to cancel, terminate, modify or suspend the Sweepstakes in whole or in part, at any time, without notice and award the Grand Prize (defined below) using all non-suspect eligible entries received as of, or after (if applicable) this cancellation, termination, modification or suspension date, or in any manner that is fair and equitable and best conforms to the spirit of these Official Rules. Sponsor reserves the right, at its sole discretion, to disqualify any individual deemed to be tampering or attempting to tamper with the entry process or the operation of the Sweepstakes or Sponsor’s Website; or acting in violation of these Official Rules or in an unsportsmanlike or disruptive manner.'}
                </p>
                <div className="p-3 bg-red-950/30 border border-red-500/30 rounded text-red-300 text-xs">
                  <strong>{isEs ? 'PRECAUCIÓN:' : 'CAUTION:'}</strong> {isEs 
                    ? 'CUALQUIER INTENTO DE DAÑAR DELIBERADAMENTE CUALQUIER SITIO WEB O SOCAVAR EL FUNCIONAMIENTO LEGÍTIMO DEL SORTEO ES UNA VIOLACIÓN DE LAS LEYES PENALES Y CIVILES Y, DE HACERSE DICHO INTENTO, EL PATROCINADOR SE RESERVA EL DERECHO DE EXIGIR INDEMNIZACIONES POR DAÑOS Y PERJUICIOS U OTROS RECURSOS A CUALQUIERA DE DICHAS PERSONAS RESPONSABLES HASTA EL MÁXIMO PERMITIDO POR LA LEY.' 
                    : 'ANY ATTEMPT TO DELIBERATELY DAMAGE ANY WEBSITE OR UNDERMINE THE LEGITIMATE OPERATION OF THE SWEEPSTAKES IS A VIOLATION OF CRIMINAL AND CIVIL LAWS AND SHOULD SUCH AN ATTEMPT BE MADE; THE SPONSOR RESERVES THE RIGHT TO SEEK DAMAGES OR OTHER REMEDIES FROM ANY SUCH PERSON(S) RESPONSIBLE FOR THE ATTEMPT TO THE FULLEST EXTENT PERMITTED BY LAW.'}
                </div>
                <p className="text-xs text-gray-400">
                  {isEs 
                    ? 'El hecho de que el Patrocinador no haga cumplir cualquier disposición de estas Reglas Oficiales no constituirá una renuncia a dicha disposición. En caso de disputa sobre la identidad de un Ganador basada en una dirección de correo electrónico, la participación ganadora será declarada por el titular autorizado de la cuenta de correo electrónico.' 
                    : 'Failure by the Sponsor to enforce any provision of these Official Rules shall not constitute a waiver of that provision. In the event of a dispute as to the identity of a Winner based on an email address, the winning entry will be declared by the authorized account holder of the email address associated with the registration in question.'}
                </p>
              </section>

              {/* Release and Limitations of Liability */}
              <section className="border-b border-white/10 pb-6 space-y-3">
                <h2 className="text-primary text-xs uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                  <span>▶</span> {isEs ? 'LIBERACIÓN Y LIMITACIÓN DE RESPONSABILIDAD' : 'RELEASE AND LIMITATIONS OF LIABILITY'}
                </h2>
                <p>
                  {isEs 
                    ? 'Al participar en el Sorteo, los Participantes acuerdan liberar y eximir de responsabilidad a las Partes Liberadas de cualquier reclamo o causa de acción que surja de la participación en el Sorteo o la recepción o uso de cualquier Premio, incluidos: (i) errores técnicos; (ii) intervención humana no autorizada; (iii) errores de impresión; (iv) errores en la administración del Sorteo o procesamiento de entradas; o (v) lesiones, muerte o daños a personas o propiedad causados directa o indirectamente. En ningún caso las Partes Liberadas serán responsables por honorarios de abogados o daños punitivos, consecuentes, directos o indirectos.' 
                    : 'By participating in the Sweepstakes, Entrants agree to release and hold harmless the Released Parties from and against any claim or cause of action arising out of participation in the Sweepstakes or receipt or use of any Prize, including, but not limited to: (i) any technical errors that may prevent an Entrant from submitting an entry; (ii) unauthorized human intervention in the Sweepstakes; (iii) printing errors; (iv) errors in the administration of the Sweepstakes or the processing of entries; or (v) injury, death, or damage to persons or property which may be caused, directly or indirectly, in whole or in part, from Entrant’s participation in the Sweepstakes or receipt of the Prize (defined below). Released Parties assume no responsibility for any error, omission, interruption, deletion, defect, delay in operation or transmission, communications line failure, theft or destruction or unauthorized access to, or alteration of, entries. Released Parties are not responsible for any problems or technical malfunction of any telephone network or telephone lines, computer online systems, servers, or providers, computer equipment, software, failure of any email or entry to be received by Sponsor on account of technical problems, human error or traffic congestion on the Internet or at any Website, or any combination thereof, including any injury or damage to Entrant\'s or any other person\'s computer relating to or resulting from participation in this Sweepstakes or downloading any materials in this Sweepstakes. Entrants further agree that in any cause of action, the Released Parties’ liability will be limited to the cost of entering and participating in the Sweepstakes, and in no event shall the Released Parties be liable for attorney fees. Entrants waive the right to claim any damages whatsoever, including, but not limited to, punitive, consequential, direct, or indirect damages. For New Jersey Residents: nothing herein bars recovery of damages or attorneys’ fees where mandated by statute.'}
                </p>
                <p className="text-xs text-gray-400">
                  {isEs 
                    ? 'CADA PARTICIPANTE ENTIENDE Y ACEPTA QUE TODOS LOS DERECHOS BAJO LA SECCIÓN 1542 DEL CÓDIGO CIVIL DE CALIFORNIA Y CUALQUIER LEY SIMILAR DE CUALQUIER ESTADO O TERRITORIO DE EE. UU. SON EXPRESAMENTE RENUNCIADOS POR ÉL/ELLA.' 
                    : 'EACH ENTRANT UNDERSTANDS AND AGREES THAT ALL RIGHTS UNDER SECTION 1542 OF THE CIVIL CODE OF CALIFORNIA AND ANY SIMILAR LAW OF ANY STATE OR TERRITORY OF THE USA ARE HEREBY EXPRESSLY WAIVED BY HIM/HER.'}
                </p>
              </section>

              {/* Drawing and Notification */}
              <section className="border-b border-white/10 pb-6">
                <h2 className="text-primary text-xs uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                  <span>▶</span> {isEs ? 'SORTEO Y NOTIFICACIÓN' : 'DRAWING AND NOTIFICATION'}
                </h2>
                <p>
                  {isEs 
                    ? 'El posible Ganador del Gran Premio será seleccionado en un sorteo al azar realizado por el Administrador, cuyas decisiones son definitivas y vinculantes. El sorteo del Premio se llevará a cabo alrededor del 17 de marzo de 2027. Las probabilidades de ganar dependerán del número total de entradas elegibles recibidas a lo largo del Período del Sorteo. El posible Ganador será contactado por el Patrocinador o Administrador a través de teléfono, correo electrónico y/o correo postal de USPS.' 
                    : 'The potential Grand Prize Winner will be selected in a random drawing conducted by the Administrator, whose decisions are final and binding. The Prize drawing will be conducted on or about March 17, 2027. Odds of winning the Grand Prize will depend on the total number of eligible entries received throughout the Sweepstakes Period. The potential Winner will be contacted by the Sponsor or Administrator via phone, email, and/or USPS mail.'}
                </p>
              </section>

              {/* Prize Description */}
              <section className="border-b border-white/10 pb-6 space-y-3">
                <h2 className="text-primary text-xs uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                  <span>▶</span> {isEs ? 'DESCRIPCIÓN DEL PREMIO' : 'PRIZE'}
                </h2>
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <h3 className="text-white font-bold text-sm mb-1 uppercase">
                    {isEs ? '1 (Un) Gran Premio Disponible:' : 'One (1) Grand Prize Available:'}
                  </h3>
                  <p className="text-primary font-bold text-sm">
                    2005 Nissan 350Z 35th Anniversary Edition
                  </p>
                  <p className="text-xs text-gray-300 mt-2">
                    {isEs 
                      ? 'Equipado con Z1 S-Pro True Style Coilovers, alerón trasero estilo NISMO, calaveras JDM, asientos personalizados, jaula antivuelco Bull Boost Performance, sistema de escape Rev9 Nissan y pintura Pearl White. ("Premio" o "Gran Premio"). Valor Minorista Aproximado del Gran Premio ("ARV") - $10,000 USD.' 
                      : 'The Grand Prize Winner (“Winner”), upon ASC’s verification of eligibility, will receive a 2005 Nissan 350Z 35th Anniversary Edition which will contain Z1 S-Pro True Style Coilovers, NISMO-style rear wing, JDM taillights, custom seats, Bull Boost Performance Roll Cage, Rev9 Nissan Exhaust System, and Pearl White Paint. (“Prize” or “Grand Prize”). Grand Prize Approximate Retail Value (“ARV”) -$10,000.'}
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  {isEs 
                    ? 'El valor del Premio establecido anteriormente representa las determinaciones de buena fe del Patrocinador sobre el ARV del mismo. El Premio se entregará al Ganador "TAL CUAL". Cualquier mejora u otra opción correrá por cuenta exclusiva del Ganador. El Ganador debe tener comprobante de una licencia de conducir válida de EE. UU. de su estado de residencia para recibir la entrega del vehículo. El Ganador será responsable de todo el equipo opcional, título, licencia, tarifas de seguro y registro requeridos para reclamar el vehículo, los impuestos aplicables, así como todos los demás gastos relacionados con el uso del vehículo. El Ganador debe transferir el título oficialmente con el DMV de su estado dentro de los diez (10) días posteriores a la aceptación del Premio.' 
                    : 'The value of the Prize set forth above represents Sponsor’s good faith determinations of the ARV thereof and such determinations are final and binding and cannot be appealed. If the actual value of a Prize is lower than the stated ARV when the Prize is procured and fulfilled, then the difference will not be awarded. All other expenses associated with Prize acceptance or usage not specifically mentioned herein are the responsibility of the Winner. Prize will be delivered to Winner “AS IS.” Any upgrades or other options are at the sole expense of the Winner. The Winner must have proof of a valid USA driver’s license from his/her state of residence to take delivery of vehicle; failure to show same may result in Prize forfeiture and selection of an alternate Winner. The Winner will be responsible for all optional equipment, title, license, insurance and registration fees required in claiming the vehicle, applicable taxes, as well as all other expenses relating to the use of vehicle. The Winner must transfer title officially with their state DMV within ten (10) days of accepting the Prize. All other costs not specifically stated herein as being awarded are the responsibility of the Winner. The Winner may be required to show proof of insurance prior to taking delivery and pick up vehicle as directed by Sponsor. The Winner acknowledges that Sponsor has not made nor is in any manner responsible for any warranty, representation, or guarantee, express or implied, in fact or in law, relative to any prize offered in the Sweepstakes, including but not limited to its quality, mechanical condition or fitness for a particular purpose. Prize vehicle may not meet safety or emissions testing required in some states and/or counties. The Winner is responsible to check their state/county for applicable emissions requirements and safety inspection requirements prior to accepting the Prize and must use the vehicle in accordance with those regulations. No substitution or transfer of the Prize will be permitted, except by the Sponsor, who reserves the right at its sole discretion to substitute the Prize with another prize of equal or greater value.'}
                </p>
              </section>

              {/* Additional Prize Conditions */}
              <section className="border-b border-white/10 pb-6 space-y-3">
                <h2 className="text-primary text-xs uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                  <span>▶</span> {isEs ? 'CONDICIONES ADICIONALES DEL PREMIO' : 'ADDITIONAL PRIZE CONDITIONS'}
                </h2>
                <p>
                  {isEs 
                    ? 'Al aceptar el Gran Premio, el Ganador acepta liberar y eximir de responsabilidad a las Partes Liberadas de cualquier reclamo derivado de la participación o uso del Premio. El posible Ganador debe firmar y devolver al Administrador, dentro de los siete (7) días posteriores al aviso, una Declaración Jurada de Elegibilidad, Responsabilidad y Publicidad (Affidavit) y completar el formulario W9 del IRS. El Ganador debe tener en cuenta que el valor del Premio aceptado está sujeto a impuestos como ingreso, y se presentará un Formulario 1099 del IRS a nombre del Ganador por el valor del Premio.' 
                    : 'By accepting the Grand Prize, the Winner agrees to release and hold harmless the Released Parties from and against any claim or cause of action arising out of participation in the Sweepstakes or receipt or use of the Prize. The potential Winner must sign and return to the Administrator, within seven (7) days of the date of notice or attempted notice is sent, an Affidavit of Eligibility, Liability & Publicity in order to claim the Prize. The Winner may also be requested to complete an IRS W9 form. Note: The Affidavit sent to a potential Winner will require that the Winner provide their Social Security Number to the Administrator, which will be used solely for tax reporting purposes. The Winner will be responsible for all local, state, and federal taxes associated with the receipt of the prize. The Winner must note that the value of the accepted Prize is taxable as income, and an IRS Form 1099 will be filed in the name of the Winner for the value of the Prize. The Winner is solely responsible for all matters relating to the Prize after it is awarded. If a Prize or Prize notification is returned as unclaimed or undeliverable to the potential winner, if a potential Winner cannot be reached or does not comply with notification instructions within three (3) business days from the first notification attempt, if a potential Winner fails to return requisite document(s) within the specified time period, or if a potential Winner is not in compliance with these Official Rules, then such person shall be disqualified and, at Sponsor’s sole discretion, an alternate Winner may be selected.'}
                </p>
                <p className="text-xs text-gray-400">
                  {isEs 
                    ? 'Al aceptar el Premio, donde lo permita la ley, el Ganador otorga a las Partes Liberadas el derecho de imprimir, publicar, transmitir y utilizar en todo el mundo EN TODOS LOS MEDIOS sin limitación su nombre completo, fotografía, voz e información biográfica para fines publicitarios sin pago adicional.' 
                    : 'By accepting the Prize, where permitted by law, the Winner grants to the Released Parties and those acting pursuant to the authority of Sponsor and the Released Parties (which grant will be confirmed in writing upon Sponsor’s request), the right to print, publish, broadcast and use worldwide IN ALL MEDIA without limitation at any time their full name, portrait, picture, voice, likeness and/or biographical information for advertising, trade and promotional purposes without further payment or additional consideration, and without review, approval or notification. The Winner also acknowledges that Released Parties have neither made nor are in any manner responsible or liable for any warranty, representation, or guarantee, express or implied, in fact or in law, relative to the Prize. Entrants agree that Sponsor is not providing any accounting, tax or legal advice.'}
                </p>
              </section>

              {/* Disputes */}
              <section className="border-b border-white/10 pb-6">
                <h2 className="text-primary text-xs uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                  <span>▶</span> {isEs ? 'RESOLUCIÓN DE DISPUTAS' : 'DISPUTES'}
                </h2>
                <p>
                  {isEs 
                    ? 'Todas las cuestiones relativas a la validez, interpretación y aplicabilidad de estas Reglas Oficiales se regirán e interpretarán de conformidad con las leyes del Estado de Texas. Al participar, el Participante acepta que: (i) cualquier disputa se resolverá individualmente sin recurrir a ninguna forma de demanda colectiva; (ii) cualquier procedimiento judicial se llevará a cabo en un tribunal dentro del Estado de Texas; (iii) los reclamos se limitarán a los costos reales de bolsillo incurridos, sin que se otorguen honorarios de abogados; (iv) se renuncia a todos los derechos a reclamar daños punitivos, incidentales o consecuentes; y (v) los recursos del Participante se limitan a un reclamo por daños monetarios.' 
                    : 'All issues and questions concerning the construction, validity, interpretation and enforceability of these Official Rules or the rights and obligations of Entrants, Administrator, and Sponsor in connection with the Sweepstakes shall be governed by and construed in accordance with the laws of the State of Texas, without giving effect to any choice of law or conflict of law rules or provisions that would cause the application of any other state’s or jurisdiction’s laws. By participating in the Sweepstakes, Entrant agrees that: (i) any and all disputes, claims, and causes of action arising out of or in connection with the Sweepstakes, shall be resolved individually without resort to any form of class action; (ii) any judicial proceeding shall take place in a court within the State of Texas; (iii) any and all claims, judgments , and awards shall be limited to actual out-of-pocket costs incurred, including costs associated with entering this Sweepstakes, but in no event will attorney fees be awarded or recoverable; (iv) under no circumstances will Entrant be permitted to obtain awards for, and Entrant hereby waives all rights to seek, punitive, incidental, exemplary, consequential, special damages, lost profits, other damages, and/or any rights to have damages multiplied or otherwise increased; and (v) Entrant’s remedies are limited to a claim for money damages (if any) and he/she waives any right to seek injunctive or equitable relief.'}
                </p>
              </section>

              {/* Severability & Miscellaneous */}
              <section className="border-b border-white/10 pb-6 space-y-2">
                <h2 className="text-primary text-xs uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                  <span>▶</span> {isEs ? 'SEPARABILIDAD Y DIVERSOS' : 'SEVERABILITY & MISCELLANEOUS'}
                </h2>
                <p>
                  {isEs 
                    ? 'La invalidez o inaplicabilidad de cualquier disposición no afectará la validez de ninguna otra disposición. Estas Reglas Oficiales contienen el entendimiento pleno y completo con respecto al Sorteo y reemplazan todos los acuerdos anteriores.' 
                    : 'The invalidity or unenforceability of any provision of these Official Rules will not affect the validity or enforceability of any other provision. If any provision of the Official Rules is determined to be invalid or otherwise unenforceable, the other provisions will remain in effect and will be construed as if the invalid or unenforceable provision were not contained herein. These Official Rules contain the full and complete understanding with respect to the Sweepstakes and supersede all prior and contemporaneous agreements, representations, and understandings, whether oral or written.'}
                </p>
              </section>

              {/* Winners List Request */}
              <section className="space-y-2">
                <h2 className="text-primary text-xs uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                  <span>▶</span> {isEs ? 'SOLICITUD DE LA LISTA DE GANADORES' : 'WINNERS LIST REQUEST'}
                </h2>
                <p>
                  {isEs 
                    ? 'Para solicitar la confirmación del nombre de pila, inicial del apellido, ciudad y estado de residencia del Ganador, envíe un sobre tamaño comercial con franqueo pagado y su propia dirección antes del 22 de abril de 2027 a:' 
                    : 'To request confirmation of the first name, last initial, city, and state of residence of the Winner, please send a self-addressed, stamped business size envelope, by April 22, 2027, to:'}
                </p>
                <div className="p-3 bg-black/60 rounded border border-white/10 text-gray-300 font-mono text-center text-xs">
                  ASC/BorderBuilt LLC Sweepstakes Winners List Request<br />
                  300 State St. Ste. 402, Rochester, NY 14614
                </div>
                <p className="text-[11px] text-gray-500 pt-2 italic">
                  {isEs 
                    ? 'El fabricante o distribuidor del Premio ofrecido no es patrocinador ni participante en este Sorteo y no se implica ninguna asociación o respaldo.' 
                    : 'Manufacturer or distributor of the Prize offered is not a Sponsor or Entrant in this Sweepstakes and no association or endorsement is implied.'}
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
