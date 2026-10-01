'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  AlertCircle,
  MailCheck,
  KeyRound,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const {
    login,
    register,
    verifyEmail,
    resendVerificationCode,
    cancelVerification,
    pendingVerification,
    requestPasswordReset,
    confirmPasswordReset,
    cancelPasswordReset,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // OTP State (Registration)
  const [otpCode, setOtpCode] = useState('');
  const [resendNotification, setResendNotification] = useState<string | null>(null);

  // Forgot Password States
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetStep, setResetStep] = useState<'request' | 'verify'>('request');
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);
  const [simulatedEmailNotification, setSimulatedEmailNotification] = useState<{ email: string; code: string } | null>(null);

  // Close modal on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        if (pendingVerification) cancelVerification();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, pendingVerification, cancelVerification, onClose]);

  if (!isOpen) return null;

  // Handle Request Password Reset
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await requestPasswordReset(resetEmail);
      if (!res.success) {
        setError(res.error || 'Gagal memproses reset kata sandi.');
        setLoading(false);
        return;
      }

      setResetStep('verify');
      setResetCode('');
      setSimulatedEmailNotification({ email: resetEmail, code: res.code || '' });
      setLoading(false);
    } catch (err) {
      setError('Gagal mengirim kode reset ke email.');
      setLoading(false);
    }
  };

  // Handle Confirm Password Reset
  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (newPassword.length < 4) {
      setError('Kata sandi baru minimal harus 4 karakter.');
      return;
    }

    setLoading(true);
    try {
      const res = await confirmPasswordReset(resetCode, newPassword);
      if (!res.success) {
        setError(res.error || 'Gagal memperbarui kata sandi.');
        setLoading(false);
        return;
      }

      setLoading(false);
      setSimulatedEmailNotification(null);
      setResetSuccessMessage('Kata sandi berhasil diperbarui! Silakan masuk.');
      setMode('login');
      setEmail(resetEmail);
      setPassword('');
      setResetStep('request');
    } catch (err) {
      setError('Gagal mengonfirmasi kata sandi baru.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        const res = await register(name, email, password);
        if (!res.success) {
          setError(res.error || 'Gagal mendaftar');
          setLoading(false);
          return;
        }
        setOtpCode('');
      } else {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || 'Gagal login');
          setLoading(false);
          return;
        }
        onClose();
        if (onSuccess) onSuccess();
      }

      setLoading(false);
    } catch (err) {
      setError('Terjadi kesalahan pada sistem.');
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await verifyEmail(otpCode);
      if (!res.success) {
        setError(res.error || 'Kode verifikasi tidak cocok.');
        setLoading(false);
        return;
      }

      setLoading(false);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Gagal memverifikasi akun.');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    const res = await resendVerificationCode();
    if (res.success) {
      setResendNotification('Kode verifikasi baru telah dikirimkan ke email Anda.');
      setTimeout(() => setResendNotification(null), 5000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex min-h-full items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          if (pendingVerification) cancelVerification();
          onClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            if (pendingVerification) cancelVerification();
            onClose();
          }}
          className="absolute top-4 right-4 z-30 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          title="Tutup (Esc)"
          aria-label="Tutup Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header (Pinned at top) */}
        <div className="p-6 pb-4 bg-gradient-to-b from-emerald-50/50 to-transparent shrink-0">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 font-bold text-xl mb-3">
            CB
          </div>

          {pendingVerification ? (
            <div>
              <h2 className="text-xl font-bold text-slate-900">Verifikasi Email Anda</h2>
              <p className="text-xs text-slate-500 mt-1">
                Masukkan 6 digit kode OTP yang telah dikirim ke: <br />
                <span className="font-semibold text-emerald-700">{pendingVerification.email}</span>
              </p>
            </div>
          ) : mode === 'forgot' ? (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setSimulatedEmailNotification(null);
                  }}
                  className="p-1 -ml-1 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-xl font-bold text-slate-900">
                  {resetStep === 'request' ? 'Reset Kata Sandi' : 'Verifikasi & Sandi Baru'}
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                {resetStep === 'request'
                  ? 'Masukkan email akun terdaftar untuk menerima 6 digit kode konfirmasi.'
                  : `Kode konfirmasi telah dikirim ke ${resetEmail}`}
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {mode === 'login' ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {mode === 'login'
                  ? 'Masuk untuk mengakses dan mengunduh CV tersimpan Anda.'
                  : 'Daftar sekarang untuk menyimpan data CV Anda secara aman dan gratis.'}
              </p>

              {/* Tab Switcher */}
              <div className="flex bg-slate-100 p-1 rounded-xl mt-4 border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setResetSuccessMessage(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-white text-emerald-700 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Masuk
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                    setResetSuccessMessage(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    mode === 'register'
                      ? 'bg-white text-emerald-700 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Daftar Akun
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 pt-2 overflow-y-auto flex-1">
          {pendingVerification ? (
            /* VERIFICATION FORM */
            <div className="space-y-4">
              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MailCheck className="w-5 h-5" />
                </div>
                <div className="text-xs text-slate-600 leading-snug">
                  Kode verifikasi 6 digit telah dikirim ke <b className="text-slate-800">{pendingVerification.email}</b>. Silakan periksa kotak masuk atau spam email Anda.
                </div>
              </div>

              {resendNotification && (
                <div className="p-2 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-center font-medium">
                  {resendNotification}
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOTP} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 text-center">
                    Masukkan 6 Digit OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="______"
                    className="w-full text-center tracking-[0.5em] font-mono text-xl font-bold py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otpCode.length < 6}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
                >
                  <span>{loading ? 'Memverifikasi...' : 'Verifikasi & Aktifkan'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <button
                  type="button"
                  onClick={cancelVerification}
                  className="flex items-center gap-1 hover:text-slate-800 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Ganti Email
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-emerald-700 hover:text-emerald-900 font-semibold hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Kirim Ulang
                </button>
              </div>
            </div>
          ) : mode === 'forgot' ? (
            /* FORGOT PASSWORD FORM */
            <div className="space-y-4">
              {simulatedEmailNotification && (
                <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl text-xs text-amber-900 shadow-xs">
                  <div className="flex items-center justify-between pb-1 border-b border-amber-200/60 font-semibold">
                    <span className="flex items-center gap-1 text-amber-950">
                      <MailCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Simulasi Email Terkirim
                    </span>
                    <span className="text-[10px] bg-amber-200/70 text-amber-900 px-1.5 py-0.5 rounded font-mono font-bold">
                      {simulatedEmailNotification.email}
                    </span>
                  </div>
                  <p className="mt-1.5 text-slate-700 text-[11px]">
                    Kode konfirmasi reset kata sandi Anda:
                  </p>
                  <div className="mt-1.5 flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-amber-300">
                    <span className="text-lg font-black font-mono tracking-widest text-emerald-800">
                      {simulatedEmailNotification.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => setResetCode(simulatedEmailNotification.code)}
                      className="text-[10px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                    >
                      Isi Otomatis
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {resetStep === 'request' ? (
                <form onSubmit={handleRequestReset} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Alamat Email Akun
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !resetEmail.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:shadow-lg disabled:opacity-60"
                  >
                    <span>{loading ? 'Memeriksa Email...' : 'Kirim Kode Konfirmasi'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setError(null);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 font-medium hover:underline inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Batal dan Kembali ke Login
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleConfirmReset} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 text-center">
                      Masukkan 6 Digit Kode Konfirmasi
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="______"
                      className="w-full text-center tracking-[0.5em] font-mono text-lg font-bold py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Kata Sandi Baru
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        minLength={4}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimal 4 karakter"
                        className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Ulangi Kata Sandi Baru
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        minLength={4}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Ketik ulang kata sandi baru"
                        className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || resetCode.length < 6 || !newPassword}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
                  >
                    <span>{loading ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs text-slate-500">
                    <button
                      type="button"
                      onClick={() => {
                        setResetStep('request');
                        setError(null);
                      }}
                      className="flex items-center gap-1 hover:text-slate-800 font-medium"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Ganti Email
                    </button>
                    <button
                      type="button"
                      onClick={handleRequestReset}
                      className="text-emerald-700 hover:text-emerald-900 font-semibold hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Kirim Ulang
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* LOGIN / REGISTER FORM */
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {resetSuccessMessage && mode === 'login' && (
                <div className="flex items-center gap-2 p-3 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{resetSuccessMessage}</span>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Alamat Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-700">Kata Sandi</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setResetStep('request');
                        setResetEmail(email || '');
                        setError(null);
                        setResetSuccessMessage(null);
                      }}
                      className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                    >
                      Lupa kata sandi?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={4}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 4 karakter"
                    className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:shadow-lg disabled:opacity-60 mt-4"
              >
                <span>
                  {loading
                    ? 'Memproses...'
                    : mode === 'login'
                    ? 'Masuk Sekarang'
                    : 'Lanjut ke Verifikasi Email'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-[11px] text-slate-500">
                  {mode === 'login' ? 'Belum punya akun? ' : 'Sudah punya akun? '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === 'login' ? 'register' : 'login');
                      setError(null);
                    }}
                    className="text-emerald-700 font-semibold hover:underline"
                  >
                    {mode === 'login' ? 'Daftar Akun Baru' : 'Masuk di sini'}
                  </button>
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
