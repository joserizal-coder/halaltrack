
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
      <div className="overflow-x-auto pb-10 custom-scrollbar -mx-6 md:-mx-10 px-6 md:px-10">
        <div className="flex gap-6 min-w-max">
          {STAGES.map((stage) => {
            const stageTasks = tasks.filter(t => t.stage === stage.id);
            
            return (
              <div key={stage.id} className="w-[300px] flex-shrink-0 flex flex-col h-[calc(100vh-450px)] min-h-[500px]">
                {/* Column Header */}
                <div className="mb-4 sticky top-0 z-10">
                  <div className={`p-4 rounded-2xl border-2 flex items-center justify-between shadow-sm ${stage.color}`}>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs uppercase tracking-wider">{stage.label}</span>
                    </div>
                    <span className="text-[10px] font-black opacity-70 bg-white/40 px-2 py-0.5 rounded-full ring-1 ring-black/5">
                      {stageTasks.length}
                    </span>
                  </div>
                </div>

                {/* Task List */}
                <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar pb-4">
                  {stageTasks.length > 0 ? (
                    stageTasks.map((task) => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        canEdit={canEdit}
                        onMoveForward={onMoveForward}
                        onOpenDetail={onOpenDetail}
                        onDelete={onDelete}
                        onToggleHold={onToggleHold}
                      />
                    ))
                  ) : (
                    <div className="h-40 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center bg-slate-50/30">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-2">
                        <Plus size={16} />
                      </div>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Kosong</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Scroll indicator for mobile */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none md:hidden"></div>
    </div>
  );
};

import { Plus } from 'lucide-react';
export default KanbanBoard;
