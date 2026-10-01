'use client';

import React, { useState } from 'react';
import { X, Mail, Send, CheckCircle2, MessageSquare, Clock, ShieldCheck, Copy, Check } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [copied, setCopied] = useState(false);

  // Close modal on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSending) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSending, onClose]);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('no-reply.cvbagus@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSending(true);

    // Simulate sending email to no-reply.cvbagus@gmail.com
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => {
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setIsSent(false);
        onClose();
      }, 2500);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex min-h-full items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSending) onClose();
      }}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-5 text-white relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/90 hover:text-white bg-black/25 hover:bg-black/45 w-8 h-8 rounded-full flex items-center justify-center transition-all z-30 cursor-pointer shadow-md ring-1 ring-white/20 active:scale-95"
            title="Tutup (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 bg-emerald-800/60 px-3 py-1 rounded-full text-[11px] font-semibold mb-2">
            <Mail className="w-3.5 h-3.5 text-emerald-300" />
            <span>Pusat Bantuan & Kontak</span>
          </div>
          <h2 className="text-xl font-black">Hubungi Tim cvbagus.id</h2>
          <p className="text-xs text-emerald-100 mt-0.5">
            Ada kendala, pertanyaan aktivasi, atau saran fitur? Kami siap membantu Anda.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Quick Email Copy Card */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-semibold text-emerald-900 block">Email Layanan Resmi:</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 truncate block">
                  no-reply.cvbagus@gmail.com
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="p-2 rounded-xl bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-100/50 transition-colors text-xs font-semibold flex items-center gap-1 shadow-2xs cursor-pointer"
                title="Salin Alamat Email"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? 'Tersalin' : 'Salin'}</span>
              </button>
              <a
                href="mailto:no-reply.cvbagus@gmail.com?subject=Tanya%20Layanan%20cvbagus.id"
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors text-xs font-semibold flex items-center gap-1 shadow-xs"
                title="Buka Aplikasi Email Langsung"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mailto</span>
              </a>
            </div>
          </div>

          {isSent ? (
            /* Success Feedback */
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Pesan Anda Berhasil Terkirim!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Terima kasih. Tim support cvbagus.id akan meninjau pesan Anda dan membalas melalui email Anda dalam waktu 1x24 jam.
              </p>
            </div>
          ) : (
            /* Form Send Message */
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Anda *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@gmail.com"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subjek / Topik Pertanyaan</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Misal: Bantuan Aktivasi Akun / Masukan Desain Templat"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pesan Anda *</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan kendala atau pertanyaan yang ingin Anda tanyakan secara rinci..."
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-60"
              >
                {isSending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Mengirimkan Pesan...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Pesan ke no-reply.cvbagus@gmail.com</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Badges / Guarantees */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-around text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              Respon Cepat 1x24 Jam
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Privasi Terjamin
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
