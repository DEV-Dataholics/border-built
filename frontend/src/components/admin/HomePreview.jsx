import React from 'react';

// Auxiliar component for detailed car feature breakdown
const Feature = ({ title, desc, img, reverse }) => (
  <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-4 items-center py-4 border-b border-white/5 last:border-0`}>
    <div className="w-full md:w-1/2 aspect-video rounded-sm overflow-hidden border border-white/10 relative shrink-0">
      <div
        className="w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url('${img || '/images/nissan-350z-tokyo-garage.png'}')` }}
      ></div>
    </div>
    <div className="w-full md:w-1/2 flex flex-col gap-1 text-left min-w-0">
      <h3 className="text-sm md:text-base font-black italic uppercase text-white leading-tight break-words [overflow-wrap:anywhere]">
        <span className="text-primary block text-[8px] not-italic font-mono mb-0.5 tracking-[0.2em]">BUILD HIGHLIGHT // BORDERBUILT</span>
        {title || 'Título del bloque'}
      </h3>
      <p className="text-gray-400 font-medium text-[10px] md:text-xs leading-relaxed break-words [overflow-wrap:anywhere]">{desc || 'Descripción del bloque...'}</p>
    </div>
  </div>
);

const HomePreview = ({ formData }) => {
  const heroImage = formData.heroImage || '/images/nissan-350z-tokyo-garage.png';
  const heroSubtitle = formData.heroSubtitle || 'Bad Choices make good stories';
  const heroHeadline = formData.heroHeadline || 'WIN THIS CAR';
  const heroBadgeEvent = formData.heroBadgeEvent || 'LIMITED EVENT';
  const heroBadgeReqid = formData.heroBadgeReqid || '#FF-350Z';

  const carMake = formData.carMake || 'Nissan';
  const carModel = formData.carModel || '350Z (Tokyo Drift)';
  const carEngine = formData.carEngine || 'VQ35DE Twin-Turbo';
  const carHorsepower = formData.carHorsepower || '460 WHP';
  const carColor = formData.carColor || 'VeilSide Charcoal';

  const specTitle = formData.specTitle || 'FICHA TÉCNICA DEL PROYECTO';
  const specSubtitle = formData.specSubtitle || 'SPEC SHEET // 350Z VEILSIDE // EDITION V.26';

  const breakdownBlocks = formData.breakdownBlocks || [];

  const scarcityTitle = formData.scarcityTitle || 'Stock Limitado';
  const scarcityHeadline = formData.scarcityHeadline || 'Mystery Boxes';
  const scarcitySubheadline = formData.scarcitySubheadline || 'Casi Agotadas';
  const scarcityProductTitle = formData.scarcityProductTitle || 'Compra Misteriosa';
  const scarcityProductDesc = formData.scarcityProductDesc || 'Incluye 500 entradas + Merch exclusiva';
  const scarcityPercentSold = formData.scarcityPercentSold ?? 85;

  const prizeCost = parseFloat(formData.prizeCost || 50000);

  return (
    <div className="w-full bg-[#0a0a0a] text-white rounded-lg overflow-hidden border border-white/10 shadow-2xl pointer-events-none select-none origin-top text-[11px] scale-90 sm:scale-95 transition-all">
      {/* Header Mock */}
      <div className="bg-black/90 px-4 py-2 border-b border-white/10 flex items-center justify-between">
        <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">[ PREVIEW EN VIVO ]</span>
        <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
      </div>

      {/* Hero Section Preview */}
      <div className="w-full relative overflow-hidden bg-black border-b border-primary/20">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-85"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 90%, #0a0a0a 100%), url("${heroImage}")`,
          }}
        />
        <div className="relative z-10 p-4 flex flex-col gap-4">
          <div className="w-full flex flex-col items-center text-center border-b border-white/10 pb-2">
            <img 
              src="/images/Variation metallic effect.png" 
              alt="BORDERBUILT" 
              className="w-32 object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
            />
            <p className="text-white text-[8px] font-bold tracking-[0.25em] uppercase font-mono mt-1">
              {heroSubtitle}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="bg-primary text-black font-mono font-black text-[8px] tracking-wider px-2 py-0.5 uppercase rounded-sm">
                {heroBadgeEvent}
              </span>
              <span className="bg-black/80 text-white font-mono border border-primary/40 text-[8px] px-2 py-0.5 uppercase rounded-sm">
                REQ ID: {heroBadgeReqid}
              </span>
            </div>

            <h1 className="text-white text-2xl font-black italic uppercase leading-none tracking-tighter">
              {heroHeadline}<br />
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400 font-extrabold">
                {carMake} {carModel}
              </span>
            </h1>

            <div className="inline-flex items-center gap-1 bg-red-600/90 text-white font-mono font-black text-[9px] px-2.5 py-1 rounded w-max">
              <span className="material-symbols-outlined text-[11px]">payments</span>
              <span>+ ${prizeCost.toLocaleString()} USD VALOR DE PREMIO</span>
            </div>

            {/* Specs HUD */}
            <div className="grid grid-cols-3 gap-2 bg-black/80 border border-white/10 p-2 rounded text-center">
              <div>
                <p className="text-[7px] text-gray-500 font-mono uppercase font-bold">Motor</p>
                <p className="text-white text-[9px] font-mono font-bold leading-tight truncate">{carEngine}</p>
              </div>
              <div>
                <p className="text-[7px] text-gray-500 font-mono uppercase font-bold">Potencia</p>
                <p className="text-white text-[9px] font-mono font-bold leading-tight truncate">{carHorsepower}</p>
              </div>
              <div>
                <p className="text-[7px] text-gray-500 font-mono uppercase font-bold">Color</p>
                <p className="text-white text-[9px] font-mono font-bold leading-tight truncate">{carColor}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ficha Técnica Preview */}
      <div className="p-4 border-b border-white/5">
        <div className="text-left mb-3 border-l-2 border-primary pl-2">
          <h3 className="text-white font-mono text-[10px] uppercase font-bold">{specTitle}</h3>
          <p className="text-gray-500 text-[8px] uppercase font-mono">{specSubtitle}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/5 p-2 rounded border border-white/10">
            <span className="text-[8px] text-gray-500 uppercase block font-mono">Modelo</span>
            <span className="text-white font-mono text-[10px] font-black italic">{carMake} {carModel}</span>
          </div>
          <div className="bg-white/5 p-2 rounded border border-white/10">
            <span className="text-[8px] text-gray-500 uppercase block font-mono">Motor</span>
            <span className="text-white font-mono text-[10px] font-black italic">{carEngine}</span>
          </div>
        </div>
      </div>

      {/* Scarcity Banner Preview */}
      <div className="bg-[#111] p-3 border-y border-white/5 flex flex-col gap-2 min-w-0">
        <div className="min-w-0">
          <span className="text-primary text-[8px] font-mono uppercase font-bold block truncate">{scarcityTitle}</span>
          <p className="text-white text-xs font-black uppercase italic leading-tight break-words [overflow-wrap:anywhere]">
            {scarcityHeadline} <span className="text-white/50">{scarcitySubheadline}</span>
          </p>
        </div>
        <div className="bg-black/60 border border-primary/30 p-2 rounded flex items-center gap-2 min-w-0">
          <span className="text-lg shrink-0">🎁</span>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-[9px] break-words [overflow-wrap:anywhere]">{scarcityProductTitle}</p>
            <p className="text-gray-400 text-[8px] font-mono break-words [overflow-wrap:anywhere]">{scarcityProductDesc}</p>
            <div className="w-full bg-gray-800 h-1 rounded-full mt-1 overflow-hidden">
              <div className="bg-red-500 h-full" style={{ width: `${scarcityPercentSold}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Blocks Preview */}
      <div className="p-4">
        <div className="text-left mb-3 border-l-2 border-primary pl-2">
          <h3 className="text-white font-mono text-[10px] uppercase font-bold">DESGLOSE DEL PROYECTO</h3>
          <p className="text-gray-500 text-[8px] uppercase font-mono">SPECS & HIGHLIGHTS ({breakdownBlocks.length} BLOQUES)</p>
        </div>
        <div className="flex flex-col gap-2">
          {breakdownBlocks.length > 0 ? (
            breakdownBlocks.map((block, idx) => (
              <Feature
                key={idx}
                title={block.title}
                desc={block.description}
                img={block.image_url}
                reverse={idx % 2 !== 0}
              />
            ))
          ) : (
            <p className="text-gray-600 font-mono text-[9px] italic text-center py-4">No hay bloques agregados aún</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePreview;
