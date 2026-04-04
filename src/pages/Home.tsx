import { ArrowRight, Armchair, BedDouble, Lightbulb, Sofa, Table2, DoorClosed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

interface HomeProps {
  onAddToCart: (product: Product) => void;
}

export default function Home({ onAddToCart }: HomeProps) {
  const featuredProducts: Product[] = [
    { id: '1', name: "Sofa Góc Nordic Cao Cấp", price: 16990000, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80", designer: "Nordic Lab", category: "Sofa" },
    { id: '2', name: "Ghế bành thư giãn Eames", price: 5450000, image: "https://images.unsplash.com/photo-1592078615290-033ee584e277?auto=format&fit=crop&w=800&q=80", designer: "Charles Eames", category: "Chairs" },
    { id: '3', name: "Bàn trà kính cường lực hiện đại", price: 2890000, image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=800&q=80", designer: "Modernist", category: "Tables" },
    { id: '4', name: "Giường gỗ Sồi nguyên khối", price: 12500000, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80", designer: "Oak Master", category: "Beds" },
  ];

  const categories = [
    { name: 'Sofa & Ghế bành', count: '124 Mẫu', icon: <Sofa className="w-8 h-8"/>, color: 'bg-amber-100 text-amber-700' },
    { name: 'Phòng ngủ', count: '86 Mẫu', icon: <BedDouble className="w-8 h-8"/>, color: 'bg-stone-100 text-stone-600' },
    { name: 'Bàn ghế ăn', count: '312 Mẫu', icon: <Table2 className="w-8 h-8"/>, color: 'bg-orange-100 text-orange-600' },
    { name: 'Đèn trang trí', count: '100+ Mẫu', icon: <Lightbulb className="w-8 h-8"/>, color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Tủ & Kệ', count: '94 Mẫu', icon: <DoorClosed className="w-8 h-8"/>, color: 'bg-emerald-100 text-emerald-600' },
    { name: 'Nội thất gỗ', count: '57 Mẫu', icon: <Armchair className="w-8 h-8"/>, color: 'bg-rose-100 text-rose-600' },
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Banner Section */}
      <section className="relative px-4 mt-6">
        <div className="container mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-800 to-stone-700 text-white shadow-2xl h-[450px]">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 rounded-l-full blur-3xl transform translate-x-1/4"></div>
            <div className="absolute bottom-0 left-10 w-64 h-64 bg-amber-600/40 rounded-full blur-3xl mix-blend-screen"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between h-full px-10 lg:px-20">
              <div className="max-w-xl space-y-6 pt-10 md:pt-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-medium">
                  <span className="flex w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  Bộ Sưu Tập Tiết Thu 2026
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif leading-tight">
                  Tôn vinh <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">giá trị thật</span>
                  <br />của Không Gian
                </h1>
                <p className="text-stone-300 text-lg opacity-90 max-w-md">
                  Mang đến sự sang trọng và ấm cúng cho ngôi nhà của bạn với những tác phẩm nội thất tinh xảo đầy phong cách.
                </p>
                <div className="flex gap-4 pt-2">
                  <Link to="/category" className="px-8 py-3.5 rounded-full bg-white text-stone-900 font-bold hover:bg-gray-100 hover:scale-105 transition-all shadow-lg flex items-center gap-2">
                    Triển lãm nội thất <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
              <div className="hidden md:block relative w-1/2 h-full">
                <img 
                  src="https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=800&q=80" 
                  alt="Furniture Luxury" 
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-4/5 object-cover rounded-2xl drop-shadow-2xl hover:scale-105 transition-all duration-700 border-4 border-stone-600/50"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-serif mb-2">Không gian sống</h2>
            <p className="text-gray-500">Lựa chọn nội thất phù hợp cho từng căn phòng</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <Link key={idx} to="/category" className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:shadow-[0_10px_30px_rgb(217_119_6_/_0.15)] hover:border-amber-200 hover:-translate-y-1 transition-all group">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${cat.color} group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">{cat.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <Armchair className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-serif">Tuyển tác nội thất</h2>
            </div>
          </div>
          <Link to="/category" className="text-amber-700 font-medium hover:underline flex items-center gap-1">
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="container mx-auto px-4">
        <div className="bg-stone-800 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
          
          <div className="relative z-10 md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Góc Sống Xanh, Thoải Mái Từng Giây</h2>
            <p className="text-stone-300 mb-8 max-w-md">Combo nội thất phòng bếp mang đậm phong cách Châu Âu. Giảm ưu đãi 30% cho khách hàng thiết kế toàn bộ ngôi nhà.</p>
            <Link to="/category" className="px-8 py-3 bg-amber-600 text-white font-bold rounded-full hover:bg-amber-700 transition-colors inline-block">
              Mua Ngay
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
