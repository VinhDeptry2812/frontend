import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('user@gmail.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const { fetchUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/admin/login", { email, password });
      
      const token = response.data?.token || response.data?.access_token || response.data?.data?.token;
      
      if (token) {
        localStorage.setItem("token", token);
        showNotification("Đăng nhập Admin thành công", "success");
        
        // Cập nhật thông tin User trên toàn hệ thống
        try {
          await fetchUser();
        } catch (authError) {
          console.warn("Không thể fetch thông tin User ngay lập tức.");
        }
        
        navigate('/admin/dashboard');
      } else {
        showNotification("Lỗi: Không nhận được token từ server", "error");
      }
    } catch (error: any) {
      console.error("Lỗi đăng nhập Admin:", error);
      showNotification(error.response?.data?.message || "Sai thông tin đăng nhập Admin", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-600/20">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-serif font-bold tracking-tight mb-2">AURELIUS</h1>
          <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Admin Control Center</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                placeholder="admin@aurelius.com" className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 pl-12 pr-6 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 pl-12 pr-6 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all" 
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 transition-all">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><ArrowRight size={18} /> Đăng nhập quản trị</>}
          </button>
        </form>
        
        <div className="mt-8 text-center pt-6 border-t border-slate-700">
           <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors">Quay lại trang chủ</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
