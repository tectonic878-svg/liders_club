import React from 'react';
import { ArrowRight, Sparkles, HelpCircle, GraduationCap } from 'lucide-react';
import { StudentApplication } from '../../types';
import { COURSE_OPTIONS, UNIFIED_QUESTION } from '../../data/initialData';

interface PersonalInfoStepProps {
  application: StudentApplication;
  onChange: (updated: Partial<StudentApplication>) => void;
  onNext: () => void;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  application,
  onChange,
  onNext,
}) => {
  const currentEssay =
    application.leadershipAnswers.essay ||
    application.leadershipAnswers.motivation ||
    '';

  const handleEssayChange = (value: string) => {
    onChange({
      leadershipAnswers: {
        ...application.leadershipAnswers,
        essay: value,
      },
    });
  };

  const wordCount = currentEssay.trim() ? currentEssay.trim().split(/\s+/).length : 0;

  const isFormValid = Boolean(
    application.direction?.trim() &&
    application.course &&
    currentEssay.trim().length >= 20
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400 mb-2">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>1-Bo'lim: Akademik Profil va Saralov Inshosi</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              O'zingiz haqida ma'lumot va Liderlik anketasi
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Universitetdagi o'qish yo'nalishingiz, kursingiz va liderlik motivatsiyangizni to'ldiring.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-slate-300">
            <span className="font-semibold text-white">{application.fullName}</span>
            <span className="text-slate-500">|</span>
            <span className="font-mono text-slate-400">{application.phoneNumber}</span>
          </div>
        </div>
      </div>

      {/* Part 1: Academic & Direction Info */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-7 space-y-6">
        <h3 className="text-base font-semibold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400">
            1
          </span>
          <span>Akademik Yo'nalish va Kurs Ma'lumotlari</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Yo'nalishi - Talaba o'zi yozadi */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Ta'lim Yo'nalishingiz / Fakultet <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              value={application.direction}
              onChange={(e) => onChange({ direction: e.target.value, faculty: e.target.value })}
              placeholder="Masalan: Xalqaro Biznes va Moliya, Dasturiy ta'minot..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 px-3.5 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>

          {/* Kursi */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Hozirgi Kursingiz <span className="text-amber-400">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {COURSE_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onChange({ course: c })}
                  className={`rounded-xl border py-2 px-2 text-xs font-medium text-center transition-all ${
                    application.course === c
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-semibold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Ta'lim shakli (Faqat Kunduzgi) */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Ta'lim Shakli
            </label>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 py-2.5 px-3.5 text-sm text-amber-300 font-medium flex items-center justify-between">
              <span>Kunduzgi ta'lim</span>
              <span className="text-[11px] text-amber-400/80 uppercase tracking-wider font-semibold">
                Standart
              </span>
            </div>
          </div>

          {/* Guruh raqami & GPA */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Guruh raqami <span className="text-slate-500 font-normal">(ixtiyoriy)</span>
              </label>
              <input
                type="text"
                value={application.groupNumber || ''}
                onChange={(e) => onChange({ groupNumber: e.target.value })}
                placeholder="Masalan: IB-2204"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 px-3.5 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                GPA / O'rtacha baho <span className="text-slate-500 font-normal">(ixtiyoriy)</span>
              </label>
              <input
                type="text"
                value={application.gpa || ''}
                onChange={(e) => onChange({ gpa: e.target.value })}
                placeholder="Masalan: 4.8"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 px-3.5 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Unified Single Leadership Question */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400">
              2
            </span>
            <span>Liderlik va Motivatsiya Bayoni</span>
          </h3>
          <span className="text-xs text-amber-400 font-medium inline-flex items-center gap-1 font-mono">
            <Sparkles className="h-3.5 w-3.5" />
            {wordCount} ta so'z kiritildi
          </span>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-200">
            {UNIFIED_QUESTION.title} <span className="text-amber-400">*</span>
          </label>

          <p className="text-xs text-slate-400 flex items-start gap-1.5 leading-relaxed">
            <HelpCircle className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
            <span>{UNIFIED_QUESTION.hint}</span>
          </p>

          <textarea
            rows={8}
            value={currentEssay}
            onChange={(e) => handleEssayChange(e.target.value)}
            placeholder={UNIFIED_QUESTION.placeholder}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 p-4 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors leading-relaxed"
          />
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4">
        <p className="text-xs text-slate-500">
          Kiritilgan ma'lumotlar avtomatik saqlanib boradi.
        </p>

        <button
          type="button"
          onClick={onNext}
          disabled={!isFormValid}
          className={`flex items-center gap-2 rounded-xl py-3 px-6 text-sm font-semibold transition-all ${
            isFormValid
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 active:scale-[0.98]'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Keyingi: Kitoblar & Mutolaa</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
