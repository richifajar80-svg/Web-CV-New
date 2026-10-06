import { CVLanguage } from '@/types/cv';

export interface CVTranslations {
  contact: string;
  profile: string;
  aboutMe: string;
  summary: string;
  executiveSummary: string;
  professionalSummary: string;
  workExperience: string;
  careerTimeline: string;
  professionalHistory: string;
  education: string;
  higherEducation: string;
  educationAndSkills: string;
  skills: string;
  skillsCompetence: string;
  coreSkills: string;
  technicalSkills: string;
  languages: string;
  certifications: string;
  certificationsLicenses: string;
  present: string;
  presentShort: string;
  gpa: string;
  curriculumVitae: string;
  keyResponsibilities: string;
  candidateDefaultName: string;
  candidateDefaultJob: string;
}

export const TRANSLATIONS: Record<CVLanguage, CVTranslations> = {
  id: {
    contact: 'Kontak',
    profile: 'Profil',
    aboutMe: 'Tentang Saya',
    summary: 'Ringkasan Diri',
    executiveSummary: 'Ringkasan Eksekutif',
    professionalSummary: 'Ringkasan Profesional',
    workExperience: 'Pengalaman Kerja',
    careerTimeline: 'Alur Karier & Pengalaman Kerja',
    professionalHistory: 'Riwayat Profesional',
    education: 'Pendidikan',
    higherEducation: 'Pendidikan Tinggi',
    educationAndSkills: 'Pendidikan & Keahlian',
    skills: 'Keahlian',
    skillsCompetence: 'Keahlian & Kompetensi',
    coreSkills: 'Keahlian Utama',
    technicalSkills: 'Keahlian Keilmuan & Teknis',
    languages: 'Bahasa',
    certifications: 'Sertifikasi',
    certificationsLicenses: 'Sertifikasi & Lisensi',
    present: 'Sekarang',
    presentShort: 'Kini',
    gpa: 'IPK',
    curriculumVitae: 'DAFTAR RIWAYAT HIDUP',
    keyResponsibilities: 'Tanggung Jawab & Pencapaian Utama',
    candidateDefaultName: 'Nama Lengkap Anda',
    candidateDefaultJob: 'Profesi / Posisi Anda',
  },
  en: {
    contact: 'Contact',
    profile: 'Profile',
    aboutMe: 'About Me',
    summary: 'Professional Bio',
    executiveSummary: 'Executive Summary',
    professionalSummary: 'Professional Summary',
    workExperience: 'Work Experience',
    careerTimeline: 'Career Path & Experience',
    professionalHistory: 'Professional History',
    education: 'Education',
    higherEducation: 'Higher Education',
    educationAndSkills: 'Education & Skills',
    skills: 'Skills',
    skillsCompetence: 'Skills & Competencies',
    coreSkills: 'Core Competencies',
    technicalSkills: 'Technical Expertise',
    languages: 'Languages',
    certifications: 'Certifications',
    certificationsLicenses: 'Certifications & Licenses',
    present: 'Present',
    presentShort: 'Present',
    gpa: 'GPA',
    curriculumVitae: 'CURRICULUM VITAE',
    keyResponsibilities: 'Key Responsibilities & Achievements',
    candidateDefaultName: 'Your Full Name',
    candidateDefaultJob: 'Your Profession / Job Title',
  },
};

export const getCVTranslations = (lang?: CVLanguage): CVTranslations => {
  return TRANSLATIONS[lang || 'id'] || TRANSLATIONS.id;
};

export const formatSkillLevel = (level?: string, lang?: CVLanguage): string => {
  if (!level) return '';
  if (lang === 'en') {
    const map: Record<string, string> = {
      Pemula: 'Beginner',
      Menengah: 'Intermediate',
      Mahir: 'Advanced',
      Ahli: 'Expert',
    };
    return map[level] || level;
  }
  return level;
};

