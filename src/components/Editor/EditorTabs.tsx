'use client';

import React, { useState } from 'react';
import { CVData } from '@/types/cv';
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Eye,
  Languages as LanguagesIcon,
  Award,
  Users,
  ArrowUpDown,
  Target,
} from 'lucide-react';
import { PersonalInfoForm } from './PersonalInfoForm';
import { SummaryForm } from './SummaryForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { LanguagesForm } from './LanguagesForm';
import { CertificationsForm } from './CertificationsForm';
import { OrganizationsForm } from './OrganizationsForm';
import { JobMatcherModal } from './JobMatcherModal';

interface EditorTabsProps {
  cvData: CVData;
  onUpdateCV: (data: Partial<CVData>) => void;
  onViewPreview?: () => void;
}

type TabKey =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'certifications'
  | 'organizations';

export const EditorTabs: React.FC<EditorTabsProps> = ({
  cvData,
  onUpdateCV,
  onViewPreview,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('personal');
  const [isJobMatcherOpen, setIsJobMatcherOpen] = useState(false);

  const handleAddSkillsFromMatcher = (newSkills: string[]) => {
    const existing = cvData.skills || [];
    const added = newSkills
      .filter((name) => !existing.some((s) => s.name.toLowerCase() === name.toLowerCase()))
      .map((name) => ({
        id: `sk-${Date.now()}-${Math.random()}`,
        name,
        level: 'Mahir' as const,
      }));
    if (added.length > 0) {
      onUpdateCV({ skills: [...existing, ...added] });
    }
  };

  // Tab completion status
  const isPersonalComplete = Boolean(
    cvData.personalInfo.fullName?.trim() && cvData.personalInfo.email?.trim()
  );
  const isSummaryComplete = Boolean(
    cvData.summary?.trim() && cvData.summary.trim().length >= 30
  );
  const isExperienceComplete = cvData.experiences.length > 0;
  const isEducationComplete = cvData.education.length > 0;
  const isSkillsComplete = cvData.skills.length >= 3;
  const isLanguagesComplete = (cvData.languages || []).length > 0;
  const isCertificationsComplete = (cvData.certifications || []).length > 0;
  const isOrganizationsComplete = (cvData.organizations || []).length > 0;

  const tabs: Array<{
    key: TabKey;
    label: string;
    stepNumber: number;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    isComplete: boolean;
    isOptional?: boolean;
  }> = [
    {
      key: 'personal',
      label: 'Data Diri',
      stepNumber: 1,
      icon: User,
      isComplete: isPersonalComplete,
    },
    {
      key: 'summary',
      label: 'Ringkasan',
      stepNumber: 2,
      icon: FileText,
      isComplete: isSummaryComplete,
    },
    {
      key: 'experience',
      label: 'Pengalaman',
      stepNumber: 3,
      icon: Briefcase,
      count: cvData.experiences.length > 0 ? cvData.experiences.length : undefined,
      isComplete: isExperienceComplete,
    },
    {
      key: 'education',
      label: 'Pendidikan',
      stepNumber: 4,
      icon: GraduationCap,
      count: cvData.education.length > 0 ? cvData.education.length : undefined,
      isComplete: isEducationComplete,
    },
    {
      key: 'skills',
      label: 'Keahlian',
      stepNumber: 5,
      icon: Wrench,
      count: cvData.skills.length > 0 ? cvData.skills.length : undefined,
      isComplete: isSkillsComplete,
    },
    {
      key: 'languages',
      label: 'Bahasa',
      stepNumber: 6,
      icon: LanguagesIcon,
      count: cvData.languages?.length ? cvData.languages.length : undefined,
      isComplete: isLanguagesComplete,
      isOptional: true,
    },
    {
      key: 'certifications',
      label: 'Sertifikasi',
      stepNumber: 7,
      icon: Award,
      count: cvData.certifications?.length ? cvData.certifications.length : undefined,
      isComplete: isCertificationsComplete,
      isOptional: true,
    },
    {
      key: 'organizations',
      label: 'Organisasi',
      stepNumber: 8,
      icon: Users,
      count: cvData.organizations?.length ? cvData.organizations.length : undefined,
      isComplete: isOrganizationsComplete,
      isOptional: true,
    },
  ];

  const tabRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  const switchTab = (tabKey: TabKey) => {
    setActiveTab(tabKey);
    // Smooth scroll active tab into view on mobile
    if (typeof window !== 'undefined' && tabRefs.current[tabKey]) {
      tabRefs.current[tabKey]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  };

  const currentTabIndex = tabs.findIndex((t) => t.key === activeTab);
  const prevTab = currentTabIndex > 0 ? tabs[currentTabIndex - 1] : null;
  const nextTab = currentTabIndex < tabs.length - 1 ? tabs[currentTabIndex + 1] : null;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-300/90 overflow-hidden flex flex-col transition-all">
      {/* Mobile-First Step Status Header */}
      <div className="sm:hidden px-3.5 pt-3 pb-2.5 bg-gradient-to-r from-slate-100 to-emerald-50/60 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
            Langkah {currentTabIndex + 1} dari {tabs.length}
          </span>
          <span className="text-xs font-extrabold text-slate-900">{tabs[currentTabIndex].label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentTabIndex + 1) / tabs.length) * 100}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-slate-600">
            {Math.round(((currentTabIndex + 1) / tabs.length) * 100)}%
          </span>
        </div>
      </div>

      {/* Tab Navigation Bar with Smooth Scroll & Badges */}
      <div className="flex border-b border-slate-200 bg-slate-100/90 overflow-x-auto scrollbar-none px-2 sm:px-3.5 pt-2 sm:pt-2.5 gap-1 sm:gap-1.5 shrink-0 touch-pan-x">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              ref={(el) => {
                tabRefs.current[tab.key] = el;
              }}
              type="button"
              onClick={() => switchTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-extrabold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer group shrink-0 ${
                isActive
                  ? 'bg-white text-emerald-700 border-emerald-600 shadow-xs ring-1 ring-slate-200/80'
                  : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? 'text-emerald-600' : 'text-slate-500 group-hover:text-slate-700'
                  }`}
                />
                {tab.isComplete && !isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                )}
              </div>
              <span>{tab.label}</span>

              {tab.isComplete && isActive && (
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}

              {typeof tab.count === 'number' && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${
                    isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Body */}
      <div className="p-4 sm:p-6 space-y-5">
        {/* AI Job Matcher Quick Banner */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white rounded-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md shadow-emerald-900/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                  Fitur AI Cerdas
                </span>
                <span className="text-xs font-bold text-white">Uji Kecocokan CV dengan Loker Target</span>
              </div>
              <p className="text-[11px] text-white/80 mt-0.5">
                Punya teks loker dari JobStreet / LinkedIn? Pindai kata kunci yang kurang agar lolos screening ATS.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsJobMatcherOpen(true)}
            className="px-3.5 py-1.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer shrink-0 self-stretch sm:self-auto text-center active:scale-98"
          >
            🎯 Pindai Loker Target
          </button>
        </div>

        {/* Quick Setting Banner: Section Order Priority Toggle */}
        <div className="bg-gradient-to-r from-slate-50 via-emerald-50/30 to-teal-50/20 border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ArrowUpDown className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>Urutan Prioritas di Lembar CV:</span>
                <span className="text-[11px] font-extrabold text-emerald-700">
                  {(cvData.theme.sectionOrder || 'experience_first') === 'experience_first'
                    ? 'Pengalaman Di Atas'
                    : 'Pendidikan Di Atas'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                Sesuaikan urutan section agar profil Anda paling memikat HRD saat pertama dilihat.
              </p>
            </div>
          </div>

          <div className="flex items-center bg-slate-200/90 p-1 rounded-xl text-[11px] sm:text-xs font-bold shrink-0 self-start sm:self-auto shadow-inner">
            <button
              type="button"
              onClick={() =>
                onUpdateCV({
                  theme: { ...cvData.theme, sectionOrder: 'experience_first' },
                })
              }
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                (cvData.theme.sectionOrder || 'experience_first') === 'experience_first'
                  ? 'bg-white text-emerald-800 shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              💼 Pengalaman Dahulu
            </button>
            <button
              type="button"
              onClick={() =>
                onUpdateCV({
                  theme: { ...cvData.theme, sectionOrder: 'education_first' },
                })
              }
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                cvData.theme.sectionOrder === 'education_first'
                  ? 'bg-white text-emerald-800 shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🎓 Pendidikan Dahulu
            </button>
          </div>
        </div>

        {/* Form Components */}
        {activeTab === 'personal' && (
          <PersonalInfoForm
            data={cvData.personalInfo}
            onChange={(updated) =>
              onUpdateCV({ personalInfo: { ...cvData.personalInfo, ...updated } })
            }
          />
        )}

        {activeTab === 'summary' && (
          <SummaryForm
            summary={cvData.summary}
            onChange={(summary) => onUpdateCV({ summary })}
            jobTitle={cvData.personalInfo.jobTitle}
            experiences={cvData.experiences.map((e) => ({ role: e.role, company: e.company }))}
            skills={cvData.skills.map((s) => s.name)}
            language={cvData.theme.language || 'id'}
          />
        )}

        {activeTab === 'experience' && (
          <ExperienceForm
            experiences={cvData.experiences}
            onChange={(experiences) => onUpdateCV({ experiences })}
            language={cvData.theme.language || 'id'}
          />
        )}

        {activeTab === 'education' && (
          <EducationForm
            education={cvData.education}
            onChange={(education) => onUpdateCV({ education })}
          />
        )}

        {activeTab === 'skills' && (
          <SkillsForm
            skills={cvData.skills}
            onUpdateSkills={(skills) => onUpdateCV({ skills })}
          />
        )}

        {activeTab === 'languages' && (
          <LanguagesForm
            languages={cvData.languages || []}
            onChange={(languages) => onUpdateCV({ languages })}
          />
        )}

        {activeTab === 'certifications' && (
          <CertificationsForm
            certifications={cvData.certifications || []}
            onChange={(certifications) => onUpdateCV({ certifications })}
          />
        )}

        {activeTab === 'organizations' && (
          <OrganizationsForm
            organizations={cvData.organizations || []}
            onChange={(organizations) => onUpdateCV({ organizations })}
          />
        )}

        {/* Step-by-Step Navigation Footer */}
        <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {prevTab ? (
            <button
              type="button"
              onClick={() => switchTab(prevTab.key)}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer order-2 sm:order-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Sebelumnya: {prevTab.label}</span>
            </button>
          ) : (
            <div className="order-2 sm:order-1" />
          )}

          {nextTab ? (
            <button
              type="button"
              onClick={() => switchTab(nextTab.key)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all cursor-pointer active:scale-98 order-1 sm:order-2"
            >
              <span>Lanjut: {nextTab.label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (onViewPreview) onViewPreview();
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer active:scale-98 order-1 sm:order-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>Selesai! Lihat Pratinjau & Unduh</span>
              <Eye className="w-3.5 h-3.5 ml-0.5" />
            </button>
          )}
        </div>
      </div>

      {/* AI Job Matcher Modal */}
      <JobMatcherModal
        isOpen={isJobMatcherOpen}
        onClose={() => setIsJobMatcherOpen(false)}
        cvData={cvData}
        onAddSkills={handleAddSkillsFromMatcher}
      />
    </div>
  );
};
