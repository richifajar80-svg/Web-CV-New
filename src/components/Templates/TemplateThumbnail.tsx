import React from 'react';
import { TemplateId } from '@/types/cv';

interface TemplateThumbnailProps {
  templateId: TemplateId;
  accentColor?: string;
  className?: string;
}

export const TemplateThumbnail: React.FC<TemplateThumbnailProps> = ({
  templateId,
  accentColor = '#1e40af',
  className = 'h-52 sm:h-60 aspect-[210/297] w-auto mx-auto',
}) => {
  // Renders realistic miniature CV documents with actual legible micro-dummy data (like CVMaker)
  const renderDocument = () => {
    switch (templateId) {
      /* 1. HARVARD (Modern Split: Dark Blue Sidebar + Avatar + Structured Experience) */
      case 'modern':
        return (
          <div className="w-full h-full flex bg-white text-slate-800 text-[6px] leading-[8px] font-sans overflow-hidden select-none">
            {/* Left 35% Sidebar */}
            <div className="w-[36%] bg-slate-800 text-white p-2 flex flex-col items-center gap-1.5 shrink-0">
              <div
                className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white/80 overflow-hidden shrink-0 shadow-xs"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full text-center border-b border-white/20 pb-1">
                <div className="font-bold text-[6px] text-white">JOHN WILLIAMS</div>
                <div className="text-[4.5px] text-white/70">Frontend Engineer</div>
              </div>

              <div className="w-full space-y-1 text-[5px] text-white/80">
                <div className="font-bold text-amber-300 uppercase tracking-wider text-[5px]">Kontak</div>
                <div className="truncate">john@mail.com</div>
                <div>+62 812 3456</div>
                <div>Jakarta, ID</div>
              </div>

              <div className="w-full space-y-1 pt-1 text-[5px] text-white/80">
                <div className="font-bold text-amber-300 uppercase tracking-wider text-[5px]">Keahlian</div>
                <div className="flex flex-wrap gap-0.5">
                  <span className="bg-white/20 px-1 py-0.2 rounded text-[4.5px]">React</span>
                  <span className="bg-white/20 px-1 py-0.2 rounded text-[4.5px]">Next.js</span>
                  <span className="bg-white/20 px-1 py-0.2 rounded text-[4.5px]">Tailwind</span>
                </div>
              </div>
            </div>

            {/* Right 64% Main Content */}
            <div className="flex-1 p-2 space-y-1.5">
              <div className="border-b border-slate-200 pb-1">
                <div className="text-[8px] font-extrabold text-slate-900 tracking-tight">John Williams, S.Kom</div>
                <div className="text-[5.5px] font-semibold text-blue-600">Senior Frontend Developer</div>
              </div>

              <div className="space-y-0.5">
                <div className="font-bold text-[5.5px] uppercase tracking-wider text-slate-700">Profil</div>
                <p className="text-[5px] text-slate-600 leading-[7px] text-justify line-clamp-2">
                  Software engineer berpengalaman 5+ tahun membangun aplikasi web SaaS berkinerja tinggi.
                </p>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-[5.5px] uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-0.5">
                  Pengalaman Kerja
                </div>
                <div>
                  <div className="flex justify-between font-bold text-[5.5px] text-slate-800">
                    <span>Lead Developer</span>
                    <span className="text-[5px] text-slate-400">2022 - Kini</span>
                  </div>
                  <div className="text-[5px] text-slate-500 font-medium">PT Solusi Teknologi</div>
                  <p className="text-[4.5px] text-slate-600 leading-[6.5px] line-clamp-2">
                    • Memimpin tim 6 engineer migrasi sistem ke Next.js.
                    • Meningkatkan kecepatan sistem 40%.
                  </p>
                </div>
                <div>
                  <div className="flex justify-between font-bold text-[5.5px] text-slate-800">
                    <span>Web Developer</span>
                    <span className="text-[5px] text-slate-400">2019 - 2022</span>
                  </div>
                  <div className="text-[5px] text-slate-500 font-medium">Kreasi Digital</div>
                </div>
              </div>

              <div className="space-y-0.5 pt-0.5">
                <div className="font-bold text-[5.5px] uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-0.5">
                  Pendidikan
                </div>
                <div className="flex justify-between font-bold text-[5.5px]">
                  <span>S1 Ilmu Komputer</span>
                  <span className="text-[5px] text-slate-400 font-normal">2019</span>
                </div>
                <div className="text-[5px] text-slate-500">Universitas Indonesia · IPK 3.85</div>
              </div>
            </div>
          </div>
        );

      /* 2. OTAGO (ATS Standard: Clean Single Column with 'CV' Badge Top-Right) */
      case 'ats_classic':
        return (
          <div className="w-full h-full bg-white p-2.5 space-y-1.5 text-slate-900 text-[6px] leading-[8px] font-sans select-none overflow-hidden">
            {/* Header with 'CV' box */}
            <div className="border-b-2 border-slate-900 pb-1 flex justify-between items-start">
              <div>
                <h4 className="text-[9px] font-black uppercase tracking-tight text-slate-900">JOHN WILLIAMS</h4>
                <div className="text-[5.5px] font-bold text-slate-700">Senior Software Engineer</div>
                <div className="text-[4.5px] text-slate-500 mt-0.5">
                  Jakarta, ID · +62 812-3456-7890 · john@mail.com
                </div>
              </div>
              <div className="w-4 h-4 bg-slate-700 text-white font-bold text-[6px] flex items-center justify-center rounded-xs shrink-0">
                CV
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="font-bold text-[5.5px] uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5">
                PROFESSIONAL SUMMARY
              </div>
              <p className="text-[4.8px] text-slate-600 leading-[6.8px] text-justify line-clamp-2">
                Senior Developer dengan keahlian mendalam arsitektur cloud, performa frontend, dan sistem skalabel.
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-[5.5px] uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5">
                WORK EXPERIENCE
              </div>
              <div>
                <div className="flex justify-between font-bold text-[5.5px]">
                  <span>Lead Frontend Engineer — PT Solusi Teknologi</span>
                  <span className="text-[5px] text-slate-500 font-normal">2022 - Present</span>
                </div>
                <p className="text-[4.5px] text-slate-600 leading-[6.5px] pl-1">
                  • Mengoptimalkan Lighthouse score 98/100 untuk 150rb pengguna aktif.
                </p>
              </div>
              <div>
                <div className="flex justify-between font-bold text-[5.5px]">
                  <span>Full Stack Developer — Kreasi Digital</span>
                  <span className="text-[5px] text-slate-500 font-normal">2019 - 2022</span>
                </div>
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="font-bold text-[5.5px] uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5">
                EDUCATION & SKILLS
              </div>
              <div className="flex justify-between text-[5px]">
                <span className="font-bold">S1 Ilmu Komputer, Universitas Indonesia</span>
                <span className="text-slate-500">IPK 3.85</span>
              </div>
              <p className="text-[4.5px] text-slate-600">
                Skills: React, Next.js, TypeScript, PostgreSQL, Node.js, Git.
              </p>
            </div>
          </div>
        );

      /* 3. BERKELEY (Minimalist Clean: Left Photo + Ample Whitespace) */
      case 'minimalist':
        return (
          <div className="w-full h-full bg-white p-2.5 space-y-1.5 text-slate-800 text-[6px] leading-[8px] font-sans select-none overflow-hidden">
            {/* Photo + Name */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
              <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-[8.5px] font-light text-slate-900 leading-tight">
                  <span className="font-extrabold">John</span> Williams
                </h4>
                <div className="text-[5px] font-semibold text-slate-500 uppercase tracking-wider">Frontend Lead</div>
                <div className="text-[4.5px] text-slate-400">jakarta@mail.com · +62 812 3456</div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-1 pt-0.5">
              <div className="col-span-4 text-[5px] font-bold uppercase tracking-wider text-slate-400">Profil</div>
              <div className="col-span-8 text-[4.8px] text-slate-600 leading-[6.5px] line-clamp-2">
                Fokus pada efisiensi rekayasa kode, clean architecture, dan pengalaman pengguna optimal.
              </div>
            </div>

            <div className="grid grid-cols-12 gap-1 border-t border-slate-100 pt-1">
              <div className="col-span-4 text-[5px] font-bold uppercase tracking-wider text-slate-400">Pengalaman</div>
              <div className="col-span-8 space-y-1">
                <div>
                  <div className="flex justify-between font-bold text-[5.5px] text-slate-900">
                    <span>Lead Developer</span>
                    <span className="text-[4.5px] text-slate-400 font-normal">2022 — Kini</span>
                  </div>
                  <div className="text-[4.8px] text-slate-500">PT Solusi Teknologi Nusantara</div>
                </div>
                <div>
                  <div className="flex justify-between font-bold text-[5.5px] text-slate-900">
                    <span>Web Developer</span>
                    <span className="text-[4.5px] text-slate-400 font-normal">2019 — 2022</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-1 border-t border-slate-100 pt-1">
              <div className="col-span-4 text-[5px] font-bold uppercase tracking-wider text-slate-400">Keahlian</div>
              <div className="col-span-8 flex flex-wrap gap-0.5">
                <span className="bg-slate-100 px-1 rounded text-[4.5px]">React</span>
                <span className="bg-slate-100 px-1 rounded text-[4.5px]">TypeScript</span>
                <span className="bg-slate-100 px-1 rounded text-[4.5px]">Next.js</span>
              </div>
            </div>
          </div>
        );

      /* 4. STANFORD (Executive: Solid Color Top Banner + Framed Photo) */
      case 'executive':
        return (
          <div className="w-full h-full bg-white flex flex-col text-slate-800 text-[6px] leading-[8px] font-sans select-none overflow-hidden">
            {/* Top Solid Banner */}
            <div className="p-2 text-white flex justify-between items-center" style={{ backgroundColor: accentColor }}>
              <div>
                <h4 className="text-[8px] font-extrabold tracking-tight">JOHN WILLIAMS</h4>
                <div className="text-[5px] font-medium text-white/90">Senior Tech Lead & Manager</div>
              </div>
              <div className="w-6 h-6 rounded-full overflow-hidden border border-white shadow-xs shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="bg-slate-100 px-2 py-0.5 border-b border-slate-200 text-[4.5px] text-slate-600 flex justify-between">
              <span>john@mail.com</span>
              <span>+62 812 3456 7890</span>
              <span>Jakarta Selatan</span>
            </div>

            <div className="p-2 space-y-1.5 flex-1">
              <div>
                <div className="font-bold text-[5.5px] uppercase tracking-wider border-b pb-0.5" style={{ color: accentColor, borderColor: `${accentColor}30` }}>
                  Executive Profile
                </div>
                <p className="text-[4.8px] text-slate-600 leading-[6.5px] mt-0.5 line-clamp-2">
                  Memimpin strategi transformasi digital dan delivery produk berskala jutaan pengguna.
                </p>
              </div>

              <div>
                <div className="font-bold text-[5.5px] uppercase tracking-wider border-b pb-0.5" style={{ color: accentColor, borderColor: `${accentColor}30` }}>
                  Work Experience
                </div>
                <div className="mt-0.5 space-y-0.5">
                  <div className="flex justify-between font-bold text-[5.5px] text-slate-900">
                    <span>Engineering Lead — PT Solusi</span>
                    <span className="text-[4.5px] text-slate-400 font-normal">2022 - Kini</span>
                  </div>
                  <p className="text-[4.5px] text-slate-600 leading-[6px] line-clamp-1">
                    • Memimpin 12 software engineer dan menyelaraskan roadmap produk.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1 pt-0.5">
                <div>
                  <div className="font-bold text-[5px] uppercase" style={{ color: accentColor }}>Education</div>
                  <div className="text-[4.8px] font-semibold">S1 Ilmu Komputer</div>
                  <div className="text-[4.5px] text-slate-500">Univ. Indonesia (3.85)</div>
                </div>
                <div>
                  <div className="font-bold text-[5px] uppercase" style={{ color: accentColor }}>Core Skills</div>
                  <div className="text-[4.5px] text-slate-600">Agile, React, System Architecture</div>
                </div>
              </div>
            </div>
          </div>
        );

      /* 5. CAMBRIDGE (Timeline: Top Header + Visual Chronological Dots) */
      case 'timeline':
        return (
          <div className="w-full h-full bg-white flex flex-col text-slate-800 text-[6px] leading-[8px] font-sans select-none overflow-hidden">
            {/* Header with Title */}
            <div className="p-2 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h4 className="text-[8px] font-black text-slate-900">JOHN WILLIAMS</h4>
                <div className="text-[5px] font-bold text-teal-700">Full Stack Developer</div>
                <div className="text-[4.5px] text-slate-500">john@mail.com · Jakarta, ID</div>
              </div>
              <div className="w-6 h-6 rounded-md overflow-hidden border border-teal-600 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="p-2 flex gap-2 flex-1">
              {/* Left Timeline (65%) */}
              <div className="w-[68%] space-y-1">
                <div className="font-bold text-[5.5px] uppercase tracking-wider text-teal-800 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-teal-600" />
                  Alur Karier
                </div>

                <div className="border-l border-teal-400 pl-2 space-y-1.5 ml-0.5">
                  <div className="relative">
                    <div className="absolute -left-[10px] top-0.5 w-1.5 h-1.5 rounded-full bg-white border border-teal-600" />
                    <div className="font-bold text-[5.5px] text-slate-900">Lead Frontend Engineer</div>
                    <div className="text-[4.5px] text-teal-700">PT Solusi Teknologi · 2022 - Kini</div>
                    <p className="text-[4.5px] text-slate-500 line-clamp-1">• Arsitektur sistem skalabel.</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[10px] top-0.5 w-1.5 h-1.5 rounded-full bg-white border border-teal-600" />
                    <div className="font-bold text-[5.5px] text-slate-900">Web Developer</div>
                    <div className="text-[4.5px] text-teal-700">Kreasi Digital · 2019 - 2022</div>
                  </div>
                </div>
              </div>

              {/* Right Skills/Edu (32%) */}
              <div className="w-[32%] border-l border-slate-100 pl-1.5 space-y-1 text-[5px]">
                <div className="font-bold text-teal-800 uppercase">Pendidikan</div>
                <div>
                  <div className="font-bold">S1 Komputer</div>
                  <div className="text-slate-500">UI (2019)</div>
                </div>

                <div className="font-bold text-teal-800 uppercase pt-0.5">Keahlian</div>
                <div className="space-y-0.5">
                  <div className="bg-slate-100 px-1 rounded text-[4.5px]">React & Next</div>
                  <div className="bg-slate-100 px-1 rounded text-[4.5px]">TypeScript</div>
                  <div className="bg-slate-100 px-1 rounded text-[4.5px]">PostgreSQL</div>
                </div>
              </div>
            </div>
          </div>
        );

      /* 6. OXFORD (Corporate Classic: Framed Table Structure) */
      case 'corporate':
        return (
          <div className="w-full h-full bg-white p-2 space-y-1 text-slate-900 text-[6px] leading-[8px] font-sans border-t-2 border-slate-800 select-none overflow-hidden">
            <div className="flex justify-between items-center border-b pb-1">
              <div>
                <h4 className="text-[8px] font-extrabold uppercase">JOHN WILLIAMS</h4>
                <div className="text-[5px] font-bold text-slate-700">CURRICULUM VITAE</div>
              </div>
              <div className="text-[4.5px] text-right text-slate-500">
                <div>john@mail.com</div>
                <div>+62 812-3456-7890</div>
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="bg-slate-100 px-1 py-0.5 font-bold text-[5px] uppercase">Ringkasan Eksekutif</div>
              <p className="text-[4.5px] text-slate-600 leading-[6.5px] px-0.5 line-clamp-2">
                Profesional dengan pengalaman memimpin proyek teknologi berskala enterprise dan regulasi perbankan.
              </p>
            </div>

            <div className="space-y-0.5">
              <div className="bg-slate-100 px-1 py-0.5 font-bold text-[5px] uppercase">Riwayat Profesional</div>
              <div className="px-0.5 space-y-0.5">
                <div className="flex justify-between font-bold text-[5px]">
                  <span>Lead Engineer — PT Solusi</span>
                  <span className="font-normal text-slate-400">2022 - Kini</span>
                </div>
                <p className="text-[4.5px] text-slate-500 line-clamp-1">• Mengelola pipeline CI/CD dan stabilitas SLA 99.9%.</p>
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="bg-slate-100 px-1 py-0.5 font-bold text-[5px] uppercase">Pendidikan & Sertifikasi</div>
              <div className="px-0.5 text-[4.8px]">
                <div className="font-semibold">S1 Ilmu Komputer, Universitas Indonesia (IPK 3.85)</div>
                <div className="text-slate-500">AWS Certified Solutions Architect (2023)</div>
              </div>
            </div>
          </div>
        );

      /* 7. EDINBURGH (Harvard Academic: Centered Serif & Double Line) */
      case 'academic':
        return (
          <div className="w-full h-full bg-white p-2.5 space-y-1.5 text-center font-serif text-slate-900 text-[6px] leading-[8px] select-none overflow-hidden">
            <div className="border-b-2 border-slate-900 pb-1 space-y-0.5">
              <h4 className="text-[8.5px] font-extrabold uppercase tracking-wide">JOHN WILLIAMS, S.Kom</h4>
              <div className="text-[5px] uppercase tracking-widest text-slate-700">Akademisi & Peneliti Teknologi</div>
              <div className="text-[4.5px] font-sans text-slate-500">Jakarta · john.williams@mail.ac.id</div>
            </div>

            <div className="text-left space-y-1">
              <div>
                <div className="font-bold text-[5.5px] uppercase tracking-wider border-b border-slate-300 pb-0.5">
                  Pendidikan Tinggi
                </div>
                <div className="text-[5px] mt-0.5">
                  <div className="font-bold">Sarjana Ilmu Komputer — Universitas Indonesia</div>
                  <div className="italic text-slate-600">Predikat Cum Laude (IPK 3.85) · 2015 - 2019</div>
                </div>
              </div>

              <div>
                <div className="font-bold text-[5.5px] uppercase tracking-wider border-b border-slate-300 pb-0.5">
                  Pengalaman Riset & Industri
                </div>
                <div className="text-[5px] mt-0.5">
                  <div className="font-bold">Lead Software Engineer — PT Solusi (2022 - Kini)</div>
                  <p className="text-[4.5px] text-slate-600 indent-2 leading-[6.5px] line-clamp-2">
                    Menerapkan riset algoritma terdistribusi untuk optimalisasi kecepatan transmisi data.
                  </p>
                </div>
              </div>

              <div>
                <div className="font-bold text-[5.5px] uppercase tracking-wider border-b border-slate-300 pb-0.5">
                  Keahlian Keilmuan
                </div>
                <p className="text-[4.5px] text-slate-700 mt-0.5">
                  Distributed Systems, Cloud Architecture, Algorithm Analysis, React, Node.js.
                </p>
              </div>
            </div>
          </div>
        );

      /* 8. AUCKLAND (Compact 1-Page: Dense Balanced Grid) */
      case 'compact':
        return (
          <div className="w-full h-full bg-white p-2 space-y-1 text-slate-800 text-[5.5px] leading-[7.5px] font-sans select-none overflow-hidden">
            <div className="flex justify-between border-b pb-1 border-blue-600">
              <div>
                <h4 className="text-[8px] font-black">JOHN WILLIAMS</h4>
                <div className="text-[5px] font-bold text-blue-700">Senior Full Stack Web Developer</div>
              </div>
              <div className="text-[4.5px] text-right text-slate-500">
                <div>john@mail.com</div>
                <div>+62 812 3456</div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-1.5 pt-0.5">
              <div className="col-span-7 space-y-1 border-r border-slate-100 pr-1">
                <div className="font-bold text-[5px] uppercase text-blue-700 border-b pb-0.5">Pengalaman Kerja</div>
                <div>
                  <div className="font-bold text-[5px]">Lead Frontend Dev</div>
                  <div className="text-[4.5px] text-slate-500">PT Solusi (2022-Kini)</div>
                  <p className="text-[4.2px] text-slate-600 leading-[5.5px] line-clamp-2">
                    • Memimpin 6 developer & optimasi sistem.
                  </p>
                </div>
                <div>
                  <div className="font-bold text-[5px]">Web Developer</div>
                  <div className="text-[4.5px] text-slate-500">Kreasi Digital (2019-2022)</div>
                </div>
              </div>

              <div className="col-span-5 space-y-1 pl-0.5">
                <div className="font-bold text-[5px] uppercase text-blue-700 border-b pb-0.5">Pendidikan</div>
                <div className="text-[4.5px]">S1 Komputer - UI (3.85)</div>

                <div className="font-bold text-[5px] uppercase text-blue-700 border-b pb-0.5 pt-0.5">Keahlian</div>
                <div className="flex flex-wrap gap-0.5">
                  <span className="bg-slate-100 px-1 rounded text-[4px]">React</span>
                  <span className="bg-slate-100 px-1 rounded text-[4px]">Next.js</span>
                  <span className="bg-slate-100 px-1 rounded text-[4px]">TypeScript</span>
                  <span className="bg-slate-100 px-1 rounded text-[4px]">Node.js</span>
                </div>
              </div>
            </div>
          </div>
        );

      /* 9. PRINCETON (Creative Agency: Dark Pill Header + Modern Cards) */
      case 'creative':
        return (
          <div className="w-full h-full bg-white p-2 space-y-1.5 text-slate-800 text-[6px] leading-[8px] font-sans select-none overflow-hidden">
            <div className="bg-slate-900 text-white p-2 rounded-xl flex justify-between items-center">
              <div>
                <div className="text-[4.5px] font-bold text-amber-300 uppercase tracking-widest">Portofolio & CV</div>
                <h4 className="text-[8px] font-black">JOHN WILLIAMS</h4>
                <div className="text-[5px] text-white/80">Creative Developer</div>
              </div>
              <div className="w-6 h-6 rounded-lg overflow-hidden border border-white/40 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="font-bold text-[5.5px] text-purple-700 uppercase">Pengalaman Utama</div>
              <div className="p-1 bg-purple-50/60 rounded-lg border border-purple-100">
                <div className="flex justify-between font-bold text-[5px]">
                  <span>Lead Frontend Dev</span>
                  <span className="text-[4.5px] text-purple-700 font-semibold">2022 - Kini</span>
                </div>
                <div className="text-[4.5px] text-slate-500">PT Solusi Teknologi</div>
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="font-bold text-[5.5px] text-purple-700 uppercase">Keahlian & Tools</div>
              <div className="flex flex-wrap gap-0.5">
                <span className="bg-slate-100 px-1 py-0.2 rounded-full text-[4.5px]">UI/UX Design</span>
                <span className="bg-slate-100 px-1 py-0.2 rounded-full text-[4.5px]">Tailwind CSS</span>
                <span className="bg-slate-100 px-1 py-0.2 rounded-full text-[4.5px]">React.js</span>
              </div>
            </div>
          </div>
        );

      /* 10. MICHIGAN (Accent Stripe: Left Color Stripe) */
      case 'stripe':
      default:
        return (
          <div className="w-full h-full bg-white flex text-slate-800 text-[6px] leading-[8px] font-sans select-none overflow-hidden">
            <div className="w-2 shrink-0 bg-sky-600" />
            <div className="flex-1 p-2 space-y-1.5">
              <div className="flex justify-between items-start border-b border-sky-200 pb-1">
                <div>
                  <h4 className="text-[8.5px] font-black text-slate-900">JOHN WILLIAMS</h4>
                  <div className="text-[5px] font-bold text-sky-700">Senior Web Developer</div>
                  <div className="text-[4.5px] text-slate-500">john@mail.com · +62 812 3456</div>
                </div>
                <div className="w-6 h-6 rounded-full overflow-hidden border border-sky-400 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="font-bold text-[5.5px] text-sky-800 uppercase">Pengalaman Kerja</div>
                <div>
                  <div className="flex justify-between font-bold text-[5px]">
                    <span>Lead Developer</span>
                    <span className="text-[4.5px] text-slate-400 font-normal">2022 - Kini</span>
                  </div>
                  <div className="text-[4.5px] text-slate-500">PT Solusi Teknologi</div>
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="font-bold text-[5.5px] text-sky-800 uppercase">Pendidikan & Skill</div>
                <div className="text-[4.8px]">S1 Ilmu Komputer - UI (IPK 3.85)</div>
                <div className="text-[4.5px] text-slate-500">Skills: React, Next.js, TypeScript, Node.js</div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={`rounded-lg overflow-hidden border border-slate-300 shadow-sm bg-white transition-all group-hover:shadow-lg group-hover:border-emerald-500 shrink-0 ${className}`}
    >
      {renderDocument()}
    </div>
  );
};
