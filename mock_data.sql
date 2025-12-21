-- Mockup Data for Halal Track Pro
-- 10 Varied Entries across 7 Stages

INSERT INTO public.tasks (id, name, company, description, stage, status, assigned_to) VALUES
('e5555555-5555-5555-5555-555555555555', 'Keripik Singkong Balado', 'UD Sumber Rejeki', 'Keripik singkong dengan bumbu balado khas Padang.', 'Submitted', 'Active', 'superadmin'),
('f6666666-6666-6666-6666-666666666666', 'Madu Hutan Asli', 'CV Madu Alam', 'Madu murni dari hutan Sumbawa.', 'Penetapan Harga', 'Active', 'superadmin'),
('a7777777-7777-7777-7777-777777777777', 'Kopi Robusta Lampung', 'Kopi Nikmat', 'Biji kopi pilihan dari perkebunan Lampung Barat.', 'Pra audit', 'Active', 'superadmin'),
('b8888888-8888-8888-8888-888888888888', 'Siomay Ikan Tenggiri', 'Siomay Mang Asep', 'Siomay beku siap saji.', 'Audit', 'Active', 'superadmin'),
('c9999999-9999-9999-9999-999999999999', 'Bumbu Rendang Instan', 'Dapur Minang', 'Bumbu pasta siap pakai untuk rendang daging.', 'Review', 'Active', 'superadmin'),
('d0000000-0000-0000-0000-000000000000', 'Donat Kentang Empuk', 'Donat Bunda', 'Donat kentang dengan aneka topping.', 'Sidang Komisi Fatwa', 'Active', 'superadmin'),
('a1111111-1212-1212-1212-111111111111', 'Yoghurt Strawberry', 'Milky Way', 'Minuman yoghurt rasa buah strawberry.', 'Sertifikat Terbit', 'Active', 'superadmin'),
('b2222222-2323-2323-2323-222222222222', 'Nugget Ayam Wortel', 'Healthy Frozen', 'Nugget ayam sehat dengan campuran sayuran.', 'Audit', 'Active', 'superadmin'),
('c3333333-3434-3434-3434-333333333333', 'Teh Hijau Celup', 'Teh Puncak', 'Teh hijau organik kemasan celup.', 'Submitted', 'Active', 'superadmin'),
('d4444444-4545-4545-4545-444444444444', 'Sambal Terasi Botol', 'Sambal Bu Rudy', 'Sambal terasi khas Surabaya.', 'Review', 'Active', 'superadmin')

ON CONFLICT (id) DO NOTHING;

-- Overdue and Extended Scenarios (For Testing)
-- Note: Timestamps are relative to when this script is run
INSERT INTO public.tasks (id, name, company, description, stage, status, assigned_to, stage_updated_at, review_extension_used) VALUES
('e1111111-1111-1111-1111-111111111111', 'Keripik Pedas Nampol (Overdue Submitted)', 'UD Pedas Gila', 'Keripik super pedas level 10.', 'Submitted', 'Active', 'superadmin', NOW() - INTERVAL '4 days', FALSE),
('e2222222-2222-2222-2222-222222222222', 'Bakso Aci Instan (Overdue Audit)', 'CV Berkah Rasa', 'Bakso aci kemasan frozen.', 'Audit', 'Active', 'superadmin', NOW() - INTERVAL '10 days', FALSE),
('e3333333-3333-3333-3333-333333333333', 'Kue Lapis Legit (Overdue Review)', 'Dapur Mama', 'Kue lapis legit premium.', 'Review', 'Active', 'superadmin', NOW() - INTERVAL '5 days', FALSE),
('e4444444-4444-4444-4444-444444444444', 'Sosis Bakar Jumbo (Extended Safe)', 'Sosis Yummy', 'Sosis sapi ukuran jumbo.', 'Review', 'Active', 'superadmin', NOW() - INTERVAL '6 days', TRUE),
('e5555555-5555-5555-5555-555555555555', 'Roti O (Extended Overdue)', 'Roti Kita', 'Roti manis dengan topping kopi.', 'Review', 'Active', 'superadmin', NOW() - INTERVAL '12 days', TRUE)
ON CONFLICT (id) DO UPDATE SET 
stage_updated_at = EXCLUDED.stage_updated_at,
review_extension_used = EXCLUDED.review_extension_used;
