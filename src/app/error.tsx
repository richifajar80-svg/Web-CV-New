'use client';

import React, { useEffect } from 'react';
import { RefreshCw, ArrowLeft } from 'lucide-react';

export default function GlobalAppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error caught by boundary:', error);
    // Auto-reload once if caused by a new Vercel deployment chunk update
    if (
      typeof window !== 'undefined' &&
      (error?.message?.includes('ChunkLoadError') ||
        error?.message?.includes('Loading chunk') ||
        error?.message?.includes('Failed to fetch dynamically imported module'))
    ) {
      const reloadedKey = 'cvbagus_chunk_reload_ts';
      const lastReload = Number(sessionStorage.getItem(reloadedKey) || '0');
      if (Date.now() - lastReload > 10000) {
        sessionStorage.setItem(reloadedKey, String(Date.now()));
        window.location.reload();
      }
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 font-extrabold text-lg flex items-center justify-center mx-auto">
          CB
        </div>
        <h2 className="text-lg font-extrabold text-slate-900">
          Memperbarui Halaman CVBagus.id
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Sistem baru saja diperbarui di server. Silakan klik tombol di bawah untuk memuat ulang halaman dengan versi terbaru.
        </p>
        <div className="flex items-center justify-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Muat Ulang Sekarang</span>
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </button>
        </div>
      </div>
    </div>
  );
}
