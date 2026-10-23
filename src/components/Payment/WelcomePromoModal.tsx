'use client';

import React, { useEffect } from 'react';
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
      title: 'Unduh PDF A4 Standar ATS (Tanpa Watermark)',
      desc: 'Teks asli 100% terbaca sistem ATS BUMN, Perbankan, dan Perusahaan Multinasional.',
    },
    {
      icon: Languages,
      title: '1-Klik Translate CV ke Bahasa Inggris (Gemini AI)',
      desc: 'Ubah seluruh CV Indonesia Anda menjadi Bahasa Inggris standar rekruter global dalam 5 detik.',
    },
    {
      icon: FileText,
      title: 'Akses Bebas ke 10 Desain Template Pilihan HRD',
      desc: 'Tersedia format ATS Klasik (Harvard) tanpa foto maupun Eksekutif & Modern dengan foto.',
    },
    {
      icon: MessageCircle,
      title: 'Bonus Generator Chat WA HRD, Body Email & Surat Lamaran',
      desc: 'Kalimat pengantar WhatsApp & Email HRD langsung jadi otomatis dari data CV Anda.',
    },
  ];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex min-h-full items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Hero Banner */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-slate-900 px-6 py-5 text-white relative shrink-0 overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />

          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 text-white/90 hover:text-white bg-black/25 hover:bg-black/45 w-8 h-8 rounded-full flex items-center justify-center transition-all z-30 cursor-pointer shadow-md ring-1 ring-white/20 active:scale-95"
            title="Tutup (Esc)"
            aria-label="Tutup penawaran"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-300/40 text-amber-200 px-3 py-1 rounded-full text-[11px] font-extrabold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Penawaran Khusus Member Baru</span>
          </div>

          <h2 className="text-lg sm:text-xl font-black leading-snug">
            Selamat Datang, {firstName}! 👋
            <span className="block text-emerald-200 text-sm sm:text-base font-bold mt-0.5">
              Buka Full Fitur & Siap Lamar Kerja Hari Ini
            </span>
          </h2>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Price Anchor Comparison Box */}
          <div className="bg-gradient-to-r from-amber-50 via-emerald-50/70 to-teal-50/60 border-2 border-emerald-300/90 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-2xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 line-through font-semibold">
                  Joki CV: Rp 75.000 / sekali buat
                </span>
                <span className="text-[10px] font-black uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                  Hemat 67%
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  Rp 25.000
                </span>
                <span className="text-xs font-bold text-emerald-800">
                  / 1 Tahun Penuh (365 Hari)
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                Sekali bayar • Bebas edit & unduh CV berkali-kali kapan saja
              </p>
            </div>
          </div>

          {/* Full Features List */}
          <div className="space-y-2.5">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Keuntungan Mengaktifkan Full Fitur Sekarang:
            </p>
            <div className="space-y-2">
              {fullFeatures.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/80"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                        <span>{item.title}</span>
                      </h3>
                      <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trust Guarantee */}
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 font-medium pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Tanpa Perpanjangan Otomatis
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Aktif Instan Detik Ini
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                onActivateNow();
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" />
              <span>Aktifkan Full Fitur Sekarang (Rp 25.000 / Thn)</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Nanti Saja, Saya Mau Isi Data CV Dulu
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
