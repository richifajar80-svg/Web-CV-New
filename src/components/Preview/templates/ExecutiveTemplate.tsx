'use client';

import React from 'react';
import { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { LinkedinIcon } from '@/components/icons/LinkedinIcon';
import { getCVTranslations, formatSkillLevel } from '@/utils/translations';
import { FormattedDescription } from '../FormattedDescription';

interface TemplateProps {
  data: CVData;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, experiences, education, skills, languages, certifications, theme } = data;
  const accent = theme.accentColor || '#0f766e';
  const t = getCVTranslations(theme.language);

  return (
    <div className="w-full bg-white text-slate-800 min-h-[297mm]">
      {/* Top Accent Banner */}
      <div
        className="px-6 py-5.5 sm:px-8 sm:py-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        style={{ backgroundColor: accent }}
      >
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {personalInfo.fullName || 'Nama Lengkap Anda'}
          </h1>
          <p className="text-sm font-medium tracking-wide text-white/90">
            {personalInfo.jobTitle || 'Profesi / Posisi Anda'}
          </p>
        </div>

        {/* Optional Photo */}
        {personalInfo.showPhoto && personalInfo.photoUrl && (
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white/60 shadow-md shrink-0">
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Sub-header Contact Bar */}
      <div className="bg-slate-100 px-8 py-2.5 border-b border-slate-200/80 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-600">
        {personalInfo.email && (
          <span className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" style={{ color: accent }} />
            {personalInfo.email}
          </span>
        )}
        {personalInfo.phone && (
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" style={{ color: accent }} />
            {personalInfo.phone}
          </span>
        )}
        {personalInfo.location && (
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" style={{ color: accent }} />
            {personalInfo.location}
          </span>
        )}
        {personalInfo.linkedin && (
          <span className="flex items-center gap-1.5">
            <LinkedinIcon className="w-3.5 h-3.5" style={{ color: accent }} />
            {personalInfo.linkedin}
          </span>
        )}
      </div>

      {/* Main Body */}
      <div className="px-6 py-5 sm:px-8 sm:py-6 space-y-4.5">
        {/* Summary */}
        {summary && (
          <div className="space-y-2">
            <h3
              className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
              style={{ color: accent, borderColor: `${accent}30` }}
            >
              {t.professionalSummary}
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className="space-y-4">
            <h3
              className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
              style={{ color: accent, borderColor: `${accent}30` }}
            >
              {t.workExperience}
            </h3>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-900">{exp.role}</span>
                    <span className="text-[11px] font-medium text-slate-500">
                      {exp.startDate} – {exp.current ? t.present : exp.endDate}
                    </span>
                  </div>
                  <div className="text-xs font-semibold" style={{ color: accent }}>
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

        {/* Education & Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Education */}
          {education.length > 0 && (
            <div className="space-y-3">
              <h3
                className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
                style={{ color: accent, borderColor: `${accent}30` }}
              >
                {t.education}
              </h3>
              <div className="space-y-2.5">
                {education.map((edu) => (
                  <div key={edu.id} className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900">{edu.degree}</div>
                    <div className="text-xs text-slate-600 font-medium">
                      {edu.institution} {edu.gpa ? `• ${t.gpa} ${edu.gpa}` : ''}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {edu.startDate} – {edu.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="space-y-3">
              <h3
                className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
                style={{ color: accent, borderColor: `${accent}30` }}
              >
                {t.skillsCompetence}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="text-[11px] font-medium px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200 inline-flex items-center gap-1.5"
                  >
                    <span>{skill.name}</span>
                    {skill.level && (
                      <span className="text-[10px] text-slate-500 font-normal">
                        ({formatSkillLevel(skill.level, theme.language)})
                      </span>
                    )}
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
