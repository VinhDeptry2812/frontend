import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  // Fallback rating if not provided
  const displayRating = product.rating || 4.5;
  
  return (
    <div className="group relative bg-white dark:bg-surface-dark rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800">
      {/* Wishlist Button */}
      <button 
        className="absolute top-3 right-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100 z-10 translate-y-2 group-hover:translate-y-0 shadow-sm"
        title="Thêm vào yêu thích"
      >
        <Heart className="w-4 h-4" />
      </button>

      {/* Image Area */}
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Content Area */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-gray-500 font-medium">{displayRating}</span>
        </div>

        {/* Title */}
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1 truncate hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        {/* Price & Action */}
        <div className="flex items-end justify-between mt-3">
          <div>
            <div className="text-primary font-bold text-lg">
              {product.price.toLocaleString('vi-VN')} ₫
            </div>
            {/* Some mock original price logic for UI */}
            {product.price > 10000000 && (
              <div className="text-xs text-gray-400 line-through">
                {(product.price * 1.1).toLocaleString('vi-VN')} ₫
              </div>
            )}
          </div>
          <button 
            onClick={() => onAddToCart && onAddToCart(product)}
            className="bg-gray-100 hover:bg-primary hover:text-white dark:bg-gray-800 dark:hover:bg-primary text-gray-800 dark:text-gray-200 p-2.5 rounded-xl transition-colors"
            title="Thêm vào giỏ hàng"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
