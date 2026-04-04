import { Timer, Zap } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useState, useEffect } from 'react';
import { Product } from '../types';

interface FlashSaleProps {
  onAddToCart: (product: Product) => void;
}

export default function FlashSale({ onAddToCart }: FlashSaleProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const products: Product[] = [
    { id: '101', name: "Ghế bành đọc sách bọc nỉ", price: 3450000, image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80", designer: "Cozy Deco", category: "Chairs" },
    { id: '102', name: "Bàn góc mặt kính hiện đại", price: 1200000, image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=800&q=80", designer: "Modernist", category: "Tables" },
    { id: '103', name: "Kệ sách treo tường thông minh", price: 850000, image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=800&q=80", designer: "Space Save", category: "Storage" },
    { id: '104', name: "Sofa Giường Đa Năng", price: 9900000, image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80", designer: "HomeFlex", category: "Sofa" },
  ];

  return (
    <div className="bg-gray-50 dark:bg-background-dark min-h-screen pb-16">
      <div className="bg-gradient-to-r from-red-700 to-red-500 text-white py-12 px-4 shadow-inner">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-yellow-300 font-bold mb-2">
              <Zap className="w-5 h-5 fill-current" /> SĂN DEAL NỘI THẤT CAO CẤP
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-serif">FLASH SALE</h1>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 text-center">
            <p className="text-sm font-semibold mb-2 flex items-center justify-center gap-1">
              <Timer className="w-4 h-4" /> KẾT THÚC TRONG
            </p>
            <div className="flex gap-3 text-2xl font-bold">
              <div className="w-16 h-16 bg-white dark:bg-gray-900 text-red-600 rounded-xl flex items-center justify-center shadow-lg">{String(timeLeft.hours).padStart(2, '0')}</div>
              <span className="text-2xl mt-4">:</span>
              <div className="w-16 h-16 bg-white dark:bg-gray-900 text-red-600 rounded-xl flex items-center justify-center shadow-lg">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <span className="text-2xl mt-4">:</span>
              <div className="w-16 h-16 bg-white dark:bg-gray-900 text-red-600 rounded-xl flex items-center justify-center shadow-lg">{String(timeLeft.seconds).padStart(2, '0')}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />)}
        </div>
      </div>
    </div>
  );
}
