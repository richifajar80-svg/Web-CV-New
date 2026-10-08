'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  AlertTriangle,
  RotateCcw,
  Trash2,
  FileText,
  Check,
} from 'lucide-react';

export type ActionModalVariant = 'danger' | 'warning' | 'primary';
export type ActionModalIcon = 'trash' | 'reset' | 'warning' | 'file';

export interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (inputValue?: string) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ActionModalVariant;
  icon?: ActionModalIcon;
  isPrompt?: boolean;
  promptPlaceholder?: string;
  promptInitialValue?: string;
}

export const ActionModal: React.FC<ActionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  variant = 'primary',
  icon = 'warning',
  isPrompt = false,
  promptPlaceholder = 'Ketik di sini...',
  promptInitialValue = '',
}) => {
  const [inputValue, setInputValue] = useState(promptInitialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync initial input value & autofocus when opened
  useEffect(() => {
    if (isOpen) {
      setInputValue(promptInitialValue);
      if (isPrompt) {
        setTimeout(() => {
          inputRef.current?.focus();
          inputRef.current?.select();
        }, 80);
      }
    }
  }, [isOpen, promptInitialValue, isPrompt]);

  // Close on Escape, confirm on Enter
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && isPrompt) {
        if (inputValue.trim()) {
          onConfirm(inputValue.trim());
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPrompt, inputValue, onConfirm, onClose]);

  if (!isOpen) return null;

  const handleConfirmClick = () => {
    if (isPrompt) {
      if (!inputValue.trim()) return;
      onConfirm(inputValue.trim());
    } else {
      onConfirm();
    }
    onClose();
  };

  const renderIcon = () => {
    switch (icon) {
      case 'trash':
        return <Trash2 className="w-6 h-6 text-red-600" />;
      case 'reset':
        return <RotateCcw className="w-6 h-6 text-amber-600" />;
      case 'file':
        return <FileText className="w-6 h-6 text-emerald-600" />;
      case 'warning':
      default:
        return <AlertTriangle className="w-6 h-6 text-amber-600" />;
    }
  };

  const getBadgeBg = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'primary':
      default:
        return 'bg-emerald-50 border-emerald-200';
    }
  };

  const getConfirmButtonClasses = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20';
      case 'primary':
      default:
        return 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex min-h-full items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden p-5 sm:p-6 my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Tutup dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon + Title */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${getBadgeBg()}`}
          >
            {renderIcon()}
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="text-base font-extrabold text-slate-900 leading-snug">
              {title}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Prompt Input Form (Only for isPrompt) */}
        {isPrompt && (
          <div className="mb-5 mt-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={promptPlaceholder}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-slate-50 focus:bg-white text-slate-900 transition-all outline-none"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 mt-5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirmClick}
            disabled={isPrompt && !inputValue.trim()}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 ${getConfirmButtonClasses()}`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

