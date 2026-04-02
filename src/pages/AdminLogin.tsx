import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Link, useNavigate } from 'react-router-dom';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('user@gmail.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      showNotification("Vui lòng nhập email và mật khẩu", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/admin/login", {
        email: email,
        password: password
      });

      showNotification("Đăng nhập Admin thành công", "success");

      // Tìm token trong các response thường gặp của Laravel/NodeJS
      const rawData = response.data;
      const token = rawData?.token || 
                    rawData?.access_token || 
                    rawData?.data?.token || 
                    rawData?.data?.access_token ||
                    rawData?.user?.token;
                    
      if (token) {
        localStorage.setItem("token", token);
      } else {
        console.warn("Không tìm thấy token trong response đăng nhập!", rawData);
      }

      // Điều hướng tới trang dashboard admin v.v, đổi thay vì trang chủ
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error);
      if (error.response) {
        showNotification(error.response.data?.message || "Sai thông tin đăng nhập", "error");
      } else {
        showNotification("Không kết nối được server", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-dark text-white p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-surface-dark border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-4">
            <ShieldCheck size={32} />
          </div>
          <Link to="/" className="text-3xl font-serif font-bold tracking-tighter mb-2">AURELIUS</Link>
          <p className="text-slate-400 text-sm font-medium tracking-widest uppercase">Admin Portal</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email"
                placeholder="admin@aurelius.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background-dark border border-slate-800 rounded-xl py-4 pl-12 pr-6 outline-none focus:ring-1 focus:ring-primary transition-all text-white placeholder:text-slate-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background-dark border border-slate-800 rounded-xl py-4 pl-12 pr-6 outline-none focus:ring-1 focus:ring-primary transition-all text-white placeholder:text-slate-600"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 mt-8"
          >
            {loading ? "Đang xác thực..." : "Access Portal"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
