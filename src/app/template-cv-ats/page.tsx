import type { Metadata } from 'next';
import Link from 'next/link';
import { TEMPLATE_LIST } from '@/data/templates';
import {
  LayoutTemplate,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  BookOpen,
  FileText,
} from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cvbagusid.vercel.app';

export const metadata: Metadata = {
  title: '10+ Template CV ATS Friendly Terbaik 2026 (Standar HRD, BUMN & Startup)',
  description:
    'Katalog lengkap 10+ template CV ATS Friendly modern dan profesional di cvbagus.id: Harvard, Cambridge, Berkeley, Otago, Stanford, dan Oxford. Teruji lolos sistem Applicant Tracking System (ATS) HRD BUMN, CPNS, dan multinasional.',
  alternates: {
    canonical: '/template-cv-ats',
  },
  openGraph: {
    title: '10+ Template CV ATS Friendly Terbaik 2026 | cvbagus.id',
    description:
      'Pilih dari 10+ desain template CV ATS Friendly berstandar HRD global. Dilengkapi fitur Translate AI Bahasa Inggris & unduh PDF A4 tanpa watermark.',
    url: `${siteUrl}/template-cv-ats`,
    type: 'website',
  },
};

export default function TemplateCVATSPage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Katalog 10+ Template CV ATS Friendly Terbaik 2026',
    description:
      'Daftar templat Curriculum Vitae (CV) berstandar Applicant Tracking System (ATS) untuk melamar kerja di BUMN, perusahaan swasta, startup, dan multinasional.',
    numberOfItems: TEMPLATE_LIST.length,
    itemListElement: TEMPLATE_LIST.map((tpl, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: `Template CV ${tpl.name} (${tpl.category})`,
      description: tpl.description,
      url: `${siteUrl}/#template-${tpl.id}`,
    })),
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
        name: 'Template CV ATS Friendly',
        item: `${siteUrl}/template-cv-ats`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Top Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
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
              href="/panduan-cv-ats"
              className="text-xs font-bold text-slate-600 hover:text-emerald-700 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Panduan CV ATS</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow-xs transition-all"
            >
              <span>Buka Editor CV</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 space-y-14">
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <LayoutTemplate className="w-3.5 h-3.5 text-emerald-600" />
            <span>Katalog Resmi Standar HRD 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            10+ Template CV ATS Friendly Terbaik untuk Melamar Kerja
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Seluruh templat di <strong>cvbagus.id</strong> dirancang menggunakan hierarki tipografi standar internasional agar 100% terbaca oleh mesin pemindai <em>Applicant Tracking System (ATS)</em> di perusahaan BUMN, perbankan, startup teknologi, maupun korporasi multinasional.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md shadow-emerald-600/20 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Coba Semua Template Sekarang</span>
            </Link>
            <Link
              href="/panduan-cv-ats"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-slate-200 transition-all"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Baca Tips Lolos Seleksi ATS</span>
            </Link>
          </div>
        </section>

        {/* Template Grid */}
        <section aria-labelledby="daftar-template-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <h2 id="daftar-template-heading" className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Daftar Pilihan Desain & Karakteristik Template CV
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Anda bebas mengganti templat kapan saja dalam 1 klik tanpa perlu mengetik ulang isi CV.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
              10 Desain Terverifikasi ATS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEMPLATE_LIST.map((tpl, idx) => (
              <article
                key={tpl.id}
                id={`template-${tpl.id}`}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      #{idx + 1} • {tpl.category}
                    </span>
                    {tpl.badge && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {tpl.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900">
                    Template CV {tpl.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tpl.description}
                  </p>

                  <ul className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Struktur Heading & Bullet ramah mesin parser ATS</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Mendukung Bahasa Indonesia & Translate AI Inggris</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Ukuran kertas standar A4 (210 × 297 mm) siap cetak</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2">
                  <Link
                    href="/"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white font-bold text-xs border border-emerald-200 hover:border-emerald-600 transition-all"
                  >
                    <span>Gunakan Template {tpl.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Comparison Guide by Industry */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Panduan Memilih Template CV Sesuai Bidang Pekerjaan
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Setiap industri memiliki preferensi visual yang berbeda saat HRD melakukan screening dokumen. Berikut rekomendasi pemilihan templat CV terbaik:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h3 className="font-bold text-sm text-slate-900">
                1. Rekrutmen Bersama BUMN (FHCI), CPNS & Perbankan
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Gunakan templat <strong>Otago (ATS Classic)</strong>, <strong>Oxford (Corporate)</strong>, atau <strong>Stanford (Executive)</strong>. Ketiga templat ini menonjolkan kerapian formal satu kolom dengan kontras teks tinggi yang sangat disukai tim rekrutmen instansi negara dan finansial.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h3 className="font-bold text-sm text-slate-900">
                2. Startup Teknologi, Software Engineering & Product
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Pilih templat <strong>Cambridge (Timeline)</strong>, <strong>Berkeley (Minimalist)</strong>, atau <strong>Auckland (Compact)</strong>. Tata letaknya memudahkan Engineering Manager dan Tech Recruiter memindai keahlian teknis (Tech Stack) dan metrik pencapaian proyek dalam hitungan detik.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h3 className="font-bold text-sm text-slate-900">
                3. Fresh Graduate, Magang (Internship) & Management Trainee
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Templat <strong>Harvard (Modern)</strong> dan <strong>Berkeley (Minimalist)</strong> sangat ideal untuk menonjolkan kombinasi pendidikan, IPK, sertifikasi kursus, serta pengalaman organisasi kampus secara proporsional.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h3 className="font-bold text-sm text-slate-900">
                4. Akademisi, Dosen, Medis & Riset Ilmiah
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Gunakan templat <strong>Edinburgh (Academic)</strong> dengan kombinasi gaya huruf <em>Serif</em>. Memberikan kesan kredibel untuk mencantumkan publikasi, riwayat pendidikan lanjut, dan lisensi profesi.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-gradient-to-r from-emerald-700 to-teal-700 rounded-3xl p-8 sm:p-10 text-center text-white space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
            <span>Akses Penuh 1 Tahun Hanya Rp 25.000</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            Susun CV ATS Friendly Anda Sekarang
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto">
            Gratis mencoba formulir, menghitung skor ATS, dan melihat live preview di seluruh 10 templat CV.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition-all"
            >
              <span>Mulai Buat CV Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 text-center text-xs border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} cvbagus.id — Platform Pembuat CV ATS Friendly Indonesia.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-white transition-colors">Beranda Editor</Link>
            <Link href="/template-cv-ats" className="text-emerald-400 font-semibold">Template CV ATS</Link>
            <Link href="/panduan-cv-ats" className="hover:text-white transition-colors">Panduan CV & Surat Lamaran</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

