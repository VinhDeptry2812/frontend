import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, Heart, Phone, ChevronDown, MapPin } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { fetchCategories } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
}

const categories = [
  { label: 'Sofa', href: '/catalog' },
  { label: 'Bàn', href: '/catalog' },
  { label: 'Ghế', href: '/catalog' },
  { label: 'Giường', href: '/catalog' },
  { label: 'Tủ & Kệ', href: '/catalog' },
  { label: 'Decor', href: '/catalog' },
];

const rooms = [
  { label: 'Phòng Khách', href: '/catalog' },
  { label: 'Phòng Ngủ', href: '/catalog' },
  { label: 'Phòng Ăn', href: '/catalog' },
  { label: 'Phòng Làm Việc', href: '/catalog' },
  { label: 'Nhà Bếp', href: '/catalog' },
];

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const { user } = useAuth();
  const location = useLocation();
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  useEffect(() => {
    fetchCategories().then(data => setDbCategories(data)).catch(console.error);
  }, []);

  const productCats = dbCategories.filter(c => c.parent_id !== null);
  const roomCats = dbCategories.filter(c => c.parent_id === null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  return (
    <>
      {/* Top Bar */}
      <div className="navbar-top" style={{ background: '#1a6b4a', color: 'white', fontSize: 12, textAlign: 'center', padding: '7px 16px', letterSpacing: '0.05em', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1001 }}>
        <span>🚚 Miễn phí vận chuyển cho đơn hàng từ <strong>5.000.000đ</strong> · Hỗ trợ: <strong>1800 1234</strong></span>
      </div>

      {/* Main Navbar */}
      <nav
        style={{
          position: 'fixed',
          top: 32,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'white',
          borderBottom: '1px solid #e8e8e4',
          boxShadow: isScrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
          {/* Left: Mobile toggle + Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              style={{ display: 'flex', padding: 6, color: '#333', background: 'none', border: 'none', cursor: 'pointer' }}
              className="lg:hidden"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="navbar-logo" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: '#1a6b4a', letterSpacing: '-0.5px', textDecoration: 'none' }}>
              NỘITHẤT<span style={{ color: '#e8a045' }}>·</span>XANH
            </Link>
          </div>

          {/* Center: Nav Links */}
          <div className="hidden lg:flex" style={{ alignItems: 'center', gap: 0 }}>
            <Link to="/catalog" className="nav-link" style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#333', textDecoration: 'none', padding: '24px 14px', display: 'inline-block', position: 'relative', transition: 'color 0.2s' }}>
              Mới Nhất
            </Link>

            {/* Dropdown: Sản Phẩm */}
            <div className="nav-dropdown" style={{ position: 'relative', display: 'inline-block' }}>
              <button style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#333', background: 'none', border: 'none', padding: '24px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                Sản Phẩm <ChevronDown size={13} />
              </button>
              <div className="nav-dropdown-content" style={{ position: 'absolute', top: '100%', left: 0, minWidth: 200, background: 'white', boxShadow: '0 8px 30px rgba(0,0,0,0.1)', borderTop: '2px solid #1a6b4a', zIndex: 100, opacity: 0, visibility: 'hidden', transform: 'translateY(8px)', transition: 'all 0.2s ease' }}>
                {(productCats.length > 0 ? productCats : categories).map((cat: any) => (
                  <Link key={cat.id || cat.label} to={cat.id ? `/catalog?category_id=${cat.id}` : cat.href} style={{ display: 'block', padding: '10px 18px', fontSize: 13, color: '#555', textDecoration: 'none', borderBottom: '1px solid #f5f5f5', transition: 'all 0.15s' }}>
                    {cat.name || cat.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Dropdown: Phòng */}
            <div className="nav-dropdown" style={{ position: 'relative', display: 'inline-block' }}>
              <button style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#333', background: 'none', border: 'none', padding: '24px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                Không Gian <ChevronDown size={13} />
              </button>
              <div className="nav-dropdown-content" style={{ position: 'absolute', top: '100%', left: 0, minWidth: 200, background: 'white', boxShadow: '0 8px 30px rgba(0,0,0,0.1)', borderTop: '2px solid #1a6b4a', zIndex: 100, opacity: 0, visibility: 'hidden', transform: 'translateY(8px)', transition: 'all 0.2s ease' }}>
                {(roomCats.length > 0 ? roomCats : rooms).map((room: any) => (
                  <Link key={room.id || room.label} to={room.id ? `/catalog?category_id=${room.id}` : room.href} style={{ display: 'block', padding: '10px 18px', fontSize: 13, color: '#555', textDecoration: 'none', borderBottom: '1px solid #f5f5f5', transition: 'all 0.15s' }}>
                    {room.name || room.label}
                  </Link>
                ))}
              </div>
            </div>


          </div>

          {/* Right: Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <form 
              onSubmit={handleSearch}
              style={{ 
                position: 'relative', 
                display: 'flex', 
                alignItems: 'center',
                marginLeft: 10
              }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm sản phẩm"
                style={{
                  width: 240,
                  height: 38,
                  padding: '0 40px 0 20px',
                  borderRadius: 20,
                  border: '1px solid #e8e8e4',
                  fontSize: 13,
                  outline: 'none',
                  background: '#f9f9f7',
                  transition: 'all 0.3s'
                }}
                className="search-input-navbar"
              />
              <button
                type="submit"
                style={{ 
                  position: 'absolute', 
                  right: 12, 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  color: '#555',
                  display: 'flex' 
                }}
              >
                <Search size={18} />
              </button>
            </form>
            <Link
              to={user ? '/profile' : '/auth'}
              style={{ padding: 8, color: '#555', display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', transition: 'color 0.2s' }}
              title={user ? user.name : 'Đăng nhập'}
              id="user-nav-link"
            >
              <User size={20} />
              {user && <span style={{ fontSize: 12, fontWeight: 700 }}>{user.name}</span>}
            </Link>
            <Link
              to="/wishlist"
              style={{ padding: 8, color: '#555', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
              title="Danh sách yêu thích"
            >
              <Heart size={20} />
            </Link>
            <button
              onClick={onOpenCart}
              style={{ padding: 8, color: '#555', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', position: 'relative', transition: 'color 0.2s' }}
              title="Giỏ hàng"
              id="cart-open-btn"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: 2, right: 2,
                  background: '#1a6b4a', color: 'white',
                  fontSize: 10, fontWeight: 700,
                  width: 17, height: 17,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>


      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000 }}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 320, background: 'white', zIndex: 2001, display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0ee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: '#1a6b4a' }}>NỘITHẤT<span style={{ color: '#e8a045' }}>·</span>XANH</span>
                <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', display: 'flex' }}>
                  <X size={22} />
                </button>
              </div>
              <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
                {[
                  { label: 'Trang Chủ', href: '/' },
                  { label: 'Mới Nhất', href: '/catalog' },
                  { label: 'Sofa', href: '/catalog' },
                  { label: 'Bàn', href: '/catalog' },
                  { label: 'Ghế', href: '/catalog' },
                  { label: 'Giường', href: '/catalog' },
                  { label: 'Tủ & Kệ', href: '/catalog' },
                ].map(link => (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ display: 'block', padding: '13px 24px', fontSize: 14, fontWeight: 600, color: '#333', textDecoration: 'none', borderBottom: '1px solid #f8f8f6', transition: 'color 0.2s' }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div style={{ padding: '20px 24px', borderTop: '1px solid #f0f0ee', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Link
                  to={user ? '/profile' : '/auth'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#1a6b4a', color: 'white', textDecoration: 'none', borderRadius: 4, fontSize: 14, fontWeight: 700 }}
                >
                  <User size={18} />
                  {user ? `Xin chào, ${user.name}` : 'Đăng nhập / Đăng ký'}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div style={{ height: 100 }} />
    </>
  );
};
