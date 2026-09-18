import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CountdownTimer from '../components/CountdownTimer';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/useTranslation';

const HowItWorks = () => {
  const { lang } = useTranslation();
    const navigate = useNavigate();
    const steps = [
        { title: '01. Compra Merch', desc: 'Compra ropa automotriz de alta calidad en nuestra tienda.', icon: 'shopping_bag' },
        { title: '02. Gana Entradas', desc: 'Cada $1 USD gastado te da 10X entradas automáticas.', icon: 'local_activity', badge: '10X ACTIVADO' },
        { title: '03. Gana el Auto', desc: 'Mira el sorteo en vivo para ver si te llevas las llaves.', icon: 'directions_car' }
    ];

    const specs = [
        { label: 'Motor', value: 'VQ35DE Twin-Turbo' },
        { label: 'Potencia', value: '460 WHP' },
        { label: '0-100 km/h', value: '4.1 Seg' },
        { label: 'Vel. Máx', value: '280+ km/h' }
    ];

    const Feature = ({ title, desc, img, reverse }) => (
        <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-6 items-center py-8 border-b border-white/5 last:border-0`}>
            <div className="w-full md:w-1/2 aspect-video rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/10 group relative">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${img}')` }}
                ></div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-3">
                <h3 className="text-2xl font-black italic uppercase text-white leading-tight">
                    <span className="text-primary block text-sm not-italic font-mono mb-1 tracking-widest">BORDERBUILT</span>
                    {title}
                </h3>
                <p className="text-gray-300 font-medium text-sm leading-relaxed">{desc}</p>
            </div>
        </div>
    );

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-[#0a0a0a] overflow-x-hidden font-sans">
            <Header title="CÓMO FUNCIONA" showBack={true} />

            {/* ALERT BANNER */}
            <div className="bg-primary text-black text-center py-2 font-black italic tracking-wider text-xs md:text-sm animate-pulse-slow relative z-30">
                ⚠️ ¡OFERTA LIMITADA! 10X ENTRADAS HASTA MEDIANOCHE ⚠️
            </div>

            {/* HERO SECTION - HIGH IMPACT */}
            <div className="relative w-full min-h-[75vh] flex items-center justify-center py-16 md:py-24 overflow-hidden">
                <img
                    src="/images/nissan-350z-tokyo.png"
                    alt="Nissan 350Z Tokyo Drift VeilSide"
                    className="absolute inset-0 w-full h-full object-cover scale-105"
                />

                {/* Overlay with Tuner Cult vibe gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-black/60"></div>

                {/* Star Pattern Overlay */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                <div className="relative z-10 w-full px-4 flex flex-col gap-4 items-center">

                    {/* MYSTERY BONUS BADGE */}
                    <div className="bg-black/80 backdrop-blur border border-primary/50 text-white px-6 py-2 rounded-full transform -rotate-2 mb-4 shadow-[0_0_20px_rgba(106,244,37,0.3)]">
                        <span className="text-primary font-black italic text-lg mr-2">10X</span>
                        <span className="font-bold tracking-widest uppercase">{lang === 'es' ? 'Entradas de Bono' : 'Bonus Entries'}</span>
                    </div>

                    <h1 className="text-white text-6xl md:text-8xl font-black text-center italic uppercase leading-[0.85] drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                        Gana El <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-primary to-[#2a5e12] relative">
                            350Z
                            <span className="absolute -top-4 -right-8 text-white text-lg bg-red-600 px-2 py-1 rotate-12 rounded shadow-lg font-sans not-italic font-bold tracking-normal">¡YA!</span>
                        </span>
                    </h1>

                    <p className="text-center text-gray-200 font-bold text-sm md:text-xl uppercase tracking-widest mt-2 bg-black/50 px-4 py-1 rounded">
                        + $10,000 USD <span className="text-primary">{lang === 'es' ? 'Efectivo' : 'Cash'}</span>
                    </p>

                    {/* Action Area */}
                    <div className="w-full max-w-md mt-6 flex flex-col gap-4">
                        <div className="bg-black/60 backdrop-blur-md rounded-xl border border-white/10 p-3 shadow-2xl">
                            <div className="flex justify-between text-[10px] text-gray-400 font-mono uppercase mb-1 px-1">
                                <span>{lang === 'es' ? 'Tiempo Restante' : 'Time Remaining'}</span>
                                <span className="text-red-500 font-bold animate-pulse">¡Cierra Pronto!</span>
                            </div>
                            <CountdownTimer />
                        </div>

                        <button
                            onClick={() => navigate('/shop')}
                            className="bg-primary hover:bg-[#5ce020] text-black text-xl md:text-2xl font-black italic uppercase py-4 rounded-xl shadow-[0_0_30px_rgba(106,244,37,0.6)] hover:shadow-[0_0_50px_rgba(106,244,37,0.8)] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                        >
                            <span>{lang === 'es' ? 'Ir a la tienda' : 'Go to Store'}</span>
                            <span className="material-symbols-outlined font-black">bolt</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* PROMO BANNER / SCARCITY SECTION */}
            <div className="bg-[#111] border-y border-white/10 relative overflow-hidden py-10">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 10px, #fff 10px, #fff 11px)' }}></div>

                <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-primary text-xl font-black italic uppercase mb-1">{lang === 'es' ? 'Stock Limitado' : 'Limited Stock'}</h3>
                        <h2 className="text-white text-3xl md:text-4xl font-black uppercase italic leading-none">
                            Mystery Boxes <br />
                            <span className="text-white/50">{lang === 'es' ? 'Casi Agotadas' : 'Almost Sold Out'}</span>
                        </h2>
                    </div>

                    <div className="flex-1 bg-black/50 border border-primary/30 p-4 rounded-xl flex items-center gap-4">
                        <div className="h-16 w-16 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center border border-white/10 shrink-0">
                            <span className="text-3xl">🎁</span>
                        </div>
                        <div>
                            <p className="text-white font-bold uppercase italic">{lang === 'es' ? 'Compra Misteriosa' : 'Mystery Purchase'}</p>
                            <p className="text-gray-400 text-xs">Incluye 500 entradas + Merch exclusiva</p>
                            <div className="w-full bg-gray-800 h-2 rounded-full mt-2 overflow-hidden">
                                <div className="bg-red-500 h-full w-[85%]"></div>
                            </div>
                            <p className="text-[10px] text-red-400 text-right mt-1 font-mono">85% VENDIDO</p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-1 flex flex-col px-4 pt-12 pb-40 max-w-5xl mx-auto w-full relative z-20">

                {/* Specs Grid - Clean & Technical */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-16">
                    {specs.map((spec, idx) => (
                        <div key={idx} className="bg-[#151515] border border-white/5 p-4 rounded hover:border-primary/50 transition-colors group">
                            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1 group-hover:text-primary transition-colors">{spec.label}</p>
                            <p className="text-white font-mono font-black text-xl italic">{spec.value}</p>
                        </div>
                    ))}
                </div>

                {/* Features with "Hype" layout */}
                <div className="flex flex-col gap-4 mb-20">
                    <Feature
                        title="Motor RB26DETT"
                        desc="El corazón de la leyenda. Ajustado a la perfección para entregar 650 caballos de fuerza a las ruedas. Un sonido que te pondrá la piel de gallina."
                        img="/images/gtr-engine.jpg"
                    />
                    <Feature
                        title="Interior Racing"
                        desc="Siéntete como un piloto profesional. Asientos de cubo, jaula antivuelco y toda la telemetría que necesitas al alcance de tu mano."
                        img="/images/gtr-interior.jpg"
                        reverse
                    />
                    <Feature
                        title="Rines & Frenos"
                        desc="Rines forjados exclusivos y un sistema de frenos Brembo sobredimensionado para detener a esta bestia en seco."
                        img="/images/gtr-wheels.jpg"
                    />
                </div>

                {/* STEPS TO WIN - Aggressive Visuals */}
                <div className="mb-24">
                    <div className="text-center mb-10">
                        <h2 className="text-white text-4xl font-black uppercase italic tracking-tighter">
                            3 Pasos Para <span className="text-primary">{lang === 'es' ? 'Ganar' : 'Win'}</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        {steps.map((step, idx) => (
                            <div key={idx} className="relative group bg-[#111] p-6 rounded-2xl border border-white/5 hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                                {step.badge && (
                                    <div className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded rotate-3 shadow-lg z-10">
                                        {step.badge}
                                    </div>
                                )}
                                <div className="flex flex-col items-center text-center gap-4">
                                    <div className="h-20 w-20 rounded-full bg-black border-2 border-primary/20 flex items-center justify-center group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(106,244,37,0.4)] transition-all">
                                        <span className="material-symbols-outlined text-white text-4xl group-hover:text-primary transition-colors">{step.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-white text-xl font-black italic uppercase mb-2">{step.title}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FINAL STICKY CTA - Replaces the bottom bar with something integrated but prominent */}
                <div className="bg-gradient-to-br from-[#1a1a1a] to-black border border-white/10 rounded-2xl p-8 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase mb-4 relative z-10">
                        ¿Estás listo para <span className="text-primary">ganar?</span>
                    </h2>
                    <p className="text-gray-300 mb-8 max-w-lg mx-auto relative z-10 font-medium">
                        No dejes pasar esta oportunidad única. Consigue merch premium y asegura tu lugar en la historia.
                    </p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="relative z-10 bg-primary text-black font-black text-lg uppercase px-12 py-4 rounded-full shadow-[0_0_20px_rgba(106,244,37,0.4)] hover:shadow-[0_0_40px_rgba(106,244,37,0.6)] hover:scale-105 transition-all w-full md:w-auto"
                    >
                        Comprar Entradas AHORA
                    </button>

                    {/* Decorative elements */}
                    <div className="absolute -left-10 -bottom-10 h-40 w-40 bg-primary/20 rounded-full blur-3xl"></div>
                    <div className="absolute -right-10 -top-10 h-40 w-40 bg-primary/20 rounded-full blur-3xl"></div>
                </div>

            </main>
        </div>
    );
};

export default HowItWorks;
