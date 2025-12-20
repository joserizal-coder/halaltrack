
import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2, CheckCircle, ChevronRight, Clock, AlertTriangle, FileText, Calendar, User, Pause, Play, CheckSquare, Square } from 'lucide-react';
import { Task, TaskStage } from '../types';
import { STAGES, getIcon, STAGE_SLA } from '../constants';
import { analyzeTask } from '../services/geminiService';

interface TaskModalProps {
  task: Task | null;
  canEdit: boolean;
  onClose: () => void;
  onUpdateStage: (taskId: string, newStage: TaskStage) => void;
  onToggleHold: (taskId: string) => void;
  onToggleChecklist: (taskId: string, stage: TaskStage, itemId: string) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, canEdit, onClose, onUpdateStage, onToggleHold, onToggleChecklist }) => {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [showDocs, setShowDocs] = useState(false);

  useEffect(() => {
    if (task) {
      setAiInsight(task.aiAnalysis || null);
      setShowDocs(false);
    } else {
      setAiInsight(null);
    }
  }, [task]);

  if (!task) return null;

  const currentStageIndex = STAGES.findIndex(s => s.id === task.stage);
  const updatedAt = new Date(task.stageUpdatedAt).getTime();
  const daysInStage = Math.floor((Date.now() - updatedAt) / (1000 * 60 * 60 * 24));
  const slaLimit = STAGE_SLA[task.stage];
  const isOverdue = daysInStage >= slaLimit && task.status !== 'On Hold';
  const isOnHold = task.status === 'On Hold';

  const handleRunAi = async () => {
    setLoadingAi(true);
    const result = await analyzeTask(task.name, task.description, task.stage);
    setAiInsight(result);
    setLoadingAi(false);
  };

  const currentChecklist = task.checklist[task.stage] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase mb-1">
              <span className={`w-2 h-2 rounded-full ${isOnHold ? 'bg-slate-400' : 'bg-emerald-600 animate-pulse'}`}></span>
              {isOnHold ? 'Task is On Hold' : 'Live Tracking'}
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{task.name}</h2>
            {canEdit && <p className="text-slate-500 font-medium">{task.company}</p>}
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* SLA Alert */}
              {isOverdue && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 flex-shrink-0">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-red-800 text-sm">Target SLA Terlewati</h4>
                    <p className="text-red-700 text-xs mt-1 leading-relaxed">
                      Batas {slaLimit} hari untuk tahap ini terlewati. Segera selesaikan item dokumen yang diperlukan.
                    </p>
                  </div>
                </div>
              )}

              {/* Stepper */}
              <div className="relative py-4 overflow-x-auto custom-scrollbar">
                <div className="flex justify-between items-center min-w-[700px] px-4">
                  {STAGES.map((stage, idx) => {
                    const isCompleted = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    
                    return (
                      <div key={stage.id} className="flex flex-col items-center flex-1 relative group">
                        {idx < STAGES.length - 1 && (
                          <div className={`absolute top-4.5 left-[50%] right-[-50%] h-1 transition-colors duration-500 ${idx < currentStageIndex ? 'bg-emerald-500' : 'bg-slate-100'}`}></div>
                        )}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white z-10 transition-all duration-300 ${
                          isCompleted ? 'bg-emerald-500' : isCurrent ? (isOnHold ? 'bg-slate-500' : isOverdue ? 'bg-red-500' : 'bg-blue-600') + ' scale-110 shadow-lg' : 'bg-slate-100 text-slate-300'
                        }`}>
                          {isCompleted ? <CheckCircle size={20} /> : getIcon(stage.icon, 20)}
                        </div>
                        <span className={`text-[10px] mt-3 font-bold text-center w-20 leading-tight transition-colors ${isCurrent ? 'text-slate-800' : 'text-slate-400'}`}>
                          {stage.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Checklist & Description Toggler */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowDocs(false)}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${!showDocs ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:bg-slate-100'}`}
                  >
                    Deskripsi
                  </button>
                  <button 
                    onClick={() => setShowDocs(true)}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${showDocs ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:bg-slate-100'}`}
                  >
                    Dokumen ({currentChecklist.filter(i => i.completed).length}/{currentChecklist.length})
                  </button>
                </div>

                {!showDocs ? (
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 leading-relaxed text-sm animate-in fade-in slide-in-from-left-2">
                    {task.description}
                  </div>
                ) : (
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-right-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Checklist Tahap {task.stage}</h4>
                    <div className="space-y-3">
                      {currentChecklist.map(item => (
                        <button 
                          key={item.id}
                          onClick={() => canEdit && onToggleChecklist(task.id, task.stage, item.id)}
                          className={`w-full flex items-center gap-3 p-3 bg-white rounded-xl border transition-all text-left group ${canEdit ? 'border-slate-200 hover:border-emerald-500' : 'border-slate-100 cursor-default'}`}
                        >
                          {item.completed ? (
                            <CheckSquare className="text-emerald-500" size={20} />
                          ) : (
                            <Square className="text-slate-300 group-hover:text-emerald-400" size={20} />
                          )}
                          <span className={`text-sm font-medium ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                            {item.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* AI Section */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 bg-indigo-50/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                      <Sparkles size={16} />
                    </div>
                    <h3 className="font-bold text-indigo-900 text-sm tracking-tight">AI Certification Assistant</h3>
                  </div>
                  {canEdit && (
                    <button 
                      onClick={handleRunAi}
                      disabled={loadingAi}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                      {loadingAi ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      {aiInsight ? 'Update Analisis' : 'Mulai Analisis'}
                    </button>
                  )}
                </div>
                <div className="p-6">
                  {aiInsight ? (
                    <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line prose prose-slate max-w-none">
                      {aiInsight}
                    </div>
                  ) : loadingAi ? (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                      <Loader2 size={32} className="animate-spin mb-4 text-indigo-500" />
                      <p className="text-sm animate-pulse">Meninjau data sertifikasi...</p>
                    </div>
                  ) : (
                    <p className="text-center text-slate-400 text-sm py-4 italic">Ringkasan strategis AI akan tampil di sini bagi pengguna terdaftar.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Meta */}
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Status Info</h4>
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Dibuka</label>
                      <p className="text-sm font-bold text-slate-700">{new Date(task.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-100 ${isOverdue ? 'text-red-500' : 'text-blue-500'}`}>
                      <Clock size={18} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Durasi Tahap</label>
                      <p className={`text-sm font-bold ${isOverdue ? 'text-red-600' : 'text-slate-700'}`}>
                        {daysInStage} Hari <span className="text-[10px] text-slate-400 font-normal ml-1">/ Max {slaLimit}h</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {canEdit && (
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => {
                      const nextStage = STAGES[currentStageIndex + 1]?.id;
                      if (nextStage) onUpdateStage(task.id, nextStage as TaskStage);
                    }}
                    disabled={currentStageIndex === STAGES.length - 1 || isOnHold}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 group"
                  >
                    Tahap Berikutnya
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => onToggleHold(task.id)}
                    className={`w-full py-4 border rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${isOnHold ? 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {isOnHold ? <Play size={18} /> : <Pause size={18} />}
                    {isOnHold ? 'Lanjutkan Proses' : 'Tandai On Hold'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;