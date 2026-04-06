import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';

export const ResetPassword: React.FC = () => {
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
            showNotification("Đường dẫn khôi phục không hợp lệ hoặc thiếu thông tin email.", "error");
            return;
        }

        if (!password || !confirmPassword) {
            showNotification("Vui lòng nhập đầy đủ thông tin", "error");
            return;
        }

        if (password !== confirmPassword) {
            showNotification("Mật khẩu xác nhận không khớp", "error");
            return;
        }

        setLoading(true);
        try {
            // Updated body parameters: email, token, password, password_confirmation
            const response = await api.post("/reset-password", {
                email: emailFromUrl,
                token: token,
                password: password,
                password_confirmation: confirmPassword
            });

            showNotification(response.data?.message || "Đặt lại mật khẩu thành công!", "success");
            // Redirect to login page
            navigate('/auth');
        } catch (error: any) {
            console.error("Lỗi đặt lại mật khẩu:", error);
            if (error.response) {
                showNotification(error.response.data?.message || "Đặt lại mật khẩu thất bại", "error");
            } else {
                showNotification("Không kết nối được server", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image */}
            <div className="hidden lg:block w-1/2 relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=1000"
                    alt="Luxury Interior"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent" />

                <div className="absolute bottom-20 left-20 max-w-md text-white">
                    <h2 className="text-5xl font-serif font-bold mb-6 leading-tight">Welcome Back.</h2>
                    <p className="text-slate-300 text-lg">
                        Secure your account and continue exploring our exclusive collections.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 bg-background-dark flex flex-col justify-center px-8 md:px-20 py-12 text-white">
                <div className="max-w-md w-full mx-auto">
                    <Link to="/" className="text-3xl font-serif font-bold mb-12 block tracking-tighter">AURELIUS</Link>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key="reset"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
                            <p className="text-slate-400 mb-8">Please enter your new password below.</p>

                            {!token || !emailFromUrl ? (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm mb-6">
                                    Đường dẫn không hợp lệ. Vui lòng kiểm tra lại email của bạn.
                                </div>
                            ) : null}

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
                                <button type="submit" disabled={loading || !token || !emailFromUrl} className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
                                    {loading ? "Đang xử lý..." : "Reset Password"}
                                    {!loading && <ArrowRight size={18} />}
                                </button>
                            </form>

                            <p className="mt-10 text-center text-slate-400 text-sm">
                                Changed your mind?{' '}
                                <Link to="/auth" className="text-primary font-bold hover:underline">Back to Sign In</Link>
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
