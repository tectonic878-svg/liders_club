import React, { useState } from 'react';
import { Award, ArrowRight, Phone, User, CheckCircle2, BookOpen, Trophy, Sparkles, ShieldCheck } from 'lucide-react';
import { formatPhoneNumber, isValidUzbekPhone } from '../utils/formatters';

interface LoginViewProps {
  onLogin: (phoneNumber: string, fullName: string) => void;
  onQuickDemoLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onQuickDemoLogin }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+998');
  const [error, setError] = useState<string | null>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatPhoneNumber(raw);
    setPhoneNumber(formatted);
    if (error) setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || fullName.trim().length < 3) {
      setError('Iltimos, to\'liq ism va familiyangizni kiriting (kamida 3 ta belgi).');
      return;
    }

    if (!isValidUzbekPhone(phoneNumber)) {
      setError('Iltimos, to\'g\'ri telefon raqamingizni kiriting (+998 XX XXX-XX-XX formatida).');
      return;
    }

    onLogin(phoneNumber, fullName.trim());
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Information & Prestige */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>2026-yilgi Yangi A'zolar Saralovi Boshlandi</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            UBS Leaders Club — <br />
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              Yetakchilar safida bo'ling
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
            UBS Liderlar Klubi — bu o'z sohasida yetakchi bo'lishga intilayotgan, kitob mutolaasi, 
            ijtimoiy faollik va real loyihalarga ega iqtidorli talabalar uchun oliy maydon.
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Kiritilgan ma'lumotlar xavfsiz saqlanadi va bevosita saralov komissiyasiga taqdim etiladi.</span>
          </div>
        </div>

        {/* Right Column: 1-Bosqich Login Form */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                1-Bosqich: Ro'yxatdan o'tish
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Arizani Boshlash
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Ism-familiyangiz va telefon raqamingiz orqali platformaga kiring.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Ism va Familiyangiz <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Masalan: Sardor Rustamov"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Telefon Raqamingiz <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="+998 (90) 123-45-67"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Ushbu raqam sizning arizangizni keyinchalik tekshirish kalitingiz hisoblanadi.
                </p>
              </div>

              <button
                type="submit"
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 px-4 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all active:scale-[0.99]"
              >
                <span>Platformaga kirish (Login)</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Quick Demo Fill button */}
            <div className="mt-6 pt-5 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-400 mb-2">
                Sinab ko'rish yoki ko'rgazma uchun tayyor namuna:
              </p>
              <button
                type="button"
                onClick={onQuickDemoLogin}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 py-2 px-3 text-xs font-medium text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
              >
                <Award className="h-3.5 w-3.5 text-amber-400" />
                <span>Namuna talaba sifatida tezkor kirish (Javohirbek Alimov)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
