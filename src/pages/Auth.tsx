import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Facebook, Chrome } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Auth: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register' | 'recover'>('login');

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
          <h2 className="text-5xl font-serif font-bold mb-6 leading-tight">Join the Circle of Excellence.</h2>
          <p className="text-slate-300 text-lg">
            Create an account to save your favorite pieces, track orders, and receive
            exclusive design consultations.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 bg-background-dark flex flex-col justify-center px-8 md:px-20 py-12 text-white">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="text-3xl font-serif font-bold mb-12 block tracking-tighter">AURELIUS</Link>

          <AnimatePresence mode="wait">
            {mode === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                <p className="text-slate-400 mb-8">Enter your credentials to access your account.</p>

                <form className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input
                        type="email"
                        placeholder="name@example.com"
                        className="w-full bg-surface-dark border border-slate-800 rounded-xl py-4 pl-12 pr-6 outline-none focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Password</label>
                      <button
                        type="button"
                        onClick={() => setMode('recover')}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-surface-dark border border-slate-800 rounded-xl py-4 pl-12 pr-6 outline-none focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>
                  <button className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-primary/20">
                    Sign In
                    <ArrowRight size={18} />
                  </button>
                </form>

                <div className="mt-10">
                  <div className="relative flex items-center justify-center mb-8">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                    <span className="relative px-4 bg-background-dark text-xs font-bold text-slate-500 uppercase tracking-widest">Or continue with</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-3 bg-surface-dark border border-slate-800 py-3 rounded-xl hover:bg-slate-800 transition-colors">
                      <Chrome size={18} />
                      <span className="text-sm font-bold">Google</span>
                    </button>
                    <button className="flex items-center justify-center gap-3 bg-surface-dark border border-slate-800 py-3 rounded-xl hover:bg-slate-800 transition-colors">
                      <Facebook size={18} />
                      <span className="text-sm font-bold">Facebook</span>
                    </button>
                  </div>
                </div>

                <p className="mt-10 text-center text-slate-400 text-sm">
                  Don't have an account?{' '}
                  <button onClick={() => setMode('register')} className="text-primary font-bold hover:underline">Create Account</button>
                </p>
              </motion.div>
            )}

            {mode === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                <p className="text-slate-400 mb-8">Join our community of design enthusiasts.</p>

                <form className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full bg-surface-dark border border-slate-800 rounded-xl py-4 pl-12 pr-6 outline-none focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input
                        type="email"
                        placeholder="name@example.com"
                        className="w-full bg-surface-dark border border-slate-800 rounded-xl py-4 pl-12 pr-6 outline-none focus:ring-1 focus:ring-primary transition-all"
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
                        className="w-full bg-surface-dark border border-slate-800 rounded-xl py-4 pl-12 pr-6 outline-none focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>
                  <button className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-primary/20">
                    Create Account
                    <ArrowRight size={18} />
                  </button>
                </form>

                <p className="mt-10 text-center text-slate-400 text-sm">
                  Already have an account?{' '}
                  <button onClick={() => setMode('login')} className="text-primary font-bold hover:underline">Sign In</button>
                </p>
              </motion.div>
            )}

            {mode === 'recover' && (
              <motion.div
                key="recover"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h1 className="text-3xl font-bold mb-2">Recover Access</h1>
                <p className="text-slate-400 mb-8">Enter your email to receive recovery instructions.</p>

                <form className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input
                        type="email"
                        placeholder="name@example.com"
                        className="w-full bg-surface-dark border border-slate-800 rounded-xl py-4 pl-12 pr-6 outline-none focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>
                  <button className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-primary/20">
                    Send Instructions
                    <ArrowRight size={18} />
                  </button>
                </form>

                <p className="mt-10 text-center text-slate-400 text-sm">
                  Remember your password?{' '}
                  <button onClick={() => setMode('login')} className="text-primary font-bold hover:underline">Back to Sign In</button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
