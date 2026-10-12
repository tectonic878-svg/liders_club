import { StudentApplication, AuthState } from '../types';
import { SEED_APPLICATIONS } from '../data/initialData';

const APPLICATIONS_KEY = 'ubs_leaders_club_applications_v1';
const CURRENT_AUTH_KEY = 'ubs_leaders_club_current_auth_v1';

export const storageService = {
  getApplications(): StudentApplication[] {
    try {
      const data = localStorage.getItem(APPLICATIONS_KEY);
      if (!data) {
        localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(SEED_APPLICATIONS));
        return SEED_APPLICATIONS;
      }
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading applications:', err);
      return SEED_APPLICATIONS;
    }
  },

  saveApplications(apps: StudentApplication[]): void {
    try {
      localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
    } catch (err) {
      console.error('Error saving applications:', err);
    }
  },

  getApplicationByPhone(phone: string): StudentApplication | undefined {
    const apps = this.getApplications();
    const cleanPhone = phone.replace(/\D/g, '');
    return apps.find((app) => app.phoneNumber.replace(/\D/g, '') === cleanPhone);
  },

  saveOrUpdateApplication(app: StudentApplication): void {
    const apps = this.getApplications();
    const index = apps.findIndex((a) => a.id === app.id);
    if (index >= 0) {
      apps[index] = { ...app, updatedAt: new Date().toISOString() };
    } else {
      apps.unshift({ ...app, updatedAt: new Date().toISOString() });
    }
    this.saveApplications(apps);
  },

  deleteApplication(id: string): void {
    const apps = this.getApplications().filter((a) => a.id !== id);
    this.saveApplications(apps);
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

  // Export applications as CSV
  exportToCSV(): void {
    const apps = this.getApplications();
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
      'Komissiya bali'
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
      `"${a.committeeScore ?? '-'}"`
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
