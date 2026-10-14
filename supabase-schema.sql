-- ====================================================================
-- UBS LEADERS CLUB - SUPABASE SQL SCHEMA
-- Ushbu kodni Supabase Dashboard > SQL Editor oynasiga qo'yib, "Run" tugmasini bosing
-- ====================================================================

-- 1. Arizalar jadvali (Applications Table)
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

-- Indexlar (Tezkor qidiruv uchun)
CREATE INDEX IF NOT EXISTS idx_applications_phone ON public.applications(phone_number);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created ON public.applications(created_at DESC);

-- 2. Row Level Security (RLS) xavfsizlik qoidalarini yoqish
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Barcha arizachilarga yangi ariza yuborish (INSERT) ruxsati:
CREATE POLICY "Allow anonymous insert applications"
ON public.applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Arizalarni o'qish (SELECT) ruxsati (Admin va arizachilar uchun):
CREATE POLICY "Allow read applications"
ON public.applications
FOR SELECT
TO anon, authenticated
USING (true);

-- Arizalarni yangilash (UPDATE) ruxsati:
CREATE POLICY "Allow update applications"
ON public.applications
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 3. Tayyor! Endi arizalar to'g'ridan-to'g'ri Supabase PostgreSQL bazangizga yoziladi.
