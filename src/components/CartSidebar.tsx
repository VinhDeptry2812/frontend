import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, X, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export const CartSidebar: React.FC = () => {
  const { cart, loading, isOpen, closeCart, updateItem, removeItem } = useCart();

  const items = cart?.items || [];
  const total = cart?.total_price || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md z-[110] flex flex-col shadow-2xl bg-bg-ivory"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <ShoppingBag size={22} className="text-primary" />
                <div>
                  <h2 className="font-serif font-bold text-xl text-text-dark">Giỏ Hàng</h2>
                  {items.length > 0 && (
                    <p className="text-xs text-text-muted">{items.length} sản phẩm</p>
                  )}
                </div>
              </div>
              <button onClick={closeCart} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-text-muted hover:text-text-dark">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="p-6 space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="flex gap-4">
                      <div className="skeleton w-20 h-20 rounded-xl flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="skeleton h-4 w-3/4" />
                        <div className="skeleton h-3 w-1/2" />
                        <div className="skeleton h-4 w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-24 h-24 bg-bg-warm rounded-full flex items-center justify-center mb-6">
                    <ShoppingCart size={36} className="text-text-muted" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-text-dark mb-2">Giỏ hàng trống</h3>
                  <p className="text-text-muted text-sm mb-6">Hãy thêm sản phẩm yêu thích của bạn vào giỏ hàng</p>
                  <button
                    onClick={closeCart}
                    className="btn-primary text-sm"
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              ) : (
                <div className="p-6 space-y-5">
                  {items.map((item) => {
                    const product = item.product;
                    const variant = item.variant;
                    const price = variant?.price ?? product?.base_price ?? 0;
                    const image = variant?.image_url || product?.image_url || '';
                    const name = product?.name || 'Sản phẩm';

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm"
                      >
                        <Link to={`/product/${item.product_id}`} onClick={closeCart} className="flex-shrink-0">
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100">
                            {image ? (
                              <img src={image} alt={name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-bg-warm flex items-center justify-center">
                                <ShoppingBag size={24} className="text-text-muted" />
                              </div>
                            )}
                          </div>
                        </Link>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <Link to={`/product/${item.product_id}`} onClick={closeCart}
                              className="font-medium text-sm text-text-dark hover:text-primary transition-colors line-clamp-2 pr-2">
                              {name}
                            </Link>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-stone-300 hover:text-red-500 transition-colors flex-shrink-0"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {variant && (
                            <p className="text-xs text-text-muted mb-2">
                              {[variant.color, variant.size].filter(Boolean).join(' · ')}
                            </p>
                          )}

                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 border border-stone-200 rounded-full px-2 py-1">
                              <button
                                onClick={() => item.quantity > 1 ? updateItem(item.id, item.quantity - 1) : removeItem(item.id)}
                                className="p-1 hover:bg-stone-50 rounded-full transition-colors text-text-dark"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateItem(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-stone-50 rounded-full transition-colors text-text-dark"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <p className="font-bold text-sm text-primary font-serif">
                              {formatPrice(price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-stone-200 bg-white p-6">
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between text-sm text-text-muted">
                    <span>Tạm tính ({items.length} sản phẩm)</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-text-muted">
                    <span>Phí vận chuyển</span>
                    <span className="text-primary font-medium">Miễn phí</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-stone-100 text-text-dark">
                    <span className="font-serif">Tổng cộng</span>
                    <span className="text-primary font-serif">{formatPrice(total)}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="w-full btn-primary flex items-center justify-center gap-2 text-base py-4 rounded-xl"
                >
                  Tiến hành đặt hàng
                  <ArrowRight size={18} />
                </Link>
                <p className="text-xs text-center text-text-muted mt-3">
                  🔒 Thanh toán an toàn & bảo mật
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
