'use client';

import React from 'react';
import { Organization } from '@/types/cv';
import { Users, Plus, X, Building2, Sparkles } from 'lucide-react';

interface OrganizationsFormProps {
  organizations: Organization[];
  onChange: (organizations: Organization[]) => void;
}

const POPULAR_ORG_ROLES = [
  { role: 'Ketua Divisi / Koordinator', name: 'Himpunan Mahasiswa Jurusan' },
  { role: 'Anggota Aktif & Humas', name: 'Badan Eksekutif Mahasiswa (BEM)' },
  { role: 'Panitia Perlengkapan & Logistik', name: 'Kepanitiaan Seminar Nasional' },
  { role: 'Relawan Sosial (Volunteer)', name: 'Komunitas Peduli Lingkungan / PMI' },
];

export const OrganizationsForm: React.FC<OrganizationsFormProps> = ({
  organizations,
  onChange,
}) => {
  const handleAdd = () => {
    onChange([
      ...organizations,
      {
        id: `org-${Date.now()}`,
        role: '',
        name: '',
        startDate: (new Date().getFullYear() - 1).toString(),
        endDate: new Date().getFullYear().toString(),
        current: false,
        description: '',
      },
    ]);
  };

  const handleAddPreset = (preset: { role: string; name: string }) => {
    onChange([
      ...organizations,
      {
        id: `org-${Date.now()}-${Math.random()}`,
        role: preset.role,
        name: preset.name,
        startDate: (new Date().getFullYear() - 1).toString(),
        endDate: new Date().getFullYear().toString(),
        current: false,
        description: '• Mengoordinasikan anggota tim dalam pelaksanaan program kerja tahunan.\n• Mengelola komunikasi antardivisi dan pelaporan hasil kegiatan kepada pembina.',
      },
    ]);
  };

  const handleUpdate = (idx: number, fields: Partial<Organization>) => {
    const next = [...organizations];
    next[idx] = { ...next[idx], ...fields };
    onChange(next);
  };

  const handleRemove = (idx: number) => {
    onChange(organizations.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Pengalaman Organisasi & Kepanitiaan</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Sangat bermanfaat bagi Fresh Graduate atau pelamar untuk menonjolkan kepemimpinan & kerja tim.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Organisasi</span>
        </button>
      </div>

      {/* Quick Add Presets */}
      <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-3 sm:p-4 space-y-2">
        <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Contoh Jabatan Organisasi (Klik untuk tambah cepat):</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_ORG_ROLES.map((preset) => (
            <button
              key={`${preset.role}-${preset.name}`}
              type="button"
              onClick={() => handleAddPreset(preset)}
              className="text-[11px] font-medium px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-lg transition-all cursor-pointer shadow-2xs"
            >
              + {preset.role}
            </button>
          ))}
        </div>
      </div>

      {/* Organizations List */}
      {organizations.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-600">Belum ada pengalaman organisasi yang ditambahkan</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Opsional: Tambahkan BEM, Himpunan, Komunitas, atau Kepanitiaan yang pernah Anda ikuti.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {organizations.map((org, idx) => (
            <div
              key={org.id}
              className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3 relative group hover:border-slate-300 transition-all"
            >
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-3.5 right-3.5 text-slate-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                title="Hapus organisasi"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Posisi / Jabatan
                  </label>
                  <input
                    type="text"
                    spellCheck={false}
                    value={org.role}
                    onChange={(e) => handleUpdate(idx, { role: e.target.value })}
                    placeholder="Contoh: Ketua Divisi Humas, Sekretaris, Anggota..."
                    className="w-full text-xs sm:text-[13px] font-semibold px-3.5 py-2 bg-slate-50/70 border border-slate-300 hover:border-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 rounded-xl text-slate-900 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Nama Organisasi / Komunitas
                  </label>
                  <input
                    type="text"
                    spellCheck={false}
                    value={org.name}
                    onChange={(e) => handleUpdate(idx, { name: e.target.value })}
                    placeholder="Contoh: BEM Universitas, Himpunan Mahasiswa, PMI..."
                    className="w-full text-xs sm:text-[13px] font-semibold px-3.5 py-2 bg-slate-50/70 border border-slate-300 hover:border-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 rounded-xl text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Tahun Mulai
                    </label>
                    <input
                      type="text"
                      spellCheck={false}
                      value={org.startDate}
                      onChange={(e) => handleUpdate(idx, { startDate: e.target.value })}
                      placeholder="Contoh: 2021"
                      className="w-full text-xs sm:text-[13px] font-semibold px-3 py-2 bg-slate-50/70 border border-slate-300 hover:border-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 rounded-xl text-slate-900 outline-none transition-all"
                    />
                  </div>
                  <span className="text-slate-400 text-xs mt-5">-</span>
                  <div className="flex-1">
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Tahun Selesai
                    </label>
                    <input
                      type="text"
                      spellCheck={false}
                      disabled={org.current}
                      value={org.current ? 'Sekarang' : org.endDate}
                      onChange={(e) => handleUpdate(idx, { endDate: e.target.value })}
                      placeholder="Contoh: 2022"
                      className={`w-full text-xs sm:text-[13px] font-semibold px-3 py-2 bg-slate-50/70 border border-slate-300 hover:border-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 rounded-xl text-slate-900 outline-none transition-all ${
                        org.current ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    />
                  </div>
                </div>

                <div className="sm:pt-5">
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(org.current)}
                      onChange={(e) => handleUpdate(idx, { current: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-slate-700">Masih Aktif Saat Ini</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Deskripsi Peran & Pencapaian (Gunakan Bullet Points)
                </label>
                <textarea
                  rows={3}
                  value={org.description || ''}
                  onChange={(e) => handleUpdate(idx, { description: e.target.value })}
                  placeholder="• Memimpin tim beranggotakan 10 orang dalam menyelenggarakan kegiatan amal tahunan&#10;• Menggalang dana sebesar Rp 25 juta melalui kemitraan sponsor eksternal"
                  className="w-full text-xs sm:text-[13px] font-medium p-3 bg-slate-50/70 border border-slate-300 hover:border-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 rounded-xl text-slate-900 outline-none transition-all leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
