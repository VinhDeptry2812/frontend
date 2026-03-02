import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Filter, ChevronDown, Search, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS } from '../data';
import { Product } from '../types';

interface CatalogProps {
  onAddToCart: (product: Product) => void;
}

export const Catalog: React.FC<CatalogProps> = ({ onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Seating', 'Tables', 'Lighting', 'Storage', 'Decor'];

  const filteredProducts = activeCategory === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="text-xs uppercase tracking-widest font-bold text-primary mb-4">Collections</p>
          <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight mb-8">All Masterpieces</h1>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-y border-slate-100 py-8">
            <div className="flex flex-wrap gap-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-6 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search collection..." 
                  className="w-full bg-slate-100 border-none rounded-full py-3 pl-12 pr-6 text-sm focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <button className="flex items-center gap-2 text-sm font-bold border border-slate-200 px-6 py-3 rounded-full hover:bg-slate-50 transition-colors">
                <SlidersHorizontal size={18} />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-24 flex justify-center items-center gap-4">
          <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-colors">
            1
          </button>
          <button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/20">
            2
          </button>
          <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-colors">
            3
          </button>
          <span className="text-slate-300">...</span>
          <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-colors">
            12
          </button>
        </div>
      </div>
    </div>
  );
};
