import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import { useTranslation } from '../i18n/useTranslation';

const AboutCommunity = () => {
  const { lang } = useTranslation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=" + encodeURIComponent("https://border-built.com/qr") + "&color=6af425&bgcolor=141414&margin=10";

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://border-built.com/qr');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQr = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'borderbuilt-community-qr.png';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  const isEs = lang === 'es';

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#0a0a0a] text-white overflow-x-hidden font-sans selection:bg-primary selection:text-black">
      {/* Top Header */}
      <Header title={isEs ? 'COMUNIDAD' : 'ABOUT & COMMUNITY'} showBack={true} />

      {/* Hero Header Banner */}
      <div className="relative w-full py-16 md:py-24 border-b border-white/10 overflow-hidden bg-gradient-to-b from-[#141414] via-[#0d0d0d] to-[#0a0a0a]">
        {/* Background Grid Accent */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle, #6af425 1px, transparent 1px)', 
            backgroundSize: '32px 32px' 
          }}
        />
        
        {/* Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-primary/40 text-primary font-mono text-xs md:text-sm tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(106,244,37,0.2)]">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            EL PASO – JUÁREZ CAR CULTURE
          </span>

          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white mb-4 leading-none">
            BORDER<span className="text-primary">BUILT</span>
          </h1>

          <p className="text-gray-400 text-sm md:text-base max-w-xl font-medium">
            {isEs 
              ? 'Conectando la comunidad automotriz de la frontera a través de proyectos reales, eventos y giveaways.'
              : 'Uniting the borderland car community through authentic builds, high-octane events, and giveaways.'}
          </p>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-16 w-full space-y-16">

        {/* SECTION 1: WHAT IS BORDERBUILT? */}
        <section className="relative bg-[#121212]/90 border border-white/10 rounded-2xl p-6 md:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-3 h-8 bg-primary rounded-sm inline-block shadow-[0_0_12px_#6af425]"></span>
            <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight text-white">
              {isEs ? '¿Qué es BORDERBUILT?' : 'What is BORDERBUILT?'}
            </h2>
          </div>

          {/* User Provided Exact Description */}
          <div className="text-gray-200 text-base md:text-lg leading-relaxed font-normal space-y-4 mb-8">
            <p>
              {isEs 
                ? 'Border Built es una marca de estilo de vida y comunidad de autos en El Paso–Juárez. Construimos y exhibimos autos únicos, organizamos eventos, colaboramos con negocios locales y creamos mercancía automotriz. Nuestro objetivo es unir a la comunidad de autos y, eventualmente, brindarles la oportunidad de ganar algunos de los autos que construimos.'
                : 'Border Built is an El Paso–Juárez car community and lifestyle brand. We build and showcase unique cars, host events, collaborate with local businesses, and create automotive merchandise. Our goal is to bring the car community together and eventually give people opportunities to win some of the cars we build.'
              }
            </p>
          </div>

          {/* Community Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/40 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold group-hover:scale-110 transition-transform text-lg">
                🏎️
              </div>
              <div>
                <h4 className="text-white font-bold text-sm tracking-wide uppercase">
                  {isEs ? 'Construcciones Únicas' : 'Unique Builds'}
                </h4>
                <p className="text-gray-400 text-xs mt-1 leading-snug">
                  {isEs ? 'Autos de proyecto seleccionados y construidos al más alto nivel.' : 'Curated project cars built to the highest standard of craftsmanship.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/40 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold group-hover:scale-110 transition-transform text-lg">
                🤝
              </div>
              <div>
                <h4 className="text-white font-bold text-sm tracking-wide uppercase">
                  {isEs ? 'Alianzas Locales' : 'Local Collaborations'}
                </h4>
                <p className="text-gray-400 text-xs mt-1 leading-snug">
                  {isEs ? 'Apoyando la economía y negocios de El Paso y Cd. Juárez.' : 'Partnering with and championing local borderland businesses.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/40 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold group-hover:scale-110 transition-transform text-lg">
                🔥
              </div>
              <div>
                <h4 className="text-white font-bold text-sm tracking-wide uppercase">
                  {isEs ? 'Eventos y Meets' : 'Meets & Gatherings'}
                </h4>
                <p className="text-gray-400 text-xs mt-1 leading-snug">
                  {isEs ? 'Espacios auténticos para entusiastas de todas las marcas.' : 'Authentic spaces uniting enthusiasts across all car cultures.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/40 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold group-hover:scale-110 transition-transform text-lg">
                👕
              </div>
              <div>
                <h4 className="text-white font-bold text-sm tracking-wide uppercase">
                  {isEs ? 'Merch Automotriz' : 'Automotive Apparel'}
                </h4>
                <p className="text-gray-400 text-xs mt-1 leading-snug">
                  {isEs ? 'Prendas y accesorios premium inspirados en el motorsport.' : 'High-grade gear and accessories designed for real car enthusiasts.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: HOW DO I WIN? */}
        <section className="relative bg-[#121212]/90 border border-white/10 rounded-2xl p-6 md:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-3 h-8 bg-primary rounded-sm inline-block shadow-[0_0_12px_#6af425]"></span>
            <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight text-white">
              {isEs ? '¿Cómo gano?' : 'How do I win?'}
            </h2>
          </div>

          {/* User Provided Exact Description */}
          <div className="text-gray-200 text-base md:text-lg leading-relaxed font-normal space-y-4 mb-8">
            <p>
              {isEs 
                ? 'Construimos y preparamos un vehículo destacado, luego lanzamos un sorteo oficial para él. Durante el período de la promoción, los seguidores pueden recibir entradas comprando mercancía de Border Built, o pueden participar utilizando el método de entrada gratuita detallado en las Reglas Oficiales. Al finalizar, se selecciona un ganador al azar, se verifica y se le entrega el vehículo.'
                : 'We build and prepare a featured vehicle, then launch an official sweepstakes for it. During the promotional period, supporters can receive entries by purchasing Border Built merchandise, or they can enter using the free entry method listed in the Official Rules. At the end, a winner is selected at random, verified, and awarded the vehicle.'
              }
            </p>
          </div>

          {/* Step by step card highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="relative p-5 rounded-xl bg-black/60 border border-white/10 flex flex-col justify-between">
              <div className="text-primary font-mono text-3xl font-black italic mb-3 opacity-90">01</div>
              <h4 className="text-white font-bold text-base mb-1">
                {isEs ? 'El Auto Destacado' : 'Featured Build'}
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                {isEs 
                  ? 'Diseñado, restaurado y modificado con piezas de primera categoría.' 
                  : 'Hand-picked, tuned, and showcased for the official sweepstakes.'}
              </p>
            </div>

            <div className="relative p-5 rounded-xl bg-black/60 border border-primary/40 shadow-[0_0_15px_rgba(106,244,37,0.15)] flex flex-col justify-between">
              <div className="text-primary font-mono text-3xl font-black italic mb-3">02</div>
              <h4 className="text-white font-bold text-base mb-1">
                {isEs ? 'Recibe Entradas' : 'Get Entries'}
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                {isEs 
                  ? 'Automáticamente con cada compra de ropa o a través de la entrada gratuita sin compra.' 
                  : 'Every merchandise item earns you entries, plus free alternate method of entry available.'}
              </p>
            </div>

            <div className="relative p-5 rounded-xl bg-black/60 border border-white/10 flex flex-col justify-between">
              <div className="text-primary font-mono text-3xl font-black italic mb-3 opacity-90">03</div>
              <h4 className="text-white font-bold text-base mb-1">
                {isEs ? 'Sorteo & Entrega' : 'Random Draw & Award'}
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                {isEs 
                  ? 'Un ganador oficial es verificado y recibe las llaves del vehículo.' 
                  : 'A winner is drawn at random, legally verified, and handed the keys.'}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400 font-mono">
            <span>* {isEs ? 'Sin compra requerida. Consulta los términos completos en las ' : 'No purchase necessary. See full details in '}
              <Link to="/legal" className="text-primary underline hover:text-white transition-colors">
                {isEs ? 'Reglas Oficiales' : 'Official Rules'}
              </Link>.
            </span>
          </div>
        </section>

        {/* SECTION 3: DIRECT ACCESS & QR SHARE CARD */}
        <section className="relative bg-gradient-to-b from-[#151515] to-[#0d0d0d] border border-primary/30 rounded-2xl p-6 md:p-10 shadow-[0_0_30px_rgba(106,244,37,0.1)] text-center flex flex-col items-center">
          <span className="px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-mono tracking-widest uppercase mb-3">
            {isEs ? 'ENLACE DIRECTO Y CÓDIGO QR' : 'DIRECT LINK & QR CODE'}
          </span>
          <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight text-white mb-2">
            {isEs ? 'Comparte la Comunidad' : 'Share the Movement'}
          </h3>
          <p className="text-gray-400 text-sm max-w-md mb-8">
            {isEs 
              ? 'Escanea o comparte este enlace directo para acceder a esta información en cualquier momento.' 
              : 'Scan or copy this direct link to share Border Built with friends and fellow enthusiasts.'}
          </p>

          {/* QR Container */}
          <div className="p-4 bg-[#141414] border-2 border-primary rounded-2xl shadow-[0_0_25px_rgba(106,244,37,0.25)] mb-6 flex flex-col items-center">
            <img 
              src={qrCodeUrl} 
              alt="Border Built QR Code" 
              className="w-48 h-48 md:w-56 md:h-56 rounded-lg object-contain"
            />
            <div className="mt-3 text-primary font-mono text-[11px] tracking-widest uppercase">
              border-built.com/qr
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
            <button
              onClick={handleCopyLink}
              className="flex-1 min-w-[140px] px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-bold text-xs uppercase tracking-wider text-white transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {copied ? '✓ ' + (isEs ? 'Copiado!' : 'Copied!') : (isEs ? 'Copiar Enlace' : 'Copy Link')}
            </button>
            <button
              onClick={handleDownloadQr}
              className="flex-1 min-w-[140px] px-4 py-3 rounded-xl bg-primary hover:bg-primary/90 font-black text-xs uppercase tracking-wider text-black transition-all active:scale-95 shadow-[0_0_15px_rgba(106,244,37,0.3)] flex items-center justify-center gap-2"
            >
              {isEs ? 'Descargar QR' : 'Download QR'}
            </button>
          </div>
        </section>

        {/* BOTTOM NAVIGATION CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 pb-8">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-black font-black uppercase italic tracking-wider hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(106,244,37,0.3)]"
          >
            {isEs ? 'Ver Sorteo Actual' : 'View Current Giveaway'}
          </button>
          <button
            onClick={() => navigate('/shop')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/20 text-white font-bold uppercase tracking-wider hover:bg-white/10 hover:border-white/40 transition-all"
          >
            {isEs ? 'Explorar Tienda' : 'Explore Shop'}
          </button>
        </div>

      </main>
    </div>
  );
};

export default AboutCommunity;
