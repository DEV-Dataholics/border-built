import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';

const API_URL = import.meta.env.VITE_API_URL || 'https://border-built.com/api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new reset link.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setError(data.messages?.error || data.message || 'This link is invalid or has expired.');
      }
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
              {success ? 'Password Updated' : 'Set New Password'}
            </h1>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            {success ? (
              /* Success state */
              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-primary text-3xl">lock_reset</span>
                </div>
                <div>
                  <p className="text-white font-bold text-lg mb-2">All done!</p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Your password has been updated successfully. You can now log in with your new password.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-primary text-black py-4 rounded-xl font-bold uppercase text-sm tracking-wider hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(106,244,37,0.3)]"
                >
                  Go to Login
                </button>
              </div>
            ) : (
              /* Form state */
              <form onSubmit={handleSubmit} className="space-y-6">
                <p className="text-gray-400 text-sm leading-relaxed">
                  Choose a strong password for your account.
                </p>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wider">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wider">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                    required
                    placeholder="Repeat your password"
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
                  disabled={isSubmitting || !token}
                  className="w-full bg-primary text-black py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(106,244,37,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  ) : (
                    <>
                      <span>Update Password</span>
                      <span className="material-symbols-outlined">lock</span>
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

export default ResetPassword;
