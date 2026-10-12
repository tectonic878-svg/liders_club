import { StudentApplication } from '../types';

export const FACULTIES_AND_DIRECTIONS = [
  'Biznes va Moliya',
  'Iqtisodiyot va Boshqaruv',
  'Axborot Texnologiyalari va Dasturlash',
  'Xalqaro Munosabatlar va Huquq',
  'Raqamli Marketing va Logistika',
  'Sun\'iy Intellekt va Ma\'lumotlar Tahlili',
  'Buxgalteriya va Audit',
  'Turizm va Mehmondo\'stlik Menejmenti',
];

export const COURSE_OPTIONS = [
  '1-kurs',
  '2-kurs',
  '3-kurs',
  '4-kurs',
  'Magistratura',
] as const;

export const BOOK_GENRES = [
  'Biznes va Menejment',
  'Liderlik va Shaxsiy rivojlanish',
  'Psixologiya va Muloqot',
  'Iqtisodiyot va Moliya',
  'Tarix va Falsafa',
  'Badiiy adabiyot',
  'Ilm-fan va Texnologiya',
  'Biografiya va Memuar',
];

export const ACHIEVEMENT_CATEGORIES = [
  'Akademik',
  'Liderlik',
  'Startap / Biznes',
  'Sport',
  'Xalqaro Sertifikat',
  'Boshqa',
] as const;

export const UNIFIED_QUESTION = {
  title: "O'zingiz, liderlik qarashlaringiz va UBS Leaders Club'ga a'zo bo'lish maqsadingiz haqida yozma bayon (Insho)",
  hint: "O'zingiz haqingizda qisqacha ma'lumot, nima uchun aynan UBS Leaders Club'ni tanlaganingiz, yetakchilik fazilatlaringiz va klubga qo'sha oladigan hissangizni batafsil yoritib bering (kamida 40 ta so'z).",
  placeholder: "Assalomu alaykum! Men UBS talabasi sifatida ushbu klubga a'zo bo'lish orqali o'z liderlik va boshqaruv qobiliyatlarimni rivojlantirishni, shuningdek kuchli jamoa bilan birgalikda yirik loyihalar ustida ishlashni maqsad qilganman. Men uchun liderlik faqatgina boshqaruv emas, balki shaxsiy namuna va empatiya orqali ilhomlantirishdir...",
};

export const SEED_APPLICATIONS: StudentApplication[] = [
  {
    id: 'UBS-LC-2026-001',
    fullName: 'Javohirbek Alimov',
    phoneNumber: '+998 (90) 123-45-67',
    email: 'j.alimov@ubs.edu.uz',
    faculty: 'Biznes va Moliya',
    direction: 'Xalqaro Biznes va Moliya',
    course: '2-kurs',
    studyType: 'Kunduzgi',
    groupNumber: 'IB-2204',
    gpa: '4.8',
    leadershipAnswers: {
      essay: "UBS Leaders Club mening nazdimda universitetning eng iqtidorli talabalarini birlashtiruvchi strategik maydondir. Men bu yerda real biznes keyslar ustida ishlash va jamoaviy boshqaruv ko'nikmalarimni oshirishni xohlayman. Men uchun lider boshqalarni buyruq bilan emas, shaxsiy namuna va empatiya orqali ilhomlantiruvchi insondir. Universitet tadbirlarida 15 kishilik jamoa bilan ishlashda qiyin vaziyatlarni bartaraf etish tajribam bor. Kelgusidagi maqsadim yirik konsalting kompaniyasida loyiha menejeri bo'lishdir. Klubga haftalik 'Case Club' va 'CEO Talks' loyihalarini yo'lga qo'yish orqali hissa qo'shmoqchiman.",
      motivation: 'UBS Leaders Club mening nazdimda eng iqtidorli talabalarni birlashtiruvchi strategik markazdir.',
    },
    totalBooksRead: 48,

    recentBooks: [
      {
        id: 'b-1',
        title: 'Atom Odatlar (Atomic Habits)',
        author: 'James Clear',
        genre: 'Liderlik va Shaxsiy rivojlanish',
        rating: 5,
        keyTakeaway: 'Katta natijalar har kuni 1% yaxshilanishlar evaziga shakllanadi. Odat tizimi maqsaddan muhimroq.',
        readYear: '2026'
      },
      {
        id: 'b-2',
        title: 'Prinsiplar (Principles)',
        author: 'Ray Dalio',
        genre: 'Biznes va Menejment',
        rating: 5,
        keyTakeaway: 'Radikal ochiqlik va xatolardan to\'g\'ri dars chiqarish muvaffaqiyat garovidir.',
        readYear: '2026'
      },
      {
        id: 'b-3',
        title: 'Noldan Birgacha (Zero to One)',
        author: 'Peter Thiel',
        genre: 'Biznes va Menejment',
        rating: 4,
        keyTakeaway: 'Raqobatlashmang, yangi qiymat yaratib monopoliya quring.',
        readYear: '2025'
      },
      {
        id: 'b-4',
        title: 'Muvaffaqiyatli insonlarning 7 ko\'nikmasi',
        author: 'Stephen Covey',
        genre: 'Liderlik va Shaxsiy rivojlanish',
        rating: 5,
        keyTakeaway: 'Birinchi navbatda eng muhim narsaga diqqat qaratish va doimo Win-Win yondashuvi.',
        readYear: '2025'
      },
      {
        id: 'b-5',
        title: 'Qattiq Mehnat (Deep Work)',
        author: 'Cal Newport',
        genre: 'Liderlik va Shaxsiy rivojlanish',
        rating: 5,
        keyTakeaway: 'Chalg\'ituvchi omillarni yo\'qotib, chuqur diqqat bilan ishlash ustunlik beradi.',
        readYear: '2025'
      },
      {
        id: 'b-6',
        title: 'Liderlikning 21 ta inkor etib bo\'lmas qonuni',
        author: 'John C. Maxwell',
        genre: 'Liderlik va Shaxsiy rivojlanish',
        rating: 5,
        keyTakeaway: 'Liderlik – bu faqat va faqat ta\'sir doirasidir, unvon emas.',
        readYear: '2025'
      },
      {
        id: 'b-7',
        title: 'O\'yla va Boy Bo\'l',
        author: 'Napoleon Hill',
        genre: 'Psixologiya va Muloqot',
        rating: 4,
        keyTakeaway: 'Aniq maqsad va qat\'iy iroda yo\'lidagi to\'siqlar vaqtinchalikdir.',
        readYear: '2024'
      },
      {
        id: 'b-8',
        title: 'Alkimyogar',
        author: 'Paulo Coelho',
        genre: 'Badiiy adabiyot',
        rating: 4,
        keyTakeaway: 'Har bir inson o\'z Taqdir Yo\'lini izlashi va yurak sadosiga quloq solishi lozim.',
        readYear: '2024'
      },
      {
        id: 'b-9',
        title: 'Raqamli Qal\'a',
        author: 'Dan Brown',
        genre: 'Badiiy adabiyot',
        rating: 4,
        keyTakeaway: 'Axborot xavfsizligi va insoniy omilning ahamiyati.',
        readYear: '2024'
      },
      {
        id: 'b-10',
        title: 'Sun\'iy Intellekt Asri',
        author: 'Henry Kissinger, Eric Schmidt',
        genre: 'Ilm-fan va Texnologiya',
        rating: 5,
        keyTakeaway: 'Yangi texnologiyalar boshqaruvida axloqiy va strategik tafakkur yetakchi bo\'lishi shart.',
        readYear: '2024'
      }
    ],
    achievements: [
      {
        id: 'ach-1',
        title: 'Respublika Talabalar Biznes Keys Chempionati — 1-o\'rin',
        organization: 'Oliy ta\'lim vazirligi & Biznes Assotsiatsiyasi',
        year: '2025',
        category: 'Startap / Biznes',
        description: '4 kishilik jamoa bilan real sanoat korxonasining logistika va xarajatlarini 18% optimallashtirish bo\'yicha strategiya taqdim etib g\'olib bo\'ldik.',
        certificateFileName: 'respublika_keys_chempionati_diplom.pdf',
        certificateFileType: 'application/pdf',
        certificateFileSize: '1.4 MB'
      },
      {
        id: 'ach-2',
        title: 'IELTS 7.5 Xalqaro Til Sertifikati',
        organization: 'British Council',
        year: '2024',
        category: 'Xalqaro Sertifikat',
        description: 'Listening: 8.0, Reading: 8.0, Writing: 7.0, Speaking: 7.5. Xalqaro anjumanlarda ma\'ruzalar o\'qish darajasi.',
        certificateFileName: 'ielts_certificate_7_5.jpg',
        certificateFileType: 'image/jpeg',
        certificateFileSize: '2.1 MB'
      },
      {
        id: 'ach-3',
        title: 'UBS "Yilning eng yaxshi debyutanti" Liderlik mukofoti',
        organization: 'University of Business and Science',
        year: '2024',
        category: 'Liderlik',
        description: 'Birinchi kurs talabalari orasida o\'tkazilgan ijtimoiy faollik va jamoaviy tashabbuslari uchun berilgan maxsus diplom.',
        certificateFileName: 'ubs_debyutant_diplom.jpg',
        certificateFileType: 'image/jpeg',
        certificateFileSize: '980 KB'
      }
    ],
    status: 'intervyuga_chaqirildi',
    createdAt: '2026-10-01T10:30:00Z',
    submittedAt: '2026-10-01T11:45:00Z',
    updatedAt: '2026-10-02T14:10:00Z',
    committeeScore: 92,
    committeeNotes: 'Mutolaa bazasi juda kuchli, aniq keys-tajribasi bor. Intervyu bosqichiga tavsiya etildi.',
    reviewerName: 'Komissiya raisi: D. Rustamov'
  },
  {
    id: 'UBS-LC-2026-002',
    fullName: 'Madinabonu Karimova',
    phoneNumber: '+998 (93) 555-88-99',
    email: 'm.karimova@ubs.edu.uz',
    faculty: 'Axborot Texnologiyalari va Dasturlash',
    direction: 'Axborot Texnologiyalari',
    course: '3-kurs',
    studyType: 'Kunduzgi',
    groupNumber: 'IT-3101',
    gpa: '4.9',
    leadershipAnswers: {
      essay: "Men IT sohasida texnik bilimlardan tashqari yetakchilik va jamoa bilan ishlash san'atini rivojlantirmoqchiman. Lider bu mas'uliyatni o'z bo'yniga olishdan qo'rqmaydigan va jamoa muvaffaqiyatini o'zinikidan ustun qo'yadigan shaxsdir. Xakaton musobaqalarida krizisli vaziyatlarda MVP'ni tezkor chiqarish va loyihani himoya qilish tajribam bor. Kelajakda EdTech startapini yo'lga qo'ymoqchiman. UBS Leaders Club'ning raqamli loyihalarini texnik boshqarish va xakatonlar tashkil qilishda hissa qo'shaman.",
      motivation: 'Men IT sohasida texnik bilimlardan tashqari yetakchilik va odamlar bilan ishlash san\'atini rivojlantirmoqchiman.',
    },
    totalBooksRead: 35,
    recentBooks: [
      {
        id: 'b-201',
        title: 'Toza Kod (Clean Code)',
        author: 'Robert C. Martin',
        genre: 'Ilm-fan va Texnologiya',
        rating: 5,
        keyTakeaway: 'Kod faqat kompyuter uchun emas, jamoa a\'zolari bir-birini tushunishi uchun yoziladi.',
        readYear: '2026'
      },
      {
        id: 'b-202',
        title: 'Tez Boshlash (The Lean Startup)',
        author: 'Eric Ries',
        genre: 'Biznes va Menejment',
        rating: 5,
        keyTakeaway: 'Farazlarni minimal mahsulot (MVP) orqali darhol tekshiring.',
        readYear: '2026'
      },
      {
        id: 'b-203',
        title: 'Ikigai: Yaponlarning uzoq va baxtli yashash siri',
        author: 'Héctor García',
        genre: 'Liderlik va Shaxsiy rivojlanish',
        rating: 4,
        keyTakeaway: 'O\'zingiz sevadigan, mohir bo\'lgan va dunyoga kerakli ishni toping.',
        readYear: '2025'
      }
    ],
    achievements: [
      {
        id: 'ach-201',
        title: 'Tashkent Tech Hackathon — 2-o\'rin',
        organization: 'IT Park Uzbekistan',
        year: '2025',
        category: 'Startap / Biznes',
        description: 'Imkoniyati cheklangan talabalar uchun inklyuziv ta\'lim platformasini 48 soat ichida ishlab chiqdik.',
        certificateFileName: 'hackathon_certificate_2025.png',
        certificateFileType: 'image/png',
        certificateFileSize: '1.8 MB'
      }
    ],
    status: 'yuborildi',
    createdAt: '2026-10-05T09:15:00Z',
    submittedAt: '2026-10-05T10:00:00Z',
    updatedAt: '2026-10-05T10:00:00Z',
  }
];
