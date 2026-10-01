'use client';

import React, { useState, useRef } from 'react';
import { Education } from '@/types/cv';
import {
  Plus,
  Trash2,
  GraduationCap,
  School,
  MapPin,
  Calendar,
  Award,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  GripVertical,
} from 'lucide-react';

interface EducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({ education, onChange }) => {
  // Track collapsed state per education ID
  const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>({});

  // Drag and drop state
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const isDraggingRef = useRef(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleAdd = () => {
    const newId = `edu-${Date.now()}`;
    const newEdu: Education = {
      id: newId,
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
      description: '',
    };
    // Ensure newly added item is open / expanded
    setCollapsedMap((prev) => ({ ...prev, [newId]: false }));
    onChange([...education, newEdu]);
  };

  const handleUpdate = (index: number, updatedFields: Partial<Education>) => {
    const updated = [...education];
    updated[index] = { ...updated[index], ...updatedFields };
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const eduId = education[index]?.id;
    if (eduId) {
      setCollapsedMap((prev) => {
        const next = { ...prev };
        delete next[eduId];
        return next;
      });
    }
    const updated = education.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...education];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    onChange(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === education.length - 1) return;
    const updated = [...education];
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

    const updated = [...education];
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

  const allCollapsed = education.length > 0 && education.every((edu) => !!collapsedMap[edu.id]);

  const toggleAllCollapse = () => {
    if (allCollapsed) {
      setCollapsedMap({});
    } else {
      const newMap: Record<string, boolean> = {};
      education.forEach((edu) => {
        newMap[edu.id] = true;
      });
      setCollapsedMap(newMap);
    }
  };

  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 flex-wrap gap-2">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>Pendidikan Formal</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Gelar akademik, universitas, atau sekolah. Geser (drag & drop) atau gunakan panah untuk mengurutkan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {education.length > 1 && (
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
            <span>Tambah Pendidikan</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {education.length === 0 ? (
        <div className="text-center py-10 px-4 bg-slate-50/80 rounded-2xl border-2 border-dashed border-slate-200 space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h4 className="text-xs font-bold text-slate-800">Belum Ada Riwayat Pendidikan</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tambahkan latar belakang pendidikan terakhir untuk melengkapi kualifikasi akademik Anda.
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Riwayat Pendidikan</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {education.map((edu, idx) => {
            const isCollapsed = !!collapsedMap[edu.id];
            const isDragging = draggedIdx === idx;
            const isDragOver = dragOverIdx === idx && draggedIdx !== null && draggedIdx !== idx;

            return (
              <div
                key={edu.id}
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
                {/* Drag target indicator */}
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
                      toggleCollapse(edu.id);
                    }
                  }}
                  className={`flex items-center justify-between cursor-pointer select-none transition-colors group ${
                    isCollapsed ? '' : 'pb-3 border-b border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap flex-1 min-w-0 pr-2">
                    {/* Drag Handle */}
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
                        edu.degree ? 'text-slate-800 group-hover:text-emerald-700' : 'text-slate-400 italic'
                      }`}
                    >
                      {edu.degree || `Pendidikan #${idx + 1}`}
                    </span>
                    {edu.institution && (
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                        <School className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[160px] sm:max-w-[240px]">{edu.institution}</span>
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
                      disabled={idx === education.length - 1}
                      onClick={() => handleMoveDown(idx)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        idx === education.length - 1
                          ? 'text-slate-200 cursor-not-allowed'
                          : 'text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 cursor-pointer active:scale-95'
                      }`}
                      title={idx === education.length - 1 ? 'Sudah di urutan terbawah' : 'Pindah urutan ke bawah'}
                    >
                      <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                      title="Hapus riwayat ini"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>

                    {/* Toggle Expand/Collapse */}
                    <button
                      type="button"
                      onClick={() => toggleCollapse(edu.id)}
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
                    {/* Row 1: Degree & Institution */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Gelar / Jenjang & Jurusan
                        </label>
                        <input
                          type="text"
                          spellCheck={false}
                          value={edu.degree}
                          onChange={(e) => handleUpdate(idx, { degree: e.target.value })}
                          placeholder="Contoh: S1 Ilmu Komputer"
                          className="w-full text-xs px-3 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl transition-all text-slate-800 placeholder:text-slate-400 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Nama Universitas / Institusi
                        </label>
                        <input
                          type="text"
                          spellCheck={false}
                          value={edu.institution}
                          onChange={(e) => handleUpdate(idx, { institution: e.target.value })}
                          placeholder="Contoh: Universitas Indonesia"
                          className="w-full text-xs px-3 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl transition-all text-slate-800 placeholder:text-slate-400 outline-none"
                        />
                      </div>
                    </div>

                    {/* Row 2: Location, Start Year, End Year */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Kota Kampus
                        </label>
                        <div className="relative">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            spellCheck={false}
                            value={edu.location}
                            onChange={(e) => handleUpdate(idx, { location: e.target.value })}
                            placeholder="Depok / Jakarta"
                            className="w-full text-xs pl-8 pr-3 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl transition-all text-slate-800 placeholder:text-slate-400 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Tahun Masuk
                        </label>
                        <div className="relative">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            spellCheck={false}
                            value={edu.startDate}
                            onChange={(e) => handleUpdate(idx, { startDate: e.target.value })}
                            placeholder="2018"
                            className="w-full text-xs pl-8 pr-3 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl transition-all text-slate-800 placeholder:text-slate-400 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Tahun Lulus
                        </label>
                        <div className="relative">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            spellCheck={false}
                            value={edu.endDate}
                            onChange={(e) => handleUpdate(idx, { endDate: e.target.value })}
                            placeholder="2022 (atau Sekarang)"
                            className="w-full text-xs pl-8 pr-3 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl transition-all text-slate-800 placeholder:text-slate-400 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 3: GPA & Description */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Nilai IPK / GPA (Opsional)
                        </label>
                        <div className="relative">
                          <Award className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            spellCheck={false}
                            value={edu.gpa || ''}
                            onChange={(e) => handleUpdate(idx, { gpa: e.target.value })}
                            placeholder="Contoh: 3.85 / 4.00"
                            className="w-full text-xs pl-8 pr-3 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl transition-all text-slate-800 placeholder:text-slate-400 outline-none"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Prestasi / Fokus Studi / Judul Skripsi (Opsional)
                        </label>
                        <input
                          type="text"
                          spellCheck={false}
                          value={edu.description || ''}
                          onChange={(e) => handleUpdate(idx, { description: e.target.value })}
                          placeholder="Contoh: Lulusan Cum Laude, Fokus Arsitektur Sistem Terdistribusi"
                          className="w-full text-xs px-3 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl transition-all text-slate-800 placeholder:text-slate-400 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Another Education Button at bottom */}
          <button
            type="button"
            onClick={handleAdd}
            className="w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-slate-600 hover:text-emerald-700 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Riwayat Pendidikan Lainnya</span>
          </button>
        </div>
      )}
    </div>
  );
};
