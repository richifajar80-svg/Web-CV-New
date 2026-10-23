'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  ShieldCheck,
  CheckCircle,
  QrCode,
  Wallet,
  Sparkles,
  ArrowRight,
  Download,
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
  const { activateSubscription } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'personal' | 'enterprise'>('personal');
  const [method, setMethod] = useState<'qris' | 'ewallet'>('qris');
  const [selectedEwallet, setSelectedEwallet] = useState<'GoPay' | 'DANA' | 'ShopeePay' | 'OVO'>('GoPay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaidSuccess, setIsPaidSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Smooth fade-in animation
  useEffect(() => {
    if (isOpen) {
      const raf = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Close modal on Escape key
  useEffect(() => {
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
      className={`fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 transition-opacity duration-500 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) {
          onClose();
        }
      }}
    >
      <div
        className={`relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col transition-all duration-500 ease-out ${
          isVisible
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {isPaidSuccess ? (
          /* PAYMENT SUCCESS VIEW */
          <div className="p-7 text-center space-y-4 my-auto">
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
          /* COMPACT SINGLE-SCREEN CHECKOUT VIEW */
          <>
            {/* Compact Header Banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-5 py-3.5 text-white text-center relative shrink-0">
              {!isProcessing && (
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-3 right-3 text-white/90 hover:text-white bg-black/25 hover:bg-black/45 w-7 h-7 rounded-full flex items-center justify-center transition-all z-30 cursor-pointer shadow-sm ring-1 ring-white/20 active:scale-95"
                  title="Tutup (Esc)"
                  aria-label="Tutup modal pembayaran"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <div className="inline-flex items-center gap-1.5 bg-emerald-800/60 px-2.5 py-0.5 rounded-full text-[10px] font-semibold mb-1">
                <Sparkles className="w-3 h-3 text-emerald-300" />
                <span>Aktivasi Full Fitur 1 Tahun (s/d {formattedNextYear})</span>
              </div>
              <h2 className="text-base sm:text-lg font-black">Pilih Paket & Metode Pembayaran</h2>
            </div>

            {/* Compact Body (No scrolling needed on standard viewports) */}
            <div className="p-4 sm:p-5 space-y-3.5">
              {/* Plan Choice Selector */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Personal Plan */}
                <div
                  onClick={() => setSelectedPlan('personal')}
                  className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedPlan === 'personal'
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-extrabold text-slate-900">Personal</span>
                    <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                      Populer
                    </span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-lg font-black text-emerald-950">Rp 25.000</span>
                    <span className="text-[10px] text-slate-500 font-semibold">/thn</span>
                  </div>
                  <div className="mt-1.5 pt-1.5 border-t border-slate-200/70 space-y-0.5 text-[10px] text-slate-600 font-medium">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>10x Unduh PDF / bln</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>5x AI Translate / bln</span>
                    </div>
                  </div>
                </div>

                {/* Enterprise Plan */}
                <div
                  onClick={() => setSelectedPlan('enterprise')}
                  className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedPlan === 'enterprise'
                      ? 'border-indigo-500 bg-indigo-50/70 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-extrabold text-slate-900">Enterprise</span>
                    <span className="text-[9px] font-extrabold text-indigo-800 bg-indigo-100 px-1.5 py-0.5 rounded-full">
                      Joki CV
                    </span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-lg font-black text-indigo-950">Rp 199.000</span>
                    <span className="text-[10px] text-slate-500 font-semibold">/thn</span>
                  </div>
                  <div className="mt-1.5 pt-1.5 border-t border-slate-200/70 space-y-0.5 text-[10px] text-slate-600 font-medium">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-indigo-600 shrink-0" />
                      <span>100x Unduh PDF / bln</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-indigo-600 shrink-0" />
                      <span>25x AI Translate / bln</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods (Fokus QRIS & E-Wallet - Bebas Potongan Admin VA) */}
              <div className="space-y-2.5 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Metode Pembayaran Instan</span>
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Bebas Biaya Admin
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('qris')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      method === 'qris'
                        ? 'border-emerald-600 bg-emerald-50/60 text-emerald-800 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>QRIS (Semua Aplikasi)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('ewallet')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      method === 'ewallet'
                        ? 'border-emerald-600 bg-emerald-50/60 text-emerald-800 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Wallet className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>E-Wallet Instan</span>
                  </button>
                </div>

                {/* Compact QRIS / E-Wallet Preview Box */}
                {method === 'qris' ? (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                    <div className="w-16 h-16 bg-white p-1.5 rounded-xl border border-slate-300 shadow-2xs flex items-center justify-center shrink-0">
                      <div className="w-full h-full bg-slate-900 rounded-sm p-1 grid grid-cols-3 gap-0.5">
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
                    <div className="space-y-1 text-xs min-w-0">
                      <p className="font-bold text-slate-800 leading-tight">
                        Scan QRIS dari E-Wallet / M-Banking
                      </p>
                      <div className="flex flex-wrap items-center gap-1">
                        {['GoPay', 'DANA', 'OVO', 'ShopeePay', 'M-Banking'].map((badge) => (
                          <span
                            key={badge}
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] text-emerald-700 font-bold">
                        Total Pas: {selectedPlan === 'enterprise' ? 'Rp 199.000' : 'Rp 25.000'} (Aktif 365 Hari)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['GoPay', 'DANA', 'ShopeePay', 'OVO'] as const).map((wallet) => (
                        <button
                          key={wallet}
                          type="button"
                          onClick={() => setSelectedEwallet(wallet)}
                          className={`py-1.5 px-2 rounded-xl border text-[11px] font-extrabold transition-all cursor-pointer ${
                            selectedEwallet === wallet
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                          }`}
                        >
                          {wallet}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500 text-center">
                      Bayar instan via <strong>{selectedEwallet}</strong> • Total Pas{' '}
                      <strong className="text-emerald-700">
                        {selectedPlan === 'enterprise' ? 'Rp 199.000' : 'Rp 25.000'}
                      </strong>
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-1.5 pt-0.5">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleSimulatePayment}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm py-3 rounded-xl shadow-lg shadow-emerald-600/25 transition-all hover:shadow-xl active:scale-98 disabled:opacity-60 cursor-pointer"
                >
                  <span>
                    {isProcessing
                      ? 'Memverifikasi Pembayaran...'
                      : `Konfirmasi Bayar ${selectedPlan === 'enterprise' ? 'Rp 199.000' : 'Rp 25.000'} & Unduh CV`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Belum Mau Bayar, Kembali ke Editor
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
