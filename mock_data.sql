-- Mockup Data for Halal Track Pro

-- 1. Insert Sample Tasks
INSERT INTO public.tasks (id, name, company, description, stage, status, assigned_to) VALUES
('a1111111-1111-1111-1111-111111111111', 'Keripik Tempe Renyah', 'PT Tempe Jaya', 'Produk snack tradisional berbasis tempe dengan varian rasa original dan pedas.', 'Submitted', 'Active', 'superadmin'),
('b2222222-2222-2222-2222-222222222222', 'Susu Sapi Segar', 'Koperasi Makmur', 'Susu pasteurisasi murni dari peternakan lokal.', 'Penetapan Harga', 'Active', 'superadmin'),
('c3333333-3333-3333-3333-333333333333', 'Bakso Sapi Solo', 'Warung Pak Kumis', 'Bakso daging sapi asli tanpa pengawet.', 'Audit', 'Active', 'superadmin'),
('d4444444-4444-4444-4444-444444444444', 'Roti Gandum Sehat', 'Bakery Anugerah', 'Roti gandum utuh dengan biji-bijian.', 'Sertifikat Terbit', 'Active', 'superadmin')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Sample Checklists for "Keripik Tempe Renyah" (Stage: Submitted)
INSERT INTO public.checklists (task_id, stage, label, completed) VALUES
('a1111111-1111-1111-1111-111111111111', 'Submitted', 'Formulir Pendaftaran', true),
('a1111111-1111-1111-1111-111111111111', 'Submitted', 'NIB / Izin Usaha', true),
('a1111111-1111-1111-1111-111111111111', 'Submitted', 'Data Penyelia Halal', false);

-- 3. Insert Sample Checklists for "Susu Sapi Segar" (Stage: Penetapan Harga)
INSERT INTO public.checklists (task_id, stage, label, completed) VALUES
('b2222222-2222-2222-2222-222222222222', 'Penetapan Harga', 'Invoice Terbit', true),
('b2222222-2222-2222-2222-222222222222', 'Penetapan Harga', 'Konfirmasi Pembayaran', false);

-- 4. Insert Sample Checklists for "Bakso Sapi Solo" (Stage: Audit)
INSERT INTO public.checklists (task_id, stage, label, completed) VALUES
('c3333333-3333-3333-3333-333333333333', 'Audit', 'Laporan Audit Lapangan', false),
('c3333333-3333-3333-3333-333333333333', 'Audit', 'Foto Fasilitas Prod', true),
('c3333333-3333-3333-3333-333333333333', 'Audit', 'Checklist Temuan', false);

-- 5. Insert Sample Checklists for "Roti Gandum Sehat" (Stage: Sertifikat Terbit)
INSERT INTO public.checklists (task_id, stage, label, completed) VALUES
('d4444444-4444-4444-4444-444444444444', 'Sertifikat Terbit', 'E-Sertifikat', true),
('d4444444-4444-4444-4444-444444444444', 'Sertifikat Terbit', 'Copy Sertifikat Fisik', true);
