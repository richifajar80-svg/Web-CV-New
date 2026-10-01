import { CoverLetterData, CoverLetterPreset, CoverLetterTemplateType } from '@/types/coverLetter';
import { CVData } from '@/types/cv';

export const COVER_LETTER_PRESETS: CoverLetterPreset[] = [
  {
    id: 'fresh_grad',
    name: 'Fresh Graduate & Magang',
    tag: 'Paling Populer',
    description: 'Menonjolkan latar pendidikan, keaktifan organisasi, proyek kuliah, dan kemauan belajar tinggi.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  {
    id: 'experienced',
    name: 'Profesional Berpengalaman',
    tag: 'Fokus Metrik & Hasil',
    description: 'Menonjolkan riwayat pencapaian kerja, metrik angka keberhasilan, dan keahlian spesifik.',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  {
    id: 'bumn_formal',
    name: 'BUMN & Korporat Formal',
    tag: 'Sopan & Standar FHCI',
    description: 'Bahasa Indonesia baku, beretika tinggi, dan format surat dinas formal untuk rekrutmen BUMN/Swasta besar.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  {
    id: 'english_pro',
    name: 'Professional English (MNC)',
    tag: 'Standar Global',
    description: 'Bahasa Inggris formal berstandar internasional untuk startup unicorn, konsultan, atau multinational company.',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  {
    id: 'career_switch',
    name: 'Pindah Karir (Career Switcher)',
    tag: 'Transferable Skills',
    description: 'Menjelaskan alasan transisi industri dan keterampilan yang dapat diterapkan pada posisi baru.',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
  },
];

export function getTodayFormattedDate(isEnglish: boolean = false): string {
  const now = new Date();
  if (isEnglish) {
    return now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  return now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Smart Generator: Generates a fully fleshed out Cover Letter using CV Data & chosen preset
 */
export function generateCoverLetterFromCV(
  cv: CVData,
  templateType: CoverLetterTemplateType,
  overrides?: {
    companyName?: string;
    jobTitle?: string;
    recipientName?: string;
    companyAddress?: string;
  }
): CoverLetterData {
  const isEnglish = templateType === 'english_pro';
  const name = cv.personalInfo?.fullName || 'Nama Lengkap Pelamar';
  const targetJob = overrides?.jobTitle || cv.personalInfo?.jobTitle || (isEnglish ? 'Professional Staff' : 'Staf Profesional');
  const company = overrides?.companyName || (isEnglish ? 'PT Inovasi Digital Nusantara' : 'PT Bank Central Asia Tbk');
  const recipient = overrides?.recipientName || (isEnglish ? 'Hiring Manager' : 'Bapak/Ibu HRD Manager');
  const recipientTitle = isEnglish ? 'Talent Acquisition Team' : 'Tim Rekrutmen & Pengembangan SDM';
  const companyAddress = overrides?.companyAddress || 'Jakarta, Indonesia';
  const dateStr = getTodayFormattedDate(isEnglish);

  // Extract top skills and experiences from CV for smart insertion
  const skillList = cv.skills?.map((s) => s.name).slice(0, 4).join(', ') || 'komunikasi efektif, analisis data, manajemen waktu, dan kerja sama tim';
  const latestExperience = cv.experiences?.[0];
  const latestEducation = cv.education?.[0];

  let subject = `Lamaran Pekerjaan - ${targetJob} - ${name}`;
  let salutation = `Kepada Yth. ${recipient},`;
  let openingParagraph = '';
  let bodyParagraph1 = '';
  let bodyParagraph2 = '';
  let closingParagraph = '';
  let signOff = 'Hormat saya,';

  switch (templateType) {
    case 'fresh_grad': {
      subject = `Lamaran Pekerjaan: ${targetJob} - ${name}`;
      salutation = `Kepada Yth. ${recipient}\n${recipientTitle}\n${company}\nDi Tempat`;
      openingParagraph = `Berdasarkan informasi lowongan pekerjaan yang saya dapatkan mengenai posisi ${targetJob} di ${company}, saya bermaksud untuk mengajukan diri guna bergabung bersama tim Bapak/Ibu. Sebagai lulusan ${latestEducation ? `${latestEducation.degree} dari ${latestEducation.institution}` : 'perguruan tinggi'} yang memiliki ketertarikan mendalam pada industri ini, saya siap mendedikasikan energi, integritas, dan kompetensi yang saya miliki.`;
      bodyParagraph1 = `Selama masa studi, saya telah membekali diri dengan pemahaman teoretis yang kokoh serta keterampilan praktis dalam ${skillList}. Saya juga aktif berkontribusi dalam berbagai proyek ${latestExperience ? `serta memiliki pengalaman sebagai ${latestExperience.role} di ${latestExperience.company}` : 'akademik dan kepanitiaan'}, yang mengasah kemampuan problem solving, adaptasi cepat, serta kolaborasi lintas tim secara terstruktur.`;
      bodyParagraph2 = `Saya sangat mengagumi reputasi ${company} sebagai perusahaan yang terus berinovasi dan memiliki budaya kerja profesional. Saya meyakini latar belakang dan komitmen belajar yang saya miliki akan memungkinkan saya memberikan kontribusi nyata serta mendukung pencapaian target operasional perusahaan.`;
      closingParagraph = `Bersama surat ini, saya lampirkan Curriculum Vitae (CV) dan dokumen pendukung lainnya sebagai bahan pertimbangan Bapak/Ibu. Besar harapan saya untuk diberikan kesempatan menghadiri sesi wawancara guna mendiskusikan lebih lanjut bagaimana kualifikasi saya dapat memberikan nilai tambah bagi ${company}. Atas perhatian dan kesempatan yang diberikan, saya sampaikan terima kasih.`;
      signOff = 'Hormat saya,';
      break;
    }

    case 'experienced': {
      subject = `Aplikasi Posisi ${targetJob} - ${name}`;
      salutation = `Kepada Yth. ${recipient}\n${recipientTitle}\n${company}`;
      openingParagraph = `Saya menulis surat ini untuk menyatakan ketertarikan profesional saya terhadap posisi ${targetJob} di ${company}. Dengan pengalaman kerja yang solid ${latestExperience ? `terutama dalam peran saya sebagai ${latestExperience.role} di ${latestExperience.company}` : 'di industri terkait'}, saya yakin rekam jejak saya dalam mencapai target bisnis akan selaras dengan visi pertumbuhan perusahaan.`;
      bodyParagraph1 = `Sepanjang perjalanan karir saya, saya terbiasa mengelola tanggung jawab strategis yang melibatkan ${skillList}. ${latestExperience?.description ? latestExperience.description.split('\n')[0] : 'Saya berhasil mengoptimalkan proses kerja, meningkatkan efisiensi operasional tim, dan memberikan dampak positif terukur bagi perkembangan organisasi.'}`;
      bodyParagraph2 = `Ketertarikan saya bergabung dengan ${company} didasari oleh komitmen perusahaan terhadap keunggulan layanan dan inovasi industri. Saya siap membawa perspektif praktis, kepemimpinan adaptif, dan etos kerja berorientasi hasil untuk memperkuat performa divisi yang saya naungi.`;
      closingParagraph = `Terlampir CV saya yang merangkum rincian pencapaian dan kualifikasi profesional saya. Saya sangat menantikan kesempatan untuk berdiskusi langsung mengenai bagaimana keahlian dan pengalaman saya dapat berkontribusi secara langsung pada kesuksesan ${company}. Terima kasih atas waktu dan pertimbangan Bapak/Ibu.`;
      signOff = 'Salam hangat dan hormat,';
      break;
    }

    case 'bumn_formal': {
      subject = `Perihal: Surat Lamaran Pekerjaan - Formasi ${targetJob}`;
      salutation = `Yth. ${recipient}\nPanitia Rekrutmen & Seleksi Pegawai\n${company}\n${companyAddress}`;
      openingParagraph = `Dengan hormat,\n\nSehubungan dengan informasi pembukaan rekrutmen pegawai untuk formasi ${targetJob} di lingkungan ${company}, perkenankan saya mengajukan surat permohonan lamaran pekerjaan untuk dapat mengabdi dan berkontribusi secara profesional di instansi yang Bapak/Ibu pimpin.`;
      bodyParagraph1 = `Saya adalah pribadi yang berintegritas tinggi, disiplin, dan memiliki dedikasi kuat dalam menjalankan amanah tugas. Dengan latar belakang pendidikan ${latestEducation ? `${latestEducation.degree} dari ${latestEducation.institution}` : 'terkait'} serta kompetensi di bidang ${skillList}, saya meyakini mampu menjalankan tugas kedinasan dan operasional dengan penuh tanggung jawab sesuai nilai-nilai luhur AKHLAK BUMN dan tata kelola perusahaan yang baik.`;
      bodyParagraph2 = `Pengalaman saya ${latestExperience ? `sebagai ${latestExperience.role} di ${latestExperience.company}` : 'dalam mengelola berbagai proyek kerja'} telah membiasakan saya untuk bekerja secara cermat di bawah tekanan, menjunjung tinggi ketepatan waktu, dan menjaga komunikasi yang efektif dengan seluruh pemangku kepentingan.`;
      closingParagraph = `Demikian surat lamaran ini saya sampaikan dengan sungguh-sungguh. Sebagai kelengkapan data administratif, terlampir Daftar Riwayat Hidup (Curriculum Vitae) dan berkas pendukung saya. Besar harapan saya agar dapat diikutsertakan dalam tahapan seleksi selanjutnya. Atas perhatian dan perkenan Bapak/Ibu, saya haturkan terima kasih yang sebesar-besarnya.`;
      signOff = 'Hormat saya,';
      break;
    }

    case 'english_pro': {
      subject = `Application for ${targetJob} - ${name}`;
      salutation = `Dear ${recipient},\n${recipientTitle}\n${company}`;
      openingParagraph = `I am writing to express my strong interest in the ${targetJob} position at ${company}. Having followed your company’s impressive milestones in the industry, I am eager to leverage my background in ${latestEducation?.degree || 'business and technology'} to contribute to your continued growth and market leadership.`;
      bodyParagraph1 = `Throughout my career${latestExperience ? `, notably as a ${latestExperience.role} at ${latestExperience.company}` : ''}, I have developed comprehensive proficiency in ${skillList}. My professional approach is characterized by data-driven problem solving, proactive team collaboration, and a relentless focus on delivering measurable business impact on schedule.`;
      bodyParagraph2 = `What excites me most about this opportunity at ${company} is your commitment to high standards, forward-thinking innovation, and impactful solutions. I am confident that my technical capabilities, combined with my strong work ethic and adaptability, make me a valuable addition to your team.`;
      closingParagraph = `Attached is my resume for your review, providing further details of my qualifications, achievements, and work history. I would welcome the opportunity to speak with you further to discuss how my skillset aligns with the needs of ${company}. Thank you very much for your time and consideration.`;
      signOff = 'Sincerely,';
      break;
    }

    case 'career_switch': {
      subject = `Lamaran Pekerjaan: ${targetJob} - ${name} (Lintas Bidang/Career Transition)`;
      salutation = `Kepada Yth. ${recipient}\n${recipientTitle}\n${company}`;
      openingParagraph = `Melalui surat ini, saya ingin mengajukan diri untuk posisi ${targetJob} di ${company}. Sebagai seorang profesional yang memiliki latar belakang ${latestEducation?.degree || 'kuat'} dan pengalaman berharga di bidang sebelumnya, saya telah secara terencana membangun keahlian baru untuk bertransisi secara sukses ke peran ${targetJob}.`;
      bodyParagraph1 = `Meskipun berakar dari bidang yang berbeda, pengalaman saya ${latestExperience ? `sebagai ${latestExperience.role} di ${latestExperience.company}` : 'sebelumnya'} telah membekali saya dengan keterampilan yang sangat relevan (*transferable skills*), seperti ${skillList}. Saya terbiasa menghadapi tantangan baru, menganalisis persoalan secara multidimensi, dan menguasai konsep-konsep teknis dalam kurun waktu yang singkat.`;
      bodyParagraph2 = `Keputusan saya untuk beralih ke bidang ini didorong oleh komitmen jangka panjang serta antusiasme saya terhadap dinamika industri di ${company}. Saya yakin perspektif unik dan dedikasi tinggi yang saya bawa akan menjadi aset berharga dalam memperkaya kapabilitas tim Bapak/Ibu.`;
      closingParagraph = `Bersama surat ini, saya lampirkan CV yang merinci keahlian serta proyek-proyek terbaru yang relevan dengan posisi ${targetJob}. Saya sangat menyambut baik kesempatan untuk menghadiri wawancara guna memaparkan bagaimana kemampuan adaptasi dan motivasi saya dapat berkontribusi positif bagi ${company}. Terima kasih atas perhatian Bapak/Ibu.`;
      signOff = 'Hormat saya,';
      break;
    }
  }

  const fontFamilyMap: Record<string, 'font-sans' | 'font-serif' | 'font-mono'> = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
  };

  return {
    applicantName: name,
    applicantTitle: targetJob,
    applicantEmail: cv.personalInfo?.email || 'email@example.com',
    applicantPhone: cv.personalInfo?.phone || '+62 812-3456-7890',
    applicantAddress: cv.personalInfo?.location || 'Jakarta, Indonesia',
    applicantLinkedIn: cv.personalInfo?.linkedin || '',
    date: dateStr,
    recipientName: recipient,
    recipientTitle,
    companyName: company,
    companyAddress,
    jobTitle: targetJob,
    templateType,
    subject,
    salutation,
    openingParagraph,
    bodyParagraph1,
    bodyParagraph2,
    closingParagraph,
    signOff,
    accentColor: cv.theme?.accentColor || '#059669',
    fontFamily: fontFamilyMap[cv.theme?.fontFamily || 'sans'] || 'font-sans',
  };
}

