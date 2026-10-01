import { CVData } from '@/types/cv';

export const initialCVData: CVData = {
  personalInfo: {
    fullName: 'Baim Maulana',
    jobTitle: 'Senior Full Stack Developer',
    email: 'baim.maulana@example.com',
    phone: '+62 812 3456 7890',
    location: 'Jakarta Selatan, Indonesia',
    linkedin: 'linkedin.com/in/baimmaulana',
    website: 'baimmaulana.dev',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    showPhoto: true,
  },
  summary:
    'Full Stack Web Developer berpengalaman lebih dari 5 tahun dalam membangun aplikasi web modern berskala besar dengan ekosistem React, Next.js, TypeScript, dan Node.js. Memiliki rekam jejak sukses dalam meningkatkan performa sistem hingga 40% dan memimpin tim pengembang beranggotakan 6 engineer.',
  experiences: [
    {
      id: 'exp-1',
      role: 'Lead Frontend Engineer',
      company: 'PT Solusi Teknologi Nusantara',
      location: 'Jakarta, Indonesia',
      startDate: 'Jan 2022',
      endDate: 'Sekarang',
      current: true,
      description:
        '• Memimpin arsitektur antarmuka aplikasi SaaS dengan Next.js, melayani lebih dari 150.000 pengguna aktif bulanan.\n• Mengoptimalkan Core Web Vitals dan kecepatan rendering hingga skor 98/100 di Google Lighthouse.\n• Mengembangkan Design System internal bersama tim produk untuk mempercepat siklus rilis fitur hingga 35%.',
    },
    {
      id: 'exp-2',
      role: 'Full Stack Web Developer',
      company: 'Kreasi Digital Mandiri',
      location: 'Bandung, Indonesia',
      startDate: 'Feb 2019',
      endDate: 'Des 2021',
      current: false,
      description:
        '• Mengembangkan RESTful API dan GraphQL backend menggunakan Node.js dan PostgreSQL.\n• Mengintegrasikan payment gateway (QRIS, VA) dengan tingkat keberhasilan transaksi 99.9%.\n• Menulis automated unit test dan integration test dengan Jest, mencapai code coverage di atas 85%.',
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Sarjana Ilmu Komputer (S.Kom)',
      institution: 'Universitas Indonesia',
      location: 'Depok, Jawa Barat',
      startDate: '2015',
      endDate: '2019',
      current: false,
      gpa: '3.82 / 4.00',
      description: 'Lulus dengan predikat Cum Laude. Fokus riset pada Distributed Web Systems dan Cloud Computing.',
    },
  ],
  skills: [
    { id: 'sk-1', name: 'React / Next.js', level: 'Ahli' },
    { id: 'sk-2', name: 'TypeScript & JavaScript', level: 'Ahli' },
    { id: 'sk-3', name: 'Tailwind CSS', level: 'Ahli' },
    { id: 'sk-4', name: 'Node.js & Express', level: 'Mahir' },
    { id: 'sk-5', name: 'PostgreSQL & MongoDB', level: 'Mahir' },
    { id: 'sk-6', name: 'Git & CI/CD Pipelines', level: 'Mahir' },
    { id: 'sk-7', name: 'Docker & Cloud AWS', level: 'Menengah' },
  ],
  languages: [
    { id: 'lang-1', name: 'Bahasa Indonesia', level: 'Penutur Asli (Native)' },
    { id: 'lang-2', name: 'Bahasa Inggris', level: 'Profesional Aktif (TOEFL 580)' },
  ],
  certifications: [
    { id: 'cert-1', title: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2023' },
    { id: 'cert-2', title: 'Meta Certified Front-End Developer', issuer: 'Coursera / Meta', date: '2022' },
  ],
  theme: {
    accentColor: '#1e40af', // royal blue
    fontFamily: 'sans',
    template: 'modern',
    language: 'id',
  },
};
