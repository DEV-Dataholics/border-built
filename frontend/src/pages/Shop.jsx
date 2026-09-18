import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/useCartStore';
import { useConfigStore } from '../stores/useConfigStore';
import { useTranslation } from '../i18n/useTranslation';
import ProductCard from '../components/features/ProductCard';
import PageTransition from '../components/layout/PageTransition';
import Header from '../components/Header';

const Shop = () => {
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  const openCart = useCartStore((s) => s.openCart);
  const itemCount = useCartStore((s) => s.getItemCount());
  const { getMarqueeTexts } = useConfigStore();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products`);
        if (!response.ok) {
          throw new Error('Error al cargar el catálogo de productos');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const baseCategories = [
    { key: 'all', label: t('shop.allCategories') },
    { key: 'featured', label: t('shop.bestSellers') },
    { key: 'hoodies', label: t('shop.hoodies') },
    { key: 'tshirts', label: t('shop.tshirts') },
    { key: 'accessories', label: t('shop.accessories') },
    { key: 'mystery', label: t('shop.mystery') },
  ];

  const categories = baseCategories.filter(cat => {
    if (cat.key === 'all') return true;
    if (cat.key === 'featured') return products.some(p => p.featured);
    return products.some(p => p.category === cat.key);
  });

  const filteredProducts = activeCategory === 'all'
    ? products
    : activeCategory === 'featured'
    ? products.filter((p) => p.featured)
    : products.filter((p) => p.category === activeCategory);

  const marqueeTexts = getMarqueeTexts(lang);

  return (
    <PageTransition className="relative min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-primary selection:text-black pb-24 md:pb-8">
      <Header />

      {/* Promo Banner */}
      <div className="bg-primary overflow-hidden py-1 relative">
        <div className="animate-marquee whitespace-nowrap flex gap-8 text-[10px] font-black uppercase text-black tracking-widest">
          {(marqueeTexts.length > 0 ? marqueeTexts : ['⚡ 10X Entries Activated ⚡']).map((text, idx) => (
            <span key={idx}>{text}</span>
          ))}
          {(marqueeTexts.length > 0 ? marqueeTexts : ['⚡ 10X Entries Activated ⚡']).map((text, idx) => (
            <span key={`dup-${idx}`}>{text}</span>
          ))}
        </div>
      </div>

      {/* Shop Hero Section */}
      <div className="relative h-64 sm:h-80 md:h-[360px] w-full overflow-hidden border-b border-primary/20">
        {/* Background Image */}
        <img
          src="/images/shop-hero.png"
          alt="Shop Hero"
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
                [ BORDERBUILT // OFFICIAL STORE ]
              </span>
            </div>

            {/* Main Title */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black italic uppercase tracking-wider text-white select-none leading-none max-w-xl">
              {t('shop.heroTitle')}
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-gray-400 font-medium max-w-md">
              {t('shop.heroSubtitle')}
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all whitespace-nowrap border ${
                activeCategory === cat.key
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Dynamic States */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white/5 rounded-xl aspect-[3/4] border border-white/10" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 border border-red-500/20 bg-red-500/5 rounded-xl">
            <span className="material-symbols-outlined text-4xl opacity-50 block mb-2">error</span>
            <p className="text-sm font-mono uppercase">{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <span className="material-symbols-outlined text-4xl opacity-20 block mb-2">search_off</span>
            <p className="text-sm font-mono uppercase">No products in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </PageTransition>
  );
};

export default Shop;
