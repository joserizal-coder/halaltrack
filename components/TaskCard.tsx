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
      className={`bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-visible ${isOverdue ? 'border-red-200 ring-1 ring-red-100' : 'border-slate-200'} ${isOnHold ? 'opacity-70 grayscale-[0.5]' : ''}`}
      onClick={() => onOpenDetail(task)}
    >
      {isOverdue && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg flex items-center gap-1 uppercase tracking-tighter">
            <AlertCircle size={10} /> Overdue
          </div>
        </div>
      )}

      {isOnHold && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-slate-500 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg flex items-center gap-1 uppercase tracking-tighter">
            <Pause size={10} /> On Hold
          </div>
        </div>
      )}
      
      <div className="flex justify-end items-start mb-2 relative">
        <div className="relative">
          {canEdit && (
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="text-slate-400 hover:text-slate-600 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded"
            >
              <MoreVertical size={16} />
            </button>
          )}
          
          {showMenu && canEdit && (
            <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-1 overflow-hidden animate-in fade-in zoom-in duration-100">
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleHold(task.id); setShowMenu(false); }}
                className="w-full text-left px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
              >
                {isOnHold ? <Play size={14} className="text-blue-500" /> : <Pause size={14} className="text-amber-500" />}
                {isOnHold ? 'Resume' : 'Hold'}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(task.id); setShowMenu(false); }}
                className="w-full text-left px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      <h4 className="font-semibold text-slate-800 text-sm mb-1 leading-tight">{task.name}</h4>
      {canEdit && <p className="text-xs text-slate-500 mb-3 line-clamp-1">{task.company}</p>}
      
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Calendar size={12} />
          <span>{new Date(task.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <User size={12} />
          <span>{task.assignedTo}</span>
        </div>
        <div className={`flex items-center gap-1 text-[11px] font-medium ${isOverdue ? 'text-red-600' : 'text-slate-400'}`}>
          <Clock size={12} />
          <span>{daysInStage}h / {slaLimit}h</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
        <div className="flex -space-x-2">
           <img src={`https://i.pravatar.cc/150?u=${task.assignedTo}`} alt="Assignee" className="w-6 h-6 rounded-full border-2 border-white" />
        </div>
        {canEdit && !isOnHold && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onMoveForward(task.id);
            }}
            className={`p-1.5 rounded-lg transition-colors ${isOverdue ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'}`}
            title="Move to Next Stage"
          >
            <Sparkles size={14} className={isOverdue ? "animate-pulse" : ""} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;