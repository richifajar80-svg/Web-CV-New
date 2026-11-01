import { CoverLetterData, CoverLetterPreset, CoverLetterTemplateType } from '@/types/coverLetter';
import { CVData } from '@/types/cv';

export const COVER_LETTER_PRESETS: CoverLetterPreset[] = [
  {
    id: 'experienced',
    name: 'Profesional Berpengalaman',
    tag: 'Rekomendasi Utama',
    description: 'Menonjolkan rekam jejak karier, kepemimpinan, tanggung jawab kerja, dan keahlian terapan di dunia kerja.',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  {
    id: 'fresh_grad',
    name: 'Fresh Graduate & Lulusan Baru',
    tag: 'Lulusan Baru / Magang',
    description: 'Untuk pelamar yang belum memiliki riwayat kerja formal, menonjolkan potensi belajar, kedisiplinan, dan proyek.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  {
    id: 'career_switch',
    name: 'Pindah Karir (Career Switcher)',
    tag: 'Transferable Skills',
    description: 'Menonjolkan keahlian lintas bidang dari pengalaman kerja sebelumnya yang relevan dengan posisi baru.',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
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
 * Prioritizes proven work experience, achievements, and practical competencies over formal education.
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
  const phone = cv.personalInfo?.phone || '+62 812-3456-7890';
  const email = cv.personalInfo?.email || 'email@example.com';
  const linkedin = cv.personalInfo?.linkedin || '';
  const targetJob = overrides?.jobTitle || cv.personalInfo?.jobTitle || (isEnglish ? 'Professional Staff' : 'Staf Profesional');
  const company = overrides?.companyName !== undefined ? overrides.companyName : (isEnglish ? 'PT Inovasi Digital Nusantara' : 'PT Bank Central Asia Tbk');
  const recipient = overrides?.recipientName !== undefined ? overrides.recipientName : (isEnglish ? 'Hiring Manager' : 'Bapak/Ibu HRD');
  const recipientTitle = isEnglish ? 'Talent Acquisition Team' : 'Tim Rekrutmen & Pengembangan SDM';

  const isGeneralTarget =
    !company ||
    company.toLowerCase().trim() === 'di tempat' ||
    company.toLowerCase().trim() === 'perusahaan yang bapak/ibu pimpin' ||
    company.toLowerCase().trim() === '-';

  const companyAddress =
    overrides?.companyAddress !== undefined
      ? overrides.companyAddress
      : isGeneralTarget
      ? ''
      : isEnglish
      ? 'Jakarta, Indonesia'
      : 'Jakarta, Indonesia';

  const dateStr = getTodayFormattedDate(isEnglish);

  const companyPhrase = isGeneralTarget ? 'di perusahaan yang Bapak/Ibu pimpin' : `di ${company}`;
  const companyOrg = isGeneralTarget ? 'perusahaan yang Bapak/Ibu pimpin' : company;

  // Extract top skills and experiences from CV for smart insertion
  const skillList = cv.skills?.map((s) => s.name).slice(0, 4).join(', ') || 'komunikasi efektif, analisis data, manajemen waktu, dan kerja sama tim';
  const latestExperience = cv.experiences?.[0];
  const latestEducation = cv.education?.[0];
  const hasExperience = Boolean(cv.experiences && cv.experiences.length > 0);

  let subject = `Lamaran Pekerjaan - ${targetJob} - ${name}`;
  let salutation = `Kepada Yth. ${recipient},`;
  let openingParagraph = '';
  let bodyParagraph1 = '';
  let bodyParagraph2 = '';
  let closingParagraph = '';
  let signOff = 'Hormat saya,';
  let emailSubject = `${targetJob} - ${name}`;
  let emailBody = '';
  let whatsappMessage = '';

  const contactSignature = `${name}\nNo. HP/WA: ${phone}\nEmail: ${email}${linkedin ? `\nLinkedIn/Portofolio: ${linkedin}` : ''}`;

  switch (templateType) {
    case 'fresh_grad': {
      subject = `Lamaran Pekerjaan: ${targetJob} - ${name}`;
      salutation = `Dengan hormat,`;

      if (hasExperience) {
        // If candidate already has work experience, highlight the experience instead of education
        openingParagraph = `Berdasarkan informasi lowongan pekerjaan mengenai posisi ${targetJob} ${companyPhrase}, saya bermaksud mengajukan diri guna bergabung bersama tim Bapak/Ibu. Berbekal rekam jejak kerja ${latestExperience ? `sebagai ${latestExperience.role} di ${latestExperience.company}` : 'profesional'} serta keahlian dalam ${skillList}, saya siap mendedikasikan integritas, adaptabilitas tinggi, dan performa kerja terbaik.`;
        bodyParagraph1 = `Melalui pengalaman kerja dan keterlibatan operasional yang telah saya jalani${latestExperience ? ` di ${latestExperience.company}` : ''}, saya terbiasa mempraktikkan keterampilan utama dalam ${skillList}. ${latestExperience?.description ? latestExperience.description.split('\n')[0].replace(/^[•\-*]\s*/, '') : 'Pengalaman ini membentuk kemampuan problem solving yang cepat, kedisiplinan kerja yang tinggi, serta kolaborasi tim yang terstruktur untuk mencapai target.'}`;
        bodyParagraph2 = `Saya sangat mengagumi reputasi ${companyOrg} sebagai perusahaan yang terus berinovasi dan memiliki budaya kerja profesional. Saya meyakini pengalaman kerja serta komitmen dedikasi yang saya miliki akan memungkinkan saya memberikan kontribusi nyata serta mendukung pencapaian target operasional perusahaan.`;
      } else {
        // Pure fresh graduate without prior employment
        openingParagraph = `Berdasarkan informasi lowongan pekerjaan yang saya dapatkan mengenai posisi ${targetJob} ${companyPhrase}, saya bermaksud untuk mengajukan diri guna bergabung bersama tim Bapak/Ibu. Sebagai pribadi yang berdedikasi tinggi ${latestEducation ? `lulusan ${latestEducation.degree} dari ${latestEducation.institution}` : ''} yang memiliki ketertarikan mendalam pada industri ini, saya siap mendedikasikan energi, integritas, dan kompetensi yang saya miliki.`;
        bodyParagraph1 = `Selama masa studi, saya telah membekali diri dengan pemahaman teoretis yang baik serta keterampilan dalam ${skillList}. Saya juga aktif berkontribusi dalam berbagai proyek terstruktur dan kegiatan tim, yang melatih kemampuan problem solving, adaptasi cepat, serta kerja sama secara terstruktur.`;
        bodyParagraph2 = `Saya sangat mengagumi reputasi ${companyOrg} sebagai perusahaan yang terus berinovasi dan memiliki budaya kerja profesional. Saya meyakini komitmen belajar tinggi dan etos kerja yang saya miliki akan memungkinkan saya memberikan kontribusi nyata bagi tim Bapak/Ibu.`;
      }

      closingParagraph = `Bersama surat ini, saya lampirkan Curriculum Vitae (CV) dan dokumen pendukung lainnya sebagai bahan pertimbangan Bapak/Ibu. Besar harapan saya untuk diberikan kesempatan menghadiri sesi wawancara guna mendiskusikan lebih lanjut bagaimana kualifikasi saya dapat memberikan nilai tambah bagi ${companyOrg}. Atas perhatian dan kesempatan yang diberikan, saya sampaikan terima kasih.`;
      signOff = 'Hormat saya,';

      emailSubject = `Lamaran Pekerjaan - ${targetJob} - ${name}`;
      emailBody = `Kepada Yth. ${recipient}\n${isGeneralTarget ? 'Di Tempat' : `${company}${companyAddress ? `\n${companyAddress}` : ''}`}\n\nDengan hormat,\n\nMelalui email ini, saya ${name} bermaksud mengajukan lamaran pekerjaan untuk posisi ${targetJob} ${companyPhrase}.\n\n${hasExperience ? `Berbekal pengalaman kerja saya ${latestExperience ? `sebagai ${latestExperience.role} di ${latestExperience.company}` : 'profesional'} serta penguasaan di bidang ${skillList}` : `Memiliki kompetensi di bidang ${skillList}`}, saya memiliki integritas dan semangat kerja yang tinggi, cepat beradaptasi, dan siap berkontribusi secara positif bagi tim Bapak/Ibu.\n\nSebagai bahan pertimbangan Bapak/Ibu, bersama email ini saya lampirkan Curriculum Vitae (CV) terbaru beserta berkas pendukung lainnya. Besar harapan saya untuk dapat diberikan kesempatan mengikuti tahapan wawancara.\n\nAtas perhatian dan kesempatan yang Bapak/Ibu berikan, saya ucapkan terima kasih.\n\nHormat saya,\n\n${contactSignature}`;

      whatsappMessage = `Selamat pagi/siang ${recipient}${isGeneralTarget ? '' : ` di ${company}`}.\n\nPerkenalkan saya *${name}*${hasExperience && latestExperience ? `, memiliki pengalaman kerja sebagai *${latestExperience.role}* di ${latestExperience.company}` : ''} dengan kompetensi di bidang ${skillList}.\n\nMelalui pesan ini, saya izin menyampaikan ketertarikan untuk melamar pada posisi *${targetJob}* ${isGeneralTarget ? 'di perusahaan yang Bapak/Ibu pimpin' : `di *${company}*`} yang sedang dibuka. Bersama pesan ini turut saya lampirkan file PDF CV terbaru saya sebagai bahan pertimbangan Bapak/Ibu.\n\nBesar harapan saya untuk dapat mengikuti tahapan seleksi selanjutnya. Terima kasih banyak atas waktu dan perhatian Bapak/Ibu. 🙏`;
      break;
    }

    case 'experienced': {
      subject = `Aplikasi Posisi ${targetJob} - ${name}`;
      salutation = `Dengan hormat,`;
      openingParagraph = `Saya menulis surat ini untuk menyatakan ketertarikan profesional saya terhadap posisi ${targetJob} ${companyPhrase}. Dengan rekam jejak kerja yang solid ${latestExperience ? `terutama dalam peran saya sebagai ${latestExperience.role} di ${latestExperience.company}` : 'di industri terkait'}, saya yakin pengalaman dan kompetensi praktis saya akan memberikan kontribusi langsung dalam mencapai target operasional dan pertumbuhan perusahaan.`;
      bodyParagraph1 = `Sepanjang perjalanan karier saya, saya terbiasa mengemban tanggung jawab strategis serta menguasai keahlian inti dalam ${skillList}. ${latestExperience?.description ? latestExperience.description.split('\n')[0].replace(/^[•\-*]\s*/, '') : 'Saya berhasil mengoptimalkan proses kerja, meningkatkan efisiensi operasional tim, dan memberikan dampak positif terukur bagi perkembangan organisasi.'}`;
      bodyParagraph2 = `Ketertarikan saya bergabung ${companyPhrase} didasari oleh komitmen terhadap keunggulan layanan, integritas, dan budaya kerja profesional. Saya siap membawa perspektif praktis, kepemimpinan adaptif, serta etos kerja berorientasi hasil untuk memperkuat performa tim yang saya naungi.`;
      closingParagraph = `Terlampir Curriculum Vitae (CV) saya yang merangkum rincian pencapaian dan kualifikasi profesional saya. Saya sangat menantikan kesempatan untuk berdiskusi langsung dalam sesi wawancara mengenai bagaimana pengalaman kerja saya dapat memberikan nilai tambah bagi ${companyOrg}. Terima kasih atas waktu dan pertimbangan Bapak/Ibu.`;
      signOff = 'Hormat saya,';

      emailSubject = `Lamaran Kerja - ${targetJob} - ${name}`;
      emailBody = `Kepada Yth. ${recipient}\n${isGeneralTarget ? 'Di Tempat' : `${company}${companyAddress ? `\n${companyAddress}` : ''}`}\n\nDengan hormat,\n\nPerkenalkan saya ${name}. Melalui email ini, saya bermaksud mengajukan diri untuk posisi ${targetJob} ${companyPhrase}.\n\nSaya memiliki rekam jejak kerja profesional ${latestExperience ? `sebagai ${latestExperience.role} di ${latestExperience.company}` : 'di bidang ini'} dengan keahlian utama meliputi ${skillList}. Dalam peran profesional saya sebelumnya, saya terbiasa bekerja berorientasi pada target nyata, kepemimpinan tim yang solid, dan peningkatan efisiensi operasional.\n\nTerlampir pada email ini berkas CV terbaru saya yang memuat rincian pengalaman kerja serta pencapaian saya. Saya sangat antusias apabila diberikan kesempatan berdiskusi lebih lanjut melalui sesi wawancara.\n\nTerima kasih atas waktu dan pertimbangan Bapak/Ibu.\n\nHormat saya,\n\n${contactSignature}`;

      whatsappMessage = `Selamat pagi/siang ${recipient}${isGeneralTarget ? '' : ` di ${company}`}.\n\nPerkenalkan saya *${name}*. Melalui pesan ini saya bermaksud melamar untuk posisi *${targetJob}* ${isGeneralTarget ? 'di perusahaan yang Bapak/Ibu pimpin' : `di *${company}*`}.\n\nSaya memiliki pengalaman kerja ${latestExperience ? `sebagai *${latestExperience.role}* di ${latestExperience.company}` : 'profesional'} dengan penguasaan di bidang ${skillList}. Bersama pesan ini, izin saya lampirkan berkas CV PDF terbaru saya sebagai bahan pertimbangan Bapak/Ibu.\n\nApabila kualifikasi saya sesuai dengan kebutuhan tim, saya sangat siap untuk mengikuti sesi wawancara. Terima kasih banyak atas waktu dan perhatian Bapak/Ibu. 🙏`;
      break;
    }

    case 'bumn_formal': {
      subject = `Perihal: Surat Lamaran Pekerjaan - Formasi ${targetJob}`;
      salutation = `Dengan hormat,`;
      openingParagraph = `Sehubungan dengan informasi pembukaan rekrutmen pegawai untuk formasi ${targetJob} ${isGeneralTarget ? 'di instansi yang Bapak/Ibu pimpin' : `di lingkungan ${company}`}, perkenankan saya mengajukan surat permohonan lamaran pekerjaan untuk dapat mengabdi dan berkontribusi secara profesional di instansi yang Bapak/Ibu pimpin.`;
      
      if (hasExperience) {
        bodyParagraph1 = `Saya adalah pribadi yang berintegritas tinggi, disiplin, dan memiliki dedikasi kuat dalam menjalankan amanah tugas. Berbekal rekam jejak kerja profesional ${latestExperience ? `sebagai ${latestExperience.role} di ${latestExperience.company}` : ''} serta kompetensi teruji di bidang ${skillList}, saya meyakini mampu menjalankan tugas kedinasan dan operasional dengan penuh tanggung jawab sesuai standar operasional prosedur dan tata kelola yang baik.`;
        bodyParagraph2 = `Pengalaman saya ${latestExperience ? `dalam mengemban tanggung jawab operasional di ${latestExperience.company}` : 'dalam dunia kerja'} telah membiasakan saya untuk bekerja secara cermat, solutif di bawah target, menjunjung tinggi ketepatan waktu, dan menjaga komunikasi yang efektif dengan seluruh pemangku kepentingan.`;
      } else {
        bodyParagraph1 = `Saya adalah pribadi yang berintegritas tinggi, disiplin, dan memiliki dedikasi kuat dalam menjalankan amanah tugas. Dengan latar belakang pendidikan ${latestEducation ? `${latestEducation.degree} dari ${latestEducation.institution}` : 'terkait'} serta kompetensi di bidang ${skillList}, saya meyakini mampu menjalankan tugas kedinasan dan operasional dengan penuh tanggung jawab sesuai nilai-nilai luhur AKHLAK BUMN dan tata kelola instansi yang baik.`;
        bodyParagraph2 = `Selama masa studi dan berbagai kegiatan organisasi, saya telah terbiasa bekerja secara cermat, menjunjung tinggi ketepatan waktu, dan menjaga komunikasi yang efektif dengan seluruh pemangku kepentingan.`;
      }

      closingParagraph = `Demikian surat lamaran ini saya sampaikan dengan sungguh-sungguh. Sebagai kelengkapan data administratif, terlampir Daftar Riwayat Hidup (Curriculum Vitae) dan berkas pendukung saya. Besar harapan saya agar dapat diikutsertakan dalam tahapan seleksi selanjutnya. Atas perhatian dan perkenan Bapak/Ibu, saya haturkan terima kasih yang sebesar-besarnya.`;
      signOff = 'Hormat saya,';

      emailSubject = `Lamaran Pekerjaan - Formasi ${targetJob} - ${name}`;
      emailBody = `Yth. ${recipient}\n${isGeneralTarget ? 'Di Tempat' : `Panitia Seleksi Rekrutmen ${company}\nDi Tempat`}\n\nDengan hormat,\n\nSehubungan dengan informasi rekrutmen untuk formasi ${targetJob} ${companyPhrase}, perkenankan saya ${name} (${hasExperience && latestExperience ? `berpengalaman sebagai ${latestExperience.role} di ${latestExperience.company}` : 'pelamar profesional'}) mengajukan permohonan lamaran pekerjaan.\n\nSaya memiliki kompetensi di bidang ${skillList}${hasExperience && latestExperience ? ` serta rekam jejak kerja sebagai ${latestExperience.role} di ${latestExperience.company}` : ''}, disertai komitmen tinggi terhadap integritas, kedisiplinan, dan profesionalisme kerja.\n\nSebagai kelengkapan administrasi, bersama email ini saya lampirkan Curriculum Vitae (CV) beserta dokumen pendukung lainnya. Besar harapan saya untuk dapat diberikan kesempatan mengikuti tahapan seleksi berikutnya.\n\nAtas perhatian dan perkenan Bapak/Ibu, saya ucapkan terima kasih.\n\nHormat saya,\n\n${contactSignature}`;

      whatsappMessage = `Selamat pagi/siang Bapak/Ibu ${recipient}${isGeneralTarget ? '' : ` (${company})`}.\n\nDengan hormat, perkenalkan nama saya *${name}* (${hasExperience && latestExperience ? `berpengalaman sebagai *${latestExperience.role}* di ${latestExperience.company}` : 'pelamar profesional'}). Sehubungan dengan dibukanya informasi lowongan untuk posisi *${targetJob}* ${companyPhrase}, izin saya mengirimkan berkas lamaran dan CV PDF saya melalui pesan ini.\n\nBesar harapan saya untuk dapat diberikan kesempatan mengikuti tahapan seleksi lebih lanjut. Atas perhatian dan perkenan Bapak/Ibu, saya ucapkan terima kasih. 🙏`;
      break;
    }

    case 'english_pro': {
      subject = `Application for ${targetJob} - ${name}`;
      salutation = `Dear ${recipient},`;

      if (hasExperience) {
        openingParagraph = `I am writing to express my strong interest in the ${targetJob} position at ${company}. Having followed your organization’s impressive milestones in the industry, I am eager to leverage my proven professional track record ${latestExperience ? `as ${latestExperience.role} at ${latestExperience.company}` : 'in the field'} to contribute to your continued operational excellence and business growth.`;
        bodyParagraph1 = `Throughout my career${latestExperience ? `, notably during my tenure at ${latestExperience.company}` : ''}, I have developed comprehensive proficiency in ${skillList}. My professional approach is characterized by data-driven problem solving, proactive team leadership, and a relentless focus on delivering measurable results on schedule.`;
      } else {
        openingParagraph = `I am writing to express my strong interest in the ${targetJob} position at ${company}. Having followed your company’s impressive milestones in the industry, I am eager to leverage my educational foundation ${latestEducation ? `in ${latestEducation.degree}` : ''} and strong learning agility to contribute to your team.`;
        bodyParagraph1 = `During my academic studies, I have developed solid foundational proficiency in ${skillList}. My approach is characterized by structured problem solving, proactive collaboration, and an eagerness to take on new challenges and deliver meaningful value.`;
      }

      bodyParagraph2 = `What excites me most about this opportunity at ${company} is your commitment to high standards, forward-thinking innovation, and impactful solutions. I am confident that my practical competencies, combined with my strong work ethic and adaptability, make me a valuable addition to your team.`;
      closingParagraph = `Attached is my resume for your review, providing further details of my qualifications, achievements, and work history. I would welcome the opportunity to speak with you further to discuss how my skillset aligns with the needs of ${company}. Thank you very much for your time and consideration.`;
      signOff = 'Sincerely,';

      emailSubject = `Application for ${targetJob} - ${name}`;
      emailBody = `Dear ${recipient},\n\nI hope this email finds you well.\n\nI am writing to apply for the ${targetJob} position at ${company}. With my professional background${hasExperience && latestExperience ? ` as ${latestExperience.role} at ${latestExperience.company}` : ''} and strong expertise in ${skillList}, I am confident in my ability to contribute immediately to your team's objectives.\n\nPlease find my updated resume attached for your review. I would welcome the opportunity to discuss how my experience and skills align with the needs of ${company} in an interview.\n\nThank you very much for your time and consideration.\n\nBest regards,\n\n${name}\nPhone: ${phone}\nEmail: ${email}${linkedin ? `\nLinkedIn: ${linkedin}` : ''}`;

      whatsappMessage = `Good morning/afternoon ${recipient},\n\nMy name is *${name}*, and I am reaching out to express my interest in the *${targetJob}* position at *${company}*.\n\nWith my background${hasExperience && latestExperience ? ` as ${latestExperience.role} at ${latestExperience.company}` : ''} and skills in ${skillList}, I believe I would be a strong fit for your team. I have attached my latest CV (PDF) here for your review.\n\nThank you very much for your time and consideration. I look forward to hearing from you.`;
      break;
    }

    case 'career_switch': {
      subject = `Lamaran Pekerjaan: ${targetJob} - ${name}`;
      salutation = `Dengan hormat,`;

      if (hasExperience) {
        openingParagraph = `Melalui surat ini, saya ingin mengajukan diri untuk posisi ${targetJob} ${companyPhrase}. Sebagai profesional yang telah membangun rekam jejak kerja ${latestExperience ? `sebagai ${latestExperience.role} di ${latestExperience.company}` : 'di industri sebelumnya'} serta menguasai keahlian terapan di bidang ${skillList}, saya telah secara terencana membangun kapabilitas baru untuk mentransisikan kompetensi saya ke peran ${targetJob}.`;
        bodyParagraph1 = `Meskipun berakar dari bidang yang berbeda, pengalaman kerja saya telah membekali saya dengan keterampilan yang sangat relevan (transferable skills), seperti ${skillList}. Saya terbiasa menghadapi tantangan operasional baru, menganalisis persoalan secara multidimensi, serta memimpin kerja sama tim untuk mencapai target terbaik.`;
        bodyParagraph2 = `Keputusan saya untuk beralih ke peran ini didorong oleh komitmen jangka panjang serta antusiasme saya terhadap pertumbuhan industri di ${companyOrg}. Saya yakin rekam jejak kerja, kemampuan kepemimpinan, dan dedikasi tinggi yang saya bawa akan menjadi aset berharga dalam memperkaya kapabilitas tim Bapak/Ibu.`;
      } else {
        openingParagraph = `Melalui surat ini, saya ingin mengajukan diri untuk posisi ${targetJob} ${companyPhrase}. Sebagai pelamar yang memiliki komitmen kuat untuk berkembang dan menguasai keahlian di bidang ${skillList}, saya telah secara terencana membangun pengetahuan baru untuk bertransisi ke peran ${targetJob}.`;
        bodyParagraph1 = `Meskipun memiliki latar belakang pendidikan yang berbeda, saya memiliki serangkaian keterampilan yang sangat relevan (transferable skills), seperti ${skillList}. Saya terbiasa menghadapi tantangan baru, cepat belajar, dan menguasai konsep-konsep teknis dalam kurun waktu yang singkat.`;
        bodyParagraph2 = `Keputusan saya untuk fokus pada bidang ini didorong oleh antusiasme mendalam terhadap dinamika operasional di ${companyOrg}. Saya meyakini dedikasi dan komitmen belajar tinggi yang saya miliki akan menjadi nilai tambah bagi tim Bapak/Ibu.`;
      }

      closingParagraph = `Bersama surat ini, saya lampirkan CV yang merinci keahlian serta pengalaman saya yang relevan dengan posisi ${targetJob}. Saya sangat menyambut baik kesempatan untuk menghadiri wawancara guna memaparkan bagaimana kemampuan adaptasi dan motivasi saya dapat berkontribusi positif bagi ${companyOrg}. Terima kasih atas perhatian Bapak/Ibu.`;
      signOff = 'Hormat saya,';

      emailSubject = `Lamaran Pekerjaan - ${targetJob} - ${name}`;
      emailBody = `Kepada Yth. ${recipient}\n${company}\n\nDengan hormat,\n\nMelalui email ini, saya ${name} bermaksud mengajukan lamaran pekerjaan untuk posisi ${targetJob} di ${company}.\n\nBerbekal pengalaman kerja saya ${hasExperience && latestExperience ? `sebagai ${latestExperience.role} di ${latestExperience.company}` : 'profesional'} serta penguasaan kompetensi di bidang ${skillList}, saya memiliki kemampuan adaptasi yang cepat, pemecahan masalah yang terstruktur, serta komitmen penuh untuk berkontribusi pada posisi ${targetJob}.\n\nBersama email ini saya lampirkan CV terbaru beserta portofolio/berkas pendukung saya sebagai bahan pertimbangan Bapak/Ibu. Besar harapan saya untuk diberikan kesempatan mengikuti sesi wawancara.\n\nTerima kasih atas waktu dan perhatian Bapak/Ibu.\n\nHormat saya,\n\n${contactSignature}`;

      whatsappMessage = `Selamat pagi/siang ${recipient} di ${company}.\n\nPerkenalkan saya *${name}*. Melalui pesan ini saya izin melamar untuk posisi *${targetJob}* di *${company}*.\n\nSaya memiliki penguasaan di bidang ${skillList} serta pengalaman kerja ${hasExperience && latestExperience ? `sebagai *${latestExperience.role}* di ${latestExperience.company}` : 'profesional'} yang mendukung kesiapan saya berkontribusi di posisi ini. Bersama pesan ini turut saya lampirkan file PDF CV terbaru saya.\n\nBesar harapan saya untuk dapat diberikan kesempatan wawancara. Terima kasih banyak atas waktu dan perhatian Bapak/Ibu. 🙏`;
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
    emailSubject,
    emailBody,
    whatsappMessage,
    accentColor: cv.theme?.accentColor || '#059669',
    fontFamily: fontFamilyMap[cv.theme?.fontFamily || 'sans'] || 'font-sans',
  };
}
