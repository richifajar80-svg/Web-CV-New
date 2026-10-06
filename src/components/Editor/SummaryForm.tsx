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
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-700">Ringkasan Diri</label>
            {language === 'en' && (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Mode CV English
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {summary.length} karakter
          </span>
        </div>

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
