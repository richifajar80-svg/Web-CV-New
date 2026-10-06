'use client';

import React from 'react';
import { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { LinkedinIcon } from '@/components/icons/LinkedinIcon';
import { getCVTranslations, formatSkillLevel } from '@/utils/translations';
import { FormattedDescription } from '../FormattedDescription';

export const CorporateTemplate: React.FC<{ data: CVData }> = ({ data }) => {
  const { personalInfo, summary, experiences, education, skills, languages, certifications, theme } = data;
  const accent = theme.accentColor || '#1e3a8a'; // classic corporate navy
  const t = getCVTranslations(theme.language);

  return (
    <div className="w-full bg-white text-slate-800 p-8 sm:p-12 min-h-[297mm] space-y-6 border-t-8" style={{ borderColor: accent }}>
      {/* Formal Header with Framed Contact Box */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 pb-5" style={{ borderColor: `${accent}40` }}>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight uppercase">
            {personalInfo.fullName || 'Nama Lengkap Anda'}
          </h1>
          <p className="text-sm font-bold tracking-wider uppercase text-slate-700" style={{ color: accent }}>
            {personalInfo.jobTitle}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
            {personalInfo.email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" style={{ color: accent }} />{personalInfo.email}</span>}
            {personalInfo.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" style={{ color: accent }} />{personalInfo.phone}</span>}
            {personalInfo.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" style={{ color: accent }} />{personalInfo.location}</span>}
            {personalInfo.linkedin && <span className="flex items-center gap-1.5"><LinkedinIcon className="w-3.5 h-3.5" style={{ color: accent }} />{personalInfo.linkedin}</span>}
          </div>
        </div>

        {personalInfo.showPhoto && personalInfo.photoUrl && (
          <div className="w-24 h-28 rounded-lg overflow-hidden border-2 shadow-sm shrink-0" style={{ borderColor: accent }}>
            <img src={personalInfo.photoUrl} alt={personalInfo.fullName} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Professional Summary */}
      {summary && (
        <div className="space-y-1.5">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 bg-slate-100 px-2 py-1 rounded-sm border-l-4" style={{ borderColor: accent }}>
            {t.executiveSummary}
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed text-justify px-1 pt-1">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 bg-slate-100 px-2 py-1 rounded-sm border-l-4" style={{ borderColor: accent }}>
            {t.professionalHistory}
          </h3>
          <div className="space-y-3.5 px-1">
            {experiences.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-extrabold text-slate-900">{exp.role}</span>
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                    {exp.startDate} – {exp.current ? t.present : exp.endDate}
                  </span>
                </div>
                <div className="text-xs font-bold" style={{ color: accent }}>
                  {exp.company} {exp.location ? `| ${exp.location}` : ''}
                </div>
                <FormattedDescription
                  text={exp.description}
                  className="text-xs text-slate-600 leading-relaxed pt-0.5"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 bg-slate-100 px-2 py-1 rounded-sm border-l-4" style={{ borderColor: accent }}>
            {t.education}
          </h3>
          <div className="space-y-2 px-1">
            {education.map((edu) => (
              <div key={edu.id} className="text-xs space-y-0.5">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{edu.degree}</span>
                  <span className="text-slate-500 font-normal">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="text-slate-700">
                  {edu.institution} {edu.gpa ? `(${t.gpa}: ${edu.gpa})` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills & Certs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
        {skills.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 bg-slate-100 px-2 py-1 rounded-sm border-l-4" style={{ borderColor: accent }}>
              {t.skillsCompetence}
            </h3>
            <div className="flex flex-wrap gap-1 px-1">
              {skills.map((s) => (
                <span key={s.id} className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-200 inline-flex items-center gap-1">
                  <span>{s.name}</span>
                  {s.level && (
                    <span className="text-[10px] text-slate-500 font-normal">
                      ({formatSkillLevel(s.level, theme.language)})
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {certifications.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 bg-slate-100 px-2 py-1 rounded-sm border-l-4" style={{ borderColor: accent }}>
              {t.certifications}
            </h3>
            <div className="space-y-1 text-xs px-1">
              {certifications.map((c) => (
                <div key={c.id}>
                  <span className="font-bold text-slate-800">{c.title}</span> — {c.issuer}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
