import React, { useState } from 'react';
import { MoreVertical, Calendar, User, Sparkles, AlertCircle, Clock, Trash2, Pause, Play } from 'lucide-react';
import { Task } from '../types';
import { STAGE_SLA } from '../constants';

interface TaskCardProps {
  task: Task;
  canEdit: boolean;
  onMoveForward: (taskId: string) => void;
  onOpenDetail: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleHold: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, canEdit, onMoveForward, onOpenDetail, onDelete, onToggleHold }) => {
  const [showMenu, setShowMenu] = useState(false);
  const updatedAt = new Date(task.stageUpdatedAt).getTime();
  const now = Date.now();
  const daysInStage = Math.floor((now - updatedAt) / (1000 * 60 * 60 * 24));
  const slaLimit = STAGE_SLA[task.stage];
  const isOverdue = daysInStage >= slaLimit && task.status !== 'On Hold';
  const isOnHold = task.status === 'On Hold';

  return (
    <div
      className={`glass-card p-5 group cursor-pointer relative overflow-visible rounded-[2rem] border-white/60 ${isOverdue ? 'ring-2 ring-rose-500/20 border-rose-100 bg-rose-50/30' : ''} ${isOnHold ? 'opacity-80 grayscale-[0.2] bg-slate-50/50' : ''}`}
      onClick={() => onOpenDetail(task)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex -space-x-3">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignedTo}`} alt="Assignee" className="w-9 h-9 rounded-2xl border-2 border-white shadow-sm" />
          <div className="w-9 h-9 rounded-2xl bg-white border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-black text-slate-400">
            +{Math.floor(Math.random() * 3)}
          </div>
        </div>

        <div className="flex gap-2">
          {isOverdue && (
            <div className="bg-rose-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider animate-pulse shadow-lg shadow-rose-200">
              <AlertCircle size={12} /> Terlambat
            </div>
          )}
          {isOnHold && (
            <div className="bg-amber-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider shadow-lg shadow-amber-200">
              <Pause size={12} /> Dihentikan
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-black text-slate-900 text-base mb-1 leading-tight group-hover:text-emerald-600 transition-colors">{task.name}</h4>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{task.company}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100/50">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Calendar size={13} />
            <span className="text-[9px] font-black uppercase tracking-wider">Terdaftar</span>
          </div>
          <p className="text-[11px] font-bold text-slate-700">{new Date(task.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
        </div>
        <div className={`p-2.5 rounded-2xl border ${isOverdue ? 'bg-rose-50/50 border-rose-100/50' : 'bg-slate-50/50 border-slate-100/50'}`}>
          <div className={`flex items-center gap-2 mb-1 ${isOverdue ? 'text-rose-500' : 'text-slate-400'}`}>
            <Clock size={13} />
            <span className="text-[9px] font-black uppercase tracking-wider">Durasi</span>
          </div>
          <p className={`text-[11px] font-bold ${isOverdue ? 'text-rose-600' : 'text-slate-700'}`}>
            {daysInStage}h <span className="text-slate-300 mx-0.5">/</span> {slaLimit}h
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sangat Aktif</span>
        </div>

        <div className="flex items-center gap-2">
          {canEdit && (
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                className="w-9 h-9 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-all"
              >
                <MoreVertical size={18} />
              </button>

              {showMenu && (
                <div className="absolute right-0 bottom-full mb-2 w-40 glass-panel rounded-2xl shadow-2xl z-50 py-2 border-slate-100 animate-in">
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleHold(task.id); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-black text-slate-600 hover:bg-slate-50 flex items-center gap-3"
                  >
                    {isOnHold ? <Play size={16} className="text-emerald-500" /> : <Pause size={16} className="text-amber-500" />}
                    {isOnHold ? 'Lanjutkan' : 'Hentikan'}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(task.id); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-black text-rose-500 hover:bg-rose-50 flex items-center gap-3"
                  >
                    <Trash2 size={16} />
                    Hapus Data
                  </button>
                </div>
              )}
            </div>
          )}

          {canEdit && !isOnHold && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveForward(task.id);
              }}
              className="w-9 h-9 premium-gradient-green text-white rounded-xl shadow-lg shadow-emerald-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
              title="Pindahkan ke Tahap Berikutnya"
            >
              <Sparkles size={16} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;