import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Filter, ChevronDown, Search, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS } from '../data';
import { Product } from '../types';

interface CatalogProps {
  onAddToCart: (product: Product) => void;
}

const Catalog: React.FC<CatalogProps> = ({ onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Seating', 'Tables', 'Lighting', 'Storage', 'Decor'];

  const filteredProducts = activeCategory === 'All'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="pt-32 pb-24 px-6 bg-gray-50 dark:bg-background-dark min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-xs uppercase tracking-widest font-bold text-primary mb-4">Collections</p>
          <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight mb-8">All Masterpieces</h1>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-y border-slate-100 py-8">
            <div className="flex flex-wrap gap-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-white dark:bg-gray-800 text-slate-600 dark:text-slate-400'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;