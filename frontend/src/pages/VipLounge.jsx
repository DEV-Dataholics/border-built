import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../stores/useAuthStore';
import { useVipPollStore } from '../stores/useVipPollStore';
import { useTranslation } from '../i18n/useTranslation';
import PageTransition from '../components/layout/PageTransition';

const VipLounge = () => {
  const { lang } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isVip } = useAuthStore();
  const { polls, loading, submitting, fetchPolls, castVote } = useVipPollStore();
  const { t } = useTranslation();

  // State for vote confirmation modal
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    if (user?.id) {
      fetchPolls(user.id);
    }
  }, [isAuthenticated, user?.id, fetchPolls, navigate]);

  const handleOpenConfirmModal = (poll, option) => {
    setSelectedPoll(poll);
    setSelectedOption(option);
  };

  const handleCloseConfirmModal = () => {
    setSelectedPoll(null);
    setSelectedOption(null);
  };

  const handleConfirmVote = async () => {
    if (!selectedPoll || !selectedOption || !user?.id) return;
    const res = await castVote(selectedPoll.id, selectedOption.id, user.id);
    if (!res.success) {
      alert(res.error || 'No se pudo registrar el voto.');
    }
    handleCloseConfirmModal();
  };

  // VIP Gatekeeping Restricted Access View
  if (isAuthenticated && !isVip()) {
    return (
      <PageTransition className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white/5 border border-amber-500/30 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.15)]">
          <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <span className="material-symbols-outlined text-amber-400 text-4xl">lock</span>
          </div>
          <h2 className="text-2xl font-black italic uppercase text-white mb-3">
            Acceso Exclusivo VIP
          </h2>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            El <strong className="text-amber-400">VIP Lounge</strong> es un espacio reservado para miembros VIP de BORDERBUILT. Aquí definimos en comunidad el próximo auto a construir y modificar.
          </p>
          <button
            onClick={() => navigate('/garage')}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold uppercase tracking-wider rounded-xl hover:brightness-110 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
          >
            Volver a My Garage
          </button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="min-h-screen bg-[#070708] text-white pb-24">
      {/* Top Bar Header */}
      <div className="sticky top-0 z-40 bg-[#070708]/80 backdrop-blur-md border-b border-amber-500/20">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/garage')}
            className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors text-sm font-bold uppercase tracking-wider"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            My Garage
          </button>
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
            VIP Pass Active
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Banner Hero */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#181308] via-[#241c0c] to-[#120e06] border border-amber-500/30 p-8 md:p-12 mb-10 shadow-[0_0_40px_rgba(245,158,11,0.12)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full filter blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-widest mb-4">
              [ VIP LOUNGE // HIGH-OCTANE DECISIONS ]
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tight text-white mb-4">
              Tu Voto Construye el Próximo Auto 🏎️
            </h1>
            <p className="text-gray-300 text-base leading-relaxed">
              Bienvenido al VIP Lounge. Como miembro distinguido, tienes voz directa en las decisiones oficiales del taller de BORDERBUILT.
            </p>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold uppercase italic text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            {lang === 'es' ? 'Votaciones Activas' : 'Active Polls'}
          </h2>
          <span className="text-xs text-gray-500 font-mono">1 Usuario = 1 Voto Inmutable</span>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm font-mono">Cargando encuestas del servidor VIP...</p>
          </div>
        ) : polls.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <span className="material-symbols-outlined text-gray-500 text-5xl mb-3">how_to_vote</span>
            <p className="text-gray-400 font-bold uppercase text-sm">No hay votaciones activas en este momento.</p>
            <p className="text-gray-500 text-xs mt-1">Nuevas encuestas se publicarán pronto.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {polls.map((poll) => (
              <div
                key={poll.id}
                className="bg-[#12100c] border border-amber-500/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
              >
                {/* Header Encuesta */}
                <div className="mb-6 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black italic uppercase text-white mb-2">
                      {poll.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{poll.description}</p>
                  </div>
                  {poll.has_voted ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/50 rounded-xl text-amber-300 text-xs font-bold uppercase tracking-wider shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      Voto Emitido
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-gray-300 text-xs font-bold uppercase tracking-wider shrink-0">
                      <span className="material-symbols-outlined text-[18px]">touch_app</span>
                      Pendiente por votar
                    </div>
                  )}
                </div>

                {/* {lang === 'es' ? 'OPCIONES' : 'OPTIONS'} DE ENCUESTA */}
                {!poll.has_voted ? (
                  /* ESTADO PRE-VOTO: Selección de Opciones */
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {poll.options.map((opt) => (
                      <div
                        key={opt.id}
                        className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 group flex flex-col justify-between"
                      >
                        <div className="aspect-video bg-black/40 relative overflow-hidden">
                          {opt.image_url ? (
                            <img
                              src={opt.image_url}
                              alt={opt.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-white/5">
                              <span className="material-symbols-outlined text-gray-600 text-4xl">directions_car</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <h4 className="font-bold text-white text-base mb-4 group-hover:text-amber-300 transition-colors">
                            {opt.name}
                          </h4>
                          <button
                            onClick={() => handleOpenConfirmModal(poll, opt)}
                            disabled={submitting}
                            className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold uppercase text-xs tracking-wider rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-sm">how_to_vote</span>
                            {lang === 'es' ? 'Votar' : 'Vote'} Por Este Auto
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* ESTADO POST-VOTO: Resultados Animados en Vivo */
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                      <span>EVOLUCIÓN EN VIVO DE VOTACIÓN</span>
                      <span>Total Votos: <strong className="text-amber-400">{poll.total_votes || 0}</strong></span>
                    </div>

                    <div className="space-y-4">
                      {poll.options.map((opt) => {
                        const isSelected = opt.id === poll.user_voted_option_id;
                        const pct = opt.percentage || 0;

                        return (
                          <div
                            key={opt.id}
                            className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                              isSelected
                                ? 'bg-amber-500/10 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                                : 'bg-white/5 border-white/10'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2 z-10 relative">
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-white text-base">
                                  {opt.name}
                                </span>
                                {isSelected && (
                                  <span className="px-2.5 py-0.5 bg-amber-400 text-black font-black text-[10px] uppercase rounded-full tracking-widest shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                                    TU SELECCIÓN VIP
                                  </span>
                                )}
                              </div>
                              <div className="text-right font-mono">
                                <span className="font-extrabold text-amber-400 text-lg">{pct}%</span>
                                <span className="text-xs text-gray-400 ml-2">({opt.votes_count || 0} votos)</span>
                              </div>
                            </div>

                            {/* Barra de Porcentaje Animada con Framer Motion */}
                            <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden p-0.5 border border-white/10 relative">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 1.2, ease: 'easeOut' }}
                                className={`h-full rounded-full ${
                                  isSelected
                                    ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.8)]'
                                    : 'bg-gradient-to-r from-gray-600 to-gray-400'
                                }`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {selectedPoll && selectedOption && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#14120e] border border-amber-500/40 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-[0_0_50px_rgba(245,158,11,0.25)] relative overflow-hidden"
            >
              <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-amber-400 text-3xl">how_to_vote</span>
              </div>
              <h3 className="text-2xl font-black italic uppercase text-center text-white mb-2">
                ¿Confirmar Voto Definitivo?
              </h3>
              <p className="text-gray-300 text-sm text-center mb-4">
                Estás a punto de emitir tu voto por:
              </p>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center font-bold text-amber-300 text-base mb-6">
                {selectedOption.name}
              </div>
              <p className="text-xs text-amber-400/80 font-mono text-center mb-6 bg-amber-500/5 p-3 rounded-lg border border-amber-500/20">
                ⚠️ Recordatorio: Tu voto es único, inmutable y no podrá ser modificado una vez confirmado.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleCloseConfirmModal}
                  disabled={submitting}
                  className="py-3 bg-white/10 hover:bg-white/20 text-white font-bold uppercase text-xs rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmVote}
                  disabled={submitting}
                  className="py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold uppercase text-xs rounded-xl hover:brightness-110 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Sí, Confirmar Voto'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default VipLounge;
