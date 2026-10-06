'use client';

import React from 'react';
import { CVData } from '@/types/cv';
import { getCVTranslations } from '@/utils/translations';

export const AcademicTemplate: React.FC<{ data: CVData }> = ({ data }) => {
  const { personalInfo, summary, experiences, education, skills, languages, certifications, theme } = data;
  const accent = theme.accentColor || '#1e293b';
  const t = getCVTranslations(theme.language);

  return (
    <div className="w-full bg-white text-slate-900 p-8 sm:p-12 min-h-[297mm] space-y-5">
      {/* Centered Academic Header with Double Border */}
      <div className="text-center space-y-1.5 pb-4 border-b-2 border-slate-900">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider uppercase">
          {personalInfo.fullName || 'Nama Lengkap Anda'}
        </h1>
        <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-slate-700">
          {personalInfo.jobTitle}
        </p>

        <div className="flex flex-wrap justify-center items-center gap-2 text-xs text-slate-600 pt-1">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.email && <span>• {personalInfo.email}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          {personalInfo.website && <span>• {personalInfo.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-400 pb-0.5 text-slate-900">
            {t.professionalSummary}
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed text-justify indent-4">{summary}</p>
        </div>
      )}

      {/* Education First (Standard in Academia/Medical) */}
      {education.length > 0 && (
        <div className="space-y-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-400 pb-0.5 text-slate-900">
            {t.higherEducation}
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="text-xs space-y-0.5">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{edu.degree}</span>
                  <span className="font-normal text-slate-500">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="flex justify-between text-slate-700 italic">
                  <span>{edu.institution} {edu.gpa ? `· ${t.gpa}: ${edu.gpa}` : ''}</span>
                  {edu.location && <span className="not-italic text-slate-500">{edu.location}</span>}
                </div>
                {edu.description && <p className="text-[11px] text-slate-600 pl-2">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {experiences.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-400 pb-0.5 text-slate-900">
            {t.workExperience}
          </h2>
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
                  <span>{exp.role}</span>
                  <span className="font-normal text-slate-500">
                    {exp.startDate} – {exp.current ? t.present : exp.endDate}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-700 italic">
                  <span>{exp.company}</span>
                  {exp.location && <span className="not-italic text-slate-500">{exp.location}</span>}
                </div>
                {exp.description && (
                  <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed pl-2 pt-0.5">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Skills */}
      {(certifications.length > 0 || skills.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
          {skills.length > 0 && (
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-400 pb-0.5 text-slate-900">
                {t.technicalSkills}
              </h2>
              <p className="text-xs text-slate-800 leading-relaxed">
                {skills.map((s) => s.name).join(' • ')}
              </p>
            </div>
          )}

          {certifications.length > 0 && (
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-400 pb-0.5 text-slate-900">
                {t.certificationsLicenses}
              </h2>
              <div className="space-y-1 text-xs text-slate-800">
                {certifications.map((c) => (
                  <div key={c.id}>
                    <span className="font-semibold">{c.title}</span> — {c.issuer} {c.date ? `(${c.date})` : ''}
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
