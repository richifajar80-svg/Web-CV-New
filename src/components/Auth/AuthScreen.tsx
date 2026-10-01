'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  User as UserIcon,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle,
  FileText,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  MailCheck,
  RefreshCw,
  ArrowLeft,
  KeyRound,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Globe,
  Award,
  Zap,
  Check,
  HelpCircle,
  Layers,
  Type,
  Lightbulb,
  Newspaper,
  MoreHorizontal,
} from 'lucide-react';
import { ContactModal } from '@/components/Navigation/ContactModal';
import { NewsModal } from '@/components/Navigation/NewsModal';
import { TipsModal } from '@/components/Navigation/TipsModal';

interface AuthScreenProps {
  onSuccess?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
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
    pendingReset,
    loginDemoUser,
  } = useAuth();

  const [mode, setMode] = useState<'register' | 'login' | 'forgot'>('register');

  // Register / Login form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // OTP Verification state (Registration)
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

  // FAQ Accordion State (SEO)
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Navigation Modals
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [tipsModalOpen, setTipsModalOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Handle Form Submit (Register or Login)
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
        if (onSuccess) onSuccess();
      }
      setLoading(false);
    } catch (err) {
      setError('Terjadi kendala pada sistem. Silakan coba kembali.');
      setLoading(false);
    }
  };

  // Handle OTP Verification Submit
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await verifyEmail(otpCode);
      if (!res.success) {
        setError(res.error || 'Kode verifikasi tidak valid.');
        setLoading(false);
        return;
      }

      setLoading(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Gagal memverifikasi kode.');
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResend = async () => {
    setError(null);
    const res = await resendVerificationCode();
    if (res.success) {
      setResendNotification('Kode verifikasi baru telah dikirimkan ke email Anda.');
      setTimeout(() => setResendNotification(null), 5000);
    }
  };

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
      setResetSuccessMessage('Kata sandi berhasil diperbarui! Silakan masuk dengan kata sandi baru Anda.');
      setMode('login');
      setEmail(resetEmail);
      setPassword('');
      setResetStep('request');
    } catch (err) {
      setError('Gagal mengonfirmasi kata sandi baru.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* 1. TOP NAVBAR */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 font-bold text-sm sm:text-lg shrink-0">
              CB
            </div>
            <div className="flex items-center">
              <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight shrink-0">
                cvbagus<span className="text-emerald-600">.id</span>
              </span>
              <span className="hidden md:inline-flex ml-2.5 text-[11px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300 shrink-0">
                Rp 25.000 / 1 Tahun
              </span>
            </div>
          </div>

          {/* Center Navigation Links (Tips Karir, News, Contact Us) - Desktop Only */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3">
            <button
              type="button"
              onClick={() => setTipsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-amber-800 hover:bg-amber-50 transition-all cursor-pointer border border-transparent hover:border-amber-200"
              title="Tips & panduan melamar pekerjaan lolos screening HRD (dapat update/tulis artikel)"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Tips Karir</span>
              <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                Artikel
              </span>
            </button>

            <button
              type="button"
              onClick={() => setNewsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-800 hover:bg-blue-50 transition-all cursor-pointer border border-transparent hover:border-blue-200"
              title="Portal warta resmi berita BUMN & bursa kerja"
            >
              <Newspaper className="w-3.5 h-3.5 text-blue-500" />
              <span>News</span>
            </button>

            <button
              type="button"
              onClick={() => setContactModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 transition-all cursor-pointer border border-transparent hover:border-emerald-200"
              title="Hubungi tim support & layanan bantuan resmi cvbagus.id"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-600" />
              <span>Contact Us</span>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {!pendingVerification && (
              <>
                <span className="text-xs text-slate-500 hidden lg:inline">
                  {mode === 'register' ? 'Sudah punya akun?' : 'Belum punya akun?'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'register' ? 'login' : 'register');
                    setError(null);
                  }}
                  className="text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors shrink-0"
                >
                  {mode === 'register' ? 'Masuk' : 'Daftar'}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await loginDemoUser();
                    if (onSuccess) onSuccess();
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer hover:shadow shrink-0"
                  title="Langsung coba buka workspace Editor CV dan Surat Lamaran Kerja"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Buka Editor & Surat</span>
                </button>
              </>
            )}

            {/* Mobile Nav Toggle */}
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer shrink-0"
              title="Menu Navigasi Tambahan"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileNavOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/98 px-3 py-2.5 space-y-1.5 shadow-xl animate-in slide-in-from-top-2">
            <button
              type="button"
              onClick={async () => {
                setMobileNavOpen(false);
                await loginDemoUser();
                if (onSuccess) onSuccess();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs text-left transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                Coba Langsung Editor CV & Surat
              </span>
              <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase">
                Demo
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileNavOpen(false);
                setTipsModalOpen(true);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-amber-50 text-left transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Tips Karir & Artikel Lamaran
              </span>
              <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-black uppercase">
                Artikel
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileNavOpen(false);
                setNewsModalOpen(true);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 text-left transition-colors cursor-pointer"
            >
              <Newspaper className="w-4 h-4 text-blue-500" />
              Portal Berita BUMN & Lowongan
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileNavOpen(false);
                setContactModalOpen(true);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 text-left transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4 text-emerald-600" />
              Contact Us (no-reply.cvbagus@gmail.com)
            </button>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-emerald-600 via-emerald-600 to-emerald-700 text-white pt-6 sm:pt-12 pb-14 sm:pb-24 px-3 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center relative z-10">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-emerald-800/60 backdrop-blur-xs text-emerald-100 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium border border-emerald-500/40">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Platform Pembuat CV Online Standar ATS Modern</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-snug sm:leading-tight">
              Buat CV ATS Friendly &{' '}
              <span className="underline decoration-emerald-300 decoration-wavy decoration-2">
                Profesional Online
              </span>
            </h1>

            <p className="text-xs sm:text-base lg:text-lg text-emerald-100 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Solusi pembuatan CV standar HRD terdepan di Indonesia. Evaluasi skor ATS otomatis, susun pengalaman kerja cepat, dan unduh PDF A4 resolusi tinggi 1 tahun penuh hanya <b>Rp 25.000 sekali bayar</b>.
            </p>

            {/* Feature Highlights Grid */}
            <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2 text-left max-w-md mx-auto lg:mx-0 text-xs text-emerald-100">
              <div className="flex items-center gap-2 bg-emerald-800/40 sm:bg-transparent border border-emerald-500/30 sm:border-none rounded-xl px-3 py-1.5 sm:p-0">
                <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
                <span className="font-medium">Format ATS Lolos HRD</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-800/40 sm:bg-transparent border border-emerald-500/30 sm:border-none rounded-xl px-3 py-1.5 sm:p-0">
                <CreditCard className="w-4 h-4 text-emerald-300 shrink-0" />
                <span className="font-medium">Sekali Bayar Rp 25rb (1 Thn)</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-800/40 sm:bg-transparent border border-emerald-500/30 sm:border-none rounded-xl px-3 py-1.5 sm:p-0">
                <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
                <span className="font-medium">Unduh PDF A4 Tanpa Watermark</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-800/40 sm:bg-transparent border border-emerald-500/30 sm:border-none rounded-xl px-3 py-1.5 sm:p-0 text-amber-200">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="font-semibold">Bonus: Generator Surat Lamaran</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Card (Register / Login / OTP Verification) */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-7 text-slate-800 border border-emerald-100">
              {/* IF PENDING VERIFICATION */}
              {pendingVerification ? (
                <div className="space-y-4">
                  <div className="text-center pb-2">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                      <MailCheck className="w-7 h-7" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Verifikasi Email Anda</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Kami telah mengirimkan 6 digit kode OTP verifikasi ke alamat:
                    </p>
                    <p className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg mt-1.5 inline-block border border-emerald-200">
                      {pendingVerification.email}
                    </p>
                  </div>

                  {/* Verification Notice */}
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

                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5 text-center">
                        Masukkan 6 Digit Kode OTP
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="______"
                        className="w-full text-center tracking-[0.6em] font-mono text-xl font-bold py-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otpCode.length < 6}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50"
                    >
                      <span>{loading ? 'Memverifikasi...' : 'Verifikasi & Masuk ke Editor'}</span>
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
                      <RefreshCw className="w-3 h-3" /> Kirim Ulang Kode
                    </button>
                  </div>
                </div>
              ) : mode === 'forgot' ? (
                /* FORGOT PASSWORD FORM */
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setError(null);
                        setSimulatedEmailNotification(null);
                      }}
                      className="p-1.5 -ml-1 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Kembali ke Login"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        {resetStep === 'request' ? 'Lupa Kata Sandi' : 'Verifikasi Kode Reset'}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {resetStep === 'request'
                          ? 'Masukkan email akun terdaftar untuk menerima kode konfirmasi.'
                          : `Kode konfirmasi dikirim ke ${resetEmail}`}
                      </p>
                    </div>
                  </div>

                  {/* Simulated Email Notification Card */}
                  {simulatedEmailNotification && (
                    <div className="p-3.5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl text-xs text-amber-900 shadow-sm animate-in fade-in duration-200">
                      <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/60 font-semibold">
                        <span className="flex items-center gap-1.5 text-amber-950">
                          <MailCheck className="w-4 h-4 text-emerald-600" />
                          Simulasi Email Terkirim
                        </span>
                        <span className="text-[10px] bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded font-mono font-bold">
                          {simulatedEmailNotification.email}
                        </span>
                      </div>
                      <p className="mt-2 text-slate-700 leading-relaxed text-[11px]">
                        Halo! Berikut kode konfirmasi untuk memperbarui kata sandi akun Anda:
                      </p>
                      <div className="mt-2 flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-amber-300">
                        <span className="text-xl font-black font-mono tracking-widest text-emerald-800">
                          {simulatedEmailNotification.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => setResetCode(simulatedEmailNotification.code)}
                          className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 hover:bg-emerald-100 transition-colors"
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
                    <form onSubmit={handleRequestReset} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Alamat Email Akun Terdaftar
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            placeholder="nama@email.com"
                            className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || !resetEmail.trim()}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50"
                      >
                        <span>{loading ? 'Memeriksa Email...' : 'Kirim Kode Konfirmasi ke Email'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <div className="text-center pt-2">
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
                    <form onSubmit={handleConfirmReset} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1 text-center">
                          Masukkan 6 Digit Kode Konfirmasi Email
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={resetCode}
                          onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                          placeholder="______"
                          className="w-full text-center tracking-[0.5em] font-mono text-xl font-bold py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
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
                            className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
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
                            className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || resetCode.length < 6 || !newPassword}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50"
                      >
                        <span>{loading ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
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
                          <RefreshCw className="w-3 h-3" /> Kirim Ulang Kode
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                /* REGULAR LOGIN / REGISTER FORM */
                <>
                  {/* Tab Selector */}
                  <div className="flex bg-slate-100 p-1 rounded-xl mb-5 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('register');
                        setError(null);
                        setResetSuccessMessage(null);
                      }}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                        mode === 'register'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Daftar Akun Baru
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setError(null);
                      }}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                        mode === 'login'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Masuk ke Akun
                    </button>
                  </div>

                  <div className="mb-4">
                    <h2 className="text-lg font-bold text-slate-900">
                      {mode === 'register' ? 'Daftar untuk Memulai' : 'Masuk ke Dashboard CV'}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {mode === 'register'
                        ? 'Daftar sekarang. Anda dapat langsung mengedit dan menyusun CV secara gratis.'
                        : 'Akses kembali semua draf CV yang tersimpan di akun Anda.'}
                    </p>
                  </div>

                  {resetSuccessMessage && mode === 'login' && (
                    <div className="flex items-center gap-2 p-3 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl mb-3">
                      <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>{resetSuccessMessage}</span>
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center gap-2 p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-xl mb-3">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    {mode === 'register' && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Nama Lengkap Anda
                        </label>
                        <div className="relative">
                          <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Contoh: Budi Santoso"
                            className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Alamat Email Aktif
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="nama@email.com"
                          className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-slate-700">
                          Kata Sandi
                        </label>
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
                          className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-emerald-600/25 transition-all hover:shadow-xl disabled:opacity-60 active:scale-98"
                    >
                      <span>
                        {loading
                          ? 'Memproses...'
                          : mode === 'register'
                          ? 'Lanjut ke Verifikasi Email'
                          : 'Masuk & Buka CV Saya'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="text-center pt-2">
                      <p className="text-[11px] text-slate-400">
                        {mode === 'register'
                          ? 'Akses unduh CV hanya Rp 25.000 sekali bayar untuk 1 tahun penuh.'
                          : 'Belum punya akun? Klik Daftar Akun Baru di atas.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={async () => {
                          await loginDemoUser();
                          if (onSuccess) onSuccess();
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Coba Langsung Editor & Surat Lamaran (Mode Uji Coba)</span>
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURE SHOWCASE (SEO OPTIMIZED) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/80">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Keunggulan Utama
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              Fitur Lengkap Pembuat CV Standar ATS Indonesia
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Dirancang khusus untuk membantu pencari kerja fresh graduate, profesional berpengalaman, hingga pergantian karier agar lolos seleksi awal HRD.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3.5">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                10+ Templat CV Standar HRD & ATS
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pilihan desain mulai dari Modern, Klasik, Minimalis, hingga Eksekutif dengan struktur hierarki yang mudah dibaca oleh algoritma Applicant Tracking System.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3.5">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                Kalkulator Skor ATS Otomatis
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluasi kelengkapan data kontak, ringkasan profil, dan deskripsi tugas Anda secara real-time dengan rekomendasi tips agar lolos seleksi administrasi.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3.5">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                Bilingual (Indonesia & English)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Beralih antara Bahasa Indonesia dan Bahasa Inggris dengan 1 klik. Judul bagian seperti Pengalaman Kerja dan Pendidikan menyesuaikan otomatis.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3.5">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                Drag & Drop Susunan Pengalaman
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ubah urutan riwayat pekerjaan dan pendidikan semudah menggeser item (drag & drop) atau menggunakan tombol panah atas/bawah yang intuitif.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3.5">
                <Type className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                Pilihan Tipografi ATS Modern
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kustomisasi jenis huruf dengan pilihan font Sans (Inter), Serif (Merriweather), atau Monospace yang ramah sistem pemindaian OCR.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-3.5">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                Unduh PDF Cetak A4 Tanpa Watermark
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hasil cetak dokumen PDF resolusi tajam, teks dapat disorot (searchable), dan tanpa logo watermark, siap dikirim ke LinkedIn, JobStreet, atau Glints.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center bg-slate-100/70 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-center gap-6">
            <span className="flex items-center gap-1.5 font-medium text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Draf CV tersimpan aman di akun Anda
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-800">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Akses 1 tahun penuh Rp 25.000 sekali bayar tanpa biaya tersembunyi
            </span>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION (SEO CONTENT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Panduan Cepat
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            Cara Membuat CV ATS Friendly dalam 3 Langkah Mudah
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Hanya butuh 5 menit dari pendaftaran hingga CV siap dikirim ke perusahaan impian Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center mb-4 shadow-md shadow-emerald-500/20">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Lengkapi Data Diri & Pengalaman
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Masukkan informasi kontak, ringkasan profesional, riwayat pekerjaan, pendidikan, dan keahlian teknis Anda melalui formulir yang rapi dan terstruktur.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center mb-4 shadow-md shadow-emerald-500/20">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Pilih Templat & Pantau Skor ATS
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pilih dari 10 templat CV profesional, ubah jenis font, dan pantau skor ATS Anda secara langsung dengan tips perbaikan instan di layar pratinjau.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center mb-4 shadow-md shadow-emerald-500/20">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Aktivasi Rp 25rb & Unduh Dokumen PDF
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Konfirmasi aktivasi Rp 25.000 untuk akses 1 tahun penuh, lalu unduh dokumen CV berkualitas tinggi tanpa watermark siap kirim ke portal HRD.
            </p>
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION (SEARCH ENGINE RICH SNIPPETS) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tanya Jawab</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            Pertanyaan Umum Seputar CV ATS & cvbagus.id
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Jawaban lengkap atas hal-hal yang sering ditanyakan seputar pembuatan CV standar ATS dan layanan kami.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Apa itu CV ATS Friendly dan mengapa sangat penting?',
              a: 'CV ATS Friendly adalah format Curriculum Vitae yang dirancang khusus agar dapat dipindai, diuraikan, dan dinilai secara akurat oleh sistem Applicant Tracking System (ATS) yang digunakan oleh HRD dan perusahaan multinasional. Format ini menggunakan hierarki standar, kata kunci relevan, dan tipografi yang mudah dibaca mesin sehingga profil Anda tidak tereliminasi sebelum dibaca oleh manusia.',
            },
            {
              q: 'Berapa biaya pembuatan dan unduh CV di cvbagus.id?',
              a: 'Pendaftaran akun, pengisian formulir, penyesuaian templat, dan pengecekan skor ATS dapat dinikmati secara gratis. Untuk mengaktifkan akses unduh PDF kualitas cetak tanpa watermark dan membuka seluruh 10 templat CV selama 1 tahun penuh, biayanya hanya Rp 25.000 sekali bayar tanpa sistem tagihan bulanan otomatis.',
            },
            {
              q: 'Apakah CV bisa diunduh dalam format PDF resmi?',
              a: 'Ya, CV dapat langsung diunduh dalam format PDF standar ukuran A4 yang rapi, teks dapat disorot (searchable text), dan ramah terhadap sistem verifikasi dokumen lowongan kerja online.',
            },
            {
              q: 'Apakah tersedia pilihan Bahasa Indonesia dan Bahasa Inggris?',
              a: 'Ya, cvbagus.id menyediakan fitur pemilihan bahasa ganda. Anda dapat beralih antara Bahasa Indonesia dan English dengan satu klik, dan judul-judul bagian seperti Pengalaman Kerja (Work Experience) dan Pendidikan (Education) akan menyesuaikan secara otomatis.',
            },
            {
              q: 'Bagaimana cara kerja penilaian skor ATS di aplikasi ini?',
              a: 'Fitur ATS Score Checker menganalisis kelengkapan data kontak, kejelasan ringkasan profil, jumlah pengalaman kerja, riwayat pendidikan, dan keahlian teknis Anda secara real-time dengan skor persentase 0–100% serta checklist tips perbaikan instan.',
            },
            {
              q: 'Apakah data pribadi dan draf CV saya tersimpan dengan aman?',
              a: 'Tentu saja. Semua draf CV dan riwayat formulir tersimpan secara aman di dalam akun Anda sehingga Anda dapat kembali masuk kapan saja untuk memperbarui pengalaman kerja terbaru.',
            },
          ].map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {faq.q}
                  </span>
                  <div className="p-1 rounded-lg bg-slate-100 text-slate-500 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. CALL TO ACTION (CTA) */}
      <section className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white py-14 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Siap Melamar Pekerjaan Impian Anda?
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto">
            Daftar sekarang secara gratis, susun CV standar ATS Anda dalam 5 menit, dan tingkatkan peluang lolos interview kerja di perusahaan terkemuka.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setMode('register');
              }}
              className="inline-flex items-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg shadow-emerald-900/30 transition-all hover:scale-105 active:scale-95"
            >
              <span>Buat CV ATS Sekarang (Gratis)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. SEO FOOTER */}
      <footer className="bg-slate-900 text-slate-400 pt-12 pb-8 px-4 sm:px-6 lg:px-8 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 mb-10 text-left">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">
                CB
              </div>
              <span className="text-base font-extrabold text-white">
                cvbagus<span className="text-emerald-400">.id</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Platform pembuatan Curriculum Vitae dan resume online berstandar sistem ATS (Applicant Tracking System) untuk pencari kerja di Indonesia melalui cvbagus.id. Dilengkapi 10 templat profesional, skor ATS instan, dan unduh PDF kualitas tinggi.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Fitur Populer
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>10+ Templat CV ATS Friendly</li>
              <li>Live ATS Score Checker</li>
              <li>Bilingual (Indonesia & English)</li>
              <li>Drag & Drop Reorder Pengalaman</li>
              <li>Pilihan Font Sans, Serif, Mono</li>
              <li>Akses 1 Tahun Rp 25.000</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Informasi & Bantuan
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => setTipsModalOpen(true)}
                  className="hover:text-emerald-400 transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  Tips Karir (Artikel CMS)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setNewsModalOpen(true)}
                  className="hover:text-emerald-400 transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <Newspaper className="w-3.5 h-3.5 text-blue-400" />
                  Portal Berita Resmi
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setContactModalOpen(true)}
                  className="hover:text-emerald-400 transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  Hubungi Kami (Support)
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Pencarian Terkait
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {[
                'cvbagus.id',
                'Bikin CV Online',
                'Template CV ATS',
                'Format CV HRD',
                'Contoh CV Lamaran',
                'CV Maker Indonesia',
                'Download CV PDF',
                'Resume ATS Friendly',
                'CV Bahasa Inggris',
              ].map((tag, i) => (
                <span
                  key={i}
                  className="bg-slate-800 text-slate-300 text-[10px] px-2 py-1 rounded-md border border-slate-700/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© 2026 cvbagus.id. Solusi Pembuatan CV Profesional & Ramah ATS.</p>
          <p className="text-slate-500">Dioptimalkan untuk Pencarian Google Indonesia</p>
        </div>
      </footer>

      {/* Navigation Modals */}
      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
      <NewsModal isOpen={newsModalOpen} onClose={() => setNewsModalOpen(false)} />
      <TipsModal isOpen={tipsModalOpen} onClose={() => setTipsModalOpen(false)} />
    </div>
  );
};
