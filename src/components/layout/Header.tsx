import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User, Heart, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

export const Header = ({ cartCount, onOpenCart }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-background-dark/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition-transform duration-300">
            FL
          </div>
          <span className="font-serif font-bold text-2xl tracking-tight hidden sm:block">
            Furniture Luxury
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-medium">
          <Link to="/category" className="hover:text-amber-600 transition-colors">Danh mục</Link>
          <Link to="/brands" className="hover:text-amber-600 transition-colors">Thương hiệu</Link>
          <Link to="/flash-sale" className="text-red-500 font-bold hover:text-red-600 transition-colors">Flash Sale</Link>
          <Link to="/new-arrivals" className="hover:text-amber-600 transition-colors">Mới nhất</Link>
          <Link to="/compare" className="hover:text-amber-600 transition-colors">So sánh</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex relative items-center">
            <input 
              type="text" 
              placeholder="Tìm kiếm nội thất..." 
              className="bg-gray-100 dark:bg-gray-800 text-sm rounded-full py-2 pl-4 pr-10 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all w-64"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors lg:hidden">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors hidden sm:block">
            <Heart className="w-5 h-5" />
          </button>
          <button 
            onClick={onOpenCart}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-amber-600 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </button>
          <Link to="/profile" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <User className="w-5 h-5" />
          </Link>
          <button className="p-2 md:hidden hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
