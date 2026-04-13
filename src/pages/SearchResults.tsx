import { useSearchParams, Link } from 'react-router-dom';
import { Search, Frown } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

interface SearchResultsProps {
  onAddToCart: (product: Product) => void;
}

export default function SearchResults({ onAddToCart }: SearchResultsProps) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || 'Sofa';

  const products: Product[] = [
    { id: '601', name: "Sofa da ý siêu cấp", price: 30000000, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80", designer: "Italiano", category: "Sofa" },
    { id: '602', name: "Ghế Sofa đôi nhung", price: 25000000, image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80", designer: "Velvet Co", category: "Sofa" }
  ];

  return (
    <div className="bg-gray-50 dark:bg-background-dark min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 text-amber-600 rounded-full mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold font-serif mb-2">Kết quả tìm kiếm</h1>
          <p className="text-gray-500 text-lg">Tìm thấy <strong className="text-amber-600">{products.length}</strong> kết quả phù hợp cho từ khóa: <strong className="text-gray-800 dark:text-white">"{query}"</strong></p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Frown className="w-16 h-16 mb-4 text-gray-300" />
            <h3 className="text-xl font-bold mb-2">Rất tiếc, không tìm thấy sản phẩm!</h3>
            <p className="mb-6">Vui lòng thử lại với tên đồ nội thất khác.</p>
            <Link to="/category" className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">Về danh mục</Link>
          </div>
        )}
      </div>
    </div>
  );
}
