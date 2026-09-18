import React from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../ui/Badge';
import { useCartStore } from '../../stores/useCartStore';
import { calculateEntries } from '../../lib/entries';
import { useTranslation } from '../../i18n/useTranslation';

/**
 * Product card for the shop grid
 */
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const { t, lang } = useTranslation();

  const hasMultiplier = product.hasMultiplier || product.has_multiplier || false;
  const multVal = parseFloat(product.entryMultiplier || product.entry_multiplier) || 1;
  const isSpecialMultiplier = hasMultiplier && multVal > 1;

  const entries = calculateEntries(product.price, product);
  const defaultVariant = product.variants?.[0];

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addItem(
      product,
      defaultVariant?.size || null,
      defaultVariant?.color || null
    );
  };

  const handleClick = () => {
    navigate(`/shop/${product.slug}`);
  };

  return (
    <div
      className="group relative cursor-pointer p-[1.5px] rounded-none overflow-hidden transition-all duration-500 bg-white/5 hover:bg-thermal-gradient hover:shadow-[0_0_25px_rgba(255,140,0,0.2)]"
      onClick={handleClick}
    >
      <div className="bg-[#111111] w-full h-full overflow-hidden transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-[#050505]">
          {product.tags?.length > 0 && (
            <div className="absolute top-2 left-2 z-10">
              <Badge text={product.tags[0]} />
            </div>
          )}

          {isSpecialMultiplier && (
            <div className="absolute top-2 right-2 z-10 bg-primary text-black font-mono font-black text-[9px] px-2 py-0.5 uppercase tracking-wider rounded-none shadow-md animate-pulse-slow">
              {multVal}X BOLETOS
            </div>
          )}

          <img
            src={product.images?.[0] || '/images/products/placeholder.webp'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
            onError={(e) => {
              e.target.src = `https://placehold.co/400x400/151515/6af425?text=${encodeURIComponent(product.name)}`;
            }}
          />

          {/* Quick Add Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 bg-gradient-to-t from-black/90 to-transparent">
            <button
              onClick={handleQuickAdd}
              className="w-full bg-white text-black font-bold uppercase text-xs py-3 rounded-none shadow-lg hover:bg-primary transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">
                add_shopping_cart
              </span>
              {t('shop.addToCart')}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-white text-sm md:text-base font-bold uppercase leading-tight group-hover:text-primary transition-colors line-clamp-2">{lang === 'es' && product.name_es ? product.name_es : product.name}</h3>
          <p className="text-gray-500 text-xs font-mono mb-3">
            {defaultVariant?.color || product.category}
          </p>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-white font-black text-lg">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-gray-500 text-[10px] line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-primary bg-primary/10 px-2 py-1 rounded-none w-fit border border-primary/20">
              <span className="material-symbols-outlined text-xs">
                local_activity
              </span>
              <span className="font-bold">
                +{entries} {t('shop.entries')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
