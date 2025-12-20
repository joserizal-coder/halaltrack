
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
    <div className="flex min-h-screen bg-[#f8fafc] overflow-hidden text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white/80 backdrop-blur-2xl border-r border-slate-200/60 shrink-0 z-50">
        <div className="p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 premium-gradient-green text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 transform hover:rotate-3 transition-transform">
              <ShieldCheck size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">HALAL<span className="text-emerald-600">TRACK</span></h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">LPH UNISMA PRO</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="pb-2 px-4">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Main Menu</span>
          </div>

          <button
            onClick={() => onNavigate?.('dashboard')}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold transition-all duration-300 group ${activeView === 'dashboard' ? 'nav-button-active' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <LayoutDashboard size={22} className={activeView === 'dashboard' ? '' : 'group-hover:scale-110 transition-transform'} />
            <span className="text-[15px]">Dashboard</span>
          </button>

          <button
            onClick={() => onNavigate?.('tasks')}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold transition-all duration-300 group ${activeView === 'tasks' ? 'nav-button-active' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <ListTodo size={22} className={activeView === 'tasks' ? '' : 'group-hover:scale-110 transition-transform'} />
            <span className="text-[15px]">Tugas Saya</span>
          </button>

          <button
            onClick={onToggleNotifications}
            className="w-full flex items-center gap-4 px-5 py-3.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-2xl font-bold transition-all relative group"
          >
            <Bell size={22} className="group-hover:animate-bounce-short" />
            <span className="text-[15px]">Notifikasi</span>
            {overdueCount > 0 && (
              <span className="absolute right-5 top-1/2 -translate-y-1/2 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full ring-4 ring-rose-500/20">
                {overdueCount}
              </span>
            )}
          </button>

          <div className="pt-6 pb-2 px-4">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Sistem</span>
          </div>

          {isAdmin && (
            <button
              onClick={() => onNavigate?.('admin')}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold transition-all duration-300 group ${activeView === 'admin' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <ShieldCheck size={22} className={activeView === 'admin' ? '' : 'group-hover:scale-110 transition-transform'} />
              <span className="text-[15px]">Admin Panel</span>
            </button>
          )}

          <button
            onClick={() => onNavigate?.('settings')}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold transition-all duration-300 group ${activeView === 'settings' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Settings size={22} />
            <span className="text-[15px]">Pengaturan</span>
          </button>
        </nav>

        <div className="p-6">
          {isLoggedIn ? (
            <div className="p-5 glass-card rounded-3xl border-slate-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl premium-gradient-green flex items-center justify-center text-white font-black text-lg shadow-lg shadow-emerald-100">
                  {currentUser.username[0].toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[15px] font-black text-slate-900 truncate">{currentUser.username}</p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">{currentUser.role}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
              >
                <LogOut size={16} />
                Keluar Aplikasi
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="w-full py-4 premium-gradient-green hover:brightness-110 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-200/50 group active:scale-[0.98]"
            >
              <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
              Masuk Akun
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main id="main-content" className="flex-1 flex flex-col min-h-screen overflow-auto relative scroll-smooth bg-slate-50/50">
        {/* Header */}
        <header className="h-24 glass-panel border-b-0 flex items-center justify-between px-8 md:px-12 sticky top-0 z-40 mx-4 mt-4 rounded-3xl shadow-sm">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative max-w-lg w-full group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                <SearchIcon size={20} />
              </span>
              <input
                type="text"
                onChange={(e) => onSearch?.(e.target.value)}
                placeholder="Cari ID, Perusahaan, atau Produk..."
                className="w-full pl-14 pr-6 py-4 bg-white/50 border border-slate-200/60 rounded-2xl text-[15px] font-semibold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 px-4">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Waktu Server</span>
              <span className="text-[15px] font-black text-slate-900">{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
            </div>

            <div className="h-10 w-[1px] bg-slate-200 mx-2 hidden lg:block"></div>

            <button
              onClick={onToggleNotifications}
              className="hidden sm:flex items-center gap-2 p-3.5 text-slate-400 hover:bg-white hover:text-emerald-600 rounded-2xl transition-all relative border border-transparent hover:border-slate-100 hover:shadow-sm"
            >
              <Bell size={24} />
              {overdueCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-5 h-5 bg-rose-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white">
                  {overdueCount}
                </span>
              )}
            </button>

            {isLoggedIn && (
              <button
                onClick={onAddNew}
                className="premium-gradient-green hover:brightness-110 text-white px-7 py-4 rounded-2xl text-sm font-black transition-all shadow-xl shadow-emerald-200/50 flex items-center gap-3 active:scale-95 transform"
              >
                <Plus size={20} strokeWidth={3} />
                <span className="hidden sm:inline">Pengajuan Baru</span>
              </button>
            )}
          </div>
        </header>

        <div className="p-8 md:p-12 animate-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
