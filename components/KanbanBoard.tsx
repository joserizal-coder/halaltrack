
import React from 'react';
import { Task, TaskStage } from '../types';
import { STAGES } from '../constants';
import TaskCard from './TaskCard';

interface KanbanBoardProps {
  tasks: Task[];
  canEdit: boolean;
  onMoveForward: (taskId: string) => void;
  onOpenDetail: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleHold: (taskId: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, canEdit, onMoveForward, onOpenDetail, onDelete, onToggleHold }) => {
  return (
    <div id="kanban-board" className="relative">
      <div className="overflow-x-auto pb-12 custom-scrollbar -mx-6 md:-mx-12 px-6 md:px-12">
        <div className="flex gap-8 min-w-max p-4">
          {STAGES.map((stage) => {
            const stageTasks = tasks.filter(t => t.stage === stage.id);

            return (
              <div key={stage.id} className="w-[340px] flex-shrink-0 flex flex-col h-[calc(100vh-280px)] min-h-[600px] animate-in">
                {/* Column Header */}
                <div className="mb-6 sticky top-0 z-10 p-1">
                  <div className={`p-5 rounded-[2rem] border-0 flex items-center justify-between shadow-xl shadow-slate-200/50 backdrop-blur-md ${stage.color.replace('bg-', 'bg-').replace('text-', 'text-').replace('border-', 'border-')}`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-white/50 rounded-2xl shadow-sm">
                        {getIcon(stage.icon, 20)}
                      </div>
                      <span className="font-black text-xs uppercase tracking-[0.15em]">{stage.label}</span>
                    </div>
                    <div className="flex items-center justify-center min-w-[32px] h-8 bg-black/5 rounded-full px-3">
                      <span className="text-xs font-black opacity-80">
                        {stageTasks.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Task List */}
                <div className="flex-1 space-y-5 overflow-y-auto px-1 custom-scrollbar pb-8">
                  {stageTasks.length > 0 ? (
                    stageTasks.map((task, idx) => (
                      <div key={task.id} style={{ animationDelay: `${idx * 100}ms` }} className="animate-in">
                        <TaskCard
                          task={task}
                          canEdit={canEdit}
                          onMoveForward={onMoveForward}
                          onOpenDetail={onOpenDetail}
                          onDelete={onDelete}
                          onToggleHold={onToggleHold}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="h-64 border-2 border-dashed border-slate-200/80 rounded-[2.5rem] flex flex-col items-center justify-center bg-white/30 backdrop-blur-sm group hover:border-emerald-300 transition-colors">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 mb-4 group-hover:scale-110 transition-transform">
                        <Plus size={24} />
                      </div>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Belum Ada Tugas</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll indicators */}
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-50/80 to-transparent pointer-events-none rounded-r-3xl"></div>
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-50/80 to-transparent pointer-events-none rounded-l-3xl"></div>
    </div>
  );
};

import { Plus } from 'lucide-react';
import { getIcon } from '../constants';
export default KanbanBoard;
