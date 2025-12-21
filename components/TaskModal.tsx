import React, { useState, useEffect } from 'react';
import { X, MessageSquare, AlertTriangle, Clock, Calendar, User, CheckCircle, FileText, ChevronRight, Pause, Play, CheckSquare, Square, Edit2, Save } from 'lucide-react';
import { Task, TaskStage } from '../types';
import { STAGES, getIcon, STAGE_SLA } from '../constants';

interface TaskModalProps {
  task: Task | null;
  canEdit: boolean;
  onClose: () => void;
  onUpdateStage: (taskId: string, newStage: TaskStage) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => Promise<boolean>;
  onToggleHold: (taskId: string) => void;
  onToggleChecklist: (taskId: string, stage: TaskStage, itemId: string) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, canEdit, onClose, onUpdateStage, onUpdateTask, onToggleHold, onToggleChecklist }) => {
  const [showDocs, setShowDocs] = useState(false);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    company: '',
    address: '',
    whatsapp: '',
    description: ''
  });

  useEffect(() => {
    if (task) {
      setShowDocs(false);
      setEditForm({
        name: task.name,
        company: task.company,
        address: task.address || '',
        whatsapp: task.whatsapp || '',
        description: task.description
      });
      setIsEditing(false);
    }
  }, [task]);

  const handleSave = async () => {
    if (!task) return;
    const success = await onUpdateTask(task.id, editForm);
    if (success) setIsEditing(false);
  };

  if (!task) return null;

  const currentStageIndex = STAGES.findIndex(s => s.id === task.stage);
  const updatedAt = new Date(task.stageUpdatedAt).getTime();
  const daysInStage = Math.floor((Date.now() - updatedAt) / (1000 * 60 * 60 * 24));
  const slaLimit = STAGE_SLA[task.stage] || 0;
  // Jika slaLimit adalah 0, maka tidak akan pernah dianggap overdue
  const isOverdue = slaLimit > 0 && daysInStage >= slaLimit && task.status !== 'On Hold';
  const isOnHold = task.status === 'On Hold';



  const currentChecklist = task.checklist[task.stage] || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/40 backdrop-blur-xl transition-all duration-500">
      <div className="bg-white/90 backdrop-blur-2xl w-full max-w-5xl rounded-[3rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.1)] border border-white overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8 duration-500">
        {/* Header Section */}
        <div className="p-8 md:p-10 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50">
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl ${isOnHold ? 'bg-slate-400' : isOverdue ? 'premium-gradient-blue bg-rose-500 shadow-rose-200' : 'premium-gradient-green shadow-emerald-200'}`}>
              {getIcon(STAGES[currentStageIndex]?.icon || 'file-text', 32)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isOnHold ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-600'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isOnHold ? 'bg-slate-400' : 'bg-emerald-500 animate-pulse'}`}></span>
                  {isOnHold ? 'Tertunda' : 'Sedang Diproses'}
                </span>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">#{task.id.slice(0, 8)}</span>
              </div>

              {isEditing ? (
                <div className="space-y-3 mb-2">
                  <input
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    className="text-2xl font-black text-slate-900 w-full bg-slate-50 border-b-2 border-emerald-500 focus:outline-none px-2 py-1"
                    placeholder="Nama Produk"
                  />
                  <input
                    value={editForm.company}
                    onChange={e => setEditForm({ ...editForm, company: e.target.value })}
                    className="text-sm font-bold text-slate-500 w-full bg-slate-50 border-b-2 border-slate-200 focus:border-emerald-500 focus:outline-none px-2 py-1"
                    placeholder="Nama Perusahaan"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-black text-slate-900 leading-tight">{task.name}</h2>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{task.company}</p>
                    {(task.whatsapp || task.address) && <div className="h-4 w-[1px] bg-slate-200"></div>}
                    {task.whatsapp && (
                      <a
                        href={`https://wa.me/${task.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-black text-xs uppercase tracking-widest transition-colors"
                      >
                        <MessageSquare size={14} />
                        Hubungi WA
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="absolute top-8 right-8 flex gap-3">
            {canEdit && (
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`p-3 rounded-2xl transition-all shadow-sm group flex items-center gap-2 ${isEditing ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'text-slate-400 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-100'}`}
              >
                {isEditing ? <Save size={20} /> : <Edit2 size={20} />}
                {isEditing && <span className="font-bold text-xs pr-1">Simpan</span>}
              </button>
            )}
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="p-3 bg-white text-slate-400 hover:text-rose-500 rounded-2xl transition-all shadow-sm border border-slate-100 hover:border-rose-100"
              >
                <X size={20} />
              </button>
            )}
            {!isEditing && (
              <button onClick={onClose} className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-slate-100 group">
                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            )}
          </div>
        </div>

        {/* content body */}
        <div className="flex-1 overflow-y-auto p-8 md:p-10 custom-scrollbar bg-slate-50/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Info Area */}
            <div className="lg:col-span-8 space-y-10">
              {/* Overdue Warning */}
              {isOverdue && (
                <div className="bg-rose-50 border border-rose-100 rounded-[2rem] p-6 flex items-start gap-5 animate-in slide-in-from-top-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm border border-rose-100 shrink-0">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-rose-900 text-sm uppercase tracking-wide">Target Waktu Terlewati</h4>
                    <p className="text-rose-700/80 text-sm mt-1 font-semibold leading-relaxed">
                      Proses ini telah melebihi batas {slaLimit} hari. Mohon segera selesaikan item dokumen untuk menjaga performa layanan LPH.
                    </p>
                  </div>
                </div>
              )}

              {/* Prospek/Draft Note */}
              {slaLimit === 0 && (
                <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 flex items-start gap-5">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm uppercase tracking-wide">Tahap Fleksibel</h4>
                    <p className="text-slate-500 text-sm mt-1 font-semibold leading-relaxed">
                      Tahapan ini tidak memiliki batasan waktu (SLA). Fokus pada kelengkapan data sebelum dikirim ke tahap selanjutnya.
                    </p>
                  </div>
                </div>
              )}

              {/* Detail Pelaku Usaha */}
              {canEdit && (
                <div className="p-8 md:p-10 glass-panel rounded-[2.5rem] bg-white border-white/80">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <FileText size={18} />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Detail Pelaku Usaha</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Alamat Perusahaan</p>
                      {isEditing ? (
                        <textarea
                          value={editForm.address}
                          onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                          className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-sm font-medium"
                          placeholder="Alamat lengkap..."
                        />
                      ) : (
                        <p className="text-sm font-bold text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          {task.address || 'Alamat belum diatur'}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Informasi Kontak</p>
                      {isEditing ? (
                        <input
                          value={editForm.whatsapp}
                          onChange={e => setEditForm({ ...editForm, whatsapp: e.target.value })}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-sm font-medium"
                          placeholder="0812..."
                        />
                      ) : (
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-700">{task.whatsapp || 'No. WA belum diatur'}</span>
                          {task.whatsapp && (
                            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                              <MessageSquare size={16} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Deskripsi Singkat</h4>
                    {isEditing ? (
                      <textarea
                        value={editForm.description}
                        onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-sm font-medium"
                        placeholder="Deskripsi produk/usaha..."
                      />
                    ) : (
                      <p className="text-slate-600 text-[15px] font-medium leading-relaxed">
                        {task.description || 'Tidak ada deskripsi tambahan.'}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Modern Stepper */}
              <div className="p-8 glass-panel rounded-[2.5rem] overflow-x-auto custom-scrollbar border-white/80">
                <div className="flex justify-between items-center min-w-[800px] relative px-4">
                  {/* Progress Line */}
                  <div className="absolute top-6 left-0 right-0 h-1.5 bg-slate-100/50 rounded-full mx-12">
                    <div
                      className="h-full premium-gradient-green rounded-full transition-all duration-1000"
                      style={{ width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%` }}
                    ></div>
                  </div>

                  {STAGES.map((stage, idx) => {
                    const isCompleted = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div key={stage.id} className="flex flex-col items-center z-10 w-24">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' :
                          isCurrent ? (isOnHold ? 'bg-slate-600' : isOverdue ? 'bg-rose-500' : 'premium-gradient-blue') + ' text-white scale-125 shadow-2xl shadow-indigo-200' :
                            'bg-white text-slate-300 border-2 border-slate-50 shadow-sm'
                          }`}>
                          {isCompleted ? <CheckCircle size={22} strokeWidth={2.5} /> : getIcon(stage.icon, 22)}
                        </div>
                        <span className={`text-[9px] mt-4 font-black uppercase text-center leading-tight tracking-[0.1em] ${isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
                          {stage.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Interaction Tabs */}
              <div className="space-y-6">
                <div className="flex bg-white/50 p-1.5 rounded-[1.5rem] border border-slate-200/60 w-fit">
                  <button
                    onClick={() => setShowDocs(false)}
                    className={`px-8 py-3 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 ${!showDocs ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Detail Deskripsi
                  </button>
                  <button
                    onClick={() => setShowDocs(true)}
                    className={`px-8 py-3 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 ${showDocs ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Checklist Dokumen
                  </button>
                </div>

                <div className="min-h-[200px]">
                  {!showDocs ? (
                    <div className="p-8 bg-white/50 border border-white rounded-[2rem] shadow-sm text-slate-600 leading-relaxed font-medium animate-in fade-in slide-in-from-left-4">
                      <p className="first-letter:text-4xl first-letter:font-black first-letter:text-emerald-600 first-letter:mr-1 first-letter:float-left">{task.description}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-4">
                      {currentChecklist.map((item, idx) => (
                        <button
                          key={item.id}
                          style={{ animationDelay: `${idx * 50}ms` }}
                          onClick={() => canEdit && onToggleChecklist(task.id, task.stage, item.id)}
                          className={`flex items-center gap-4 p-5 bg-white/80 backdrop-blur-sm rounded-3xl border transition-all text-left shadow-sm group animate-in slide-in-from-bottom-2 ${canEdit ? 'border-transparent hover:border-emerald-500 hover:shadow-emerald-100 hover:translate-y-[-2px]' : 'border-slate-50 cursor-default'} ${item.completed ? 'bg-emerald-50/30' : ''}`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${item.completed ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-300 group-hover:bg-emerald-50 group-hover:text-emerald-400'}`}>
                            {item.completed ? <CheckSquare size={20} strokeWidth={2.5} /> : <Square size={20} />}
                          </div>
                          <span className={`text-[13px] font-bold ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                            {item.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Meta Info */}
            <div className="lg:col-span-4 space-y-8">


              {/* Status Meta */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Rangkuman Data</h4>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                      <Calendar size={22} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Tanggal Masuk</p>
                      <p className="text-sm font-black text-slate-900">{new Date(task.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm ${isOverdue ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-blue-50 border-blue-100 text-blue-500'}`}>
                      <Clock size={22} />
                    </div>
                    {slaLimit > 0 ? (
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Lama Di Tahap Ini</p>
                        <p className={`text-sm font-black ${isOverdue ? 'text-rose-600' : 'text-slate-900'}`}>
                          {daysInStage} Hari <span className="text-[10px] opacity-40 font-bold">/ Limit {slaLimit}h</span>
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Status Tahap</p>
                        <p className="text-sm font-black text-slate-900">Sedang Diproses</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignedTo}`} alt="Assignee" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Penanggung Jawab</p>
                      <p className="text-sm font-black text-slate-900">{task.assignedTo}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {canEdit && (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      const nextStage = STAGES[currentStageIndex + 1]?.id;
                      if (nextStage) onUpdateStage(task.id, nextStage as TaskStage);
                    }}
                    disabled={currentStageIndex === STAGES.length - 1 || isOnHold}
                    className="w-full py-5 premium-gradient-green hover:brightness-110 disabled:opacity-30 disabled:grayscale text-white rounded-[1.5rem] font-black uppercase text-xs tracking-[0.15em] transition-all shadow-xl shadow-emerald-200 flex items-center justify-center gap-3 group active:scale-[0.98]"
                  >
                    Lanjut Ke Tahap Berikutnya
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => onToggleHold(task.id)}
                    className={`w-full py-5 border-2 rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.15em] transition-all flex items-center justify-center gap-3 ${isOnHold ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50'}`}
                  >
                    {isOnHold ? <><Play size={18} fill="currentColor" /> Lanjutkan Proses</> : <><Pause size={18} fill="currentColor" /> Hentikan Sementara</>}
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