import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, ArrowRight } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';

const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const emailFromUrl = searchParams.get('email');
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !emailFromUrl) {
            showNotification("Đường dẫn khôi phục không hợp lệ.", "error");
            return;
        }
        if (password !== confirmPassword) {
            showNotification("Mật khẩu xác nhận không khớp", "error");
            return;
        }
        setLoading(true);
        try {
            await api.post("/reset-password", {
                email: emailFromUrl,
                token: token,
                password: password,
                password_confirmation: confirmPassword
            });
            showNotification("Đặt lại mật khẩu thành công!", "success");
            navigate('/auth');
        } catch (error: any) {
            showNotification("Đặt lại mật khẩu thất bại", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-background-dark text-white">
            <div className="w-full max-w-md mx-auto flex flex-col justify-center px-6">
                <Link to="/" className="text-3xl font-serif font-bold mb-12 block tracking-tighter">AURELIUS</Link>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
                    <p className="text-slate-400 mb-8">Please enter your new password below.</p>
                    <form className="space-y-6" onSubmit={handleResetPassword}>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">New Password</label>
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
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Confirm New Password</label>
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
                        <button type="submit" disabled={loading} className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50">
                            {loading ? "Đang xử lý..." : "Reset Password"}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ResetPassword;
