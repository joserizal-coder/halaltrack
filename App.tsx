
import React, { useState, useEffect, useMemo } from 'react';
import { Task, TaskStage, TaskChecklistItem, UserAccount } from './types';
import { STAGES, DEFAULT_CHECKLISTS, STAGE_SLA as INITIAL_SLA } from './constants';
import { supabase } from './lib/supabase';
import Layout from './components/Layout';
import KanbanBoard from './components/KanbanBoard';
import StatsDashboard from './components/StatsDashboard';
import TaskModal from './components/TaskModal';
import TaskTable from './components/TaskTable';
import AdminDashboard from './components/AdminDashboard';
import LoginModal from './components/LoginModal';
import SettingsDashboard from './components/SettingsDashboard';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [slaSettings, setSlaSettings] = useState<Record<TaskStage, number>>(INITIAL_SLA);
  const [activeView, setActiveView] = useState<'dashboard' | 'tasks' | 'admin' | 'settings'>('dashboard');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isAddingProspek, setIsAddingProspek] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data Awal
  useEffect(() => {
    const initApp = async () => {
      setLoading(true);

      // Check Auth
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setCurrentUser({
            id: session.user.id,
            username: profile.username,
            role: profile.role,
            createdAt: session.user.created_at
          });
        }
      }

      // Fetch Tasks & Checklists
      const { data: tasksData } = await supabase
        .from('tasks')
        .select(`*, checklists(*)`)
        .order('created_at', { ascending: false });

      if (tasksData) {
        const formattedTasks = tasksData.map((t: any) => ({
          ...t,
          createdAt: t.created_at,
          stageUpdatedAt: t.stage_updated_at,
          assignedTo: t.assigned_to,
          aiAnalysis: t.ai_analysis,
          checklist: formatChecklistFromDB(t.checklists)
        }));
        setTasks(formattedTasks);
      }

      // Fetch Settings
      const { data: settingsData } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'sla_config')
        .single();

      if (settingsData) setSlaSettings(settingsData.value);

      // Fetch Users
      const { data: profilesData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (profilesData) {
        setUsers(profilesData.map(p => ({
          id: p.id,
          username: p.username,
          role: p.role,
          createdAt: p.created_at
        })));
      }

      setLoading(false);
    };

    initApp();
  }, []);

  const formatChecklistFromDB = (dbItems: any[]) => {
    const checklist: any = {};
    const items = dbItems || [];
    STAGES.forEach(stage => {
      checklist[stage.id] = items
        .filter(item => item.stage === stage.id)
        .map(item => ({ id: item.id, label: item.label, completed: item.completed }));
    });
    return checklist;
  };

  const handleLogin = async (username: string, pass: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${username}@halaltrack.com`, // Email dummy karena Supabase Auth butuh email
      password: pass
    });

    if (data.user) {
      window.location.reload(); // Refresh untuk trigger useEffect init
      return true;
    }
    return false;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    window.location.reload();
  };

  const handleUpdateStage = async (taskId: string, newStage: TaskStage) => {
    const { error } = await supabase
      .from('tasks')
      .update({ stage: newStage, stage_updated_at: new Date().toISOString() })
      .eq('id', taskId);

    if (!error) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, stage: newStage, stageUpdatedAt: new Date().toISOString() } : t));
    }
  };

  const handleToggleHold = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const newStatus = task.status === 'On Hold' ? 'Active' : 'On Hold';

    await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus as any } : t));
  };

  const handleToggleChecklist = async (taskId: string, stage: TaskStage, itemId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const item = task.checklist[stage].find(i => i.id === itemId);
    if (!item) return;

    await supabase
      .from('checklists')
      .update({ completed: !item.completed })
      .eq('id', itemId);

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const newChecklist = { ...t.checklist };
        newChecklist[stage] = newChecklist[stage].map(i => i.id === itemId ? { ...i, completed: !i.completed } : i);
        return { ...t, checklist: newChecklist };
      }
      return t;
    }));
  };

  const handleUpdateSla = async (stage: TaskStage, days: number) => {
    const newSettings = { ...slaSettings, [stage]: days };
    setSlaSettings(newSettings);
    await supabase.from('settings').update({ value: newSettings }).eq('key', 'sla_config');
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Hapus user ini?')) {
      const { error } = await supabase.from('profiles').delete().eq('id', userId);
      if (!error) setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const handleAddUser = async (user: Partial<UserAccount>) => {
    alert('Fungsi tambah user hanya tersedia di Dashboard Supabase Auth untuk alasan keamanan.');
  };

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) return;
    const formData = new FormData(e.currentTarget);

    const stage = isAddingProspek ? TaskStage.PROSPEK : TaskStage.SUBMITTED;

    const { data: newTask, error } = await supabase
      .from('tasks')
      .insert({
        name: formData.get('name') as string,
        company: formData.get('company') as string,
        description: formData.get('description') as string,
        stage: stage,
        assigned_to: currentUser.username
      })
      .select()
      .single();

    if (newTask) {
      // Create initial checklists
      const checklistItems: any[] = [];
      STAGES.forEach(stage => {
        (DEFAULT_CHECKLISTS[stage.id] || []).forEach(label => {
          checklistItems.push({ task_id: newTask.id, stage: stage.id, label, completed: false });
        });
      });
      await supabase.from('checklists').insert(checklistItems);
      window.location.reload();
    }
  };

  const filteredTasks = useMemo(() => {
    const lower = searchQuery.toLowerCase();
    return tasks.filter(t =>
      t.name.toLowerCase().includes(lower) ||
      t.company.toLowerCase().includes(lower)
    );
  }, [tasks, searchQuery]);

  const overdueTasks = useMemo(() => {
    return tasks.filter(t => {
      const days = Math.floor((Date.now() - new Date(t.stageUpdatedAt).getTime()) / (1000 * 60 * 60 * 24));
      return days >= (slaSettings[t.stage] || 0) && t.status !== 'On Hold';
    });
  }, [tasks, slaSettings]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50 font-bold text-slate-400 animate-pulse">Memuat Data LPH...</div>;

  return (
    <Layout
      activeView={activeView}
      currentUser={currentUser}
      onSearch={setSearchQuery}
      onAddNew={() => setIsAddModalOpen(true)}
      onToggleNotifications={() => setShowNotifications(!showNotifications)}
      overdueCount={overdueTasks.length}
      onNavigate={setActiveView}
      onLoginClick={() => setIsLoginModalOpen(true)}
      onLogout={handleLogout}
    >
      {activeView === 'dashboard' && (
        <>
          <StatsDashboard tasks={tasks} />
          <KanbanBoard
            tasks={filteredTasks}
            onMoveForward={(id) => handleUpdateStage(id, STAGES[STAGES.findIndex(s => s.id === tasks.find(t => t.id === id)?.stage) + 1]?.id as TaskStage)}
            onOpenDetail={setSelectedTask}
            onDelete={async (id) => { if (confirm('Hapus?')) { await supabase.from('tasks').delete().eq('id', id); setTasks(t => t.filter(x => x.id !== id)); } }}
            onToggleHold={handleToggleHold}
            canEdit={!!currentUser}
          />
        </>
      )}

      {activeView === 'tasks' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-800">Daftar Tugas Saya</h2>
            <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold border border-emerald-100 italic">
              Menampilkan {filteredTasks.length} pengajuan aktif
            </div>
          </div>
          <TaskTable
            tasks={filteredTasks}
            canEdit={!!currentUser}
            onOpenDetail={setSelectedTask}
            onMoveForward={(id) => handleUpdateStage(id, STAGES[STAGES.findIndex(s => s.id === tasks.find(t => t.id === id)?.stage) + 1]?.id as TaskStage)}
            onDelete={async (id) => { if (confirm('Hapus?')) { await supabase.from('tasks').delete().eq('id', id); setTasks(t => t.filter(x => x.id !== id)); } }}
            onToggleHold={handleToggleHold}
          />
        </div>
      )}

      {activeView === 'admin' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-800">Manajemen Pengguna</h2>
          <AdminDashboard
            users={users}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
          />
        </div>
      )}

      {activeView === 'settings' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-800">Pengaturan Sistem</h2>
          <SettingsDashboard
            slaSettings={slaSettings}
            onUpdateSla={handleUpdateSla}
            isAdmin={currentUser?.role === 'Admin'}
          />
        </div>
      )}

      {showNotifications && (
        <div className="fixed top-24 right-8 w-96 glass-panel rounded-[2.5rem] shadow-2xl z-[100] border-white/80 overflow-hidden animate-in slide-in-from-right-4">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/50">
            <h3 className="text-lg font-black text-slate-900">Notifikasi Penting</h3>
            <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div className="max-h-[500px] overflow-y-auto custom-scrollbar p-4 space-y-3">
            {overdueTasks.length > 0 ? overdueTasks.map(t => (
              <div key={t.id} onClick={() => { setSelectedTask(t); setShowNotifications(false); }} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl cursor-pointer hover:bg-rose-100 transition-all">
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Terlambat ({Math.floor((Date.now() - new Date(t.stageUpdatedAt).getTime()) / (1000 * 60 * 60 * 24))} hari)</p>
                <p className="text-sm font-bold text-slate-800">{t.name}</p>
                <p className="text-[11px] text-slate-500">{t.company}</p>
              </div>
            )) : (
              <div className="p-8 text-center">
                <p className="text-slate-400 text-sm font-medium">Tidak ada notifikasi mendesak.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Pengajuan Baru</h2>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => setIsAddingProspek(false)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!isAddingProspek ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500'}`}
                >Langsung Submit</button>
                <button
                  type="button"
                  onClick={() => setIsAddingProspek(true)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${isAddingProspek ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500'}`}
                >Data Prospek</button>
              </div>
              <input name="name" placeholder="Nama Produk" className="w-full p-3 border rounded-xl bg-slate-50" required />
              <input name="company" placeholder="Perusahaan" className="w-full p-3 border rounded-xl bg-slate-50" required />
              <textarea name="description" placeholder="Deskripsi" className="w-full p-3 border rounded-xl bg-slate-50 h-24"></textarea>
              <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl">Simpan ke Cloud</button>
              <button type="button" onClick={() => { setIsAddModalOpen(false); setIsAddingProspek(false); }} className="w-full py-3 text-slate-400 font-bold">Batal</button>
            </form>
          </div>
        </div>
      )}

      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} />
      )}

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          canEdit={!!currentUser}
          onClose={() => setSelectedTask(null)}
          onUpdateStage={handleUpdateStage}
          onToggleHold={handleToggleHold}
          onToggleChecklist={handleToggleChecklist}
        />
      )}
    </Layout>
  );
};

export default App;
