'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { SavedCV } from '@/types/auth';
import { CVData } from '@/types/cv';
import {
  User,
  LogOut,
  FileText,
  Plus,
  ChevronDown,
  Trash2,
  Bookmark,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { ActionModal } from '@/components/UI/ActionModal';

interface UserMenuProps {
  currentCV: CVData;
  activeCVId: string | null;
  onSelectCV: (cv: SavedCV) => void;
  onNewCV: () => void;
  onSaveCurrentCV: () => void;
  onOpenPayment: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  currentCV,
  activeCVId,
  onSelectCV,
  onNewCV,
  onSaveCurrentCV,
  onOpenPayment,
}) => {
  const { user, logout, userCVs, deleteCV, isSubscriptionActive, userQuota } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [deletingCV, setDeletingCV] = useState<SavedCV | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Format expiration date if paid
  const formattedExpiry = user.subscriptionExpiresAt
    ? new Date(user.subscriptionExpiresAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <div className="relative" ref={menuRef}>
      {/* User Profile Pill Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 pl-1.5 pr-2 sm:pr-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full transition-all text-left shrink-0 cursor-pointer"
      >
        <div
          className={`w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0 ${
            isSubscriptionActive ? 'bg-emerald-600' : 'bg-slate-700'
          }`}
        >
          {initials}
        </div>
        <div className="hidden sm:block min-w-0">
          <div className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[65px] lg:max-w-[80px] xl:max-w-[110px]">
            {user.name}
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* User Info & Subscription Status */}
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-900">{user.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{user.email}</p>

            <div className="mt-2.5 pt-2 border-t border-slate-100">
              {isSubscriptionActive ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                    <div className="flex items-center gap-1.5 text-emerald-800">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{user.plan === 'enterprise' ? 'Paket Enterprise' : 'Paket Personal'}</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">
                      Aktif s/d {formattedExpiry}
                    </span>
                  </div>

                  {/* Quota Indicators */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-600">📥 Unduh PDF Bulan Ini:</span>
                      <span className="font-bold text-slate-800">
                        {userQuota?.downloadsUsed ?? user.downloadCountThisMonth ?? 0} / {userQuota?.downloadLimit ?? (user.plan === 'enterprise' ? 100 : 10)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-1.5 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            (((userQuota?.downloadsUsed ?? user.downloadCountThisMonth ?? 0) /
                              (userQuota?.downloadLimit ?? (user.plan === 'enterprise' ? 100 : 10))) *
                              100)
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-slate-600">🌐 AI Translate Bulan Ini:</span>
                      <span className="font-bold text-slate-800">
                        {userQuota?.translatesUsed ?? user.translateCountThisMonth ?? 0} / {userQuota?.translateLimit ?? (user.plan === 'enterprise' ? 25 : 5)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            (((userQuota?.translatesUsed ?? user.translateCountThisMonth ?? 0) /
                              (userQuota?.translateLimit ?? (user.plan === 'enterprise' ? 25 : 5))) *
                              100)
                          )}%`,
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 text-right pt-0.5">Reset tiap tanggal 1</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-amber-800 font-medium">
                    <span>Akses Unduh: Belum Aktif</span>
                    <span className="font-bold">Rp 25.000 / thn</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onOpenPayment();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Aktivasi 1 Tahun Sekarang</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Action: Save Current CV */}
          <div className="p-2 border-b border-slate-100">
            <button
              type="button"
              onClick={() => {
                onSaveCurrentCV();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 text-emerald-600" />
              <span>Simpan Perubahan ke Akun</span>
            </button>
          </div>

          {/* List of Saved CVs */}
          <div className="py-2">
            <div className="flex items-center justify-between px-4 pb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Daftar CV Anda ({userCVs.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  onNewCV();
                  setIsOpen(false);
                }}
                className="text-[11px] text-emerald-700 font-semibold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Buat Baru
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto px-2 space-y-1">
              {userCVs.map((cv) => {
                const isSelected = activeCVId === cv.id;
                return (
                  <div
                    key={cv.id}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors group ${
                      isSelected
                        ? 'bg-emerald-50/80 text-emerald-950 font-semibold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCV(cv);
                        setIsOpen(false);
                      }}
                      className="flex-1 text-left flex items-center gap-2 truncate"
                    >
                      <FileText
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isSelected ? 'text-emerald-600' : 'text-slate-400'
                        }`}
                      />
                      <div className="truncate">
                        <p className="truncate leading-tight">{cv.title}</p>
                        <p className="text-[10px] text-slate-400 font-normal">{cv.updatedAt}</p>
                      </div>
                    </button>

                    {userCVs.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingCV(cv);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 transition-opacity"
                        title="Hapus CV"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Admin Panel Link */}
          <div className="pt-1.5 px-2 border-t border-slate-100">
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Panel Admin</span>
              </span>
              <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded">
                /admin
              </span>
            </Link>
          </div>

          {/* Logout Button */}
          <div className="pt-1 px-2">
            <button
              type="button"
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar dari Akun</span>
            </button>
          </div>
        </div>
      )}

      {/* Modern Custom Delete Confirmation Modal */}
      {deletingCV && (
        <ActionModal
          isOpen={true}
          onClose={() => setDeletingCV(null)}
          onConfirm={() => {
            deleteCV(deletingCV.id);
            setDeletingCV(null);
          }}
          title="Hapus Dokumen CV?"
          description={`Apakah Anda yakin ingin menghapus "${deletingCV.title}"? Dokumen yang dihapus tidak dapat dipulihkan.`}
          confirmText="Ya, Hapus Dokumen"
          cancelText="Batal"
          variant="danger"
          icon="trash"
        />
      )}
    </div>
  );
};
