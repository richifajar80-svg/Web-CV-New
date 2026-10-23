'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CVData } from '@/types/cv';
import { CoverLetterData, CoverLetterTemplateType } from '@/types/coverLetter';
import {
  COVER_LETTER_PRESETS,
  generateCoverLetterFromCV,
} from '@/data/defaultCoverLetters';
import { exportCVToPDF } from '@/utils/pdfExport';
import { getUserAuthHeaders } from '@/context/AuthContext';
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
  MessageCircle,
  Send,
  ExternalLink,
  Loader2,
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
  const [jobRequirements, setJobRequirements] = useState('');
  const [hrdWhatsappNumber, setHrdWhatsappNumber] = useState('');
  const [hrdEmailAddress, setHrdEmailAddress] = useState('');

  // Left panel sub-tab (Form vs Fine-Tuning)
  const [activeSubTab, setActiveSubTab] = useState<'quick' | 'paragraphs'>('quick');

  // Right panel output channel: WhatsApp | Email | A4 PDF Letter
  const [outputChannel, setOutputChannel] = useState<'whatsapp' | 'email' | 'letter'>('whatsapp');

  // Preview zoom & mobile switcher
  const [zoom, setZoom] = useState(90);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('preview');
  const docRef = useRef<HTMLDivElement>(null);
  const [docHeight, setDocHeight] = useState<number>(1123);

  // AI Generation state
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Export / copy states
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const calculateFitZoom = () => {
    if (typeof window === 'undefined') return 90;
    const w = window.innerWidth;
    if (w < 640) {
      const available = Math.max(280, w - 32);
      return Math.min(100, Math.max(35, Math.floor((available / 794) * 100)));
    } else if (w < 1024) {
      return 65;
    } else if (w < 1280) {
      return 75;
    } else if (w < 1536) {
      return 85;
    }
    return 90;
  };

  useEffect(() => {
    setZoom(calculateFitZoom());
  }, [mobileView, outputChannel]);

  useEffect(() => {
    if (!docRef.current) return;
    const updateHeight = () => {
      if (docRef.current) {
        const height = docRef.current.offsetHeight;
        if (height > 0) {
          setDocHeight(Math.max(1123, height));
        }
      }
    };
    updateHeight();
    const observer = new ResizeObserver(() => {
      updateHeight();
    });
    observer.observe(docRef.current);
    return () => observer.disconnect();
  }, [letterData, outputChannel]);

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

  const showCopyFeedback = (label: string) => {
    setCopiedType(label);
    setTimeout(() => setCopiedType(null), 3000);
  };

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

  // Handle Regenerate / Update inputs (Instant without AI quota)
  const handleApplyQuickInputs = () => {
    setAiError(null);
    const regenerated = generateCoverLetterFromCV(cvData, activePreset, {
      companyName: targetCompany,
      jobTitle: targetJob,
      recipientName: recipient,
      companyAddress: companyCity,
    });
    setLetterData(regenerated);
    showCopyFeedback('Kalimat berhasil diperbarui dari data CV Anda!');
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setMobileView('preview');
    }
  };

  // Generate Personalized Kit with Gemini AI
  const handleGenerateWithAI = async () => {
    setIsGeneratingAI(true);
    setAiError(null);

    try {
      const kitInput = {
        applicantName: cvData.personalInfo?.fullName || 'Pelamar',
        applicantPhone: cvData.personalInfo?.phone || '',
        applicantEmail: cvData.personalInfo?.email || '',
        applicantLinkedIn: cvData.personalInfo?.linkedin || '',
        applicantSummary: cvData.summary || '',
        experiences: (cvData.experiences || []).slice(0, 3).map((exp) => ({
          role: exp.role,
          company: exp.company,
          description: exp.description,
        })),
        education: (cvData.education || []).slice(0, 2).map((edu) => ({
          degree: edu.degree,
          institution: edu.institution,
        })),
        skills: (cvData.skills || []).map((s) => s.name),
        targetCompany: targetCompany || 'Perusahaan Tujuan',
        targetJob: targetJob || cvData.personalInfo?.jobTitle || 'Posisi yang Dilamar',
        recipientName: recipient || 'Bapak/Ibu HRD',
        companyAddress: companyCity || 'Indonesia',
        templateType: activePreset,
        jobRequirements: jobRequirements.trim() || undefined,
      };

      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getUserAuthHeaders(),
        },
        body: JSON.stringify({
          mode: 'application_kit',
          kitInput,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menyusun kalimat dengan AI.');
      }

      const generated = data.generatedKit;
      setLetterData((prev) => ({
        ...prev,
        companyName: targetCompany || prev.companyName,
        jobTitle: targetJob || prev.jobTitle,
        recipientName: recipient || prev.recipientName,
        companyAddress: companyCity || prev.companyAddress,
        subject: generated.subject || prev.subject,
        openingParagraph: generated.openingParagraph || prev.openingParagraph,
        bodyParagraph1: generated.bodyParagraph1 || prev.bodyParagraph1,
        bodyParagraph2: generated.bodyParagraph2 || prev.bodyParagraph2,
        closingParagraph: generated.closingParagraph || prev.closingParagraph,
        emailSubject: generated.emailSubject || prev.emailSubject,
        emailBody: generated.emailBody || prev.emailBody,
        whatsappMessage: generated.whatsappMessage || prev.whatsappMessage,
      }));

      showCopyFeedback('✨ AI berhasil menyusun Chat WA, Body Email & Surat Lamaran!');
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setMobileView('preview');
      }
    } catch (err: any) {
      setAiError(err.message || 'Terjadi kesalahan saat menghubungi AI.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleCopyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showCopyFeedback(label);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  // Format WhatsApp number for wa.me link
  const handleSendWhatsApp = () => {
    const cleanPhone = hrdWhatsappNumber.replace(/[^0-9]/g, '');
    const normalizedPhone = cleanPhone.startsWith('0')
      ? `62${cleanPhone.slice(1)}`
      : cleanPhone;
    const encodedText = encodeURIComponent(letterData.whatsappMessage);
    const url = normalizedPhone
      ? `https://wa.me/${normalizedPhone}?text=${encodedText}`
      : `https://wa.me/?text=${encodedText}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Open Gmail or default email client
  const handleOpenMailClient = (useGmailWeb: boolean) => {
    const to = hrdEmailAddress.trim();
    const subject = encodeURIComponent(letterData.emailSubject);
    const body = encodeURIComponent(letterData.emailBody);
    if (useGmailWeb) {
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${subject}&body=${body}`;
      window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    }
  };

  // Download PDF
  const handleDownloadPDF = async () => {
    if (!isSubscriptionActive) {
      onOpenPayment();
      return;
    }

    setIsExportingPDF(true);

    // Ensure letter preview DOM element is visible before capturing PDF
    if (outputChannel !== 'letter') {
      setOutputChannel('letter');
    }
    if (mobileView !== 'preview') {
      setMobileView('preview');
    }
    await new Promise((resolve) => setTimeout(resolve, 350));

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
    <div className="flex-1 flex flex-col min-h-0 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden relative shadow-xs">
      {/* 1. TOP TOOLBAR */}
      <div className="no-print bg-white border-b border-slate-200 px-3 sm:px-6 py-3 flex items-center justify-between gap-2 flex-wrap shrink-0 z-20">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
            ✉️
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                Generator Chat WA, Body Email & Surat Lamaran HRD
              </h2>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 hidden sm:inline">
                Otomatis dari Data CV
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">
              Tidak perlu bingung merangkai kata saat kirim CV ke WhatsApp atau Email HRD — tinggal salin 1 klik!
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile Form vs Result Switcher */}
          <div className="flex lg:hidden bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setMobileView('editor')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                mobileView === 'editor'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600'
              }`}
            >
              Atur Target
            </button>
            <button
              type="button"
              onClick={() => setMobileView('preview')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                mobileView === 'preview'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600'
              }`}
            >
              Lihat Hasil
            </button>
          </div>

          {/* Download PDF Button */}
          <button
            id="cover-letter-download-btn"
            type="button"
            onClick={handleDownloadPDF}
            disabled={isExportingPDF}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer ${
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
                <span>Unduh Surat PDF</span>
              </>
            ) : (
              <>
                <CreditCard className="w-3.5 h-3.5" />
                <span>Unduh Surat PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Floating Notification Banner */}
      {copiedType && (
        <div className="fixed bottom-16 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-xs text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{copiedType}</span>
        </div>
      )}

      {/* 2. MAIN WORKSPACE (SPLIT VIEW) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT COLUMN: Controls & Form */}
        <div
          className={`w-full lg:w-[440px] xl:w-[480px] shrink-0 bg-white border-r border-slate-200 flex flex-col h-full z-10 ${
            mobileView === 'preview' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Preset Selector Banner */}
          <div className="p-3.5 sm:p-4 border-b border-slate-100 bg-slate-50/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                1. Pilih Gaya Bahasa Lamaran
              </span>
              <button
                type="button"
                onClick={handleApplyQuickInputs}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline cursor-pointer"
                title="Tarik ulang data nama, keahlian, dan riwayat dari CV"
              >
                <RefreshCw className="w-3 h-3" />
                Sinkronkan CV
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
                      ? 'border-emerald-500 bg-emerald-50/80 shadow-2xs ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900">{preset.name}</span>
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border shrink-0 ${preset.badgeColor}`}
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
              <span>2. Perusahaan & Posisi</span>
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
              <span>Edit Manual</span>
            </button>
          </div>

          {/* Form Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeSubTab === 'quick' ? (
              <>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Perusahaan yang Dilamar
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
                      Posisi Pekerjaan yang Dilamar
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={targetJob}
                        onChange={(e) => setTargetJob(e.target.value)}
                        placeholder="Contoh: Staff Administrasi / Frontend Developer"
                        className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Sapaan Penerima (HRD)
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={recipient}
                          onChange={(e) => setRecipient(e.target.value)}
                          placeholder="Bapak/Ibu HRD"
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
                          placeholder="Jakarta"
                          className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Optional Job Description / Requirements for AI */}
                  <div className="pt-1">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Info / Syarat Lowongan Kerja{' '}
                      <span className="text-[10px] font-normal text-slate-400">(Opsional untuk AI)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={jobRequirements}
                      onChange={(e) => setJobRequirements(e.target.value)}
                      placeholder="Tempel syarat loker di sini jika ingin AI menyesuaikan kalimat lamaran dengan kualifikasi yang diminta HRD..."
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-normal leading-relaxed"
                    />
                  </div>

                  {aiError && (
                    <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                      {aiError}
                    </div>
                  )}

                  {/* Action Buttons: Instant vs Gemini AI */}
                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={handleApplyQuickInputs}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Susun Instan (WA, Email & Surat)</span>
                    </button>

                    <button
                      type="button"
                      disabled={isGeneratingAI}
                      onClick={handleGenerateWithAI}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-600/20 cursor-pointer active:scale-98 disabled:opacity-60"
                    >
                      {isGeneratingAI ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>AI Sedang Merangkai Kalimat...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                          <span>Tulis Spesifik dengan Gemini AI</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Auto-filled applicant info reference */}
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Data Pelamar (Dari CV Anda)
                    </span>
                    <button
                      type="button"
                      onClick={onSwitchToCV}
                      className="text-[11px] text-emerald-700 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Edit CV</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-xs text-slate-700 space-y-0.5">
                    <p className="font-extrabold text-slate-900">{letterData.applicantName}</p>
                    <p className="text-slate-500">
                      {letterData.applicantEmail} • {letterData.applicantPhone}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              /* Fine-tuning Paragraphs */
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Perihal Surat (Subject)
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

        {/* RIGHT COLUMN: 3-CHANNEL OUTPUT (WHATSAPP HRD | BODY EMAIL HRD | SURAT LAMARAN A4 PDF) */}
        <div
          className={`flex-1 bg-slate-100 overflow-y-auto flex flex-col items-center p-3 sm:p-6 relative ${
            mobileView === 'editor' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* 3-Channel Selector Tabs */}
          <div className="no-print w-full max-w-2xl bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-xs grid grid-cols-3 gap-1.5 mb-5">
            <button
              type="button"
              onClick={() => setOutputChannel('whatsapp')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                outputChannel === 'whatsapp'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span className="truncate">Chat WA HRD</span>
            </button>

            <button
              type="button"
              onClick={() => setOutputChannel('email')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                outputChannel === 'email'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Mail className="w-4 h-4 shrink-0" />
              <span className="truncate">Body Email HRD</span>
            </button>

            <button
              type="button"
              onClick={() => setOutputChannel('letter')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                outputChannel === 'letter'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span className="truncate">Surat PDF (A4)</span>
            </button>
          </div>

          {/* CHANNEL 1: WHATSAPP HRD GENERATOR */}
          {outputChannel === 'whatsapp' && (
            <div className="w-full max-w-2xl space-y-4 animate-in fade-in duration-150">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* WhatsApp Header */}
                <div className="bg-gradient-to-r from-emerald-700 to-teal-700 px-4 py-3 text-white flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                      HR
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-extrabold">
                        {letterData.recipientName} — {letterData.companyName}
                      </p>
                      <p className="text-[11px] text-emerald-100">
                        Template Pengantar Saat Mengirim File PDF CV di WhatsApp
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyText(
                        letterData.whatsappMessage,
                        'Pesan WhatsApp HRD berhasil disalin! Tinggal tempel di WA.'
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-extrabold shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Chat WA</span>
                  </button>
                </div>

                {/* WhatsApp Chat Bubble Preview / Editable Textarea */}
                <div className="p-4 sm:p-5 bg-[#efeae2]/60 space-y-3">
                  <div className="bg-[#d9fdd3] border border-emerald-200/80 rounded-2xl rounded-tr-none p-3.5 sm:p-4 shadow-2xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                        Pesan Lamaran Anda (Bisa Diedit Langsung)
                      </span>
                    </div>
                    <textarea
                      rows={8}
                      value={letterData.whatsappMessage}
                      onChange={(e) =>
                        setLetterData({ ...letterData, whatsappMessage: e.target.value })
                      }
                      className="w-full bg-transparent text-xs sm:text-sm text-slate-800 leading-relaxed focus:outline-hidden resize-y font-sans"
                    />
                    <div className="mt-2 pt-2 border-t border-emerald-300/60 flex items-center justify-between text-[11px] text-emerald-900 font-medium">
                      <span className="flex items-center gap-1.5">
                        📄 Lampirkan: <strong>CV_{letterData.applicantName.replace(/\s+/g, '_')}.pdf</strong>
                      </span>
                      <span>✓✓</span>
                    </div>
                  </div>

                  {/* Direct Send to WhatsApp Option */}
                  <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <div className="flex-1">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Kirim Langsung ke Nomor WA HRD (Opsional)
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="tel"
                          value={hrdWhatsappNumber}
                          onChange={(e) => setHrdWhatsappNumber(e.target.value)}
                          placeholder="Contoh: 081234567890 (Kosongkan jika hanya ingin pilih kontak di WA)"
                          className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:self-end">
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText(
                            letterData.whatsappMessage,
                            'Pesan WhatsApp HRD berhasil disalin!'
                          )
                        }
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5 text-slate-600" />
                        <span>Salin Teks</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleSendWhatsApp}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-xs transition-all cursor-pointer active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Buka WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Etiquette Tip Box */}
              <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 space-y-1">
                <p className="font-extrabold flex items-center gap-1.5">
                  <span>💡 Tips Etika Melamar Kerja Lewat WhatsApp HRD:</span>
                </p>
                <p className="text-amber-800 leading-relaxed">
                  Kirim pesan pada jam kerja (Senin–Jumat pukul 08.00–16.00). Setelah menempelkan pesan di atas, jangan lupa lampirkan berkas <strong>File PDF CV</strong> yang sudah Anda unduh dari tab Editor CV.
                </p>
              </div>
            </div>
          )}

          {/* CHANNEL 2: EMAIL HRD SUBJECT & BODY GENERATOR */}
          {outputChannel === 'email' && (
            <div className="w-full max-w-2xl space-y-4 animate-in fade-in duration-150">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Email Header */}
                <div className="bg-slate-900 px-4 py-3 text-white flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-400" />
                    <div>
                      <p className="text-xs sm:text-sm font-extrabold">
                        Subjek & Body Email Lamaran Kerja
                      </p>
                      <p className="text-[11px] text-slate-300">
                        Format ringkas & profesional agar email Anda langsung dibuka oleh HRD
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyText(
                        letterData.emailBody,
                        'Isi Body Email berhasil disalin! Tinggal tempel di Gmail/Email Anda.'
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Isi Email</span>
                  </button>
                </div>

                <div className="p-4 sm:p-5 space-y-4">
                  {/* 1. Email Subject Box */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                        1. Subjek Email (Subject)
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText(
                            letterData.emailSubject,
                            'Subjek Email berhasil disalin!'
                          )
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Salin Subjek</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={letterData.emailSubject}
                      onChange={(e) =>
                        setLetterData({ ...letterData, emailSubject: e.target.value })
                      }
                      className="w-full bg-white text-xs sm:text-sm font-bold text-slate-900 px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* 2. Email Body Box */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                        2. Isi Pesan Email (Body Email — Bisa Diedit)
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText(
                            letterData.emailBody,
                            'Isi Body Email berhasil disalin!'
                          )
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Salin Isi Email</span>
                      </button>
                    </div>
                    <textarea
                      rows={12}
                      value={letterData.emailBody}
                      onChange={(e) =>
                        setLetterData({ ...letterData, emailBody: e.target.value })
                      }
                      className="w-full bg-white text-xs sm:text-sm text-slate-800 p-3 rounded-lg border border-slate-200 leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-sans"
                    />
                  </div>

                  {/* 3. Direct Open in Gmail / Email App */}
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <div className="flex-1">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Alamat Email HRD (Opsional — untuk buka langsung di Gmail/Email)
                      </label>
                      <input
                        type="email"
                        value={hrdEmailAddress}
                        onChange={(e) => setHrdEmailAddress(e.target.value)}
                        placeholder="Contoh: recruitment@perusahaan.co.id"
                        className="w-full bg-white text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="flex items-center gap-2 sm:self-end">
                      <button
                        type="button"
                        onClick={() => handleOpenMailClient(false)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-600" />
                        <span>Aplikasi Email</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenMailClient(true)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-xs transition-all cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Buka di Gmail</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CHANNEL 3: FORMAL A4 COVER LETTER PDF */}
          {outputChannel === 'letter' && (
            <div className="w-full flex flex-col items-center animate-in fade-in duration-150">
              {/* Zoom & Copy Controls */}
              <div className="w-full max-w-[794px] flex items-center justify-between gap-2 mb-3 flex-wrap">
                <div className="text-xs bg-white text-slate-700 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-2xs">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>
                    Klik teks di atas kertas A4 untuk mengedit kalimat secara langsung.
                  </span>
                </div>

                <div className="bg-white border border-slate-300 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-2xs text-xs font-bold text-slate-700">
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.max(z - 10, 35))}
                    className="p-1 hover:text-emerald-700 cursor-pointer"
                    title="Perkecil"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-9 text-center text-[11px]">{zoom}%</span>
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.min(z + 10, 130))}
                    className="p-1 hover:text-emerald-700 cursor-pointer"
                    title="Perbesar"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoom(calculateFitZoom())}
                    className="px-2 py-0.5 text-[10px] text-emerald-700 font-bold hover:bg-emerald-50 rounded-full transition-colors cursor-pointer"
                    title="Paskan Layar"
                  >
                    Paskan
                  </button>
                </div>
              </div>

              {/* A4 Paper Document Container */}
              <div
                className="flex justify-center items-start min-w-0 mx-auto transition-all duration-150 mb-12"
                style={{
                  width: `${Math.round(794 * (zoom / 100))}px`,
                  height: `${Math.round(docHeight * (zoom / 100))}px`,
                  maxWidth: '100%',
                  position: 'relative',
                }}
              >
                <div
                  ref={docRef}
                  id="cover-letter-paper-document"
                  className={`cv-a4-page bg-white shadow-2xl px-8 sm:px-12 pt-7 sm:pt-9 pb-10 text-slate-800 flex flex-col justify-between ${letterData.fontFamily}`}
                  style={{
                    width: '794px',
                    minHeight: '1123px',
                    transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
                    transformOrigin: 'top left',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    boxSizing: 'border-box',
                  }}
                >
                  {/* LETTERHEAD / KOP SURAT */}
                  <div
                    className="border-b-2 pb-5 mb-6"
                    style={{ borderColor: letterData.accentColor }}
                  >
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
                            openingParagraph:
                              e.currentTarget.innerText.trim() || prev.openingParagraph,
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
                            bodyParagraph1:
                              e.currentTarget.innerText.trim() || prev.bodyParagraph1,
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
                            bodyParagraph2:
                              e.currentTarget.innerText.trim() || prev.bodyParagraph2,
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
                            closingParagraph:
                              e.currentTarget.innerText.trim() || prev.closingParagraph,
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
