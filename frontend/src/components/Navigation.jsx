import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../i18n/useTranslation';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Don't show nav on admin, checkout, login pages
  const hiddenPaths = ['/admin', '/checkout', '/login', '/legal'];
  const shouldHide = hiddenPaths.some((p) => location.pathname.startsWith(p));
  if (shouldHide) return null;

  const tabs = [
    { path: '/', icon: 'home', label: t('nav.home') },
    { path: '/shop', icon: 'storefront', label: t('nav.shop') },
    { path: '/winners', icon: 'trophy', label: t('nav.winners') },
    { path: '/garage', icon: 'person', label: t('nav.profile') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1e]/95 backdrop-blur-xl border-t border-white/10 md:hidden">
      <div className="flex items-center justify-around px-2 py-3 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path || (tab.path === '/shop' && location.pathname.startsWith('/shop'));

          const handleTabClick = () => {
            navigate(tab.path);
          };

          return (
            <button
              key={tab.path}
              onClick={handleTabClick}
              className={`flex flex-col items-center justify-center gap-1 flex-1 transition-colors relative ${
                isActive
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {isActive && (
                <div className="absolute -top-3 w-8 h-1 bg-primary rounded-full shadow-[0_0_10px_#6af425]" />
              )}
              <span className="material-symbols-outlined text-2xl">
                {tab.icon}
              </span>
              <span className={`text-[10px] uppercase tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      {/* Safe area spacer */}
      <div className="h-4 w-full" />
    </nav>
  );
};

export default Navigation;
