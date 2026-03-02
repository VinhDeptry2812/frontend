import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div>
          <h3 className="text-2xl font-serif font-bold mb-6 tracking-tighter">AURELIUS</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Curating the world's most exceptional furniture and home accessories. 
            Crafted for those who appreciate the finer details of living.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Instagram size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Facebook size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter size={20} /></a>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-6 uppercase tracking-widest text-xs text-slate-500">Shop</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><Link to="/catalog" className="hover:text-white transition-colors">All Collections</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Seating</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Tables</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Lighting</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-6 uppercase tracking-widest text-xs text-slate-500">Company</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Designers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-6 uppercase tracking-widest text-xs text-slate-500">Newsletter</h4>
          <p className="text-slate-400 text-sm mb-6">
            Join our inner circle for exclusive previews and design inspiration.
          </p>
          <form className="relative">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="w-full bg-slate-800 border-none rounded-full py-3 px-6 text-sm focus:ring-1 focus:ring-primary outline-none"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
              <Mail size={16} />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-slate-500">
        <p>© 2024 Aurelius Luxury Interiors. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Shipping & Returns</a>
        </div>
      </div>
    </footer>
  );
};
