'use client';

import React, { useState, useEffect } from 'react';
import { CVData, CVTheme } from '@/types/cv';
import { initialCVData } from '@/data/initialCV';
import { Header } from '@/components/Header';
import { EditorTabs } from '@/components/Editor/EditorTabs';
import { ATSScoreCard, calculateATSScore } from '@/components/Editor/ATSScoreCard';
import { CVCanvas } from '@/components/Preview/CVCanvas';
import { AuthScreen } from '@/components/Auth/AuthScreen';
import { AuthModal } from '@/components/Auth/AuthModal';
import { PaymentModal } from '@/components/Payment/PaymentModal';
import { TemplateGalleryModal } from '@/components/Templates/TemplateGalleryModal';
import { ContactModal } from '@/components/Navigation/ContactModal';
import { NewsModal } from '@/components/Navigation/NewsModal';
import { TipsModal } from '@/components/Navigation/TipsModal';
import { TEMPLATE_LIST } from '@/data/templates';
import { useAuth } from '@/context/AuthContext';
import { SavedCV } from '@/types/auth';
import { exportCVToPDF } from '@/utils/pdfExport';
import { CoverLetterView } from '@/components/CoverLetter/CoverLetterView';
import {
  Eye,
  BookmarkCheck,
  CheckCircle2,
  Loader2,
  CreditCard,
  ShieldCheck,
  FileText,
  Download,
  LayoutTemplate,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export default function Home() {
  const { user, isAuthenticated, isSubscriptionActive, isLoading, userCVs, saveCV } = useAuth();

  const [activeMode, setActiveMode] = useState<'cv' | 'cover_letter'>('cv');
  const [cvData, setCvData] = useState<CVData>(initialCVData);
  const [activeCVId, setActiveCVId] = useState<string | null>(null);
  const [activeCVTitle, setActiveCVTitle] = useState<string>('CV Utama Saya');

  // Preview zoom level & mobile view switcher
  const [zoom, setZoom] = useState<number>(100);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');

  // Template gallery modal state
  const [galleryOpen, setGalleryOpen] = useState(false);

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Payment modal state (Aktivasi Rp 25.000 / 1 Tahun)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // Navigation Modals: Contact, News, Tips & CMS
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [tipsModalOpen, setTipsModalOpen] = useState(false);

  // PDF direct download generation state
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Synchronize active CV when user logs in or userCVs change
  useEffect(() => {
    if (user && userCVs.length > 0) {
      const current = userCVs.find((c) => c.id === activeCVId) || userCVs[0];
      setActiveCVId(current.id);
      setActiveCVTitle(current.title);
      setCvData(current.data);
    }
  }, [user, userCVs]);

  // Dynamic screen-fitting zoom calculation
  const calculateFitZoom = () => {
    if (typeof window === 'undefined') return 100;
    const w = window.innerWidth;
    if (w < 640) {
      // Mobile phone screen: fit within screen width minus margins
      const available = Math.max(280, w - 24);
      return Math.min(100, Math.max(35, Math.floor((available / 794) * 100)));
    } else if (w < 1024) {
      return 60;
    } else if (w < 1280) {
      return 75;
    } else if (w < 1536) {
      return 85;
    }
    return 100;
  };

  // Auto-fit preview zoom on client mount & window resize
  useEffect(() => {
    setZoom(calculateFitZoom());
    const handleResize = () => {
      // keep zoom comfortable on orientation change or screen resize
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Loading Screen while verifying session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-xs font-medium text-slate-500">Memuat cvbagus.id...</p>
      </div>
    );
  }

  // GATE: If user is not logged in, show the Login/Register Gateway!
  if (!isAuthenticated) {
    return (
      <AuthScreen
        onSuccess={() => {
          showToast('Selamat datang! Akun Anda aktif. Silakan mulai buat CV Anda.');
        }}
      />
    );
  }

  // IF AUTHENTICATED: Show the full CV Editor & Builder Workspace
  const handleUpdateCV = (updatedFields: Partial<CVData>) => {
    setCvData((prev) => ({ ...prev, ...updatedFields }));
  };

  const handleUpdateTheme = (updatedTheme: Partial<CVTheme>) => {
    setCvData((prev) => ({
      ...prev,
      theme: { ...prev.theme, ...updatedTheme },
    }));
  };

  const handleReset = () => {
    if (window.confirm('Reset formulir ke data contoh? Perubahan Anda saat ini akan ditimpa.')) {
      setCvData(initialCVData);
      showToast('Data contoh berhasil dimuat!');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Kosongkan semua isian CV untuk mulai mengisi dari nol?')) {
      const blankCV: CVData = {
        personalInfo: {
          fullName: '',
          jobTitle: '',
          email: '',
          phone: '',
          location: '',
          linkedin: '',
          website: '',
          photoUrl: '',
          showPhoto: false,
        },
        summary: '',
        experiences: [],
        education: [],
        skills: [],
        languages: [],
        certifications: [],
        theme: cvData.theme,
      };
      setCvData(blankCV);
      showToast('Form berhasil dikosongkan. Silakan isi data Anda!');
    }
  };

  // Switch to another saved CV
  const handleSelectCV = (selected: SavedCV) => {
    setActiveCVId(selected.id);
    setActiveCVTitle(selected.title);
    setCvData(selected.data);
    showToast(`Memuat "${selected.title}"`);
  };

  // Create new blank/default CV
  const handleNewCV = () => {
    const title = window.prompt('Beri judul untuk CV baru ini:', `CV Baru ${userCVs.length + 1}`);
    if (title && user) {
      const newSaved = saveCV(title, initialCVData);
      setActiveCVId(newSaved.id);
      setActiveCVTitle(newSaved.title);
      setCvData(newSaved.data);
      showToast(`CV baru "${title}" berhasil dibuat!`);
    }
  };

  // Save Current CV to User Account
  const handleSaveCurrentCV = () => {
    const title = window.prompt('Nama dokumen CV:', activeCVTitle || 'CV Utama Saya');
    if (title && user) {
      saveCV(title, cvData, activeCVId || undefined);
      setActiveCVTitle(title);
      showToast(`Berhasil menyimpan "${title}" ke akun!`);
    }
  };

  // DIRECT PDF DOWNLOAD: Generate .pdf file and download directly to device
  const performPDFDownload = async () => {
    setIsGeneratingPDF(true);
    showToast('Sedang memproses & membuat file PDF kualitas tinggi...');

    // If on mobile/small screen and editor tab is active, switch to preview tab so DOM element is active
    if (mobileView !== 'preview') {
      setMobileView('preview');
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    const candidateName = cvData.personalInfo.fullName
      ? cvData.personalInfo.fullName.trim().replace(/\s+/g, '_')
      : 'Saya';
    const fileName = `CV_${candidateName}.pdf`;

    const success = await exportCVToPDF('cv-paper-document', fileName);

    setIsGeneratingPDF(false);
    if (success) {
      showToast(`File "${fileName}" berhasil diunduh ke perangkat Anda!`);
    } else {
      showToast('Gagal memproses file PDF. Pastikan koneksi stabil & coba lagi.');
    }
  };

  // DOWNLOAD PDF TRIGGER: Check if subscription is active
  const handleDownloadClick = () => {
    if (!isSubscriptionActive) {
      // Prompt user to activate Rp 25rb 1-year access before downloading!
      setPaymentModalOpen(true);
    } else {
      // User has already paid for 1-year access -> trigger direct file download!
      performPDFDownload();
    }
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const currentATSScore = calculateATSScore(cvData);
  const currentTemplate = TEMPLATE_LIST.find((t) => t.id === cvData.theme.template) || TEMPLATE_LIST[0];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Navbar with User Menu and Controls */}
      <Header
        theme={cvData.theme}
        currentCV={cvData}
        activeCVId={activeCVId}
        onUpdateTheme={handleUpdateTheme}
        onReset={handleReset}
        onClearAll={handleClearAll}
        onOpenAuth={handleOpenAuth}
        onSelectCV={handleSelectCV}
        onNewCV={handleNewCV}
        onSaveCurrentCV={handleSaveCurrentCV}
        onDownloadClick={handleDownloadClick}
        onOpenPayment={() => setPaymentModalOpen(true)}
        onOpenGallery={() => setGalleryOpen(true)}
        onOpenContact={() => setContactModalOpen(true)}
        isDownloading={isGeneratingPDF}
        activeMode={activeMode}
        onSwitchMode={setActiveMode}
      />

      {/* Toast Notification (Never appears in print/PDF) */}
      {toastMessage && (
        <div className="no-print fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Split-Screen Workspace */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-3 sm:p-5 lg:p-6 pb-28 lg:pb-12 min-w-0 overflow-x-hidden">
        {activeMode === 'cover_letter' ? (
          <CoverLetterView
            cvData={cvData}
            isSubscriptionActive={isSubscriptionActive}
            onOpenPayment={() => setPaymentModalOpen(true)}
            onSwitchToCV={() => setActiveMode('cv')}
          />
        ) : (
          <>
            {/* Mobile View Switcher (Visible on small screens only) */}
        <div className="lg:hidden no-print flex items-center justify-center p-1 bg-white rounded-2xl shadow-xs border border-slate-200 mb-4 max-w-sm mx-auto">
          <button
            type="button"
            onClick={() => setMobileView('editor')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mobileView === 'editor'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Formulir CV</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileView('preview')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mobileView === 'preview'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Pratinjau A4</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full min-w-0">
          {/* LEFT PANEL: Editor Forms (5 of 12 cols on desktop) */}
          <div
            className={`no-print lg:col-span-5 xl:col-span-5 space-y-4 min-w-0 ${
              mobileView === 'editor' ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between px-1 gap-2 min-w-0">
              <div className="flex items-center gap-1.5 min-w-0 truncate">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">
                  Formulir
                </span>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full truncate max-w-[120px] sm:max-w-[170px]">
                  {activeCVTitle}
                </span>
                <span className="hidden xs:inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50/80 border border-emerald-200/60 px-2 py-0.5 rounded-full shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Tersimpan
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {!isSubscriptionActive && (
                  <button
                    type="button"
                    onClick={() => setPaymentModalOpen(true)}
                    className="text-[10px] sm:text-[11px] text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-full font-semibold border border-amber-300 shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <CreditCard className="w-3 h-3 text-amber-700" />
                    <span>Rp 25rb</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSaveCurrentCV}
                  className="text-[10px] sm:text-[11px] text-emerald-700 hover:text-emerald-900 bg-white hover:bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200 shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <BookmarkCheck className="w-3 h-3 text-emerald-600" />
                  <span>Simpan</span>
                </button>
              </div>
            </div>

            {/* ATS Readiness Score Card */}
            <ATSScoreCard cvData={cvData} />

            {/* Step-by-Step Editor Tabs Wizard */}
            <EditorTabs
              cvData={cvData}
              onUpdateCV={handleUpdateCV}
              onViewPreview={() => {
                setMobileView('preview');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>

          {/* RIGHT PANEL: Real-time Live A4 Preview (7 of 12 cols on desktop) */}
          <div
            className={`lg:col-span-7 xl:col-span-7 space-y-4 min-w-0 print:block print:w-full print:max-w-none print:m-0 print:p-0 ${
              mobileView === 'preview' ? 'block' : 'hidden lg:block'
            }`}
          >
            {/* Quick mobile switch-back banner */}
            <div className="lg:hidden no-print flex items-center justify-between bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs mb-3">
              <button
                type="button"
                onClick={() => {
                  setMobileView('editor');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kembali ke Edit Form</span>
              </button>
              <button
                type="button"
                disabled={isGeneratingPDF}
                onClick={handleDownloadClick}
                className="shrink-0 whitespace-nowrap text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3.5 py-1.5 rounded-xl inline-flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 active:scale-95 disabled:opacity-75 transition-all cursor-pointer"
              >
                {isGeneratingPDF ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin" />
                    <span>Membuat PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 shrink-0" />
                    <span>Unduh PDF</span>
                  </>
                )}
              </button>
            </div>

            <div className="no-print flex items-center justify-between px-1 flex-wrap gap-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>2. Pratinjau Langsung (A4 Live Preview)</span>
                </div>

                {/* Prominent Quick Template Switcher */}
                <button
                  type="button"
                  onClick={() => setGalleryOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white hover:bg-emerald-50 border-2 border-emerald-500/50 hover:border-emerald-600 text-slate-800 font-bold text-xs shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95 group"
                  title="Klik untuk memilih dari 10+ desain & template CV"
                >
                  <LayoutTemplate className="w-3.5 h-3.5 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-slate-500 text-[11px] font-semibold">Desain:</span>
                  <span className="text-emerald-900 font-black">{currentTemplate.name}</span>
                  <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.2 rounded-md">
                    Ganti
                  </span>
                </button>

                {/* Language Switcher (Sleek Segmented Pill Switch) */}
                <div className="inline-flex items-center bg-slate-100/90 p-0.5 rounded-xl border border-slate-200/90 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleUpdateCV({ theme: { ...cvData.theme, language: 'id' } })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      (cvData.theme.language || 'id') === 'id'
                        ? 'bg-white text-emerald-700 shadow-2xs font-extrabold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Bahasa Indonesia"
                  >
                    ID
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateCV({ theme: { ...cvData.theme, language: 'en' } })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      cvData.theme.language === 'en'
                        ? 'bg-white text-emerald-700 shadow-2xs font-extrabold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="English"
                  >
                    EN
                  </button>
                </div>

                {/* Zoom Controls */}
                <div className="inline-flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setZoom((prev) => Math.max(35, prev - 10))}
                    className="px-2 py-0.5 rounded text-slate-600 hover:text-slate-900 hover:bg-white transition-all cursor-pointer"
                    title="Perkecil Pratinjau (Zoom Out)"
                  >
                    -
                  </button>
                  <span className="px-1.5 text-slate-700 min-w-[38px] text-center select-none text-[10px]">{zoom}%</span>
                  <button
                    type="button"
                    onClick={() => setZoom((prev) => Math.min(130, prev + 10))}
                    className="px-2 py-0.5 rounded text-slate-600 hover:text-slate-900 hover:bg-white transition-all cursor-pointer"
                    title="Perbesar Pratinjau (Zoom In)"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoom(calculateFitZoom())}
                    className="px-1.5 py-0.5 text-[10px] text-emerald-700 hover:bg-white rounded transition-all cursor-pointer font-bold"
                    title="Sesuaikan ukuran lembar A4 agar pas di layar tanpa geser"
                  >
                    Paskan
                  </button>
                  {zoom !== 100 && (
                    <button
                      type="button"
                      onClick={() => setZoom(100)}
                      className="px-1.5 py-0.5 text-[10px] text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
                      title="Reset ke 100%"
                    >
                      100%
                    </button>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Ukuran Cetak: Standar A4 (210 x 297 mm)
              </div>
            </div>

            {/* Scrollable preview area with paper styling */}
            <div className="w-full flex justify-center overflow-x-auto pb-8 min-w-0">
              <CVCanvas data={cvData} zoom={zoom} />
            </div>
          </div>
        </div>
          </>
        )}
      </main>

      {/* FIXED MOBILE BOTTOM ACTION BAR (Native App Feel UX) */}
      <nav
        aria-label="Navigasi Aksi Mobile"
        className="lg:hidden no-print fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-3 py-2"
      >
        <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
          {activeMode === 'cv' ? (
            <>
              {/* 1. Toggle View: Form vs Preview */}
              {mobileView === 'editor' ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileView('preview');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 text-xs font-bold border border-slate-200/80 transition-all cursor-pointer shadow-2xs"
                >
                  <Eye className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">Lihat Pratinjau</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileView('editor');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 text-xs font-bold border border-slate-200/80 transition-all cursor-pointer shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">Edit Formulir</span>
                </button>
              )}

              {/* 2. Quick Template Selector */}
              <button
                type="button"
                onClick={() => setGalleryOpen(true)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 active:scale-95 text-xs font-bold border-2 border-emerald-400 transition-all cursor-pointer shadow-xs shrink-0"
                title="Pilih Desain / Templat CV (10+ Pilihan)"
              >
                <LayoutTemplate className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-extrabold truncate max-w-[80px]">Desain</span>
              </button>

              {/* 3. Direct Download Button */}
              <button
                type="button"
                disabled={isGeneratingPDF}
                onClick={handleDownloadClick}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-75"
              >
                {isGeneratingPDF ? (
                  <>
                    <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
                    <span className="truncate">Membuat...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 shrink-0" />
                    <span className="truncate">Unduh PDF</span>
                  </>
                )}
              </button>
            </>
          ) : (
            /* Cover letter mode mobile bottom actions */
            <div className="flex items-center justify-between gap-2 w-full">
              <button
                type="button"
                onClick={() => setActiveMode('cv')}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600" />
                <span>Kembali ke CV</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const btn = document.getElementById('cover-letter-download-btn');
                  if (btn) btn.click();
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Surat PDF</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* 10-Template Gallery Modal */}
      <TemplateGalleryModal
        isOpen={galleryOpen}
        selectedTemplate={cvData.theme.template}
        accentColor={cvData.theme.accentColor}
        onSelectTemplate={(templateId) => {
          handleUpdateTheme({ template: templateId });
          showToast(`Templat diubah ke "${TEMPLATE_LIST.find((t) => t.id === templateId)?.name || templateId}"`);
        }}
        onClose={() => setGalleryOpen(false)}
      />

      {/* Payment Gateway Modal (Rp 25.000 untuk 1 Tahun) */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSuccessDownload={() => {
          showToast('Akses 1 tahun aktif! Menyiapkan file PDF...');
          performPDFDownload();
        }}
      />

      {/* Auth Modal for Secondary Triggers */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          showToast('Akun berhasil disinkronkan!');
        }}
      />

      {/* Contact Us Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />

      {/* Career & Official News Portal Modal */}
      <NewsModal
        isOpen={newsModalOpen}
        onClose={() => setNewsModalOpen(false)}
      />

      {/* Tips & CMS Article Editor Modal */}
      <TipsModal
        isOpen={tipsModalOpen}
        onClose={() => setTipsModalOpen(false)}
      />
    </div>
  );
}
