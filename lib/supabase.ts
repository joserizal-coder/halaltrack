

import { createClient } from '@supabase/supabase-js';

// Penting: Di Vercel Dashboard, tambahkan prefix VITE_ pada nama variabel
// Contoh: VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY
// Fix: Added type assertion to import.meta to resolve Property 'env' does not exist error in Vite environment
// Fix: Added fallback to prevent crash if env vars are missing
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

if (supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn("Using placeholder Supabase credentials. App will not function correctly until .env is configured.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
