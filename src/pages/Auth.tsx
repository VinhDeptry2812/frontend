import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { RecoverForm } from './RecoverForm';

const Auth: React.FC = () => {
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
            {mode === 'login' && <LoginForm setMode={setMode} />}
            {mode === 'register' && <RegisterForm setMode={setMode} />}
            {mode === 'recover' && <RecoverForm setMode={setMode} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Auth;
