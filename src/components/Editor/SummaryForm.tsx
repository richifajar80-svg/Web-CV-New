'use client';

import React from 'react';
import { Sparkles, FileText } from 'lucide-react';

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

export const SummaryForm: React.FC<SummaryFormProps> = ({ summary, onChange, language = 'id' }) => {
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

      <div className="p-4 sm:p-5 bg-slate-50/80 border border-slate-200/90 rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <label className="text-xs font-extrabold text-slate-800">Ringkasan Diri</label>
            {language === 'en' && (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Mode CV English
              </span>
            )}
          </div>
          <span className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">
            {summary.length} karakter
          </span>
        </div>

        <textarea
          rows={6}
          spellCheck={false}
          value={summary}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Tuliskan deskripsi profesional Anda di sini..."
          className="w-full text-xs sm:text-[13px] font-medium p-3.5 bg-white border-2 border-slate-300 hover:border-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 rounded-xl leading-relaxed resize-y shadow-2xs transition-all text-slate-900 placeholder:text-slate-400 placeholder:font-normal outline-none"
        />
        <p className="text-[11px] text-slate-600 font-medium mt-2">
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
