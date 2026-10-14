import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Download, FileText, Archive,
  X, Eye, RefreshCw, Database, Check, Copy, AlertCircle, CheckCircle2
} from 'lucide-react';
import { StudentApplication, ApplicationStatus } from '../../types';
import { storageService } from '../../services/storageService';
import { 
  generateWordDocumentBlob, 
  generateApplicantZip, 
  generateAllApplicantsMasterZip, 
  downloadBlob 
} from '../../utils/exportUtils';
import { 
  getSupabaseCredentials, 
  saveCustomSupabaseCredentials, 
  isSupabaseConfigured 
} from '../../lib/supabase';

interface AdminDashboardProps {
  onClose: () => void;
  onSelectApplicationForStudentView?: (app: StudentApplication) => void;
}

const STATUS_LABELS: Record<ApplicationStatus, { label: string; color: string }> = {
  qoralama: { label: 'Qoralama', color: 'border-slate-700 bg-slate-800 text-slate-300' },
  yuborildi: { label: 'Yangi / Yuborildi', color: 'border-blue-500/30 bg-blue-500/10 text-blue-400' },
  korib_chiqilmoqda: { label: 'Ko\'rib chiqilmoqda', color: 'border-amber-500/30 bg-amber-500/10 text-amber-400' },
  intervyuga_chaqirildi: { label: 'Intervyuga chaqirildi', color: 'border-purple-500/30 bg-purple-500/10 text-purple-400' },
  qabul_qilindi: { label: 'Qabul qilindi', color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' },
  rad_etildi: { label: 'Rad etildi', color: 'border-red-500/30 bg-red-500/10 text-red-400' },
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
}) => {
  const [applications, setApplications] = useState<StudentApplication[]>(() =>
    storageService.getLocalApplications()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<StudentApplication | null>(null);

  // Status and notes update in modal
  const [editNotes, setEditNotes] = useState<string>('');
  const [editStatus, setEditStatus] = useState<ApplicationStatus>('yuborildi');
  const [isZipping, setIsZipping] = useState(false);
  const [previewCert, setPreviewCert] = useState<any | null>(null);

  // Supabase Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [supabaseUrlInput, setSupabaseUrlInput] = useState('');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean;
    connected: boolean;
    message: string;
  } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const fetchRemoteApplications = async () => {
    setIsLoading(true);
    try {
      const list = await storageService.getApplications();
      setApplications(list);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRemoteApplications();
    const creds = getSupabaseCredentials();
    setSupabaseUrlInput(creds.url);
    setSupabaseKeyInput(creds.key);
  }, []);

  const handleOpenDetail = (app: StudentApplication) => {
    setSelectedApp(app);
    setEditNotes(app.committeeNotes || '');
    setEditStatus(app.status);
    setPreviewCert(null);
  };

  const handleSaveStatus = async () => {
    if (!selectedApp) return;

    const updatedApp: StudentApplication = {
      ...selectedApp,
      committeeNotes: editNotes,
      status: editStatus,
      reviewerName: 'Admin',
    };

    await storageService.saveOrUpdateApplication(updatedApp);
    setSelectedApp(updatedApp);
    fetchRemoteApplications();
  };

  // Export applicant Word document (.doc)
  const handleDownloadWordDoc = (app: StudentApplication) => {
    const blob = generateWordDocumentBlob(app);
    const safeName = app.fullName.replace(/[^a-zA-Z0-9_\u0400-\u04FF]/g, '_');
    downloadBlob(blob, `${safeName}_Yozma_Javoblar.doc`);
  };

  // Export applicant ZIP dossier (.zip)
  const handleDownloadZip = async (app: StudentApplication) => {
    setIsZipping(true);
    try {
      const zipBlob = await generateApplicantZip(app);
      const safeName = app.fullName.replace(/[^a-zA-Z0-9_\u0400-\u04FF]/g, '_');
      downloadBlob(zipBlob, `${safeName}_UBS_Hujjatlar.zip`);
    } catch (e) {
      console.error('ZIP error:', e);
      alert('ZIP faylni shakllantirishda xatolik yuz berdi.');
    } finally {
      setIsZipping(false);
    }
  };

  // Export all applicants master ZIP
  const handleDownloadAllZip = async () => {
    if (applications.length === 0) return;
    setIsZipping(true);
    try {
      const zipBlob = await generateAllApplicantsMasterZip(applications);
      downloadBlob(zipBlob, `UBS_Leaders_Club_Barcha_Arizalar.zip`);
    } catch (e) {
      console.error('ZIP error:', e);
      alert('Barcha arizalarni ZIP qilishda xatolik yuz berdi.');
    } finally {
      setIsZipping(false);
    }
  };

  const handleResetData = () => {
    if (confirm('Barcha arizalarni dastlabki namunaviy holatga qaytarishni xohlaysizmi?')) {
      storageService.resetToDefault();
      fetchRemoteApplications();
      setSelectedApp(null);
    }
  };

  const handleSaveSupabaseConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    saveCustomSupabaseCredentials(supabaseUrlInput, supabaseKeyInput);
    const res = await storageService.testSupabaseConnection();
    setConnectionStatus({
      tested: true,
      connected: res.connected,
      message: res.message,
    });
    if (res.connected) {
      fetchRemoteApplications();
    }
  };

  const handleTestConnection = async () => {
    setConnectionStatus(null);
    const res = await storageService.testSupabaseConnection();
    setConnectionStatus({
      tested: true,
      connected: res.connected,
      message: res.message,
    });
  };

  const handleCopySql = () => {
    const sql = `-- UBS Leaders Club SQL Schema
CREATE TABLE IF NOT EXISTS public.applications (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT,
  faculty TEXT,
  direction TEXT NOT NULL,
  course TEXT NOT NULL,
  study_type TEXT DEFAULT 'Kunduzgi',
  group_number TEXT,
  gpa TEXT,
  leadership_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_books_read INTEGER DEFAULT 0,
  recent_books JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'yuborildi',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  committee_notes TEXT,
  committee_score INTEGER,
  reviewer_name TEXT
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert applications" ON public.applications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow read applications" ON public.applications FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow update applications" ON public.applications FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
`;
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // Metrics
  const totalApps = applications.length;
  const newAppsCount = applications.filter((a) => a.status === 'yuborildi').length;
  const inReviewCount = applications.filter((a) => a.status === 'korib_chiqilmoqda' || a.status === 'intervyuga_chaqirildi').length;
  const acceptedCount = applications.filter((a) => a.status === 'qabul_qilindi').length;

  const isConnected = isSupabaseConfigured();

  // Filtered list
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.phoneNumber.includes(searchQuery) ||
      (app.direction && app.direction.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesCourse = courseFilter === 'all' || app.course === courseFilter;

    return matchesSearch && matchesStatus && matchesCourse;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                <Users className="h-3.5 w-3.5" />
                <span>UBS Leaders Club · Maxfiy Komissiya Boshqaruvi</span>
              </span>

              {/* Live Supabase Connection Badge */}
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors ${
                  isConnected
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                    : 'border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                }`}
              >
                <Database className="h-3 w-3" />
                <span>{isConnected ? 'Supabase Ulangan' : 'Supabase Sozlash'}</span>
                <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Nomzodlar Ro'yxati va Hujjatlar Markazi
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Har bir nomzodning yozma javoblarini .word va to'liq ma'lumotlarini .zip formatida yuklab oling.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={fetchRemoteApplications}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 py-2.5 px-3.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
              title="Arizalarni yangilash"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
              <span>{isLoading ? 'Yangilanmoqda...' : 'Yangilash'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-2.5 px-3.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-colors"
            >
              <Database className="h-3.5 w-3.5" />
              <span>Supabase Sozlamalari</span>
            </button>

            <button
              type="button"
              disabled={isZipping}
              onClick={handleDownloadAllZip}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 px-4 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <Archive className="h-4 w-4" />
              <span>{isZipping ? 'Yuklanmoqda...' : 'Barchasini .ZIP yuklab olish'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-4 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            >
              Chiqish
            </button>
          </div>
        </div>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <span className="text-xs font-medium text-slate-400">Jami Nomzodlar</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">{totalApps}</div>
          <span className="text-[11px] text-slate-500">Ariza kelib tushgan</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <span className="text-xs font-medium text-slate-400">Yangi Arizalar</span>
          <div className="text-2xl font-bold font-mono text-blue-400 mt-1">{newAppsCount}</div>
          <span className="text-[11px] text-slate-500">Ko'rib chiqish kutilmoqda</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <span className="text-xs font-medium text-slate-400">Jarayonda / Intervyu</span>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{inReviewCount}</div>
          <span className="text-[11px] text-slate-500">Suhbatga tavsiya etilgan</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <span className="text-xs font-medium text-slate-400">Qabul Qilinganlar</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{acceptedCount}</div>
          <span className="text-[11px] text-slate-500">Klub a'zosi bo'ldi</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nomzod ismi, telefon yoki yo'nalish..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-xs text-slate-300 focus:border-amber-500 focus:outline-none"
          >
            <option value="all">Barcha holatlar</option>
            <option value="yuborildi">Yangi / Yuborildi</option>
            <option value="korib_chiqilmoqda">Ko'rib chiqilmoqda</option>
            <option value="intervyuga_chaqirildi">Intervyuga chaqirildi</option>
            <option value="qabul_qilindi">Qabul qilindi</option>
            <option value="rad_etildi">Rad etildi</option>
          </select>

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-xs text-slate-300 focus:border-amber-500 focus:outline-none"
          >
            <option value="all">Barcha kurslar</option>
            <option value="1-kurs">1-kurs</option>
            <option value="2-kurs">2-kurs</option>
            <option value="3-kurs">3-kurs</option>
            <option value="4-kurs">4-kurs</option>
            <option value="Magistratura">Magistratura</option>
          </select>
        </div>
      </div>

      {/* Applications List Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/70 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 px-4">Nomzod</th>
                <th className="py-3 px-4">Yo'nalish & Kurs</th>
                <th className="py-3 px-4">O'qigan kitoblari</th>
                <th className="py-3 px-4">Sertifikatlar</th>
                <th className="py-3 px-4">Holat</th>
                <th className="py-3 px-4 text-right">Yuklab olish (.word / .zip)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Arizalar topilmadi.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => {
                  const statusInfo = STATUS_LABELS[app.status] || STATUS_LABELS.yuborildi;

                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td 
                        className="py-3.5 px-4 cursor-pointer"
                        onClick={() => handleOpenDetail(app)}
                      >
                        <div className="font-semibold text-white hover:text-amber-300 transition-colors">{app.fullName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{app.phoneNumber}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-200">{app.direction || app.faculty}</div>
                        <div className="text-[11px] text-slate-400">{app.course}{app.gpa ? ` · GPA: ${app.gpa}` : ''}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-white">{app.totalBooksRead || 0} ta</span>
                        <div className="text-[11px] text-slate-400">{app.recentBooks.length} ta xulosa</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-300 font-medium">{app.achievements.length} ta</span>
                        <div className="text-[11px] text-slate-500">
                          {app.achievements.filter((a) => a.certificateFileName).length} ta fayl
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-semibold ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Word .doc download button */}
                          <button
                            type="button"
                            onClick={() => handleDownloadWordDoc(app)}
                            className="inline-flex items-center gap-1 rounded-lg border border-blue-500/30 bg-blue-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-blue-300 hover:bg-blue-500/20 transition-colors"
                            title="Yozma javoblarni .doc fayl qilib yuklab olish"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>.doc</span>
                          </button>

                          {/* Full ZIP download button */}
                          <button
                            type="button"
                            onClick={() => handleDownloadZip(app)}
                            className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
                            title="Barcha ma'lumotlar va sertifikatlarni .zip qilib yuklab olish"
                          >
                            <Archive className="h-3.5 w-3.5" />
                            <span>.zip</span>
                          </button>

                          {/* View details */}
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(app)}
                            className="rounded-lg border border-slate-700 bg-slate-800 p-1.5 text-slate-300 hover:text-white hover:border-slate-600"
                            title="To'liq ko'rish"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supabase Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-2xl w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto text-xs">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold">
                  BULUTLI MA'LUMOTLAR BAZASI
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5 flex items-center gap-2">
                  <Database className="h-5 w-5 text-emerald-400" />
                  <span>Supabase Integratsiyasi & Sozlamalari</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Status box */}
            {connectionStatus && (
              <div className={`rounded-xl border p-3 flex items-start gap-2.5 ${
                connectionStatus.connected
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : 'border-red-500/40 bg-red-500/10 text-red-300'
              }`}>
                {connectionStatus.connected ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
                )}
                <div>
                  <span className="font-bold block">
                    {connectionStatus.connected ? "Ulanish Muvaffaqiyatli!" : "Ulanish Xatosi:"}
                  </span>
                  <p className="mt-0.5 text-[11px] leading-relaxed">{connectionStatus.message}</p>
                </div>
              </div>
            )}

            {/* Instruction steps */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
              <h4 className="font-bold text-white text-sm">3 ta oddiy qadam bilan ulash:</h4>
              
              <ol className="space-y-2 list-decimal list-inside text-slate-300 leading-relaxed">
                <li>
                  <strong>supabase.com</strong> saytidan bepul loyiha oching.
                </li>
                <li>
                  Supabase Dashboard &gt; <strong>SQL Editor</strong> ga kiring va quyidagi SQL kodini nusxalab ishga tushiring ("Run"):
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopySql}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30"
                    >
                      {copiedSql ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedSql ? "SQL nusxalandi!" : "SQL kodini nusxalash"}</span>
                    </button>
                    <span className="text-[11px] text-slate-500">(`supabase-schema.sql` faylida ham mavjud)</span>
                  </div>
                </li>
                <li>
                  Project Settings &gt; <strong>API</strong> bo'limidan <strong>Project URL</strong> va <strong>anon public key</strong> ni oling.
                </li>
              </ol>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveSupabaseConfig} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Supabase Project URL:
                </label>
                <input
                  type="url"
                  required
                  value={supabaseUrlInput}
                  onChange={(e) => setSupabaseUrlInput(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Supabase Anon Public Key:
                </label>
                <input
                  type="text"
                  required
                  value={supabaseKeyInput}
                  onChange={(e) => setSupabaseKeyInput(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-2.5 text-[11px] text-blue-300">
                <strong>Netlify Deploy uchun:</strong> Netlify boshqaruv panelida <code>Site configuration &gt; Environment variables</code> bo'limiga <code>VITE_SUPABASE_URL</code> va <code>VITE_SUPABASE_ANON_KEY</code> nomlari bilan ham qo'shib qo'ying.
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  className="rounded-xl border border-slate-700 bg-slate-800 py-2 px-3.5 font-semibold text-slate-200 hover:bg-slate-700"
                >
                  Ulanishni tekshirish
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-emerald-500 py-2 px-5 font-bold text-slate-950 hover:bg-emerald-400 active:scale-95 shadow-md shadow-emerald-500/20"
                >
                  Saqlash va Ulanish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Applicant Detailed Inspector Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-4xl w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Top */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400">
                  NOMZOD HUJJATI VA YOZMA JAVOBLARI
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {selectedApp.fullName}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {selectedApp.id} · {selectedApp.phoneNumber} · {selectedApp.direction} ({selectedApp.course}) · Kunduzgi
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadWordDoc(selectedApp)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/40 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-500/20"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>.word yuklash</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadZip(selectedApp)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20"
                >
                  <Archive className="h-3.5 w-3.5" />
                  <span>.zip yuklash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Status & Review Notes Bar */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Ariza Holati
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as ApplicationStatus)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-xs text-white"
                  >
                    <option value="yuborildi">Yangi / Yuborildi</option>
                    <option value="korib_chiqilmoqda">Ko'rib chiqilmoqda</option>
                    <option value="intervyuga_chaqirildi">Intervyuga chaqirildi</option>
                    <option value="qabul_qilindi">Qabul qilindi</option>
                    <option value="rad_etildi">Rad etildi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Komissiya Izohi / Xulosasi
                  </label>
                  <input
                    type="text"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Qisqacha xulosa yozing..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleSaveStatus}
                  className="rounded-lg bg-amber-500 py-1.5 px-4 text-xs font-bold text-slate-950 hover:bg-amber-400 active:scale-95 shadow-md shadow-amber-500/20"
                >
                  Holatni Saqlash
                </button>
              </div>
            </div>

            {/* Section 1: Written Essay */}
            <div className="space-y-2 text-xs">
              <h5 className="font-bold text-white text-sm border-b border-slate-800 pb-1.5 flex items-center justify-between">
                <span>Yozma Javob: Liderlik va Motivatsiya Bayoni</span>
                <span className="text-[11px] text-amber-400 font-mono font-normal">
                  Word (.doc) ga eksport qilinadi
                </span>
              </h5>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedApp.leadershipAnswers.essay || selectedApp.leadershipAnswers.motivation || 'Yozma javob kiritilmagan'}
              </div>
            </div>

            {/* Section 2: Books */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <h5 className="font-bold text-white text-sm">
                  O'qigan Kitoblari (Jami: {selectedApp.totalBooksRead || 0} ta)
                </h5>
                <span className="text-slate-400">
                  {selectedApp.recentBooks.length} ta kitob yozilgan
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedApp.recentBooks.map((b, idx) => (
                  <div key={b.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 space-y-1">
                    <span className="font-bold text-white block">#{idx + 1} {b.title}</span>
                    <p className="text-slate-400 text-[11px]">Muallif: {b.author}</p>
                    <p className="text-slate-300 text-[11px] italic pt-0.5">
                      "{b.keyTakeaway}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Achievements & Certificates */}
            <div className="space-y-2 text-xs">
              <h5 className="font-bold text-white text-sm border-b border-slate-800 pb-1.5">
                Yutuqlar va Sertifikatlar ({selectedApp.achievements.length} ta)
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedApp.achievements.map((ach) => (
                  <div key={ach.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{ach.title}</span>
                      <span className="text-[10px] text-amber-400">{ach.year}</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{ach.organization} · {ach.category}</p>
                    <p className="text-slate-300 text-[11px]">{ach.description}</p>

                    {ach.certificateFileName && (
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] text-slate-300 truncate max-w-[200px]">
                          📎 {ach.certificateFileName}
                        </span>
                        {ach.certificateFileData && (
                          <button
                            type="button"
                            onClick={() => setPreviewCert(ach)}
                            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            <span>Ko'rish</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Certificate Preview Modal */}
            {previewCert && (
              <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                <div className="max-w-xl w-full rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h5 className="font-bold text-white text-xs">{previewCert.title}</h5>
                    <button
                      type="button"
                      onClick={() => setPreviewCert(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg flex items-center justify-center min-h-[240px]">
                    {previewCert.certificateFileData && previewCert.certificateFileType?.startsWith('image/') ? (
                      <img
                        src={previewCert.certificateFileData}
                        alt="Sertifikat"
                        className="max-h-[60vh] object-contain rounded"
                      />
                    ) : (
                      <div className="text-center p-6 space-y-2">
                        <FileText className="mx-auto h-10 w-10 text-amber-400" />
                        <p className="text-xs text-white">{previewCert.certificateFileName}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
