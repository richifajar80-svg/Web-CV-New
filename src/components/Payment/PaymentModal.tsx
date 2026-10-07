'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  ShieldCheck,
  CheckCircle,
  QrCode,
  CreditCard,
  Sparkles,
  ArrowRight,
  Download,
  Calendar,
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessDownload: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccessDownload,
}) => {
  const { user, activateSubscription } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'personal' | 'enterprise'>('personal');
  const [method, setMethod] = useState<'qris' | 'va'>('qris');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaidSuccess, setIsPaidSuccess] = useState(false);

  // Close modal on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isProcessing, onClose]);

  if (!isOpen) return null;

  const handleSimulatePayment = async () => {
    setIsProcessing(true);

    // Simulate payment verification delay (1 second)
    setTimeout(async () => {
      await activateSubscription(selectedPlan);
      setIsProcessing(false);
      setIsPaidSuccess(true);

      // Automatically trigger download after 1.2s and close modal
      setTimeout(() => {
        onSuccessDownload();
        onClose();
        setIsPaidSuccess(false);
      }, 1500);
    }, 1000);
  };

  // Format 1 year expiry date for preview
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const formattedNextYear = nextYear.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex min-h-full items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) {
          onClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {isPaidSuccess ? (
          /* PAYMENT SUCCESS VIEW */
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Pembayaran Berhasil!</h2>
              <p className="text-xs text-slate-600 mt-1">
                Akses akun Anda telah aktif selama 1 tahun penuh hingga{' '}
                <span className="font-semibold text-emerald-700">{formattedNextYear}</span>.
              </p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center justify-center gap-2 border border-emerald-200">
              <Download className="w-4 h-4 animate-bounce" />
              <span>Menyiapkan file PDF CV Anda sekarang...</span>
            </div>
          </div>
        ) : (
          /* CHECKOUT VIEW */
          <>
            {/* Header Banner (Pinned at top with prominent Close Button) */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-4 sm:py-5 text-white text-center relative shrink-0">
              {!isProcessing && (
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-3.5 right-3.5 text-white/90 hover:text-white bg-black/25 hover:bg-black/45 w-8 h-8 rounded-full flex items-center justify-center transition-all z-30 cursor-pointer shadow-md ring-1 ring-white/20 active:scale-95"
                  title="Tutup (Esc)"
                  aria-label="Tutup modal pembayaran"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              <div className="inline-flex items-center gap-1.5 bg-emerald-800/60 px-3 py-1 rounded-full text-[11px] font-semibold mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>Aktivasi Akun CV Maker</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black">Akses Unduh CV 1 Tahun</h2>
              <p className="text-xs text-emerald-100 mt-0.5">
                Sekali bayar, aktif 365 hari penuh tanpa perpanjangan otomatis.
              </p>
            </div>

            {/* Price & Benefits Scrollable Body */}
            <div className="p-5 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
              {/* Plan Choice Selector */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700">Pilih Paket Berlangganan (1 Tahun):</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Personal Plan */}
                  <div
                    onClick={() => setSelectedPlan('personal')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedPlan === 'personal'
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Paket Personal</span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Rp 25.000 / thn
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Pencari kerja individu</p>
                    <div className="mt-2 pt-2 border-t border-slate-200/60 space-y-1 text-[11px] text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span><strong>10x Unduh PDF</strong> / bulan</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span><strong>5x AI Translate</strong> / bulan</span>
                      </div>
                    </div>
                  </div>

                  {/* Enterprise Plan */}
                  <div
                    onClick={() => setSelectedPlan('enterprise')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedPlan === 'enterprise'
                        ? 'border-indigo-500 bg-indigo-50/70 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Paket Enterprise</span>
                      <span className="text-[10px] font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-full">
                        Rp 199.000 / thn
                      </span>
                    </div>
                    <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">Joki CV & Agency</p>
                    <div className="mt-2 pt-2 border-t border-slate-200/60 space-y-1 text-[11px] text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span><strong>100x Unduh PDF</strong> / bulan</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span><strong>25x AI Translate</strong> / bulan</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Price Card */}
              <div
                className={`border rounded-2xl p-4 flex items-center justify-between transition-colors ${
                  selectedPlan === 'enterprise'
                    ? 'bg-indigo-50/80 border-indigo-200'
                    : 'bg-emerald-50/70 border-emerald-200'
                }`}
              >
                <div>
                  <span
                    className={`text-xs font-semibold block ${
                      selectedPlan === 'enterprise' ? 'text-indigo-900' : 'text-emerald-800'
                    }`}
                  >
                    Total Biaya ({selectedPlan === 'enterprise' ? 'Paket Enterprise' : 'Paket Personal'})
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span
                      className={`text-2xl sm:text-3xl font-extrabold ${
                        selectedPlan === 'enterprise' ? 'text-indigo-950' : 'text-emerald-950'
                      }`}
                    >
                      {selectedPlan === 'enterprise' ? 'Rp 199.000' : 'Rp 25.000'}
                    </span>
                    <span className="text-xs text-slate-500">/ 1 Tahun</span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block text-[11px] font-bold bg-white px-2.5 py-1 rounded-full border shadow-2xs ${
                      selectedPlan === 'enterprise'
                        ? 'text-indigo-700 border-indigo-300'
                        : 'text-emerald-700 border-emerald-300'
                    }`}
                  >
                    Sekali Bayar (365 Hari)
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">Aktif s/d {formattedNextYear}</p>
                </div>
              </div>

              {/* What You Get */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Fitur yang Didapatkan:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle
                      className={`w-4 h-4 shrink-0 ${
                        selectedPlan === 'enterprise' ? 'text-indigo-600' : 'text-emerald-600'
                      }`}
                    />
                    <span>
                      {selectedPlan === 'enterprise' ? '100x Unduh PDF / bln' : '10x Unduh PDF / bln'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle
                      className={`w-4 h-4 shrink-0 ${
                        selectedPlan === 'enterprise' ? 'text-indigo-600' : 'text-emerald-600'
                      }`}
                    />
                    <span>Bebas watermark & kualitas cetak HD</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle
                      className={`w-4 h-4 shrink-0 ${
                        selectedPlan === 'enterprise' ? 'text-indigo-600' : 'text-emerald-600'
                      }`}
                    />
                    <span>Akses seluruh 10 templat CV premium</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle
                      className={`w-4 h-4 shrink-0 ${
                        selectedPlan === 'enterprise' ? 'text-indigo-600' : 'text-emerald-600'
                      }`}
                    />
                    <span>
                      {selectedPlan === 'enterprise'
                        ? 'Multi-klien draf bebas'
                        : 'Edit kapan saja 1 tahun'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Metode Pembayaran</span>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Pembayaran Aman
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('qris')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      method === 'qris'
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-800 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>QRIS (Semua E-Wallet)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('va')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      method === 'va'
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-800 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Transfer Bank / VA</span>
                  </button>
                </div>

                {/* QRIS / VA Preview Box */}
                {method === 'qris' ? (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                    <div className="w-24 h-24 bg-white p-2 rounded-xl border border-slate-300 shadow-2xs flex items-center justify-center shrink-0">
                      {/* Stylized QR placeholder */}
                      <div className="w-full h-full bg-slate-900 rounded-md p-1 grid grid-cols-3 gap-0.5">
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-slate-900"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-slate-900"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-slate-900"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-slate-900"></div>
                        <div className="bg-white rounded-xs"></div>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs">
                      <p className="font-bold text-slate-800">Scan dengan Aplikasi Pembayaran</p>
                      <p className="text-[11px] text-slate-500">
                        Mendukung GoPay, OVO, DANA, ShopeePay, BCA Mobile, Livin Mandiri, BRImo, dll.
                      </p>
                      <p className="text-[10px] text-emerald-700 font-semibold">
                        Nominal: Pas Rp 25.000
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>BCA / Mandiri / BRI Virtual Account</span>
                      <span className="text-emerald-700">Otomatis Terverifikasi</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Nomor Virtual Account akan diterbitkan setelah Anda mengklik konfirmasi.
                    </p>
                  </div>
                )}
              </div>

              {/* Pay Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSimulatePayment}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl shadow-lg shadow-emerald-600/25 transition-all hover:shadow-xl active:scale-98 disabled:opacity-60 cursor-pointer"
              >
                <span>
                  {isProcessing
                    ? 'Memverifikasi Pembayaran...'
                    : 'Konfirmasi Bayar Rp 25.000 & Unduh CV'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Secondary Close Button if user does not want to pay yet */}
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer border border-transparent hover:border-slate-200"
              >
                ✕ Belum Mau Bayar, Kembali ke Editor
              </button>

              <div className="text-center">
                <p className="text-[11px] text-slate-400">
                  Pembayaran sekali bayar untuk 1 tahun. Tidak ada tagihan otomatis tersembunyi.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
