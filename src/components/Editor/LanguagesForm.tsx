'use client';

import React from 'react';
import { Language } from '@/types/cv';
import { Languages as LanguagesIcon, Plus, X, Globe, Sparkles } from 'lucide-react';

interface LanguagesFormProps {
  languages: Language[];
  onChange: (languages: Language[]) => void;
}

const POPULAR_LANGUAGES = [
  { name: 'Bahasa Indonesia', level: 'Penutur Asli (Native)' },
  { name: 'Bahasa Inggris', level: 'Profesional / Fasih' },
  { name: 'Bahasa Mandarin', level: 'Menengah / Konversasi' },
  { name: 'Bahasa Jepang', level: 'Tingkat Menengah' },
  { name: 'Bahasa Arab', level: 'Dasar / Pemula' },
  { name: 'Bahasa Jerman', level: 'Dasar' },
];

const STANDARD_LEVELS = [
  'Penutur Asli (Native)',
  'Fasih / Profesional Penuh',
  'Aktif / Konversasi Kerja',
  'Menengah (Intermediate)',
  'Dasar / Pemula (Basic)',
];

export const LanguagesForm: React.FC<LanguagesFormProps> = ({ languages, onChange }) => {
  const handleAdd = () => {
    onChange([
      ...languages,
      {
        id: `lang-${Date.now()}`,
        name: '',
        level: 'Fasih / Profesional Penuh',
      },
    ]);
  };

  const handleAddPreset = (preset: { name: string; level: string }) => {
    if (languages.some((l) => l.name.toLowerCase() === preset.name.toLowerCase())) return;
    onChange([
      ...languages,
      {
        id: `lang-${Date.now()}-${Math.random()}`,
        name: preset.name,
        level: preset.level,
      },
    ]);
  };

  const handleUpdate = (idx: number, fields: Partial<Language>) => {
    const next = [...languages];
    next[idx] = { ...next[idx], ...fields };
    onChange(next);
  };

  const handleRemove = (idx: number) => {
    onChange(languages.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <LanguagesIcon className="w-4 h-4 text-emerald-600" />
            <span>Penguasaan Bahasa</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tampilkan bahasa asing atau daerah yang Anda kuasai untuk menambah nilai jual di mata HRD.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Bahasa</span>
        </button>
      </div>

      {/* Popular Presets */}
      <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-3 sm:p-4 space-y-2">
        <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tambah Cepat (Rekomendasi Populer):</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_LANGUAGES.map((preset) => {
            const exists = languages.some((l) => l.name.toLowerCase() === preset.name.toLowerCase());
            if (exists) return null;
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleAddPreset(preset)}
                className="text-[11px] font-medium px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-lg transition-all cursor-pointer shadow-2xs"
              >
                + {preset.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Languages List */}
      {languages.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <Globe className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-600">Belum ada bahasa yang ditambahkan</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Klik tombol Tambah Bahasa atau pilih rekomendasi di atas.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {languages.map((lang, idx) => (
            <div
              key={lang.id}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all"
            >
              <div className="flex-1">
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Bahasa
                </label>
                <input
                  type="text"
                  spellCheck={false}
                  value={lang.name}
                  onChange={(e) => handleUpdate(idx, { name: e.target.value })}
                  placeholder="Contoh: Bahasa Inggris, Mandarin, Jepang..."
                  className="w-full text-xs sm:text-[13px] font-semibold px-3 py-2 bg-slate-50/70 border border-slate-300 hover:border-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 rounded-xl text-slate-900 outline-none transition-all"
                />
              </div>

              <div className="sm:w-56">
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Tingkat Kefasihan
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    spellCheck={false}
                    list={`levels-list-${lang.id}`}
                    value={lang.level}
                    onChange={(e) => handleUpdate(idx, { level: e.target.value })}
                    placeholder="Pilih / ketik tingkat kemahiran..."
                    className="w-full text-xs sm:text-[13px] font-semibold px-3 py-2 bg-slate-50/70 border border-slate-300 hover:border-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 rounded-xl text-slate-900 outline-none transition-all"
                  />
                  <datalist id={`levels-list-${lang.id}`}>
                    {STANDARD_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl} />
                    ))}
                  </datalist>

                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer shrink-0"
                    title="Hapus bahasa"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
