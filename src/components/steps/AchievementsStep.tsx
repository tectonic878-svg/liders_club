import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, Trophy, Plus, Upload, Trash2, Edit3, FileText, CheckCircle2, Eye, X, AlertCircle } from 'lucide-react';
import { StudentApplication, AchievementItem } from '../../types';
import { ACHIEVEMENT_CATEGORIES } from '../../data/initialData';
import { formatFileSize } from '../../utils/formatters';

interface AchievementsStepProps {
  application: StudentApplication;
  onChange: (updated: Partial<StudentApplication>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const AchievementsStep: React.FC<AchievementsStepProps> = ({
  application,
  onChange,
  onNext,
  onPrev,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewModalItem, setPreviewModalItem] = useState<AchievementItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [year, setYear] = useState('2025');
  const [category, setCategory] = useState<AchievementItem['category']>('Akademik');
  const [description, setDescription] = useState('');
  
  // File state
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [fileData, setFileData] = useState<string | undefined>(undefined);
  const [fileSize, setFileSize] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const resetForm = () => {
    setTitle('');
    setOrganization('');
    setYear('2025');
    setCategory('Akademik');
    setDescription('');
    setFileName('');
    setFileType('');
    setFileData(undefined);
    setFileSize('');
    setEditingId(null);
    setFormError(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditClick = (item: AchievementItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setOrganization(item.organization);
    setYear(item.year);
    setCategory(item.category);
    setDescription(item.description);
    setFileName(item.certificateFileName || '');
    setFileType(item.certificateFileType || '');
    setFileData(item.certificateFileData);
    setFileSize(item.certificateFileSize || '');
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setFormError('Fayl hajmi 10 MB dan oshmasligi kerak.');
      return;
    }

    setFileName(file.name);
    setFileType(file.type);
    setFileSize(formatFileSize(file.size));
    setFormError(null);

    const reader = new FileReader();
    reader.onload = () => {
      setFileData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setFileName('');
    setFileType('');
    setFileData(undefined);
    setFileSize('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !organization.trim()) {
      setFormError('Iltimos, yutuq nomi va tashkilotni kiriting.');
      return;
    }
    if (!description.trim()) {
      setFormError('Iltimos, ushbu yutuq haqida qisqacha tavsif yozing.');
      return;
    }

    if (editingId) {
      const updated = application.achievements.map((item) =>
        item.id === editingId
          ? {
              ...item,
              title: title.trim(),
              organization: organization.trim(),
              year: year.trim(),
              category,
              description: description.trim(),
              certificateFileName: fileName || undefined,
              certificateFileType: fileType || undefined,
              certificateFileData: fileData,
              certificateFileSize: fileSize || undefined,
            }
          : item
      );
      onChange({ achievements: updated });
    } else {
      const newItem: AchievementItem = {
        id: `ach-${Date.now()}`,
        title: title.trim(),
        organization: organization.trim(),
        year: year.trim(),
        category,
        description: description.trim(),
        certificateFileName: fileName || undefined,
        certificateFileType: fileType || undefined,
        certificateFileData: fileData,
        certificateFileSize: fileSize || undefined,
      };
      onChange({ achievements: [...application.achievements, newItem] });
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDeleteAchievement = (id: string) => {
    const updated = application.achievements.filter((a) => a.id !== id);
    onChange({ achievements: updated });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400 mb-2">
              <Trophy className="h-3.5 w-3.5" />
              <span>3-Bo'lim: Yutuqlar va Sertifikatlar</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Sertifikatlar va Erishilgan Yutuqlar
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Hozirgacha erishgan yutuqlaringiz, diplom va sertifikatlaringizni yuklang va qisqacha tavsiflang.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-xs text-slate-300">
            <span className="text-slate-400">Jami yuklangan:</span>
            <span className="font-bold text-amber-400 font-mono text-sm">
              {application.achievements.length} ta yutuq
            </span>
          </div>
        </div>
      </div>

      {/* Main List Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400">
                ★
              </span>
              <span>Yutuqlar va Sertifikatlar Ro'yxati</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Akademik, liderlik, xalqaro tillar (IELTS/TOEFL), xakaton yoki startap sertifikatlari
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 py-2.5 px-4 text-xs font-semibold text-slate-950 hover:bg-amber-400 active:scale-95 shadow-md shadow-amber-500/20 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Yangi yutuq / sertifikat qo'shish</span>
          </button>
        </div>

        {application.achievements.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800/80 text-slate-400">
              <Trophy className="h-6 w-6 text-amber-400/80" />
            </div>
            <div className="max-w-sm mx-auto">
              <h4 className="text-sm font-semibold text-white">Hozircha yutuq qo'shilmagan</h4>
              <p className="text-xs text-slate-400 mt-1">
                Sertifikat yoki diplomlaringizni yuklab, qisqacha tavsifi bilan birga ro'yxatga kiriting.
              </p>
            </div>
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3.5 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Yutuq va sertifikat qo'shish</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {application.achievements.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-5 transition-all hover:border-slate-700"
              >
                <div>
                  {/* Top line: Category and Year */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-400">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{item.year}-yil</span>
                  </div>

                  {/* Title & Organization */}
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-200 transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {item.organization}
                  </p>

                  {/* Description */}
                  <p className="mt-3 text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Certificate attachment info & actions */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  {item.certificateFileName ? (
                    <div className="flex items-center gap-2 overflow-hidden">
                      {item.certificateFileData && item.certificateFileType?.startsWith('image/') ? (
                        <img
                          src={item.certificateFileData}
                          alt="Sertifikat"
                          className="h-8 w-8 rounded border border-slate-700 object-cover shrink-0 cursor-pointer"
                          onClick={() => setPreviewModalItem(item)}
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-800 text-slate-300 shrink-0">
                          <FileText className="h-4 w-4 text-amber-400" />
                        </div>
                      )}
                      <div className="truncate text-[11px]">
                        <span className="block font-medium text-slate-200 truncate">
                          {item.certificateFileName}
                        </span>
                        <span className="text-slate-500 font-mono text-[10px]">
                          {item.certificateFileSize || 'Yuklangan'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">
                      Fayl biriktirilmagan
                    </span>
                  )}

                  <div className="flex items-center gap-1 shrink-0">
                    {item.certificateFileData && (
                      <button
                        type="button"
                        onClick={() => setPreviewModalItem(item)}
                        className="rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-400 hover:border-amber-500/40 hover:text-amber-300 transition-colors"
                        title="Sertifikatni ko'rish"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleEditClick(item)}
                      className="rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-400 hover:border-slate-700 hover:text-white transition-colors"
                      title="Tahrirlash"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAchievement(item.id)}
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

      {/* Add / Edit Achievement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-400" />
                <span>{editingId ? 'Yutuqni tahrirlash' : 'Yangi yutuq va sertifikat qo\'shish'}</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
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

            <form onSubmit={handleSaveAchievement} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Yutuq / Mukofot nomi <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masalan: Respublika Talabalar Biznes Keys Chempionati 1-o'rin"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tashkilot / Musobaqa <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Masalan: British Council / Oliy ta'lim vazirligi"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Toifasi
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-sm text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    {ACHIEVEMENT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Olingan yili
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="Masalan: 2025"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Qisqacha tavsifi <span className="text-amber-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Bu yutuqqa qanday erishdingiz? Jamoaviy yoki yakka tartibda? Ushbu yutuqning amaliy ahamiyati nima?"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
                />
              </div>

              {/* Certificate File Upload */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Sertifikat / Diplom faylini yuklash (Rasm yoki PDF)
                </label>

                {fileName ? (
                  <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950 p-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {fileData && fileType.startsWith('image/') ? (
                        <img
                          src={fileData}
                          alt="Yuklangan fayl"
                          className="h-10 w-10 rounded border border-slate-700 object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-800 text-amber-400">
                          <FileText className="h-5 w-5" />
                        </div>
                      )}
                      <div className="truncate">
                        <span className="block text-xs font-medium text-white truncate">
                          {fileName}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {fileSize}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="rounded-lg p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                      title="Faylni o'chirish"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/60 p-5 text-center hover:border-amber-500/50 hover:bg-slate-950 transition-colors"
                  >
                    <Upload className="mx-auto h-6 w-6 text-slate-400 mb-1.5" />
                    <span className="block text-xs font-medium text-slate-200">
                      Faylni tanlang yoki shu yerga tashlang
                    </span>
                    <span className="block text-[11px] text-slate-500 mt-0.5">
                      JPG, PNG yoki PDF format (maksimal 10 MB)
                    </span>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
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
                  {editingId ? 'O\'zgarishlarni saqlash' : 'Yutuqni qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Viewer Modal */}
      {previewModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-2xl w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white">{previewModalItem.title}</h4>
                <p className="text-xs text-slate-400">{previewModalItem.organization} ({previewModalItem.year})</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalItem(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center justify-center bg-slate-950 rounded-xl p-4 min-h-[300px]">
              {previewModalItem.certificateFileData && previewModalItem.certificateFileType?.startsWith('image/') ? (
                <img
                  src={previewModalItem.certificateFileData}
                  alt={previewModalItem.title}
                  className="max-h-[60vh] max-w-full rounded object-contain shadow-lg"
                />
              ) : (
                <div className="text-center space-y-3 p-6">
                  <FileText className="mx-auto h-12 w-12 text-amber-400" />
                  <p className="text-sm font-medium text-white">{previewModalItem.certificateFileName}</p>
                  <p className="text-xs text-slate-400">PDF hujjat ilovasi ({previewModalItem.certificateFileSize})</p>
                </div>
              )}
            </div>

            <div className="text-xs text-slate-300 bg-slate-950/70 p-3 rounded-lg border border-slate-800">
              <span className="font-semibold text-amber-300 block mb-1">Tavsif:</span>
              {previewModalItem.description}
            </div>
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
          <span>Orqaga: Kitoblar</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 px-6 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 active:scale-[0.98] transition-all"
        >
          <span>Keyingi: Tekshirish va Topshirish</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
