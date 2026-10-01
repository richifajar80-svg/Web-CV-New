'use client';

import React from 'react';
import { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { LinkedinIcon } from '@/components/icons/LinkedinIcon';
import { getCVTranslations } from '@/utils/translations';

export const StripeTemplate: React.FC<{ data: CVData }> = ({ data }) => {
  const { personalInfo, summary, experiences, education, skills, languages, certifications, theme } = data;
  const accent = theme.accentColor || '#0284c7';
  const t = getCVTranslations(theme.language);

  return (
    <div className="w-full bg-white text-slate-800 min-h-[297mm] flex font-sans">
      {/* Left Thick Vertical Stripe */}
      <div className="w-4 sm:w-6 shrink-0" style={{ backgroundColor: accent }} />

      {/* Main Content Area */}
      <div className="flex-1 p-8 sm:p-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-5" style={{ borderColor: `${accent}30` }}>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {personalInfo.fullName || t.candidateDefaultName}
            </h1>
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider mt-0.5" style={{ color: accent }}>
              {personalInfo.jobTitle}
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 pt-2">
              {personalInfo.email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" style={{ color: accent }} />{personalInfo.email}</span>}
              {personalInfo.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" style={{ color: accent }} />{personalInfo.phone}</span>}
              {personalInfo.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" style={{ color: accent }} />{personalInfo.location}</span>}
              {personalInfo.linkedin && <span className="flex items-center gap-1.5"><LinkedinIcon className="w-3.5 h-3.5" style={{ color: accent }} />{personalInfo.linkedin}</span>}
            </div>
          </div>

          {personalInfo.showPhoto && personalInfo.photoUrl && (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 shadow-sm shrink-0" style={{ borderColor: accent }}>
              <img src={personalInfo.photoUrl} alt={personalInfo.fullName} className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Summary */}
        {summary && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}>
              {t.aboutMe}
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ borderColor: `${accent}30`, color: accent }}>
              {t.workExperience}
            </h3>
            <div className="space-y-3.5">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-900">{exp.role}</span>
                    <span className="text-[11px] font-medium text-slate-500">{exp.startDate} - {exp.current ? t.present : exp.endDate}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-600">
                    {exp.company} {exp.location ? `• ${exp.location}` : ''}
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

        {/* Education & Skills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
          {education.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ borderColor: `${accent}30`, color: accent }}>
                {t.education}
              </h3>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs space-y-0.5">
                    <div className="font-bold text-slate-900">{edu.degree}</div>
                    <div className="text-slate-600">{edu.institution} {edu.gpa ? `(${t.gpa}: ${edu.gpa})` : ''}</div>
                    <div className="text-[10px] text-slate-400">{edu.startDate} - {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ borderColor: `${accent}30`, color: accent }}>
                {t.skills}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span key={s.id} className="text-xs font-medium px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
