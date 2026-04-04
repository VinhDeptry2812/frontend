import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, LayoutTemplate } from 'lucide-react';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const { t } = useLanguage();
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Khởi tạo: kiểm tra token và email đã lưu (Remember Me)
  // Khởi tạo: kiểm tra nếu đã đăng nhập thì vào thẳng dashboard
  useEffect(() => {
    // Nếu đã có thông tin user thì mới tự động chuyển hướng
    if (user && !authLoading) {
      navigate('/admin/dashboard', { replace: true });
      return;
    }

    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      showNotification(t('login_error_missing') || "Vui lòng nhập email và mật khẩu", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/admin/login", {
        email: email,
        password: password
      });

      showNotification(t('login_success') || "Truy cập trang quản trị thành công", "success");

      // Xử lý Remember Me: Lưu hoặc xóa email đã lưu
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      const rawData = response.data;
      const token = rawData?.token || 
                    rawData?.access_token || 
                    rawData?.data?.token || 
                    rawData?.data?.access_token ||
                    rawData?.user?.token;
                    
      if (token) {
        // Sử dụng hàm login từ Context để xác thực thông tin Admin trước khi chuyển hướng
        await login(token);
        navigate('/admin/dashboard', { replace: true });
      } else {
        // Nếu API không trả về token nhưng redirect vẫn xảy ra, ta xử lý lỗi
        showNotification("Lỗi nhận Token", "error");
      }
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error);
      if (error.response) {
        showNotification(error.response.data?.message || "Thông tin đăng nhập không chính xác", "error");
      } else {
        showNotification("Không thể kết nối đến máy chủ", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light p-4 relative overflow-hidden font-sans select-none">
      {/* Dynamic Art Background */}
      <div className="absolute top-1/4 -left-10 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-float-slow" />
      <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-accent-gold/15 rounded-full blur-[100px] animate-float-slower" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-200/20 rounded-full blur-[120px]" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full glass-card rounded-[2.5rem] p-10 relative z-10"
      >
        <motion.div variants={itemVariants} className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-6 ring-1 ring-primary/10 shadow-sm shadow-primary/5">
            <LayoutTemplate size={28} strokeWidth={1.5} />
          </div>
          <Link to="/" className="text-4xl font-serif font-bold tracking-tight text-slate-900 mb-2 text-center">Aurelius</Link>
          <div className="flex items-center gap-2">
            <div className="h-[1px] w-4 bg-slate-200" />
            <p className="text-slate-400 text-[10px] font-bold tracking-[0.3em] uppercase">Admin WellCome</p>
            <div className="h-[1px] w-4 bg-slate-200" />
          </div>
        </motion.div>

        <form className="space-y-5" onSubmit={handleLogin}>
          <motion.div variants={itemVariants}>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">{t('email_label')}</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-slate-800 shadow-sm"
              />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">{t('password_label')}</label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-14 outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-slate-800 shadow-sm"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </motion.div>

          {/* Remember account checkbox */}
          <motion.div variants={itemVariants} className="px-1 pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer group w-fit select-none">
              <div className={`w-5 h-5 rounded-md border border-slate-200 flex items-center justify-center transition-all ${rememberMe ? 'bg-primary border-primary shadow-sm shadow-primary/20' : 'bg-white/50 group-hover:border-primary/40'}`}>
                {rememberMe && <div className="w-2 h-2.5 border-r-2 border-b-2 border-white rotate-45 mb-0.5" />}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-700 transition-colors">{t('remember_me')}</span>
            </label>
          </motion.div>

          <motion.div variants={itemVariants}>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-primary/10 active:scale-[0.98] disabled:opacity-50 mt-6 overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              {loading ? (
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t('loading')}</span>
                </div>
              ) : (
                <>
                  <span className="tracking-wide">{t('login')}</span>
                  <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};


