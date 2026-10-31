'use client';

import React, { useRef } from 'react';
import { PersonalInfo } from '@/types/cv';
import { User, Mail, Phone, MapPin, Globe, Camera, Upload, Trash2, CheckCircle2, Briefcase } from 'lucide-react';
import { LinkedinIcon } from '@/components/icons/LinkedinIcon';

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (data: Partial<PersonalInfo>) => void;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ data, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process and compress image file to standard sharp A4 dimensions (<100KB base64)
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid (JPG, PNG, atau WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const MAX_DIMENSION = 600;
        let { width, height } = img;

        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          onChange({ photoUrl: compressedDataUrl });
        } else {
          onChange({ photoUrl: event.target?.result as string });
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleRemovePhoto = () => {
    onChange({ photoUrl: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-5">
      <div className="border-b border-slate-200 pb-3.5">
        <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <User className="w-4 h-4" />
          </div>
          <span>Informasi Kontak & Diri</span>
        </h3>
        <p className="text-xs text-slate-600 mt-1">
          Lengkapi data pribadi agar perekrut dapat menghubungi Anda dengan cepat.
        </p>
      </div>

      {/* Crisp Form Container */}
      <div className="p-4 sm:p-5 bg-slate-50/80 border border-slate-200/90 rounded-2xl space-y-4">
        {/* Full Name & Job Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="group">
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
              Nama Lengkap & Gelar <span className="text-emerald-600">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 group-focus-within:text-emerald-600 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                spellCheck={false}
                value={data.fullName}
                onChange={(e) => onChange({ fullName: e.target.value })}
                placeholder="Contoh: Budi Santoso, S.Kom"
                className="w-full text-xs sm:text-[13px] font-semibold pl-10 pr-3.5 py-2.5 bg-white border-2 border-slate-300 hover:border-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 rounded-xl shadow-2xs transition-all text-slate-900 placeholder:text-slate-400 placeholder:font-normal outline-none"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
              Posisi / Judul Pekerjaan <span className="text-emerald-600">*</span>
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-500 group-focus-within:text-emerald-600 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                spellCheck={false}
                value={data.jobTitle}
                onChange={(e) => onChange({ jobTitle: e.target.value })}
                placeholder="Contoh: Senior Full Stack Developer"
                className="w-full text-xs sm:text-[13px] font-semibold pl-10 pr-3.5 py-2.5 bg-white border-2 border-slate-300 hover:border-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 rounded-xl shadow-2xs transition-all text-slate-900 placeholder:text-slate-400 placeholder:font-normal outline-none"
              />
            </div>
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="group">
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
              Alamat Email Aktif <span className="text-emerald-600">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 group-focus-within:text-emerald-600 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                spellCheck={false}
                value={data.email}
                onChange={(e) => onChange({ email: e.target.value })}
                placeholder="budi.santoso@email.com"
                className="w-full text-xs sm:text-[13px] font-semibold pl-10 pr-3.5 py-2.5 bg-white border-2 border-slate-300 hover:border-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 rounded-xl shadow-2xs transition-all text-slate-900 placeholder:text-slate-400 placeholder:font-normal outline-none"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
              Nomor Telepon / WhatsApp <span className="text-emerald-600">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 group-focus-within:text-emerald-600 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                spellCheck={false}
                value={data.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
                placeholder="+62 812 3456 7890"
                className="w-full text-xs sm:text-[13px] font-semibold pl-10 pr-3.5 py-2.5 bg-white border-2 border-slate-300 hover:border-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 rounded-xl shadow-2xs transition-all text-slate-900 placeholder:text-slate-400 placeholder:font-normal outline-none"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="group">
          <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
            Domisili / Lokasi Tempat Tinggal
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-500 group-focus-within:text-emerald-600 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              spellCheck={false}
              value={data.location}
              onChange={(e) => onChange({ location: e.target.value })}
              placeholder="Contoh: Jakarta Selatan, Indonesia"
              className="w-full text-xs sm:text-[13px] font-semibold pl-10 pr-3.5 py-2.5 bg-white border-2 border-slate-300 hover:border-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 rounded-xl shadow-2xs transition-all text-slate-900 placeholder:text-slate-400 placeholder:font-normal outline-none"
            />
          </div>
        </div>

        {/* LinkedIn & Portfolio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="group">
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
              Tautan Profil LinkedIn
            </label>
            <div className="relative">
              <div className="w-4 h-4 text-slate-500 group-focus-within:text-emerald-600 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                <LinkedinIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                spellCheck={false}
                value={data.linkedin || ''}
                onChange={(e) => onChange({ linkedin: e.target.value })}
                placeholder="linkedin.com/in/budisantoso"
                className="w-full text-xs sm:text-[13px] font-semibold pl-10 pr-3.5 py-2.5 bg-white border-2 border-slate-300 hover:border-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 rounded-xl shadow-2xs transition-all text-slate-900 placeholder:text-slate-400 placeholder:font-normal outline-none"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
              Website / Portofolio Pribadi
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-500 group-focus-within:text-emerald-600 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                spellCheck={false}
                value={data.website || ''}
                onChange={(e) => onChange({ website: e.target.value })}
                placeholder="budisantoso.dev"
                className="w-full text-xs sm:text-[13px] font-semibold pl-10 pr-3.5 py-2.5 bg-white border-2 border-slate-300 hover:border-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 rounded-xl shadow-2xs transition-all text-slate-900 placeholder:text-slate-400 placeholder:font-normal outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Direct Photo Upload Card (No Links Required) */}
      <div className="p-4 sm:p-5 bg-white border-2 border-slate-200 rounded-2xl shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-2 cursor-pointer">
            <Camera className="w-4 h-4 text-emerald-600" />
            <span>Tampilkan Pas Foto di CV</span>
          </label>
          <input
            type="checkbox"
            checked={data.showPhoto}
            onChange={(e) => onChange({ showPhoto: e.target.checked })}
            className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
          />
        </div>

        {data.showPhoto && (
          <div className="pt-3 border-t border-slate-100">
            {data.photoUrl ? (
              /* Preview State with Photo Uploaded */
              <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-sm shrink-0 bg-white">
                  <img
                    src={data.photoUrl}
                    alt="Pas Foto CV"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Pas Foto Terpasang</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Foto telah otomatis dioptimasi untuk kualitas cetak A4 tajam & jernih.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="relative overflow-hidden px-3 py-1.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp, image/*"
                      onChange={handleFileUpload}
                      title="Ganti file pas foto"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    <Upload className="w-3.5 h-3.5 text-emerald-600 pointer-events-none" />
                    <span className="pointer-events-none">Ganti Foto</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    title="Hapus foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Upload Dropzone when no photo is uploaded yet */
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="relative border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50/70 rounded-2xl p-5 text-center cursor-pointer transition-all group flex flex-col items-center justify-center gap-2 overflow-hidden select-none"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/*"
                  onChange={handleFileUpload}
                  title="Pilih file pas foto"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-xs group-hover:scale-108 transition-transform pointer-events-none">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="pointer-events-none">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                    Klik untuk Unggah Pas Foto dari Komputer / HP
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Format: JPG, PNG, atau WebP (Bisa Drag & Drop langsung ke sini)
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
