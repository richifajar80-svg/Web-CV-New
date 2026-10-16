import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  FileText,
  LayoutTemplate,
  Award,
  TrendingUp,
} from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cvbagus.id';

export const metadata: Metadata = {
  title: 'Panduan Cara Membuat CV ATS Friendly & Surat Lamaran Kerja Lolos HRD 2026',
  description:
    'Pelajari cara membuat CV ATS Friendly dan Surat Lamaran Kerja (Cover Letter) yang lolos screening HRD BUMN, CPNS, dan perusahaan multinasional. Lengkap dengan daftar kata kerja aksi (action verbs) Indonesia-Inggris dan checklist skor ATS 100%.',
  alternates: {
    canonical: '/panduan-cv-ats',
  },
  openGraph: {
    title: 'Panduan Cara Membuat CV ATS Friendly & Surat Lamaran Kerja Lolos HRD 2026',
    description:
      'Tips dan rumus menyusun CV ATS Friendly beserta contoh deskripsi pengalaman kerja berorientasi metrik agar lolos seleksi HRD.',
    url: `${siteUrl}/panduan-cv-ats`,
    type: 'article',
  },
};

export default function PanduanCVATSPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Panduan Lengkap Cara Membuat CV ATS Friendly & Surat Lamaran Kerja Lolos Seleksi HRD 2026',
    description:
      'Panduan komprehensif menyusun Curriculum Vitae (CV) berstandar Applicant Tracking System (ATS), pemilihan kata kunci, rumusan Action Verbs, dan pembuatan Surat Lamaran Kerja profesional.',
    author: {
      '@type': 'Organization',
      name: 'Tim Karir cvbagus.id',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'cvbagus.id',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/icon`,
      },
    },
    datePublished: '2026-01-15',
    dateModified: '2026-10-16',
    mainEntityOfPage: `${siteUrl}/panduan-cv-ats`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda cvbagus.id',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Panduan Cara Membuat CV ATS',
        item: `${siteUrl}/panduan-cv-ats`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Top Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
              CB
            </div>
            <span className="font-extrabold text-slate-900 text-lg tracking-tight">
              cvbagus<span className="text-emerald-600">.id</span>
            </span>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/template-cv-ats"
              className="text-xs font-bold text-slate-600 hover:text-emerald-700 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <LayoutTemplate className="w-3.5 h-3.5 text-emerald-600" />
              <span>10+ Template CV</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow-xs transition-all"
            >
              <span>Buat CV Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Article Header */}
        <header className="space-y-4 border-b border-slate-200 pb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Panduan Karir & Rekrutmen HRD</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Panduan Lengkap Cara Membuat CV ATS Friendly & Surat Lamaran Kerja Lolos Seleksi HRD
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Lebih dari 75% perusahaan menengah ke atas, BUMN, dan multinasional di Indonesia kini menggunakan perangkat lunak <strong>Applicant Tracking System (ATS)</strong> untuk menyaring ribuan dokumen pelamar kerja secara otomatis. Pelajari cara mengoptimalkan struktur, kata kunci, dan metrik pencapaian pada CV Anda.
          </p>
        </header>

        {/* Section 1: Checklist 7 Elemen Wajib */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              1. Tujuh Elemen Wajib agar Skor CV ATS Mencapai 100%
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Mesin parser ATS mengekstrak teks dari dokumen PDF Anda ke dalam profil digital kandidat. Pastikan ketujuh bagian berikut terisi lengkap:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {[
              {
                title: '1. Judul Posisi (Target Job Title)',
                desc: 'Cantumkan posisi yang Anda lamar tepat di bawah nama lengkap (contoh: "Senior Accounting Staff" atau "Full Stack Developer").',
              },
              {
                title: '2. Informasi Kontak Standar',
                desc: 'Sertakan alamat email profesional, nomor telepon/WhatsApp aktif, domisili kota, serta tautan profil LinkedIn atau portofolio.',
              },
              {
                title: '3. Ringkasan Profesional (2–4 Kalimat)',
                desc: 'Ringkas total tahun pengalaman, spesialisasi utama, dan dampak terbesar yang pernah Anda capai dalam 30–60 kata.',
              },
              {
                title: '4. Pengalaman Kerja Berbasis Metrik',
                desc: 'Tulis riwayat kerja dari yang terbaru (reverse-chronological) menggunakan poin bullet yang menyertakan angka atau persentase hasil.',
              },
              {
                title: '5. Pendidikan & Kualifikasi Akademik',
                desc: 'Cantumkan gelar pendidikan, nama universitas/institusi, tahun kelulusan, serta IPK jika di atas 3.00.',
              },
              {
                title: '6. Kata Kunci Keahlian (Hard & Soft Skills)',
                desc: 'Sesuaikan daftar keahlian teknis (contoh: SAP, Microsoft Excel, React, Pajak Brevet) dengan persyaratan di iklan lowongan kerja.',
              },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Action Verbs */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              2. Rumus Menulis Pengalaman Kerja & Daftar Kata Kerja Aksi (Action Verbs)
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Hindari menulis deskripsi pekerjaan yang pasif. Gunakan rumus <strong>Kata Kerja Aksi + Tugas/Proyek + Hasil Terukur (Angka/%)</strong>. Jika Anda menggunakan fitur <strong>Translate AI (Google Gemini)</strong> di cvbagus.id, kalimat Bahasa Indonesia Anda akan otomatis ditingkatkan menjadi kata kerja eksekutif Bahasa Inggris:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100 text-slate-800 font-bold">
                  <th className="p-3 rounded-tl-xl">Kategori</th>
                  <th className="p-3">Bahasa Indonesia (Standar HRD)</th>
                  <th className="p-3 rounded-tr-xl">Bahasa Inggris (ATS Executive Verbs)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-600">
                <tr>
                  <td className="p-3 font-bold text-slate-800">Kepemimpinan</td>
                  <td className="p-3">Memimpin, Mengkoordinasikan, Mengarahkan, Mengelola</td>
                  <td className="p-3 font-medium text-emerald-800">Spearheaded, Orchestrated, Directed, Chaired</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-800">Peningkatan Kinerja</td>
                  <td className="p-3">Meningkatkan, Mengoptimalkan, Mempercepat, Menghemat</td>
                  <td className="p-3 font-medium text-emerald-800">Accelerated, Streamlined, Maximized, Reduced</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-800">Teknis & Pembangunan</td>
                  <td className="p-3">Mengembangkan, Merancang, Membangun, Mengintegrasikan</td>
                  <td className="p-3 font-medium text-emerald-800">Engineered, Architected, Deployed, Integrated</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-800">Analisis & Riset</td>
                  <td className="p-3">Menganalisis, Mengevaluasi, Mengidentifikasi, Memetakan</td>
                  <td className="p-3 font-medium text-emerald-800">Analyzed, Evaluated, Audited, Forecasted</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Cover Letter */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              3. Menyertakan Surat Lamaran Kerja (Cover Letter) yang Meyakinkan
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Selain CV ATS Friendly, menyertakan <strong>Surat Lamaran Kerja (Cover Letter)</strong> yang dipersonalisasi untuk perusahaan tujuan dapat meningkatkan peluang panggilan interview hingga 40%. Di <strong>cvbagus.id</strong>, Anda dapat beralih ke tab <em>Surat Lamaran (Bonus)</em> untuk menghasilkan surat lamaran kerja resmi secara instan dalam Bahasa Indonesia maupun Bahasa Inggris.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Buat CV & Surat Lamaran Sekarang</span>
            </Link>
            <Link
              href="/template-cv-ats"
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>Lihat 10+ Template CV ATS</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 text-center text-xs border-t border-slate-800">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} cvbagus.id — Platform Pembuat CV ATS Friendly Indonesia.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-white transition-colors">Beranda Editor</Link>
            <Link href="/template-cv-ats" className="hover:text-white transition-colors">Template CV ATS</Link>
            <Link href="/panduan-cv-ats" className="text-emerald-400 font-semibold">Panduan CV & Surat Lamaran</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
