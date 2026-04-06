import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ChevronRight, Star, ShieldCheck, Truck, RefreshCw, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { ApiProduct } from '../types';
import { fetchProducts } from '../services/api';

interface HomeProps {
  onAddToCart: (product: ApiProduct) => void;
}

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000',
    eyebrow: 'Bộ Sưu Tập 2025',
    title: 'Không Gian Sống\nĐẳng Cấp',
    subtitle: 'Khám phá những mẫu nội thất tinh tế, kết hợp hoàn hảo giữa thẩm mỹ hiện đại và chất liệu tự nhiên cao cấp.',
  },
  {
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=2000',
    eyebrow: 'Phong Cách Scandinavian',
    title: 'Tinh Giản Là\nNghệ Thuật',
    subtitle: 'Thiết kế tối giản mang lại sự thanh thản và cảm giác rộng rãi cho mỗi không gian sống.',
  },
];

const categories = [
  { label: 'Phòng Khách', sub: '32 sản phẩm', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800', href: '/catalog' },
  { label: 'Phòng Ngủ', sub: '28 sản phẩm', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800', href: '/catalog' },
  { label: 'Phòng Ăn', sub: '18 sản phẩm', image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=800', href: '/catalog' },
  { label: 'Phòng Làm Việc', sub: '15 sản phẩm', image: 'https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&q=80&w=800', href: '/catalog' },
];

const blogPosts = [
  {
    tag: 'Cảm Hứng',
    title: '5 Xu Hướng Nội Thất Năm 2025 Bạn Không Thể Bỏ Qua',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
    date: '01 Tháng 4, 2025',
  },
  {
    tag: 'Thiết Kế',
    title: 'Cách Phối Màu Để Phòng Ngủ Luôn Ấm Áp và Tinh Tế',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800',
    date: '28 Tháng 3, 2025',
  },
  {
    tag: 'Hướng Dẫn',
    title: 'Chọn Sofa Phù Hợp Cho Phòng Khách Nhỏ — Bí Quyết Từ Chuyên Gia',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    date: '20 Tháng 3, 2025',
  },
];

const trustItems = [
  { icon: <Truck size={22} />, label: 'Miễn Phí Vận Chuyển', sub: 'Đơn hàng từ 5 triệu đồng' },
  { icon: <ShieldCheck size={22} />, label: 'Bảo Hành 24 Tháng', sub: 'Cam kết chính hãng' },
  { icon: <RefreshCw size={22} />, label: 'Đổi Trả 30 Ngày', sub: 'Không cần lý do' },
  { icon: <Phone size={22} />, label: 'Hỗ Trợ 24/7', sub: 'Hotline: 1800 1234' },
];

export const Home: React.FC<HomeProps> = ({ onAddToCart }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = heroSlides[activeSlide];
  const [products, setProducts] = useState<ApiProduct[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setActiveSlide(s => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchProducts({ sort_by: 'created_at', sort_order: 'desc' });
        if (res && res.data) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error("Error fetching products for Home", err);
      }
    };
    loadData();
  }, []);

  const featuredProducts = products.filter(p => p.is_featured).slice(0, 4);
  if (featuredProducts.length < 4) {
      featuredProducts.push(...products.filter(p => !p.is_featured).slice(0, 4 - featuredProducts.length));
  }
  
  const saleProducts = products.filter(p => p.sale_price && p.sale_price < p.base_price).slice(0, 4);
  if (saleProducts.length < 4) {
      // Fallback
      saleProducts.push(...products.slice(4, 4 + 4 - saleProducts.length));
  }

  return (
    <div style={{ overflow: 'hidden' }}>

      {/* ===================== HERO ===================== */}
      <section style={{ position: 'relative', height: '100vh', minHeight: 600, overflow: 'hidden' }}>
        {heroSlides.map((s, i) => (
          <div
            key={i}
            style={{
              position: 'absolute', inset: 0,
              opacity: i === activeSlide ? 1 : 0,
              transition: 'opacity 1.2s ease',
              pointerEvents: i === activeSlide ? 'auto' : 'none',
            }}
          >
            <img src={s.image} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.58) 40%, rgba(0,0,0,0.1))' }} />
          </div>
        ))}

        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 clamp(24px,6vw,100px)' }}>
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ maxWidth: 600, color: 'white' }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#e8a045', display: 'block', marginBottom: 16 }}>
              {slide.eyebrow}
            </span>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(48px, 7vw, 88px)', fontWeight: 600, lineHeight: 1.05, marginBottom: 22, whiteSpace: 'pre-line' }}>
              {slide.title}
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.82)', lineHeight: 1.75, maxWidth: 440, marginBottom: 36 }}>
              {slide.subtitle}
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link to="/catalog" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#1a6b4a', color: 'white', padding: '14px 32px', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', border: '2px solid #1a6b4a' }}>
                Khám Phá Ngay <ArrowRight size={16} />
              </Link>
              <button className="btn-outline-white" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'transparent', color: 'white', padding: '14px 32px', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', border: '2px solid rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                Xem Bộ Sưu Tập
              </button>
            </div>
          </motion.div>
        </div>

        {/* Slide dots */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10 }}>
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              style={{ width: i === activeSlide ? 40 : 10, height: 4, borderRadius: 4, border: 'none', background: i === activeSlide ? 'white' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }}
            />
          ))}
        </div>
      </section>

      {/* ===================== TRUST BAR ===================== */}
      <div style={{ background: 'white', borderTop: '1px solid #efefed', borderBottom: '1px solid #efefed' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {trustItems.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 20px', borderRight: i < 3 ? '1px solid #f0f0ee' : 'none' }}>
              <span style={{ color: '#1a6b4a', flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#222' }}>{item.label}</div>
                <div style={{ fontSize: 11, color: '#999' }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===================== PROMO BANNERS ===================== */}
      <section style={{ padding: '48px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Big left promo */}
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 4, gridRow: '1 / 3', minHeight: 380 }}>
            <img
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=900"
              alt="Promo 1"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
              referrerPolicy="no-referrer"
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0.05))' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: 36 }}>
              <div style={{ color: 'white' }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#e8a045', display: 'block', marginBottom: 10 }}>Flash Sale</span>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 600, lineHeight: 1.15, marginBottom: 12 }}>Sofa Cao Cấp<br />Giảm Đến 30%</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 22, lineHeight: 1.6 }}>Ưu đãi có hạn cho bộ sưu tập nội thất phòng khách.</p>
                <Link to="/catalog" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1a6b4a', color: 'white', padding: '11px 24px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none' }}>
                  Mua Ngay <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Right top */}
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 4, minHeight: 180 }}>
            <img
              src="https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=800"
              alt="Promo 2"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
              referrerPolicy="no-referrer"
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.42)', display: 'flex', alignItems: 'center', padding: 28 }}>
              <div style={{ color: 'white' }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#e8a045', display: 'block', marginBottom: 8 }}>Mới</span>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, marginBottom: 12 }}>Bàn Ăn Gỗ Walnut</h3>
                <Link to="/catalog" style={{ fontSize: 12, fontWeight: 700, color: 'white', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                  Xem thêm <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Right bottom */}
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 4, minHeight: 180 }}>
            <img
              src="https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800"
              alt="Promo 3"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
              referrerPolicy="no-referrer"
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.42)', display: 'flex', alignItems: 'center', padding: 28 }}>
              <div style={{ color: 'white' }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#e8a045', display: 'block', marginBottom: 8 }}>Bestseller</span>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, marginBottom: 12 }}>Kệ Sách Zenith</h3>
                <Link to="/catalog" style={{ fontSize: 12, fontWeight: 700, color: 'white', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                  Xem thêm <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FEATURED PRODUCTS ===================== */}
      <section style={{ padding: '48px 24px 64px', background: '#fafaf9' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span className="section-eyebrow" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#1a6b4a', marginBottom: 8, display: 'block' }}>
                Nổi Bật
              </span>
              <h2 className="section-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 600, color: '#1a1a1a', margin: 0 }}>
                Sản Phẩm Được Yêu Thích
              </h2>
            </div>
            <Link to="/catalog" style={{ fontSize: 13, fontWeight: 700, color: '#1a6b4a', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
              Xem Tất Cả <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {featuredProducts.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                showBadge={i % 2 === 0 ? 'sale' : 'new'}
                salePercent={i % 2 === 0 ? 15 : undefined}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CATEGORY GRID ===================== */}
      <section style={{ padding: '64px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#1a6b4a', display: 'block', marginBottom: 8 }}>
              Không Gian
            </span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px,4vw,42px)', fontWeight: 600, color: '#1a1a1a', margin: 0 }}>
              Khám Phá Theo Phòng
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="category-card"
                style={{ position: 'relative', overflow: 'hidden', borderRadius: 4, cursor: 'pointer', aspectRatio: '3/4' }}
              >
                <Link to={cat.href} style={{ display: 'block', height: '100%' }}>
                  <img
                    src={cat.image}
                    alt={cat.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    referrerPolicy="no-referrer"
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 30%, transparent)', display: 'flex', alignItems: 'flex-end', padding: 20 }}>
                    <div>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: 'white', display: 'block', marginBottom: 4 }}>
                        {cat.label}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        {cat.sub} <ChevronRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== SALE PRODUCTS ===================== */}
      <section style={{ padding: '64px 24px', background: '#fafaf9' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#d94f3d', display: 'block', marginBottom: 8 }}>
                🔥 Ưu Đãi Đặc Biệt
              </span>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: 600, color: '#1a1a1a', margin: 0 }}>
                Sản Phẩm Đang Khuyến Mãi
              </h2>
            </div>
            <Link to="/catalog" style={{ fontSize: 13, fontWeight: 700, color: '#1a6b4a', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
              Tất Cả Ưu Đãi <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {saleProducts.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                showBadge="sale"
                salePercent={[20, 15, 25, 10][i]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== INSPIRATION BLOG ===================== */}
      <section style={{ padding: '64px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#1a6b4a', display: 'block', marginBottom: 8 }}>
              Blog
            </span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px,4vw,42px)', fontWeight: 600, color: '#1a1a1a', margin: 0 }}>
              Góc Cảm Hứng
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {blogPosts.map((post, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ overflow: 'hidden', borderRadius: 4, background: 'white', border: '1px solid #efefed', cursor: 'pointer' }}
              >
                <div style={{ overflow: 'hidden', aspectRatio: '16/10' }}>
                  <img
                    src={post.image}
                    alt={post.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div style={{ padding: 20 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1a6b4a', marginBottom: 8, display: 'block' }}>
                    {post.tag}
                  </span>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.3, marginBottom: 12 }}>
                    {post.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: '#aaa' }}>{post.date}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1a6b4a', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 4 }}>
                      Đọc Thêm <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
