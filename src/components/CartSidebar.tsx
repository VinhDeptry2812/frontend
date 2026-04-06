import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemove 
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.10; // 10% VAT
  const total = subtotal + tax;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-background-dark z-[110] flex flex-col shadow-2xl"
          >
            <div className="p-6 border-bottom border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold">Giỏ hàng của bạn</h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6">
                    <X size={32} className="text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-medium">Giỏ hàng của bạn đang trống.</p>
                  <button 
                    onClick={onClose}
                    className="mt-6 text-primary font-bold hover:underline"
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-medium text-sm">{item.name}</h3>
                          <button 
                            onClick={() => onRemove(item.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 mb-3">{item.selectedFinish || 'Default Finish'}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3 border border-slate-100 dark:border-slate-800 rounded-full px-2 py-1">
                            <button 
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="p-1 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-full"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="p-1 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-full"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <p className="font-serif font-bold text-sm">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Tạm tính</span>
                    <span>{subtotal.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Thuế (10%)</span>
                    <span>{tax.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between text-lg font-serif font-bold pt-3 border-t border-slate-200 dark:border-slate-800">
                    <span>Tổng cộng</span>
                    <span className="text-[#d94f3d]">{total.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
                <Link 
                  to="/checkout" 
                  onClick={onClose}
                  className="w-full bg-[#1a6b4a] text-white py-4 rounded-sm font-bold flex items-center justify-center gap-2 hover:bg-[#0f4530] text-sm uppercase tracking-widest transition-all"
                >
                  Tiến Hành Thanh Toán
                  <ArrowRight size={18} />
                </Link>
                <p className="text-[10px] text-center text-slate-400 mt-4 uppercase tracking-widest">
                  Miễn phí vận chuyển cho đơn hàng trên 5.000.000đ
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
