import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ListTodo, Calendar } from 'lucide-react';
import { Task, TaskStage } from '../types';
import { STAGES } from '../constants';

interface StatsDashboardProps {
  tasks: Task[];
  overdueCount: number;
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ tasks, overdueCount }) => {
  const data = STAGES.map(stage => ({
    name: stage.label,
    count: tasks.filter(t => t.stage === stage.id).length,
    color: '#6366f1' // Defaulting to indigo for a unified premium look
  }));

  const totalTasks = tasks.length;
  const completed = tasks.filter(t => t.stage === TaskStage.CERTIFIED).length;
  // const completionRate = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;
  const onTimeRate = totalTasks > 0 ? Math.round(((totalTasks - overdueCount) / totalTasks) * 100) : 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
      {/* Chart Section */}
      <div className="lg:col-span-8 glass-panel p-8 md:p-10 rounded-[3rem] border-white/60 shadow-xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Progress Sertifikasi</h3>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Distribusi Real-time Pengajuan</p>
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          </div>
        </div>

        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ bottom: 40, top: 10 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                dy={15}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} />
              <Tooltip
                cursor={{ fill: 'rgba(241, 245, 249, 0.5)', radius: 12 }}
                contentStyle={{
                  borderRadius: '24px',
                  border: '1px solid rgba(255,255,255,0.8)',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)',
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  padding: '12px 20px',
                  fontWeight: '800'
                }}
              />
              <Bar dataKey="count" radius={[12, 12, 12, 12]} barSize={32}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={[
                    '#10b981', // Emerald (Submitted)
                    '#6366f1', // Indigo (Penetapan Harga)
                    '#8b5cf6', // Violet (Pra audit)
                    '#f59e0b', // Amber (Audit)
                    '#f43f5e', // Rose (Review)
                    '#ec4899', // Pink (Sidang)
                    '#06b6d4'  // Cyan (Sertifikat)
                  ][index % 7]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {/* Progress Card */}
        <div className="premium-gradient-green p-8 rounded-[3rem] text-white shadow-2xl shadow-emerald-200 relative overflow-hidden group">
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>

          <div className="relative z-10">
            <p className="text-emerald-100 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Ketepatan Waktu (SLA)</p>
            <div className="flex items-baseline gap-2 mb-8">
              <h2 className="text-6xl font-black">{onTimeRate}</h2>
              <span className="text-lg font-bold text-emerald-100/60 uppercase">%</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-100">Status Task</span>
                <span className="text-xl font-black text-white">{totalTasks - overdueCount} <span className="text-xs text-emerald-200 font-bold">/ {totalTasks}</span></span>
              </div>
              <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className={`h-full transition-all duration-1000 ease-out ${onTimeRate > 80 ? 'bg-white' : onTimeRate > 50 ? 'bg-indigo-300' : 'bg-rose-400'}`}
                  style={{ width: `${onTimeRate}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-emerald-100 font-medium pt-2">
                {overdueCount > 0 ? `${overdueCount} task melebihi batas waktu` : 'Semua task sesuai target waktu'}
              </p>
            </div>
          </div>
        </div>

        {/* Small Metrics */}
        <div className="grid grid-cols-1 gap-6 flex-1">
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-sm flex items-center justify-between group hover:shadow-xl transition-all duration-500">
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Antrean Aktif</p>
              <h2 className="text-3xl font-black text-slate-900">{totalTasks - completed}</h2>
            </div>
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <ListTodo size={28} />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-sm flex items-center justify-between group hover:shadow-xl transition-all duration-500">
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">SLA Rata-rata</p>
              <h2 className="text-3xl font-black text-slate-900">12<span className="text-sm ml-1 text-slate-300">hari</span></h2>
            </div>
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <Calendar size={28} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
