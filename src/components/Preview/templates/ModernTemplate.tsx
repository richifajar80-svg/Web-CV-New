'use client';

import React from 'react';
import { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Globe, Award, Briefcase, GraduationCap, Languages } from 'lucide-react';
import { LinkedinIcon } from '@/components/icons/LinkedinIcon';
import { getCVTranslations } from '@/utils/translations';
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
      {/* LEFT SIDEBAR (36% width, Dark Slate matching Harvard Preview Thumbnail) */}
      <div className="w-full sm:w-[36%] bg-slate-800 text-white p-6 sm:p-7 flex flex-col justify-between shrink-0 space-y-6">
        <div className="space-y-6">
          {/* Photo & Candidate Subtitle */}
          {personalInfo.showPhoto && personalInfo.photoUrl && (
            <div className="flex flex-col items-center gap-3">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-3 border-white/80 shadow-md">
                <img
                  src={personalInfo.photoUrl}
                  alt={personalInfo.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center w-full border-b border-white/20 pb-3">
                <h3 className="text-sm font-extrabold text-white tracking-wide uppercase">
                  {personalInfo.fullName}
                </h3>
                <p className="text-xs text-white/70 font-medium mt-0.5">
                  {personalInfo.jobTitle}
                </p>
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 pb-1 border-b border-white/15">
              {t.contact}
            </h4>
            <div className="space-y-2 text-[11px] text-white/85">
              {personalInfo.email && (
                <div className="flex items-center gap-2 break-all">
                  <Mail className="w-3.5 h-3.5 shrink-0 text-amber-300" />
                  <span>{personalInfo.email}</span>
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
                <div className="flex items-center gap-2 break-all">
                  <LinkedinIcon className="w-3.5 h-3.5 shrink-0 text-amber-300" />
                  <span>{personalInfo.linkedin}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center gap-2 break-all">
                  <Globe className="w-3.5 h-3.5 shrink-0 text-amber-300" />
                  <span>{personalInfo.website}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 pb-1 border-b border-white/15">
                {t.skills}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/15 text-white border border-white/20 shadow-2xs backdrop-blur-xs"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 pb-1 border-b border-white/15">
                {t.languages}
              </h4>
              <div className="space-y-1 text-[11px] text-white/90">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between">
                    <span className="font-semibold text-white">{lang.name}</span>
                    <span className="text-[10px] text-white/70">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 pb-1 border-b border-white/15">
                {t.certifications}
              </h4>
              <div className="space-y-2 text-[11px] text-white/90">
                {certifications.map((cert) => (
                  <div key={cert.id} className="leading-snug">
                    <div className="font-semibold text-white">{cert.title}</div>
                    <div className="text-[10px] text-white/70">
                      {cert.issuer} {cert.date ? `(${cert.date})` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT MAIN CONTENT (65%) */}
      <div className="w-full sm:w-[65%] p-6 sm:p-8 space-y-6">
        {/* Name & Title Header */}
        <div className="border-b pb-4" style={{ borderColor: `${accent}30` }}>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {personalInfo.fullName || t.candidateDefaultName}
          </h1>
          <h2 className="text-sm sm:text-base font-semibold mt-1" style={{ color: accent }}>
            {personalInfo.jobTitle || t.candidateDefaultJob}
          </h2>
        </div>

        {/* Summary */}
        {summary && (
          <div className="space-y-2">
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: accent }}
            >
              {t.aboutMe}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed text-justify">{summary}</p>
          </div>
        )}

        {/* Work Experiences */}
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
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5">
                    <span className="text-xs font-bold text-slate-900">{exp.role}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 w-fit">
                      {exp.startDate} - {exp.current ? t.present : exp.endDate}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600">
                    {exp.company} {exp.location ? `• ${exp.location}` : ''}
                  </div>
                  <FormattedDescription
                    text={exp.description}
                    className="text-[11px] text-slate-600 leading-relaxed pt-0.5"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="space-y-4">
            <h3
              className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
              style={{ color: accent, borderColor: `${accent}30` }}
            >
              {t.education}
            </h3>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5">
                    <span className="text-xs font-bold text-slate-900">{edu.degree}</span>
                    <span className="text-[10px] text-slate-500">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    {edu.institution} {edu.location ? `• ${edu.location}` : ''}
                    {edu.gpa ? ` (${t.gpa}: ${edu.gpa})` : ''}
                  </div>
                  {edu.description && (
                    <p className="text-[11px] text-slate-500 italic">{edu.description}</p>
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
