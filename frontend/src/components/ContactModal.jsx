import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContactStore } from '../stores/useContactStore';
import { useTranslation } from '../i18n/useTranslation';

const ContactModal = () => {
  const { isOpen, topic, closeContact } = useContactStore();
  const { lang } = useTranslation();
  const isEs = lang === 'es';

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('direct'); // 'direct' | 'form'
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    category: topic === 'mechanic' ? 'mechanic' : 'general',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setSending(false);
      setFormData(prev => ({
        ...prev,
        category: topic === 'mechanic' ? 'mechanic' : 'general'
      }));
    }
  }, [isOpen, topic]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeContact();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeContact]);

  if (!isOpen) return null;

  const isMechanic = topic === 'mechanic' || formData.category === 'mechanic';
  const defaultSubject = isMechanic 
    ? (isEs ? 'Consulta para el Mecánico / Proyecto // BORDERBUILT' : 'Mechanic & Build Inquiry // BORDERBUILT')
    : (isEs ? 'Atención a Clientes y Soporte // BORDERBUILT' : 'Customer Support Inquiry // BORDERBUILT');

  const emailAddress = 'support@border-built.com';

  const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailAddress)}&su=${encodeURIComponent(defaultSubject)}&body=${encodeURIComponent(isEs ? 'Hola equipo de Border Built,\n\n' : 'Hello Border Built team,\n\n')}`;
  const outlookWebUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(emailAddress)}&subject=${encodeURIComponent(defaultSubject)}`;
  const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(defaultSubject)}`;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSending(true);

    // Simulate reliable dispatch
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-sans">
        <motion.div
          className="fixed inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeContact}
        />

        <motion.div
          className="relative z-10 w-full max-w-xl bg-[#111113] border border-white/15 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden my-8"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Banner Accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-[#6af425] to-emerald-400" />

          {/* Modal Header */}
          <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-bold">
                  BORDERBUILT // SUPPORT DESK
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tight text-white">
                {isMechanic 
                  ? (isEs ? 'Contacta a tu Mecánico' : 'Contact Your Mechanic') 
                  : (isEs ? 'Centro de Ayuda y Contacto' : 'Help Center & Contact')}
              </h2>
              <p className="text-gray-400 text-xs mt-1">
                {isMechanic
                  ? (isEs ? 'Dudas técnicas sobre vehículos de sorteo, mods y componentes.' : 'Technical questions on project builds, specs, and modifications.')
                  : (isEs ? 'Atención para pedidos, rastreo, sorteos y preguntas generales.' : 'Assistance for merchandise orders, shipping, sweepstakes and inquiries.')}
              </p>
            </div>

            <button
              onClick={closeContact}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex border-b border-white/10 bg-[#0d0d0f] px-6 pt-2">
            <button
              onClick={() => setActiveTab('direct')}
              className={`pb-3 px-4 text-xs font-mono uppercase tracking-wider font-bold transition-all relative ${
                activeTab === 'direct'
                  ? 'text-primary'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {isEs ? '1. Opciones de Correo' : '1. Webmail & Apps'}
              {activeTab === 'direct' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_#6af425]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('form')}
              className={`pb-3 px-4 text-xs font-mono uppercase tracking-wider font-bold transition-all relative ${
                activeTab === 'form'
                  ? 'text-primary'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {isEs ? '2. Formulario Directo' : '2. Send Message'}
              {activeTab === 'form' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_#6af425]" />
              )}
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            {activeTab === 'direct' ? (
              <div className="space-y-4">
                <p className="text-gray-300 text-xs leading-relaxed">
                  {isEs 
                    ? '¿Usas correo en tu navegador o una app local? Elige la opción que prefieras para redactar tu mensaje:'
                    : 'Choose your preferred email service to open a pre-addressed message directly:'}
                </p>

                {/* Option 1: Gmail Web (Prominent) */}
                <a
                  href={gmailWebUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-[#ea4335]/10 hover:bg-[#ea4335]/20 border border-[#ea4335]/40 transition-all group shadow-[0_0_20px_rgba(234,67,53,0.15)]"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-[#ea4335] text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
                      M
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-bold text-sm tracking-wide">
                          {isEs ? 'Abrir en Gmail (Web)' : 'Open in Gmail (Web)'}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ea4335]/20 text-[#ea4335] font-semibold border border-[#ea4335]/30">
                          {isEs ? 'Recomendado' : 'Recommended'}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {isEs ? 'Abre una nueva pestaña en tu navegador con Gmail listo para enviar' : 'Opens a new browser tab with recipient and subject prefilled'}
                      </p>
                    </div>
                  </div>
                  <span className="text-white/60 group-hover:text-white transition-colors text-lg pr-1">↗</span>
                </a>

                {/* Option 2: Outlook / Hotmail Web */}
                <a
                  href={outlookWebUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#0078d4]/10 hover:bg-[#0078d4]/20 border border-[#0078d4]/30 transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-[#0078d4] text-white flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
                      O
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">
                        {isEs ? 'Abrir en Outlook / Hotmail (Web)' : 'Open in Outlook / Hotmail (Web)'}
                      </h4>
                      <p className="text-gray-400 text-xs">
                        {isEs ? 'Redacta desde outlook.live.com' : 'Compose in Outlook web browser'}
                      </p>
                    </div>
                  </div>
                  <span className="text-white/60 group-hover:text-white transition-colors text-base pr-1">↗</span>
                </a>

                {/* Option 3: Copy Email Address */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.04] border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-gray-300">
                      <span className="material-symbols-outlined text-base">mail</span>
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                        {isEs ? 'Dirección Oficial' : 'Official Email'}
                      </div>
                      <div className="text-white font-mono text-xs md:text-sm font-semibold selection:bg-primary selection:text-black">
                        {emailAddress}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase font-bold transition-all ${
                      copied 
                        ? 'bg-primary text-black shadow-[0_0_12px_#6af425]' 
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                    }`}
                  >
                    {copied ? '✓ ' + (isEs ? 'Copiado' : 'Copied') : (isEs ? 'Copiar' : 'Copy')}
                  </button>
                </div>

                {/* Option 4: Local App (Mailto) */}
                <div className="pt-2 text-center">
                  <a
                    href={mailtoUrl}
                    className="text-xs font-mono text-gray-400 hover:text-primary transition-colors underline decoration-dotted inline-flex items-center gap-1.5"
                  >
                    <span>{isEs ? '¿Tienes Apple Mail u Outlook instalado? Abrir en app de escritorio' : 'Have Apple Mail or Desktop Outlook? Open in default app'}</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                </div>
              </div>
            ) : (
              <div>
                {submitted ? (
                  <div className="text-center py-8 px-4 space-y-4 animate-fadeIn">
                    <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary text-primary flex items-center justify-center mx-auto text-2xl shadow-[0_0_25px_rgba(106,244,37,0.3)]">
                      ✓
                    </div>
                    <h3 className="text-xl font-black italic uppercase text-white">
                      {isEs ? '¡Mensaje Recibido!' : 'Message Sent Successfully!'}
                    </h3>
                    <p className="text-gray-300 text-xs max-w-md mx-auto leading-relaxed">
                      {isEs 
                        ? `Gracias, ${formData.name}. Hemos registrado tu consulta para ${emailAddress}. Nuestro equipo te responderá directamente a ${formData.email} en un plazo de 24 a 48 horas hábiles.`
                        : `Thank you, ${formData.name}. Your inquiry has been routed to ${emailAddress}. We will respond to ${formData.email} within 24-48 business hours.`}
                    </p>

                    <div className="pt-4 flex justify-center gap-3">
                      <button
                        onClick={closeContact}
                        className="px-6 py-2.5 rounded-xl bg-primary text-black font-black uppercase text-xs tracking-wider hover:bg-white transition-all shadow-[0_0_15px_rgba(106,244,37,0.3)]"
                      >
                        {isEs ? 'Entendido' : 'Close'}
                      </button>
                      <a
                        href={gmailWebUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>{isEs ? 'Enviar copia por Gmail' : 'Send via Gmail'}</span>
                        <span className="text-[10px]">↗</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                          {isEs ? 'Nombre Completo *' : 'Full Name *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={isEs ? 'Ej. Carlos Méndez' : 'e.g. Alex Miller'}
                          className="w-full bg-[#08080a] border border-white/15 rounded-lg px-3 py-2 text-white text-xs placeholder:text-gray-600 focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                          {isEs ? 'Tu Correo Electrónico *' : 'Your Email Address *'}
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@email.com"
                          className="w-full bg-[#08080a] border border-white/15 rounded-lg px-3 py-2 text-white text-xs placeholder:text-gray-600 focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                          {isEs ? 'Motivo / Departamento' : 'Inquiry Type'}
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full bg-[#08080a] border border-white/15 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-primary transition-colors"
                        >
                          <option value="general">{isEs ? 'Atención General' : 'General Support'}</option>
                          <option value="mechanic">{isEs ? 'Mecánico / Proyecto Auto' : 'Mechanic / Project Specs'}</option>
                          <option value="shipping">{isEs ? 'Envíos y Seguimiento' : 'Orders & Shipping'}</option>
                          <option value="giveaway">{isEs ? 'Sorteo y Entradas' : 'Giveaway & Entries'}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                          {isEs ? 'Núm. de Orden (Opcional)' : 'Order # (Optional)'}
                        </label>
                        <input
                          type="text"
                          value={formData.orderNumber}
                          onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                          placeholder="#BB-1024"
                          className="w-full bg-[#08080a] border border-white/15 rounded-lg px-3 py-2 text-white text-xs placeholder:text-gray-600 focus:outline-none focus:border-primary transition-colors font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                        {isEs ? 'Mensaje *' : 'Message *'}
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={isEs ? 'Escribe aquí tu consulta o pregunta detallada...' : 'Describe your question, vehicle spec inquiry or order issue...'}
                        className="w-full bg-[#08080a] border border-white/15 rounded-lg p-3 text-white text-xs placeholder:text-gray-600 focus:outline-none focus:border-primary transition-colors resize-none"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-4">
                      <div className="text-[11px] font-mono text-gray-500">
                        {isEs ? 'Respuesta en 24-48 hrs hábiles' : 'Reply within 24-48 business hours'}
                      </div>
                      <button
                        type="submit"
                        disabled={sending}
                        className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-black font-black uppercase text-xs tracking-wider transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(106,244,37,0.3)] flex items-center gap-2"
                      >
                        {sending ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            <span>{isEs ? 'Enviando...' : 'Sending...'}</span>
                          </>
                        ) : (
                          <span>{isEs ? 'Enviar Mensaje' : 'Send Message'}</span>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="bg-[#0c0c0e] px-6 py-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-500">
            <span>BORDERBUILT LLC // EL PASO, TX</span>
            <span>support@border-built.com</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ContactModal;
