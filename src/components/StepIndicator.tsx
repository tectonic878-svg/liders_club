import React from 'react';
import { User, BookOpen, Trophy, FileCheck, Check } from 'lucide-react';

export type StepNumber = 1 | 2 | 3 | 4;

interface StepIndicatorProps {
  currentStep: StepNumber;
  onSelectStep: (step: StepNumber) => void;
  completedSteps: number[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onSelectStep,
  completedSteps,
}) => {
  const steps = [
    {
      id: 1 as StepNumber,
      label: "O'zi haqida & Savollar",
      sub: "Yo'nalish, kurs, liderlik",
      icon: User,
    },
    {
      id: 2 as StepNumber,
      label: "Kitoblar & Mutolaa",
      sub: "Jami va so'nggi 10 ta kitob",
      icon: BookOpen,
    },
    {
      id: 3 as StepNumber,
      label: "Yutuqlar & Sertifikatlar",
      sub: "Sertifikat yuklash va tavsif",
      icon: Trophy,
    },
    {
      id: 4 as StepNumber,
      label: "Tekshirish & Topshirish",
      sub: "Yakuniy xulosa va ariza",
      icon: FileCheck,
    },
  ];

  return (
    <div className="w-full">
      {/* Mobile progress bar */}
      <div className="block md:hidden mb-6">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
          <span className="text-amber-400 font-semibold">
            {currentStep}-bosqich: {steps[currentStep - 1].label}
          </span>
          <span>{currentStep} / 4</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop step pills */}
      <nav aria-label="Progress" className="hidden md:block mb-8">
        <ol className="grid grid-cols-4 gap-3">
          {steps.map((step) => {
            const isCurrent = currentStep === step.id;
            const isCompleted = completedSteps.includes(step.id);
            const Icon = step.icon;

            return (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => onSelectStep(step.id)}
                  className={`group relative flex w-full flex-col rounded-xl border p-3.5 text-left transition-all ${
                    isCurrent
                      ? 'border-amber-500 bg-amber-500/10 shadow-md shadow-amber-500/5'
                      : isCompleted
                      ? 'border-slate-700 bg-slate-900/80 hover:border-slate-600'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold ${
                        isCurrent
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                    </div>

                    <Icon
                      className={`h-4 w-4 ${
                        isCurrent
                          ? 'text-amber-400'
                          : isCompleted
                          ? 'text-emerald-400'
                          : 'text-slate-500'
                      }`}
                    />
                  </div>

                  <span
                    className={`text-xs font-semibold leading-snug line-clamp-1 ${
                      isCurrent
                        ? 'text-amber-300'
                        : isCompleted
                        ? 'text-slate-200'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {step.sub}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};
