import { useState } from 'react';
import { Award, CheckCircle } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

interface BrandsProps {
  onAddToCart: (product: Product) => void;
}

export default function Brands({ onAddToCart }: BrandsProps) {
  const [activeBrand, setActiveBrand] = useState('Ashley Furniture');

  const brands = [
    { id: 1, name: "Ashley Furniture", logo: "🏡" },
    { id: 2, name: "IKEA", logo: "🛋️" },
    { id: 3, name: "Herman Miller", logo: "🪑" },
    { id: 4, name: "West Elm", logo: "🛏️" },
    { id: 5, name: "CB2", logo: "🪞" },
    { id: 6, name: "Roche Bobois", logo: "🖼️" }
  ];

  const products: Product[] = [
    { id: '401', name: `${activeBrand} Armchair Cổ Điển`, price: 34000000, image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80", designer: activeBrand, category: "Chairs" },
    { id: '402', name: `${activeBrand} Tủ Kệ Phòng Khách`, price: 4500000, image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=800&q=80", designer: activeBrand, category: "Storage" },
    { id: '403', name: `${activeBrand} Bàn ăn Gỗ Ô liu`, price: 15990000, image: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=800&q=80", designer: activeBrand, category: "Tables" },
  ];

  return (
    <div className="bg-gray-50 dark:bg-background-dark min-h-screen pb-16">
      {/* Brands Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 pb-12 pt-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-amber-600 mb-6">
            <Award className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold font-serif mb-4">Các Nhà Chế Tác Hàng Đầu</h1>
          <p className="text-gray-500 text-lg">Chúng tôi hợp tác với các thương hiệu nội thất toàn cầu mang đến cho bạn tác phẩm thủ công chất lượng nhất, thiết kế trường tồn với thời gian.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Brand List Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sticky top-28">
            <h3 className="font-bold text-xl mb-6">Chọn nhà sản xuất</h3>
            <div className="flex flex-col gap-3">
              {brands.map(brand => (
                <button
                  key={brand.id}
                  onClick={() => setActiveBrand(brand.name)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    activeBrand === brand.name 
                      ? 'bg-amber-600 text-white shadow-md' 
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{brand.logo}</span>
                    <span className="font-medium">{brand.name}</span>
                  </div>
                  {activeBrand === brand.name && <CheckCircle className="w-5 h-5" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Brand Products */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold font-serif flex items-center gap-2">
              Bộ sưu tập từ <span className="text-amber-600">{activeBrand}</span>
            </h2>
            <div className="text-sm text-gray-500">{products.length} sản phẩm</div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
