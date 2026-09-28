import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, Sparkles, Coffee, ShieldCheck, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, register, forgotPassword } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleQuickFill = (type) => {
    if (type === 'admin') {
      setEmail('admin@coffeeshop.com');
      setPassword('Admin@123');
      setMode('login');
      showToast('info', 'Admin credentials loaded. Click Sign In.');
    } else {
      setEmail('customer@coffeeshop.com');
      setPassword('Customer@123');
      setMode('login');
      showToast('info', 'Customer credentials loaded. Click Sign In.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (mode === 'login') {
      const res = await login(email.trim(), password);
      if (res.success) onClose();
    } else if (mode === 'register') {
      if (!fullName.trim()) {
        showToast('error', 'Please enter your full name.');
        setSubmitting(false);
        return;
      }
      const res = await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      });
      if (res.success) onClose();
    } else if (mode === 'forgot') {
      const res = await forgotPassword(email.trim());
      if (res.success) setMode('login');
    }

    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-coffee-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-coffee-100 hover:bg-coffee-200 text-stone-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-b from-coffee-900 to-coffee-950 text-white text-center relative overflow-hidden">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-3">
            <Coffee className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold">
            {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Join Artisan Roast' : 'Reset Password'}
          </h2>
          <p className="text-xs text-coffee-200 mt-1">
            {mode === 'login' 
              ? 'Sign in to access your coffee orders & rewards'
              : mode === 'register'
              ? 'Create an account to start ordering handcrafted brews'
              : 'Enter your email to receive recovery instructions'}
          </p>

          {/* Quick Demo Fill Buttons (Very helpful for reviewers!) */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-center gap-2">
            <span className="text-[10px] text-coffee-300 uppercase tracking-wider font-semibold">
              Demo Logins:
            </span>
            <button
              type="button"
              onClick={() => handleQuickFill('customer')}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold text-amber-200 border border-white/20 transition-colors"
            >
              ☕ Customer Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-[11px] font-bold text-amber-300 border border-amber-500/30 transition-colors"
            >
              👑 Admin Demo
            </button>
          </div>
        </div>

        {/* Tabs for Login / Register */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 border-b border-coffee-200 bg-coffee-50/50">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                mode === 'login'
                  ? 'border-b-2 border-coffee-900 text-coffee-950 bg-white font-extrabold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                mode === 'register'
                  ? 'border-b-2 border-coffee-900 text-coffee-950 bg-white font-extrabold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Coffee"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500 bg-coffee-50/20"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500 bg-coffee-50/20"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-stone-700">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] font-semibold text-amber-700 hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500 bg-coffee-50/20"
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1-555-0100"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500 bg-coffee-50/20"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50 mt-2"
          >
            {submitting 
              ? 'Please wait...' 
              : mode === 'login' 
              ? 'Sign In to Account' 
              : mode === 'register' 
              ? 'Create Account' 
              : 'Send Reset Link'}
          </button>

          {mode === 'forgot' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs font-semibold text-coffee-700 hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          )}

        </form>

      </div>
    </div>
  );
};
