-- Create tables for Halal Track Pro

-- 1. Profiles Table (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  role TEXT DEFAULT 'Auditor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT,
  stage TEXT NOT NULL DEFAULT 'Submitted',
  status TEXT DEFAULT 'Active',
  assigned_to TEXT,
  ai_analysis TEXT,
  stage_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Checklists Table
CREATE TABLE IF NOT EXISTS public.checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  label TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Simple Policies (Can be refined later)
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable Read for all users" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Enable All for authenticated users" ON public.tasks FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable Read for all" ON public.checklists FOR SELECT USING (true);
CREATE POLICY "Enable Update for all" ON public.checklists FOR ALL USING (true);

CREATE POLICY "Enable Read for all settings" ON public.settings FOR SELECT USING (true);

-- Insert Default Settings (SLA Config)
INSERT INTO public.settings (key, value) VALUES ('sla_config', '{"Submitted": 1, "Penetapan Harga": 2, "Pra audit": 3, "Audit": 7, "Review": 3, "Sidang Komisi Fatwa": 2, "Sertifikat Terbit": 1}')
ON CONFLICT (key) DO NOTHING;

-- Trigger for stage_updated_at?
-- Not strictly necessary for now as the app handles it, but good practice.
