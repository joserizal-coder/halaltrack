import React from 'react';
import { Task } from '../types';
import { STAGE_SLA, STAGES } from '../constants';
import { Eye, ChevronRight, Clock, AlertCircle, Trash2, Pause, Play, CheckCircle } from 'lucide-react';

interface TaskTableProps {
  tasks: Task[];
  canEdit: boolean;
  onOpenDetail: (task: Task) => void;
  onMoveForward: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onToggleHold: (taskId: string) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, canEdit, onOpenDetail, onMoveForward, onDelete, onToggleHold }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produk & Perusahaan</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tahap Saat Ini</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">SLA Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tasks.map((task) => {
              const updatedAt = new Date(task.stageUpdatedAt).getTime();
              const days = Math.floor((Date.now() - updatedAt) / (1000 * 60 * 60 * 24));
              const slaLimit = STAGE_SLA[task.stage];
              const isOverdue = days >= slaLimit && task.status !== 'On Hold';
              const isOnHold = task.status === 'On Hold';

              return (
                <tr key={task.id} className={`hover:bg-slate-50/80 transition-colors group ${isOnHold ? 'opacity-60' : ''}`}>
                  <td className="px-6 py-5">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{task.name}</p>
                      {canEdit && <p className="text-xs text-slate-500">{task.company}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold uppercase border border-slate-200">
                      {task.stage}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      {slaLimit === 0 ? (
                        <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs">
                          <CheckCircle size={14} />
                          <span>No Limit</span>
                        </div>
                      ) : isOverdue ? (
                        <div className="flex items-center gap-1.5 text-red-600 font-bold text-xs">
                          <AlertCircle size={14} />
                          <span>Overdue ({days}d)</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                          <Clock size={14} />
                          <span>{days}d / {slaLimit}d</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onOpenDetail(task)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye size={16} />
                      </button>
                      {canEdit && (
                        <>
                          <button
                            onClick={() => onToggleHold(task.id)}
                            className={`p-2 rounded-lg transition-colors ${isOnHold ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}
                            title={isOnHold ? "Lanjutkan" : "Hold"}
                          >
                            {isOnHold ? <Play size={16} /> : <Pause size={16} />}
                          </button>
                          <button
                            onClick={() => onMoveForward(task.id)}
                            className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                            title="Lanjut Tahap"
                          >
                            <ChevronRight size={16} />
                          </button>
                          <button
                            onClick={() => onDelete(task.id)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center">
                  <p className="text-slate-400 font-medium">Tidak ada data ditemukan.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;