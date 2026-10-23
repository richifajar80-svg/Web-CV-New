'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  Cloud,
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
  activeCVTitle?: string;
  saveStatus?: 'saved' | 'saving' | 'unsaved';
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
  activeCVTitle,
  saveStatus = 'saved',
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

  const themeMenuRef = useRef<HTMLDivElement>(null);
  const resetMenuRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  // Close any open header popover when clicking/touching anywhere outside or pressing Escape
  useEffect(() => {
    const handleOutsideInteraction = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (themeMenuRef.current && !themeMenuRef.current.contains(target)) {
        setThemeMenuOpen(false);
      }
      if (resetMenuRef.current && !resetMenuRef.current.contains(target)) {
        setResetMenuOpen(false);
      }
      if (mobileNavRef.current && !mobileNavRef.current.contains(target)) {
        setMobileNavOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setThemeMenuOpen(false);
        setResetMenuOpen(false);
        setMobileNavOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideInteraction);
    document.addEventListener('touchstart', handleOutsideInteraction);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideInteraction);
      document.removeEventListener('touchstart', handleOutsideInteraction);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
        <div className="max-w-[1700px] w-full mx-auto px-2.5 sm:px-4 lg:px-5 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-2 min-w-0">
          
          {/* 1. Logo, Brand & Auto-Save Indicator */}
          <div className="flex items-center gap-2 shrink-0 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 font-bold text-sm sm:text-base shrink-0">
              CB
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-sm sm:text-base lg:text-lg tracking-tight shrink-0">
                  cvbagus<span className="text-emerald-600">.id</span>
                </span>
                {isSubscriptionActive ? (
                  <span className="hidden xl:inline-flex text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300 items-center gap-1 shrink-0">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="hidden 2xl:inline">Akses 1 Thn Aktif</span>
                    <span className="2xl:hidden">PRO</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenPayment}
                    className="hidden xl:inline-flex text-[10px] font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 transition-colors cursor-pointer shrink-0"
                  >
                    Rp 25rb/Thn
                  </button>
                )}

                {/* Auto-Save Cloud Status Indicator */}
                <div
                  className={`hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold transition-all shrink-0 select-none border ${
                    saveStatus === 'saving'
                      ? 'bg-amber-50/90 text-amber-800 border-amber-200 animate-pulse'
                      : saveStatus === 'unsaved'
                      ? 'bg-slate-100 text-slate-500 border-slate-200'
                      : 'bg-emerald-50/80 text-emerald-800 border-emerald-200/80'
                  }`}
                  title={
                    saveStatus === 'saving'
                      ? 'Sedang menyimpan otomatis ke akun...'
                      : saveStatus === 'unsaved'
                      ? 'Ada perubahan belum tersimpan'
                      : 'Semua perubahan tersimpan otomatis di akun Anda'
                  }
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <Loader2 className="w-2.5 h-2.5 text-amber-600 animate-spin shrink-0" />
                      <span className="hidden 2xl:inline font-bold">Menyimpan...</span>
                    </>
                  ) : saveStatus === 'unsaved' ? (
                    <>
                      <Cloud className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                      <span className="hidden 2xl:inline">Draf</span>
                    </>
                  ) : (
                    <>
                      <Cloud className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                      <span className="hidden 2xl:inline font-bold">Tersimpan</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Desktop Mode Switcher: CV Editor vs Cover Letter Generator */}
          <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 shrink-0">
            <button
              type="button"
              onClick={() => onSwitchMode?.('cv')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeMode === 'cv'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>Editor CV</span>
            </button>
            <button
              type="button"
              onClick={() => onSwitchMode?.('cover_letter')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeMode === 'cover_letter'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Surat, Email & WA HRD</span>
              <span className="text-[9px] bg-amber-400/25 text-amber-950 font-black px-1.5 py-0.2 rounded-full uppercase hidden 2xl:inline-block">
                Bonus
              </span>
            </button>
          </div>

          {/* 4. Action Controls Bar (Carefully responsive on mobile & desktop) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">

            {/* ONLY IN CV MODE: Template Gallery, Theme Popover, Language, Reset, and Download */}
            {activeMode === 'cv' && (
              <>
                {/* Template Gallery Picker (Compact, Single-Line & Clearly Labeled) */}
                <button
                  type="button"
                  onClick={handleOpenGalleryClick}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border-2 border-emerald-500/80 bg-emerald-50/90 hover:bg-emerald-100/90 text-slate-800 text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer group active:scale-98 shrink-0 whitespace-nowrap"
                  title="Klik untuk memilih dari 10+ pilihan templat & desain CV"
                >
                  <LayoutTemplate className="w-3.5 h-3.5 text-emerald-700 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-emerald-800 font-semibold hidden sm:inline">Pilih Template:</span>
                  <span className="text-emerald-800 font-semibold sm:hidden">Template:</span>
                  <span className="font-extrabold text-slate-900 truncate max-w-[75px] sm:max-w-[95px] xl:max-w-[120px]">
                    {currentTemplate.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-700 shrink-0 group-hover:translate-y-0.5 transition-transform" />
                </button>

                {/* Theme (Color & Font) Compact Popover - Hidden on mobile, accessible in ... menu */}
                <div ref={themeMenuRef} className="hidden md:block relative shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setResetMenuOpen(false);
                      setMobileNavOpen(false);
                      setThemeMenuOpen(!themeMenuOpen);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer whitespace-nowrap"
                    title="Atur warna aksen & jenis font CV"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shadow-2xs border border-white shrink-0"
                      style={{ backgroundColor: theme.accentColor || '#1e40af' }}
                    />
                    <span className="capitalize font-semibold text-[11px] hidden xl:inline">
                      Warna & {theme.fontFamily || 'Sans'}
                    </span>
                    <span className="capitalize font-semibold text-[11px] xl:hidden">
                      Tema
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                  </button>

                  {themeMenuOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150 space-y-3">
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
                                setThemeMenuOpen(false);
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
                            onClick={() => {
                              onUpdateTheme({ fontFamily: 'sans' });
                              setThemeMenuOpen(false);
                            }}
                            className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                              (theme.fontFamily || 'sans') === 'sans'
                                ? 'bg-white text-emerald-700 shadow-2xs font-extrabold'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Sans
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateTheme({ fontFamily: 'serif' });
                              setThemeMenuOpen(false);
                            }}
                            className={`py-1.5 rounded-lg font-serif transition-all cursor-pointer ${
                              theme.fontFamily === 'serif'
                                ? 'bg-white text-emerald-700 shadow-2xs font-extrabold'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Serif
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateTheme({ fontFamily: 'mono' });
                              setThemeMenuOpen(false);
                            }}
                            className={`py-1.5 rounded-lg font-mono transition-all cursor-pointer ${
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
                  )}
                </div>

                {/* Reset & Clear Form Dropdown - Hidden on mobile, in ... menu */}
                <div ref={resetMenuRef} className="hidden lg:block relative shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setThemeMenuOpen(false);
                      setMobileNavOpen(false);
                      setResetMenuOpen(!resetMenuOpen);
                    }}
                    title="Opsi Reset & Kosongkan Data"
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 flex items-center cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>

                  {resetMenuOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150 space-y-1">
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
                  )}
                </div>

                {/* Contact Us Link - Directly to the left of Unduh PDF */}
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-800 bg-slate-50 hover:bg-emerald-50/80 transition-all cursor-pointer border border-slate-200 hover:border-emerald-300 shadow-2xs shrink-0 whitespace-nowrap"
                  title="Hubungi tim support & bantuan resmi cvbagus.id"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="hidden xl:inline">Contact Us</span>
                </button>

                {/* Download / Print PDF Button (Visible on sm+ in header; on <640px phones it lives in the Fixed Bottom Action Bar) */}
                <button
                  type="button"
                  disabled={isDownloading}
                  onClick={onDownloadClick}
                  className="shrink-0 whitespace-nowrap hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95 disabled:opacity-75 cursor-pointer"
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
            <div ref={mobileNavRef} className="lg:hidden relative shrink-0">
              <button
                type="button"
                onClick={() => {
                  setThemeMenuOpen(false);
                  setResetMenuOpen(false);
                  setMobileNavOpen(!mobileNavOpen);
                }}
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
                      <span>{activeMode === 'cv' ? 'Chat WA, Email & Surat Lamaran' : 'Kembali ke Editor CV'}</span>
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

