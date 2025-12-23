-- Jalankan perintah ini di SQL Editor Dashboard Supabase Anda
-- Ini akan memberikan izin kepada admin untuk menghapus data user dari tabel profiles

CREATE POLICY "Admins can delete profiles" ON public.profiles FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin')
  )
);
