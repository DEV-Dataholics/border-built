import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '../i18n/useTranslation';
import PageTransition from '../components/layout/PageTransition';

const API_URL = import.meta.env.VITE_API_URL || 'https://border-built.com/api';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      // Always show success (server hides whether email exists for security)
      setSent(true);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition className="flex-1 flex flex-col min-h-screen bg-carbon-pattern">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-10">
            <p className="text-primary font-mono font-black text-sm tracking-[6px] uppercase mb-1">
              [ BORDERBUILT ]
            </p>
            <h1 className="text-3xl font-black italic uppercase text-white">
              {sent ? 'Check Your Email' : 'Forgot Password'}
            </h1>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            {sent ? (
              /* Success state */
              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-primary text-3xl">mark_email_read</span>
                </div>
                <div>
                  <p className="text-white font-bold text-lg mb-2">Reset link sent!</p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    If an account exists for <span className="text-white font-mono">{email}</span>,
                    we sent a password reset link. Check your inbox and spam folder.
                    The link expires in <strong className="text-white">1 hour</strong>.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold uppercase text-sm tracking-wider transition-colors"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              /* Form state */
              <form onSubmit={handleSubmit} className="space-y-6">
                <p className="text-gray-400 text-sm leading-relaxed">
                  Enter the email address associated with your account and we'll send you a link to reset your password.
                </p>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    required
                    placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-black py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(106,244,37,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <span className="material-symbols-outlined">send</span>
                    </>
                  )}
                </button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-gray-500 text-xs hover:text-primary transition-colors"
                  >
                    ← Back to Login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default ForgotPassword;
