import React from 'react';
import { Award, LogOut, ArrowLeft } from 'lucide-react';
import { AuthState } from '../types';

interface NavbarProps {
  auth: AuthState | null;
  onLogout: () => void;
  isAdminView: boolean;
  onExitAdminView: () => void;
  applicationStatus?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  auth,
  onLogout,
  isAdminView,
  onExitAdminView,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-500/30 bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-transparent text-amber-400 shadow-sm">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold tracking-tight text-white">
                UBS Leaders Club
              </span>
              <span className="hidden rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400 sm:inline-block">
                {isAdminView ? 'ADMIN PANEL' : 'QABUL 2026'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isAdminView ? 'Komissiya boshqaruv tizimi' : 'Iqtidorli talabalar saralov platformasi'}
            </p>
          </div>
        </div>

        {/* Right action area */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* If currently in admin view, allow exit back to student view */}
          {isAdminView && (
            <button
              onClick={onExitAdminView}
              className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Talaba sahifasiga qaytish</span>
            </button>
          )}

          {/* User profile / Logout (only in student view) */}
          {auth?.isAuthenticated && !isAdminView && (
            <div className="flex items-center gap-2 border-l border-slate-800 pl-2 sm:pl-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-medium text-slate-200">
                  {auth.fullName}
                </span>
                <span className="text-[11px] text-slate-400">
                  {auth.phoneNumber}
                </span>
              </div>
              
              <button
                onClick={onLogout}
                title="Tizimdan chiqish"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
