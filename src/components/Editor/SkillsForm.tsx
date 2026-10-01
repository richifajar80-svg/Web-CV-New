'use client';

import React, { useState } from 'react';
import { Skill, Language, Certification } from '@/types/cv';
import { Plus, X, Award, Languages as LanguagesIcon, Wrench, Sparkles } from 'lucide-react';

interface SkillsFormProps {
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  onUpdateSkills: (skills: Skill[]) => void;
  onUpdateLanguages: (languages: Language[]) => void;
  onUpdateCertifications: (certifications: Certification[]) => void;
}

const POPULAR_SKILL_SUGGESTIONS = [
  'React.js',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'Tailwind CSS',
  'Node.js',
  'PostgreSQL',
  'REST API',
  'Git & GitHub',
  'UI/UX Design',
  'Figma',
  'Agile Scrum',
  'Docker',
];

export const SkillsForm: React.FC<SkillsFormProps> = ({
  skills,
  languages,
  certifications,
  onUpdateSkills,
  onUpdateLanguages,
  onUpdateCertifications,
}) => {
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<Skill['level']>('Mahir');

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newSkillName.trim()) return;

    if (skills.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      setNewSkillName('');
      return;
    }

    onUpdateSkills([
      ...skills,
      { id: `sk-${Date.now()}`, name: newSkillName.trim(), level: newSkillLevel },
    ]);
    setNewSkillName('');
  };

  const handleAddPresetSkill = (name: string) => {
    if (skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) return;
    onUpdateSkills([
      ...skills,
      { id: `sk-${Date.now()}-${Math.random()}`, name, level: 'Mahir' },
    ]);
  };

  const handleRemoveSkill = (id: string) => {
    onUpdateSkills(skills.filter((s) => s.id !== id));
  };

  // Language Handlers
  const handleAddLanguage = () => {
    onUpdateLanguages([
      ...languages,
      { id: `lang-${Date.now()}`, name: '', level: 'Aktif / Konversasi' },
    ]);
  };

  const handleUpdateLanguage = (idx: number, fields: Partial<Language>) => {
    const updated = [...languages];
    updated[idx] = { ...updated[idx], ...fields };
    onUpdateLanguages(updated);
  };

  const handleRemoveLanguage = (idx: number) => {
    onUpdateLanguages(languages.filter((_, i) => i !== idx));
  };

  // Certification Handlers
  const handleAddCert = () => {
    onUpdateCertifications([
      ...certifications,
      { id: `cert-${Date.now()}`, title: '', issuer: '', date: '' },
    ]);
  };

  const handleUpdateCert = (idx: number, fields: Partial<Certification>) => {
    const updated = [...certifications];
    updated[idx] = { ...updated[idx], ...fields };
    onUpdateCertifications(updated);
  };

  const handleRemoveCert = (idx: number) => {
    onUpdateCertifications(certifications.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      {/* 1. SKILLS SECTION */}
      <div className="space-y-3.5">
        <div className="border-b border-slate-200/80 pb-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Wrench className="w-4 h-4 text-emerald-600" />
            <span>Keahlian & Kompetensi Teknis</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tambahkan keahlian utama, tools, software, bahasa pemrograman, atau keterampilan spesifik.
          </p>
        </div>

        {/* Add Skill Input Form */}
        <form onSubmit={handleAddSkill} className="flex gap-2">
          <input
            type="text"
            spellCheck={false}
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            placeholder="Ketik keahlian (contoh: Next.js, Python, Figma)..."
            className="flex-1 text-xs px-3 py-2 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl transition-all text-slate-800 placeholder:text-slate-400 outline-none"
          />
          <select
            value={newSkillLevel}
            onChange={(e) => setNewSkillLevel(e.target.value as Skill['level'])}
            className="text-xs px-3 py-2 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-slate-700 outline-none cursor-pointer"
          >
            <option value="Pemula">Pemula</option>
            <option value="Menengah">Menengah</option>
            <option value="Mahir">Mahir</option>
            <option value="Ahli">Ahli</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah</span>
          </button>
        </form>

        {/* Current Skill Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {skills.map((skill) => (
            <span
              key={skill.id}
              className="inline-flex items-center gap-1.5 text-xs bg-emerald-50/80 text-emerald-900 border border-emerald-200/90 px-3 py-1.5 rounded-xl font-medium shadow-2xs group"
            >
              <span>{skill.name}</span>
              {skill.level && (
                <span className="text-[10px] text-emerald-600 font-semibold bg-white px-1.5 py-0.2 rounded-md">
                  {skill.level}
                </span>
              )}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill.id)}
                className="text-emerald-500 hover:text-red-600 transition-colors p-0.5 ml-0.5 cursor-pointer"
                title="Hapus keahlian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>

        {/* Quick Popular Suggestions */}
        <div className="pt-2 bg-slate-50/80 p-3 rounded-xl border border-slate-200 space-y-1.5">
          <div className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Keahlian Populer (Klik untuk tambah cepat):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SKILL_SUGGESTIONS.map((suggestion) => {
              const alreadyHas = skills.some((s) => s.name.toLowerCase() === suggestion.toLowerCase());
              if (alreadyHas) return null;
              return (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleAddPresetSkill(suggestion)}
                  className="text-[11px] px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-lg transition-all cursor-pointer"
                >
                  + {suggestion}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. LANGUAGES SECTION */}
      <div className="space-y-3.5 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <LanguagesIcon className="w-4 h-4 text-emerald-600" />
              <span>Penguasaan Bahasa</span>
            </h3>
            <p className="text-xs text-slate-500">Bahasa yang Anda kuasai untuk komunikasi kerja.</p>
          </div>
          <button
            type="button"
            onClick={handleAddLanguage}
            className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Bahasa</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {languages.map((lang, idx) => (
            <div key={lang.id} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-50/70 p-2.5 rounded-xl border border-slate-200">
              <input
                type="text"
                spellCheck={false}
                value={lang.name}
                onChange={(e) => handleUpdateLanguage(idx, { name: e.target.value })}
                placeholder="Bahasa (e.g. Bahasa Indonesia, English)"
                className="flex-1 text-xs px-3 py-2 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-lg text-slate-800 placeholder:text-slate-400 outline-none"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  spellCheck={false}
                  value={lang.level}
                  onChange={(e) => handleUpdateLanguage(idx, { level: e.target.value })}
                  placeholder="Tingkat (e.g. Fasih / Konversasi)"
                  className="flex-1 sm:w-44 text-xs px-3 py-2 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-lg text-slate-800 placeholder:text-slate-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveLanguage(idx)}
                  className="text-slate-400 hover:text-red-600 p-1.5 transition-colors cursor-pointer shrink-0"
                  title="Hapus bahasa"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CERTIFICATIONS SECTION */}
      <div className="space-y-3.5 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Sertifikasi & Lisensi Profesional</span>
            </h3>
            <p className="text-xs text-slate-500">Sertifikat resmi kredensial penunjang karier.</p>
          </div>
          <button
            type="button"
            onClick={handleAddCert}
            className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Sertifikasi</span>
          </button>
        </div>

        <div className="space-y-3">
          {certifications.map((cert, idx) => (
            <div
              key={cert.id}
              className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-2.5 relative group"
            >
              <button
                type="button"
                onClick={() => handleRemoveCert(idx)}
                className="absolute top-3 right-3 text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                title="Hapus sertifikasi"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pr-8">
                <input
                  type="text"
                  spellCheck={false}
                  value={cert.title}
                  onChange={(e) => handleUpdateCert(idx, { title: e.target.value })}
                  placeholder="Nama Sertifikat (e.g. AWS Solutions Architect)"
                  className="sm:col-span-2 text-xs px-3 py-2 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-lg text-slate-800 placeholder:text-slate-400 outline-none"
                />
                <input
                  type="text"
                  spellCheck={false}
                  value={cert.date}
                  onChange={(e) => handleUpdateCert(idx, { date: e.target.value })}
                  placeholder="Tahun (e.g. 2023)"
                  className="text-xs px-3 py-2 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-lg text-slate-800 placeholder:text-slate-400 outline-none"
                />
              </div>
              <input
                type="text"
                spellCheck={false}
                value={cert.issuer}
                onChange={(e) => handleUpdateCert(idx, { issuer: e.target.value })}
                placeholder="Lembaga Penerbit (e.g. Google Cloud, BNSP, Microsoft)"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-lg text-slate-800 placeholder:text-slate-400 outline-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
