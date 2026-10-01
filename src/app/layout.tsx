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
    default: 'cvbagus.id - Buat CV ATS Friendly & Profesional Online Gratis',
    template: '%s | cvbagus.id',
  },
  description:
    'Bikin CV online ATS-Friendly dan resume profesional standar HRD dalam 5 menit di cvbagus.id. Pilihan 10+ templat modern, kalkulator skor ATS otomatis, bilingual Indonesia-Inggris, dan unduh PDF instan tanpa watermark.',
  keywords: [
    'cvbagus.id',
    'cvbagus',
    'cv bagus',
    'buat cv online',
    'bikin cv online gratis',
    'template cv ats friendly',
    'contoh cv lamaran kerja',
    'cv maker indonesia',
    'format cv standar hrd',
    'resume builder online',
    'cek skor ats cv',
    'download cv pdf',
    'curriculum vitae online',
    'cara membuat cv profesional',
    'cv lolos seleksi bumn swasta',
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
    title: 'cvbagus.id - Buat CV ATS Friendly & Profesional Online Gratis',
    description:
      'Bikin CV online standar ATS dalam 5 menit di cvbagus.id. 10+ pilihan templat elegan, cek skor ATS otomatis, dan unduh PDF resmi siap kirim ke HRD.',
    url: siteUrl,
    siteName: 'cvbagus.id',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'cvbagus.id - Buat CV ATS Friendly & Profesional Online Gratis',
    description:
      'Bikin CV online ramah ATS dan lolos seleksi HRD dalam hitungan menit di cvbagus.id. Cek skor ATS otomatis & unduh PDF instan.',
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
};

// JSON-LD Structured Data for Google Rich Snippets
const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'cvbagus.id',
  url: siteUrl,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'All modern browsers (Windows, MacOS, Android, iOS)',
  browserRequirements: 'Requires JavaScript. Requires HTML5.',
  softwareVersion: '2.0.0',
  description:
    'Platform online pembuat CV ATS Friendly dan resume profesional standar HRD di cvbagus.id dengan live preview, kalkulator skor ATS otomatis, 10 templat modern, dan unduh PDF instan.',
  offers: {
    '@type': 'Offer',
    price: '25000',
    priceCurrency: 'IDR',
    availability: 'https://schema.org/InStock',
    validFrom: '2026-01-01',
    description: 'Akses penuh 1 tahun semua 10 templat CV dan unduh PDF tanpa batas',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '1280',
    bestRating: '5',
    worstRating: '1',
  },
  author: {
    '@type': 'Organization',
    name: 'cvbagus.id',
    url: siteUrl,
  },
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
      name: 'Apakah CV bisa diunduh dalam format PDF resmi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ya, CV dapat langsung diunduh dalam format dokumen PDF standar cetak ukuran A4 yang rapi, teks dapat disorot (searchable text), dan ramah terhadap sistem verifikasi dokumen lowongan kerja online.',
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
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
