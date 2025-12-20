
import React from 'react';
import { Settings, Clock, ShieldCheck, Database, Info, Save, RefreshCw } from 'lucide-react';
import { STAGES } from '../constants';
import { TaskStage } from '../types';

interface SettingsDashboardProps {
  slaSettings: Record<TaskStage, number>;
  onSaveSla: (settings: Record<TaskStage, number>) => void;
  isAdmin: boolean;
}

const SettingsDashboard: React.FC<SettingsDashboardProps> = ({ slaSettings, onSaveSla, isAdmin }) => {
  const [localSettings, setLocalSettings] = React.useState(slaSettings);
  const [hasChanges, setHasChanges] = React.useState(false);

  React.useEffect(() => {
    setLocalSettings(slaSettings);
  }, [slaSettings]);

  const handleChange = (stage: TaskStage, value: string) => {
    const numValue = parseInt(value) || 0;
    setLocalSettings(prev => ({ ...prev, [stage]: numValue }));
    setHasChanges(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* SLA Configuration */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Target SLA (Hari)</h3>
                  <p className="text-xs text-slate-500 font-medium">Batas waktu maksimal pengerjaan per tahapan</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isAdmin && (
                  <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-full uppercase">Read Only</span>
                )}
                {isAdmin && (
                  <button
                    onClick={() => onSaveSla(localSettings)}
                    disabled={!hasChanges}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    <Save size={14} />
                    Simpan Perubahan
                  </button>
                )}
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {STAGES.map((stage) => (
                  <div key={stage.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">{stage.label}</p>
                      <p className="text-sm font-bold text-slate-700">Target Durasi</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        disabled={!isAdmin}
                        value={localSettings[stage.id] || 0}
                        onChange={(e) => handleChange(stage.id, e.target.value)}
                        className="w-16 px-2 py-2 bg-white border border-slate-200 rounded-xl text-center font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 outline-none disabled:bg-slate-100 disabled:text-slate-400 transition-all"
                      />
                      <span className="text-xs font-bold text-slate-400">Hari</span>
                    </div>
                  </div>
                ))}
              </div>
              {isAdmin && (
                <div className="mt-6 flex items-center gap-2 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 text-xs font-medium">
                  <Info size={16} />
                  Perubahan akan langsung berdampak pada indikator "Overdue" di Dashboard dan Kanban.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Informasi Sistem</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500 font-medium">Versi Aplikasi</span>
                <span className="text-sm font-bold text-slate-800">2.0.4-pro</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Database Status</span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  Database Connected
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-500 font-medium">AI Engine</span>
                <span className="text-sm font-bold text-indigo-600">Gemini 3 Flash</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                <Database size={20} />
              </div>
              <h3 className="font-bold">Pemeliharaan Data</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Gunakan fungsi ini untuk membersihkan cache atau mereset aplikasi ke pengaturan pabrik.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCw size={14} />
                Segarkan Cache
              </button>
              {isAdmin && (
                <button
                  onClick={() => {
                    if (confirm("Hapus SEMUA data task dan user? Tindakan ini tidak dapat dibatalkan.")) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold transition-all"
                >
                  Reset Factory Data
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsDashboard;
