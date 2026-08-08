import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, LogIn, UserPlus, Eye, EyeOff, Cpu, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'signin' | 'signup';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState<Tab>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const reset = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setError(null);
    setSuccess(null);
    setLoading(false);
    setShowPassword(false);
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (tab === 'signin') {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
        setLoading(false);
      } else {
        setSuccess('Signed in successfully!');
        setTimeout(() => {
          onClose();
          reset();
        }, 800);
      }
    } else {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, fullName);
      if (error) {
        setError(error);
        setLoading(false);
      } else {
        setSuccess('Account created! Check your email to confirm, then sign in.');
        setLoading(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-md rounded-3xl border border-[#D4AF37]/50 bg-[#08090E] shadow-[0_0_80px_rgba(206,181,255,0.12)] overflow-hidden">
              
              {/* Header */}
              <div className="relative px-8 pt-8 pb-6 border-b border-[#D4AF37]/20">
                <div className="flex items-center gap-3 mb-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFD700] via-[#BF953F] to-[#7A5310] p-0.5">
                    <div className="h-full w-full bg-[#08090E] rounded-[14px] flex items-center justify-center">
                      <Cpu className="h-5 w-5 text-[#FFD700]" />
                    </div>
                  </div>
                  <div>
                    <h2 className="font-cinzel text-base font-black text-[#FFF8D6] tracking-wider">
                      SemiRestore<span className="text-[#FFD700]">.AI</span>
                    </h2>
                    <p className="text-[10px] text-[#E6BF83]/70 font-royal-sans">
                      Semiconductor Metrology Platform
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 rounded-xl border border-[#D4AF37]/30 bg-white/[0.05] p-1.5 text-[#E6BF83] hover:text-[#FFD700] hover:bg-white/[0.1] transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Tab Switcher */}
              <div className="flex mx-8 mt-6 rounded-xl bg-white/[0.04] border border-[#D4AF37]/20 p-1">
                {(['signin', 'signup'] as Tab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => switchTab(t)}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold font-royal-sans transition cursor-pointer ${
                      tab === t
                        ? 'bg-gradient-to-r from-[#BF953F] to-[#FFD700] text-[#08090E] shadow-md'
                        : 'text-[#D3D3FF]/70 hover:text-[#FFF4D0]'
                    }`}
                  >
                    {t === 'signin' ? <LogIn className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
                    {t === 'signin' ? 'Sign In' : 'Create Account'}
                  </button>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
                
                {/* Full Name (signup only) */}
                <AnimatePresence>
                  {tab === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <label className="block text-[11px] font-bold text-[#E6BF83] mb-1.5 font-royal-sans tracking-wide">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-[#D4AF37]/60" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Dr. Elena Vance"
                          className="w-full rounded-xl border border-[#D4AF37]/30 bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm font-royal-sans text-[#FFF4D0] placeholder-[#D3D3FF]/30 focus:border-[#FFD700]/60 focus:outline-none focus:ring-1 focus:ring-[#FFD700]/20 transition"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-bold text-[#E6BF83] mb-1.5 font-royal-sans tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-[#D4AF37]/60" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="engineer@tsmc.com"
                      required
                      className="w-full rounded-xl border border-[#D4AF37]/30 bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm font-royal-sans text-[#FFF4D0] placeholder-[#D3D3FF]/30 focus:border-[#FFD700]/60 focus:outline-none focus:ring-1 focus:ring-[#FFD700]/20 transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[11px] font-bold text-[#E6BF83] mb-1.5 font-royal-sans tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-[#D4AF37]/60" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full rounded-xl border border-[#D4AF37]/30 bg-white/[0.04] py-2.5 pl-10 pr-10 text-sm font-royal-sans text-[#FFF4D0] placeholder-[#D3D3FF]/30 focus:border-[#FFD700]/60 focus:outline-none focus:ring-1 focus:ring-[#FFD700]/20 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-[#D4AF37]/50 hover:text-[#FFD700] transition cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Error / Success */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3"
                    >
                      <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-300 font-royal-sans">{error}</p>
                    </motion.div>
                  )}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-emerald-300 font-royal-sans">{success}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#FFD700] to-[#BF953F] py-3 text-sm font-black text-[#08090E] tracking-wide font-cinzel shadow-lg hover:shadow-[0_0_24px_rgba(255,215,0,0.35)] hover:scale-[1.02] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
                >
                  {loading ? (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : tab === 'signin' ? (
                    <><LogIn className="h-4 w-4" /> Access Lab Console</>
                  ) : (
                    <><UserPlus className="h-4 w-4" /> Create Operator Account</>
                  )}
                </button>

                {tab === 'signup' && (
                  <p className="text-center text-[10px] text-[#D3D3FF]/40 font-royal-sans">
                    By signing up you agree to our terms of service. Your data is encrypted at rest.
                  </p>
                )}
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
