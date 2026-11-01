'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CVData } from '@/types/cv';
import { getUserAuthHeaders, useAuth } from '@/context/AuthContext';
import {
  X,
  Target,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  Copy,
  Check,
  Briefcase,
  Plus,
} from 'lucide-react';

interface JobMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvData: CVData;
  onAddSkills?: (newSkills: string[]) => void;
  onOpenAuth?: () => void;
}

interface MatchResult {
  matchScore: number;
  verdict: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  tips: string[];
}

export const JobMatcherModal: React.FC<JobMatcherModalProps> = ({
  isOpen,
  onClose,
  cvData,
  onAddSkills,
  onOpenAuth,
}) => {
  const { user } = useAuth();
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);
  const [addedSkillsMap, setAddedSkillsMap] = useState<Record<string, boolean>>({});

  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || jobDescription.trim().length < 20) {
      setErrorMsg('Harap tempelkan teks kualifikasi/deskripsi lowongan kerja minimal 20 karakter.');
      return;
    }

    if (!user) {
      setErrorMsg('Silakan masuk atau buat akun gratis terlebih dahulu untuk menggunakan fitur AI Job Matcher.');
      if (onOpenAuth) onOpenAuth();
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      const candidateExperiences = (cvData.experiences || []).map(
        (e) => `${e.role} di ${e.company}: ${e.description}`
      );
      const candidateSkills = (cvData.skills || []).map((s) => s.name);

      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: getUserAuthHeaders(),
        body: JSON.stringify({
          action: 'job_match',
          jobDescription,
          candidateTitle: cvData.personalInfo.jobTitle,
          candidateSummary: cvData.summary,
          candidateExperiences,
          candidateSkills,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.needsAuth && onOpenAuth) {
          onOpenAuth();
        }
        throw new Error(data.error || 'Gagal menganalisis lowongan kerja.');
      }

      setResult(data.result as MatchResult);
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses data dengan AI.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyword(text);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  const handleAddKeywordToSkills = (keyword: string) => {
    if (onAddSkills) {
      onAddSkills([keyword]);
      setAddedSkillsMap((prev) => ({ ...prev, [keyword]: true }));
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-300' };
    if (score >= 60) return { bg: 'bg-blue-500', text: 'text-blue-700', border: 'border-blue-300' };
    return { bg: 'bg-amber-500', text: 'text-amber-700', border: 'border-amber-300' };
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">AI Job Matcher & ATS Scanner</h3>
              <p className="text-[11px] text-white/80">
                Uji kecocokan CV Anda dengan lowongan kerja target sebelum melamar
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Instructions */}
          {!result && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                  <span>Tempelkan Teks Lowongan Kerja (Job Vacancy / Loker):</span>
                  <span className="text-[11px] font-normal text-slate-500">
                    Dari JobStreet, Glints, LinkedIn, atau WhatsApp
                  </span>
                </label>
                <textarea
                  rows={7}
                  value={jobDescription}
                  onChange={(e) => {
                    setJobDescription(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Contoh:&#10;Dicari: Store Supervisor (Malang)&#10;Kualifikasi:&#10;• Pria/Wanita, Usia maks. 35 tahun&#10;• Pengalaman minimal 2 tahun di bidang ritel / store supervisor&#10;• Mahir manajemen stok (Stock Opname) & sistem POS&#10;• Mampu memimpin tim penjualan mencapai target omset harian..."
                  className="w-full text-xs sm:text-[13px] font-medium p-3.5 bg-slate-50 border-2 border-slate-300 hover:border-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 rounded-2xl outline-none transition-all leading-relaxed placeholder:text-slate-400"
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI sedang memindai kata kunci & menganalisis kecocokan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analisis Kecocokan dengan CV Saya</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Result View */}
          {result && (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Score Card */}
              <div className="bg-gradient-to-r from-slate-50 via-emerald-50/40 to-teal-50/30 p-4 sm:p-5 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="relative w-20 h-20 shrink-0 flex items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
                  <div className="text-center">
                    <span className="text-2xl font-black">{result.matchScore}%</span>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-emerald-100">
                      Match Score
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                    {result.verdict}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Analisis kecocokan posisi <strong>{cvData.personalInfo.jobTitle || 'kandidat'}</strong> dengan kebutuhan perusahaan target.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors shrink-0"
                >
                  Uji Loker Lain
                </button>
              </div>

              {/* Matched Keywords */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Kata Kunci yang Sudah Cocok di CV Anda ({result.matchedKeywords.length}):</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.matchedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg inline-flex items-center gap-1"
                    >
                      <span>✓ {kw}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Kata Kunci Penting yang Belum Ada di CV ({result.missingKeywords.length}):</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-normal">Klik untuk tambah ke keahlian</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((kw, i) => {
                    const isAdded = Boolean(addedSkillsMap[kw]);
                    return (
                      <span
                        key={i}
                        className="text-xs font-semibold px-2.5 py-1.5 bg-amber-50 text-amber-900 border border-amber-300 rounded-xl inline-flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>+ {kw}</span>
                        {onAddSkills && (
                          <button
                            type="button"
                            onClick={() => handleAddKeywordToSkills(kw)}
                            disabled={isAdded}
                            className={`p-1 rounded-md transition-colors ${
                              isAdded
                                ? 'bg-emerald-600 text-white cursor-default'
                                : 'bg-white hover:bg-amber-100 text-amber-700 cursor-pointer'
                            }`}
                            title={isAdded ? 'Sudah ditambahkan' : 'Tambahkan ke Keahlian'}
                          >
                            {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleCopy(kw)}
                          className="p-1 hover:bg-amber-100 rounded-md text-amber-700 transition-colors cursor-pointer"
                          title="Salin kata kunci"
                        >
                          {copiedKeyword === kw ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Recommendations / Tips */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Saran Perbaikan Instan Agar Lolos Screening HRD:</span>
                </div>
                <ul className="space-y-1.5">
                  {result.tips.map((tip, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                      <span className="font-bold text-emerald-600 shrink-0 mt-0.5">•</span>
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};
