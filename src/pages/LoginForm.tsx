import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Facebook, Chrome } from 'lucide-react';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';

interface LoginFormProps {
    setMode: (mode: 'login' | 'register' | 'recover') => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ setMode }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotification();

    const handleGoogleLogin = () => {
        window.location.href = `${api.defaults.baseURL}/auth/google`;
    };

    const handleFacebookLogin = () => {
        window.location.href = `${api.defaults.baseURL}/auth/facebook`;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            showNotification("Vui lòng nhập email và mật khẩu", "error");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post("/login", {
                email: email,
                password: password
            });

            showNotification("Đăng nhập thành công", "success");

            const token = response.data?.token || response.data?.access_token;
            if (token) {
                localStorage.setItem("token", token);
            }

            window.location.href = "/";
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
        <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <h1 className="text-3xl font-bold mb-2">Chào Mừng Trở Lại</h1>
            <p className="text-slate-400 mb-8">Nhập thông tin đăng nhập để truy cập tài khoản của bạn.</p>

            <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Địa Chỉ Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-surface-dark border border-slate-800 rounded-xl py-4 pl-12 pr-6 outline-none focus:ring-1 focus:ring-primary transition-all"
                        />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Mật Khẩu</label>
                        <button
                            type="button"
                            onClick={() => setMode('recover')}
                            className="text-xs font-bold text-primary hover:underline"
                        >
                            Quên mật khẩu?
                        </button>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-surface-dark border border-slate-800 rounded-xl py-4 pl-12 pr-6 outline-none focus:ring-1 focus:ring-primary transition-all"
                        />
                    </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
                    {loading ? "Đang xử lý..." : "Đăng Nhập"}
                    {!loading && <ArrowRight size={18} />}
                </button>
            </form>

            <div className="mt-10">
                <div className="relative flex items-center justify-center mb-8">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                    <span className="relative px-4 bg-background-dark text-xs font-bold text-slate-500 uppercase tracking-widest">Hoặc tiếp tục với</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={handleGoogleLogin} className="flex items-center justify-center gap-3 bg-surface-dark border border-slate-800 py-3 rounded-xl hover:bg-slate-800 transition-colors">
                        <Chrome size={18} />
                        <span className="text-sm font-bold">Google</span>
                    </button>
                    <button 
                        type="button" 
                        onClick={handleFacebookLogin} 
                        className="flex items-center justify-center gap-3 bg-surface-dark border border-slate-800 py-3 rounded-xl hover:bg-slate-800 transition-colors"
                    >
                        <Facebook size={18} />
                        <span className="text-sm font-bold">Facebook</span>
                    </button>
                </div>
            </div>

            <p className="mt-10 text-center text-slate-400 text-sm">
                Chưa có tài khoản?{' '}
                <button onClick={() => setMode('register')} className="text-primary font-bold hover:underline">Tạo Tài Khoản</button>
            </p>
        </motion.div>
    );
};
