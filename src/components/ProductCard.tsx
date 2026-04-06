import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, Eye, Heart, Loader2 } from 'lucide-react';
import { ApiProduct } from '../types';
import { addToWishlistApi, removeFromWishlistApi } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: ApiProduct;
  onAddToCart: (product: ApiProduct) => void;
  showBadge?: 'sale' | 'new' | null;
  salePercent?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, showBadge, salePercent }) => {
  const { isInWishlist, toggleWishlist: toggleWishlistId } = useWishlist();
  const wished = isInWishlist(product.id);
  const [loadingWish, setLoadingWish] = useState(false);

  const { showNotification } = useNotification();

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!localStorage.getItem('token')) {
      showNotification('Vui lòng đăng nhập để thêm vào danh sách yêu thích.', 'error');
      return;
    }
    setLoadingWish(true);
    try {
      await toggleWishlistId(product.id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingWish(false);
    }
  };

  const basePrice = Number(product.base_price) || 0;
  const salePrice = Number(product.sale_price) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="product-card"
      style={{ position: 'relative', background: 'white', border: '1px solid #efefed', borderRadius: 4, overflow: 'hidden', transition: 'box-shadow 0.25s ease' }}
    >
      {/* Image */}
      <div className="product-card-img" style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/5', background: '#f7f7f5' }}>
        <Link to={`/product/${product.id}`} style={{ display: 'block', height: '100%' }}>
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400'} // fallback image
            alt={product.name}
            referrerPolicy="no-referrer"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)' }}
          />
        </Link>

        {/* Badges */}
        {showBadge === 'sale' && salePercent && (
          <span style={{ position: 'absolute', top: 10, left: 10, background: '#d94f3d', color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 2, zIndex: 2, letterSpacing: '0.05em' }}>
            -{salePercent}%
          </span>
        )}
        {showBadge === 'new' && (
          <span style={{ position: 'absolute', top: 10, left: 10, background: '#1a6b4a', color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 2, zIndex: 2, letterSpacing: '0.05em' }}>
            MỚI
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={handleToggleWishlist}
          disabled={loadingWish}
          style={{
            position: 'absolute', top: 10, right: 10,
            background: 'white', border: 'none', borderRadius: '50%',
            width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: loadingWish ? 'wait' : 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            color: wished ? '#d94f3d' : '#aaa',
            transition: 'all 0.2s', zIndex: 2
          }}
          title="Yêu thích"
        >
          {loadingWish ? <Loader2 size={14} className="animate-spin" /> : <Heart size={16} fill={wished ? '#d94f3d' : 'none'} />}
        </button>

        {/* Add to cart overlay */}
        <button
          onClick={(e) => { e.preventDefault(); onAddToCart(product); }}
          className="product-card-actions"
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'rgba(26,107,74,0.93)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '13px', fontSize: 12, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            transform: 'translateY(100%)',
            transition: 'transform 0.25s ease',
            cursor: 'pointer', border: 'none', width: '100%',
          }}
        >
          <ShoppingBag size={16} />
          Thêm vào giỏ
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: '14px 14px 16px' }}>
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#999', marginBottom: 5 }}>
          {product.category?.name || product.brand || 'Nội thất'}
        </p>
        <Link
          to={`/product/${product.id}`}
          style={{ fontSize: 15, fontWeight: 600, color: '#222', marginBottom: 10, textDecoration: 'none', display: 'block', lineHeight: 1.3, transition: 'color 0.15s' }}
        >
          {product.name}
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#d94f3d' }}>
            {(salePrice > 0 ? salePrice : basePrice).toLocaleString('vi-VN')}đ
          </span>
          {salePrice > 0 && basePrice > salePrice && (
            <span style={{ fontSize: 13, color: '#bbb', textDecoration: 'line-through' }}>
              {basePrice.toLocaleString('vi-VN')}đ
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
