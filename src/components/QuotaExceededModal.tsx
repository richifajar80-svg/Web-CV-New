'use client';

import React from 'react';
import { X, Sparkles, CheckCircle2, ShieldAlert, ArrowRight, Mail } from 'lucide-react';

interface QuotaExceededModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'download' | 'translate';
  title?: string;
  message?: string;
}

export const QuotaExceededModal: React.FC<QuotaExceededModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
}) => {
  if (!isOpen) return null;

  const defaultTitle =
    type === 'download'
      ? 'Batas Unduh PDF Bulan Ini Telah Tercapai'
      : 'Batas Kuota AI Translate Bulan Ini Telah Tercapai';

  const defaultDesc =
    type === 'download'
      ? 'Akun Anda menggunakan Paket Personal dengan batas Fair Usage Policy (FUP) 10x unduh per bulan. Kuota Anda akan direset otomatis pada tanggal 1 bulan depan.'
      : 'Akun Anda menggunakan Paket Personal dengan kuota 5x AI Translate per bulan. Kuota Anda akan direset otomatis pada tanggal 1 bulan depan.';

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex min-h-full items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-6 py-5 text-white relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/90 hover:text-white bg-black/25 hover:bg-black/45 w-8 h-8 rounded-full flex items-center justify-center transition-all z-30 cursor-pointer shadow-md ring-1 ring-white/20 active:scale-95"
            title="Tutup (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 bg-black/25 px-3 py-1 rounded-full text-[11px] font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-200" />
            <span>Fair Usage Policy (FUP)</span>
          </div>

          <h2 className="text-xl font-black">{title || defaultTitle}</h2>
          <p className="text-xs text-amber-100 mt-1">
            {message || defaultDesc}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Card: Penawaran Enterprise untuk Joki / Agency */}
          <div className="bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-white border-2 border-indigo-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Solusi Jasa CV: Paket Enterprise</h3>
                  <p className="text-[11px] text-indigo-700 font-semibold">Rp 199.000 / tahun • Dirancang khusus Joki & Agency</p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                Rp 199.000 / thn
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Jika Anda melayani jasa pembuatan CV untuk banyak klien, upgrade akun Anda dari Paket Personal (Rp 25.000) ke <strong>Paket Enterprise (Rp 199.000/thn)</strong>:
            </p>

            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>100x Unduh PDF</strong> per bulan (10x lipat dari Personal)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>25x AI Translate</strong> per bulan (5x lipat dari Personal)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Simpan banyak draf CV multi-klien tanpa batasan</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-1">
            <a
              href="mailto:no-reply.cvbagus@gmail.com?subject=Permintaan%20Upgrade%20Paket%20Enterprise%20(Rp%20199rb)&body=Halo%20Admin%20cvbagus.id,%0A%0ASaya%20ingin%20upgrade%20akun%20saya%20ke%20Paket%20Enterprise%20(Rp%20199.000/tahun)%20agar%20mendapatkan%20kuota%20100x%20unduh%20dan%2025x%20translate%20per%20bulan.%0A%0AEmail%20Akun:%20"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Mail className="w-4 h-4" />
              <span>Upgrade ke Enterprise (Rp 199.000 / thn)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Tutup & Tunggu Reset Bulan Depan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
