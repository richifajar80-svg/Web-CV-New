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

