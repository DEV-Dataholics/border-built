import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useTranslation } from '../i18n/useTranslation';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import PageTransition from '../components/layout/PageTransition';

const Login = () => {
  const navigate = useNavigate();
  const { login, register: registerUser, isAuthenticated, user } = useAuthStore();
  const { t } = useTranslation();
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pendingCouponCode = sessionStorage.getItem('pending_coupon_code');

  // Redirect if already logged in
  if (isAuthenticated) {
    if (pendingCouponCode) {
      navigate(`/claim?code=${pendingCouponCode}`, { replace: true });
    } else {
      navigate(user?.role === 'admin' ? '/admin' : '/garage', { replace: true });
    }
    return null;
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSuccessRedirect = (loggedUser) => {
    if (pendingCouponCode) {
      navigate(`/claim?code=${pendingCouponCode}`, { replace: true });
    } else {
      navigate(loggedUser?.role === 'admin' ? '/admin' : '/garage', { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isRegister) {
        const result = await registerUser(form.name, form.email, form.password);
        if (result.success) {
          handleSuccessRedirect(result.user);
        } else {
          setError(result.error);
        }
      } else {
        const result = await login(form.email, form.password);
        if (result.success) {
          handleSuccessRedirect(result.user);
        } else {
          setError(result.error);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition className="flex-1 flex flex-col bg-carbon-pattern min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-primary/20 p-4">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-white text-base font-bold tracking-wider uppercase font-mono">
            [ BORDER // ACCESS ]
          </h2>
          <div className="w-6" />
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 pb-32">
        <div className="w-full max-w-sm">
          {/* Pending Coupon Banner */}
          {pendingCouponCode && (
            <div className="mb-6 bg-primary/10 border border-primary/40 rounded-xl p-4 text-center">
              <span className="material-symbols-outlined text-primary text-2xl mb-1">confirmation_number</span>
              <p className="text-xs font-mono text-primary uppercase font-bold">
                Cupón pendiente: {pendingCouponCode}
              </p>
              <p className="text-[11px] text-gray-300 mt-1">
                Inicia sesión o regístrate para reclamar tus entradas.
              </p>
            </div>
          )}

          {/* Logo Area */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black italic uppercase text-white mb-2">
              BORDER <span className="text-primary">SPEC</span>
            </h1>
            <p className="text-gray-500 text-xs font-mono uppercase tracking-widest">
              {isRegister ? 'Create your account' : 'Enter the garage'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isRegister && (
              <Input
                label={t('login.name')}
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Carlos M."
                required
              />
            )}

            <Input
              label={t('login.email')}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@borderbuilt.com"
              required
            />

            <Input
              label={t('login.password')}
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono uppercase px-4 py-2 rounded-lg text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-background-dark py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(106,244,37,0.3)] hover:shadow-[0_0_30px_rgba(106,244,37,0.5)] flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                <>
                  <span>{isRegister ? t('login.registerBtn') : t('login.loginBtn')}</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="text-center mt-6">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-gray-400 text-xs hover:text-primary transition-colors"
            >
              {isRegister ? t('login.hasAccount') : t('login.noAccount')}{' '}
              <span className="text-primary font-bold underline">
                {isRegister ? t('login.title') : t('login.registerBtn')}
              </span>
            </button>
          </div>

          {/* Forgot Password */}
          {!isRegister && (
            <div className="text-center mt-3">
              <Link
                to="/forgot-password"
                className="text-gray-600 text-xs hover:text-gray-400 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          )}


        </div>
      </main>
    </PageTransition>
  );
};

export default Login;
