import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { db } from '../lib/db';
import { useTranslation } from '../i18n/useTranslation';
import PageTransition from '../components/layout/PageTransition';

const getInstagramInfo = (raw) => {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const parsed = new URL(trimmed);
      const parts = parsed.pathname.replace(/^\/|\/$/g, '').split('/');
      const handle = parts[0] ? `@${parts[0]}` : '@instagram';
      return { handle, url: trimmed };
    } catch {
      return { handle: trimmed, url: trimmed };
    }
  }
  const cleanHandle = trimmed.replace(/^@+/, '');
  return {
    handle: `@${cleanHandle}`,
    url: `https://instagram.com/${cleanHandle}`
  };
};

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
              {winners.map((winner, idx) => {
                const igInfo = getInstagramInfo(winner.instagram);
                const targetUrl = igInfo?.url || null;

                const CardContent = (
                  <div className="relative aspect-[4/3] bg-[#111111] overflow-hidden group">
                    <img
                      src={winner.carImage}
                      alt={lang === 'es' && winner.car_es ? winner.car_es : winner.car}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>

                    {targetUrl && (
                      <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md border border-primary/40 text-primary px-2.5 py-1 rounded-full opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all flex items-center gap-1.5 shadow-lg z-10 font-mono text-[10px] font-bold">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        <span>{igInfo.handle}</span>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 w-full p-4 z-10">
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="bg-primary text-black text-[9px] font-bold px-2 py-0.5 rounded-none mb-1 inline-block uppercase tracking-wider">
                            {lang === 'es' 
                              ? (winner.badgeText === 'Grand Prize Winner' ? 'Gran Premio' : (winner.badgeText === 'Previous Winner' ? 'Ganador Anterior' : winner.badgeText))
                              : winner.badgeText}
                          </div>
                          <h4 className="text-lg font-black italic text-white uppercase tracking-wider group-hover:text-primary transition-colors">{lang === 'es' && winner.car_es ? winner.car_es : winner.car}</h4>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-gray-300 text-xs font-mono">{winner.name}</p>
                            {igInfo && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 border border-white/20 text-primary text-[10px] font-mono font-bold tracking-tight">
                                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                                <span>{igInfo.handle}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="block text-2xl">{winner.flag}</span>
                          <span className="text-[10px] font-bold text-primary font-mono uppercase tracking-widest">{lang === 'es' && winner.location_es ? winner.location_es : winner.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );

                return targetUrl ? (
                  <a
                    key={idx}
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="snap-center shrink-0 w-[85vw] md:w-[380px] p-[1.5px] rounded-none overflow-hidden bg-white/5 hover:bg-thermal-gradient hover:shadow-[0_0_20px_rgba(255,140,0,0.15)] transition-all duration-500 group block cursor-pointer"
                    title={`Instagram: ${igInfo?.handle || winner.name}`}
                  >
                    {CardContent}
                  </a>
                ) : (
                  <div key={idx} className="snap-center shrink-0 w-[85vw] md:w-[380px] p-[1.5px] rounded-none overflow-hidden bg-white/5 hover:bg-thermal-gradient hover:shadow-[0_0_20px_rgba(255,140,0,0.15)] transition-all duration-500 group">
                    {CardContent}
                  </div>
                );
              })}
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
