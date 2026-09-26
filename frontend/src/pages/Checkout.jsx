import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCartStore } from '../stores/useCartStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useConfigStore } from '../stores/useConfigStore';
import { useGiveawayStore } from '../stores/useGiveawayStore';
import { useTranslation } from '../i18n/useTranslation';
import { LOCATION_DATA } from '../lib/locationData';
import { getStateTaxInfo } from '../lib/taxRates';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import EntryCounter from '../components/features/EntryCounter';
import PageTransition from '../components/layout/PageTransition';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

const normalizeCountryName = (cStr) => {
  if (!cStr) return 'United States';
  const lower = cStr.toLowerCase();
  if (lower === 'us' || lower.includes('united') || lower.includes('eeuu')) return 'United States';
  if (lower === 'mx' || lower.includes('mÃ©x') || lower.includes('mex')) return 'México';
  if (lower === 'ca' || lower.includes('can')) return 'Canada';
  return cStr;
};

// Separamos el contenido para poder usar useStripe y useElements
const CheckoutContent = () => {
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  
  const { 
    items, getSubtotal, getShipping, getDiscount, getTotal, getTax, getTotalEntries, 
    appliedCoupon, applyCoupon, removeCoupon, clearCart 
  } = useCartStore();
  const { user } = useAuthStore();
  const getMultiplier = useConfigStore((state) => state.getMultiplier);
  const multiplier = getMultiplier();
  const { addEntries } = useGiveawayStore();

  const [checkoutEnabled, setCheckoutEnabled] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/checkout-status`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && typeof data.checkoutEnabled === 'boolean') {
          setCheckoutEnabled(data.checkoutEnabled);
        }
      })
      .catch(() => setCheckoutEnabled(false))
      .finally(() => setCheckoutLoading(false));
  }, []);

  const [step, setStep] = useState('form'); // 'form' | 'processing' | 'confirmed'
  const [finalEntries, setFinalEntries] = useState(0);

  const [isCustomState, setIsCustomState] = useState(false);
  const [isCustomCity, setIsCustomCity] = useState(false);

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || 'San Diego',
    state: user?.state || 'CA',
    zip: user?.zip_code || user?.zip || '',
    country: normalizeCountryName(user?.country),
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (user?.id) {
      fetch(`${import.meta.env.VITE_API_URL}/users/${user.id}`)
        .then(res => res.ok ? res.json() : null)
        .then(apiUser => {
          const u = apiUser || user;
          if (u) {
            const nameParts = (u.name || '').split(' ');
            const first = nameParts[0] || '';
            const last = nameParts.slice(1).join(' ') || '';
            const userCountry = normalizeCountryName(u.country);
            const userState = u.state || '';
            const userCity = u.city || '';

            const countryData = LOCATION_DATA[userCountry];
            const stateObj = countryData?.states?.find(s => s.code === userState || s.name === userState);
            const isKnownState = Boolean(stateObj);
            const isKnownCity = Boolean(stateObj?.cities?.includes(userCity));

            if (!isKnownState && userState) setIsCustomState(true);
            if (!isKnownCity && userCity) setIsCustomCity(true);

            setForm(prev => ({
              firstName: prev.firstName || first,
              lastName: prev.lastName || last,
              email: prev.email || u.email || '',
              address: prev.address || u.address || '',
              city: userCity || prev.city,
              state: userState || prev.state,
              zip: prev.zip || u.zip_code || u.zip || '',
              country: userCountry || prev.country,
              phone: prev.phone || u.phone || '',
            }));
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShipping();
  const taxInfo = getStateTaxInfo(form.state);
  const tax = getTax ? getTax(form.state) : 0.00;
  const total = getTotal ? getTotal(form.state) : (Math.max(0, subtotal - discount) + tax + shipping);
  const totalEntries = getTotalEntries();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    if (country === 'Other') {
      setIsCustomState(true);
      setIsCustomCity(true);
      setForm(prev => ({ ...prev, country, state: '', city: '' }));
      return;
    }

    const countryData = LOCATION_DATA[country];
    const defaultState = countryData?.states?.[0]?.code || '';
    const defaultCity = countryData?.states?.[0]?.cities?.[0] || '';

    setIsCustomState(false);
    setIsCustomCity(false);

    setForm(prev => ({
      ...prev,
      country,
      state: defaultState,
      city: defaultCity,
    }));
  };

  const handleStateChange = (e) => {
    const val = e.target.value;
    if (val === '__OTHER__') {
      setIsCustomState(true);
      setIsCustomCity(true);
      setForm(prev => ({ ...prev, state: '', city: '' }));
      return;
    }

    setIsCustomState(false);
    setIsCustomCity(false);

    const countryData = LOCATION_DATA[form.country];
    const stateObj = countryData?.states?.find(s => s.code === val || s.name === val);
    const firstCity = stateObj?.cities?.[0] || '';

    setForm(prev => ({
      ...prev,
      state: val,
      city: firstCity,
    }));
  };

  const handleCityChange = (e) => {
    const val = e.target.value;
    if (val === '__OTHER__') {
      setIsCustomCity(true);
      setForm(prev => ({ ...prev, city: '' }));
      return;
    }

    setIsCustomCity(false);
    setForm(prev => ({ ...prev, city: val }));
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    setCouponLoading(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCodeInput.trim(),
          subtotal: subtotal
        })
      });

      const data = await res.json();

      if (!res.ok || data.status !== 'success') {
        throw new Error(data.messages?.error || data.message || 'Cupón inválido o expirado');
      }

      applyCoupon(data.coupon);
      setCouponSuccess(`¡Cupón ${data.coupon.code} aplicado con éxito!`);
      setCouponCodeInput('');
    } catch (err) {
      setCouponError(err.message);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponSuccess('');
    setCouponError('');
  };

  // Stripe Payment Submission Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkoutEnabled) return;
    if (!stripe || !elements) return; // Stripe not loaded

    setStep('processing');
    setFinalEntries(totalEntries);

    try {
      // 1. Submit Elements to validate form fields
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message);
      }

      // 2. Create Order in Backend (returns client_secret)
      const orderPayload = {
        userId: user?.id || 'guest',
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          size: item.selectedSize,
          color: item.selectedColor,
          price: item.price,
          quantity: item.quantity,
          isMysteryBox: item.isMysteryBox || false,
          bundleItems: item.bundleItems || [],
        })),
        subtotal,
        shipping,
        couponCode: appliedCoupon?.code || null,
        discount: discount,
        tax: tax,
        shippingState: form.state,
        total,
        entriesEarned: totalEntries,
        multiplierUsed: multiplier,
        status: 'pending', // IMPORTANT: pending until stripe confirm
        shippingAddress: `${form.address}, ${form.city}, ${form.state} ${form.zip}`,
      };

      const orderRes = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!orderRes.ok) {
        throw new Error('Failed to create order on server');
      }

      const orderData = await orderRes.json();
      const clientSecret = orderData.stripeClientSecret;

      // Handle Free Orders (Total is $0, no Stripe payment required)
      if (total <= 0) {
        // Just mark as confirmed since it's fully discounted
        if (user) {
          useAuthStore.getState().setUser({
            ...user,
            entries: (user.entries || 0) + totalEntries,
            totalSpent: (user.totalSpent || 0) + total
          });
        }
        addEntries(totalEntries);
        setStep('confirmed');
        clearCart();
        return;
      }

      if (!clientSecret) {
        throw new Error(orderData.stripeError?.message || 'No Stripe client secret returned from server');
      }

      // 3. Confirm Payment with Stripe
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/success`, // optional, we can do redirect: 'if_required'
          payment_method_data: {
            billing_details: {
              name: `${form.firstName} ${form.lastName}`,
              email: form.email,
              phone: form.phone,
              address: {
                line1: form.address,
                city: form.city,
                state: form.state,
                postal_code: form.zip,
                country: form.country === 'United States' ? 'US' : form.country === 'México' ? 'MX' : form.country === 'Canada' ? 'CA' : undefined
              }
            }
          }
        },
        redirect: 'if_required', // Do not redirect if possible
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful! Call backend to confirm immediately (fallback for webhook)
        fetch(`${import.meta.env.VITE_API_URL}/orders/confirm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id })
        }).catch(err => console.error('Failed to notify backend of success', err));

        // Update local user state immediately for UI responsiveness if logged in
        if (user) {
          useAuthStore.getState().setUser({
            ...user,
            entries: (user.entries || 0) + totalEntries,
            totalSpent: (user.totalSpent || 0) + total
          });
        }

        addEntries(totalEntries); // update giveaway progress locally
        setStep('confirmed');
        clearCart();
      } else {
        throw new Error('Payment processing failed. Status: ' + paymentIntent?.status);
      }

    } catch (err) {
      console.error('Checkout error:', err);
      alert(err.message || 'There was a problem processing your order. Please try again.');
      setStep('form');
    }
  };

  // Redirect if cart is empty and on form step
  if (items.length === 0 && step === 'form') {
    navigate('/shop', { replace: true });
    return null;
  }

  const currentCountryData = LOCATION_DATA[form.country] || LOCATION_DATA['United States'];
  const currentStateObj = currentCountryData?.states?.find(s => s.code === form.state || s.name === form.state);
  const currentCities = currentStateObj?.cities || [];

  return (
    <PageTransition className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-sm font-bold uppercase tracking-wider font-mono text-gray-400">
            [ CHECKOUT // SECURE ]
          </h1>
          <div className="w-10" />
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* FORM STEP (Includes Processing Overlay) */}
          {(step === 'form' || step === 'processing') && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
              
              {/* PROCESSING OVERLAY */}
              {step === 'processing' && (
                <div className="absolute inset-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl border border-primary/20">
                  <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-2 border-primary/30 rounded-lg animate-ping" />
                    <div className="absolute inset-2 border-2 border-primary/50 rounded-lg animate-pulse" />
                    <div className="absolute inset-4 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-3xl animate-spin" style={{ animationDuration: '2s' }}>
                        settings
                      </span>
                    </div>
                  </div>
                  <p className="text-primary text-sm font-mono uppercase tracking-widest animate-pulse">
                    {t('checkout.processing')}
                  </p>
                  <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-4">
                    <motion.div className="h-full bg-primary" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 2.8, ease: 'easeInOut' }} />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Form */}
                <form onSubmit={handleSubmit} className="md:col-span-3 flex flex-col gap-4">
                  <h2 className="text-xl font-bold uppercase italic text-white mb-2">
                    {t('checkout.shippingInfo')}
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label={t('checkout.firstName')} name="firstName" value={form.firstName} onChange={handleChange} required />
                    <Input label={t('checkout.lastName')} name="lastName" value={form.lastName} onChange={handleChange} required />
                  </div>
                  <Input label={t('checkout.email')} name="email" type="email" value={form.email} onChange={handleChange} required />
                  <Input label={t('checkout.address')} name="address" value={form.address} onChange={handleChange} placeholder="123 Mesa St" required />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="(555) 555-5555" required />
                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-400 mb-1">{t('admin.country') || 'Country'}</label>
                      <select
                        name="country"
                        value={form.country}
                        onChange={handleCountryChange}
                        className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-primary font-mono text-sm"
                      >
                        <option value="United States" className="bg-[#1a1a1a] text-white">🇺🇸 United States</option>
                        <option value="México" className="bg-[#1a1a1a] text-white">🇲🇽 México</option>
                        <option value="Canada" className="bg-[#1a1a1a] text-white">🇨🇦 Canada</option>
                        <option value="Other" className="bg-[#1a1a1a] text-white">🏁 Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-400 mb-1">{t('checkout.city')}</label>
                      {!isCustomCity && currentCities.length > 0 ? (
                        <select
                          name="city"
                          value={form.city}
                          onChange={handleCityChange}
                          className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-2 py-3 text-white focus:outline-none focus:border-primary font-mono text-xs"
                        >
                          {currentCities.map(c => (
                            <option key={c} value={c} className="bg-[#1a1a1a] text-white">
                              {c}
                            </option>
                          ))}
                          <option value="__OTHER__" className="bg-[#1a1a1a] text-white">+ Otra</option>
                        </select>
                      ) : (
                        <Input label="" name="city" value={form.city} onChange={handleChange} placeholder="City" required />
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-400 mb-1">{t('checkout.state')}</label>
                      {!isCustomState && currentCountryData?.states?.length > 0 ? (
                        <select
                          name="state"
                          value={form.state}
                          onChange={handleStateChange}
                          className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-2 py-3 text-white focus:outline-none focus:border-primary font-mono text-xs"
                        >
                          {currentCountryData.states.map(s => (
                            <option key={s.code} value={s.code} className="bg-[#1a1a1a] text-white">
                              {s.code}
                            </option>
                          ))}
                          <option value="__OTHER__" className="bg-[#1a1a1a] text-white">+ Otro</option>
                        </select>
                      ) : (
                        <Input label="" name="state" value={form.state} onChange={handleChange} placeholder="State" required />
                      )}
                    </div>

                    <Input label={t('checkout.zip')} name="zip" value={form.zip} onChange={handleChange} placeholder="79901" required />
                  </div>

                  {/* MÉTODO DE PAGO (STRIPE ELEMENTS) O AVISO DE LANZAMIENTO */}
                  {!checkoutEnabled ? (
                    <div className="border-t border-white/10 pt-6 mt-2 flex flex-col gap-4">
                      <div className="relative overflow-hidden bg-gradient-to-br from-[#121212] via-black to-[#0a0a0a] border border-primary/40 rounded-2xl p-6 sm:p-8 text-center shadow-[0_0_40px_rgba(106,244,37,0.12)]">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                        
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/40 text-primary flex items-center justify-center mx-auto mb-4 shadow-[0_0_25px_rgba(106,244,37,0.25)]">
                          <span className="material-symbols-outlined text-3xl animate-pulse">lock_clock</span>
                        </div>
                        
                        <span className="inline-block bg-primary/20 text-primary border border-primary/30 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3">
                          {lang === 'es' ? 'Lanzamiento Oficial en Preparación' : 'Official Launch in Preparation'}
                        </span>

                        <h3 className="text-xl sm:text-2xl font-black italic uppercase tracking-wider text-white mb-3">
                          {lang === 'es' ? 'PASARELA DE PAGO EN ESPERA' : 'PAYMENTS OPENING SHORTLY'}
                        </h3>
                        
                        <p className="text-xs sm:text-sm text-gray-300 font-mono leading-relaxed max-w-lg mx-auto mb-6">
                          {lang === 'es'
                            ? 'Los pagos se habilitarán oficialmente en breve con la apertura de la tienda. Puedes explorar todo el catálogo de productos y armar tu carrito con anticipación.'
                            : 'Online payments are temporarily paused while final launch preparations are finalized. You can freely explore the gear catalog and prepare your cart in advance!'}
                        </p>

                        <div className="inline-flex items-center gap-2.5 bg-black/60 border border-white/15 rounded-full px-4 py-2 text-xs font-mono text-gray-300">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                          </span>
                          <span>{lang === 'es' ? 'Pagos desbloqueándose muy pronto' : 'Unlocking very soon'}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="border-t border-white/10 pt-6 mt-2 flex flex-col gap-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold uppercase italic text-white">
                              Método de Pago
                            </h2>
                            <span className="bg-primary/20 text-primary text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-primary/30 uppercase">
                              Stripe Secure
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-mono">
                            <span className="material-symbols-outlined text-primary text-sm">lock</span>
                            <span>SSL 256-Bit</span>
                          </div>
                        </div>
                        
                        <div className="bg-black/60 border border-primary/30 rounded-xl p-4 shadow-[0_0_20px_rgba(106,244,37,0.05)]">
                          <PaymentElement options={{ layout: 'tabs' }} />
                        </div>
                      </div>

                      <Button type="submit" size="lg" disabled={!stripe} className="w-full mt-4 py-4 text-sm font-black tracking-widest uppercase shadow-[0_0_20px_rgba(106,244,37,0.3)]">
                        {lang === 'es' ? 'CONFIRMAR Y PAGAR CON STRIPE' : 'CONFIRM AND PAY WITH STRIPE'} (${total.toFixed(2)})
                      </Button>
                    </>
                  )}
                </form>

                {/* Order Summary */}
                <div className="md:col-span-2">
                  <div className="bg-[#111] border border-white/10 rounded-xl p-5 sticky top-24 shadow-2xl relative group">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none transition-opacity opacity-50 group-hover:opacity-100" />
                    
                    <div className="relative bg-black/60 border border-primary/30 rounded-lg p-5 mb-6 text-center transform transition-transform hover:scale-[1.02] hover:border-primary/60 shadow-[0_0_30px_rgba(106,244,37,0.15)]">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black font-black uppercase text-[9px] tracking-[0.2em] px-3 py-1 rounded-sm whitespace-nowrap shadow-[0_0_15px_rgba(106,244,37,0.4)]">
                        Tu Oportunidad de Ganar
                      </div>
                      <p className="text-[10px] text-gray-400 uppercase font-mono tracking-widest mt-2 mb-1">{t('cart.totalEntries')}</p>
                      <div className="flex items-center justify-center gap-2 max-w-full overflow-hidden px-1">
                        <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl animate-pulse shrink-0">local_activity</span>
                        <p className={`font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300 drop-shadow-[0_0_15px_rgba(106,244,37,0.5)] font-mono tracking-tight whitespace-nowrap ${
                          totalEntries > 999999 ? 'text-2xl sm:text-3xl' : totalEntries > 99999 ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'
                        }`}>
                          {totalEntries.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 font-mono border-b border-white/10 pb-2">{t('checkout.orderSummary')}</h3>
                    
                    <div className="space-y-3 mb-4">
                      {items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm group/item">
                          <span className="text-gray-300 font-medium line-clamp-1 pr-4">{item.name} <span className="text-gray-500 text-xs ml-1">× {item.quantity}</span></span>
                          <span className="text-white font-mono shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-white/10 pt-4 mb-4">
                      <label className="block text-xs font-mono uppercase text-gray-400 mb-2">
                        ¿Tienes un cupón de descuento?
                      </label>
                      {appliedCoupon ? (
                        <div className="bg-primary/10 border border-primary/40 rounded-lg p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">confirmation_number</span>
                            <div>
                              <p className="text-xs font-bold text-primary uppercase">{appliedCoupon.code}</p>
                              <p className="text-[10px] text-gray-400">
                                {appliedCoupon.reward_type === 'entries'
                                  ? `+${appliedCoupon.entries_count?.toLocaleString() || 0} entradas al giveaway`
                                  : appliedCoupon.type === 'percentage'
                                    ? `${appliedCoupon.value}% de descuento`
                                    : `$${appliedCoupon.value} de descuento`}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveCoupon}
                            className="text-xs text-red-400 hover:text-red-300 font-mono underline"
                          >
                            {lang === 'es' ? 'Quitar' : 'Remove'}
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleApplyCoupon} className="flex gap-2">
                          <input
                            type="text"
                            value={couponCodeInput}
                            onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                            placeholder="Ej. BORDER2026"
                            className="bg-black/60 border border-white/20 rounded-lg px-3 py-2 text-xs text-white uppercase font-mono w-full focus:outline-none focus:border-primary"
                          />
                          <Button
                            type="submit"
                            size="sm"
                            disabled={couponLoading || !couponCodeInput.trim()}
                            className="shrink-0 text-xs"
                          >
                            {couponLoading ? '...' : 'Aplicar'}
                          </Button>
                        </form>
                      )}
                      {couponError && (
                        <p className="text-[11px] text-red-400 font-mono mt-2">
                          ⚠️ {couponError}
                        </p>
                      )}
                      {couponSuccess && (
                        <p className="text-[11px] text-primary font-mono mt-2">
                          ✓ {couponSuccess}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2 border-t border-white/10 pt-4">
                      <div className="flex justify-between text-xs text-gray-400 font-mono">
                        <span>{t('cart.subtotal')}</span>
                        <span className="text-gray-300">${subtotal.toFixed(2)}</span>
                      </div>

                      {appliedCoupon && appliedCoupon.reward_type === 'discount' && (
                        <div className="flex justify-between text-xs text-primary font-mono font-bold">
                          <span>Descuento ({appliedCoupon.code})</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}

                      {appliedCoupon && appliedCoupon.reward_type === 'entries' && (
                        <div className="flex justify-between text-xs text-primary font-mono font-bold">
                          <span>🎫 {appliedCoupon.code}</span>
                          <span>+{appliedCoupon.entries_count?.toLocaleString() || 0} entradas</span>
                        </div>
                      )}

                      <div className="flex justify-between text-xs text-gray-400 font-mono">
                        <span>{t('cart.shipping')}</span>
                        <span className={shipping === 0 ? "text-primary" : "text-gray-300"}>
                          {shipping === 0 ? t('cart.freeShipping') : `$${shipping.toFixed(2)}`}
                        </span>
                      </div>

                      <div className="flex justify-between text-xs text-gray-400 font-mono">
                        <span>
                          {taxInfo.rate > 0
                            ? (lang === 'es' ? `Impuesto de Venta (${taxInfo.code} ${taxInfo.label})` : `Sales Tax (${taxInfo.code} ${taxInfo.label})`)
                            : (lang === 'es' ? 'Impuesto Estimado' : 'Estimated Tax')}
                        </span>
                        <span className="text-gray-300">${tax.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between text-lg pt-3 mt-2 border-t border-white/10 font-black italic uppercase">
                        <span>Total</span>
                        <span className="font-mono text-white">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* CONFIRMED STEP */}
          {step === 'confirmed' && (
            <motion.div key="confirmed" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
              <motion.div
                className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-[0_0_40px_rgba(106,244,37,0.6)]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              >
                <span className="material-symbols-outlined text-background-dark text-4xl">check</span>
              </motion.div>
              <h2 className="text-3xl font-black italic uppercase text-white">
                {t('checkout.confirmed')}
              </h2>
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">{t('cart.totalEntries')}</p>
                <p className="text-5xl font-black text-primary drop-shadow-[0_0_10px_rgba(204,255,0,0.5)]">
                  <EntryCounter value={finalEntries} duration={2000} />
                </p>
                <p className="text-gray-400 text-sm mt-2">{t('checkout.entriesAwarded')}</p>
              </div>
              <div className="flex gap-3 mt-4">
                <Button variant="secondary" onClick={() => navigate('/shop')}>
                  {t('checkout.continueShopping')}
                </Button>
                <Button onClick={() => navigate('/garage')}>
                  {t('checkout.viewGarage')}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </PageTransition>
  );
};

// Checkout wrapper para inyectar Stripe Elements usando el patrón de Deferred Intent
const Checkout = () => {
  const { getTotal } = useCartStore();
  const total = getTotal();

  // Requerido por Stripe Elements para diferir el ClientSecret. amount = minimum 50 cents.
  const amountToCharge = total > 0 ? Math.round(total * 100) : 100;

  const appearance = {
    theme: 'night',
    variables: {
      colorPrimary: '#6af425',
      colorBackground: '#1a1a1a',
      colorText: '#ffffff',
      colorDanger: '#df1b41',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      borderRadius: '8px',
    },
    rules: {
      '.Input': {
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: 'none',
      },
      '.Input:focus': {
        border: '1px solid #6af425',
        boxShadow: 'none',
      },
    }
  };

  const options = {
    mode: 'payment',
    amount: amountToCharge,
    currency: 'usd',
    appearance,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutContent />
    </Elements>
  );
};

export default Checkout;
