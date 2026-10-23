'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Languages,
  MessageCircle,
  Download,
  Zap,
  ArrowRight,
} from 'lucide-react';

interface WelcomePromoModalProps {
  isOpen: boolean;
  userName?: string;
  onClose: () => void;
  onActivateNow: () => void;
}

export const WelcomePromoModal: React.FC<WelcomePromoModalProps> = ({
  isOpen,
  userName,
  onClose,
  onActivateNow,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Trigger smooth fade-in animation after mount
  useEffect(() => {
    if (isOpen) {
      const raf = requestAnimationFrame(() => {
        setIsVisible(true);
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const firstName = userName ? userName.trim().split(' ')[0] : 'Rekan Karir';

  const fullFeatures = [
    {
      icon: Download,
      title: 'Unduh PDF A4 Standar ATS',
      desc: 'Tanpa watermark & lolos screening HRD',
    },
    {
      icon: Languages,
      title: '1-Klik Translate Inggris',
      desc: 'Terjemahkan CV otomatis dengan AI',
    },
    {
      icon: FileText,
      title: '10 Desain Template HRD',
      desc: 'Format ATS Harvard & Eksekutif Modern',
    },
    {
      icon: MessageCircle,
      title: '3-in-1 Kit Lamaran Kerja',
      desc: 'Surat PDF + Chat WA & Body Email HRD',
    },
  ];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 transition-opacity duration-500 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
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
        {/* Compact Top Banner */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-slate-900 px-5 py-4 text-white relative shrink-0 overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />

          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 text-white/90 hover:text-white bg-black/25 hover:bg-black/45 w-7 h-7 rounded-full flex items-center justify-center transition-all z-30 cursor-pointer shadow-sm ring-1 ring-white/20 active:scale-95"
            title="Tutup (Esc)"
            aria-label="Tutup penawaran"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-300/40 text-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold mb-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Spesial Member CVBagus.id</span>
          </div>

          <h2 className="text-base sm:text-lg font-black leading-snug pr-6">
            Halo, {firstName}! 👋 Siap Lamar Kerja Hari Ini?
          </h2>
          <p className="text-emerald-100 text-xs font-medium mt-0.5">
            Aktifkan full fitur untuk mengunduh CV & paket lamaran kerja Anda.
          </p>
        </div>

        {/* Compact Body Content (Fits 100% in 1 view without scrolling) */}
        <div className="p-4 sm:p-5 space-y-3.5">
          {/* Price Anchor Box */}
          <div className="bg-gradient-to-r from-amber-50 via-emerald-50/70 to-teal-50/60 border-2 border-emerald-300/90 rounded-2xl px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-2xs">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-500 line-through font-semibold">
                  Joki CV: Rp 75.000/buat
                </span>
                <span className="text-[9px] font-black uppercase bg-emerald-600 text-white px-1.5 py-0.5 rounded-full">
                  Hemat 67%
                </span>
              </div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  Rp 25.000
                </span>
                <span className="text-[11px] font-bold text-emerald-800">
                  / 1 Tahun Penuh (365 Hari)
                </span>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <span className="inline-block text-[10px] font-extrabold bg-white text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                Sekali Bayar
              </span>
            </div>
          </div>

          {/* 2x2 Compact Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {fullFeatures.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[11px] font-extrabold text-slate-900 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 leading-snug mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust Guarantee */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              QRIS & E-Wallet Instan
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Tanpa Perpanjangan Otomatis
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-1.5 pt-0.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                onActivateNow();
              }}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" />
              <span>Aktifkan Full Fitur Sekarang (Rp 25.000)</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Nanti Saja, Isi Data CV Dulu
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
