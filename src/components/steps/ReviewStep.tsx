import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, FileCheck, Edit, Printer, BookOpen, Trophy, User, Sparkles, Send, ShieldCheck, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudentApplication } from '../../types';
import { StepNumber } from '../StepIndicator';

interface ReviewStepProps {
  application: StudentApplication;
  onGoToStep: (step: StepNumber) => void;
  onSubmitApplication: () => void;
  onPrev: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  application,
  onGoToStep,
  onSubmitApplication,
  onPrev,
}) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      // Fire confetti celebration
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#10b981', '#3b82f6'],
        });
      } catch (e) {
        console.log('Confetti triggered', e);
      }

      onSubmitApplication();
      setIsSubmitting(false);
      setIsConfirmModalOpen(false);
    }, 600);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400 mb-2">
              <FileCheck className="h-3.5 w-3.5" />
              <span>4-Bo'lim: Yakuniy Tekshiruv va Topshirish</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Nomzodlik Anketasini Ko'rib Chiqish
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Topshirishdan oldin barcha ma'lumotlarni diqqat bilan tekshirib chiqing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Chop etish / Saqlash</span>
              <span className="sm:hidden">Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Candidate Passport Sheet */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 space-y-8 shadow-xl">
        {/* Top Passport Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
              UBS LEADERS CLUB · RASMIY NOMZODLIK ANKETASI
            </span>
            <h3 className="text-2xl font-extrabold text-white mt-1">
              {application.fullName}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Ariza kodi: {application.id} · Tel: {application.phoneNumber}
            </p>
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-right">
            <span className="block text-[10px] uppercase tracking-wider text-amber-300/80 font-medium">
              Ariza Holati
            </span>
            <span className="text-xs font-bold text-amber-300 uppercase">
              {application.status === 'yuborildi' ? 'Yuborilgan' : 'Topshirishga tayyor'}
            </span>
          </div>
        </div>

        {/* Section 1: Academic & Direction */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="h-4 w-4 text-amber-400" />
              <span>1. Akademik Ma'lumotlar</span>
            </h4>
            <button
              type="button"
              onClick={() => onGoToStep(1)}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
            >
              <Edit className="h-3 w-3" />
              <span>Tahrirlash</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <span className="text-slate-500 block mb-1">Yo'nalish:</span>
              <span className="font-semibold text-slate-200">{application.direction || 'Belgilanmagan'}</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <span className="text-slate-500 block mb-1">Kurs:</span>
              <span className="font-semibold text-slate-200">{application.course}</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <span className="text-slate-500 block mb-1">Ta'lim shakli:</span>
              <span className="font-semibold text-slate-200">{application.studyType}</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <span className="text-slate-500 block mb-1">GPA / Guruh:</span>
              <span className="font-semibold text-slate-200">
                {application.gpa || '-'} / {application.groupNumber || '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Leadership Essay */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>2. Liderlik va Motivatsiya Bayoni</span>
            </h4>
            <button
              type="button"
              onClick={() => onGoToStep(1)}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
            >
              <Edit className="h-3 w-3" />
              <span>Tahrirlash</span>
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-xs space-y-1.5">
            <span className="font-semibold text-amber-300 block">
              Liderlik qarashlari, maqsadlar va UBS Leaders Club'ga a'zolik inshosi:
            </span>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              {application.leadershipAnswers.essay || application.leadershipAnswers.motivation || 'Ma\'lumot kiritilmagan'}
            </p>
          </div>
        </div>

        {/* Section 3: Books */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-amber-400" />
                <span>3. Mutolaa Hisoboti</span>
              </h4>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                Jami: {application.totalBooksRead || 0} ta kitob
              </span>
            </div>
            <button
              type="button"
              onClick={() => onGoToStep(2)}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
            >
              <Edit className="h-3 w-3" />
              <span>Tahrirlash ({application.recentBooks.length}/10)</span>
            </button>
          </div>

          {application.recentBooks.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-3 rounded-lg border border-slate-800">
              So'nggi kitoblar kiritilmagan.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {application.recentBooks.map((b, idx) => (
                <div key={b.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-xs space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-white line-clamp-1">
                      #{idx + 1} {b.title}
                    </span>
                    <span className="text-[10px] text-amber-400 shrink-0">{b.genre}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{b.author} ({b.readYear || '2026'})</p>
                  <p className="text-slate-300 text-[11px] pt-1 italic line-clamp-2">
                    "{b.keyTakeaway}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Achievements */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-400" />
              <span>4. Yutuqlar va Sertifikatlar ({application.achievements.length} ta)</span>
            </h4>
            <button
              type="button"
              onClick={() => onGoToStep(3)}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
            >
              <Edit className="h-3 w-3" />
              <span>Tahrirlash</span>
            </button>
          </div>

          {application.achievements.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-3 rounded-lg border border-slate-800">
              Yutuq yoki sertifikat biriktirilmagan.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {application.achievements.map((ach) => (
                <div key={ach.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-xs space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-white line-clamp-1">{ach.title}</span>
                    <span className="text-[10px] text-amber-400 shrink-0">{ach.year}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{ach.organization} · {ach.category}</p>
                  <p className="text-slate-300 text-[11px] line-clamp-2">{ach.description}</p>
                  {ach.certificateFileName && (
                    <div className="pt-1 text-[11px] text-amber-300 flex items-center gap-1 font-mono">
                      <span>✓ Fayl ilova qilingan: {ach.certificateFileName}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation & Submit Section */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Barcha ma'lumotlar to'g'ri ekanligini tasdiqlaysizmi?
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Ariza topshirilgach, u UBS Leaders Club saralov komissiyasiga ko'rib chiqish uchun yuboriladi.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsConfirmModalOpen(true)}
          className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3.5 px-8 text-sm font-bold text-slate-950 shadow-xl shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 active:scale-95 transition-all"
        >
          <Send className="h-4 w-4" />
          <span>Arizani Rasman Topshirish</span>
        </button>
      </div>

      {/* Confirmation Dialog */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">
                Arizani topshirishni tasdiqlaysizmi?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hurmatli <strong>{application.fullName}</strong>, sizning ma'lumotlaringiz, mutolaa monitoringi va sertifikatlaringiz komissiya tekshiruviga yuboriladi.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="rounded-xl border border-slate-700 py-2.5 px-4 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Qayta ko'rib chiqish
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalSubmit}
                className="rounded-xl bg-amber-500 py-2.5 px-6 text-xs font-bold text-slate-950 hover:bg-amber-400 active:scale-95 shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
              >
                {isSubmitting ? 'Yuborilmoqda...' : 'Ha, topshirilsin!'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prev Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 py-3 px-5 text-sm font-semibold text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Orqaga: Yutuqlar</span>
        </button>
      </div>
    </div>
  );
};
