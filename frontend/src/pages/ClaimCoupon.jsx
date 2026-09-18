import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../stores/useAuthStore';
import { useGiveawayStore } from '../stores/useGiveawayStore';
import Button from '../components/ui/Button';
import EntryCounter from '../components/features/EntryCounter';
import PageTransition from '../components/layout/PageTransition';
import { useTranslation } from '../i18n/useTranslation';

const ClaimCoupon = () => {
  const { lang } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { addEntries } = useGiveawayStore();

  const [code, setCode] = useState(searchParams.get('code') || '');
  const [loading, setLoading] = useState(false);
  const [couponInfo, setCouponInfo] = useState(null);
  const [error, setError] = useState('');
  const [claimedData, setClaimedData] = useState(null);

  // --- Auth Guard ---
  // If the user is not logged in, save the pending code and redirect to login.
  useEffect(() => {
    if (!isAuthenticated) {
      const queryCode = searchParams.get('code');
      if (queryCode) {
        sessionStorage.setItem('pending_coupon_code', queryCode.trim().toUpperCase());
      }
      navigate('/login?redirect=/claim', { replace: true });
    }
  }, [isAuthenticated, navigate, searchParams]);

  // Auto-validate code from URL or sessionStorage once authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    const queryCode = searchParams.get('code');
    if (queryCode) {
      setCode(queryCode.toUpperCase());
      handleValidate(queryCode.toUpperCase());
    } else {
      const pending = sessionStorage.getItem('pending_coupon_code');
      if (pending) {
        setCode(pending);
        handleValidate(pending);
        sessionStorage.removeItem('pending_coupon_code');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Validar código en servidor
  const handleValidate = async (targetCode) => {
    const codeToTest = targetCode || code;
    if (!codeToTest.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeToTest.trim() })
      });

      const data = await res.json();

      if (!res.ok || data.status !== 'success') {
        throw new Error(data.messages?.error || data.message || 'Código inválido, expirado o ya utilizado.');
      }

      setCouponInfo(data.coupon);

      // Si está autenticado y es un cupón de entradas, canjear automáticamente
      if (isAuthenticated && user && data.coupon.reward_type === 'entries') {
        await handleClaim(codeToTest.trim());
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Procesar Canje
  const handleClaim = async (codeToClaim) => {
    const claimCode = codeToClaim || code;
    if (!claimCode.trim()) return;

    if (couponInfo && couponInfo.reward_type === 'discount') {
      setError('Este cupón es de descuento para tienda. Por favor aplícalo en la pantalla de Checkout al realizar tu compra.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/coupons/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: claimCode.trim().toUpperCase(),
          userId: user.id
        })
      });

      const data = await res.json();

      if (!res.ok || data.status !== 'success') {
        throw new Error(data.messages?.error || data.message || 'No se pudo canjear el cupón.');
      }

      if (data.rewardType === 'discount') {
        setError('Este cupón es de descuento para tienda y debe aplicarse en el Checkout.');
        return;
      }

      // Actualizar entradas en store del usuario localmente
      useAuthStore.getState().setUser({
        ...user,
        entries: data.newTotalEntries || user.entries || 0
      });

      addEntries(data.entriesAwarded || 0);
      sessionStorage.removeItem('pending_coupon_code');

      setClaimedData({
        entriesAwarded: data.entriesAwarded || 0,
        newTotalEntries: data.newTotalEntries || user.entries || 0,
        code: data.code || claimCode.trim().toUpperCase()
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything while redirecting unauthenticated users
  if (!isAuthenticated) return null;

  const firstName = user?.name?.split(' ')[0] || 'Usuario';

  return (
    <PageTransition className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 mb-4 shadow-[0_0_30px_rgba(106,244,37,0.2)]">
            <span className="material-symbols-outlined text-primary text-3xl">confirmation_number</span>
          </div>
          <h1 className="text-2xl font-black italic uppercase text-white tracking-wider">
            {lang === 'es' ? 'BORDERBUILT // CANJE' : 'BORDERBUILT // REDEEM'}
          </h1>
          <p className="text-xs font-mono text-gray-400 mt-1">
            Reclama tus entradas gratis para los sorteos activos
          </p>

          {/* Personalized user badge */}
          <div className="mt-4 inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
            <span className="material-symbols-outlined text-primary text-sm">person</span>
            <span className="text-xs font-mono text-gray-300">
              Sesión activa: <strong className="text-white">{firstName}</strong>
            </span>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

          <AnimatePresence mode="wait">
            {/* CANJE EXITOSO */}
            {claimedData ? (
              <motion.div
                key="claimed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4 space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-primary mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(106,244,37,0.6)]">
                  <span className="material-symbols-outlined text-black text-4xl font-bold">check</span>
                </div>

                <div>
                  <span className="bg-primary/20 text-primary border border-primary/40 font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                    ¡CUPÓN CANJEADO CON ÉXITO!
                  </span>
                  <p className="text-xs font-mono text-gray-400 mt-3">Código: <strong className="text-white">{claimedData.code}</strong></p>
                  <p className="text-xs font-mono text-gray-400 mt-1">Acreditado a: <strong className="text-primary">{user?.name}</strong></p>
                </div>

                <div className="bg-black/60 border border-primary/30 rounded-xl p-6 shadow-[0_0_20px_rgba(106,244,37,0.1)]">
                  <p className="text-xs uppercase font-mono text-gray-400 mb-1">{lang === 'es' ? 'Entradas Acreditadas' : 'Entries Credited'}</p>
                  <p className="text-5xl font-black text-primary drop-shadow-[0_0_15px_rgba(106,244,37,0.5)]">
                    +<EntryCounter value={claimedData.entriesAwarded} duration={1500} />
                  </p>
                  <p className="text-xs text-gray-400 mt-2 font-mono">
                    Total en tu cuenta: <strong className="text-white">{claimedData.newTotalEntries} entradas</strong>
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="secondary" onClick={() => navigate('/shop')} className="w-full">
                    Ir a la Tienda
                  </Button>
                  <Button onClick={() => navigate('/garage')} className="w-full">
                    Ver Mi Garage
                  </Button>
                </div>
              </motion.div>
            ) : (
              /* FORMULARIO DE CANJE */
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 relative z-10">
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-2">
                    Código Promocional
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="{lang === 'es' ? 'Ej. BORDER700' : 'E.g. BORDER700'}"
                      className="bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-base font-mono uppercase font-bold text-white w-full focus:outline-none focus:border-primary tracking-wider"
                    />
                    {!couponInfo && (
                      <Button
                        type="button"
                        onClick={() => handleValidate()}
                        disabled={loading || !code.trim()}
                        className="shrink-0"
                      >
                        {loading ? '...' : 'Validar'}
                      </Button>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
                    <p className="text-xs text-red-400 font-mono">⚠️ {error}</p>
                  </div>
                )}

                {/* INFORMACIÓN DEL CUPÓN VALIDADO */}
                {couponInfo && !claimedData && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 border border-primary/30 rounded-xl p-5 text-center space-y-4">
                    <div>
                      <p className="text-[10px] font-mono uppercase text-gray-400">Campaña: {couponInfo.campaign_name || 'BORDERBUILT'}</p>
                      <h3 className="text-lg font-bold text-white uppercase mt-1">{couponInfo.code}</h3>
                    </div>

                    {couponInfo.reward_type === 'entries' ? (
                      <div className="py-2">
                        <p className="text-xs font-mono text-gray-400 uppercase">{lang === 'es' ? 'Recompensa' : 'Reward'}</p>
                        <p className="text-4xl font-black text-primary drop-shadow-[0_0_10px_rgba(106,244,37,0.4)]">
                          {couponInfo.entries_count} {lang === 'es' ? 'ENTRADAS' : 'ENTRIES'}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1">Código promocional de 1 solo uso</p>
                      </div>
                    ) : (
                      <div className="py-2">
                        <p className="text-xs font-mono text-gray-400 uppercase">{lang === 'es' ? 'Descuento de Tienda' : 'Store Discount'}</p>
                        <p className="text-3xl font-black text-primary">
                          {couponInfo.type === 'percentage' ? `${couponInfo.value}% OFF` : `$${couponInfo.value} USD OFF`}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1">Este cupón es aplicable durante el Checkout en la compra de mercancía.</p>
                      </div>
                    )}

                    <Button onClick={() => handleClaim()} disabled={loading} className="w-full text-base py-3">
                      {loading ? 'Procesando Canje...' : '¡Reclamar Entradas Ahora!'}
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
};

export default ClaimCoupon;
