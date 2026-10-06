'use client';

import React from 'react';
import { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Globe, Sparkles } from 'lucide-react';
import { LinkedinIcon } from '@/components/icons/LinkedinIcon';
import { getCVTranslations } from '@/utils/translations';

export const CreativeTemplate: React.FC<{ data: CVData }> = ({ data }) => {
  const { personalInfo, summary, experiences, education, skills, languages, certifications, theme } = data;
  const accent = theme.accentColor || '#7c3aed'; // vibrant purple or custom
  const t = getCVTranslations(theme.language);

  return (
    <div className="w-full bg-white text-slate-800 p-8 sm:p-10 min-h-[297mm] space-y-6">
      {/* Creative Hero Card Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: accent }} />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white/10 text-white border border-white/20">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Creative Portfolio & CV</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {personalInfo.fullName || t.candidateDefaultName}
          </h1>
          <p className="text-sm font-semibold tracking-wide text-white/80">
            {personalInfo.jobTitle}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/70 pt-2">
            {personalInfo.email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{personalInfo.email}</span>}
            {personalInfo.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{personalInfo.phone}</span>}
            {personalInfo.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{personalInfo.location}</span>}
          </div>
        </div>

        {personalInfo.showPhoto && personalInfo.photoUrl && (
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white/30 shadow-xl shrink-0 relative z-10">
            <img src={personalInfo.photoUrl} alt={personalInfo.fullName} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div className="border-l-4 pl-4 py-1" style={{ borderColor: accent }}>
          <p className="text-xs text-slate-700 leading-relaxed text-justify italic">{summary}</p>
        </div>
      )}

      {/* Experience Section */}
      {experiences.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-2" style={{ color: accent }}>
            <span className="w-3 h-1 rounded" style={{ backgroundColor: accent }} />
            {t.workExperience}
          </h3>

          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                  <span className="text-xs font-extrabold text-slate-900">{exp.role}</span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white w-fit" style={{ backgroundColor: accent }}>
                    {exp.startDate} - {exp.current ? t.present : exp.endDate}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-600">
                  {exp.company} {exp.location ? `• ${exp.location}` : ''}
                </div>
                {exp.description && (
                  <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed pt-1">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Skills + Education */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
        {skills.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-2" style={{ color: accent }}>
              <span className="w-3 h-1 rounded" style={{ backgroundColor: accent }} />
              {t.skillsCompetence}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span key={s.id} className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-2" style={{ color: accent }}>
              <span className="w-3 h-1 rounded" style={{ backgroundColor: accent }} />
              {t.education}
            </h3>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <div className="font-bold text-slate-900">{edu.degree}</div>
                  <div className="text-slate-600">{edu.institution} ({edu.startDate} - {edu.endDate})</div>
                  {edu.gpa && <div className="text-[11px] text-slate-500">{t.gpa}: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
