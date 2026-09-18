import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../i18n/useTranslation';
import { useCartStore } from '../stores/useCartStore';
import { useAuthStore } from '../stores/useAuthStore';
import { AnimatePresence, motion } from 'framer-motion';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, lang, toggleLang } = useTranslation();
  const openCart = useCartStore((s) => s.openCart);
  const itemCount = useCartStore((s) => s.getItemCount());
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHome = location.pathname === '/';

  return (
    <>
      <div className="sticky top-0 z-50 flex items-center bg-background-dark/90 backdrop-blur-md border-b border-primary/20 p-4 pb-2 justify-between px-4 md:px-8">
        {/* Left Area: Logo + Mobile Back/Menu */}
        <div className="flex items-center gap-2 md:gap-4 relative z-[9999]">
          {/* Mobile Menu/Back Button */}
          <div className="text-primary flex size-10 shrink-0 items-center justify-start md:hidden relative z-[9999]">
            {isHome ? (
              <button 
                type="button"
                onClick={() => setIsMobileMenuOpen(true)} 
                className="hover:bg-primary/10 p-2 rounded transition-colors w-full h-full flex items-center justify-center cursor-pointer pointer-events-auto" 
                title="Menu"
              >
                <span className="material-symbols-outlined text-3xl">menu</span>
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => navigate(-1)} 
                className="hover:bg-primary/10 p-2 rounded transition-colors w-full h-full flex items-center justify-center cursor-pointer pointer-events-auto" 
                title="Back"
              >
                <span className="material-symbols-outlined text-3xl">arrow_back</span>
              </button>
            )}
          </div>

        {/* Global Logo Image */}
        <img
          src="/images/BORDERBUILT (5)2.png"
          alt="BORDERBUILT"
          onClick={() => navigate('/')}
          className="h-5 sm:h-7 md:h-8 w-auto object-contain cursor-pointer hover:opacity-85 transition-opacity select-none"
        />
      </div>

      {/* Center: Desktop Navigation Menu */}
      <nav className="hidden md:flex items-center gap-4 lg:gap-8 text-[10px] lg:text-xs font-mono uppercase tracking-[0.15em] lg:tracking-[0.2em] text-gray-400">
        <button
          onClick={() => navigate('/')}
          className={`hover:text-primary transition-all font-bold cursor-pointer ${location.pathname === '/' ? 'text-primary' : ''}`}
        >
          {t('nav.home')}
        </button>
        <button
          onClick={() => navigate('/shop')}
          className={`hover:text-primary transition-all font-bold cursor-pointer ${location.pathname.startsWith('/shop') ? 'text-primary' : ''}`}
        >
          {t('nav.shop')}
        </button>
        <button
          onClick={() => navigate('/winners')}
          className={`hover:text-primary transition-all font-bold cursor-pointer ${location.pathname.startsWith('/winners') ? 'text-primary' : ''}`}
        >
          {t('nav.winners')}
        </button>
        <button
          onClick={() => navigate('/garage')}
          className={`hover:text-primary transition-all font-bold cursor-pointer ${location.pathname.startsWith('/garage') ? 'text-primary' : ''}`}
        >
          {t('nav.garage')}
        </button>
      </nav>



      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        {/* Language Toggle */}
        <button
          onClick={toggleLang}
          className="text-gray-400 hover:text-primary text-[10px] font-mono font-bold px-2 py-1 rounded transition-colors uppercase"
          title="Toggle language"
        >
          {lang === 'en' ? 'ES' : 'EN'}
        </button>

        {/* Auth */}
        {isAuthenticated ? (
          <div className="flex items-center gap-1">
            <span className="hidden md:block text-[10px] font-mono text-gray-400 uppercase tracking-widest px-2">
              {user?.name}
            </span>
            <button
              onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/garage')}
              className="text-primary hover:bg-primary/10 p-1 rounded transition-colors"
              title={user?.name}
            >
              <span className="material-symbols-outlined text-2xl">person</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="text-gray-400 hover:text-primary hover:bg-primary/10 p-1 rounded transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">login</span>
          </button>
        )}

        {/* Cart */}
        <button
          onClick={openCart}
          className="relative flex items-center justify-center rounded-lg h-12 bg-transparent text-primary hover:bg-primary/10 transition-colors px-1"
        >
          <span className="material-symbols-outlined text-3xl">shopping_bag</span>
          {itemCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-primary text-background-dark text-[9px] font-bold rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </div>

    <AnimatePresence>
      {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[999] backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[280px] bg-background-dark border-r border-white/10 z-[1000] flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <img src="/images/BORDERBUILT (5)2.png" alt="BORDERBUILT" className="h-6" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="flex flex-col py-6 px-4 gap-6">
                <button
                  onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}
                  className={`text-left text-lg font-mono uppercase tracking-widest ${location.pathname === '/' ? 'text-primary' : 'text-gray-300'}`}
                >
                  {t('nav.home')}
                </button>
                <button
                  onClick={() => { navigate('/shop'); setIsMobileMenuOpen(false); }}
                  className={`text-left text-lg font-mono uppercase tracking-widest ${location.pathname.startsWith('/shop') ? 'text-primary' : 'text-gray-300'}`}
                >
                  {t('nav.shop')}
                </button>
                <button
                  onClick={() => { navigate('/winners'); setIsMobileMenuOpen(false); }}
                  className={`text-left text-lg font-mono uppercase tracking-widest ${location.pathname.startsWith('/winners') ? 'text-primary' : 'text-gray-300'}`}
                >
                  {t('nav.winners')}
                </button>
                <button
                  onClick={() => { navigate('/garage'); setIsMobileMenuOpen(false); }}
                  className={`text-left text-lg font-mono uppercase tracking-widest ${location.pathname.startsWith('/garage') ? 'text-primary' : 'text-gray-300'}`}
                >
                  {t('nav.garage')}
                </button>
              </div>

              <div className="mt-auto p-4 border-t border-white/10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono uppercase text-gray-400">Language / Idioma</span>
                  <button
                    onClick={toggleLang}
                    className="text-primary font-bold px-3 py-1 bg-primary/10 rounded uppercase"
                  >
                    {lang === 'en' ? 'EN' : 'ES'}
                  </button>
                </div>

                {isAuthenticated ? (
                  <button
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-2 text-gray-400 hover:text-white uppercase font-mono text-sm"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-2 text-primary uppercase font-mono text-sm"
                  >
                    <span className="material-symbols-outlined text-lg">login</span>
                    Log In
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
