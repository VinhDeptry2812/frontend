import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Trash2, ShoppingBag, ArrowRight, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchWishlist, removeFromWishlistApi, clearWishlistApi } from '../services/api';
import { ApiProduct } from '../types';
import { useNotification } from '../context/NotificationContext';
import { useWishlist } from '../context/WishlistContext';

interface WishlistProps {
  onAddToCart: (product: ApiProduct) => void;
}

export const Wishlist: React.FC<WishlistProps> = ({ onAddToCart }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const { refreshWishlist, toggleWishlist } = useWishlist();

  const loadWishlist = async () => {
    try {
      setLoading(true);
      if (localStorage.getItem('token')) {
        const data = await fetchWishlist();
        setItems(Array.isArray(data) ? data : []);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error("Lỗi Wishlist:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (productId: number) => {
    try {
      await toggleWishlist(productId);
      setItems(prev => prev.filter(item => {
        const p = item.product || item;
        return p.id !== productId;
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm yêu thích?')) return;
    try {
      await clearWishlistApi();
      setItems([]);
      await refreshWishlist();
      showNotification('Đã làm trống danh sách yêu thích', 'success');
    } catch (err) {
      showNotification('Lỗi khi làm trống danh sách', 'error');
    }
  };

  if (loading) {
    return (
      <div className="pt-40 pb-24 px-6 text-center text-[#1a6b4a]">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
          className="inline-block mb-4"
        >
          <Heart size={32} />
        </motion.div>
        <p className="font-medium text-slate-500">Đang tải danh sách yêu thích...</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 bg-[#fafaf9] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[#1a1a1a] mb-2">Sản phẩm yêu thích</h1>
            <p className="text-slate-400 text-sm">Lưu giữ những món đồ bạn yêu thích để dễ dàng mua sắm sau này.</p>
          </div>
          
          {items.length > 0 && (
            <button 
              onClick={handleClear}
              className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors text-xs font-bold uppercase tracking-widest pb-1 border-b border-transparent hover:border-red-500"
            >
              <Trash size={14} /> Xóa tất cả
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white p-16 rounded-sm border border-[#efefed] text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={32} className="text-slate-200" />
            </div>
            <p className="text-slate-500 mb-8">Bạn chưa có sản phẩm nào trong danh sách yêu thích.</p>
            <Link to="/catalog" className="inline-flex items-center gap-2 bg-[#1a6b4a] text-white px-8 py-4 rounded-sm font-bold text-sm uppercase tracking-widest hover:bg-[#0f4530] transition-colors shadow-lg">
              Khám phá sản phẩm <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item, idx) => {
              // Try multiple ways to find the product object
              const product = item.product || (item.name ? item : null);
              
              if (!product || (!product.id && !product.sku && !product.name)) {
                console.warn("Invalid wishlist item detected:", item);
                return null;
              }

              // Normalizing ID for actions
              const productId = product.id || item.product_id || item.id;

              return (
                <motion.div
                  key={product.id || product.sku || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-[#efefed] rounded-sm overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="aspect-[4/5] relative overflow-hidden bg-slate-100">
                    <img 
                      src={product.image_url || 'https://via.placeholder.com/400x500?text=No+Image'} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <button
                      onClick={() => handleRemove(productId)}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-all shadow-sm hover:scale-110 z-10"
                      title="Xóa khỏi yêu thích"
                    >
                      <Trash2 size={18} />
                    </button>
                    {product.sale_price < product.base_price && (
                      <div className="absolute top-4 left-4 bg-[#d94f3d] text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider z-10">
                        Giảm giá
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-2">
                       <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{product.sku || 'NHA XINH'}</span>
                       <h3 className="text-lg font-bold text-[#1a1a1a] line-clamp-2 leading-snug group-hover:text-[#1a6b4a] transition-colors">{product.name || 'Sản phẩm không tên'}</h3>
                    </div>
                    <div className="mb-6">
                      <p className="text-[#d94f3d] font-bold text-lg">
                        {Number(product.sale_price || product.base_price || 0).toLocaleString('vi-VN')} VND
                      </p>
                      {product.sale_price < product.base_price && (
                        <span className="text-slate-400 text-sm line-through decoration-slate-300">
                           {Number(product.base_price).toLocaleString('vi-VN')} VND
                        </span>
                      )}
                    </div>
                    <div className="mt-auto space-y-3">
                      <button
                        onClick={() => onAddToCart(product)}
                        className="w-full bg-[#1a6b4a] text-white py-4 rounded-sm font-bold text-[11px] uppercase tracking-widest hover:bg-[#0f4530] transition-all flex items-center justify-center gap-2 transform active:scale-95 shadow-md"
                      >
                        <ShoppingBag size={14} /> Thêm vào giỏ
                      </button>
                      <Link
                        to={`/product/${product.id || product.slug}`}
                        className="w-full border border-[#1a6b4a] text-[#1a6b4a] py-4 rounded-sm font-bold text-[11px] uppercase tracking-widest hover:bg-[#1a6b4a] hover:text-white transition-all block text-center"
                      >
                        Chi tiết mẫu mã
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
