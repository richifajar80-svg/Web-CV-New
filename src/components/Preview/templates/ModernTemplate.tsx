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

export const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, experiences, education, skills, languages, certifications, theme } = data;
  const accent = theme.accentColor || '#1e40af';
  const t = getCVTranslations(theme.language);

  return (
    <div className="w-full bg-white text-slate-800 flex flex-col sm:flex-row min-h-[297mm]">
      {/* LEFT SIDEBAR (30% width, Professional Dark Slate) */}
      <div className="w-full sm:w-[30%] bg-slate-800 text-white p-5 sm:p-5.5 flex flex-col justify-start shrink-0 space-y-5">
        {/* Photo & Candidate Subtitle */}
        {personalInfo.showPhoto && personalInfo.photoUrl && (
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 sm:w-26 sm:h-26 rounded-full overflow-hidden border-2 border-white/70 shadow-sm">
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center w-full border-b border-white/15 pb-2.5 mt-2.5">
              <h3 className="text-xs font-bold text-white tracking-wide uppercase">
                {personalInfo.fullName}
              </h3>
              <p className="text-[10.5px] text-white/70 font-medium mt-0.5">
                {personalInfo.jobTitle}
              </p>
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-300 pb-1 border-b border-white/15">
            {t.contact}
          </h4>
          <div className="space-y-2 text-[10px] text-white/90">
            {personalInfo.email && (
              <div className="flex items-start gap-2 min-w-0">
                <Mail className="w-3.5 h-3.5 shrink-0 text-amber-300 mt-0.5" />
                <span className="break-words [overflow-wrap:anywhere] leading-tight min-w-0">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 shrink-0 text-amber-300" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-amber-300" />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-start gap-2 min-w-0">
                <LinkedinIcon className="w-3.5 h-3.5 shrink-0 text-amber-300 mt-0.5" />
                <span className="break-words [overflow-wrap:anywhere] leading-tight min-w-0">{personalInfo.linkedin}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-start gap-2 min-w-0">
                <Globe className="w-3.5 h-3.5 shrink-0 text-amber-300 mt-0.5" />
                <span className="break-words [overflow-wrap:anywhere] leading-tight min-w-0">{personalInfo.website}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-300 pb-1 border-b border-white/15">
              {t.skills}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="text-[9.5px] font-medium px-2 py-0.5 rounded-md bg-white/12 text-white border border-white/15 shadow-2xs inline-flex items-center gap-1"
                >
                  <span>{skill.name}</span>
                  {skill.level && (
                    <span className="text-[8.5px] opacity-75 font-normal">
                      ({formatSkillLevel(skill.level, theme.language)})
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-300 pb-1 border-b border-white/15">
              {t.languages}
            </h4>
            <div className="space-y-1.5 text-[10px] text-white/90">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between items-center">
                  <span className="font-medium text-white">{lang.name}</span>
                  <span className="text-[9.5px] text-white/70">{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-300 pb-1 border-b border-white/15">
              {t.certifications}
            </h4>
            <div className="space-y-1.5 text-[10px] text-white/90">
              {certifications.map((cert) => (
                <div key={cert.id} className="leading-snug">
                  <div className="font-semibold text-white">{cert.title}</div>
                  <div className="text-[9px] text-white/70">
                    {cert.issuer} {cert.date ? `(${cert.date})` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT MAIN CONTENT (70% width, Balanced A4 Content Density) */}
      <div className="w-full sm:w-[70%] p-5 sm:p-6.5 space-y-4.5">
        {/* Name & Title Header */}
        <div className="border-b pb-3" style={{ borderColor: `${accent}30` }}>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
            {personalInfo.fullName || t.candidateDefaultName}
          </h1>
          <h2 className="text-xs sm:text-sm font-semibold tracking-wide uppercase mt-0.5" style={{ color: accent }}>
            {personalInfo.jobTitle || t.candidateDefaultJob}
          </h2>
        </div>

        {/* Summary */}
        {summary && (
          <div className="space-y-1">
            <h3
              className="text-[11px] font-bold uppercase tracking-wider"
              style={{ color: accent }}
            >
              {t.aboutMe}
            </h3>
            <p className="text-[10px] sm:text-[10.5px] text-slate-600 leading-relaxed text-justify">{summary}</p>
          </div>
        )}

        {/* Work Experiences */}
        {experiences.length > 0 && (
          <div className="space-y-2.5">
            <h3
              className="text-[11px] font-bold uppercase tracking-wider pb-1 border-b"
              style={{ color: accent, borderColor: `${accent}30` }}
            >
              {t.workExperience}
            </h3>
            <div className="space-y-3">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <span className="text-[11px] sm:text-[11.5px] font-bold text-slate-900">{exp.role}</span>
                    <span className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 w-fit shrink-0">
                      {exp.startDate} - {exp.current ? t.present : exp.endDate}
                    </span>
                  </div>
                  <div className="text-[10px] font-semibold text-slate-600">
                    {exp.company} {exp.location ? `• ${exp.location}` : ''}
                  </div>
                  <FormattedDescription
                    text={exp.description}
                    className="text-[10px] sm:text-[10.5px] text-slate-600 leading-relaxed pt-0.5"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="space-y-2">
            <h3
              className="text-[11px] font-bold uppercase tracking-wider pb-1 border-b"
              style={{ color: accent, borderColor: `${accent}30` }}
            >
              {t.education}
            </h3>
            <div className="space-y-2.5">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <span className="text-[11px] sm:text-[11.5px] font-bold text-slate-900">{edu.degree}</span>
                    <span className="text-[9.5px] text-slate-500 shrink-0">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <div className="text-[10px] font-semibold text-slate-600">
                    {edu.institution} {edu.location ? `• ${edu.location}` : ''}
                    {edu.gpa ? ` (${t.gpa}: ${edu.gpa})` : ''}
                  </div>
                  {edu.description && (
                    <p className="text-[10px] text-slate-500 italic">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

