import React, { useState, useEffect } from 'react';
import { useCartStore } from '../../stores/useCartStore';
import { useTranslation } from '../../i18n/useTranslation';

const FALLBACK_QUICK_ENTRIES = [
  {
    id: 'prod_qe_gold',
    name: 'Gold Package',
    name_es: 'PAQUETE ORO',
    slug: 'gold-package',
    category: 'quick_entries',
    description: 'Paquete máximo de 150,000 entradas directas con super multiplicador 500X.',
    description_es: 'Paquete máximo de 150,000 entradas directas con super multiplicador 500X.',
    price: 300.00,
    compare_at_price: 600.00,
    images: ['/images/quick_entry_gold.png'],
    has_multiplier: true,
    entry_multiplier: 500,
    featured: true
  },
  {
    id: 'prod_qe_silver',
    name: 'Silver Package',
    name_es: 'PAQUETE PLATA',
    slug: 'silver-package',
    category: 'quick_entries',
    description: 'Paquete de 75,000 entradas directas con super multiplicador 500X.',
    description_es: 'Paquete de 75,000 entradas directas con super multiplicador 500X.',
    price: 150.00,
    compare_at_price: 300.00,
    images: ['/images/quick_entry_silver.png'],
    has_multiplier: true,
    entry_multiplier: 500,
    featured: true
  },
  {
    id: 'prod_qe_bronze',
    name: 'Bronze Package',
    name_es: 'PAQUETE BRONCE',
    slug: 'bronze-package',
    category: 'quick_entries',
    description: 'Paquete de 30,000 entradas directas con super multiplicador 500X.',
    description_es: 'Paquete de 30,000 entradas directas con super multiplicador 500X.',
    price: 60.00,
    compare_at_price: 120.00,
    images: ['/images/quick_entry_bronze.png'],
    has_multiplier: true,
    entry_multiplier: 500,
    featured: true
  }
];

const TIER_THEMES = {
  bronze: {
    borderColor: 'border-[#cd7f32]/40 hover:border-[#cd7f32]',
    textColor: 'text-[#cd7f32]',
    glowColor: 'shadow-[0_0_25px_rgba(205,127,50,0.25)] hover:shadow-[0_0_35px_rgba(205,127,50,0.45)]',
    title: 'BRONZE PACKAGE'
  },
  silver: {
    borderColor: 'border-slate-300/40 hover:border-slate-200',
    textColor: 'text-slate-200',
    glowColor: 'shadow-[0_0_25px_rgba(226,232,240,0.25)] hover:shadow-[0_0_35px_rgba(226,232,240,0.45)]',
    title: 'SILVER PACKAGE'
  },
  gold: {
    borderColor: 'border-amber-400/50 hover:border-amber-300',
    textColor: 'text-amber-300',
    glowColor: 'shadow-[0_0_25px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.55)]',
    title: 'GOLD PACKAGE'
  }
};

const QuickEntriesSection = () => {
  const { t, lang } = useTranslation();
  const { addItem, openCart } = useCartStore();
  const [products, setProducts] = useState(FALLBACK_QUICK_ENTRIES);

  useEffect(() => {
    const fetchQuickEntries = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/products`);
        if (res.ok) {
          const data = await res.json();
          const qeProducts = data.filter(p => p.category === 'quick_entries' || (Array.isArray(p.tags) && p.tags.includes('quick_entries')));
          if (qeProducts.length > 0) {
            const getTierKey = (p) => {
              const str = `${p.name || ''} ${p.slug || ''} ${p.name_es || ''}`.toLowerCase();
              if (str.includes('gold') || str.includes('oro')) return 'gold';
              if (str.includes('silver') || str.includes('plata')) return 'silver';
              return 'bronze';
            };
            const TIER_ORDER = { gold: 1, silver: 2, bronze: 3 };
            qeProducts.sort((a, b) => {
              return (TIER_ORDER[getTierKey(a)] || 99) - (TIER_ORDER[getTierKey(b)] || 99);
            });
            const parsed = qeProducts.map(p => ({
              ...p,
              images: Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? (JSON.parse(p.images || '[]')) : ['/images/quick_entry_bronze.png']),
              price: parseFloat(p.price),
              entry_multiplier: parseInt(p.entry_multiplier || p.entryMultiplier || 500)
            }));
            setProducts(parsed);
          }
        }
      } catch {
        // Fallback to static items
      }
    };
    fetchQuickEntries();
  }, []);

  const handleAddToCart = (product) => {
    addItem(product);
    openCart();
  };

  return (
    <div id="quick-entries-section" className="max-w-6xl mx-auto px-6 py-16 w-full border-t border-white/5 scroll-mt-20">
      {/* Title */}
      <div className="text-center mb-12">
        <h2 className="text-white text-4xl md:text-5xl font-black uppercase italic tracking-tighter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          {lang === 'es' ? 'ENTRADAS ' : 'QUICK '} 
          <span className="text-primary italic">{lang === 'es' ? 'RÁPIDAS' : 'ENTRIES'}</span>
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm font-mono mt-2 uppercase tracking-widest max-w-xl mx-auto">
          {t('quickEntries.subtitle')}
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {products.map((product) => {
          const str = `${product.name || ''} ${product.slug || ''} ${product.name_es || ''}`.toLowerCase();
          const tierKey = (str.includes('gold') || str.includes('oro')) ? 'gold' : (str.includes('silver') || str.includes('plata')) ? 'silver' : 'bronze';
          const theme = TIER_THEMES[tierKey];

          const mult = parseFloat(product.entry_multiplier || product.entryMultiplier) || 500;
          const totalEntries = Math.floor(product.price * mult);
          const imageSrc = Array.isArray(product.images) && product.images.length > 0 
            ? product.images[0] 
            : `/images/quick_entry_${tierKey}.png`;

          // Translate the package title
          let packageTitle = theme.title;
          if (lang === 'es') {
            if (tierKey === 'bronze') packageTitle = 'PAQUETE BRONCE';
            if (tierKey === 'silver') packageTitle = 'PAQUETE PLATA';
            if (tierKey === 'gold') packageTitle = 'PAQUETE ORO';
          } else {
            if (tierKey === 'bronze') packageTitle = 'BRONZE PACKAGE';
            if (tierKey === 'silver') packageTitle = 'SILVER PACKAGE';
            if (tierKey === 'gold') packageTitle = 'GOLD PACKAGE';
          }

          return (
            <div
              key={product.id}
              className={`bg-[#0c0c0c] border ${theme.borderColor} rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 ${theme.glowColor} group`}
            >
              {/* Card Header Tag */}
              <div className="bg-black/90 px-4 py-3 border-b border-white/10 text-center">
                <h3 className={`text-base font-black italic tracking-widest uppercase font-mono ${theme.textColor}`}>
                  {packageTitle}
                </h3>
              </div>

              {/* Graphic Container */}
              <div className="relative aspect-square bg-gradient-to-b from-[#181818] to-[#0c0c0c] p-6 flex items-center justify-center overflow-hidden">
                <img
                  src={imageSrc}
                  alt={product.name}
                  className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = `/images/quick_entry_${tierKey}.png`;
                  }}
                />
                
                {/* Badge: Digital Product */}
                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md border border-white/20 text-white font-mono text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider rounded">
                  • {t('quickEntries.digitalProduct')}
                </div>
              </div>

              {/* Entries & Multiplier Bar */}
              <div className="bg-[#141414] px-4 py-3 border-y border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="material-symbols-outlined text-primary text-sm animate-pulse">local_activity</span>
                  <span className="text-white font-mono font-black text-xs sm:text-sm">
                    {totalEntries.toLocaleString()} {lang === 'es' ? 'ENTRADAS' : 'ENTRIES'}
                  </span>
                </div>
                <div className="bg-primary text-black font-mono font-black text-xs px-2.5 py-1.5 rounded-lg uppercase tracking-wider">
                  {mult}X
                </div>
              </div>

              {/* Card Content & Action */}
              <div className="p-5 flex flex-col gap-4 bg-carbon-pattern flex-1 justify-between">
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <h4 className="text-white text-xl font-black italic uppercase font-display">
                      {(() => {
                        if (lang === 'es') {
                          if (product.name_es) return product.name_es;
                          if (tierKey === 'bronze') return 'PAQUETE BRONCE';
                          if (tierKey === 'silver') return 'PAQUETE PLATA';
                          if (tierKey === 'gold') return 'PAQUETE ORO';
                        }
                        if (tierKey === 'bronze') return 'BRONZE PACKAGE';
                        if (tierKey === 'silver') return 'SILVER PACKAGE';
                        if (tierKey === 'gold') return 'GOLD PACKAGE';
                        return product.name;
                      })()}
                    </h4>
                    <span className="text-white font-mono text-xl font-black">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  {/* Description */}
                  <p className="text-gray-400 text-[10px] sm:text-xs leading-relaxed uppercase font-mono tracking-widest mt-1">
                    {(() => {
                      const rawEs = product.description_es || product.description || '';
                      const rawEn = product.description || '';

                      // If it's a standard quick entry text or mentions tickets/multiplier
                      const isEntryText = !rawEs || /entradas directas|direct entries|paquete|package/i.test(rawEs || rawEn);

                      if (isEntryText) {
                        if (lang === 'es') {
                          return tierKey === 'gold'
                            ? `Paquete máximo de ${totalEntries.toLocaleString()} entradas directas con multiplicador ${mult}X.`
                            : `Paquete de ${totalEntries.toLocaleString()} entradas directas con multiplicador ${mult}X.`;
                        } else {
                          return tierKey === 'gold'
                            ? `Maximum package of ${totalEntries.toLocaleString()} direct entries with ${mult}X multiplier.`
                            : `Package of ${totalEntries.toLocaleString()} direct entries with ${mult}X multiplier.`;
                        }
                      }

                      return lang === 'es' ? (product.description_es || product.description) : product.description;
                    })()}
                  </p>
                </div>

                {/* Add To Cart Button */}
                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-primary hover:bg-[#5ce020] text-black font-black uppercase text-sm py-3.5 rounded-xl shadow-[0_0_20px_rgba(106,244,37,0.35)] hover:shadow-[0_0_30px_rgba(106,244,37,0.6)] transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.98]"
                >
                  <span>{t('quickEntries.addToCart')}</span>
                  <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">shopping_cart</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickEntriesSection;
