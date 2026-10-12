import React, { useState, useEffect } from 'react';
import { AuthState, StudentApplication } from './types';
import { storageService } from './services/storageService';
import { generateApplicationId } from './utils/formatters';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { StepIndicator, StepNumber } from './components/StepIndicator';
import { PersonalInfoStep } from './components/steps/PersonalInfoStep';
import { BooksStep } from './components/steps/BooksStep';
import { AchievementsStep } from './components/steps/AchievementsStep';
import { ReviewStep } from './components/steps/ReviewStep';
import { SuccessView } from './components/steps/SuccessView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { SEED_APPLICATIONS } from './data/initialData';

const DEFAULT_BLANK_APP: Omit<StudentApplication, 'id' | 'fullName' | 'phoneNumber' | 'createdAt' | 'updatedAt'> = {
  direction: '',
  faculty: '',
  course: '1-kurs',
  studyType: 'Kunduzgi',
  groupNumber: '',
  gpa: '',
  leadershipAnswers: {
    essay: '',
  },
  totalBooksRead: 0,
  recentBooks: [],
  achievements: [],
  status: 'qoralama',
};

export default function App() {
  const [auth, setAuth] = useState<AuthState | null>(() => storageService.getCurrentAuth());
  const [isAdminView, setIsAdminView] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [application, setApplication] = useState<StudentApplication | null>(null);

  // Keyboard shortcut listener: Ctrl + Shift + A (or Cmd + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminLoginModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load or sync application on auth change
  useEffect(() => {
    if (auth?.isAuthenticated && auth.phoneNumber) {
      const existing = storageService.getApplicationByPhone(auth.phoneNumber);
      if (existing) {
        setApplication(existing);
      } else {
        const newApp: StudentApplication = {
          ...DEFAULT_BLANK_APP,
          id: generateApplicationId(),
          fullName: auth.fullName,
          phoneNumber: auth.phoneNumber,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        storageService.saveOrUpdateApplication(newApp);
        setApplication(newApp);
      }
    } else {
      setApplication(null);
    }
  }, [auth]);

  // Compute completed steps
  useEffect(() => {
    if (!application) return;
    const completed: number[] = [];

    // Step 1 check (Direction, Course, and Leadership essay)
    const hasEssay =
      (application.leadershipAnswers.essay?.trim().length || 0) >= 20 ||
      (application.leadershipAnswers.motivation?.trim().length || 0) >= 20;

    if (application.direction && application.course && hasEssay) {
      completed.push(1);
    }

    // Step 2 check
    if (application.totalBooksRead > 0 || application.recentBooks.length > 0) {
      completed.push(2);
    }

    // Step 3 check
    if (application.achievements.length > 0) {
      completed.push(3);
    }

    // Step 4 check
    if (
      application.status === 'yuborildi' ||
      application.status === 'intervyuga_chaqirildi' ||
      application.status === 'qabul_qilindi'
    ) {
      completed.push(4);
    }

    setCompletedSteps(completed);
  }, [application]);

  // Update application state and auto-persist
  const handleUpdateApplication = (updatedFields: Partial<StudentApplication>) => {
    if (!application) return;
    const updated = {
      ...application,
      ...updatedFields,
      updatedAt: new Date().toISOString(),
    };
    setApplication(updated);
    storageService.saveOrUpdateApplication(updated);
  };

  const handleLogin = (phoneNumber: string, fullName: string) => {
    const authData: AuthState = {
      isAuthenticated: true,
      phoneNumber,
      fullName,
      isAdmin: false,
    };
    storageService.setCurrentAuth(authData);
    setAuth(authData);
    setCurrentStep(1);
  };

  const handleQuickDemoLogin = () => {
    const demo = SEED_APPLICATIONS[0]; // Javohirbek Alimov
    const authData: AuthState = {
      isAuthenticated: true,
      phoneNumber: demo.phoneNumber,
      fullName: demo.fullName,
      isAdmin: false,
    };
    storageService.setCurrentAuth(authData);
    setAuth(authData);
    setCurrentStep(1);
  };

  const handleLogout = () => {
    storageService.setCurrentAuth(null);
    setAuth(null);
    setApplication(null);
    setCurrentStep(1);
  };

  const handleSubmitFinal = () => {
    if (!application) return;
    const submitted: StudentApplication = {
      ...application,
      status: 'yuborildi',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setApplication(submitted);
    storageService.saveOrUpdateApplication(submitted);
  };

  const isAlreadySubmitted =
    application?.status === 'yuborildi' ||
    application?.status === 'intervyuga_chaqirildi' ||
    application?.status === 'korib_chiqilmoqda' ||
    application?.status === 'qabul_qilindi';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        auth={auth}
        onLogout={handleLogout}
        isAdminView={isAdminView}
        onExitAdminView={() => setIsAdminView(false)}
        applicationStatus={application?.status}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* View 1: Admin / Komissiya Paneli */}
        {isAdminView ? (
          <AdminDashboard
            onClose={() => setIsAdminView(false)}
            onSelectApplicationForStudentView={(app) => {
              setApplication(app);
              setIsAdminView(false);
            }}
          />
        ) : !auth?.isAuthenticated ? (
          /* View 2: Login & Registration (1-Bosqich) */
          <LoginView
            onLogin={handleLogin}
            onQuickDemoLogin={handleQuickDemoLogin}
          />
        ) : application ? (
          /* View 3: Student Application Stages (2-Bosqich) */
          <div className="space-y-6">
            {isAlreadySubmitted && currentStep !== 4 ? (
              <SuccessView
                application={application}
                onEditApplication={() => setCurrentStep(1)}
              />
            ) : (
              <>
                {/* Step Navigation Indicator */}
                <StepIndicator
                  currentStep={currentStep}
                  onSelectStep={(step) => setCurrentStep(step)}
                  completedSteps={completedSteps}
                />

                {/* Step 1: O'zi haqida, yo'nalish, kurs va umumiy 1 ta liderlik inshosi */}
                {currentStep === 1 && (
                  <PersonalInfoStep
                    application={application}
                    onChange={handleUpdateApplication}
                    onNext={() => setCurrentStep(2)}
                  />
                )}

                {/* Step 2: Hozirgacha o'qigan kitoblar soni va so'nggi 10 ta kitob (talaba o'zi yozadi) */}
                {currentStep === 2 && (
                  <BooksStep
                    application={application}
                    onChange={handleUpdateApplication}
                    onNext={() => setCurrentStep(3)}
                    onPrev={() => setCurrentStep(1)}
                  />
                )}

                {/* Step 3: Yutuqlar va sertifikatlar yuklash */}
                {currentStep === 3 && (
                  <AchievementsStep
                    application={application}
                    onChange={handleUpdateApplication}
                    onNext={() => setCurrentStep(4)}
                    onPrev={() => setCurrentStep(2)}
                  />
                )}

                {/* Step 4: Yakuniy ko'rib chiqish va topshirish */}
                {currentStep === 4 && (
                  application.status === 'yuborildi' ? (
                    <SuccessView
                      application={application}
                      onEditApplication={() => setCurrentStep(1)}
                    />
                  ) : (
                    <ReviewStep
                      application={application}
                      onGoToStep={(step) => setCurrentStep(step)}
                      onSubmitApplication={handleSubmitFinal}
                      onPrev={() => setCurrentStep(3)}
                    />
                  )
                )}
              </>
            )}
          </div>
        ) : null}
      </main>

      {/* Secret Admin Login Modal (Triggered by Ctrl+Shift+A) */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsAdminView(true);
          setIsAdminLoginModalOpen(false);
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 UBS Leaders Club. Barcha huquqlar himoyalangan.</p>
          <p className="text-slate-400">
            University of Business and Science · Iqtidorli talabalar akademiyasi
          </p>
        </div>
      </footer>
    </div>
  );
}
