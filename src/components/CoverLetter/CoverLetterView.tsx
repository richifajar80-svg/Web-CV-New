'use client';

import React, { useState, useEffect } from 'react';
import { CVData } from '@/types/cv';
import { CoverLetterData, CoverLetterTemplateType } from '@/types/coverLetter';
import {
  COVER_LETTER_PRESETS,
  generateCoverLetterFromCV,
} from '@/data/defaultCoverLetters';
import { exportCVToPDF } from '@/utils/pdfExport';
import {
  FileText,
  Copy,
  Download,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Building,
  User,
  Briefcase,
  ZoomIn,
  ZoomOut,
  CreditCard,
  ArrowRight,
  PenLine,
} from 'lucide-react';

interface CoverLetterViewProps {
  cvData: CVData;
  isSubscriptionActive: boolean;
  onOpenPayment: () => void;
  onSwitchToCV: () => void;
}

export const CoverLetterView: React.FC<CoverLetterViewProps> = ({
  cvData,
  isSubscriptionActive,
  onOpenPayment,
  onSwitchToCV,
}) => {
  const [activePreset, setActivePreset] = useState<CoverLetterTemplateType>('fresh_grad');
  const [letterData, setLetterData] = useState<CoverLetterData>(() =>
    generateCoverLetterFromCV(cvData, 'fresh_grad')
  );

  // Quick inputs
  const [targetCompany, setTargetCompany] = useState(letterData.companyName);
  const [targetJob, setTargetJob] = useState(letterData.jobTitle);
  const [recipient, setRecipient] = useState(letterData.recipientName);
  const [companyCity, setCompanyCity] = useState(letterData.companyAddress);

  // Editor tab inside Cover Letter (Form vs Fine-Tuning)
  const [activeSubTab, setActiveSubTab] = useState<'quick' | 'paragraphs'>('quick');

  // Preview zoom & mobile switcher
  const [zoom, setZoom] = useState(90);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');

  // Export / copy states
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Auto-sync letter details when cvData changes
  useEffect(() => {
    const fontFamilyMap: Record<string, 'font-sans' | 'font-serif' | 'font-mono'> = {
      sans: 'font-sans',
      serif: 'font-serif',
      mono: 'font-mono',
    };

    setLetterData((prev: CoverLetterData) => ({
      ...prev,
      applicantName: cvData.personalInfo?.fullName || prev.applicantName,
      applicantEmail: cvData.personalInfo?.email || prev.applicantEmail,
      applicantPhone: cvData.personalInfo?.phone || prev.applicantPhone,
      applicantAddress: cvData.personalInfo?.location || prev.applicantAddress,
      applicantLinkedIn: cvData.personalInfo?.linkedin || prev.applicantLinkedIn,
      accentColor: cvData.theme?.accentColor || prev.accentColor,
      fontFamily: fontFamilyMap[cvData.theme?.fontFamily || 'sans'] || prev.fontFamily,
    }));
  }, [cvData]);

  // Handle Preset change
  const handleSelectPreset = (presetId: CoverLetterTemplateType) => {
    setActivePreset(presetId);
    const regenerated = generateCoverLetterFromCV(cvData, presetId, {
      companyName: targetCompany,
      jobTitle: targetJob,
      recipientName: recipient,
      companyAddress: companyCity,
    });
    setLetterData(regenerated);
  };

  // Handle Regenerate / Update inputs
  const handleApplyQuickInputs = () => {
    const regenerated = generateCoverLetterFromCV(cvData, activePreset, {
      companyName: targetCompany,
      jobTitle: targetJob,
      recipientName: recipient,
      companyAddress: companyCity,
    });
    setLetterData(regenerated);
  };

  // Sync from CV Button
  const handleSyncFromCV = () => {
    const regenerated = generateCoverLetterFromCV(cvData, activePreset, {
      companyName: targetCompany,
      jobTitle: targetJob,
      recipientName: recipient,
      companyAddress: companyCity,
    });
    setLetterData(regenerated);
  };

  // Copy plain text to clipboard for body email
  const handleCopyPlainText = async () => {
    const plainText = `${letterData.date}

Kepada Yth.
${letterData.recipientName}
${letterData.companyName}
${letterData.companyAddress}

Perihal: ${letterData.subject}

${letterData.salutation}

${letterData.openingParagraph}

${letterData.bodyParagraph1}

${letterData.bodyParagraph2}

${letterData.closingParagraph}

${letterData.signOff}

${letterData.applicantName}
${letterData.applicantPhone} | ${letterData.applicantEmail}
${letterData.applicantLinkedIn ? `${letterData.applicantLinkedIn}` : ''}
`.trim();

    try {
      await navigator.clipboard.writeText(plainText);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 3000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  // Download PDF
  const handleDownloadPDF = async () => {
    if (!isSubscriptionActive) {
      onOpenPayment();
      return;
    }

    setIsExportingPDF(true);
    const safeName = (letterData.applicantName || 'Pelamar').replace(/[^a-zA-Z0-9]/g, '_');
    const safeCompany = (letterData.companyName || 'Perusahaan').replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `Surat_Lamaran_${safeName}_${safeCompany}.pdf`;

    try {
      await exportCVToPDF('cover-letter-paper-document', fileName);
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-100 overflow-hidden relative">
      {/* 1. TOP TOOLBAR */}
      <div className="no-print bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 shrink-0 shadow-xs z-20">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm shrink-0">
            ✉️
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                Generator Surat Lamaran (Cover Letter)
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 hidden sm:inline">
                Standar HRD
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">
              Tersinkron otomatis dari data CV Anda & siap kirim ke email HRD atau unduh PDF
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* 1-Click Copy Body Email */}
          <button
            type="button"
            onClick={handleCopyPlainText}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Salin teks lengkap surat lamaran untuk ditempel langsung ke body email lamaran"
          >
            {copiedNotification ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Salin Body Email</span>
                <span className="sm:hidden">Salin</span>
              </>
            )}
          </button>

          {/* Download PDF Button */}
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isExportingPDF}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer ${
              isSubscriptionActive
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20'
                : 'bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-white'
            }`}
            title="Unduh berkas PDF Surat Lamaran A4"
          >
            {isExportingPDF ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Membuat PDF...</span>
              </>
            ) : isSubscriptionActive ? (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Unduh PDF Surat</span>
              </>
            ) : (
              <>
                <CreditCard className="w-3.5 h-3.5" />
                <span>Unduh PDF (Aktivasi)</span>
              </>
            )}
          </button>

          {/* Mobile view toggle */}
          <div className="flex lg:hidden bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setMobileView('editor')}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                mobileView === 'editor' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Form
            </button>
            <button
              type="button"
              onClick={() => setMobileView('preview')}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                mobileView === 'preview' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Surat
            </button>
          </div>
        </div>
      </div>

      {/* Floating notification when copied */}
      {copiedNotification && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-xs text-white text-xs px-4 py-2 rounded-full shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Teks surat lamaran berhasil disalin! Tinggal tempel (Ctrl+V) ke email lamaran Anda.</span>
        </div>
      )}

      {/* 2. MAIN WORKSPACE (SPLIT VIEW) */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: Controls & Form */}
        <div
          className={`w-full lg:w-[460px] xl:w-[500px] shrink-0 bg-white border-r border-slate-200 flex flex-col h-full z-10 ${
            mobileView === 'preview' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Preset Selector Banner */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Pilih Tipe Lamaran
              </span>
              <button
                type="button"
                onClick={handleSyncFromCV}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline cursor-pointer"
                title="Tarik ulang data nama, keahlian, dan riwayat dari CV"
              >
                <RefreshCw className="w-3 h-3" />
                Tarik Data CV
              </button>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5">
              {COVER_LETTER_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activePreset === preset.id
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-2xs ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{preset.name}</span>
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border ${preset.badgeColor}`}
                    >
                      {preset.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {preset.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex border-b border-slate-200 bg-white px-4 pt-2 gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveSubTab('quick')}
              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'quick'
                  ? 'border-emerald-600 text-emerald-700 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Info Target Posisi</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('paragraphs')}
              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'paragraphs'
                  ? 'border-emerald-600 text-emerald-700 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <PenLine className="w-3.5 h-3.5" />
              <span>Edit Teks Paragraf</span>
            </button>
          </div>

          {/* Form Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeSubTab === 'quick' ? (
              <>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Perusahaan Tujuan
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={targetCompany}
                        onChange={(e) => setTargetCompany(e.target.value)}
                        placeholder="Contoh: PT Bank Central Asia Tbk"
                        className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Posisi yang Dilamar
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={targetJob}
                        onChange={(e) => setTargetJob(e.target.value)}
                        placeholder="Contoh: Management Trainee / Frontend Engineer"
                        className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Penerima Surat (HRD)
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={recipient}
                          onChange={(e) => setRecipient(e.target.value)}
                          placeholder="Bapak/Ibu HRD Manager"
                          className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Kota Perusahaan
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={companyCity}
                          onChange={(e) => setCompanyCity(e.target.value)}
                          placeholder="Jakarta Pusat"
                          className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyQuickInputs}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Perbarui & Susun Kalimat Surat</span>
                  </button>
                </div>

                {/* Auto-filled applicant info reference */}
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Data Pelamar (Dari CV Anda)
                    </span>
                    <button
                      type="button"
                      onClick={onSwitchToCV}
                      className="text-[11px] text-emerald-700 font-semibold hover:underline flex items-center gap-0.5"
                    >
                      <span>Edit CV</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-xs text-slate-700 space-y-1">
                    <p className="font-extrabold text-slate-900">{letterData.applicantName}</p>
                    <p className="text-slate-500">{letterData.applicantEmail} • {letterData.applicantPhone}</p>
                    <p className="text-slate-500">{letterData.applicantAddress}</p>
                  </div>
                </div>
              </>
            ) : (
              /* Fine-tuning Paragraphs */
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Perihal (Subject)
                  </label>
                  <input
                    type="text"
                    value={letterData.subject}
                    onChange={(e) =>
                      setLetterData({ ...letterData, subject: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Paragraf 1: Pembuka & Posisi
                  </label>
                  <textarea
                    rows={3}
                    value={letterData.openingParagraph}
                    onChange={(e) =>
                      setLetterData({ ...letterData, openingParagraph: e.target.value })
                    }
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-normal leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Paragraf 2: Keahlian & Nilai Tambah
                  </label>
                  <textarea
                    rows={4}
                    value={letterData.bodyParagraph1}
                    onChange={(e) =>
                      setLetterData({ ...letterData, bodyParagraph1: e.target.value })
                    }
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-normal leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Paragraf 3: Motivasi & Kecocokan Perusahaan
                  </label>
                  <textarea
                    rows={3}
                    value={letterData.bodyParagraph2}
                    onChange={(e) =>
                      setLetterData({ ...letterData, bodyParagraph2: e.target.value })
                    }
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-normal leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Paragraf 4: Penutup & Harapan Wawancara
                  </label>
                  <textarea
                    rows={3}
                    value={letterData.closingParagraph}
                    onChange={(e) =>
                      setLetterData({ ...letterData, closingParagraph: e.target.value })
                    }
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-normal leading-relaxed"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: A4 Live Canvas Preview */}
        <div
          className={`flex-1 bg-slate-200/80 overflow-y-auto flex flex-col items-center p-4 sm:p-8 relative ${
            mobileView === 'editor' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Zoom controls */}
          <div className="sticky top-2 z-20 self-end bg-white/95 backdrop-blur-xs border border-slate-300 rounded-full px-3 py-1 flex items-center gap-2 shadow-sm text-xs font-bold text-slate-700 mb-4">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(z - 10, 60))}
              className="p-1 hover:text-emerald-700 cursor-pointer"
              title="Perkecil"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center">{zoom}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(z + 10, 130))}
              className="p-1 hover:text-emerald-700 cursor-pointer"
              title="Perbesar"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive editing hint banner */}
          <div className="no-print mb-3 text-xs bg-white/95 backdrop-blur-xs text-slate-700 border border-emerald-200/90 px-4 py-2 rounded-2xl flex items-center gap-2.5 shadow-2xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>
              <strong>Bisa diedit langsung:</strong> Klik kalimat di lembar kertas untuk mengubah teks, atau lewat tab <strong>&quot;Edit Teks Paragraf&quot;</strong> di panel kiri.
            </span>
          </div>

          {/* A4 Paper Document Container */}
          <div
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out',
            }}
            className="mb-12"
          >
            <div
              id="cover-letter-paper-document"
              className={`w-[210mm] min-h-[297mm] bg-white shadow-2xl p-[20mm] sm:p-[25mm] text-slate-800 flex flex-col justify-between ${letterData.fontFamily}`}
              style={{
                boxSizing: 'border-box',
              }}
            >
              {/* LETTERHEAD / KOP SURAT */}
              <div className="border-b-2 pb-5 mb-6" style={{ borderColor: letterData.accentColor }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h1
                      className="text-2xl font-black tracking-tight"
                      style={{ color: letterData.accentColor }}
                    >
                      {letterData.applicantName}
                    </h1>
                    <p className="text-sm font-semibold text-slate-600 mt-0.5">
                      {letterData.applicantTitle}
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-slate-500 space-y-0.5">
                    <p className="flex items-center justify-end gap-1.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {letterData.applicantEmail}
                    </p>
                    <p className="flex items-center justify-end gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {letterData.applicantPhone}
                    </p>
                    <p className="flex items-center justify-end gap-1.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {letterData.applicantAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* DATE & RECIPIENT */}
              <div className="space-y-4 text-xs leading-relaxed">
                <div className="flex justify-between items-baseline">
                  <p className="text-slate-500 font-medium">{letterData.date}</p>
                </div>

                <div className="space-y-0.5 text-slate-800">
                  <p className="font-bold">Kepada Yth.</p>
                  <p className="font-extrabold text-slate-900">{letterData.recipientName}</p>
                  <p className="font-semibold">{letterData.companyName}</p>
                  <p className="text-slate-600">{letterData.companyAddress}</p>
                </div>

                {/* SUBJECT LINE */}
                <div className="pt-2">
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      setLetterData((prev: CoverLetterData) => ({
                        ...prev,
                        subject: e.currentTarget.innerText.trim() || prev.subject,
                      }))
                    }
                    className="font-extrabold text-slate-900 text-sm border-l-4 pl-3 py-0.5 rounded cursor-text hover:bg-emerald-50/40 focus:bg-emerald-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                    style={{ borderColor: letterData.accentColor }}
                    title="Klik langsung untuk mengedit perihal surat"
                  >
                    {letterData.subject}
                  </p>
                </div>

                {/* SALUTATION */}
                <div className="pt-2">
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      setLetterData((prev: CoverLetterData) => ({
                        ...prev,
                        salutation: e.currentTarget.innerText.trim() || prev.salutation,
                      }))
                    }
                    className="font-bold text-slate-900 rounded cursor-text hover:bg-emerald-50/40 focus:bg-emerald-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                    title="Klik langsung untuk mengedit salam pembuka"
                  >
                    {letterData.salutation}
                  </p>
                </div>

                {/* BODY PARAGRAPHS */}
                <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed text-justify">
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      setLetterData((prev: CoverLetterData) => ({
                        ...prev,
                        openingParagraph: e.currentTarget.innerText.trim() || prev.openingParagraph,
                      }))
                    }
                    className="rounded p-1 -m-1 cursor-text hover:bg-emerald-50/40 focus:bg-emerald-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                    title="Klik langsung untuk mengedit paragraf pembuka ini"
                  >
                    {letterData.openingParagraph}
                  </p>
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      setLetterData((prev: CoverLetterData) => ({
                        ...prev,
                        bodyParagraph1: e.currentTarget.innerText.trim() || prev.bodyParagraph1,
                      }))
                    }
                    className="rounded p-1 -m-1 cursor-text hover:bg-emerald-50/40 focus:bg-emerald-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                    title="Klik langsung untuk mengedit paragraf keahlian ini"
                  >
                    {letterData.bodyParagraph1}
                  </p>
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      setLetterData((prev: CoverLetterData) => ({
                        ...prev,
                        bodyParagraph2: e.currentTarget.innerText.trim() || prev.bodyParagraph2,
                      }))
                    }
                    className="rounded p-1 -m-1 cursor-text hover:bg-emerald-50/40 focus:bg-emerald-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                    title="Klik langsung untuk mengedit paragraf motivasi ini"
                  >
                    {letterData.bodyParagraph2}
                  </p>
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      setLetterData((prev: CoverLetterData) => ({
                        ...prev,
                        closingParagraph: e.currentTarget.innerText.trim() || prev.closingParagraph,
                      }))
                    }
                    className="rounded p-1 -m-1 cursor-text hover:bg-emerald-50/40 focus:bg-emerald-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                    title="Klik langsung untuk mengedit paragraf penutup ini"
                  >
                    {letterData.closingParagraph}
                  </p>
                </div>

                {/* SIGN OFF */}
                <div className="pt-6 space-y-12">
                  <p className="font-semibold text-slate-800">{letterData.signOff}</p>
                  <div>
                    <p className="font-black text-slate-900 text-sm underline decoration-slate-400 underline-offset-4">
                      {letterData.applicantName}
                    </p>
                    <p className="text-[11px] text-slate-500">Pelamar / Calon Pegawai</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

