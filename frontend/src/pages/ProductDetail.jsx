import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/db';
import { useCartStore } from '../stores/useCartStore';
import { calculateEntries } from '../lib/entries';
import { useTranslation } from '../i18n/useTranslation';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import PageTransition from '../components/layout/PageTransition';
import ProductCard from '../components/features/ProductCard';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const { t, lang } = useTranslation();

  const sliderRef = useRef(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [added, setAdded] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/products/${slug}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        
        setProduct(data.product);
        setSimilarProducts(data.similar || []);

        const firstVariant = data.product.variants?.[0];
        if (firstVariant) {
          setSelectedSize(firstVariant.size);
          setSelectedColor(firstVariant.color);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <PageTransition className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="animate-pulse font-mono text-primary">LOADING PRODUCT...</div>
      </PageTransition>
    );
  }

  if (error || !product) {
    return (
      <PageTransition className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">PRODUCT NOT FOUND</h1>
        <Button variant="outline" onClick={() => navigate('/shop')}>RETURN TO SHOP</Button>
      </PageTransition>
    );
  }

  // Get unique sizes and colors
  const sizes = [...new Set((product.variants || []).map((v) => v.size))];
  const colors = [...new Set((product.variants || []).map((v) => v.color))];

  // Check stock for selected variant
  const selectedVariant = (product.variants || []).find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );
  const inStock = selectedVariant ? selectedVariant.stock > 0 : true;

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const hasMultiplier = product.hasMultiplier || product.has_multiplier || false;
  const multVal = parseFloat(product.entryMultiplier || product.entry_multiplier) || 1;
  const isSpecialMultiplier = hasMultiplier && multVal > 1;

  const entries = calculateEntries(product.price, product);

  return (
    <PageTransition className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="hover:bg-white/10 p-2 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">
            {product.category}
          </span>
          <button
            onClick={() => openCart()}
            className="hover:bg-white/10 p-2 rounded-full transition-colors text-primary"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-[#151515] border border-white/5">
            {product.tags?.length > 0 && (
              <div className="absolute top-3 left-3 z-10">
                <Badge text={product.tags[0]} />
              </div>
            )}
            {isSpecialMultiplier && (
              <div className="absolute top-3 right-3 z-10 bg-primary text-black font-mono font-black text-xs px-3 py-1 uppercase tracking-wider shadow-lg animate-pulse-slow">
                {multVal}X BOLETOS ACTIVADO
              </div>
            )}
            <img
              src={product.images?.[0] || '/images/products/placeholder.webp'}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://placehold.co/600x600/151515/6af425?text=${encodeURIComponent(product.name)}`;
              }}
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-black italic uppercase text-white mb-2">
                {lang === 'es' && product.name_es ? product.name_es : product.name}
              </h1>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                {lang === 'es' && product.description_es ? product.description_es : product.description}
              </p>
            </div>

            {/* Price + Entries */}
            <div className="flex items-end gap-4">
              <div>
                <span className="text-3xl font-black text-white">
                  ${product.price.toFixed(2)}
                </span>
                {(product.compareAtPrice || product.compare_at_price) && (
                  <span className="text-gray-500 text-sm line-through ml-2">
                    ${(product.compareAtPrice || product.compare_at_price).toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-primary bg-primary/10 px-3 py-2 rounded border border-primary/20">
                <span className="material-symbols-outlined text-sm">
                  local_activity
                </span>
                <span className="font-bold">+{entries} {t('shop.entries')}</span>
              </div>
            </div>

            {/* Size Selector */}
            {sizes.length > 1 && (
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2 block">
                  {['tshirts', 'hoodies', 'apparel', 'headwear'].includes(product.category?.toLowerCase()) 
                    ? t('shop.selectSize') 
                    : (lang === 'es' ? 'SELECCIONAR MODELO' : 'SELECT MODEL')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all border ${
                        selectedSize === size
                          ? 'bg-primary text-background-dark border-primary'
                          : 'bg-white/5 text-white border-white/10 hover:border-primary/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {colors.length > 1 && (
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2 block">
                  {t('shop.selectColor')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg text-xs font-mono transition-all border ${
                        selectedColor === color
                          ? 'bg-primary text-background-dark border-primary'
                          : 'bg-white/5 text-white border-white/10 hover:border-primary/50'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="mt-2">
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full"
                disabled={!inStock}
                icon={
                  <span className="material-symbols-outlined">
                    {added ? 'check' : 'add_shopping_cart'}
                  </span>
                }
              >
                {added
                  ? t('shop.addedToCart')
                  : !inStock
                  ? t('shop.soldOut')
                  : t('shop.addToCart')}
              </Button>
            </div>

            {/* Stock info */}
            {selectedVariant && (
              <p className="text-gray-600 text-[10px] font-mono uppercase text-center">
                {selectedVariant.stock} units in stock — {selectedSize} / {selectedColor}
              </p>
            )}
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16 border-t border-white/10 pt-10">
            <div className="flex justify-between items-center mb-6">
              <div className="border-l-4 border-primary pl-3">
                <h2 className="text-xl font-black italic uppercase text-white tracking-wider">
                  SIMILAR PRODUCTS
                </h2>
                <p className="text-gray-500 text-[10px] uppercase font-mono mt-1">You might also like</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={scrollLeft} 
                  className="w-10 h-10 flex items-center justify-center bg-[#111] hover:bg-primary/20 border border-white/10 hover:border-primary text-white hover:text-primary transition-all rounded-sm group"
                >
                  <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">chevron_left</span>
                </button>
                <button 
                  onClick={scrollRight} 
                  className="w-10 h-10 flex items-center justify-center bg-[#111] hover:bg-primary/20 border border-white/10 hover:border-primary text-white hover:text-primary transition-all rounded-sm group"
                >
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">chevron_right</span>
                </button>
              </div>
            </div>
            
            <div 
              ref={sliderRef}
              className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar custom-scrollbar"
            >
              {similarProducts.map((p) => (
                <div key={p.id} className="min-w-[280px] max-w-[300px] snap-start shrink-0">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </PageTransition>
  );
};

export default ProductDetail;
