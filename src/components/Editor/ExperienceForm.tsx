'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Experience } from '@/types/cv';
import {
  Plus,
  Trash2,
  Briefcase,
  Calendar,
  MapPin,
  Sparkles,
  Building2,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  GripVertical,
  RotateCcw,
  Key,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  X,
  Languages,
} from 'lucide-react';

interface ExperienceFormProps {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
  language?: 'id' | 'en';
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({ experiences, onChange, language = 'id' }) => {
  // Track collapsed state per experience ID
  const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>({});

  // Drag and drop state
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const isDraggingRef = useRef(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Gemini AI Translation States
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [translationError, setTranslationError] = useState<{ id: string; message: string } | null>(null);
  const [originalBackupMap, setOriginalBackupMap] = useState<Record<string, string>>({});
  const [successBadgeMap, setSuccessBadgeMap] = useState<Record<string, boolean>>({});
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [pendingTranslateIdx, setPendingTranslateIdx] = useState<number | null>(null);

  const getGeminiKey = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cvbagus_gemini_api_key') || '';
    }
    return '';
  };

  const handleTranslateDescription = async (idx: number, overrideKey?: string) => {
    const exp = experiences[idx];
    if (!exp) return;

    if (!exp.description || !exp.description.trim()) {
      setTranslationError({
        id: exp.id,
        message: 'Ketik deskripsi pekerjaan dalam bahasa Indonesia terlebih dahulu sebelum diterjemahkan.',
      });
      setTimeout(() => setTranslationError(null), 4000);
      return;
    }

    setTranslatingId(exp.id);
    setTranslationError(null);

    // Save previous text for undo support
    setOriginalBackupMap((prev) => ({
      ...prev,
      [exp.id]: exp.description,
    }));

    try {
      const customKey = overrideKey ?? getGeminiKey();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (customKey) {
        headers['x-gemini-key'] = customKey;
      }

      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          text: exp.description,
          role: exp.role,
          company: exp.company,
          targetLanguage: 'en',
        }),
      });

      const data = await res.json();

      if (res.status === 400 && data.needsKey) {
        setTranslatingId(null);
        setPendingTranslateIdx(idx);
        setApiKeyInput(customKey);
        setShowApiKeyModal(true);
        return;
      }

      if (!res.ok || !data.success || !data.translatedText) {
        setTranslationError({
          id: exp.id,
          message: data.error || 'Gagal menerjemahkan deskripsi dengan Gemini AI.',
        });
        setTranslatingId(null);
        return;
      }

      // Success! Update description with Gemini's professional English translation
      handleUpdate(idx, { description: data.translatedText });
      setSuccessBadgeMap((prev) => ({ ...prev, [exp.id]: true }));
      setTimeout(() => {
        setSuccessBadgeMap((prev) => ({ ...prev, [exp.id]: false }));
      }, 6000);
    } catch (err: any) {
      setTranslationError({
        id: exp.id,
        message: 'Terjadi gangguan jaringan saat menghubungi server AI.',
      });
    } finally {
      setTranslatingId(null);
    }
  };

  const handleUndoTranslation = (idx: number) => {
    const exp = experiences[idx];
    if (!exp) return;
    const backup = originalBackupMap[exp.id];
    if (backup) {
      handleUpdate(idx, { description: backup });
      setOriginalBackupMap((prev) => {
        const next = { ...prev };
        delete next[exp.id];
        return next;
      });
    }
  };

  const handleAdd = () => {
    const newId = `exp-${Date.now()}`;
    const newExp: Experience = {
      id: newId,
      role: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    // Ensure newly added item is open / expanded
    setCollapsedMap((prev) => ({ ...prev, [newId]: false }));
    onChange([...experiences, newExp]);
  };

  const handleUpdate = (index: number, updatedFields: Partial<Experience>) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], ...updatedFields };
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const expId = experiences[index]?.id;
    if (expId) {
      setCollapsedMap((prev) => {
        const next = { ...prev };
        delete next[expId];
        return next;
      });
    }
    const updated = experiences.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...experiences];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    onChange(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === experiences.length - 1) return;
    const updated = [...experiences];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    onChange(updated);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedIdx(idx);
    isDraggingRef.current = true;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(idx));

    const el = cardRefs.current[idx];
    if (el && e.dataTransfer.setDragImage) {
      const rect = el.getBoundingClientRect();
      e.dataTransfer.setDragImage(el, Math.min(e.clientX - rect.left, 60), 20);
    }
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIdx !== idx) {
      setDragOverIdx(idx);
    }
  };

  const handleDragLeave = (e: React.DragEvent, idx: number) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    if (dragOverIdx === idx) {
      setDragOverIdx(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedIdx === null || draggedIdx === targetIdx) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      return;
    }

    const updated = [...experiences];
    const [movedItem] = updated.splice(draggedIdx, 1);
    updated.splice(targetIdx, 0, movedItem);

    setDraggedIdx(null);
    setDragOverIdx(null);
    onChange(updated);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 100);
  };

  const toggleCollapse = (id: string) => {
    setCollapsedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const allCollapsed = experiences.length > 0 && experiences.every((exp) => !!collapsedMap[exp.id]);

  const toggleAllCollapse = () => {
    if (allCollapsed) {
      // Expand all
      setCollapsedMap({});
    } else {
      // Collapse all
      const newMap: Record<string, boolean> = {};
      experiences.forEach((exp) => {
        newMap[exp.id] = true;
      });
      setCollapsedMap(newMap);
    }
  };

  const handleAddBullet = (index: number) => {
    const current = experiences[index].description || '';
    const trimmed = current.trim();
    const addition = trimmed === '' ? '• ' : (current.endsWith('\n') ? '• ' : '\n• ');
    handleUpdate(index, { description: current + addition });
  };

  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 flex-wrap gap-2">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-600" />
            <span>Riwayat Pengalaman Kerja</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tuliskan pekerjaan mulai dari posisi terbaru ke yang terdahulu. Geser (drag & drop) atau gunakan tombol panah untuk mengubah urutan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {experiences.length > 1 && (
            <button
              type="button"
              onClick={toggleAllCollapse}
              className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              {allCollapsed ? 'Buka Semua' : 'Ciutkan Semua'}
            </button>
          )}
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1.5 text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 px-3 py-1.5 rounded-xl transition-all border border-emerald-200 shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Posisi</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {experiences.length === 0 ? (
        <div className="text-center py-10 px-4 bg-slate-50/80 rounded-2xl border-2 border-dashed border-slate-200 space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
            <Briefcase className="w-6 h-6" />
          </div>
          <h4 className="text-xs font-bold text-slate-800">Belum Ada Pengalaman Kerja Ditambahkan</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tambahkan riwayat magang, freelance, kontrak, atau pekerjaan tetap untuk memikat rekruter.
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Pengalaman Pertama</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {experiences.map((exp, idx) => {
            const isCollapsed = !!collapsedMap[exp.id];
            const isDragging = draggedIdx === idx;
            const isDragOver = dragOverIdx === idx && draggedIdx !== null && draggedIdx !== idx;

            return (
              <div
                key={exp.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragLeave={(e) => handleDragLeave(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                className={`bg-white border rounded-2xl transition-all relative ${
                  isDragging
                    ? 'opacity-40 border-dashed border-emerald-500 bg-emerald-50/40 scale-[0.99] shadow-none'
                    : isDragOver
                    ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20 shadow-md scale-[1.01]'
                    : isCollapsed
                    ? 'border-slate-200/80 hover:border-slate-300 shadow-2xs p-3.5 sm:p-4'
                    : 'border-slate-200/90 hover:border-slate-300 shadow-xs p-4 sm:p-5 space-y-4'
                }`}
              >
                {/* Drag target drop preview indicator */}
                {isDragOver && (
                  <div className="absolute -top-3 left-6 z-10 px-2.5 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full shadow-md pointer-events-none flex items-center gap-1 animate-pulse">
                    <span>Lepas untuk memindahkan ke urutan #{idx + 1}</span>
                  </div>
                )}

                {/* Card Header (Draggable & Collapsible) */}
                <div
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragEnd={handleDragEnd}
                  onClick={() => {
                    if (!isDraggingRef.current) {
                      toggleCollapse(exp.id);
                    }
                  }}
                  className={`flex items-center justify-between cursor-pointer select-none transition-colors group ${
                    isCollapsed ? '' : 'pb-3 border-b border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap flex-1 min-w-0 pr-2">
                    {/* Drag Handle with GripVertical */}
                    <div
                      className="p-1 -ml-1 text-slate-400 group-hover:text-slate-600 hover:text-emerald-600 cursor-grab active:cursor-grabbing rounded hover:bg-slate-100 transition-colors shrink-0"
                      title="Tahan & geser untuk mengubah urutan (Drag to reorder)"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>

                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black shrink-0">
                      {idx + 1}
                    </div>
                    <span
                      className={`text-xs font-extrabold truncate ${
                        exp.role ? 'text-slate-800 group-hover:text-emerald-700' : 'text-slate-400 italic'
                      }`}
                    >
                      {exp.role || `Pengalaman Kerja #${idx + 1}`}
                    </span>
                    {exp.company && (
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[160px] sm:max-w-[240px]">{exp.company}</span>
                      </span>
                    )}
                  </div>

                  {/* Actions: Move Up, Move Down, Delete, Expand/Collapse Toggle */}
                  <div
                    className="flex items-center gap-0.5 sm:gap-1 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Move Up */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveUp(idx)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        idx === 0
                          ? 'text-slate-200 cursor-not-allowed'
                          : 'text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 cursor-pointer active:scale-95'
                      }`}
                      title={idx === 0 ? 'Sudah di urutan teratas' : 'Pindah urutan ke atas'}
                    >
                      <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      disabled={idx === experiences.length - 1}
                      onClick={() => handleMoveDown(idx)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        idx === experiences.length - 1
                          ? 'text-slate-200 cursor-not-allowed'
                          : 'text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 cursor-pointer active:scale-95'
                      }`}
                      title={idx === experiences.length - 1 ? 'Sudah di urutan terbawah' : 'Pindah urutan ke bawah'}
                    >
                      <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                      title="Hapus pengalaman ini"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>

                    {/* Toggle Expand/Collapse */}
                    <button
                      type="button"
                      onClick={() => toggleCollapse(exp.id)}
                      className="text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 p-1.5 rounded-lg transition-colors cursor-pointer ml-0.5"
                      title={isCollapsed ? 'Klik untuk membuka formulir (Expand)' : 'Klik untuk menutup formulir (Collapse)'}
                    >
                      {isCollapsed ? (
                        <ChevronDown className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Form fields: ONLY rendered when NOT collapsed */}
                {!isCollapsed && (
                  <div className="space-y-4 pt-1">

              {/* Row 1: Role & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Posisi / Jabatan Pekerjaan
                  </label>
                  <input
                    type="text"
                    spellCheck={false}
                    value={exp.role}
                    onChange={(e) => handleUpdate(idx, { role: e.target.value })}
                    placeholder="Contoh: Senior Full Stack Developer"
                    className="w-full text-xs px-3 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl transition-all text-slate-800 placeholder:text-slate-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Perusahaan / Organisasi
                  </label>
                  <input
                    type="text"
                    spellCheck={false}
                    value={exp.company}
                    onChange={(e) => handleUpdate(idx, { company: e.target.value })}
                    placeholder="Contoh: PT Solusi Teknologi Nusantara"
                    className="w-full text-xs px-3 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl transition-all text-slate-800 placeholder:text-slate-400 outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Location, Start Date, End Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Lokasi / Domisili
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      spellCheck={false}
                      value={exp.location}
                      onChange={(e) => handleUpdate(idx, { location: e.target.value })}
                      placeholder="Jakarta / Remote"
                      className="w-full text-xs pl-8 pr-3 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl transition-all text-slate-800 placeholder:text-slate-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mulai Bekerja
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      spellCheck={false}
                      value={exp.startDate}
                      onChange={(e) => handleUpdate(idx, { startDate: e.target.value })}
                      placeholder="Jan 2021"
                      className="w-full text-xs pl-8 pr-3 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl transition-all text-slate-800 placeholder:text-slate-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Selesai Bekerja
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      spellCheck={false}
                      disabled={exp.current}
                      value={exp.current ? 'Sekarang (Aktif)' : exp.endDate}
                      onChange={(e) => handleUpdate(idx, { endDate: e.target.value })}
                      placeholder="Bln / Thn"
                      className={`w-full text-xs pl-8 pr-3 py-2.5 rounded-xl border transition-all outline-none ${
                        exp.current
                          ? 'bg-emerald-50/80 text-emerald-800 font-bold border-emerald-300'
                          : 'bg-slate-50/70 hover:bg-white focus:bg-white border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-800 placeholder:text-slate-400'
                      }`}
                    />
                  </div>
                  <label className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer select-none mt-1.5">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) =>
                        handleUpdate(idx, {
                          current: e.target.checked,
                          endDate: e.target.checked ? 'Sekarang' : '',
                        })
                      }
                      className="w-3.5 h-3.5 accent-emerald-600 rounded cursor-pointer shrink-0"
                    />
                    <span className="whitespace-nowrap">Masih bekerja di sini</span>
                  </label>
                </div>
              </div>

              {/* Row 3: Bullet points / Responsibilities */}
              <div className="pt-1">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-700">
                      Tanggung Jawab & Pencapaian Utama
                    </label>
                    {language === 'en' && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Mode CV English
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Undo to original Indonesian text if translated */}
                    {originalBackupMap[exp.id] && (
                      <button
                        type="button"
                        onClick={() => handleUndoTranslation(idx)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer border border-slate-200"
                        title="Kembalikan teks bahasa Indonesia sebelumnya"
                      >
                        <RotateCcw className="w-3 h-3 text-slate-500" />
                        <span>Teks Asli</span>
                      </button>
                    )}

                    {/* Add Bullet Button */}
                    <button
                      type="button"
                      onClick={() => handleAddBullet(idx)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      <span>+ Poin (•)</span>
                    </button>

                    {/* Gemini AI Translate Button */}
                    <button
                      type="button"
                      disabled={translatingId === exp.id}
                      onClick={() => handleTranslateDescription(idx)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 active:scale-98 px-3 py-1 rounded-lg shadow-xs shadow-emerald-700/20 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      title="Terjemahkan ke Bahasa Inggris profesional standar ATS menggunakan Google Gemini AI"
                    >
                      {translatingId === exp.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                          <span>Menerjemahkan (Gemini AI)...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                          <span>Translate English (Gemini AI)</span>
                        </>
                      )}
                    </button>

                    {/* Key Setting Icon */}
                    <button
                      type="button"
                      onClick={() => {
                        setApiKeyInput(getGeminiKey());
                        setShowApiKeyModal(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                      title="Pengaturan Google Gemini API Key"
                    >
                      <Key className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  rows={5}
                  spellCheck={false}
                  value={exp.description}
                  onChange={(e) => handleUpdate(idx, { description: e.target.value })}
                  placeholder="• Memimpin pengembangan fitur checkout baru dan integrasi payment gateway.&#10;• Meningkatkan kecepatan rendering halaman sebesar 35% melalui migrasi Next.js.&#10;• Membimbing 4 junior developer dalam penulisan clean code dan unit test."
                  className={`w-full text-xs p-3.5 bg-slate-50/70 hover:bg-white focus:bg-white border rounded-xl leading-relaxed resize-y transition-all text-slate-800 placeholder:text-slate-400 outline-none ${
                    translatingId === exp.id
                      ? 'border-emerald-400 ring-2 ring-emerald-400/20 bg-emerald-50/30'
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                />

                {/* Success Badge */}
                {successBadgeMap[exp.id] && (
                  <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 animate-in fade-in duration-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">
                      Diterjemahkan secara profesional ke Bahasa Inggris standar HRD internasional dengan Gemini AI! ✨
                    </span>
                  </div>
                )}

                {/* Error Alert */}
                {translationError && translationError.id === exp.id && (
                  <div className="mt-2 p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-xs text-red-700 animate-in fade-in duration-200">
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{translationError.message}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setApiKeyInput(getGeminiKey());
                        setShowApiKeyModal(true);
                      }}
                      className="text-[11px] font-bold text-red-800 underline ml-2 cursor-pointer hover:text-red-950"
                    >
                      Setel API Key
                    </button>
                  </div>
                )}

                <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                  <span>💡</span>
                  <span>
                    <strong>Tips Gemini AI:</strong> Menerjemahkan deskripsi dengan kata kerja aksi internasional (seperti <em>Spearheaded, Orchestrated, Engineered</em>) untuk mendongkrak skor lolos ATS HRD global.
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      );
    })}

          {/* Add Another Position Button at bottom */}
          <button
            type="button"
            onClick={handleAdd}
            className="w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-slate-600 hover:text-emerald-700 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Posisi Pengalaman Lainnya</span>
          </button>
        </div>
      )}

      {/* Google Gemini API Key Setup Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              type="button"
              onClick={() => {
                setShowApiKeyModal(false);
                setPendingTranslateIdx(null);
              }}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Google Gemini AI Setup</h3>
                <p className="text-xs text-slate-500">Translate CV Profesional Standar HRD Global</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed mb-5">
              <p>
                Fitur ini menggunakan <strong>Google Gemini AI</strong> untuk menerjemahkan dan memoles deskripsi pekerjaan ke Bahasa Inggris korporat dengan <em>action verbs</em> dan struktur ATS-Friendly (bukan translasi harfiah Google Translate).
              </p>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                <p className="font-semibold text-emerald-900 mb-1">
                  🎁 100% Gratis dari Google AI Studio:
                </p>
                <p className="text-[11px] text-emerald-800">
                  Anda dapat membuat API key gratis dalam 1 menit tanpa kartu kredit di Google AI Studio.
                </p>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900 underline mt-1.5 text-[11px]"
                >
                  <span>Buka Google AI Studio (Dapatkan API Key)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Google Gemini API Key
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="Contoh: AIzaSyD..."
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl outline-none font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  *API Key disimpan di browser Anda (atau di file .env server) dan hanya digunakan untuk menerjemahkan CV Anda.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowApiKeyModal(false);
                  setPendingTranslateIdx(null);
                }}
                className="flex-1 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    if (apiKeyInput.trim()) {
                      localStorage.setItem('cvbagus_gemini_api_key', apiKeyInput.trim());
                    } else {
                      localStorage.removeItem('cvbagus_gemini_api_key');
                    }
                  }
                  setShowApiKeyModal(false);
                  if (pendingTranslateIdx !== null) {
                    const idxToRun = pendingTranslateIdx;
                    setPendingTranslateIdx(null);
                    handleTranslateDescription(idxToRun, apiKeyInput.trim());
                  }
                }}
                className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                Simpan & Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
