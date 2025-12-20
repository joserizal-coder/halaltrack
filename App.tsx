
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

      setLoading(false);
    };

    initApp();
  }, []);

  const formatChecklistFromDB = (dbItems: any[]) => {
    const checklist: any = {};
    STAGES.forEach(stage => {
      checklist[stage.id] = dbItems
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

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) return;
    const formData = new FormData(e.currentTarget);

    const { data: newTask, error } = await supabase
      .from('tasks')
      .insert({
        name: formData.get('name') as string,
        company: formData.get('company') as string,
        description: formData.get('description') as string,
        stage: TaskStage.SUBMITTED,
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

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50 font-bold text-slate-400 animate-pulse">Memuat Data LPH...</div>;

  return (
    <Layout
      activeView={activeView}
      currentUser={currentUser}
      onSearch={setSearchQuery}
      onAddNew={() => setIsAddModalOpen(true)}
      onToggleNotifications={() => setShowNotifications(!showNotifications)}
      onNavigate={setActiveView}
      onLoginClick={() => setIsLoginModalOpen(true)}
      onLogout={handleLogout}
    >
      {activeView === 'dashboard' && (
        <KanbanBoard
          tasks={filteredTasks}
          onMoveForward={(id) => handleUpdateStage(id, STAGES[STAGES.findIndex(s => s.id === tasks.find(t => t.id === id)?.stage) + 1]?.id as TaskStage)}
          onOpenDetail={setSelectedTask}
          onDelete={async (id) => { if (confirm('Hapus?')) { await supabase.from('tasks').delete().eq('id', id); setTasks(t => t.filter(x => x.id !== id)); } }}
          onToggleHold={handleToggleHold}
          canEdit={!!currentUser}
        />
      )}
      {/* View lainnya tetap menggunakan logic serupa yang telah di-refactor */}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Pengajuan Baru</h2>
            <form onSubmit={handleAddTask} className="space-y-4">
              <input name="name" placeholder="Nama Produk" className="w-full p-3 border rounded-xl bg-slate-50" required />
              <input name="company" placeholder="Perusahaan" className="w-full p-3 border rounded-xl bg-slate-50" required />
              <textarea name="description" placeholder="Deskripsi" className="w-full p-3 border rounded-xl bg-slate-50 h-24"></textarea>
              <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl">Simpan ke Cloud</button>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="w-full py-3 text-slate-400 font-bold">Batal</button>
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
