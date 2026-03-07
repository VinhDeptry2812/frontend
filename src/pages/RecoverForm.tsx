import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowRight } from 'lucide-react';
import api from '../services/api';

interface RecoverFormProps {
    setMode: (mode: 'login' | 'register' | 'recover') => void;
}

export const RecoverForm: React.FC<RecoverFormProps> = ({ setMode }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRecover = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            alert("Vui lòng nhập email của bạn");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post("/forgot-password", { email });
            alert(response.data?.message || "Đã gửi hướng dẫn khôi phục mật khẩu. Vui lòng kiểm tra email.");
            setMode("login");
            setEmail("");
        } catch (error: any) {
            console.error("Lỗi gửi yêu cầu khôi phục:", error);
            if (error.response) {
                alert(error.response.data?.message || "Gửi yêu cầu thất bại");
            } else {
                alert("Không kết nối được server");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            key="recover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <h1 className="text-3xl font-bold mb-2">Recover Access</h1>
            <p className="text-slate-400 mb-8">Enter your email to receive recovery instructions.</p>

            <form className="space-y-6" onSubmit={handleRecover}>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-surface-dark border border-slate-800 rounded-xl py-4 pl-12 pr-6 outline-none focus:ring-1 focus:ring-primary transition-all"
                        />
                    </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
                    {loading ? "Đang xử lý..." : "Send Instructions"}
                    {!loading && <ArrowRight size={18} />}
                </button>
            </form>

            <p className="mt-10 text-center text-slate-400 text-sm">
                Remember your password?{' '}
                <button onClick={() => setMode('login')} className="text-primary font-bold hover:underline">Back to Sign In</button>
            </p>
        </motion.div>
    );
};
