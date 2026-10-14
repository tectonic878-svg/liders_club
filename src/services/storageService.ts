import { StudentApplication, AuthState } from '../types';
import { SEED_APPLICATIONS } from '../data/initialData';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

const APPLICATIONS_KEY = 'ubs_leaders_club_applications_v1';
const CURRENT_AUTH_KEY = 'ubs_leaders_club_current_auth_v1';

// Convert frontend model to Supabase row
function toSupabaseRow(app: StudentApplication) {
  return {
    id: app.id,
    full_name: app.fullName,
    phone_number: app.phoneNumber,
    email: app.email || null,
    faculty: app.faculty || app.direction || '',
    direction: app.direction,
    course: app.course,
    study_type: app.studyType || 'Kunduzgi',
    group_number: app.groupNumber || null,
    gpa: app.gpa || null,
    leadership_answers: app.leadershipAnswers || {},
    total_books_read: app.totalBooksRead || 0,
    recent_books: app.recentBooks || [],
    achievements: app.achievements || [],
    status: app.status,
    created_at: app.createdAt || new Date().toISOString(),
    submitted_at: app.submittedAt || null,
    updated_at: new Date().toISOString(),
    committee_notes: app.committeeNotes || null,
    committee_score: app.committeeScore ?? null,
    reviewer_name: app.reviewerName || null,
  };
}

// Convert Supabase row to frontend model
function fromSupabaseRow(row: any): StudentApplication {
  return {
    id: row.id,
    fullName: row.full_name,
    phoneNumber: row.phone_number,
    email: row.email || undefined,
    faculty: row.faculty || row.direction || '',
    direction: row.direction,
    course: row.course,
    studyType: row.study_type || 'Kunduzgi',
    groupNumber: row.group_number || undefined,
    gpa: row.gpa || undefined,
    leadershipAnswers: row.leadership_answers || { essay: '' },
    totalBooksRead: row.total_books_read || 0,
    recentBooks: Array.isArray(row.recent_books) ? row.recent_books : [],
    achievements: Array.isArray(row.achievements) ? row.achievements : [],
    status: row.status || 'yuborildi',
    createdAt: row.created_at || new Date().toISOString(),
    submittedAt: row.submitted_at || undefined,
    updatedAt: row.updated_at || new Date().toISOString(),
    committeeNotes: row.committee_notes || undefined,
    committeeScore: row.committee_score ?? undefined,
    reviewerName: row.reviewer_name || undefined,
  };
}

export const storageService = {
  // Synchronous read from localStorage (used for instant render)
  getLocalApplications(): StudentApplication[] {
    try {
      const data = localStorage.getItem(APPLICATIONS_KEY);
      if (!data) {
        localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(SEED_APPLICATIONS));
        return SEED_APPLICATIONS;
      }
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading local applications:', err);
      return SEED_APPLICATIONS;
    }
  },

  // Save applications to localStorage cache
  setLocalApplications(apps: StudentApplication[]): void {
    try {
      localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
    } catch (err) {
      console.error('Error saving local applications:', err);
    }
  },

  // Asynchronous get: tries Supabase first, falls back to localStorage
  async getApplications(): Promise<StudentApplication[]> {
    const supabase = getSupabase();

    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          const remoteApps = data.map(fromSupabaseRow);
          // If remote database is empty, return whatever is there or seed
          if (remoteApps.length > 0) {
            this.setLocalApplications(remoteApps);
            return remoteApps;
          }
        } else if (error) {
          console.warn('Supabase fetch error, fallback to local:', error.message);
        }
      } catch (err) {
        console.warn('Supabase network error, fallback to local:', err);
      }
    }

    return this.getLocalApplications();
  },

  async getApplicationByPhone(phone: string): Promise<StudentApplication | undefined> {
    const cleanPhone = phone.replace(/\D/g, '');
    const supabase = getSupabase();

    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*');

        if (!error && data) {
          const found = data
            .map(fromSupabaseRow)
            .find((a) => a.phoneNumber.replace(/\D/g, '') === cleanPhone);
          if (found) return found;
        }
      } catch (err) {
        console.warn('Supabase search by phone error:', err);
      }
    }

    // Fallback to local
    const local = this.getLocalApplications();
    return local.find((app) => app.phoneNumber.replace(/\D/g, '') === cleanPhone);
  },

  async saveOrUpdateApplication(app: StudentApplication): Promise<{ success: boolean; error?: string }> {
    // 1. Always update local storage first so user has immediate feedback
    const localApps = this.getLocalApplications();
    const index = localApps.findIndex((a) => a.id === app.id);
    const updatedWithDate = { ...app, updatedAt: new Date().toISOString() };

    if (index >= 0) {
      localApps[index] = updatedWithDate;
    } else {
      localApps.unshift(updatedWithDate);
    }
    this.setLocalApplications(localApps);

    // 2. If Supabase is configured, upsert into Supabase database
    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        const row = toSupabaseRow(updatedWithDate);
        const { error } = await supabase
          .from('applications')
          .upsert(row, { onConflict: 'id' });

        if (error) {
          console.error('Supabase upsert error:', error);
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (err: any) {
        console.error('Supabase network error on save:', err);
        return { success: false, error: err?.message || 'Tarmoq xatosi' };
      }
    }

    return { success: true };
  },

  async deleteApplication(id: string): Promise<void> {
    const local = this.getLocalApplications().filter((a) => a.id !== id);
    this.setLocalApplications(local);

    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('applications').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }
  },

  resetToDefault(): void {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(SEED_APPLICATIONS));
  },

  // Auth session
  getCurrentAuth(): AuthState | null {
    try {
      const auth = localStorage.getItem(CURRENT_AUTH_KEY);
      return auth ? JSON.parse(auth) : null;
    } catch {
      return null;
    }
  },

  setCurrentAuth(auth: AuthState | null): void {
    if (auth) {
      localStorage.setItem(CURRENT_AUTH_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(CURRENT_AUTH_KEY);
    }
  },

  async testSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
    const supabase = getSupabase();
    if (!supabase || !isSupabaseConfigured()) {
      return {
        connected: false,
        message: "Supabase sozlanmagan. VITE_SUPABASE_URL va VITE_SUPABASE_ANON_KEY kiritilishi kerak.",
      };
    }

    try {
      const { data, error } = await supabase
        .from('applications')
        .select('id')
        .limit(1);

      if (error) {
        // Table doesn't exist or RLS issue
        if (error.code === '42P01') {
          return {
            connected: false,
            message: "Supabase ulandi, ammo 'applications' jadvali hali yaratilmagan. Iltimos, supabase-schema.sql skriptini SQL Editor'da ishga tushiring.",
          };
        }
        return {
          connected: false,
          message: `Supabase xatosi: ${error.message}`,
        };
      }

      return {
        connected: true,
        message: "Supabase muvaffaqiyatli ulandi! Barcha yangi arizalar to'g'ridan-to'g'ri bulutga saqlanadi.",
      };
    } catch (err: any) {
      return {
        connected: false,
        message: `Ulanishda xatolik: ${err?.message || err}`,
      };
    }
  },

  // Export applications as CSV
  exportToCSV(appsToExport?: StudentApplication[]): void {
    const apps = appsToExport || this.getLocalApplications();
    const headers = [
      'ID',
      'F.I.SH',
      'Telefon',
      'Yo\'nalish',
      'Kurs',
      'O\'qigan kitoblar soni',
      'Kiritilgan oxirgi kitoblar',
      'Yutuqlar soni',
      'Status',
      'Topshirilgan vaqt',
    ];

    const rows = apps.map((a) => [
      `"${a.id}"`,
      `"${a.fullName}"`,
      `"${a.phoneNumber}"`,
      `"${a.direction || a.faculty}"`,
      `"${a.course}"`,
      `"${a.totalBooksRead || 0}"`,
      `"${a.recentBooks.length}"`,
      `"${a.achievements.length}"`,
      `"${a.status}"`,
      `"${a.submittedAt ? new Date(a.submittedAt).toLocaleDateString('uz-UZ') : 'Qoralama'}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `UBS_Leaders_Club_Arizalar_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
