import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Collections', href: '/catalog' },
    { name: 'Designers', href: '#' },
    { name: 'About', href: '#' },
    { name: 'Contact', href: '#' },
  ];

  const isDarkPage = location.pathname === '/auth';

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        isScrolled 
          ? 'bg-white/80 dark:bg-background-dark/80 backdrop-blur-md shadow-sm py-3' 
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button 
            className="lg:hidden text-slate-900 dark:text-white"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <Link to="/" className="text-2xl font-serif tracking-tighter font-bold text-slate-900 dark:text-white">
            AURELIUS
          </Link>

          <div className="hidden lg:flex items-center gap-8 ml-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium tracking-wide text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <button className="p-2 text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors">
            <Search size={20} />
          </button>
          <Link 
            to={user ? "/profile" : "/auth"} 
            className="flex items-center gap-2 p-2 text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors group"
          >
            <User size={20} />
            {user && (
              <span className="text-xs font-bold hidden md:block group-hover:text-primary transition-colors">
                {user.name}
              </span>
            )}
          </Link>
          <button 
            onClick={onOpenCart}
            className="p-2 text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors relative"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white dark:bg-background-dark z-[70] p-8"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="text-2xl font-serif font-bold">AURELIUS</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xl font-medium"
                  >
                    {link.name}
                  </Link>
                ))}
                <hr className="border-slate-100 dark:border-slate-800" />
                <Link 
                  to={user ? "/profile" : "/auth"} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="text-xl font-medium"
                >
                  {user ? `Hi, ${user.name}` : "Account"}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
