'use client';

import React, { useState } from 'react';
import { Sparkles, FileText, Loader2, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SummaryFormProps {
  summary: string;
  onChange: (summary: string) => void;
  jobTitle?: string;
  language?: 'id' | 'en';
}

const TEMPLATE_PRESETS = [
  {
    title: 'Experienced Senior Engineer / Tech Lead',
    text: 'Senior Software Engineer berpengalaman 5+ tahun dalam membangun aplikasi web modern berskala besar dengan ekosistem React, Next.js, TypeScript, dan Node.js. Memiliki rekam jejak sukses dalam meningkatkan performa sistem hingga 40% dan memimpin tim pengembang beranggotakan 6 engineer.',
  },
  {
    title: 'Fresh Graduate / Entry Level',
    text: 'Lulusan baru Ilmu Komputer dengan pemahaman kuat dalam pengembangan web modern, clean code, dan arsitektur database relasional. Memiliki motivasi tinggi untuk belajar cepat, beradaptasi dengan teknologi baru, dan memberikan kontribusi nyata dalam tim engineering profesional.',
  },
  {
    title: 'Project Manager / Product Lead',
    text: 'Technical Project Manager berorientasi hasil dengan rekam jejak sukses memimpin delivery 15+ proyek digital skala enterprise tepat waktu dan sesuai anggaran. Mahir dalam manajemen stakeholder, metodologi Agile Scrum, dan mitigasi risiko teknis.',
  },
];

export const SummaryForm: React.FC<SummaryFormProps> = ({
  summary,
  onChange,
  jobTitle,
  language = 'id',
}) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [originalBackup, setOriginalBackup] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessBadge, setShowSuccessBadge] = useState(false);

  const handleTranslateSummary = async () => {
    if (!summary || !summary.trim() || isTranslating) return;

    setError(null);
    setIsTranslating(true);

    // Save backup if not already saved
    if (!originalBackup) {
      setOriginalBackup(summary);
    }

    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: summary,
          role: jobTitle,
          type: 'summary',
          targetLanguage: 'en',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.translatedText) {
        setError(data.error || 'Gagal menerjemahkan ringkasan dengan Gemini AI.');
        return;
      }

      onChange(data.translatedText);
      setShowSuccessBadge(true);
      setTimeout(() => setShowSuccessBadge(false), 6000);
    } catch (err: any) {
      setError('Terjadi kendala jaringan saat menghubungi Google Gemini AI.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleUndo = () => {
    if (originalBackup) {
      onChange(originalBackup);
      setOriginalBackup(null);
      setShowSuccessBadge(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="border-b border-slate-200/80 pb-3">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>Ringkasan Profesional (Bio / Summary)</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Tuliskan 2–4 kalimat singkat yang merangkum pengalaman terbaik, keahlian utama, dan nilai tambah yang Anda tawarkan.
        </p>
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-700">Ringkasan Diri</label>
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {summary.length} karakter
            </span>
            {language === 'en' && (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Mode CV English
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Undo button */}
            {originalBackup && (
              <button
                type="button"
                onClick={handleUndo}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer border border-slate-200"
                title="Kembalikan teks ringkasan bahasa Indonesia sebelumnya"
              >
                <RotateCcw className="w-3 h-3 text-slate-500" />
                <span>Teks Asli</span>
              </button>
            )}

            {/* Translate Button */}
            <button
              type="button"
              disabled={isTranslating || !summary.trim()}
              onClick={handleTranslateSummary}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 active:scale-98 px-3 py-1 rounded-lg shadow-xs shadow-emerald-700/20 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              title="Terjemahkan ke Bahasa Inggris profesional standar ATS menggunakan Google Gemini AI"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Menerjemahkan (Gemini AI)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>Translate English (Gemini AI)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Translation Error Alert */}
        {error && (
          <div className="mb-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-700">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-800 underline ml-2 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Success Banner */}
        {showSuccessBadge && (
          <div className="mb-2 p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>✨ Berhasil diterjemahkan ke Bahasa Inggris eksekutif standar ATS!</span>
          </div>
        )}

        <textarea
          rows={6}
          spellCheck={false}
          value={summary}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Tuliskan deskripsi profesional Anda di sini..."
          className="w-full text-xs p-3.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl leading-relaxed resize-y transition-all text-slate-800 placeholder:text-slate-400 outline-none"
        />
        <p className="text-[11px] text-slate-500 mt-1.5">
          💡 Rekruter membaca ringkasan ini dalam 6 detik pertama. Fokuskan pada pencapaian tertinggi Anda.
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
