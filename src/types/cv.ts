export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  level?: 'Pemula' | 'Menengah' | 'Mahir' | 'Ahli';
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
}

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  photoUrl?: string;
  showPhoto: boolean;
}

export type TemplateId =
  | 'modern'
  | 'ats_classic'
  | 'executive'
  | 'timeline'
  | 'minimalist'
  | 'compact'
  | 'creative'
  | 'stripe'
  | 'corporate'
  | 'academic';

export interface TemplateInfo {
  id: TemplateId;
  name: string;
  category: 'Populer HRD' | 'ATS Friendly' | 'Kreatif' | 'Formal & BUMN';
  description: string;
  badge?: string;
}

export type CVLanguage = 'id' | 'en';

export interface CVTheme {
  accentColor: string;
  fontFamily: 'sans' | 'serif' | 'mono';
  template: TemplateId;
  language?: CVLanguage;
}

export interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  theme: CVTheme;
}

export type CoverLetterTemplateType =
  | 'fresh_grad'
  | 'experienced'
  | 'bumn_formal'
  | 'english_pro'
  | 'career_switch';

export interface CoverLetterData {
  applicantName: string;
  applicantTitle: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantAddress: string;
  applicantLinkedIn?: string;

  date: string;
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  companyAddress: string;
  jobTitle: string;

  templateType: CoverLetterTemplateType;
  subject: string;
  salutation: string;
  openingParagraph: string;
  bodyParagraph1: string;
  bodyParagraph2: string;
  closingParagraph: string;
  signOff: string;

  accentColor: string;
  fontFamily: 'font-sans' | 'font-serif' | 'font-mono';
}

export interface CoverLetterPreset {
  id: CoverLetterTemplateType;
  name: string;
  tag: string;
  description: string;
  badgeColor: string;
}
