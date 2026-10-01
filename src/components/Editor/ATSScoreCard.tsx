'use client';

import React, { useState } from 'react';
import { CVData } from '@/types/cv';
import { CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Sparkles, ShieldCheck } from 'lucide-react';

interface ATSScoreCardProps {
  cvData: CVData;
}

export function calculateATSScore(cvData: CVData): number {
  const hasName = Boolean(cvData.personalInfo.fullName?.trim());
  const hasTitle = Boolean(cvData.personalInfo.jobTitle?.trim());
  const hasContact = Boolean(cvData.personalInfo.email?.trim() && cvData.personalInfo.phone?.trim());
  const hasSummary = Boolean(cvData.summary?.trim() && cvData.summary.trim().length >= 40);
  const hasExperience = cvData.experiences.length > 0;
  const hasEducation = cvData.education.length > 0;
  const hasSkills = cvData.skills.length >= 3;

  const checklist = [
    { met: hasName && hasContact, weight: 25 },
    { met: hasTitle, weight: 15 },
    { met: hasSummary, weight: 15 },
    { met: hasExperience, weight: 20 },
    { met: hasEducation, weight: 15 },
    { met: hasSkills, weight: 10 },
  ];

  return checklist.reduce((acc, item) => acc + (item.met ? item.weight : 0), 0);
}

export const ATSScoreCard: React.FC<ATSScoreCardProps> = ({ cvData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Criteria calculations
  const hasName = Boolean(cvData.personalInfo.fullName?.trim());
  const hasTitle = Boolean(cvData.personalInfo.jobTitle?.trim());
  const hasContact = Boolean(cvData.personalInfo.email?.trim() && cvData.personalInfo.phone?.trim());
  const hasSummary = Boolean(cvData.summary?.trim() && cvData.summary.trim().length >= 40);
  const hasExperience = cvData.experiences.length > 0;
  const hasEducation = cvData.education.length > 0;
  const hasSkills = cvData.skills.length >= 3;

  const checklist = [
    { label: 'Nama lengkap & kontak (Email & No. HP)', met: hasName && hasContact, weight: 25 },
    { label: 'Posisi / jabatan tujuan pekerjaan', met: hasTitle, weight: 15 },
    { label: 'Ringkasan profesional / bio singkat (min. 40 karakter)', met: hasSummary, weight: 15 },
    { label: 'Minimal 1 riwayat pengalaman kerja', met: hasExperience, weight: 20 },
    { label: 'Minimal 1 riwayat pendidikan formal', met: hasEducation, weight: 15 },
    { label: 'Minimal 3 keahlian utama relevan', met: hasSkills, weight: 10 },
  ];

  const score = checklist.reduce((acc, item) => acc + (item.met ? item.weight : 0), 0);

  const getScoreColor = () => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-500';
    if (score >= 50) return 'text-blue-700 bg-blue-500';
    return 'text-amber-700 bg-amber-500';
  };

  const getScoreLabel = () => {
    if (score >= 90) return 'Luar Biasa & Sangat Ramah ATS! 🚀';
    if (score >= 80) return 'Sangat Baik & Siap Dilamar 🎯';
    if (score >= 50) return 'Cukup Baik, Tingkatkan Poin Tertentu 📈';
    return 'Perlu Dilengkapi Agar HRD Tertarik 💡';
  };

  return (
    <div className="bg-gradient-to-r from-emerald-50/80 via-white to-teal-50/40 border border-emerald-200/80 rounded-2xl p-3 sm:p-4 shadow-2xs">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
            {score}%
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-900">Skor Kesiapan CV & ATS:</span>
              <span className="text-xs font-extrabold text-emerald-800">{score}%</span>
            </div>
            <p className="text-[11px] text-slate-600 truncate mt-0.5 font-medium">
              {getScoreLabel()}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-white hover:bg-emerald-50/80 border border-emerald-200 px-2.5 py-1.5 rounded-xl transition-all shadow-2xs shrink-0 cursor-pointer"
        >
          <span>{isExpanded ? 'Tutup Tips' : 'Lihat Tips HRD'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden mt-3">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            score >= 80 ? 'bg-emerald-600' : score >= 50 ? 'bg-blue-600' : 'bg-amber-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Expanded Checklist */}
      {isExpanded && (
        <div className="mt-3.5 pt-3 border-t border-emerald-200/60 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Checklist Standar Seleksi Rekruter:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {checklist.map((item, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 p-2 rounded-xl border transition-all ${
                  item.met
                    ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                    : 'bg-white border-slate-200 text-slate-500'
                }`}
              >
                {item.met ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                )}
                <span className={`text-[11px] leading-tight ${item.met ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
