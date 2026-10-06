'use client';

import React from 'react';
import { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { LinkedinIcon } from '@/components/icons/LinkedinIcon';
import { getCVTranslations, formatSkillLevel } from '@/utils/translations';
import { FormattedDescription } from '../FormattedDescription';

export const TimelineTemplate: React.FC<{ data: CVData }> = ({ data }) => {
  const { personalInfo, summary, experiences, education, skills, languages, certifications, theme } = data;
  const accent = theme.accentColor || '#0f766e';
  const t = getCVTranslations(theme.language);

  return (
    <div className="w-full bg-white text-slate-800 p-8 sm:p-10 min-h-[297mm] space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-5" style={{ borderColor: `${accent}30` }}>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {personalInfo.fullName || 'Nama Lengkap Anda'}
          </h1>
          <h2 className="text-sm sm:text-base font-bold" style={{ color: accent }}>
            {personalInfo.jobTitle || 'Profesi / Posisi Anda'}
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
            {personalInfo.email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" style={{ color: accent }} />{personalInfo.email}</span>}
            {personalInfo.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" style={{ color: accent }} />{personalInfo.phone}</span>}
            {personalInfo.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" style={{ color: accent }} />{personalInfo.location}</span>}
            {personalInfo.linkedin && <span className="flex items-center gap-1.5"><LinkedinIcon className="w-3.5 h-3.5" style={{ color: accent }} />{personalInfo.linkedin}</span>}
          </div>
        </div>

        {personalInfo.showPhoto && personalInfo.photoUrl && (
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 shadow-sm shrink-0" style={{ borderColor: accent }}>
            <img src={personalInfo.photoUrl} alt={personalInfo.fullName} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <p className="text-xs text-slate-600 leading-relaxed text-justify">{summary}</p>
        </div>
      )}

      {/* Grid: Main Timeline (65%) + Sidebar (35%) */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-start">
        {/* LEFT: Timeline Experience & Education */}
        <div className="sm:col-span-8 space-y-6">
          {/* Work Experience with visual timeline */}
          {experiences.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: accent }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
                {t.careerTimeline}
              </h3>

              <div className="relative border-l-2 pl-5 space-y-5 ml-1" style={{ borderColor: `${accent}30` }}>
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative group">
                    {/* Circle Node on Timeline */}
                    <div
                      className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 shadow-2xs"
                      style={{ borderColor: accent }}
                    />
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                      <span className="text-xs font-bold text-slate-900">{exp.role}</span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {exp.startDate} - {exp.current ? t.present : exp.endDate}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-600 mb-1">
                      {exp.company} {exp.location ? `• ${exp.location}` : ''}
                    </div>
                    <FormattedDescription
                      text={exp.description}
                      className="text-[11px] text-slate-600"
                      bulletColor={accent}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Timeline */}
          {education.length > 0 && (
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: accent }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
                {t.education}
              </h3>
              <div className="relative border-l-2 pl-5 space-y-4 ml-1" style={{ borderColor: `${accent}30` }}>
                {education.map((edu) => (
                  <div key={edu.id} className="relative">
                    <div
                      className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2"
                      style={{ borderColor: accent }}
                    />
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-slate-900">{edu.degree}</span>
                      <span className="text-[10px] text-slate-500">{edu.startDate} - {edu.endDate}</span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      {edu.institution} {edu.gpa ? `(${t.gpa}: ${edu.gpa})` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Skills, Languages, Certifications */}
        <div className="sm:col-span-4 space-y-6">
          {skills.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider pb-1 border-b" style={{ color: accent, borderColor: `${accent}30` }}>
                {t.skills}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span key={s.id} className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200 inline-flex items-center gap-1">
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

          {languages.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider pb-1 border-b" style={{ color: accent, borderColor: `${accent}30` }}>
                {t.languages}
              </h4>
              <div className="space-y-1.5 text-xs">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between">
                    <span className="font-semibold text-slate-700">{l.name}</span>
                    <span className="text-slate-500">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider pb-1 border-b" style={{ color: accent, borderColor: `${accent}30` }}>
                {t.certifications}
              </h4>
              <div className="space-y-2 text-xs">
                {certifications.map((c) => (
                  <div key={c.id}>
                    <p className="font-semibold text-slate-800">{c.title}</p>
                    <p className="text-[10px] text-slate-500">{c.issuer} {c.date ? `(${c.date})` : ''}</p>
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
