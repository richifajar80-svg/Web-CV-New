'use client';

import React, { useState } from 'react';
import {
  Download,
  RefreshCw,
  LogIn,
  UserPlus,
  ShieldCheck,
  LayoutTemplate,
  ChevronDown,
  Sparkles,
  Languages,
  Type,
  Eraser,
  FileText,
  Loader2,
  Mail,
  MoreHorizontal,
  Palette,
  CreditCard,
} from 'lucide-react';
import { CVTheme, CVData, TemplateId } from '@/types/cv';
import { useAuth } from '@/context/AuthContext';
import { UserMenu } from '@/components/Auth/UserMenu';
import { SavedCV } from '@/types/auth';
import { TEMPLATE_LIST } from '@/data/templates';
import { TemplateGalleryModal } from '@/components/Templates/TemplateGalleryModal';

interface HeaderProps {
  theme: CVTheme;
  currentCV: CVData;
  activeCVId: string | null;
  onUpdateTheme: (newTheme: Partial<CVTheme>) => void;
  onReset: () => void;
  onClearAll: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onSelectCV: (cv: SavedCV) => void;
  onNewCV: () => void;
  onSaveCurrentCV: () => void;
  onDownloadClick: () => void;
  onOpenPayment: () => void;
  onOpenGallery?: () => void;
  onOpenContact?: () => void;
  isDownloading?: boolean;
  activeMode?: 'cv' | 'cover_letter';
  onSwitchMode?: (mode: 'cv' | 'cover_letter') => void;
}

const COLOR_PRESETS = [
  { name: 'Royal Blue', value: '#1e40af' },
  { name: 'Emerald Teal', value: '#0f766e' },
  { name: 'Slate Executive', value: '#1e293b' },
  { name: 'Crimson Burgundy', value: '#991b1b' },
  { name: 'Amethyst Purple', value: '#6b21a8' },
];

export const Header: React.FC<HeaderProps> = ({
  theme,
  currentCV,
  activeCVId,
  onUpdateTheme,
  onReset,
  onClearAll,
  onOpenAuth,
  onSelectCV,
  onNewCV,
  onSaveCurrentCV,
  onDownloadClick,
  onOpenPayment,
  onOpenGallery,
  onOpenContact,
  isDownloading = false,
  activeMode = 'cv',
  onSwitchMode,
}) => {
  const { isAuthenticated, isSubscriptionActive } = useAuth();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [resetMenuOpen, setResetMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  // Find active template name
  const currentTemplate = TEMPLATE_LIST.find((t) => t.id === theme.template) || TEMPLATE_LIST[0];

  const handleOpenGalleryClick = () => {
    if (onOpenGallery) {
      onOpenGallery();
    } else {
      setGalleryOpen(true);
    }
  };

  return (
    <>
      <header className="no-print sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-[1700px] w-full mx-auto px-2 sm:px-4 lg:px-5 h-14 sm:h-16 flex items-center justify-between gap-1 sm:gap-2.5 min-w-0">
          
          {/* 1. Logo & Brand */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 font-bold text-sm sm:text-lg shrink-0">
              CB
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-sm sm:text-lg tracking-tight shrink-0">
                  cvbagus<span className="text-emerald-600">.id</span>
                </span>
                {isSubscriptionActive ? (
                  <span className="hidden lg:inline-flex text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300 items-center gap-1 shrink-0">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Akses 1 Thn Aktif</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenPayment}
                    className="hidden lg:inline-flex text-[11px] font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 transition-colors cursor-pointer shrink-0"
                  >
                    Rp 25.000 / Thn
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-500 hidden 2xl:block truncate">Editor CV Profesional & Ramah ATS</p>
            </div>
          </div>

          {/* 2. Desktop Mode Switcher: CV Editor vs Cover Letter Generator */}
          <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 shrink-0">
            <button
              type="button"
              onClick={() => onSwitchMode?.('cv')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'cv'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Editor CV</span>
            </button>
            <button
              type="button"
              onClick={() => onSwitchMode?.('cover_letter')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'cover_letter'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Surat Lamaran</span>
              <span className="text-[9px] bg-amber-400/25 text-amber-950 font-black px-1.5 py-0.2 rounded-full uppercase hidden xl:inline-block">
                Bonus
              </span>
            </button>
          </div>

          {/* 4. Action Controls Bar (Carefully responsive on mobile & desktop) */}
          <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 shrink-0">

            {/* ONLY IN CV MODE: Template Gallery, Theme Popover, Language, Reset, and Download */}
            {activeMode === 'cv' && (
              <>
                {/* Template Gallery Picker (Prominent & Clearly Labeled) */}
                <button
                  type="button"
                  onClick={handleOpenGalleryClick}
                  className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl border-2 border-emerald-500/60 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 text-slate-800 font-bold transition-all shadow-xs hover:shadow-md cursor-pointer group active:scale-98 shrink-0 ring-2 ring-emerald-500/10"
                  title="Klik untuk memilih dari 10+ pilihan templat & desain CV"
                >
                  <div className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    <LayoutTemplate className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col text-left leading-tight hidden xs:flex">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-black uppercase tracking-wider text-emerald-800 whitespace-nowrap">
                        Template
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[70px] sm:max-w-[95px] xl:max-w-[120px]">
                      {currentTemplate.name}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-emerald-700/80 shrink-0 group-hover:translate-y-0.5 transition-transform ml-0.5" />
                </button>

                {/* Theme (Color & Font) Compact Popover - Hidden on mobile, accessible in ... menu */}
                <div className="hidden md:block relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                    className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                    title="Atur warna aksen & jenis font CV"
                  >
                    <span
                      className="w-3 h-3 rounded-full shadow-2xs border border-white shrink-0"
                      style={{ backgroundColor: theme.accentColor || '#1e40af' }}
                    />
                    <span className="hidden xl:inline capitalize font-semibold text-[11px]">
                      {theme.fontFamily || 'Sans'}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {themeMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setThemeMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-40 animate-in fade-in slide-in-from-top-1 duration-150 space-y-3">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                            Warna Aksen CV
                          </div>
                          <div className="flex items-center gap-2">
                            {COLOR_PRESETS.map((color) => (
                              <button
                                key={color.value}
                                type="button"
                                title={color.name}
                                onClick={() => {
                                  onUpdateTheme({ accentColor: color.value });
                                }}
                                className="w-7 h-7 rounded-full transition-transform hover:scale-110 flex items-center justify-center cursor-pointer shadow-2xs"
                                style={{ backgroundColor: color.value }}
                              >
                                {theme.accentColor === color.value && (
                                  <span className="w-2 h-2 rounded-full bg-white shadow-xs" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                            Gaya Font CV
                          </div>
                          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                            <button
                              type="button"
                              onClick={() => onUpdateTheme({ fontFamily: 'sans' })}
                              className={`py-1.5 rounded-lg transition-all ${
                                (theme.fontFamily || 'sans') === 'sans'
                                  ? 'bg-white text-emerald-700 shadow-2xs font-extrabold'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Sans
                            </button>
                            <button
                              type="button"
                              onClick={() => onUpdateTheme({ fontFamily: 'serif' })}
                              className={`py-1.5 rounded-lg font-serif transition-all ${
                                theme.fontFamily === 'serif'
                                  ? 'bg-white text-emerald-700 shadow-2xs font-extrabold'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Serif
                            </button>
                            <button
                              type="button"
                              onClick={() => onUpdateTheme({ fontFamily: 'mono' })}
                              className={`py-1.5 rounded-lg font-mono transition-all ${
                                theme.fontFamily === 'mono'
                                  ? 'bg-white text-emerald-700 shadow-2xs font-extrabold'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Mono
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Reset & Clear Form Dropdown - Hidden on mobile, in ... menu */}
                <div className="hidden lg:block relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setResetMenuOpen(!resetMenuOpen)}
                    title="Opsi Reset & Kosongkan Data"
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 flex items-center cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>

                  {resetMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setResetMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-40 animate-in fade-in slide-in-from-top-1 duration-150 space-y-1">
                        <div className="px-2.5 py-1.5 border-b border-slate-100">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Opsi Pengisian Form
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setResetMenuOpen(false);
                            onReset();
                          }}
                          className="w-full text-left flex items-start gap-2.5 p-2 rounded-xl text-xs hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 transition-colors cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          <div>
                            <div className="font-bold text-slate-800">Isi Data Contoh (Demo)</div>
                            <div className="text-[10px] text-slate-500">Kembalikan ke data profil contoh</div>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setResetMenuOpen(false);
                            onClearAll();
                          }}
                          className="w-full text-left flex items-start gap-2.5 p-2 rounded-xl text-xs hover:bg-red-50 text-slate-700 hover:text-red-700 transition-colors cursor-pointer"
                        >
                          <Eraser className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                          <div>
                            <div className="font-bold text-red-600">Kosongkan Semua Form</div>
                            <div className="text-[10px] text-slate-500">Mulai mengisi data Anda dari nol</div>
                          </div>
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Contact Us Link - Directly to the left of Unduh PDF */}
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="hidden md:inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-800 bg-slate-50 hover:bg-emerald-50/80 transition-all cursor-pointer border border-slate-200 hover:border-emerald-300 shadow-2xs shrink-0 whitespace-nowrap"
                  title="Hubungi tim support & bantuan resmi cvbagus.id"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Contact Us</span>
                </button>

                {/* Download / Print PDF Button (FULL TEXT & NEVER CLIPPED) */}
                <button
                  type="button"
                  disabled={isDownloading}
                  onClick={onDownloadClick}
                  className="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95 disabled:opacity-75 cursor-pointer"
                  title="Unduh file CV Anda dalam format PDF standar A4 siap cetak"
                >
                  {isDownloading ? (
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
              </>
            )}

            {/* User Profile Avatar Section */}
            <div className="pl-1.5 sm:pl-2.5 border-l border-slate-200 shrink-0">
              {isAuthenticated ? (
                <UserMenu
                  currentCV={currentCV}
                  activeCVId={activeCVId}
                  onSelectCV={onSelectCV}
                  onNewCV={onNewCV}
                  onSaveCurrentCV={onSaveCurrentCV}
                  onOpenPayment={onOpenPayment}
                />
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onOpenAuth('login')}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-emerald-700 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Masuk</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Navigation Dropdown Button (•••) */}
            <div className="lg:hidden relative shrink-0">
              <button
                type="button"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200 shadow-2xs"
                title="Menu Navigasi Tambahan"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {mobileNavOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 space-y-2">
                  {/* Switch to Cover Letter or CV */}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileNavOpen(false);
                      onSwitchMode?.(activeMode === 'cv' ? 'cover_letter' : 'cv');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors text-left cursor-pointer border border-emerald-200/80"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>{activeMode === 'cv' ? 'Buka Surat Lamaran (Bonus)' : 'Kembali ke Editor CV'}</span>
                    </span>
                  </button>

                  {/* Mobile Theme Colors */}
                  {activeMode === 'cv' && (
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Warna Aksen CV
                        </span>
                        <div className="flex items-center gap-1.5">
                          {COLOR_PRESETS.map((color) => (
                            <button
                              key={color.value}
                              type="button"
                              title={color.name}
                              onClick={() => {
                                onUpdateTheme({ accentColor: color.value });
                              }}
                              className="w-5 h-5 rounded-full transition-transform hover:scale-110 flex items-center justify-center cursor-pointer shadow-2xs"
                              style={{ backgroundColor: color.value }}
                            >
                              {theme.accentColor === color.value && (
                                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Mobile Font Selector */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Font
                        </span>
                        <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                          {(['sans', 'serif', 'mono'] as const).map((font) => (
                            <button
                              key={font}
                              type="button"
                              onClick={() => onUpdateTheme({ fontFamily: font })}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                                (theme.fontFamily || 'sans') === font
                                  ? 'bg-emerald-600 text-white'
                                  : 'text-slate-600'
                              }`}
                            >
                              {font}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Reset Actions */}
                  {activeMode === 'cv' && (
                    <div className="space-y-1 pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setMobileNavOpen(false);
                          onReset();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 text-left"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                        <span>Isi Ulang Data Contoh (Demo)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileNavOpen(false);
                          onClearAll();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 text-left"
                      >
                        <Eraser className="w-3.5 h-3.5 text-red-500" />
                        <span>Kosongkan Formulir CV</span>
                      </button>
                    </div>
                  )}

                  {/* Activation button if not pro */}
                  {!isSubscriptionActive && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileNavOpen(false);
                        onOpenPayment();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-left"
                    >
                      <span className="flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5 text-amber-700" />
                        <span>Aktivasi 1 Tahun Penuh</span>
                      </span>
                      <span className="font-extrabold text-[11px]">Rp 25rb</span>
                    </button>
                  )}

                  {/* Contact Us */}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileNavOpen(false);
                      onOpenContact?.();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors text-left cursor-pointer pt-1 border-t border-slate-100"
                  >
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Contact Us (Layanan Bantuan)</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* 10-Template Gallery Modal (Internal fallback if not controlled by parent) */}
      {!onOpenGallery && (
        <TemplateGalleryModal
          isOpen={galleryOpen}
          selectedTemplate={theme.template}
          accentColor={theme.accentColor}
          onSelectTemplate={(templateId) => onUpdateTheme({ template: templateId })}
          onClose={() => setGalleryOpen(false)}
        />
      )}
    </>
  );
};

