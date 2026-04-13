import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, Heart, Phone, ChevronDown, MapPin, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getCategories } from '../services/categories';
import { Category } from '../types';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount, openCart } = useCart();
  const { wishlist } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const catDropRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    getCategories(false).then(res => {
      const data = res.data;
      setCategories(Array.isArray(data) ? data.slice(0, 8) : []);
    }).catch(() => { });
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsCatDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isSearchOpen && searchRef.current) searchRef.current.focus();
  }, [isSearchOpen]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catDropRef.current && !catDropRef.current.contains(e.target as Node)) setIsCatDropdownOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setIsUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const isHomePage = location.pathname === '/';

  return (
    <>
      {/* Main Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
        : isHomePage
          ? 'bg-transparent py-6'
          : 'bg-white py-5 border-b border-stone-100'
        }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-8">
            <button
              className={`lg:hidden p-2 rounded-lg transition-colors ${isScrolled || !isHomePage ? 'text-text-dark hover:bg-stone-100' : 'text-white hover:bg-white/20'}`}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>

            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-white font-bold text-lg font-serif">N</span>
              </div>
              <div className="leading-tight">
                <div className={`font-serif font-black text-xl md:text-2xl leading-none tracking-tight transition-colors ${isScrolled || !isHomePage ? 'text-text-dark' : 'text-white'
                  }`}>
                  NỘI THẤT XANH
                </div>
                <div className={`text-[10px] md:text-[11px] uppercase tracking-[0.25em] font-bold mt-1 transition-colors ${isScrolled || !isHomePage ? 'text-primary' : 'text-accent'
                  }`}>
                  Không gian đẳng cấp
                </div>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1 ml-8">
              <Link to="/" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isScrolled || !isHomePage ? 'text-text-dark hover:text-primary hover:bg-bg-blue-light' : 'text-white/90 hover:text-white hover:bg-white/10'
                } ${location.pathname === '/' ? (isScrolled ? 'text-primary font-bold bg-bg-blue-light' : 'text-white font-bold bg-white/10') : ''}`}>
                Trang Chủ
              </Link>

              {/* Danh Mục Dropdown */}
              <div ref={catDropRef} className="relative">
                <button
                  onClick={() => setIsCatDropdownOpen(p => !p)}
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isScrolled || !isHomePage ? 'text-text-dark hover:text-primary hover:bg-bg-blue-light' : 'text-white/90 hover:text-white hover:bg-white/10'
                    } ${isCatDropdownOpen ? (isScrolled || !isHomePage ? 'bg-bg-blue-light text-primary' : 'bg-white/10 text-white') : ''}`}
                >
                  Danh Mục
                  <ChevronDown size={14} className={`transition-transform ${isCatDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isCatDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="nav-dropdown p-2"
                    >
                      <Link to="/catalog" className="flex items-center px-4 py-2.5 text-sm text-text-dark hover:bg-bg-blue-light hover:text-primary rounded-lg transition-colors font-medium">
                        Tất cả sản phẩm
                      </Link>
                      <div className="border-t border-stone-100 my-1" />
                      {categories.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-text-muted">Đang tải...</div>
                      ) : categories.map(cat => (
                        <Link
                          key={cat.id}
                          to={`/catalog?category_id=${cat.id}`}
                          className="flex items-center px-4 py-2.5 text-sm text-text-dark hover:bg-bg-blue-light hover:text-primary rounded-lg transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/catalog?on_sale=true" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isScrolled || !isHomePage ? 'text-text-dark hover:text-primary hover:bg-bg-blue-light' : 'text-white/90 hover:text-white hover:bg-white/10'
                } ${location.search.includes('on_sale=true') ? (isScrolled || !isHomePage ? 'text-primary font-bold bg-bg-blue-light' : 'text-white font-bold bg-white/10') : ''}`}>
                Khuyến Mãi
              </Link>
              <Link to="/catalog" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isScrolled || !isHomePage ? 'text-text-dark hover:text-primary hover:bg-bg-blue-light' : 'text-white/90 hover:text-white hover:bg-white/10'
                } ${location.pathname === '/catalog' && !location.search.includes('on_sale=true') ? (isScrolled || !isHomePage ? 'text-primary font-bold bg-bg-blue-light' : 'text-white font-bold bg-white/10') : ''}`}>
                Sản Phẩm
              </Link>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(p => !p)}
              className={`p-2.5 rounded-lg transition-colors ${isScrolled || !isHomePage ? 'text-text-dark hover:bg-stone-100' : 'text-white hover:bg-white/20'
                }`}
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link to={user ? '/profile?tab=wishlist' : '/auth'} className={`relative p-2.5 rounded-lg transition-colors hidden sm:flex ${isScrolled || !isHomePage ? 'text-text-dark hover:bg-stone-100' : 'text-white hover:bg-white/20'
              }`}>
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlist.length > 9 ? '9+' : wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className={`relative p-2.5 rounded-lg transition-colors ${isScrolled || !isHomePage ? 'text-text-dark hover:bg-stone-100' : 'text-white hover:bg-white/20'
                }`}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* User */}
            <div className="relative">
              <button
                onClick={() => user ? navigate('/profile') : navigate('/auth')}
                className={`flex items-center gap-2 p-2.5 rounded-lg transition-colors ${isScrolled || !isHomePage ? 'text-text-dark hover:bg-stone-100' : 'text-white hover:bg-white/20'
                  }`}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <User size={20} />
                )}
                {user && (
                  <span className={`text-xs font-medium hidden md:block max-w-[80px] truncate ${isScrolled || !isHomePage ? 'text-text-dark' : 'text-white'
                    }`}>{user.name}</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-stone-200 bg-white"
            >
              <div className="max-w-3xl mx-auto px-6 py-4">
                <form onSubmit={handleSearch} className="flex items-center gap-4 mb-4">
                  <Search size={20} className="text-primary flex-shrink-0" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Tìm sofa, giường, bàn ăn, tủ..."
                    className="flex-1 text-base outline-none bg-transparent text-text-dark placeholder-text-muted"
                    onKeyDown={e => e.key === 'Enter' && handleSearch(e as any)}
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery('')} className="text-text-muted hover:text-text-dark">
                      <X size={18} />
                    </button>
                  )}
                  <button type="submit" className="btn-primary text-sm px-6 py-2 !rounded-full flex-shrink-0">
                    Tìm kiếm
                  </button>
                </form>
                {/* Quick search keywords */}
                <div className="flex items-center gap-2 flex-wrap pb-1">
                  <span className="text-xs text-text-muted font-medium">Tìm nhanh:</span>
                  {['Sofa phòng khách', 'Giường ngủ', 'Bàn ăn', 'Tủ quần áo', 'Bàn làm việc', 'Kệ sách'].map(kw => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => {
                        navigate(`/catalog?search=${encodeURIComponent(kw)}`);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="text-xs bg-bg-blue-light text-primary font-medium px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-colors"
                    >
                      {kw}
                    </button>
                  ))}
                  {categories.slice(0, 4).map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        navigate(`/catalog?category_id=${cat.id}`);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="text-xs bg-stone-100 text-text-muted font-medium px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-colors"
                    >
                      📁 {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white z-[70] flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center p-6 border-b border-stone-100">
                <div>
                  <div className="font-serif font-bold text-xl text-text-dark">NỘI THẤT XANH</div>
                  <div className="text-[10px] uppercase tracking-widest text-primary">Không gian đẳng cấp</div>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-text-muted hover:text-text-dark rounded-lg">
                  <X size={22} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <nav className="space-y-1">
                  {[
                    { name: 'Trang Chủ', href: '/' },
                    { name: 'Tất cả sản phẩm', href: '/catalog' },
                    { name: 'Khuyến Mãi', href: '/catalog?on_sale=true' },
                  ].map(link => {
                    const isActive = link.href === '/' ? location.pathname === '/' : link.href.includes('on_sale') ? location.search.includes('on_sale') : (location.pathname === '/catalog' && !location.search.includes('on_sale'));
                    return (
                      <Link key={link.name} to={link.href} onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${isActive ? 'bg-bg-blue-light text-primary font-bold' : 'text-text-dark hover:text-primary hover:bg-bg-blue-light'
                          }`}>
                        {link.name}
                      </Link>
                    );
                  })}

                  {categories.length > 0 && (
                    <>
                      <div className="py-2 px-4 text-xs uppercase tracking-widest font-bold text-text-muted">Danh Mục</div>
                      {categories.map(cat => (
                        <Link key={cat.id} to={`/catalog?category_id=${cat.id}`} onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-4 py-3 text-sm text-text-dark hover:text-primary hover:bg-bg-blue-light rounded-lg transition-colors pl-8">
                          {cat.name}
                        </Link>
                      ))}
                    </>
                  )}
                </nav>

                <div className="border-t border-stone-100 mt-6 pt-6 space-y-1">
                  {user ? (
                    <>
                      <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-base font-medium text-text-dark hover:text-primary hover:bg-bg-blue-light rounded-lg transition-colors">
                        <User size={18} /> Tài khoản của tôi
                      </Link>
                      <button onClick={() => { logout(); setIsMobileMenuOpen(false); navigate('/'); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <LogOut size={18} /> Đăng xuất
                      </button>
                    </>
                  ) : (
                    <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium text-primary hover:bg-bg-blue-light rounded-lg transition-colors">
                      <User size={18} /> Đăng nhập / Đăng ký
                    </Link>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-stone-100 bg-bg-warm">
                <a href="tel:1900123456" className="flex items-center gap-3 text-text-dark font-medium">
                  <Phone size={18} className="text-primary" />
                  <div>
                    <div className="text-xs text-text-muted">Hotline hỗ trợ</div>
                    <div className="font-bold text-primary">1900 123 456</div>
                  </div>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
