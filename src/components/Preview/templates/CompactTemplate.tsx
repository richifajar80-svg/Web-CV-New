'use client';

import React from 'react';
import { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { LinkedinIcon } from '@/components/icons/LinkedinIcon';
import { getCVTranslations } from '@/utils/translations';
import { FormattedDescription } from '../FormattedDescription';

export const CompactTemplate: React.FC<{ data: CVData }> = ({ data }) => {
  const { personalInfo, summary, experiences, education, skills, languages, certifications, theme } = data;
  const accent = theme.accentColor || '#1e40af';
  const t = getCVTranslations(theme.language);

  return (
    <div className="w-full bg-white text-slate-800 p-6 sm:p-8 min-h-[297mm] space-y-4 text-xs">
      {/* Header bar */}
      <div className="flex justify-between items-start border-b-2 pb-3" style={{ borderColor: accent }}>
        <div>
          <h1 className="text-2xl font-black text-slate-900 leading-tight">
            {personalInfo.fullName || t.candidateDefaultName}
          </h1>
          <h2 className="text-xs font-bold uppercase tracking-wider mt-0.5" style={{ color: accent }}>
            {personalInfo.jobTitle}
          </h2>
        </div>

        <div className="text-[11px] text-slate-600 text-right space-y-0.5">
          {personalInfo.email && <div className="flex items-center justify-end gap-1"><Mail className="w-3 h-3" style={{ color: accent }} />{personalInfo.email}</div>}
          {personalInfo.phone && <div className="flex items-center justify-end gap-1"><Phone className="w-3 h-3" style={{ color: accent }} />{personalInfo.phone}</div>}
          {personalInfo.location && <div className="flex items-center justify-end gap-1"><MapPin className="w-3 h-3" style={{ color: accent }} />{personalInfo.location}</div>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="leading-relaxed text-slate-700 text-justify">
          <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider mr-2 bg-slate-100 px-1.5 py-0.5 rounded">
            {t.summary}:
          </span>
          {summary}
        </div>
      )}

      {/* 2-Column Balanced Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 pt-1">
        {/* Left Col (7 of 12): Experiences */}
        <div className="sm:col-span-7 space-y-3.5">
          <h3 className="text-[11px] font-bold uppercase tracking-wider border-b pb-1 flex items-center justify-between" style={{ borderColor: `${accent}40`, color: accent }}>
            <span>{t.workExperience}</span>
            <span className="text-[9px] font-normal text-slate-400">{theme.language === 'en' ? 'Reverse Chronological' : 'Kronologis Terbalik'}</span>
          </h3>

          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id} className="space-y-0.5">
                <div className="flex justify-between font-bold text-slate-900 text-xs">
                  <span>{exp.role}</span>
                  <span className="text-[10px] font-medium text-slate-500">{exp.startDate} - {exp.current ? t.presentShort : exp.endDate}</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-600">
                  {exp.company} {exp.location ? `(${exp.location})` : ''}
                </div>
                <FormattedDescription
                  text={exp.description}
                  className="text-[11px] text-slate-600 leading-snug pt-0.5"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Col (5 of 12): Education, Skills, Langs, Certs */}
        <div className="sm:col-span-5 space-y-3.5">
          {/* Education */}
          {education.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider border-b pb-1" style={{ borderColor: `${accent}40`, color: accent }}>
                {t.education}
              </h3>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="space-y-0.5">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{edu.degree}</span>
                      <span className="text-[10px] text-slate-400">{edu.endDate}</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      {edu.institution} {edu.gpa ? `• ${t.gpa} ${edu.gpa}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-[11px] font-bold uppercase tracking-wider border-b pb-1" style={{ borderColor: `${accent}40`, color: accent }}>
                {t.coreSkills}
              </h3>
              <div className="flex flex-wrap gap-1">
                {skills.map((s) => (
                  <span key={s.id} className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 rounded text-slate-700 border border-slate-200">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div className="space-y-1">
              <h3 className="text-[11px] font-bold uppercase tracking-wider border-b pb-1" style={{ borderColor: `${accent}40`, color: accent }}>
                {t.languages}
              </h3>
              <div className="space-y-0.5 text-[11px]">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between">
                    <span className="font-semibold text-slate-700">{l.name}</span>
                    <span className="text-slate-500">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="space-y-1">
              <h3 className="text-[11px] font-bold uppercase tracking-wider border-b pb-1" style={{ borderColor: `${accent}40`, color: accent }}>
                {t.certifications}
              </h3>
              <div className="space-y-1 text-[11px]">
                {certifications.map((c) => (
                  <div key={c.id}>
                    <p className="font-semibold text-slate-800 leading-tight">{c.title}</p>
                    <p className="text-[10px] text-slate-400">{c.issuer} {c.date ? `(${c.date})` : ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
