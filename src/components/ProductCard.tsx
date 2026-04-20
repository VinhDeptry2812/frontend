import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import { getProductById } from '../services/products';

interface ProductCardProps {
  product: Product;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlist();
  const { showNotification } = useNotification();
  const { user } = useAuth();
  const { openAuthModal } = useAuthModal();
  const inWishlist = isInWishlist(product.id);

  const hasDiscount = Boolean(product.sale_price && product.sale_price < product.base_price);
  const discountPercent = hasDiscount
    ? Math.round(((product.base_price - (product.sale_price || 0)) / product.base_price) * 100)
    : 0;
  const displayPrice = product.sale_price || product.base_price;

  const [isAdding, setIsAdding] = React.useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsAdding(true);
      // Fetch full product details to get variants since listing API doesn't include them
      const res = await getProductById(product.id);
      const fullProduct: Product = res.data?.data || res.data;
      
      // Use first available variant or first variant or no variant from the full product
      const variant = fullProduct.variants?.find(v => v.is_available) || (fullProduct.variants && fullProduct.variants.length > 0 ? fullProduct.variants[0] : null);
      
      await addItem(product.id, variant?.id ?? null, 1);
      showNotification(`Đã thêm "${product.name}" vào giỏ hàng`, 'success');
    } catch (err: any) {
      showNotification(err.message || 'Không thể thêm vào giỏ hàng', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      openAuthModal('Vui lòng đăng nhập để lưu sản phẩm vào danh sách yêu thích');
      return;
    }

    try {
      if (inWishlist) {
        await removeWishlist(product.id);
        showNotification('Đã xóa khỏi danh sách yêu thích', 'success');
      } else {
        await addWishlist(product.id);
        showNotification('Đã thêm vào danh sách yêu thích', 'success');
      }
    } catch (err: any) {
      showNotification(err.message || 'Đã có lỗi xảy ra', 'error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="product-card group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-[4/3]">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-bg-warm flex items-center justify-center">
            <ShoppingBag size={40} className="text-stone-300" />
          </div>
        )}

        {/* Overlay */}
        <div className="product-card-overlay absolute inset-0" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="badge-sale">-{discountPercent}%</span>
          )}
          {Boolean(product.is_featured) && !hasDiscount && (
            <span className="badge-new">Nổi bật</span>
          )}
        </div>

        {/* Hover Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-white text-text-dark text-sm font-semibold py-2.5 px-4 rounded-xl hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag size={15} />
            Thêm vào giỏ
          </button>
          <Link
            to={`/product/${product.id}`}
            className="bg-white/90 text-text-dark p-2.5 rounded-xl hover:bg-accent hover:text-white transition-colors flex items-center justify-center"
          >
            <Eye size={16} />
          </Link>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        {product.category?.name && (
          <p className="text-[11px] uppercase tracking-wider text-primary font-semibold mb-1">
            {product.category.name}
          </p>
        )}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-text-dark hover:text-primary transition-colors line-clamp-2 leading-snug mb-2 text-[15px]">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <span className="price-new">{formatPrice(displayPrice)}</span>
            {hasDiscount && (
              <span className="price-old ml-2">{formatPrice(product.base_price)}</span>
            )}
          </div>

          <button
            onClick={handleWishlist}
            className={`p-2 rounded-full transition-all duration-200 ${
              inWishlist
                ? 'text-red-500 bg-red-50 hover:bg-red-100'
                : 'text-stone-300 hover:text-red-400 hover:bg-red-50'
            }`}
          >
            <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>
        </div>

        {product.brand && (
          <p className="text-xs text-text-muted mt-1">{product.brand}</p>
        )}
      </div>
    </motion.div>
  );
};
