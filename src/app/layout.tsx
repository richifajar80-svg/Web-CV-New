import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cvbagus.id';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#059669' },
    { media: '(prefers-color-scheme: dark)', color: '#064e3b' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'cvbagus.id - Buat CV ATS Friendly, Translate AI & Surat Lamaran Online',
    template: '%s | cvbagus.id',
  },
  description:
    'Bikin CV online ATS-Friendly dan resume profesional standar HRD dalam 5 menit di cvbagus.id. Dilengkapi 10+ templat modern (Harvard, Corporate, Executive), AI Translate Bahasa Inggris, kalkulator skor ATS otomatis, pembuat surat lamaran kerja, dan unduh PDF A4 tanpa watermark.',
  keywords: [
    'cvbagus.id',
    'cvbagus',
    'cv bagus',
    'buat cv online',
    'bikin cv online gratis',
    'template cv ats friendly',
    'template cv harvard indonesia',
    'translate cv bahasa inggris otomatis',
    'pembuat surat lamaran kerja online',
    'cover letter generator indonesia',
    'contoh cv lamaran kerja',
    'cv maker indonesia',
    'format cv standar hrd',
    'resume builder online',
    'cek skor ats cv',
    'download cv pdf a4',
    'curriculum vitae online',
    'cara membuat cv profesional',
    'cv lolos seleksi bumn fhci cpns',
    'aplikasi pembuat cv gratis',
    'cv bahasa inggris dan indonesia',
  ],
  authors: [{ name: 'Tim cvbagus.id', url: siteUrl }],
  creator: 'cvbagus.id',
  publisher: 'cvbagus.id',
  category: 'Career & Employment',
  applicationName: 'cvbagus.id',
  alternates: {
    canonical: '/',
    languages: {
      'id-ID': '/',
      'en-US': '/',
    },
  },
  openGraph: {
    title: 'cvbagus.id - Buat CV ATS Friendly, Translate AI & Surat Lamaran Online',
    description:
      'Bikin CV online standar ATS dalam 5 menit di cvbagus.id. 10+ pilihan templat elegan, AI Translate ke Bahasa Inggris, cek skor ATS otomatis, dan unduh PDF resmi siap kirim ke HRD.',
    url: siteUrl,
    siteName: 'cvbagus.id',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'cvbagus.id - Buat CV ATS Friendly, Translate AI & Surat Lamaran Online',
    description:
      'Bikin CV online ramah ATS dan lolos seleksi HRD dalam hitungan menit di cvbagus.id. AI Translate Bahasa Inggris, cek skor ATS otomatis & unduh PDF instan.',
    creator: '@cvbagusid',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'CxqsNovSo0cyDnq9itUDDGBI1d93SQPavNcKfNpVfT4',
  },
};

// JSON-LD Structured Data for Google Rich Snippets
const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'cvbagus.id',
  alternateName: ['CV Bagus ID', 'cvbagus', 'Pembuat CV ATS Friendly Indonesia'],
  url: siteUrl,
  inLanguage: 'id-ID',
};

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'cvbagus.id',
  url: siteUrl,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'All modern browsers (Windows, MacOS, Android, iOS)',
  browserRequirements: 'Requires JavaScript. Requires HTML5.',
  softwareVersion: '2.5.0',
  description:
    'Platform online pembuat CV ATS Friendly, AI Resume Translator Bahasa Inggris, dan generator surat lamaran kerja standar HRD di cvbagus.id dengan live preview, kalkulator skor ATS otomatis, 10 templat modern, dan unduh PDF instan.',
  featureList: [
    '10+ Templat CV ATS Friendly (Modern, Harvard, Executive, Corporate, Minimalist)',
    'AI Resume Translator 1-Klik ke Bahasa Inggris Eksekutif (Google Gemini AI)',
    'Kalkulator Skor Kesiapan ATS Real-Time (0-100%)',
    'Generator Surat Lamaran Kerja (Cover Letter) Otomatis',
    'Unduh PDF A4 Resolusi Tinggi & Cetak Vektor Tanpa Watermark',
  ],
  offers: {
    '@type': 'Offer',
    price: '25000',
    priceCurrency: 'IDR',
    availability: 'https://schema.org/InStock',
    validFrom: '2026-01-01',
    description: 'Akses penuh 1 tahun semua 10 templat CV, AI Translate, Surat Lamaran, dan unduh PDF tanpa watermark',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '1420',
    bestRating: '5',
    worstRating: '1',
  },
  author: {
    '@type': 'Organization',
    name: 'cvbagus.id',
    url: siteUrl,
  },
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Cara Membuat CV ATS Friendly Online dalam 5 Menit',
  description:
    'Panduan langkah demi langkah membuat Curriculum Vitae (CV) berstandar Applicant Tracking System (ATS) yang lolos seleksi HRD di cvbagus.id.',
  totalTime: 'PT5M',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'IDR',
    value: '25000',
  },
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Isi Data Diri & Pengalaman Kerja',
      text: 'Masukkan informasi kontak, ringkasan profesional, riwayat pengalaman kerja, pendidikan, dan keahlian melalui formulir terstruktur.',
      url: `${siteUrl}/#step-1`,
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Pilih Templat ATS & Optimalkan dengan AI',
      text: 'Pilih dari 10 templat CV standar HRD (seperti Harvard atau Corporate), pantau skor ATS hingga 100%, dan gunakan fitur Translate AI jika melamar dalam Bahasa Inggris.',
      url: `${siteUrl}/template-cv-ats`,
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Unduh Dokumen PDF Standar A4',
      text: 'Unduh CV dan Surat Lamaran Kerja dalam format PDF ukuran A4 resolusi tinggi tanpa watermark yang siap dikirim ke HRD.',
      url: `${siteUrl}/#download`,
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Apa itu CV ATS Friendly dan mengapa sangat penting?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CV ATS Friendly adalah format Curriculum Vitae yang dirancang khusus agar dapat dipindai, diuraikan, dan dinilai secara akurat oleh sistem Applicant Tracking System (ATS) yang digunakan oleh HRD dan perusahaan multinasional. Format ini menggunakan struktur hierarki standar, kata kunci relevan, dan tipografi yang mudah dibaca mesin.',
      },
    },
    {
      '@type': 'Question',
      name: 'Berapa biaya pembuatan dan unduh CV di cvbagus.id?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Anda dapat membuat akun, mengedit form, dan menyusun draf CV secara gratis. Untuk aktivasi akses unduh PDF resolusi tinggi tanpa watermark dan akses ke semua 10 templat profesional selama 1 tahun penuh, biayanya hanya Rp 25.000 sekali bayar tanpa tagihan bulanan otomatis.',
      },
    },
    {
      '@type': 'Question',
      name: 'Apakah CV bisa diterjemahkan ke Bahasa Inggris otomatis dengan AI?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ya! cvbagus.id dilengkapi fitur AI Resume Translator berbasis Google Gemini AI yang menerjemahkan seluruh isi CV Bahasa Indonesia Anda menjadi Bahasa Inggris bisnis tingkat eksekutif standar ATS internasional hanya dalam 1 klik.',
      },
    },
    {
      '@type': 'Question',
      name: 'Apakah tersedia fitur pembuatan Surat Lamaran Kerja (Cover Letter)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tentu saja. Setiap pengguna mendapatkan bonus akses ke pembuat Surat Lamaran Kerja (Cover Letter Generator) otomatis yang terintegrasi dengan data profil CV Anda dan siap diunduh dalam format PDF A4.',
      },
    },
    {
      '@type': 'Question',
      name: 'Apakah CV bisa diunduh dalam format PDF resmi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ya, CV dapat langsung diunduh dalam format dokumen PDF standar cetak ukuran A4 yang rapi, teks dapat disorot (searchable text), dan ramah terhadap sistem verifikasi dokumen lowongan kerja online seperti FHCI BUMN, CPNS, LinkedIn, JobStreet, dan Glints.',
      },
    },
    {
      '@type': 'Question',
      name: 'Apakah tersedia pilihan Bahasa Indonesia dan Bahasa Inggris?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ya, cvbagus.id menyediakan fitur pemilihan bahasa ganda. Anda dapat beralih antara Bahasa Indonesia dan English dengan satu klik, dan judul-judul bagian seperti Pengalaman Kerja (Work Experience) dan Pendidikan (Education) akan menyesuaikan secara otomatis.',
      },
    },
    {
      '@type': 'Question',
      name: 'Bagaimana cara kerja penilaian skor ATS di aplikasi ini?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Fitur ATS Score Checker menganalisis struktur data CV Anda secara real-time, mengevaluasi kelengkapan kontak, kejelasan ringkasan profil, jumlah pengalaman kerja, riwayat pendidikan, dan keahlian spesifik dengan skor persentase 0-100% serta checklist tips perbaikan.',
      },
    },
  ],
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'cvbagus.id',
  url: siteUrl,
  logo: `${siteUrl}/icon`,
  sameAs: [],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* JSON-LD Schemas for Search Engine Optimization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
