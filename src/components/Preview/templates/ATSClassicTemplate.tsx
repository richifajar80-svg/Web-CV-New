'use client';

import React from 'react';
import { CVData } from '@/types/cv';
import { getCVTranslations } from '@/utils/translations';

interface TemplateProps {
  data: CVData;
}

export const ATSClassicTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, experiences, education, skills, languages, certifications, theme } = data;
  const accent = theme.accentColor || '#1e293b';
  const t = getCVTranslations(theme.language);

  return (
    <div className="w-full bg-white text-slate-900 p-8 sm:p-12 min-h-[297mm] space-y-5">
      {/* Centered Header */}
      <div className="text-center border-b pb-4 space-y-1" style={{ borderColor: accent }}>
        <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide">
          {personalInfo.fullName || 'Nama Lengkap Anda'}
        </h1>
        <p className="text-sm font-semibold tracking-wider uppercase text-slate-700">
          {personalInfo.jobTitle}
        </p>

        {/* Contact Links Line */}
        <div className="flex flex-wrap justify-center items-center gap-2 text-xs text-slate-600 pt-1">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.email && <span>• {personalInfo.email}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          {personalInfo.website && <span>• {personalInfo.website}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {summary && (
        <div className="space-y-1.5">
          <h2
            className="text-xs font-bold uppercase tracking-wider border-b pb-0.5"
            style={{ borderColor: `${accent}40`, color: accent }}
          >
            {t.professionalSummary}
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">{summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {experiences.length > 0 && (
        <div className="space-y-3">
          <h2
            className="text-xs font-bold uppercase tracking-wider border-b pb-0.5"
            style={{ borderColor: `${accent}40`, color: accent }}
          >
            {t.workExperience}
          </h2>
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-bold text-slate-900">{exp.role}</span>
                  <span className="text-slate-500 font-medium">
                    {exp.startDate} - {exp.current ? t.present : exp.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs text-slate-700 font-semibold italic">
                  <span>{exp.company}</span>
                  {exp.location && <span className="font-normal not-italic text-slate-500">{exp.location}</span>}
                </div>
                {exp.description && (
                  <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed pl-2 pt-0.5">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="space-y-2.5">
          <h2
            className="text-xs font-bold uppercase tracking-wider border-b pb-0.5"
            style={{ borderColor: `${accent}40`, color: accent }}
          >
            {t.education}
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="text-xs space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{edu.degree}</span>
                  <span className="text-slate-500">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>
                    {edu.institution} {edu.gpa ? `• ${t.gpa}: ${edu.gpa}` : ''}
                  </span>
                  {edu.location && <span className="text-slate-500">{edu.location}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="space-y-1.5">
          <h2
            className="text-xs font-bold uppercase tracking-wider border-b pb-0.5"
            style={{ borderColor: `${accent}40`, color: accent }}
          >
            {t.skillsCompetence}
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            <span className="font-semibold text-slate-900">{t.skills}: </span>
            {skills.map((s) => s.name).join(' • ')}
          </p>
        </div>
      )}

      {/* Languages & Certifications */}
      {(languages.length > 0 || certifications.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {languages.length > 0 && (
            <div className="space-y-1">
              <h2
                className="text-xs font-bold uppercase tracking-wider border-b pb-0.5"
                style={{ borderColor: `${accent}40`, color: accent }}
              >
                {t.languages}
              </h2>
              <div className="text-xs text-slate-700 space-y-0.5">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between">
                    <span>{l.name}</span>
                    <span className="text-slate-500">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div className="space-y-1">
              <h2
                className="text-xs font-bold uppercase tracking-wider border-b pb-0.5"
                style={{ borderColor: `${accent}40`, color: accent }}
              >
                {t.certifications}
              </h2>
              <div className="text-xs text-slate-700 space-y-0.5">
                {certifications.map((c) => (
                  <div key={c.id}>
                    <span className="font-medium">{c.title}</span> - {c.issuer}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
