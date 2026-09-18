import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../i18n/useTranslation';
import { useContactStore } from '../stores/useContactStore';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useTranslation();
  const openContact = useContactStore(s => s.openContact);
  const isEs = lang === 'es';

  // Hide on admin routes, login, checkout
  const hiddenPaths = ['/admin', '/checkout', '/login'];
  const shouldHide = hiddenPaths.some(p => location.pathname.startsWith(p));
  if (shouldHide) return null;

  const goToLegalTab = (tab) => {
    navigate(`/legal?tab=${tab}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#050505] border-t border-white/10 pt-16 pb-32 md:pb-16 mt-auto font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-sm text-gray-400">
        
        {/* Column 1: Get Help */}
        <div className="flex flex-col gap-3.5 items-start">
          <h4 className="text-white font-bold uppercase tracking-wider font-mono text-xs text-primary mb-1">
            {isEs ? 'Ayuda y Soporte' : 'Get Help'}
          </h4>
          <button 
            type="button"
            onClick={() => openContact('support')} 
            className="hover:text-primary transition-colors text-left cursor-pointer"
          >
            {isEs ? 'Centro de Ayuda / Contacto' : 'Help Center / Contact'}
          </button>
          <button 
            type="button"
            onClick={() => openContact('mechanic')} 
            className="hover:text-primary transition-colors text-left cursor-pointer"
          >
            {isEs ? 'Contacta a tu mecánico' : 'Contact your mechanic'}
          </button>
          <button 
            type="button"
            onClick={() => goToLegalTab('shipping')} 
            className="hover:text-primary transition-colors text-left cursor-pointer"
          >
            {isEs ? 'Envíos y entregas' : 'Shipping & deliveries'}
          </button>
          <button 
            type="button"
            onClick={() => goToLegalTab('returns')} 
            className="hover:text-primary transition-colors text-left cursor-pointer"
          >
            {isEs ? 'Cambios y devoluciones' : 'Returns & exchanges'}
          </button>
          <button 
            type="button"
            onClick={() => goToLegalTab('scams')} 
            className="hover:text-primary transition-colors text-left cursor-pointer"
          >
            {isEs ? 'Evitar estafas' : 'Prevent scams'}
          </button>
        </div>

        {/* Column 2: Legal */}
        <div className="flex flex-col gap-3.5 items-start">
          <h4 className="text-white font-bold uppercase tracking-wider font-mono text-xs text-primary mb-1">
            {isEs ? 'Legales' : 'Legal'}
          </h4>
          <button 
            type="button"
            onClick={() => goToLegalTab('terms')} 
            className="hover:text-primary transition-colors text-left cursor-pointer"
          >
            {isEs ? 'Términos y Condiciones' : 'Terms & Conditions'}
          </button>
          <button 
            type="button"
            onClick={() => goToLegalTab('privacy')} 
            className="hover:text-primary transition-colors text-left cursor-pointer"
          >
            {isEs ? 'Política de Privacidad' : 'Privacy Policy'}
          </button>
          <button 
            type="button"
            onClick={() => goToLegalTab('rules')} 
            className="hover:text-primary transition-colors text-left cursor-pointer"
          >
            {isEs ? 'Reglas Oficiales' : 'Official Rules'}
          </button>
          <button 
            type="button"
            onClick={() => goToLegalTab('rules')} 
            className="hover:text-primary transition-colors text-left cursor-pointer"
          >
            {isEs ? 'Aviso de Sorteo' : 'Sweepstakes Disclaimer'}
          </button>
        </div>

        {/* Column 3: Sweepstakes Disclaimer */}
        <div className="flex flex-col gap-4 text-xs leading-relaxed text-gray-500">
          <h4 className="text-white font-bold uppercase tracking-wider font-mono text-xs text-primary mb-1">
            {isEs ? 'Aviso Legal' : 'Disclaimer'}
          </h4>
          <p>
            {isEs 
              ? 'NO ES NECESARIA NINGUNA COMPRA PARA PARTICIPAR O GANAR. UNA COMPRA NO AUMENTARÁ SUS POSIBILIDADES DE GANAR. Abierto únicamente a residentes legales de los 48 estados contiguos de Estados Unidos y D.C., y las personas deben tener al menos 18 años de edad y una licencia de conducir válida. Nulo en AK, HI, México y donde lo prohíba la ley.' 
              : 'NO PURCHASE NECESSARY TO ENTER OR WIN. A PURCHASE WILL NOT INCREASE YOUR CHANCES OF WINNING. Open only to legal residents of the 48 contiguous United States and D.C., and individuals must be at least 18 years old and have a valid driver\'s license. Void in AK, HI, Mexico, and where prohibited by law.'}
          </p>
          <p>
            {isEs ? 'Para las reglas completas y el método de entrada gratuita, consulta las ' : 'For full rules and free entry method, click '}
            <button 
              type="button"
              onClick={() => goToLegalTab('rules')} 
              className="text-primary hover:underline font-bold"
            >
              {isEs ? 'Reglas Oficiales' : 'Official Rules'}
            </button>.
          </p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-gray-600">
        <p>&copy; {new Date().getFullYear()} {isEs ? 'Border Built. Todos los derechos reservados.' : 'Border Built. All rights reserved.'}</p>
        <div className="flex gap-6">
          <a 
            href="https://instagram.com/borderbuilt" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <span>Instagram</span>
            <span className="text-[10px]">↗</span>
          </a>
          <a 
            href="https://tiktok.com/@borderbuilt" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <span>TikTok</span>
            <span className="text-[10px]">↗</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
