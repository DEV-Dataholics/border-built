import React from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../stores/useCartStore';
import { useTranslation } from '../i18n/useTranslation';
import { calculateEntries } from '../lib/entries';
import EntryCounter from './features/EntryCounter';

const CartDrawer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getSubtotal,
    getShipping,
    getTotalEntries,
  } = useCartStore();

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const totalEntries = getTotalEntries();

  // Find unique active multipliers across cart items
  const activeMultipliersInCart = [...new Set(items.map(item => {
    const isAct = item.hasMultiplier || item.has_multiplier || false;
    const val = parseFloat(item.entryMultiplier || item.entry_multiplier) || 1;
    return isAct && val > 1 ? `${val}X` : null;
  }).filter(Boolean))];

  const cartMultiplierLabel = activeMultipliersInCart.length > 0
    ? `(${activeMultipliersInCart.join(', ')} MULTIPLICADOR APLICADO)`
    : '(1X TASA BASE)';

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            className="fixed inset-y-0 right-0 w-full max-w-md bg-[#0a0a0a] border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-[70] flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-white text-2xl font-black italic uppercase">{t('cart.title')}</h2>
              <button onClick={closeCart} className="text-gray-400 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Progress Bar / Gamification */}
            <div className="px-6 py-4 bg-white/5 border-b border-white/5">
              <div className="flex justify-between text-xs uppercase font-bold text-gray-400 mb-2">
                <span>{t('cart.progressLabel')}</span>
                <span className="text-primary">{t('cart.nearGoal')}</span>
              </div>
              <div className="h-2 bg-black rounded-full overflow-hidden border border-white/10">
                <motion.div
                  className="h-full bg-primary shadow-[0_0_10px_#6af425]"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((subtotal / 100) * 100, 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-2 font-mono text-center">
                {subtotal < 100
                  ? t('cart.upsell', { amount: (100 - subtotal).toFixed(2) })
                  : '🎉 VIP Pack Unlocked!'}
              </p>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
                  <span className="material-symbols-outlined text-6xl opacity-20">shopping_cart</span>
                  <p className="uppercase font-bold tracking-widest text-sm">{t('cart.empty')}</p>
                  <button onClick={closeCart} className="text-primary underline font-bold uppercase text-xs">
                    {t('cart.backToShop')}
                  </button>
                </div>
              ) : (
                items.map((item, idx) => {
                  const isItemMultActive = item.hasMultiplier || item.has_multiplier || false;
                  const itemMultVal = parseFloat(item.entryMultiplier || item.entry_multiplier) || 1;
                  const itemEntries = calculateEntries(item.price, item) * item.quantity;
                  const showItemBadge = isItemMultActive && itemMultVal > 1;

                  return (
                    <motion.div
                      key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex gap-4 bg-white/5 p-3 rounded-xl border border-white/5 relative group"
                    >
                      <div className="h-20 w-20 bg-black rounded-lg overflow-hidden border border-white/10 shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://placehold.co/200x200/151515/6af425?text=${encodeURIComponent(item.name)}`;
                          }}
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <h4 className="text-white font-bold uppercase italic text-sm">{item.name}</h4>
                          <p className="text-gray-400 text-xs font-mono">
                            {item.selectedSize && `${item.selectedSize}`}
                            {item.selectedColor && ` / ${item.selectedColor}`}
                          </p>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                          <div className="flex items-center gap-3 bg-black/50 rounded-lg px-2 py-1 border border-white/10 text-xs h-fit">
                            <button
                              onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                              className="text-gray-400 hover:text-white"
                            >
                              -
                            </button>
                            <span className="text-white font-mono">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                              className="text-gray-400 hover:text-white"
                            >
                              +
                            </button>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-primary font-mono font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                            <div className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded border border-primary/20 whitespace-nowrap">
                              {showItemBadge && <span className="font-black text-white bg-primary text-black px-1 mr-1 rounded-[2px]">{itemMultVal}X</span>}
                              +{itemEntries} {t('shop.entries').toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Remove button */}
                      <button
                        onClick={() => removeItem(item.id, item.selectedSize, item.selectedColor)}
                        className="absolute top-1 right-1 text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer / Summary */}
            {items.length > 0 && (
              <div className="p-6 bg-[#0f0f0f] border-t border-white/10">
                {/* Entries Counter */}
                <div className="bg-gradient-to-r from-gray-900 to-black border border-primary/30 p-4 rounded-xl mb-6 relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 h-24 w-24 bg-primary/20 blur-3xl rounded-full" />
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <span className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">
                      {t('cart.totalEntries')}
                    </span>
                    <div className={`font-black italic text-white drop-shadow-[0_0_10px_rgba(106,244,37,0.5)] whitespace-nowrap tracking-tight ${
                      totalEntries > 999999 ? 'text-2xl sm:text-3xl' : totalEntries > 99999 ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl'
                    }`}>
                      <EntryCounter value={totalEntries} />
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-primary text-[11px] font-bold uppercase animate-pulse">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      <span>BOLETOS OFICIALES {cartMultiplierLabel}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>{t('cart.subtotal')}</span>
                    <span className="font-mono text-white">${subtotal.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>{t('cart.shipping')}</span>
                    <span className="font-mono text-white">
                      {shipping === 0 ? t('cart.freeShipping') : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-primary hover:bg-[#5ce020] text-black font-black uppercase text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(106,244,37,0.4)] transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
                  >
                    <span>{t('cart.checkout')}</span>
                    <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </button>

                  <button
                    onClick={closeCart}
                    className="w-full bg-transparent hover:bg-white/5 text-gray-300 font-bold uppercase text-sm py-3 rounded-xl border border-white/10 transition-all"
                  >
                    {t('cart.backToShop') || 'Continue Shopping'}
                  </button>
                </div>

                <p className="text-[10px] text-gray-600 text-center mt-4 flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-xs">lock</span>
                  {t('cart.securePay')}
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
