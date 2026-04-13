import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight, Star, Shield, Truck, Award, Leaf } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { getProducts } from '../services/products';
import { getCategories } from '../services/categories';
import { Product, Category } from '../types';

const heroSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000',
    label: 'Bộ sưu tập 2025',
    title: 'Không gian\nsống \nhoàn hảo.',
    desc: 'Khám phá các sản phẩm nội thất cao cấp được chế tác từ gỗ tự nhiên và vật liệu bền vững, mang lại sự sang trọng và ấm cúng cho ngôi nhà bạn.',
    cta: 'Khám phá ngay',
    ctaLink: '/catalog',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=2000',
    label: 'Phòng khách tinh tế',
    title: 'Sofa &\nGhế ngồi\ncao cấp.',
    desc: 'Thiết kế tối giản, chất liệu da thật và vải nhập khẩu cao cấp. Mỗi chiếc ghế là một tác phẩm nghệ thuật trong không gian sống của bạn.',
    cta: 'Xem sofa',
    ctaLink: '/catalog?search=sofa',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=2000',
    label: 'Phòng ngủ sang trọng',
    title: 'Giấc ngủ\nngon từ\nnội thất đẹp.',
    desc: 'Bộ sưu tập phòng ngủ với thiết kế tinh tế, tối ưu không gian nghỉ ngơi và thư giãn sau một ngày dài bận rộn.',
    cta: 'Xem phòng ngủ',
    ctaLink: '/catalog?search=giường',
  },
];

const categoryIcons: Record<string, string> = {
  'phong-khach': '🛋️',
  'phong-ngu': '🛏️',
  'phong-an': '🍽️',
  'van-phong': '💼',
  'phong-bep': '🍳',
  'ngoai-that': '🌿',
};

const getCategoryIcon = (slug: string) => {
  const key = Object.keys(categoryIcons).find(k => slug?.toLowerCase().includes(k));
  return key ? categoryIcons[key] : '🛋️';
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const navigate = useNavigate();

  // Auto-advance hero slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(p => (p + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingProducts(true);
        const [prodRes, newProdRes, catRes] = await Promise.all([
          getProducts({ sort_by: 'created_at', sort_order: 'desc' }),
          getProducts({ sort_by: 'created_at', sort_order: 'desc', cursor: undefined }),
          getCategories(false),
        ]);
        const allProds: Product[] = prodRes.data?.data || [];
        setProducts(allProds.slice(0, 6));
        setNewProducts(allProds.slice(0, 4));
        setCategories(Array.isArray(catRes.data) ? catRes.data.slice(0, 6) : []);
      } catch (err) {
        console.error('Lỗi tải dữ liệu trang chủ:', err);
      } finally {
        setLoadingProducts(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* ========== HERO SLIDER ========== */}
      <section className="relative h-screen min-h-[600px]">
        {heroSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-20 h-full flex items-center px-6">
          <div className="max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.7 }}
                className="max-w-2xl text-white"
              >
                <span className="text-accent text-xs uppercase tracking-[0.3em] font-bold mb-4 block">
                  {heroSlides[currentSlide].label}
                </span>
                <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6 whitespace-pre-line">
                  {heroSlides[currentSlide].title}
                </h1>
                <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-lg">
                  {heroSlides[currentSlide].desc}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to={heroSlides[currentSlide].ctaLink}
                    className="bg-primary text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-primary-dark transition-all group shadow-lg"
                  >
                    {heroSlides[currentSlide].cta}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/catalog"
                    className="glass-card text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all border-white/30"
                  >
                    Xem danh mục
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-300 rounded-full ${idx === currentSlide ? 'w-10 h-2 bg-accent' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentSlide(p => (p - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 glass-dark text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setCurrentSlide(p => (p + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 glass-dark text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </section>


      {/* ========== CATEGORIES PRODUCT SLIDER ========== */}
      <section className="py-24 px-6 bg-bg-ivory relative overflow-hidden">
        <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="text-left">
            <span className="section-label">Lựa chọn cao cấp</span>
            <h2 className="section-title">Danh Mục Sản Phẩm</h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                const container = document.getElementById('category-slider');
                if (container) container.scrollBy({ left: -400, behavior: 'smooth' });
              }}
              className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => {
                const container = document.getElementById('category-slider');
                if (container) container.scrollBy({ left: 400, behavior: 'smooth' });
              }}
              className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-1 py-4">
          {categories.length === 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton h-80 rounded-3xl" />
              ))}
            </div>
          ) : (
            <div
              id="category-slider"
              className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scroll-smooth no-scrollbar select-none"
            >
              {categories.map((cat, idx) => {
                // Map generated images to categories
                let bgImg = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1000";
                // Phòng khách
                if (cat.slug?.includes('phong-khach')) bgImg = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1000";
                // Phòng ngủ (bedroom interior)
                if (cat.slug?.includes('phong-ngu')) bgImg = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1000";
                // Giường ngủ (bed close-up)
                if (cat.slug?.includes('giuong')) bgImg = "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1000";
                // Sofa
                if (cat.slug?.includes('sofa')) bgImg = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000";
                // Bàn trà (coffee table)
                if (cat.slug?.includes('ban-tra')) bgImg = "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1000";
                // Tủ quần áo
                if (cat.slug?.includes('tu-quan-ao')) bgImg = "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&q=80&w=1000";
                // Phòng ăn / Bếp
                if (cat.slug?.includes('phong-an') || cat.slug?.includes('bep')) bgImg = "https://images.unsplash.com/photo-1617806118233-18e1ff208fa0?auto=format&fit=crop&q=80&w=1000";
                // Văn phòng
                if (cat.slug?.includes('van-phong')) bgImg = "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1000";
                // Ngoại thất
                if (cat.slug?.includes('ngoai-that')) bgImg = "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1000";

                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="w-[85vw] md:w-[420px] shrink-0 snap-start"
                  >
                    <Link
                      to={`/catalog?category_id=${cat.id}`}
                      className="group relative block h-[360px] overflow-hidden rounded-[32px] shadow-lg hover:shadow-2xl transition-all duration-700"
                    >
                      <img
                        src={bgImg}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      <div className="absolute bottom-10 left-10 text-white">
                        <span className="text-accent text-[10px] uppercase tracking-[0.3em] font-bold block mb-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                          Bộ sưu tập cao cấp
                        </span>
                        <h3 className="font-serif text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                          {cat.name}
                        </h3>
                        <div className="flex items-center gap-3 text-sm font-semibold opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500 delay-200">
                          Xem chi tiết <ArrowRight size={18} className="text-accent" />
                        </div>
                      </div>


                    </Link>
                  </motion.div>
                );
              })}

              {/* Extra "Discover All" Slide */}
              <div className="w-[85vw] md:w-[420px] shrink-0 snap-start">
                <Link
                  to="/catalog"
                  className="flex flex-col items-center justify-center h-[360px] rounded-[32px] bg-primary group hover:bg-primary-dark transition-all duration-500 text-center px-10 shadow-lg"
                >
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                    <ArrowRight size={32} className="text-white" />
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-white mb-4">Khám phá tất cả danh mục</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Hơn 500+ sản phẩm nội thất cao cấp đang chờ đón bạn.
                  </p>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========== FEATURED PRODUCTS ========== */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="section-label">Lựa chọn hàng đầu</span>
              <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
            </div>
            <Link to="/catalog" className="text-sm font-semibold text-primary flex items-center gap-1.5 hover:gap-2.5 transition-all group">
              Xem tất cả
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  <div className="skeleton aspect-[4/3]" />
                  <div className="p-4 space-y-2">
                    <div className="skeleton h-3 w-1/3" />
                    <div className="skeleton h-4 w-4/5" />
                    <div className="skeleton h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-text-muted">
              <p>Không có sản phẩm nào. Vui lòng thử lại sau.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========== PROMOTIONAL BANNER ========== */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=2000"
            alt="Nội thất"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary-dark/75" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-white max-w-xl">
            <span className="text-accent text-xs uppercase tracking-widest font-bold mb-4 block">Ưu đãi đặc biệt</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Mua sắm thả ga<br />Tiết kiệm tối đa
            </h2>
            <p className="text-white/70 text-lg mb-6">
              Giảm đến <strong className="text-accent">30%</strong> cho các sản phẩm được chọn. Chương trình có thời hạn, đừng bỏ lỡ!
            </p>
            <Link to="/catalog" className="btn-accent inline-flex items-center gap-2">
              Mua ngay
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 text-white text-center">
            {[
              { num: '500+', label: 'Sản phẩm' },
              { num: '10K+', label: 'Khách hàng' },
              { num: '5★', label: 'Đánh giá' },
              { num: '5 năm', label: 'Bảo hành' },
            ].map((stat, i) => (
              <div key={i} className="glass-dark rounded-2xl p-6 border border-white/10">
                <div className="font-serif text-3xl font-bold text-accent mb-1">{stat.num}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== NEW ARRIVALS ========== */}
      <section className="py-20 px-6 bg-bg-warm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="section-label">Hàng mới về</span>
              <h2 className="section-title">Sản Phẩm Mới Nhất</h2>
            </div>
            <Link to="/catalog?sort_by=created_at&sort_order=desc" className="text-sm font-semibold text-primary flex items-center gap-1.5 hover:gap-2.5 transition-all group">
              Xem tất cả
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  <div className="skeleton aspect-[4/3]" />
                  <div className="p-4 space-y-2">
                    <div className="skeleton h-3 w-1/3" />
                    <div className="skeleton h-4 w-4/5" />
                    <div className="skeleton h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========== WHY CHOOSE US ========== */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label">Lý do chọn chúng tôi</span>
            <h2 className="section-title">Cam Kết Của Nội Thất Xanh</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Leaf size={32} />,
                title: 'Vật liệu tự nhiên',
                desc: 'Sử dụng gỗ tự nhiên và vật liệu bền vững, thân thiện với môi trường và sức khỏe gia đình bạn.',
              },
              {
                icon: <Award size={32} />,
                title: 'Chất lượng cao cấp',
                desc: 'Mỗi sản phẩm đều trải qua kiểm tra chất lượng nghiêm ngặt trước khi đến tay khách hàng.',
              },
              {
                icon: <Truck size={32} />,
                title: 'Giao hàng tận nơi',
                desc: 'Dịch vụ giao hàng và lắp đặt tận nhà, đảm bảo sản phẩm luôn nguyên vẹn.',
              },
              {
                icon: <Shield size={32} />,
                title: 'Bảo hành 5 năm',
                desc: 'Chúng tôi bảo hành toàn bộ kết cấu sản phẩm trong 5 năm, đảm bảo sự an tâm cho bạn.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-bg-blue-light transition-colors group"
              >
                <div className="w-16 h-16 bg-bg-blue-light group-hover:bg-primary rounded-full flex items-center justify-center mb-5 text-primary group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <h4 className="font-serif font-bold text-lg text-text-dark mb-3">{item.title}</h4>
                <p className="text-text-muted text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
