'use client';

import React from 'react';
import { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { LinkedinIcon } from '@/components/icons/LinkedinIcon';
import { getCVTranslations } from '@/utils/translations';

export const MinimalistTemplate: React.FC<{ data: CVData }> = ({ data }) => {
  const { personalInfo, summary, experiences, education, skills, languages, certifications, theme } = data;
  const accent = theme.accentColor || '#1e293b';
  const t = getCVTranslations(theme.language);

  return (
    <div className="w-full bg-white text-slate-800 p-10 sm:p-14 min-h-[297mm] space-y-7 font-sans">
      {/* Header: Name, Title, and Clean Inline Contact */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <h1 className="text-3xl sm:text-4xl font-light text-slate-900 tracking-tight">
          <span className="font-extrabold">{personalInfo.fullName?.split(' ')[0]}</span>{' '}
          {personalInfo.fullName?.split(' ').slice(1).join(' ')}
        </h1>
        <p className="text-sm font-semibold tracking-wide text-slate-600 uppercase" style={{ color: accent }}>
          {personalInfo.jobTitle}
        </p>

        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500 pt-1">
          {personalInfo.email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{personalInfo.phone}</span>}
          {personalInfo.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{personalInfo.location}</span>}
          {personalInfo.linkedin && <span className="flex items-center gap-1.5"><LinkedinIcon className="w-3.5 h-3.5" />{personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            {t.profile}
          </div>
          <div className="sm:col-span-9 text-xs text-slate-700 leading-relaxed text-justify">
            {summary}
          </div>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 border-t border-slate-100 pt-5">
          <div className="sm:col-span-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            {t.workExperience}
          </div>
          <div className="sm:col-span-9 space-y-5">
            {experiences.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-900">{exp.role}</span>
                  <span className="text-[11px] text-slate-400">
                    {exp.startDate} — {exp.current ? t.present : exp.endDate}
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-600">
                  {exp.company} {exp.location ? `· ${exp.location}` : ''}
                </div>
                {exp.description && (
                  <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed pt-0.5">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 border-t border-slate-100 pt-5">
          <div className="sm:col-span-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            {t.education}
          </div>
          <div className="sm:col-span-9 space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="space-y-0.5 text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{edu.degree}</span>
                  <span className="text-slate-400">{edu.startDate} — {edu.endDate}</span>
                </div>
                <div className="text-slate-600">
                  {edu.institution} {edu.gpa ? `(${t.gpa}: ${edu.gpa})` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 border-t border-slate-100 pt-5">
          <div className="sm:col-span-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            {t.skills}
          </div>
          <div className="sm:col-span-9 flex flex-wrap gap-2">
            {skills.map((s) => (
              <span key={s.id} className="text-xs font-medium px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages & Certs */}
      {(languages.length > 0 || certifications.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 border-t border-slate-100 pt-5">
          <div className="sm:col-span-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            {t.certificationsLicenses}
          </div>
          <div className="sm:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {languages.length > 0 && (
              <div className="space-y-1">
                <span className="font-bold text-slate-700">{t.languages}:</span>
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between text-slate-600">
                    <span>{l.name}</span>
                    <span className="text-slate-400">{l.level}</span>
                  </div>
                ))}
              </div>
            )}
            {certifications.length > 0 && (
              <div className="space-y-1">
                <span className="font-bold text-slate-700">{t.certifications}:</span>
                {certifications.map((c) => (
                  <div key={c.id} className="text-slate-600">
                    {c.title} ({c.issuer})
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
