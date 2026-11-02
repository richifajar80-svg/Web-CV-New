'use client';

import React, { useState } from 'react';
import { Skill, Language, Certification } from '@/types/cv';
import { Plus, X, Wrench, Sparkles, CheckCircle2, HeartHandshake } from 'lucide-react';

interface SkillsFormProps {
  skills: Skill[];
  languages?: Language[];
  certifications?: Certification[];
  onUpdateSkills: (skills: Skill[]) => void;
  onUpdateLanguages?: (languages: Language[]) => void;
  onUpdateCertifications?: (certifications: Certification[]) => void;
}

const POPULAR_HARD_SKILLS = [
  'Microsoft Office / Excel',
  'Canva & Adobe Photoshop',
  'Point of Sale (POS)',
  'Stock Opname / Inventory',
  'Customer Service',
  'Visual Merchandising',
  'Digital Marketing & Meta Ads',
  'Data Analysis & SQL',
  'Figma & UI/UX',
  'React.js / Next.js',
  'Accounting & Pembukuan',
  'Project Management',
];

const POPULAR_SOFT_SKILLS = [
  'Kepemimpinan (Leadership)',
  'Komunikasi Efektif',
  'Negosiasi & Selling Skill',
  'Pemecahan Masalah (Problem Solving)',
  'Manajemen Waktu & Prioritas',
  'Kerja Sama Tim (Teamwork)',
  'Ketelitian & Perhatian Detail',
  'Adaptabilitas Tinggi',
];

export const SkillsForm: React.FC<SkillsFormProps> = ({
  skills,
  onUpdateSkills,
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

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="border-b border-slate-200/80 pb-3">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Wrench className="w-4 h-4 text-emerald-600" />
          <span>Keahlian & Kompetensi Utama</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Kombinasikan keahlian teknis (hard skills/tools) dan keterampilan interpersonal (soft skills) yang relevan dengan pekerjaan target Anda.
        </p>
      </div>

      {/* Add Skill Input Form */}
      <form onSubmit={handleAddSkill} className="flex gap-2">
        <input
          type="text"
          spellCheck={false}
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          placeholder="Ketik keahlian (contoh: Microsoft Excel, Negosiasi, Next.js)..."
          className="flex-1 text-base sm:text-[13px] font-semibold px-3.5 py-2.5 bg-white border-2 border-slate-300 hover:border-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 rounded-xl shadow-2xs transition-all text-slate-900 placeholder:text-slate-400 placeholder:font-normal outline-none"
        />
        <select
          value={newSkillLevel}
          onChange={(e) => setNewSkillLevel(e.target.value as Skill['level'])}
          className="text-base sm:text-[13px] font-semibold px-3 py-2.5 bg-white border-2 border-slate-300 hover:border-slate-400 focus:border-emerald-600 rounded-xl shadow-2xs text-slate-800 outline-none cursor-pointer"
        >
          <option value="Pemula">Pemula</option>
          <option value="Menengah">Menengah</option>
          <option value="Mahir">Mahir</option>
          <option value="Ahli">Ahli</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah</span>
        </button>
      </form>

      {/* Current Skill Chips */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
          <span>Keahlian yang Ditambahkan ({skills.length})</span>
          {skills.length >= 3 && (
            <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Memenuhi Standar ATS</span>
            </span>
          )}
        </div>
        {skills.length === 0 ? (
          <div className="p-5 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-xs text-slate-500">
            Belum ada keahlian ditambahkan. Ketik di atas atau pilih rekomendasi di bawah.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center gap-1.5 text-xs bg-emerald-50/90 text-emerald-900 border border-emerald-200/90 px-3 py-1.5 rounded-xl font-medium shadow-2xs group"
              >
                <span>{skill.name}</span>
                {skill.level && (
                  <span className="text-[10px] text-emerald-700 font-bold bg-white px-1.5 py-0.5 rounded-md border border-emerald-100">
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
        )}
      </div>

      {/* Quick Hard Skills Suggestions */}
      <div className="bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200 space-y-2">
        <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Keahlian Teknis & Tools (Klik untuk tambah cepat):</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_HARD_SKILLS.map((suggestion) => {
            const alreadyHas = skills.some(
              (s) => s.name.toLowerCase() === suggestion.toLowerCase()
            );
            if (alreadyHas) return null;
            return (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleAddPresetSkill(suggestion)}
                className="text-[11px] font-medium px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-lg transition-all cursor-pointer shadow-2xs"
              >
                + {suggestion}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Soft Skills Suggestions */}
      <div className="bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200 space-y-2">
        <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
          <HeartHandshake className="w-3.5 h-3.5 text-teal-600" />
          <span>Soft Skills & Kepemimpinan (Rekomendasi HRD):</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_SOFT_SKILLS.map((suggestion) => {
            const alreadyHas = skills.some(
              (s) => s.name.toLowerCase() === suggestion.toLowerCase()
            );
            if (alreadyHas) return null;
            return (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleAddPresetSkill(suggestion)}
                className="text-[11px] font-medium px-2.5 py-1 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200 hover:border-teal-300 rounded-lg transition-all cursor-pointer shadow-2xs"
              >
                + {suggestion}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
