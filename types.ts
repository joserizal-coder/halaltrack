export enum TaskStage {
  SUBMITTED = 'Submitted',
  PRICING = 'Penetapan Harga',
  PRE_AUDIT = 'Pra audit',
  AUDIT = 'Audit',
  REVIEW = 'Review',
  FATWA_SESSION = 'Sidang Komisi Fatwa',
  CERTIFIED = 'Sertifikat Terbit'
}

export interface TaskChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface Task {
  id: string;
  name: string;
  company: string;
  description: string;
  stage: TaskStage;
  status: 'Active' | 'On Hold';
  createdAt: string;
  stageUpdatedAt: string;
  estimatedCompletion: string;
  assignedTo: string;
  aiAnalysis?: string;
  checklist: Record<TaskStage, TaskChecklistItem[]>;
}

export interface StageConfig {
  id: TaskStage;
  label: string;
  color: string;
  icon: string;
}

export interface UserAccount {
  id: string;
  username: string;
  password?: string;
  role: 'Admin' | 'Auditor' | 'Reviewer';
  createdAt: string;
}