import { Sparkles } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

interface NewArrivalsProps {
  onAddToCart: (product: Product) => void;
}

export default function NewArrivals({ onAddToCart }: NewArrivalsProps) {
  const products: Product[] = [
    { id: '201', name: "Bàn phòng khách Mable Ý", price: 14990000, designer: "LuxStone", category: "Tables", image: "https://images.unsplash.com/photo-1564078516393-cf04bd966897?auto=format&fit=crop&w=800&q=80", rating: 5.0 },
    { id: '202', name: "Giường ngủ bọc da phong cách Âu", price: 25000000, designer: "EuroDream", category: "Beds", image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=800&q=80", rating: 4.9 },
    { id: '203', name: "Sofa nguyên khối Da Cừu", price: 31990000, designer: "Leather Art", category: "Sofa", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80", rating: 4.8 },
    { id: '204', name: "Đèn thả chùm phong cách tối giản", price: 4500000, designer: "MinimalLight", category: "Lighting", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80", rating: 4.9 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-serif">Hàng Mới Về</h1>
          <p className="text-gray-500 mt-1">Cập nhật những xu hướng nội thất The Modern 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />)}
      </div>
    </div>
  );
}
