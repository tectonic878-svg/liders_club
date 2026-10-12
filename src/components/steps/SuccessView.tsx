import React from 'react';
import { CheckCircle2, Calendar, Phone, Award, FileText, ArrowRight, Printer, Sparkles, Clock, Shield } from 'lucide-react';
import { StudentApplication } from '../../types';

interface SuccessViewProps {
  application: StudentApplication;
  onEditApplication: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({
  application,
  onEditApplication,
}) => {
  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8 animate-fadeIn">
      {/* Success Card */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-slate-900 to-slate-950 p-8 sm:p-10 text-center shadow-2xl relative overflow-hidden">
        {/* Glow behind */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-amber-500/20 blur-3xl pointer-events-none rounded-full" />

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 shadow-xl shadow-amber-500/30 mb-6">
          <CheckCircle2 className="h-9 w-9 stroke-[2.5]" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Ariza Muvaffaqiyatli Qabul Qilindi!</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Tabriklaymiz, {application.fullName}!
        </h2>

        <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-lg mx-auto leading-relaxed">
          UBS Leaders Club 2026-yilgi saraloviga yuborgan arizangiz, mutolaa monitoringi va sertifikatlaringiz komissiya tizimiga kiritildi.
        </p>

        {/* Ticket Details */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-mono block">
              Ariza Raqami
            </span>
            <span className="text-sm font-bold text-amber-400 font-mono">
              {application.id}
            </span>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-mono block">
              Bog'lanish Raqami
            </span>
            <span className="text-sm font-semibold text-white font-mono">
              {application.phoneNumber}
            </span>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-mono block">
              Topshirilgan Sana
            </span>
            <span className="text-sm font-semibold text-white">
              {application.submittedAt
                ? new Date(application.submittedAt).toLocaleDateString('uz-UZ', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : 'Bugun'}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 py-2.5 px-4 text-xs font-semibold text-slate-200 hover:border-slate-600 hover:text-white transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span>Arizani chop etish / PDF</span>
          </button>

          <button
            type="button"
            onClick={onEditApplication}
            className="inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 py-2.5 px-4 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>Anketani qayta ko'rish / tahrirlash</span>
          </button>
        </div>
      </div>

      {/* Roadmap Stages */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-400" />
            <span>UBS Leaders Club Saralov Bosqichlari</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Keyingi qadamlar va kutishingiz kerak bo'lgan jarayonlar tartibi:
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs">
              ✓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  1-bosqich: Elektron Ariza va Hujjatlar Tekshiruvi
                </h4>
                <span className="text-[10px] uppercase font-semibold text-emerald-400">
                  (Bajarildi)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Kiritgan ma'lumotlaringiz, mutolaa qilgan kitoblaringiz va sertifikatlaringiz saralov komissiyasi tomonidan ko'rib chiqiladi.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400 font-bold text-xs">
              2
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">
                2-bosqich: Mutolaa va Insho Bo'yicha Suhbat
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                So'nggi 10 ta o'qigan kitobingizdan olgan xulosalaringiz hamda liderlik falsafangiz bo'yicha ekspertlar bilan qisqa suhbat.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400 font-bold text-xs">
              3
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">
                3-bosqich: Guruh Keysi va Final Intervyu
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Jamoaviy muammolarni hal qilish assesmenti va UBS Leaders Club prezidiumi bilan yakuniy suhbat.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-400" />
            <span>Natijalar 3-5 ish kuni ichida telefon raqamingiz orqali xabar qilinadi.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
