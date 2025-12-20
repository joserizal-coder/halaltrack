
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Task, TaskStage } from '../types';
import { STAGES } from '../constants';

interface StatsDashboardProps {
  tasks: Task[];
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ tasks }) => {
  const data = STAGES.map(stage => ({
    name: stage.label,
    count: tasks.filter(t => t.stage === stage.id).length,
    color: stage.color.split(' ')[2].replace('border-', '#')
  }));

  const totalTasks = tasks.length;
  const completed = tasks.filter(t => t.stage === TaskStage.CERTIFIED).length;
  const completionRate = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Chart */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Distribusi Status Sertifikasi</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#64748b', fontWeight: 600}}
                interval={0}
                angle={-35}
                textAnchor="end"
              />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#059669' : '#475569'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="space-y-4">
        <div className="bg-emerald-600 p-6 rounded-2xl text-white shadow-lg shadow-emerald-200">
          <p className="text-emerald-100 text-sm font-medium mb-1">Total Task Selesai</p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-bold">{completed}</h2>
            <p className="bg-emerald-500 bg-opacity-30 px-2 py-1 rounded text-xs">Sertifikat Terbit</p>
          </div>
          <div className="mt-6 w-full bg-emerald-700 h-2 rounded-full overflow-hidden">
            <div className="bg-white h-full transition-all duration-1000" style={{ width: `${completionRate}%` }}></div>
          </div>
          <p className="mt-2 text-xs text-emerald-100">{completionRate}% dari total pengajuan telah selesai</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Antrean Aktif</p>
            <h2 className="text-2xl font-bold text-slate-800">{totalTasks - completed}</h2>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <ListTodo size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Rata-rata Durasi</p>
            <h2 className="text-2xl font-bold text-slate-800">14 Hari</h2>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <Calendar size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

import { ListTodo, Calendar } from 'lucide-react';
export default StatsDashboard;
