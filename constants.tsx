
import React from 'react';
import {
  FileText,
  DollarSign,
  ClipboardCheck,
  Search,
  Eye,
  Users,
  Award,
  Trash2,
  Pause,
  Play,
  UserPlus,
  FileEdit
} from 'lucide-react';
import { TaskStage, StageConfig, TaskChecklistItem } from './types';

export const STAGES: StageConfig[] = [
  { id: TaskStage.PROSPEK, label: 'Prospek', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: 'users' },
  { id: TaskStage.DRAFT, label: 'Draft', color: 'bg-zinc-100 text-zinc-700 border-zinc-200', icon: 'file-edit' },
  { id: TaskStage.SUBMITTED, label: 'Submitted', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: 'file-text' },
  { id: TaskStage.PRICING, label: 'Penetapan Harga', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: 'dollar-sign' },
  { id: TaskStage.PRE_AUDIT, label: 'Pra audit', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: 'clipboard-check' },
  { id: TaskStage.AUDIT, label: 'Audit', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: 'search' },
  { id: TaskStage.REVIEW, label: 'Review', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: 'eye' },
  { id: TaskStage.FATWA_SESSION, label: 'Sidang Komisi Fatwa', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: 'users' },
  { id: TaskStage.CERTIFIED, label: 'Sertifikat Terbit', color: 'bg-green-100 text-green-700 border-green-200', icon: 'award' }
];

export const STAGE_SLA: Record<TaskStage, number> = {
  [TaskStage.PROSPEK]: 0,
  [TaskStage.DRAFT]: 0,
  [TaskStage.SUBMITTED]: 1,
  [TaskStage.PRICING]: 2,
  [TaskStage.PRE_AUDIT]: 3,
  [TaskStage.AUDIT]: 7,
  [TaskStage.REVIEW]: 3,
  [TaskStage.FATWA_SESSION]: 2,
  [TaskStage.CERTIFIED]: 1,
};

export const DEFAULT_CHECKLISTS: Record<TaskStage, string[]> = {
  [TaskStage.PROSPEK]: ['Kontak Pertama', 'Kebutuhan Sertifikasi', 'Penawaran Awal'],
  [TaskStage.DRAFT]: ['Dokumen Dasar', 'Profil Perusahaan', 'Draft Aplikasi'],
  [TaskStage.SUBMITTED]: ['Formulir Pendaftaran', 'NIB / Izin Usaha', 'Data Penyelia Halal'],
  [TaskStage.PRICING]: ['Invoice Terbit', 'Konfirmasi Pembayaran'],
  [TaskStage.PRE_AUDIT]: ['Review Dokumen Bahan', 'Matriks Produk', 'Manual SJPH'],
  [TaskStage.AUDIT]: ['Laporan Audit Lapangan', 'Foto Fasilitas Prod', 'Checklist Temuan'],
  [TaskStage.REVIEW]: ['Verifikasi Hasil Audit', 'Draft Ketetapan Halal'],
  [TaskStage.FATWA_SESSION]: ['Hasil Sidang Fatwa', 'Berita Acara'],
  [TaskStage.CERTIFIED]: ['E-Sertifikat', 'Copy Sertifikat Fisik'],
};

export const getIcon = (iconName: string, size = 18) => {
  switch (iconName) {
    case 'file-text': return <FileText size={size} />;
    case 'dollar-sign': return <DollarSign size={size} />;
    case 'clipboard-check': return <ClipboardCheck size={size} />;
    case 'search': return <Search size={size} />;
    case 'eye': return <Eye size={size} />;
    case 'users': return <Users size={size} />;
    case 'award': return <Award size={size} />;
    case 'trash': return <Trash2 size={size} />;
    case 'pause': return <Pause size={size} />;
    case 'play': return <Play size={size} />;
    case 'users': return <Users size={size} />;
    case 'user-plus': return <UserPlus size={size} />;
    case 'file-edit': return <FileEdit size={size} />;
    default: return <FileText size={size} />;
  }
};
