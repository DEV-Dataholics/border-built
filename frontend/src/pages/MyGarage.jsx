import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useTranslation } from '../i18n/useTranslation';
import TachometerGauge from '../components/features/TachometerGauge';
import Header from '../components/Header';
import PageTransition from '../components/layout/PageTransition';

const MyGarage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { t, lang } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [userData, setUserData] = useState(null);

  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState(null);
  const [claimingCoupon, setClaimingCoupon] = useState(false);

  const handleClaimCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    
    setClaimingCoupon(true);
    setCouponStatus(null);
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/coupons/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), userId: user.id })
      });
      const data = await res.json();
      
      if (!res.ok) {
        setCouponStatus({ type: 'error', message: data.messages?.error || data.message || 'Error al canjear el cupón.' });
      } else {
        if (data.rewardType === 'entries') {
          setCouponStatus({ type: 'success', message: `¡Éxito! +${data.entriesAwarded} entradas añadidas a tu Garage.` });
          setCouponCode('');
          if (userData) {
            setUserData(prev => ({ ...prev, entries: data.newTotalEntries }));
          }
        } else {
          setCouponStatus({ type: 'error', message: 'Este cupón es de descuento. Úsalo en el Checkout de la tienda.' });
        }
      }
    } catch (err) {
      setCouponStatus({ type: 'error', message: 'Error de red al intentar canjear el cupón.' });
    } finally {
      setClaimingCoupon(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          setUserData(user); // Fallback for mock users not in DB
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserData(user);
      }
    };

    const fetchUserOrders = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/user/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          // API returns sorted by created_at DESC, but just to be sure:
          setOrders(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        }
      } catch (error) {
        console.error('Error fetching user orders:', error);
      }
    };

    fetchUserData();
    fetchUserOrders();
  }, [user, isAuthenticated, navigate]);

  if (!isAuthenticated || !userData) return null;

  // Only count entries/spending from valid (completed/shipped) orders
  const validStatuses = ['completed', 'shipped'];
  const validOrders = orders.filter(o => validStatuses.includes(o.status));
  const orderEntries = validOrders.reduce((sum, o) => sum + (parseInt(o.entries_earned) || 0), 0);
  const totalSpent = validOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  // Add coupon-awarded entries stored directly on the user record in the DB
  const couponEntries = parseInt(userData?.entries) || 0;
  const totalEntries = orderEntries + couponEntries;

  return (
    <PageTransition className="flex-1 flex flex-col pb-24 md:pb-8 bg-carbon-pattern min-h-screen">
      <Header />

      <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full">
        {/* Title & Logout */}
        <div className="flex items-center justify-between mb-8">
          <div className="w-10"></div>
          <h1 className="text-3xl font-black italic uppercase text-white text-center">
            {t('garage.title')}
          </h1>
          <button 
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-white/5 rounded-full transition-colors"
            title="Logout"
          >
            <span className="material-symbols-outlined text-2xl">logout</span>
          </button>
        </div>

        {/* Tachometer */}
        <div className="flex justify-center mb-8">
          <TachometerGauge
            value={totalEntries}
            max={10000}
            label={t('garage.totalEntries')}
          />
        </div>

        {/* VIP Lounge Banner */}
        {(userData?.is_vip || user?.is_vip) ? (
          <div className="mb-8 relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-r from-[#1a1408] via-[#2a200e] to-[#140e06] p-6 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  <span className="material-symbols-outlined text-2xl">workspace_premium</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black italic uppercase text-lg text-white">{t('garage.vipTitle')}</h3>
                    <span className="px-2 py-0.5 bg-amber-400 text-black text-[10px] font-black uppercase rounded tracking-wider">{t('garage.vipExclusive')}</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5">{t('garage.vipDesc')}</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/vip-lounge')}
                className="px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-black font-extrabold uppercase text-xs tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 shrink-0"
              >
                <span>{t('garage.vipAccess')}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-8 relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4 opacity-75">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 shrink-0">
                  <span className="material-symbols-outlined text-2xl">lock</span>
                </div>
                <div>
                  <h3 className="font-bold uppercase text-base text-gray-300">{t('garage.vipLocked')}</h3>
                  <p className="text-gray-500 text-xs mt-0.5">{t('garage.vipLockedDesc')}</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/vip-lounge')}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-gray-300 font-bold uppercase text-xs rounded-xl transition-colors shrink-0"
              >
                {t('garage.vipBenefits')}
              </button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
            <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">{t('garage.totalEntries')}</p>
            <p className="text-white text-xl font-black font-mono">{totalEntries.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
            <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">{t('garage.totalSpent')}</p>
            <p className="text-white text-xl font-black font-mono">${totalSpent.toFixed(2)}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
            <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">{t('garage.orders')}</p>
            <p className="text-white text-xl font-black font-mono">{validOrders.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
            <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">{t('garage.memberSince')}</p>
            <p className="text-white text-sm font-mono">{userData.created_at ? new Date(userData.created_at).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>

        {/* Redeem Event Coupon */}
        <div className="mb-8 relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="font-bold uppercase text-lg text-white flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary">confirmation_number</span>
                {lang === 'es' ? 'Canjear Cupón de Evento' : 'Redeem Event Coupon'}
              </h3>
              <p className="text-gray-400 text-xs">
                {lang === 'es' 
                  ? 'Si realizaste una compra en persona en un evento, ingresa tu código aquí para sumar tus entradas.' 
                  : 'If you made an in-person purchase at an event, enter your code here to claim your entries.'}
              </p>
            </div>
            
            <form onSubmit={handleClaimCoupon} className="flex-1 flex flex-col sm:flex-row gap-2 w-full max-w-md">
              <input
                type="text"
                placeholder={lang === 'es' ? 'CÓDIGO' : 'CODE'}
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono uppercase focus:outline-none focus:border-primary transition-colors text-sm placeholder:text-gray-600"
                maxLength={20}
                required
              />
              <button
                type="submit"
                disabled={claimingCoupon || !couponCode.trim()}
                className="bg-primary hover:bg-[#5ce020] text-black font-black uppercase text-xs px-6 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(106,244,37,0.3)] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
              >
                {claimingCoupon 
                  ? (lang === 'es' ? 'CANJEANDO...' : 'CLAIMING...') 
                  : (lang === 'es' ? 'CANJEAR' : 'REDEEM')}
              </button>
            </form>
          </div>
          
          {couponStatus && (
            <div className={`mt-4 p-3 rounded-lg text-xs font-mono border flex items-start gap-2 ${
              couponStatus.type === 'success' 
                ? 'bg-primary/10 border-primary/30 text-primary' 
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              <span className="material-symbols-outlined text-base">
                {couponStatus.type === 'success' ? 'check_circle' : 'error'}
              </span>
              <span className="mt-0.5">{couponStatus.message}</span>
            </div>
          )}
        </div>

        {/* Order History */}
        <div>
          <h2 className="text-lg font-bold uppercase italic text-white mb-4 border-l-4 border-primary pl-3">
            {t('garage.orderHistory')}
          </h2>

          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <span className="material-symbols-outlined text-4xl opacity-20 mb-2 block">receipt_long</span>
              <p className="text-sm uppercase font-mono">{t('garage.noOrders')}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map((order) => {
                const status = order.status || order.shippingStatus || 'pending';
                const isCancelled = status === 'cancelled';
                const statusStyle = 
                  status === 'delivered' || status === 'completed' ? 'bg-primary/20 text-primary border-primary/40' :
                  status === 'shipped' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' :
                  isCancelled ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                  'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
                const statusLabel = 
                  status === 'delivered' ? t('garage.statusDelivered') :
                  status === 'completed' ? t('garage.statusCompleted') :
                  status === 'shipped' ? t('garage.statusShipped') :
                  isCancelled ? t('garage.statusCancelled') :
                  t('garage.statusPending');

                return (
                <div key={order.id} className={`bg-white/5 border border-white/10 rounded-xl p-4 ${isCancelled ? 'opacity-50' : ''}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-bold text-sm uppercase">{order.id}</p>
                        <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border uppercase ${statusStyle}`}>
                          {statusLabel}
                        </span>
                      </div>
                      <p className="text-gray-500 text-[10px] font-mono">
                        {new Date(order.created_at || order.createdAt).toLocaleDateString()} — {new Date(order.created_at || order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-mono font-bold">${order.total?.toFixed(2)}</p>
                      <div className={`text-[10px] font-bold uppercase ${isCancelled ? 'text-red-400 line-through' : 'text-primary'}`}>
                        +{(order.entries_earned || order.entriesEarned)?.toLocaleString()} entries
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {order.items?.map((item, idx) => (
                      <span key={idx} className="text-[10px] bg-white/5 text-gray-400 px-2 py-1 rounded font-mono">
                        {item.name} ×{item.quantity}
                      </span>
                    ))}
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </PageTransition>
  );
};

export default MyGarage;
