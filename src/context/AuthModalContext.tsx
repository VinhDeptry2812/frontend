import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LogIn, Heart, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthModalContextType {
  openAuthModal: (message?: string) => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('Vui lòng đăng nhập để sử dụng tính năng này');
  const navigate = useNavigate();

  const openAuthModal = (msg?: string) => {
    if (msg) setMessage(msg);
    setIsOpen(true);
  };

  const closeAuthModal = () => setIsOpen(false);

  return (
    <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAuthModal}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden p-8"
            >
              <button 
                onClick={closeAuthModal}
                className="absolute top-5 right-5 text-stone-400 hover:text-text-dark transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-bg-blue-light rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart size={28} className="text-primary fill-primary/20" />
                </div>
                
                <h3 className="font-serif text-2xl font-bold text-text-dark mb-3">Tham gia cùng chúng tôi</h3>
                <p className="text-text-muted text-sm leading-relaxed mb-8">
                  {message} để lưu những món đồ nội thất yêu thích và nhận thông báo khuyến mãi hấp dẫn.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      closeAuthModal();
                      navigate('/auth');
                    }}
                    className="w-full bg-primary text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                  >
                    <LogIn size={18} />
                    Đăng nhập ngay
                  </button>
                  <button
                    onClick={() => {
                      closeAuthModal();
                      navigate('/auth?mode=register');
                    }}
                    className="w-full bg-stone-50 text-text-dark font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-stone-100 transition-all"
                  >
                    <UserPlus size={18} />
                    Tạo tài khoản mới
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) throw new Error('useAuthModal must be used within an AuthModalProvider');
  return context;
};
