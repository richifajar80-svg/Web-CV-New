'use client';

import React, { useState } from 'react';
import { Download, RefreshCw, LogIn, UserPlus, ShieldCheck, LayoutTemplate, ChevronDown, Sparkles, Languages, Type, Eraser, FileText, Loader2, Mail, MoreHorizontal } from 'lucide-react';
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
        <div className="max-w-[1700px] w-full mx-auto px-3 sm:px-5 lg:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 font-bold text-sm sm:text-lg shrink-0">
              CB
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-slate-900 text-sm sm:text-lg tracking-tight shrink-0">
                  cvbagus<span className="text-emerald-600">.id</span>
                </span>
                {isSubscriptionActive ? (
                  <span className="text-[10px] sm:text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1 shrink-0">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span className="hidden xs:inline">Akses 1 Thn Aktif</span>
                    <span className="xs:hidden">Aktif</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenPayment}
                    className="hidden sm:inline-flex text-[10px] sm:text-[11px] font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 transition-colors cursor-pointer shrink-0"
                  >
                    Rp 25.000 / Thn
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-500 hidden xl:block truncate">Editor CV Profesional & Ramah ATS</p>
            </div>
          </div>

          {/* Mode Switcher: CV Editor vs Cover Letter Generator */}
          <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200/80 shrink-0">
            <button
              type="button"
              onClick={() => onSwitchMode?.('cv')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'cv'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Editor CV</span>
              <span className="xs:hidden">CV</span>
            </button>
            <button
              type="button"
              onClick={() => onSwitchMode?.('cover_letter')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'cover_letter'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xs:inline">Surat Lamaran</span>
              <span className="xs:hidden">Surat</span>
              <span className="hidden md:inline text-[9px] bg-amber-400/25 text-amber-950 font-black px-1.5 py-0.2 rounded-full uppercase">
                Bonus
              </span>
            </button>
          </div>

          {/* Contact Us Support Link */}
          <div className="hidden md:flex items-center ml-1 shrink-0">
            <button
              type="button"
              onClick={onOpenContact}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 transition-all cursor-pointer border border-transparent hover:border-emerald-200"
              title="Hubungi tim support & layanan bantuan resmi cvbagus.id"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-600" />
              <span>Contact Us</span>
            </button>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Mobile Navigation Dropdown Button */}
            <div className="lg:hidden relative">
              <button
                type="button"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200 shadow-2xs"
                title="Menu Navigasi Tambahan"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {mobileNavOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-50 animate-in fade-in zoom-in-95 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileNavOpen(false);
                      onSwitchMode?.(activeMode === 'cv' ? 'cover_letter' : 'cv');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors text-left cursor-pointer border border-emerald-200/60"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>{activeMode === 'cv' ? 'Surat Lamaran (Bonus)' : 'Kembali ke Editor CV'}</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileNavOpen(false);
                      onOpenContact?.();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors text-left cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-emerald-600" />
                    <span>Contact Us (Email)</span>
                  </button>
                </div>
              )}
            </div>

            {/* ONLY IN CV MODE: Show Template Gallery, Theme Popover, Language, Reset, and Download */}
            {activeMode === 'cv' && (
              <>
                {/* 10-Template Gallery Button */}
                <button
                  type="button"
                  onClick={handleOpenGalleryClick}
                  className="flex items-center gap-1.5 p-1 sm:p-1.5 pr-2 sm:pr-2.5 rounded-xl border border-emerald-500/50 bg-emerald-50/50 hover:bg-emerald-50 text-xs font-semibold text-slate-800 shrink-0 cursor-pointer transition-all"
                  title="Klik untuk memilih dari 10 templat CV"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-2xs shrink-0">
                    <LayoutTemplate className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-slate-800 text-xs truncate max-w-[70px] sm:max-w-[95px]">
                    {currentTemplate.name}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                </button>

                {/* Theme (Color & Font) Compact Popover */}
                <div className="relative shrink-0">
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

                {/* Language Selector (Bilingual: ID / EN) */}
                <div className="flex items-center bg-slate-100/90 p-0.5 rounded-xl border border-slate-200/90 shrink-0">
                  <button
                    type="button"
                    onClick={() => onUpdateTheme({ language: 'id' })}
                    className={`px-1.5 sm:px-2 py-1 rounded-lg text-[11px] sm:text-xs transition-all cursor-pointer font-bold ${
                      (theme.language || 'id') === 'id'
                        ? 'bg-white text-emerald-700 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    ID
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateTheme({ language: 'en' })}
                    className={`px-1.5 sm:px-2 py-1 rounded-lg text-[11px] sm:text-xs transition-all cursor-pointer font-bold ${
                      theme.language === 'en'
                        ? 'bg-white text-emerald-700 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    EN
                  </button>
                </div>

                {/* Reset & Clear Form Dropdown */}
                <div className="relative shrink-0">
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

                {/* Download / Print PDF Button */}
                <button
                  type="button"
                  disabled={isDownloading}
                  onClick={onDownloadClick}
                  className="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-3 sm:px-3.5 py-1.5 rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-75 cursor-pointer"
                  title="Unduh file CV Anda dalam format PDF standar A4 siap cetak"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin" />
                      <span className="hidden md:inline">Membuat...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 shrink-0" />
                      <span className="hidden md:inline">Unduh PDF</span>
                    </>
                  )}
                </button>
              </>
            )}

            {/* Auth Section */}
            <div className="pl-1 sm:pl-2 border-l border-slate-200">
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
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onOpenAuth('login')}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-emerald-700 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Masuk</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenAuth('register')}
                    className="hidden sm:flex items-center gap-1 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Daftar</span>
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
