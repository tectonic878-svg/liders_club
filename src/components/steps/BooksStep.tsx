import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Plus, Trash2, Edit3, AlertCircle } from 'lucide-react';
import { StudentApplication, BookItem } from '../../types';

interface BooksStepProps {
  application: StudentApplication;
  onChange: (updated: Partial<StudentApplication>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const BooksStep: React.FC<BooksStepProps> = ({
  application,
  onChange,
  onNext,
  onPrev,
}) => {
  const [isAddingModalOpen, setIsAddingModalOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);

  // Form state - students write their books purely themselves
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [keyTakeaway, setKeyTakeaway] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const resetForm = () => {
    setTitle('');
    setAuthor('');
    setKeyTakeaway('');
    setEditingBookId(null);
    setFormError(null);
  };

  const openAddForm = () => {
    resetForm();
    setIsAddingModalOpen(true);
  };

  const handleEditClick = (book: BookItem) => {
    setEditingBookId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setKeyTakeaway(book.keyTakeaway);
    setIsAddingModalOpen(true);
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      setFormError('Iltimos, kitob nomi va muallifini kiriting.');
      return;
    }
    if (!keyTakeaway.trim()) {
      setFormError('Iltimos, ushbu kitobdan olgan asosiy xulosangizni yozing.');
      return;
    }

    if (editingBookId) {
      const updatedBooks = application.recentBooks.map((b) =>
        b.id === editingBookId
          ? {
              ...b,
              title: title.trim(),
              author: author.trim(),
              keyTakeaway: keyTakeaway.trim(),
            }
          : b
      );
      onChange({ recentBooks: updatedBooks });
    } else {
      if (application.recentBooks.length >= 10) {
        setFormError('Siz maksimal 10 ta so\'nggi o\'qilgan kitobni kiritishingiz mumkin.');
        return;
      }

      const newBook: BookItem = {
        id: `book-${Date.now()}`,
        title: title.trim(),
        author: author.trim(),
        keyTakeaway: keyTakeaway.trim(),
      };

      onChange({
        recentBooks: [...application.recentBooks, newBook],
      });
    }

    setIsAddingModalOpen(false);
    resetForm();
  };

  const handleDeleteBook = (id: string) => {
    const updated = application.recentBooks.filter((b) => b.id !== id);
    onChange({ recentBooks: updated });
  };

  const booksCount = application.recentBooks.length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400 mb-2">
              <BookOpen className="h-3.5 w-3.5" />
              <span>2-Bo'lim: Mutolaa Tajribasi</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Kitoblar va Mutolaa
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Hozirgacha o'qigan kitoblaringiz sonini va so'nggi 10 ta o'qigan kitobingizni o'zingiz yozing.
            </p>
          </div>

          {/* Book Counter Progress */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/80 p-3 self-start sm:self-auto">
            <div className="text-right">
              <span className="block text-[11px] uppercase tracking-wider text-slate-400">
                10 ta kitobdan
              </span>
              <span className="text-lg font-bold font-mono text-amber-400">
                {booksCount} / 10
              </span>
            </div>
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm font-mono">
              {booksCount}
            </div>
          </div>
        </div>
      </div>

      {/* Part 1: Total Books Count */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-7 space-y-4">
        <div className="border-b border-slate-800/80 pb-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400">
              1
            </span>
            <span>Hozirgacha O'qigan Jami Kitoblaringiz Soni</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Hayotingiz davomida o'qigan barcha kitoblaringizning umumiy soni
          </p>
        </div>

        <div className="max-w-md pt-1">
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Jami kitoblar soni <span className="text-amber-400">*</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={10000}
              value={application.totalBooksRead || ''}
              onChange={(e) => onChange({ totalBooksRead: parseInt(e.target.value, 10) || 0 })}
              placeholder="Masalan: 35"
              className="w-48 rounded-xl border border-slate-700 bg-slate-950 py-2.5 px-4 text-base font-mono font-bold text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
            />
            <span className="text-xs text-slate-400">
              dona kitob o'qilgan
            </span>
          </div>
        </div>
      </div>

      {/* Part 2: Recent 10 Books */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400">
                2
              </span>
              <span>So'nggi O'qigan 10 ta Kitobingiz</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              So'nggi o'qigan kitoblaringiz nomi, muallifi va asosiy xulosasini o'zingiz kiritasiz ({booksCount}/10)
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            disabled={booksCount >= 10}
            className={`inline-flex items-center gap-2 rounded-xl py-2.5 px-4 text-xs font-semibold transition-all ${
              booksCount >= 10
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-amber-500 text-slate-950 hover:bg-amber-400 active:scale-95 shadow-md shadow-amber-500/20'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Kitob qo'shish</span>
          </button>
        </div>

        {/* Books List Cards */}
        {booksCount === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800/80 text-slate-400">
              <BookOpen className="h-6 w-6 text-amber-400/80" />
            </div>
            <div className="max-w-sm mx-auto">
              <h4 className="text-sm font-semibold text-white">Hozircha kitob kiritilmagan</h4>
              <p className="text-xs text-slate-400 mt-1">
                "Kitob qo'shish" tugmasini bosib, so'nggi o'qigan kitoblaringizni yozing.
              </p>
            </div>
            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3.5 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Kitob kiritish</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {application.recentBooks.map((book, index) => (
              <div
                key={book.id}
                className="group relative rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-all hover:border-slate-700"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400 font-mono">
                      #{index + 1}
                    </span>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-white">
                          {book.title}
                        </h4>
                        <span className="text-xs text-slate-400">· Muallif: {book.author}</span>
                      </div>

                      <div className="text-xs text-slate-300 pt-1 leading-relaxed">
                        <span className="text-amber-400/90 font-medium">Asosiy xulosa: </span>
                        {book.keyTakeaway}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditClick(book)}
                      className="rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-400 hover:border-slate-700 hover:text-white transition-colors"
                      title="Tahrirlash"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBook(book.id)}
                      className="rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-400 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      title="O'chirish"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Book Modal */}
      {isAddingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-amber-400" />
                <span>{editingBookId ? 'Kitobni tahrirlash' : 'Kitob ma\'lumotlarini kiritish'}</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddingModalOpen(false);
                  resetForm();
                }}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-2.5 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveBook} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Kitob nomi <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Kitob nomini kiriting..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 px-3.5 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Muallifi <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Muallif ismini kiriting..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 px-3.5 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Asosiy saboq / xulosangiz <span className="text-amber-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={keyTakeaway}
                  onChange={(e) => setKeyTakeaway(e.target.value)}
                  placeholder="Ushbu kitobdan olgan asosiy xulosangizni yozing..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 px-3.5 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingModalOpen(false);
                    resetForm();
                  }}
                  className="rounded-xl border border-slate-700 py-2 px-4 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 py-2 px-5 text-xs font-semibold text-slate-950 hover:bg-amber-400 active:scale-95 shadow-md shadow-amber-500/20"
                >
                  {editingBookId ? 'Saqlash' : 'Kitobni qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 py-3 px-5 text-sm font-semibold text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Orqaga</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 px-6 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 active:scale-[0.98] transition-all"
        >
          <span>Keyingi: Yutuqlar & Sertifikatlar</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
