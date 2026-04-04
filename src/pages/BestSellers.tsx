import { TrendingUp, Trophy } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

interface BestSellersProps {
  onAddToCart: (product: Product) => void;
}

export default function BestSellers({ onAddToCart }: BestSellersProps) {
  const products: Product[] = [
    { id: '301', name: "Ghế Văn Phòng Cao Cấp Herman", price: 5990000, designer: "Herman Miller", category: "Chairs", image: "https://images.unsplash.com/photo-1505843513577-22bb7abd2581?auto=format&fit=crop&w=800&q=80", rating: 4.9 },
    { id: '302', name: "Giường Gỗ Tràm phong cách Nhật", price: 10990000, designer: "Zen Wood", category: "Beds", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80", rating: 4.8 },
    { id: '303', name: "Thảm Trải Sàn Bắc Âu", price: 1200000, designer: "Nordic Rug", category: "Decor", image: "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd14?auto=format&fit=crop&w=800&q=80", rating: 4.7 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-gray-800 dark:to-gray-900 p-8 rounded-3xl border border-amber-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white dark:bg-gray-800 text-amber-600 rounded-full shadow flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-serif text-gray-800 dark:text-gray-100">Bán Chạy Nhất Tuần</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
              Top sản phẩm nội thất được khách hàng <TrendingUp className="w-4 h-4 text-amber-500"/> săn lùng nhiều nhất
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p, index) => (
          <div key={p.id} className="relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-amber-500 text-white font-bold text-xl rounded-full flex items-center justify-center z-20 border-4 border-white dark:border-gray-900 shadow-md">
              {index + 1}
            </div>
            <ProductCard product={p} onAddToCart={onAddToCart} />
          </div>
        ))}
      </div>
    </div>
  );
}
