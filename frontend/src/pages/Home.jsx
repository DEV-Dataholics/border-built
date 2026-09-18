import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import CountdownTimer from '../components/CountdownTimer';
import ProgressBar from '../components/features/ProgressBar';
import QuickEntriesSection from '../components/features/QuickEntriesSection';
import { useGiveawayStore } from '../stores/useGiveawayStore';
import { useTranslation } from '../i18n/useTranslation';
import PageTransition from '../components/layout/PageTransition';

// Auxiliar component for detailed car feature breakdown
const Feature = ({ title, desc, img, reverse, lang }) => (
  <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-6 items-center py-8 border-b border-white/5 last:border-0`}>
    <div className="w-full md:w-1/2 aspect-video rounded-sm overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/10 group relative shrink-0">
      <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div
        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url('${img || '/images/products/placeholder.webp'}')` }}
      ></div>
    </div>
    <div className="w-full md:w-1/2 flex flex-col gap-2 text-left min-w-0">
      <h3 className="text-xl md:text-2xl font-black italic uppercase text-white leading-tight break-words [overflow-wrap:anywhere]">
        <span className="text-primary block text-[10px] sm:text-xs not-italic font-mono mb-1 tracking-[0.2em]">{lang === 'es' ? 'DESTACADO' : 'BUILD HIGHLIGHT'} // BORDERBUILT</span>
        {title}
      </h3>
      <p className="text-gray-400 font-medium text-xs md:text-sm leading-relaxed break-words [overflow-wrap:anywhere]">{desc}</p>
    </div>
  </div>
);

// Default breakdown blocks (fallback when CMS data is empty)
const defaultBreakdownBlocks = [
  {
    title: 'Motor VQ35DE Twin-Turbo',
    description: 'El corazón del Z33. Alimentado por un kit de doble turbo APEXi ajustado a precisión para entregar 460 caballos directos a las ruedas traseras. Una respuesta de aceleración instantánea y sonido agresivo.',
    image_url: '/images/gtr-engine.jpg',
  },
  {
    title: 'Interior Racing',
    description: 'Cabina simplificada y funcional. Asientos de cubo Sparco con arneses de seguridad de 5 puntos, jaula antivuelco VeilSide homologada y volante de carreras Nardi de liberación rápida.',
    image_url: '/images/gtr-interior.jpg',
  },
  {
    title: 'Rines & Frenos',
    description: 'Rines Work Equip clásicos de 3 piezas en bronce y garganta profunda, montados en neumáticos deportivos Nitto de alta tracción, con frenos Brembo sobredimensionados.',
    image_url: '/images/gtr-wheels.jpg',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  const { activeGiveaway, loadGiveaways } = useGiveawayStore();

  // Always re-fetch the active giveaway on mount so the Home reflects
  // the latest active giveaway even when localStorage is stale.
  useEffect(() => {
    loadGiveaways();
  }, []);

  // CMS-driven values with fallbacks
  const heroImage = activeGiveaway?.hero_image || '/images/nissan-350z-tokyo-garage.png';
  const heroSubtitle = (lang === 'es' && activeGiveaway?.hero_subtitle_es) ? activeGiveaway.hero_subtitle_es : (activeGiveaway?.hero_subtitle || (lang === 'es' ? 'Malas decisiones hacen buenas historias' : 'Bad choices make good stories'));
  const heroHeadline = (lang === 'es' && activeGiveaway?.hero_headline_es) ? activeGiveaway.hero_headline_es : (activeGiveaway?.hero_headline || (lang === 'es' ? 'GANA ESTE AUTO' : 'WIN THIS CAR'));
  const heroBadgeEvent = (lang === 'es' && activeGiveaway?.hero_badge_event_es) ? activeGiveaway.hero_badge_event_es : (activeGiveaway?.hero_badge_event || (lang === 'es' ? 'EVENTO LIMITADO' : 'LIMITED EVENT'));
  const heroBadgeReqid = activeGiveaway?.hero_badge_reqid || '#FF-350Z';

  // Car specs from CMS (new flat fields) with fallbacks from legacy nested car object
  const carMake = activeGiveaway?.car_make || activeGiveaway?.car?.make || 'Nissan';
  const carModel = activeGiveaway?.car_model || activeGiveaway?.car?.model || '350Z (Tokyo Drift)';
  const carEngine = activeGiveaway?.car_engine || activeGiveaway?.car?.engine || 'VQ35DE Twin-Turbo';
  const carHorsepower = activeGiveaway?.car_horsepower || activeGiveaway?.car?.horsepower || '460 WHP';
  const carColor = activeGiveaway?.car_color || activeGiveaway?.car?.color || 'VeilSide Charcoal';
  const carLocation = activeGiveaway?.car?.location || 'El Paso / Juárez';

  // Spec sheet section titles
  const specTitle = lang === 'es'
    ? (activeGiveaway?.spec_title_es || 'FICHA TÉCNICA DEL PROYECTO')
    : (activeGiveaway?.spec_title || 'PROJECT SPEC SHEET');
  const specSubtitle = lang === 'es'
    ? (activeGiveaway?.spec_subtitle_es || '350Z BLANCO PERLA / INTERIOR PERSONALIZADO / ESCAPE DOBLE')
    : (activeGiveaway?.spec_subtitle || 'SPEC SHEET // 350Z VEILSIDE // EDITION V.26');

  // Breakdown blocks (dynamic from CMS or fallback)
  const breakdownBlocks = (activeGiveaway?.breakdown_blocks && activeGiveaway.breakdown_blocks.length > 0)
    ? activeGiveaway.breakdown_blocks.map((block, idx) => ({
        ...block,
        image_url: block.image_url || defaultBreakdownBlocks[idx]?.image_url || '/images/products/placeholder.webp'
      }))
    : defaultBreakdownBlocks;

  // Scarcity banner
  const scarcityTitle = lang === 'es' 
    ? (activeGiveaway?.scarcity_title_es || 'Stock Limitado')
    : (activeGiveaway?.scarcity_title || 'Limited Stock');
  const scarcityHeadline = lang === 'es' 
    ? (activeGiveaway?.scarcity_headline_es || 'Cajas Misteriosas')
    : (activeGiveaway?.scarcity_headline || 'Mystery Boxes');
  const scarcitySubheadline = lang === 'es' 
    ? (activeGiveaway?.scarcity_subheadline_es || 'Casi Agotadas')
    : (activeGiveaway?.scarcity_subheadline || 'Almost Sold Out');
  const scarcityProductTitle = lang === 'es' 
    ? (activeGiveaway?.scarcity_product_title_es || 'Caja Misteriosa')
    : (activeGiveaway?.scarcity_product_title || 'Mystery Box');
  const scarcityProductDesc = lang === 'es' 
    ? (activeGiveaway?.scarcity_product_desc_es || 'Merch exclusiva + 500 entradas')
    : (activeGiveaway?.scarcity_product_desc || 'Exclusive merch + 500 entries');
  const scarcityPercentSold = activeGiveaway?.scarcity_percent_sold ?? 85;

  const specs = [
    { label: t('specs.makeModel'), value: `${carMake} ${carModel}` },
    { label: t('specs.engine'), value: carEngine },
    { label: t('specs.hpOutput'), value: carHorsepower },
    { label: t('specs.location'), value: carLocation },
  ];

  // Break-even math for progress bar
  const prizeCost = parseFloat(activeGiveaway?.prize_cost || 0);
  const averageMargin = parseFloat(activeGiveaway?.average_margin || 0.25);
  const currentRevenue = parseFloat(activeGiveaway?.current_revenue || 0);
  const multiplier = parseInt(activeGiveaway?.active_multiplier || 10);
  const targetRevenue = prizeCost / averageMargin;
  const currentEntries = currentRevenue * multiplier;
  const targetEntries = targetRevenue * multiplier;
  const progressPercent = targetRevenue > 0 ? Math.min((currentRevenue / targetRevenue) * 100, 100) : 0;

  return (
    <PageTransition className="flex-1 flex flex-col pb-24 md:pb-8 bg-carbon-pattern min-h-screen">
      <Header />

      {/* Refreshed Marketing Hero Section */}
      <div className="w-full relative overflow-hidden bg-black border-b border-primary/20">
        {/* Background Image with Overlays */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-85 scale-105 transition-transform duration-[10000ms] hover:scale-100"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 90%, #0a0a0a 100%), url("${heroImage}")`,
          }}
        />
        
        {/* Tech grid overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(0, 255, 0, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 0, 0.08) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        {/* Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-10 md:pt-12 pb-12 md:pb-16 flex flex-col gap-6 min-h-[500px] md:min-h-[550px]">
          
          {/* Giant Center Logo & Subtitle */}
          <div className="w-full flex flex-col items-center text-center border-b border-white/10 pb-4 animate-pulse-slow">
            <img 
              src="/images/Variation metallic effect.png" 
              alt="BORDERBUILT" 
              className="w-full max-w-xs sm:max-w-md md:max-w-lg object-contain filter drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]"
            />
            <p className="text-white text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.35em] uppercase font-mono mt-3">
              {heroSubtitle}
            </p>
          </div>

          {/* Lower Grid: Copy & HUD */}
          <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-8 w-full">
            {/* Left Column: Marketing Info */}
            <div className="flex-1 flex flex-col items-center lg:items-start gap-4 text-center lg:text-left">
              {/* Tech Badges */}
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2">
                <span className="bg-primary text-black font-mono font-black text-[10px] tracking-[0.2em] px-3 py-1.5 uppercase rounded-sm animate-pulse-slow">
                  {heroBadgeEvent}
                </span>
                <span className="bg-black/80 text-white font-mono border border-primary/40 text-[10px] tracking-widest px-3 py-1.5 uppercase rounded-sm">
                  {t('hero.reqId')}: {heroBadgeReqid}
                </span>
              </div>

              {/* Big Headline */}
              <h1 className="text-white text-5xl sm:text-6xl font-black italic uppercase leading-[0.95] tracking-tighter drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
                {heroHeadline}<br />
                <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400 font-extrabold pr-6 pb-2 -mr-6">
                  {carMake && !carModel.toLowerCase().includes(carMake.toLowerCase()) ? `${carMake} ${carModel}` : carModel}
                </span>
              </h1>

              {/* Cash Prize Badge — automatic from prize_cost */}
              <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-mono font-black text-xs md:text-sm px-4 py-2.5 border border-red-500/30 shadow-lg transform -skew-x-6">
                <span className="material-symbols-outlined text-sm md:text-base animate-pulse">payments</span>
                <span className="tracking-wider">+ ${prizeCost > 0 ? prizeCost.toLocaleString() : '0'} USD {lang === 'es' ? 'VALOR DE PREMIO' : 'PRIZE VALUE'}</span>
              </div>

              
              {/* Quick Specs HUD inside Hero */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-3 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-sm w-full max-w-md shadow-2xl text-center sm:text-left">
                <div className="sm:border-r sm:border-white/10 sm:pr-3">
                  <p className="text-[9px] text-gray-500 font-mono uppercase font-bold tracking-widest">{lang === 'es' ? 'Motor' : 'Engine'}</p>
                  <p className="text-white text-xs font-mono font-bold leading-tight break-words">{carEngine}</p>
                </div>
                <div className="sm:border-r sm:border-white/10 sm:px-3">
                  <p className="text-[9px] text-gray-500 font-mono uppercase font-bold tracking-widest">{lang === 'es' ? 'Potencia' : 'Power'}</p>
                  <p className="text-white text-xs font-mono font-bold leading-tight break-words">{carHorsepower}</p>
                </div>
                <div className="sm:pl-3">
                  <p className="text-[9px] text-gray-500 font-mono uppercase font-bold tracking-widest">{lang === 'es' ? 'Color' : 'Color'}</p>
                  <p className="text-white text-xs font-mono font-bold leading-tight break-words">{carColor}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Giveaway HUD Card */}
            <div className="w-full lg:w-auto shrink-0 flex flex-col gap-4">
              <div className="bg-black/75 backdrop-blur-md border border-primary/20 p-6 rounded-sm w-full lg:w-[340px] shadow-[0_0_40px_rgba(106,244,37,0.15)] flex flex-col gap-5">
                <div className="text-center pb-2 border-b border-white/5">
                  <h3 className="text-gray-400 font-mono text-[10px] uppercase tracking-[0.25em]">{lang === 'es' ? 'PROGRESO DEL SORTEO' : 'GIVEAWAY PROGRESS'}</h3>
                </div>
                
                {activeGiveaway && (
                  <ProgressBar
                    current={currentEntries}
                    max={targetEntries}
                    label={`${progressPercent.toFixed(0)}% ${lang === 'es' ? 'entradas proyectadas' : 'projected entries'}`}
                    className="w-full"
                  />
                )}

                {/* Action Area */}
                <button
                  onClick={() => navigate('/shop')}
                  className="w-full bg-primary hover:bg-[#5ce020] text-black font-black uppercase text-base py-4 rounded-sm shadow-[0_0_20px_rgba(106,244,37,0.4)] hover:shadow-[0_0_30px_rgba(106,244,37,0.6)] transition-all flex items-center justify-center gap-2 group active:scale-[0.98] cursor-pointer"
                >
                  <span>{t('hero.buyAndEnter')}</span>
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">bolt</span>
                </button>

                  <div className="mt-4 text-center">
                    <button 
                      onClick={() => navigate('/legal/rules')}
                      className="text-gray-500 text-[9px] font-mono uppercase tracking-widest hover:text-primary transition-colors"
                    >
                      {lang === 'es' ? 'No es necesario realizar compra. Nulo donde esté prohibido.' : 'No Purchase Necessary. Void Where Prohibited.'}
                    </button>
                  </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Countdown Timer creating Urgency */}
      <div className="w-full bg-[#0a0a0a] border-b border-white/5 py-4">
        <CountdownTimer />
      </div>

      {/* Technical Spec Sheet Grid */}
      <div className="max-w-6xl mx-auto px-6 py-6 w-full">
        <div className="text-left mb-6 border-l-2 border-primary pl-3">
          <h3 className="text-white font-mono text-xs uppercase tracking-widest font-bold">{specTitle}</h3>
          <p className="text-gray-500 text-[10px] uppercase font-mono">{specSubtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
          {specs.map((item, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-sm flex flex-col items-start hover:border-primary/50 transition-colors group">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 group-hover:text-primary transition-colors font-mono">{item.label}</span>
              <span className="text-white font-mono text-sm font-black italic">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Entries Section (Cyberpunk Packages) */}
      <QuickEntriesSection />

      {/* Scarcity Promo Banner — CMS driven */}
      <div className="w-full bg-[#111111] border-y border-white/5 relative overflow-hidden py-10 my-8">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 10px, #fff 10px, #fff 11px)' }}></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left min-w-0">
            <h3 className="text-primary text-sm font-black italic uppercase mb-1 break-words [overflow-wrap:anywhere]">{scarcityTitle}</h3>
            <h2 className="text-white text-2xl md:text-3xl font-black uppercase italic leading-none break-words [overflow-wrap:anywhere]">
              {scarcityHeadline} <br />
              <span className="text-white/50">{scarcitySubheadline}</span>
            </h2>
          </div>
          <div className="flex-1 bg-black/60 border border-primary/30 p-4 rounded-sm flex items-center gap-4 max-w-md w-full min-w-0">
            <div className="h-12 w-12 bg-gradient-to-br from-gray-800 to-black rounded-sm flex items-center justify-center border border-white/10 shrink-0 text-2xl">
              🎁
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold uppercase italic text-xs font-display break-words [overflow-wrap:anywhere]">{scarcityProductTitle}</p>
              <p className="text-gray-400 text-[10px] font-mono break-words [overflow-wrap:anywhere]">{scarcityProductDesc}</p>
              <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden border border-white/5">
                <div className="bg-red-500 h-full" style={{ width: `${scarcityPercentSold}%` }}></div>
              </div>
              <p className="text-[9px] text-red-400 text-right mt-1 font-mono">{scarcityPercentSold}% {lang === 'es' ? 'VENDIDO' : 'SOLD'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Spec Highlights (Hype Features) — CMS driven breakdown blocks */}
      <div className="max-w-6xl mx-auto px-6 py-12 w-full border-t border-white/5">
        <div className="text-left mb-8 border-l-2 border-primary pl-3">
          <h3 className="text-white font-mono text-xs uppercase tracking-widest font-bold">{lang === 'es' ? 'DESGLOSE DEL PROYECTO' : 'PROJECT BREAKDOWN'}</h3>
          <p className="text-gray-500 text-[10px] uppercase font-mono">{lang === 'es' ? 'ESPECIFICACIONES Y CARACTERÍSTICAS DEL VEHÍCULO' : 'VEHICLE SPECS & PERFORMANCE FEATURES'}</p>
        </div>

        <div className="flex flex-col gap-4">
          {breakdownBlocks.map((block, idx) => (
            <Feature
              key={idx}
              title={lang === 'es' && block.title_es ? block.title_es : block.title}
              desc={lang === 'es' && block.description_es ? block.description_es : block.description}
              img={block.image_url}
              reverse={idx % 2 !== 0}
              lang={lang}
            />
          ))}
        </div>
      </div>

      {/* Legal Link */}
        <div className="max-w-6xl mx-auto px-6 py-12 flex justify-center border-t border-white/5 mt-12">
          <button 
            onClick={() => navigate('/legal')}
            className="text-gray-600 text-[10px] font-mono uppercase tracking-widest hover:text-primary transition-colors"
          >
            {lang === 'es' ? 'Reglas Oficiales — No requiere compra' : 'Official Rules — No Purchase Necessary'}
          </button>
        </div>

      <div className="h-10" />
    </PageTransition>
  );
};

export default Home;
