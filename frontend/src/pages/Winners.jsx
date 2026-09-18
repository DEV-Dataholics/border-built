import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { db } from '../lib/db';
import { useTranslation } from '../i18n/useTranslation';
import PageTransition from '../components/layout/PageTransition';

const Winners = () => {
  const { t, lang } = useTranslation();
  const [winners, setWinners] = useState([]);
  const [socialHighlights, setSocialHighlights] = useState([]);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
    const fetchData = async () => {
      try {
        const [resWin, resComm] = await Promise.all([
          fetch(`${API_URL}/winners`),
          fetch(`${API_URL}/community-highlights`),
        ]);
        if (resWin.ok) {
          const winData = await resWin.json();
          if (Array.isArray(winData)) setWinners(winData);
        } else {
          setWinners(db.getCollection('winners') || []);
        }
        if (resComm.ok) {
          const commData = await resComm.json();
          if (Array.isArray(commData)) setSocialHighlights(commData);
        } else {
          setSocialHighlights(db.getCollection('community_highlights') || []);
        }
      } catch (err) {
        console.warn('Backend API no disponible para ganadores, usando mock local:', err);
        setWinners(db.getCollection('winners') || []);
        setSocialHighlights(db.getCollection('community_highlights') || []);
      }
    };

    fetchData();
  }, []);

  return (
    <PageTransition className="bg-[#0a0a0a] text-white font-sans overflow-x-hidden min-h-screen flex flex-col pb-24 md:pb-8 selection:bg-primary selection:text-black">
      <Header />

      {/* Winners Hero Section */}
      <div className="relative h-64 sm:h-80 md:h-[360px] w-full overflow-hidden border-b border-primary/20">
        {/* Background Image */}
        <img
          src="/images/winners/winners-hero.png"
          alt="Winners & Social Life Hero"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 select-none"
        />
        {/* Overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent md:from-black/90 md:via-black/40" />
        
        {/* Decorative Grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full flex flex-col justify-center gap-3">
            {/* Tech tag */}
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-primary rounded-full animate-ping" />
              <span className="text-[10px] sm:text-xs font-mono text-primary uppercase tracking-[0.2em] font-bold">
                [ BORDERBUILT // SOCIAL & MULTIMEDIA ]
              </span>
            </div>

            {/* Main Title */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black italic uppercase tracking-wider text-white select-none leading-none max-w-xl">
              {t('winners.heroTitle')}
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-gray-400 font-medium max-w-md">
              {t('winners.heroSubtitle')}
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col gap-10 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Headline Section */}
        <div className="text-center relative py-6">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-3xl rounded-full pointer-events-none"></div>
          <h1 className="relative z-10 text-4xl md:text-5xl font-black italic tracking-tighter leading-none transform -skew-x-6">
            <span className="text-white block">{t('winners.heroLine1')}</span>
            <span className="text-primary block">{t('winners.heroLine2')}</span>
          </h1>
          <p className="text-gray-400 text-xs mt-3 font-mono uppercase tracking-widest">{t('winners.subtitle')}</p>
        </div>

        {/* Carousel: Winners */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white text-lg font-mono uppercase tracking-widest border-l-4 border-primary pl-3">
            {t('winners.title')}
          </h3>
          <div className="relative w-full overflow-hidden">
            <div className="flex overflow-x-auto hide-scrollbar gap-4 snap-x snap-mandatory pb-4">
              {winners.map((winner, idx) => (
                <div key={idx} className="snap-center shrink-0 w-[85vw] md:w-[380px] p-[1.5px] rounded-none overflow-hidden bg-white/5 hover:bg-thermal-gradient hover:shadow-[0_0_20px_rgba(255,140,0,0.15)] transition-all duration-500">
                  <div className="relative aspect-[4/3] bg-[#111111] overflow-hidden group">
                    <img
                      src={winner.carImage}
                      alt={lang === 'es' && winner.car_es ? winner.car_es : winner.car}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full p-4">
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="bg-primary text-black text-[9px] font-bold px-2 py-0.5 rounded-none mb-1 inline-block uppercase tracking-wider">
                            {lang === 'es' 
                              ? (winner.badgeText === 'Grand Prize Winner' ? 'Gran Premio' : (winner.badgeText === 'Previous Winner' ? 'Ganador Anterior' : winner.badgeText))
                              : winner.badgeText}
                          </div>
                          <h4 className="text-lg font-black italic text-white uppercase tracking-wider">{lang === 'es' && winner.car_es ? winner.car_es : winner.car}</h4>
                          <p className="text-gray-300 text-xs font-mono">{winner.name}</p>
                        </div>
                        <div className="text-right">
                          <span className="block text-2xl">{winner.flag}</span>
                          <span className="text-[10px] font-bold text-primary font-mono uppercase tracking-widest">{lang === 'es' && winner.location_es ? winner.location_es : winner.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Highlights (Comunidad Destacada) */}
        <div className="flex flex-col gap-4">
          <div className="flex items-end justify-between">
            <h3 className="text-white text-lg font-mono uppercase tracking-widest border-l-4 border-primary pl-3">
              {t('winners.community')}
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {socialHighlights.map((item, idx) => {
              const targetUrl = item.linkUrl || item.link_url;
              const CardContent = (
                <div className="relative aspect-square bg-[#111111] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-70 group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
                  {targetUrl && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-primary/40 text-primary p-1.5 rounded-full opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                      <span className="material-symbols-outlined text-sm block">open_in_new</span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-sm font-bold uppercase tracking-wider leading-tight group-hover:text-primary transition-colors">{item.title}</p>
                    <p className="text-primary text-[9px] font-mono uppercase mt-1 tracking-widest">
                      {item.emoji} {item.location}
                    </p>
                  </div>
                </div>
              );

              return targetUrl ? (
                <a
                  key={idx}
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-[1.5px] rounded-none overflow-hidden bg-white/5 hover:bg-thermal-gradient hover:shadow-[0_0_20px_rgba(255,140,0,0.15)] transition-all duration-500 group block cursor-pointer"
                  title={`Ver en redes sociales: ${item.title}`}
                >
                  {CardContent}
                </a>
              ) : (
                <div key={idx} className="p-[1.5px] rounded-none overflow-hidden bg-white/5 hover:bg-thermal-gradient hover:shadow-[0_0_20px_rgba(255,140,0,0.15)] transition-all duration-500 group">
                  {CardContent}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default Winners;
