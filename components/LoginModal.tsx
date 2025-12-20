
import React, { useState } from 'react';
import { X, Lock, User, LogIn, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
  // Change return type to Promise<boolean> to match async handleLogin in App.tsx
  onLogin: (username: string, password: string) => Promise<boolean>;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fix: Handle async onLogin call with proper loading state and await to match required type
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await onLogin(username, password);
      if (!success) {
        setError('Username atau password salah.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mencoba masuk.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 md:p-12 relative">
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors hover:bg-slate-50"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
              <ShieldCheck size={40} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Halal Track Pro</h2>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">LPH UNISMA Management</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase mb-2 block tracking-widest">Username</label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                  placeholder="Username Anda"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase mb-2 block tracking-widest">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 animate-in shake duration-300">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-black rounded-[1.25rem] shadow-xl shadow-emerald-100 transition-all flex items-center justify-center gap-2 mt-4 active:scale-95 text-lg"
            >
              {loading ? <Loader2 size={22} className="animate-spin" /> : <LogIn size={22} />}
              {loading ? 'Memproses...' : 'Masuk Sekarang'}
            </button>
          </form>

          <div className="mt-12 text-center">
             <div className="h-px w-12 bg-slate-100 mx-auto mb-6"></div>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              Internal System<br/>
              Universitas Islam Malang
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
