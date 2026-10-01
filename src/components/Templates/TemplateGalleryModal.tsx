'use client';

import React, { useState } from 'react';
import { TemplateId } from '@/types/cv';
import { TEMPLATE_LIST } from '@/data/templates';
import { TemplateThumbnail } from './TemplateThumbnail';
import { X, Check, LayoutTemplate } from 'lucide-react';

interface TemplateGalleryModalProps {
  isOpen: boolean;
  selectedTemplate: TemplateId;
  accentColor?: string;
  onSelectTemplate: (id: TemplateId) => void;
  onClose: () => void;
}

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({
  isOpen,
  selectedTemplate,
  accentColor = '#1e40af',
  onSelectTemplate,
  onClose,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('Semua');

  // Close modal on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = ['Semua', 'Populer HRD', 'ATS Friendly', 'Formal & BUMN', 'Kreatif'];

  const filteredTemplates =
    filterCategory === 'Semua'
      ? TEMPLATE_LIST
      : TEMPLATE_LIST.filter((t) => t.category === filterCategory);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex min-h-full items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-5xl bg-slate-50 rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs shrink-0">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                Pilih Dari 10 Templat CV Pilihan HRD
              </h2>
              <p className="text-xs text-slate-500">
                Format standar lolos filter ATS dan disukai rekruter profesional Indonesia & Global.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Categories Bar */}
        <div className="px-4 sm:px-6 py-2.5 border-b border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none bg-white shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                filterCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Visual Templates Grid with generous bottom clearance */}
        <div className="p-4 sm:p-6 pb-12 sm:pb-16 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredTemplates.map((template) => {
            const isSelected = selectedTemplate === template.id;
            return (
              <div
                key={template.id}
                onClick={() => {
                  onSelectTemplate(template.id);
                  onClose();
                }}
                className={`relative rounded-2xl bg-white p-4 cursor-pointer transition-all flex flex-col justify-between group shadow-xs hover:shadow-xl border-2 ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-slate-200/90 hover:border-emerald-500'
                }`}
              >
                {/* 1. Title at Top Centered */}
                <div className="text-center pb-2.5 space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors">
                      {template.name}
                    </h3>
                    {template.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {template.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{template.description}</p>
                </div>

                {/* 2. Miniature Document Paper with Realistic Dummy Data */}
                <div className="py-2.5 px-2 bg-slate-100/70 rounded-xl flex items-center justify-center overflow-hidden">
                  <TemplateThumbnail
                    templateId={template.id}
                    accentColor={accentColor}
                    className="h-52 sm:h-56 aspect-[210/297] w-auto mx-auto shadow-sm"
                  />
                </div>

                {/* 3. Bottom Action Button - Clean, Fully Visible, Never Cut Off */}
                <div className="mt-3 pt-1 text-center shrink-0">
                  {isSelected ? (
                    <div className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-300 shadow-2xs">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Sedang Digunakan</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTemplate(template.id);
                        onClose();
                      }}
                      className="w-full py-2.5 px-3 bg-slate-900 group-hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                    >
                      <span>Pilih {template.name}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
