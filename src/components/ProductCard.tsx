import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, Plus } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <Link to={`/product/${product.id}`} className="block overflow-hidden rounded-2xl bg-slate-100 aspect-[4/5] relative">
        <img 
          src={product.image} 
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </Link>
      
      <div className="mt-6 flex justify-between items-start">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1">
            {product.designer}
          </p>
          <Link to={`/product/${product.id}`} className="text-lg font-medium hover:text-primary transition-colors">
            {product.name}
          </Link>
          <p className="mt-1 text-slate-500 font-medium font-serif">${product.price.toLocaleString()}</p>
        </div>
        
        <button 
          onClick={(e) => {
            e.preventDefault();
            onAddToCart(product);
          }}
          className="bg-white shadow-sm border border-slate-100 p-3 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
        >
          <Plus size={18} />
        </button>
      </div>
    </motion.div>
  );
};
