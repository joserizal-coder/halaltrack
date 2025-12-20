
import React from 'react';
import { LayoutDashboard, ListTodo, Settings, Bell, Search as SearchIcon, Plus, ShieldCheck, LogIn, LogOut } from 'lucide-react';
import { UserAccount } from '../types';
import BrandLogo from './BrandLogo';

interface LayoutProps {
  children: React.ReactNode;
  activeView: 'dashboard' | 'tasks' | 'admin' | 'settings';
  currentUser: UserAccount | null;
  onSearch?: (query: string) => void;
  onAddNew?: () => void;
  overdueCount?: number;
  onToggleNotifications?: () => void;
  onNavigate?: (section: 'dashboard' | 'tasks' | 'admin' | 'settings') => void;
  onLoginClick?: () => void;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeView,
  currentUser,
  onSearch, 
  onAddNew, 
  overdueCount = 0, 
  onToggleNotifications, 
  onNavigate,
  onLoginClick,
  onLogout
}) => {
  const isAdmin = currentUser?.role === 'Admin';
  const isLoggedIn = !!currentUser;

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden text-slate-900">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-800 tracking-tight leading-none uppercase">Halal Track</h1>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">LPH UNISMA</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          <button 
            onClick={() => onNavigate?.('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeView === 'dashboard' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => onNavigate?.('tasks')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeView === 'tasks' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <ListTodo size={20} />
            <span>Semua Task</span>
          </button>
          
          <button 
            onClick={onToggleNotifications}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-bold transition-all relative"
          >
            <Bell size={20} />
            <span>Notifikasi</span>
            {overdueCount > 0 && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                {overdueCount}
              </span>
            )}
          </button>

          <div className="pt-4 pb-2 px-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Internal Tools</span>
          </div>

          {isAdmin && (
            <button 
              onClick={() => onNavigate?.('admin')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeView === 'admin' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <ShieldCheck size={20} />
              <span>Admin Panel</span>
            </button>
          )}
          
          <button 
            onClick={() => onNavigate?.('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeView === 'settings' ? 'text-slate-900 bg-slate-100' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200">
          {isLoggedIn ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold border border-emerald-200">
                  {currentUser.username[0].toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-black text-slate-800 truncate">{currentUser.username}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{currentUser.role}</p>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <LogOut size={14} />
                Keluar
              </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-100"
            >
              <LogIn size={18} />
              Login Akun
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main id="main-content" className="flex-1 flex flex-col min-h-screen overflow-auto relative scroll-smooth">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 md:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                <SearchIcon size={18} />
              </span>
              <input 
                type="text" 
                onChange={(e) => onSearch?.(e.target.value)}
                placeholder="Cari ID, Perusahaan, atau Produk..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onToggleNotifications}
              className="hidden sm:flex items-center gap-2 p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-all relative"
            >
              <Bell size={20} />
              {overdueCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">
                  {overdueCount}
                </span>
              )}
            </button>
            {isLoggedIn && (
              <button 
                onClick={onAddNew}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl text-sm font-black transition-all shadow-lg shadow-emerald-100 flex items-center gap-2 active:scale-95"
              >
                <Plus size={18} strokeWidth={3} />
                <span className="hidden sm:inline">Tambah Pengajuan</span>
              </button>
            )}
            {!isLoggedIn && (
              <button 
                onClick={onLoginClick}
                className="md:hidden bg-emerald-600 text-white p-3 rounded-2xl"
              >
                <LogIn size={20} />
              </button>
            )}
          </div>
        </header>

        <div className="p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
