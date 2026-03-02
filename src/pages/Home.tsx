import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS } from '../data';
import { Product } from '../types';

interface HomeProps {
  onAddToCart: (product: Product) => void;
}

export const Home: React.FC<HomeProps> = ({ onAddToCart }) => {
  const featuredProducts = PRODUCTS.slice(0, 3);
  const newArrivals = PRODUCTS.slice(3, 6);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center px-6 pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Living Room" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-2xl text-white"
          >
            <p className="text-xs uppercase tracking-[0.3em] font-bold mb-6 text-accent-gold">
              The 2024 Collection
            </p>
            <h1 className="text-6xl md:text-8xl font-serif font-bold leading-[0.9] mb-8 tracking-tighter">
              Timeless <br /> Elegance.
            </h1>
            <p className="text-lg text-slate-200 mb-10 max-w-lg leading-relaxed">
              Discover artisanal furniture that blends contemporary aesthetics with 
              unparalleled craftsmanship. Designed for the modern sanctuary.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/catalog" 
                className="bg-white text-slate-900 px-10 py-5 rounded-full font-bold flex items-center gap-2 hover:bg-accent-gold hover:text-white transition-all group"
              >
                Shop Collection
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-full font-bold hover:bg-white/20 transition-all">
                Our Story
              </button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-1 rounded-full transition-all ${i === 0 ? 'w-12 bg-white' : 'w-4 bg-white/30'}`} />
          ))}
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-widest font-bold text-primary mb-4">Curated Selection</p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">Featured Collections</h2>
            </div>
            <Link to="/catalog" className="text-sm font-bold flex items-center gap-2 hover:text-primary transition-colors group">
              View All Masterpieces
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals / Split Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden aspect-[4/5]"
            >
              <img 
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1000" 
                alt="New Arrival" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur-md p-8 rounded-2xl max-w-xs shadow-xl">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Designer Spotlight</p>
                <h3 className="text-xl font-serif font-bold mb-4">The Minimalist Series by Sora Tanaka</h3>
                <Link to="/catalog" className="text-sm font-bold text-primary flex items-center gap-2 group">
                  Explore Series
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            <div>
              <p className="text-xs uppercase tracking-widest font-bold text-primary mb-4">Fresh Perspectives</p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-8">New Arrivals</h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-12">
                Our latest additions celebrate the intersection of organic forms and industrial precision. 
                Each piece is a testament to our commitment to sustainable luxury.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {newArrivals.slice(0, 2).map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Advice / Trust Section */}
      <section className="py-24 px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-primary">
              <Star size={28} />
            </div>
            <h4 className="text-xl font-serif font-bold mb-4">Expert Curation</h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              Every piece in our collection is hand-selected by our team of interior designers for its 
              quality and aesthetic value.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-primary">
              <ShieldCheck size={28} />
            </div>
            <h4 className="text-xl font-serif font-bold mb-4">Lifetime Guarantee</h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              We stand behind the craftsmanship of our furniture. All structural components are 
              guaranteed for life.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-primary">
              <Truck size={28} />
            </div>
            <h4 className="text-xl font-serif font-bold mb-4">White-Glove Delivery</h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              Our professional team handles everything from delivery to assembly and packaging removal 
              in your room of choice.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
