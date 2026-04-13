import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';

interface RegisterFormProps {
    setMode: (mode: 'login' | 'register' | 'recover') => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ setMode }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotification();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !password || !confirmPassword) {
            showNotification("Vui lòng nhập đầy đủ thông tin", "error");
            return;
        }

        if (password !== confirmPassword) {
            showNotification("Mật khẩu xác nhận không khớp", "error");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post("/register", {
                name,
                email,
                password,
                password_confirmation: confirmPassword
            });

            showNotification("Đăng ký thành công! Vui lòng đăng nhập.", "success");
            setMode("login");
            // Optional: clear fields
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            console.error("Lỗi đăng ký:", error);
            if (error.response) {
                showNotification(error.response.data?.message || "Đăng ký thất bại", "error");
            } else {
                showNotification("Không kết nối được server", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            key="register"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <h1 className="text-3xl font-bold mb-2">Tạo Tài Khoản</h1>
            <p className="text-slate-400 mb-8">Tham gia cộng đồng những người yêu thiết kế của chúng tôi.</p>

            <form className="space-y-6" onSubmit={handleRegister}>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Họ và Tên</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Nguyễn Văn A"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full bg-surface-dark border border-slate-800 rounded-xl py-4 pl-12 pr-6 outline-none focus:ring-1 focus:ring-primary transition-all"
                        />
                    </div>
                </div>
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
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Mật Khẩu</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-surface-dark border border-slate-800 rounded-xl py-4 pl-12 pr-6 outline-none focus:ring-1 focus:ring-primary transition-all"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Xác Nhận Mật Khẩu</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full bg-surface-dark border border-slate-800 rounded-xl py-4 pl-12 pr-6 outline-none focus:ring-1 focus:ring-primary transition-all"
                        />
                    </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
                    {loading ? "Đang xử lý..." : "Tạo Tài Khoản"}
                    {!loading && <ArrowRight size={18} />}
                </button>
            </form>

            <p className="mt-10 text-center text-slate-400 text-sm">
                Đã có tài khoản?{' '}
                <button onClick={() => setMode('login')} className="text-primary font-bold hover:underline">Đăng Nhập</button>
            </p>
        </motion.div>
    );
};
