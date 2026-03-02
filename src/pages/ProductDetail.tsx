import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, Shield, Truck, ArrowLeft, Plus, Minus, Heart, Share2 } from 'lucide-react';
import { PRODUCTS } from '../data';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailProps {
  onAddToCart: (product: Product, finish?: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const product = PRODUCTS.find(p => p.id === id);
  const [selectedFinish, setSelectedFinish] = useState(product?.finishes?.[0]);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="pt-40 pb-24 px-6 text-center">
        <h2 className="text-2xl font-serif mb-4">Product not found</h2>
        <Link to="/catalog" className="text-primary font-bold hover:underline">Return to Catalog</Link>
      </div>
    );
  }

  const recommendations = PRODUCTS.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/catalog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-colors mb-12">
          <ArrowLeft size={16} />
          Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
          {/* Images */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl overflow-hidden aspect-[4/5] bg-slate-100"
            >
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-slate-100 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                  <img src={product.image} alt={`${product.name} view ${i}`} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest font-bold text-primary mb-4">{product.designer}</p>
              <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex text-accent-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.floor(product.rating || 0) ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <span className="text-sm text-slate-400 font-medium">({product.reviews} reviews)</span>
              </div>
              <p className="text-3xl font-serif font-bold">${product.price.toLocaleString()}</p>
            </div>

            <p className="text-slate-500 leading-relaxed mb-10">
              {product.description}
            </p>

            <div className="space-y-8 mb-12">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Select Finish</h4>
                <div className="flex flex-wrap gap-3">
                  {product.finishes?.map((finish) => (
                    <button
                      key={finish}
                      onClick={() => setSelectedFinish(finish)}
                      className={`px-6 py-3 rounded-xl text-sm font-medium transition-all border ${
                        selectedFinish === finish 
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {finish}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 border border-slate-200 rounded-full px-4 py-2">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-1 hover:bg-slate-50 rounded-full transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="text-lg font-bold w-8 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-1 hover:bg-slate-50 rounded-full transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <div className="flex gap-3">
                  <button className="p-4 rounded-full border border-slate-200 hover:border-red-500 hover:text-red-500 transition-all">
                    <Heart size={20} />
                  </button>
                  <button className="p-4 rounded-full border border-slate-200 hover:border-primary hover:text-primary transition-all">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onAddToCart(product, selectedFinish)}
              className="w-full bg-primary text-white py-5 rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-primary/20 mb-12"
            >
              Add to Selection
            </button>

            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-slate-100">
              <div className="flex items-start gap-4">
                <div className="text-primary mt-1"><Truck size={20} /></div>
                <div>
                  <h5 className="text-sm font-bold mb-1">White-Glove Delivery</h5>
                  <p className="text-xs text-slate-400">Professional assembly included</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-primary mt-1"><Shield size={20} /></div>
                <div>
                  <h5 className="text-sm font-bold mb-1">10-Year Warranty</h5>
                  <p className="text-xs text-slate-400">Guaranteed structural integrity</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h2 className="text-3xl font-serif font-bold mb-12">Style With These</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {recommendations.map((p) => (
              <ProductCard key={p.id} product={p} onAddToCart={() => onAddToCart(p)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
