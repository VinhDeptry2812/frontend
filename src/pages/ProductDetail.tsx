import { useState } from 'react';
import { Star, Truck, ShieldCheck, Heart, ShoppingCart, Check, Share2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Product } from '../types';

interface ProductDetailProps {
  onAddToCart: (product: Product) => void;
}

export default function ProductDetail({ onAddToCart }: ProductDetailProps) {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product: Product = {
    id: id || '1',
    name: "Sofa Góc Nordic Dáng Chữ L",
    price: 16499000,
    designer: "Nordic Lab",
    category: "Sofa",
    rating: 4.9,
    reviews: 84,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
    description: "Sofa Góc Nordic mang tinh thần tối giản, tinh tế của vùng Bắc Âu nhưng vô cùng thiết thực. Thiết kế văng tựa liền cùng độ dốc hoàn hảo giúp giải phóng mệt mỏi sau ngày dài. Bề mặt bọc da tự nhiên mềm mại, khung xương chắc chắn hứa hẹn tuổi thọ bền bỉ hàng chục năm."
  };

  const images = [
    product.image,
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=800&q=80"
  ];

  return (
    <div className="bg-gray-50 dark:bg-background-dark min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 lg:p-10 shadow-sm border border-gray-100 dark:border-gray-800 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery Area */}
          <div className="space-y-4">
            <div className="aspect-video lg:aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 relative">
              <img src={images[activeImage]} alt="Hình ảnh sản phẩm" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Info Area */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold font-serif text-gray-900 dark:text-white mb-2">{product.name}</h1>
            <div className="bg-amber-50 dark:bg-gray-800/50 p-6 rounded-2xl mb-6 font-bold text-4xl text-amber-700">
              {product.price.toLocaleString('vi-VN')} ₫
            </div>
            <button 
              onClick={() => onAddToCart(product)}
              className="w-full bg-amber-600 text-white h-14 rounded-xl font-bold text-lg hover:bg-amber-700 shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-transform hover:-translate-y-1"
            >
              <ShoppingCart className="w-5 h-5" /> Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
