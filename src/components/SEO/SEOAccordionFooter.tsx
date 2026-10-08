'use client';

import React from 'react';
import { HelpCircle, Sparkles, CheckCircle2, ChevronDown } from 'lucide-react';

export const SEOAccordionFooter: React.FC = () => {
  const faqs = [
    {
      q: 'Apa itu CV ATS Friendly dan mengapa sangat penting?',
      a: 'CV ATS Friendly adalah format Curriculum Vitae yang dirancang khusus agar dapat dipindai, diuraikan, dan dinilai secara akurat oleh sistem Applicant Tracking System (ATS) yang digunakan oleh HRD dan perusahaan multinasional. Format ini menggunakan struktur hierarki standar, kata kunci relevan, dan tipografi yang mudah dibaca mesin.',
    },
    {
      q: 'Berapa biaya pembuatan dan unduh CV di cvbagus.id?',
      a: 'Anda dapat membuat akun, mengedit formulir, dan menyusun draf CV secara gratis. Untuk aktivasi akses unduh PDF resolusi tinggi tanpa watermark dan akses ke semua 10 templat profesional selama 1 tahun penuh, biayanya hanya Rp 25.000 sekali bayar tanpa tagihan bulanan otomatis.',
    },
    {
      q: 'Apakah CV bisa diunduh dalam format PDF resmi?',
      a: 'Ya, CV dapat langsung diunduh dalam format dokumen PDF standar cetak ukuran A4 yang rapi, teks dapat disorot (searchable text), dan ramah terhadap sistem verifikasi dokumen lowongan kerja online.',
    },
    {
      q: 'Apakah tersedia pilihan Bahasa Indonesia dan Bahasa Inggris?',
      a: 'Ya, cvbagus.id menyediakan fitur pemilihan bahasa ganda. Anda dapat beralih antara Bahasa Indonesia dan English dengan satu klik, dan judul-judul bagian seperti Pengalaman Kerja (Work Experience) dan Pendidikan (Education) akan menyesuaikan secara otomatis.',
    },
    {
      q: 'Bagaimana cara kerja penilaian skor ATS di aplikasi ini?',
      a: 'Fitur ATS Score Checker menganalisis struktur data CV Anda secara real-time, mengevaluasi kelengkapan kontak, kejelasan ringkasan profil, jumlah pengalaman kerja, riwayat pendidikan, dan keahlian spesifik dengan skor persentase 0-100% serta checklist tips perbaikan.',
    },
  ];

  return (
    <footer className="no-print mt-14 pt-10 border-t border-slate-200/90 text-slate-700 max-w-5xl mx-auto w-full px-2 sm:px-4">
      {/* Top Banner & Overview */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Panduan Lengkap & FAQ Rekrutmen</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Panduan & Pertanyaan Umum Seputar CV ATS Friendly
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Tingkatkan peluang lolos seleksi berkas HRD di BUMN, startup, dan perusahaan multinasional dengan memahami standar evaluasi resume modern.
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-left">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Format Standar HRD Global</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Struktur hierarki kontak, ringkasan profil, pengalaman kerja, dan pendidikan teruji lolos scanner ATS.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>10+ Templat Desain Modern</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Pilihan templat minimalis, korporat, hingga kreatif yang tetap menjaga keterbacaan mesin 100%.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Ekspor PDF Vektor Ultra-HD</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Unduh langsung dokumen PDF ukuran A4 resolusi 300 DPI dengan teks vektor asli yang dapat diseleksi.
          </p>
        </div>
      </div>

      {/* Collapsible FAQ Items (Crawled directly by Googlebot) */}
      <div className="space-y-2 mb-10">
        {faqs.map((faq, idx) => (
          <details
            key={idx}
            className="group bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden transition-all duration-200"
          >
            <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-xs sm:text-sm text-slate-800 select-none hover:text-emerald-700 list-none">
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{faq.q}</span>
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform duration-200 shrink-0" />
            </summary>
            <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
              {faq.a}
            </div>
          </details>
        ))}
      </div>

      {/* Bottom Copyright & Brand Links */}
      <div className="text-center text-[11px] text-slate-400 pb-8 space-y-1">
        <p>© {new Date().getFullYear()} <strong className="text-slate-600">cvbagus.id</strong> — Platform Pembuat CV ATS Friendly & Resume Profesional Indonesia.</p>
        <p>Hak Cipta Dilindungi Undang-Undang. Dirancang untuk membantu para pencari kerja meraih karir impian.</p>
      </div>
    </footer>
  );
};

