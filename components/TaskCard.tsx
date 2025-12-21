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
      className={`glass-card p-3 group cursor-pointer relative overflow-visible rounded-xl border-white/60 ${isOverdue ? 'ring-2 ring-rose-500/20 border-rose-100 bg-rose-50/30' : ''} ${isOnHold ? 'opacity-80 grayscale-[0.2] bg-slate-50/50' : ''}`}
      onClick={() => onOpenDetail(task)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex -space-x-2">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignedTo}`} alt="Assignee" className="w-6 h-6 rounded-xl border-2 border-white shadow-sm" />
          <div className="w-6 h-6 rounded-xl bg-white border-2 border-white shadow-sm flex items-center justify-center text-[8px] font-black text-slate-400">
            +{Math.floor(Math.random() * 3)}
          </div>
        </div>

        <div className="flex gap-1.5">
          {isOverdue && slaLimit > 0 && (
            <div className="bg-rose-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider animate-pulse shadow-lg shadow-rose-200">
              <AlertCircle size={10} /> Terlambat
            </div>
          )}
          {isOnHold && (
            <div className="bg-amber-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider shadow-lg shadow-amber-200">
              <Pause size={10} /> Dihentikan
            </div>
          )}
        </div>
      </div>

      <div className="mb-2">
        <h4 className="font-black text-slate-900 text-sm mb-0.5 leading-tight group-hover:text-emerald-600 transition-colors">{task.name}</h4>
        {canEdit && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.company}</p>}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-slate-50/50 p-1.5 rounded-xl border border-slate-100/50">
          <div className="flex items-center gap-1.5 text-slate-400 mb-0.5">
            <Calendar size={10} />
            <span className="text-[8px] font-black uppercase tracking-wider">Terdaftar</span>
          </div>
          <p className="text-[9px] font-bold text-slate-700">{new Date(task.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
        </div>
        <div className={`p-1.5 rounded-xl border ${isOverdue && slaLimit > 0 ? 'bg-rose-50/50 border-rose-100/50' : 'bg-slate-50/50 border-slate-100/50'}`}>
          <div className={`flex items-center gap-1.5 mb-0.5 ${isOverdue && slaLimit > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
            <Clock size={10} />
            <span className="text-[8px] font-black uppercase tracking-wider">{slaLimit > 0 ? 'Durasi' : 'Diproses'}</span>
          </div>
          <p className={`text-[9px] font-bold ${isOverdue && slaLimit > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
            {daysInStage} Hari {slaLimit > 0 && <span className="text-slate-300 mx-0.5">/ {slaLimit}h</span>}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100/50">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Sangat Aktif</span>
        </div>

        <div className="flex items-center gap-2">
          {canEdit && (
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                className="w-7 h-7 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-all"
              >
                <MoreVertical size={14} />
              </button>

              {showMenu && (
                <div className="absolute right-0 bottom-full mb-2 w-36 glass-panel rounded-xl shadow-2xl z-50 py-1.5 border-slate-100 animate-in">
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleHold(task.id); setShowMenu(false); }}
                    className="w-full text-left px-3 py-2 text-[10px] font-black text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                  >
                    {isOnHold ? <Play size={14} className="text-emerald-500" /> : <Pause size={14} className="text-amber-500" />}
                    {isOnHold ? 'Lanjutkan' : 'Hentikan'}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(task.id); setShowMenu(false); }}
                    className="w-full text-left px-3 py-2 text-[10px] font-black text-rose-500 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <Trash2 size={14} />
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
              className="w-7 h-7 premium-gradient-green text-white rounded-lg shadow-lg shadow-emerald-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
              title="Pindahkan ke Tahap Berikutnya"
            >
              <Sparkles size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;