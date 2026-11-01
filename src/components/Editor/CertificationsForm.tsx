'use client';

import React from 'react';
import { Certification } from '@/types/cv';
import { Award, Plus, X, Sparkles, ShieldCheck } from 'lucide-react';

interface CertificationsFormProps {
  certifications: Certification[];
  onChange: (certifications: Certification[]) => void;
}

const POPULAR_CERTS = [
  { title: 'Sertifikasi Kompetensi BNSP', issuer: 'Badan Nasional Sertifikasi Profesi' },
  { title: 'TOEFL ITP / IELTS Official', issuer: 'ETS / British Council' },
  { title: 'Ahli K3 Umum (Kemnaker RI)', issuer: 'Kementerian Ketenagakerjaan RI' },
  { title: 'Brevet Pajak Terapan A & B', issuer: 'Ikatan Akuntan Indonesia' },
  { title: 'Google Data Analytics / IT Support', issuer: 'Google Professional' },
  { title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services' },
  { title: 'Microsoft Office Specialist (MOS)', issuer: 'Microsoft / Certiport' },
  { title: 'Digital Marketing Certified', issuer: 'HubSpot Academy' },
];

export const CertificationsForm: React.FC<CertificationsFormProps> = ({
  certifications,
  onChange,
}) => {
  const handleAdd = () => {
    onChange([
      ...certifications,
      {
        id: `cert-${Date.now()}`,
        title: '',
        issuer: '',
        date: new Date().getFullYear().toString(),
      },
    ]);
  };

  const handleAddPreset = (preset: { title: string; issuer: string }) => {
    if (certifications.some((c) => c.title.toLowerCase() === preset.title.toLowerCase())) return;
    onChange([
      ...certifications,
      {
        id: `cert-${Date.now()}-${Math.random()}`,
        title: preset.title,
        issuer: preset.issuer,
        date: new Date().getFullYear().toString(),
      },
    ]);
  };

  const handleUpdate = (idx: number, fields: Partial<Certification>) => {
    const next = [...certifications];
    next[idx] = { ...next[idx], ...fields };
    onChange(next);
  };

  const handleRemove = (idx: number) => {
    onChange(certifications.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Sertifikasi & Lisensi Profesional</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Bukti kredensial resmi, sertifikat profesi, atau pelatihan untuk meningkatkan kepercayaan HRD.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Sertifikasi</span>
        </button>
      </div>

      {/* Popular Presets */}
      <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-3 sm:p-4 space-y-2">
        <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Contoh Sertifikasi Populer (Klik untuk tambah):</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_CERTS.map((preset) => {
            const exists = certifications.some(
              (c) => c.title.toLowerCase() === preset.title.toLowerCase()
            );
            if (exists) return null;
            return (
              <button
                key={preset.title}
                type="button"
                onClick={() => handleAddPreset(preset)}
                className="text-[11px] font-medium px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-lg transition-all cursor-pointer shadow-2xs"
              >
                + {preset.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Certifications List */}
      {certifications.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-600">Belum ada sertifikasi yang ditambahkan</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Opsional: Tambahkan sertifikat jika Anda memilikinya untuk menambah skor ATS.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {certifications.map((cert, idx) => (
            <div
              key={cert.id}
              className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3 relative group hover:border-slate-300 transition-all"
            >
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-3.5 right-3.5 text-slate-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                title="Hapus sertifikasi"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
                <div className="sm:col-span-2">
                  <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Nama Sertifikat / Lisensi
                  </label>
                  <input
                    type="text"
                    spellCheck={false}
                    value={cert.title}
                    onChange={(e) => handleUpdate(idx, { title: e.target.value })}
                    placeholder="Contoh: BNSP Supervisor Ritel, Brevet Pajak A/B..."
                    className="w-full text-xs sm:text-[13px] font-semibold px-3.5 py-2 bg-slate-50/70 border border-slate-300 hover:border-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 rounded-xl text-slate-900 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Tahun Diperoleh
                  </label>
                  <input
                    type="text"
                    spellCheck={false}
                    value={cert.date}
                    onChange={(e) => handleUpdate(idx, { date: e.target.value })}
                    placeholder="Contoh: 2023 atau 2022 - 2025"
                    className="w-full text-xs sm:text-[13px] font-semibold px-3.5 py-2 bg-slate-50/70 border border-slate-300 hover:border-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 rounded-xl text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Lembaga / Institusi Penerbit
                </label>
                <input
                  type="text"
                  spellCheck={false}
                  value={cert.issuer}
                  onChange={(e) => handleUpdate(idx, { issuer: e.target.value })}
                  placeholder="Contoh: BNSP, Google, Microsoft, Kemnaker RI, Coursera..."
                  className="w-full text-xs sm:text-[13px] font-semibold px-3.5 py-2 bg-slate-50/70 border border-slate-300 hover:border-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 rounded-xl text-slate-900 outline-none transition-all"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
