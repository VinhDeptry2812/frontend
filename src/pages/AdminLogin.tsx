import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Loader2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import api from '../services/api';

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post('/admin/login', { email, password });

            if (response.data.success) {
                localStorage.setItem('admin_token', response.data.token);
                localStorage.setItem('admin_user', JSON.stringify(response.data.admin));
                // Thông báo thành công và chuyển hướng
                navigate('/admin/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Đăng nhập Admin thất bại. Vui lòng kiểm tra lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0a0a]">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

            <div className="max-w-md w-full space-y-8 bg-[#141414] p-10 rounded-2xl shadow-2xl border border-white/5 relative z-10 transition-all duration-500 hover:border-primary/30">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 border border-primary/20">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-display font-bold tracking-[0.2em] text-white uppercase">
                        Admin Access
                    </h2>
                    <p className="mt-4 text-xs font-sans tracking-widest text-slate-500 uppercase">
                        Luxe Interiors Management Portal
                    </p>
                </div>

                {error && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 animate-in fade-in zoom-in duration-300">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <p className="text-[10px] font-bold tracking-widest uppercase">{error}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-5">
                        <div className="relative">
                            <label className="block text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-2 ml-1">
                                System Identifier
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-primary transition-colors">
                                    <User className="h-4 w-4" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-4 bg-black/40 border border-white/5 rounded-xl text-white placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm font-sans"
                                    placeholder="ADMIN@LUXE.COM"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-2 ml-1">
                                Security Key
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-primary transition-colors">
                                    <Lock className="h-4 w-4" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-4 bg-black/40 border border-white/5 rounded-xl text-white placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm font-sans"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-[10px] font-bold tracking-[0.2em] uppercase rounded-xl text-espresso bg-primary hover:bg-white focus:outline-none transition-all duration-300 disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-primary/10"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Authorize Access
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-center pt-4">
                    <p className="text-[9px] tracking-widest text-slate-600 uppercase">
                        Authorized Personnel Only
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
