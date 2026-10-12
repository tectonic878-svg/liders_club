export type CourseYear = '1-kurs' | '2-kurs' | '3-kurs' | '4-kurs' | 'Magistratura';

export type StudyType = 'Kunduzgi';

export type ApplicationStatus = 
  | 'qoralama' 
  | 'yuborildi' 
  | 'korib_chiqilmoqda' 
  | 'intervyuga_chaqirildi' 
  | 'qabul_qilindi' 
  | 'rad_etildi';

export interface BookItem {
  id: string;
  title: string;
  author: string;
  genre?: string;
  rating?: number; // 1 to 5
  keyTakeaway: string; // Kitobdan olgan asosiy xulosa
  readYear?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  organization: string;
  year: string;
  category: 'Akademik' | 'Liderlik' | 'Startap / Biznes' | 'Sport' | 'Xalqaro Sertifikat' | 'Boshqa';
  description: string;
  certificateFileName?: string;
  certificateFileType?: string;
  certificateFileData?: string; // base64 data url for preview
  certificateFileSize?: string;
}

export interface LeadershipAnswers {
  essay: string; // Yagona umumiy liderlik, motivatsiya va maqsadlar bayoni
  motivation?: string;
  leadershipDefinition?: string;
  conflictResolution?: string;
  futureGoals?: string;
  clubContribution?: string;
}

export interface StudentApplication {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  faculty: string;
  direction: string; // Yo'nalish
  course: CourseYear;
  studyType: StudyType;
  groupNumber?: string;
  gpa?: string;
  
  // Yagona umumiy savol
  leadershipAnswers: LeadershipAnswers;
  
  // Kitoblar
  totalBooksRead: number;
  recentBooks: BookItem[]; // So'nggi 10 ta kitob
  
  // Yutuqlar va Sertifikatlar
  achievements: AchievementItem[];
  
  // Ariza metama'lumotlari
  status: ApplicationStatus;
  createdAt: string;
  submittedAt?: string;
  updatedAt: string;
  
  // Komissiya hay'ati qarori / izohi
  committeeNotes?: string;
  committeeScore?: number;
  reviewerName?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  phoneNumber: string;
  fullName: string;
  isAdmin: boolean;
}

