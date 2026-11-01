'use client';

import React, { useState } from 'react';
import { Sparkles, FileText, Loader2, Check, AlertCircle } from 'lucide-react';
import { getUserAuthHeaders, useAuth } from '@/context/AuthContext';

interface SummaryFormProps {
  summary: string;
  onChange: (summary: string) => void;
  jobTitle?: string;
  experiences?: Array<{ role: string; company?: string }>;
  skills?: string[];
  language?: 'id' | 'en';
}

const TEMPLATE_PRESETS = [
  {
    title: 'Experienced Senior / Managerial Level',
    text: 'Profesional berpengalaman dengan rekam jejak sukses dalam memimpin operasional, meningkatkan efisiensi tim, dan mencapai target bisnis secara konsisten. Memiliki keahlian komunikasi persuasif, analisis strategi penjualan, dan kepemimpinan adaptif.',
  },
  {
    title: 'Supervisor & Koordinator Ritel / Toko',
    text: 'Supervisor operasional ritel berpengalaman memimpin tim toko untuk mencapai target omset dan kepuasan pelanggan prima. Terampil dalam manajemen inventaris (stock opname), pengawasan SOP pelayanan, dan pengembangan keterampilan staf.',
  },
  {
    title: 'Fresh Graduate / Lulusan Baru',
    text: 'Lulusan baru yang berdedikasi tinggi dengan pemahaman mendalam pada bidang keilmuan, kerja tim solid, dan komunikasi efektif. Memiliki motivasi tinggi untuk belajar cepat, beradaptasi dengan lingkungan kerja dinamis, dan memberikan kontribusi nyata bagi perusahaan.',
  },
];

export const SummaryForm: React.FC<SummaryFormProps> = ({
  summary,
  onChange,
  jobTitle,
  experiences = [],
  skills = [],
  language = 'id',
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleGenerateAI = async () => {
    if (!user) {
      setErrorMsg('Silakan masuk atau daftar akun gratis terlebih dahulu untuk menggunakan AI Asisten.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: getUserAuthHeaders(),
        body: JSON.stringify({
          action: 'generate_summary',
          jobTitle,
          experiences,
          skills,
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menghasilkan ringkasan dengan AI.');
      }

      onChange(data.result);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memproses dengan AI.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="border-b border-slate-200 pb-3.5">
        <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <span>Ringkasan Profesional (Bio / Summary)</span>
        </h3>
        <p className="text-xs text-slate-600 mt-1">
          Tuliskan 2–4 kalimat singkat yang merangkum pengalaman terbaik, keahlian utama, dan nilai tambah yang Anda tawarkan.
        </p>
      </div>

      <div className="p-4 sm:p-5 bg-slate-50/80 border border-slate-200/90 rounded-2xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <label className="text-xs font-extrabold text-slate-800">Ringkasan Diri</label>
            {language === 'en' && (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Mode CV English
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* AI Generate Summary Button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGenerateAI}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-gradient-to-r from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 border border-emerald-300 px-3 py-1.5 rounded-xl shadow-2xs transition-all cursor-pointer active:scale-98 disabled:opacity-50"
              title="AI akan membaca posisi dan pengalaman Anda lalu merangkum bio profesional otomatis"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                  <span>Merangkai Bio Eksekutif...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>✨ Tulis Otomatis dengan AI</span>
                </>
              )}
            </button>

            <span className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
              {summary.length} karakter
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-xs text-red-700">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMsg(null)}
              className="text-red-500 hover:text-red-700 font-bold ml-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {isSuccess && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-bold animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>✨ Ringkasan berhasil disusun otomatis oleh AI berdasarkan profil Anda!</span>
          </div>
        )}

        <textarea
          rows={6}
          spellCheck={false}
          value={summary}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Tuliskan deskripsi profesional Anda di sini, atau klik tombol 'Tulis Otomatis dengan AI' di atas..."
          className="w-full text-xs sm:text-[13px] font-medium p-3.5 bg-white border-2 border-slate-300 hover:border-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 rounded-xl leading-relaxed resize-y shadow-2xs transition-all text-slate-900 placeholder:text-slate-400 placeholder:font-normal outline-none"
        />
        <p className="text-[11px] text-slate-600 font-medium">
          💡 Rekruter membaca ringkasan ini dalam 6 detik pertama. Fokuskan pada keahlian dan pencapaian terbaik Anda.
        </p>
      </div>

      {/* Quick Template Presets */}
      <div className="bg-emerald-50/50 border border-emerald-200/70 rounded-2xl p-4 space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Gunakan Contoh Ringkasan Cepat Siap Pakai:</span>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {TEMPLATE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(preset.text)}
              className="text-left p-3 rounded-xl bg-white border border-emerald-100 hover:border-emerald-400 hover:shadow-xs transition-all group cursor-pointer"
            >
              <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                {preset.title}
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                {preset.text}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
