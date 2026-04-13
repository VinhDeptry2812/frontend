import { Filter, Settings2 } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

interface CategoryProps {
  onAddToCart: (product: Product) => void;
}

export default function Category({ onAddToCart }: CategoryProps) {
  const products: Product[] = [
    { id: '501', name: "Ghế nhung phong cách Tân Cổ Điển", price: 18990000, image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80", designer: "Classic Home", category: "Chairs" },
    { id: '502', name: "Bàn ăn mặt đá Granite", price: 27500000, image: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=800&q=80", designer: "Stone Art", category: "Tables" },
    { id: '503', name: "Sofa da thật 3 chỗ", price: 42500000, image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80", designer: "Leather Craft", category: "Sofa" },
    { id: '504', name: "Tủ quần áo gỗ Óc Chó", price: 15000000, image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=800&q=80", designer: "Wood Master", category: "Storage" },
    { id: '505', name: "Ghế thư giãn kèm đệm", price: 9500000, image: "https://images.unsplash.com/photo-1629079447447-e24dc5ea1a30?auto=format&fit=crop&w=800&q=80", designer: "Relax Co", category: "Chairs" },
    { id: '506', name: "Đèn chùm pha lê nhập Italia", price: 34200000, image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80", designer: "Luce Italy", category: "Lighting" },
  ];

  return (
    <div className="bg-gray-50 dark:bg-background-dark min-h-screen py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-gray-100 dark:border-gray-800 sticky top-28">
            <div className="flex items-center gap-2 font-bold text-lg mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
              <Filter className="w-5 h-5 text-amber-600" /> Xếp lọc
            </div>
            
            <div className="space-y-6">
              {/* Filter Section */}
              <div>
                <h4 className="font-semibold mb-3">Khoảng Giá</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-600" />
                    <span className="text-gray-600 dark:text-gray-400 group-hover:text-amber-600">Dưới 5 triệu</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-600" />
                    <span className="text-gray-600 dark:text-gray-400 group-hover:text-amber-600">5 - 15 triệu</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-600" />
                    <span className="text-gray-600 dark:text-gray-400 group-hover:text-amber-600">Trêm 15 triệu</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="bg-white dark:bg-surface-dark rounded-xl p-4 mb-6 border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-xl font-bold font-serif">Tất Cả Sản Phẩm <span className="text-sm font-normal text-gray-400 ml-2">({products.length} Mẫu)</span></h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />)}
          </div>
        </div>

      </div>
    </div>
  );
}
