'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Lightbulb,
  Plus,
  Edit3,
  Trash2,
  BookOpen,
  ArrowLeft,
  Clock,
  User,
  Tag,
  Search,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { DEFAULT_ARTICLES } from '@/data/defaultArticles';
import { TipArticle } from '@/types/content';

const STORAGE_KEY = 'cvbagus_tips_articles_v1';

interface TipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TipsModal: React.FC<TipsModalProps> = ({ isOpen, onClose }) => {
  const [articles, setArticles] = useState<TipArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<TipArticle | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Form states for CMS Editor
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<TipArticle['category']>('Tips CV & ATS');
  const [formAuthor, setFormAuthor] = useState('Admin cvbagus.id');
  const [formReadTime, setFormReadTime] = useState('3 menit baca');
  const [formSummary, setFormSummary] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formTags, setFormTags] = useState('Tips Kerja, Karir');

  // Load articles from localStorage or fallback to defaults
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setArticles(JSON.parse(saved));
      } else {
        setArticles(DEFAULT_ARTICLES);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ARTICLES));
      }
    } catch {
      setArticles(DEFAULT_ARTICLES);
    }
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedArticle) {
          setSelectedArticle(null);
        } else if (isEditing) {
          setIsEditing(false);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedArticle, isEditing, onClose]);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const saveArticlesToStorage = (updated: TipArticle[]) => {
    setArticles(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save articles', e);
    }
  };

  const categories = [
    'Semua',
    'Tips CV & ATS',
    'Wawancara Kerja',
    'Negosiasi Gaji',
    'Portofolio',
    'Karir & Fresh Graduate',
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = filterCategory === 'Semua' || art.category === filterCategory;
    const matchesSearch =
      searchQuery === '' ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Open Form to Create New Article
  const handleOpenNewArticle = () => {
    setEditingArticleId(null);
    setFormTitle('');
    setFormCategory('Tips CV & ATS');
    setFormAuthor('Admin cvbagus.id');
    setFormReadTime('3 menit baca');
    setFormSummary('');
    setFormContent('');
    setFormTags('Tips Kerja, Karir');
    setIsEditing(true);
    setSelectedArticle(null);
  };

  // Open Form to Edit Existing Article
  const handleOpenEdit = (article: TipArticle, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingArticleId(article.id);
    setFormTitle(article.title);
    setFormCategory(article.category);
    setFormAuthor(article.author);
    setFormReadTime(article.readTime);
    setFormSummary(article.summary);
    setFormContent(article.content.trim());
    setFormTags(article.tags.join(', '));
    setIsEditing(true);
    setSelectedArticle(null);
  };

  // Delete Article
  const handleDeleteArticle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      const updated = articles.filter((a) => a.id !== id);
      saveArticlesToStorage(updated);
      showNotification('Artikel berhasil dihapus!');
      if (selectedArticle?.id === id) {
        setSelectedArticle(null);
      }
    }
  };

  // Reset to Default Articles
  const handleResetDefaults = () => {
    if (confirm('Kembalikan semua artikel ke daftar bawaan sistem?')) {
      saveArticlesToStorage(DEFAULT_ARTICLES);
      showNotification('Daftar artikel dikembalikan ke awal.');
      setIsEditing(false);
      setSelectedArticle(null);
    }
  };

  // Handle Form Submission (Save or Update)
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      alert('Judul dan isi artikel wajib diisi!');
      return;
    }

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    if (editingArticleId) {
      // Update existing
      const updated = articles.map((art) => {
        if (art.id === editingArticleId) {
          return {
            ...art,
            title: formTitle.trim(),
            category: formCategory,
            author: formAuthor.trim(),
            readTime: formReadTime.trim(),
            summary: formSummary.trim(),
            content: formContent.trim(),
            tags: tagsArray,
            date: formattedDate,
          };
        }
        return art;
      });
      saveArticlesToStorage(updated);
      showNotification('Artikel berhasil diperbarui!');
    } else {
      // Create new
      const newArticle: TipArticle = {
        id: `art-${Date.now()}`,
        title: formTitle.trim(),
        slug: formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: formCategory,
        author: formAuthor.trim() || 'Admin cvbagus.id',
        date: formattedDate,
        readTime: formReadTime.trim() || '3 menit baca',
        summary: formSummary.trim(),
        content: formContent.trim(),
        tags: tagsArray.length > 0 ? tagsArray : ['Tips Karir'],
        isFeatured: false,
      };
      saveArticlesToStorage([newArticle, ...articles]);
      showNotification('Artikel baru berhasil diterbitkan!');
    }

    setIsEditing(false);
    setEditingArticleId(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex min-h-full items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-4xl bg-slate-50 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Notification Pill */}
        {notification && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 animate-in slide-in-from-top-3">
            <CheckCircle2 className="w-4 h-4" />
            <span>{notification}</span>
          </div>
        )}

        {/* Modal Top Bar */}
        <div className="bg-white border-b border-slate-200 p-4 sm:px-6 sm:py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  {selectedArticle
                    ? 'Baca Artikel Tips Karir'
                    : isEditing
                    ? editingArticleId
                      ? 'Edit Artikel Tips'
                      : 'Tulis Artikel Tips Baru'
                    : 'Tips & Panduan Lolos Kerja'}
                </h2>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {isEditing ? 'Mode CMS' : 'Koleksi Artikel'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? 'Tulis dan perbarui artikel tips melamar kerja untuk pengunjung cvbagus.id.'
                  : 'Strategi praktis penulisan CV, trik interview, dan negosiasi gaji lolos rekrutmen.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!isEditing && !selectedArticle && (
              <>
                <button
                  type="button"
                  onClick={handleOpenNewArticle}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3.5 py-2 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                  title="Tambah artikel tips baru"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Tulis Artikel Baru</span>
                  <span className="sm:hidden">Tulis</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                  title="Kembalikan ke artikel bawaan"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              title="Tutup (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* VIEW 1: CMS FORM EDITOR (TAMBAH / EDIT ARTIKEL) */}
        {isEditing ? (
          <form onSubmit={handleSaveForm} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-white">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Batal & Kembali ke Daftar</span>
              </button>
              <span className="text-xs text-slate-400 font-medium">
                {editingArticleId ? 'Mengubah artikel tersimpan' : 'Membuat artikel baru'}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Artikel *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Contoh: 5 Rahasia Menjawab 'Ceritakan Tentang Diri Anda' Saat Wawancara"
                  className="w-full text-xs sm:text-sm font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none bg-white font-medium"
                  >
                    <option value="Tips CV & ATS">Tips CV & ATS</option>
                    <option value="Wawancara Kerja">Wawancara Kerja</option>
                    <option value="Negosiasi Gaji">Negosiasi Gaji</option>
                    <option value="Portofolio">Portofolio</option>
                    <option value="Karir & Fresh Graduate">Karir & Fresh Graduate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Penulis</label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="Nama Penulis"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estimasi Waktu Baca</label>
                  <input
                    type="text"
                    value={formReadTime}
                    onChange={(e) => setFormReadTime(e.target.value)}
                    placeholder="Misal: 4 menit baca"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ringkasan Pendek (Lead/Excerpt) *</label>
                <textarea
                  required
                  rows={2}
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat pengantar artikel yang akan tampil pada kartu cuplikan..."
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none resize-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Isi Artikel Lengkap * (Mendukung paragraf, bullet poin, dll)
                </label>
                <textarea
                  required
                  rows={9}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Tuliskan isi artikel tips lengkap di sini..."
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none font-mono resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tag Artikel (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="Contoh: Interview, HRD, Fresh Graduate, Gaji"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none font-medium"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
              >
                <Save className="w-4 h-4" />
                <span>Simpan & Publikasikan</span>
              </button>
            </div>
          </form>
        ) : selectedArticle ? (
          /* VIEW 2: READER VIEW (MEMBACA ARTIKEL LENGKAP) */
          <div className="p-5 sm:p-8 overflow-y-auto flex-1 bg-white space-y-6">
            <button
              type="button"
              onClick={() => setSelectedArticle(null)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 cursor-pointer hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Daftar Tips</span>
            </button>

            <div className="space-y-3 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-0.5 rounded-full">
                  {selectedArticle.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedArticle.readTime}
                </span>
                <span className="text-xs text-slate-400">• {selectedArticle.date}</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {selectedArticle.title}
              </h1>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  Ditulis oleh {selectedArticle.author}
                </span>

                <button
                  type="button"
                  onClick={(e) => handleOpenEdit(selectedArticle, e)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Artikel Ini</span>
                </button>
              </div>
            </div>

            {/* Article Content Body with Beautiful Clean Typography */}
            <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed space-y-4 whitespace-pre-line text-xs sm:text-sm">
              {selectedArticle.content}
            </div>

            {/* Tags */}
            <div className="pt-6 border-t border-slate-100 flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-slate-400 shrink-0" />
              {selectedArticle.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ) : (
          /* VIEW 3: ARTICLES LISTING (DAFTAR ARTIKEL) */
          <>
            {/* Search & Filter Bar */}
            <div className="p-3 sm:px-6 bg-white border-b border-slate-200 space-y-2.5 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari tips CV, interview, cara lolos seleksi BUMN..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none bg-slate-50"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      filterCategory === cat
                        ? 'bg-amber-600 text-white shadow-2xs font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
              {filteredArticles.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs space-y-2">
                  <p>Tidak ada artikel tips yang cocok dengan pencarian.</p>
                  <button
                    type="button"
                    onClick={handleOpenNewArticle}
                    className="text-xs font-bold text-emerald-700 underline"
                  >
                    Tulis artikel baru untuk topik ini
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      onClick={() => setSelectedArticle(article)}
                      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer hover:border-amber-300 relative"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                            {article.category}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.readTime}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-amber-800 transition-colors">
                          {article.title}
                        </h3>

                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {article.summary}
                        </p>
                      </div>

                      <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-medium text-slate-500 truncate max-w-[140px]">
                          {article.author}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => handleOpenEdit(article, e)}
                            className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Artikel"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteArticle(article.id, e)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Artikel"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-amber-700 group-hover:underline flex items-center gap-1 ml-1">
                            <span>Baca</span>
                            <BookOpen className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
