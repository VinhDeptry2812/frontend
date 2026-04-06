import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, Shield, Truck, ArrowLeft, Plus, Minus, Heart, Share2, Loader2 } from 'lucide-react';
import { ApiProduct } from '../types';
import { ProductCard } from '../components/ProductCard';
import { fetchProductDetail, fetchProducts, fetchProductVariants } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductDetailProps {
  onAddToCart: (product: ApiProduct, finish?: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [recommendations, setRecommendations] = useState<ApiProduct[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { showNotification } = useNotification();
  const { isInWishlist, toggleWishlist: toggleWishlistId } = useWishlist();
  const wished = isInWishlist(product?.id || 0);
  const [loadingWish, setLoadingWish] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (!id) return;
        
        const prd = await fetchProductDetail(id);
        
        // Lấy tất cả biến thể của sản phẩm từ API đặc biệt
        try {
          const variantsApi = await fetchProductVariants(id);
          prd.variants = Array.isArray(variantsApi) ? variantsApi : (variantsApi?.data || prd.variants);
        } catch (variantErr) {
          console.warn("Could not fetch explicit variants, falling back to embedded ones", variantErr);
        }

        setProduct(prd);
        
        // Setup initial finish based on variants if any
        if (prd.variants && prd.variants.length > 0) {
          setSelectedVariantId(prd.variants[0].id);
        }

        // Fetch recommendations (random products for now)
        const recs = await fetchProducts({ category_id: prd.category_id });
        if (recs && recs.data) {
          setRecommendations(recs.data.filter((p: ApiProduct) => p.id !== prd.id).slice(0, 3));
        }
      } catch (err) {
        setError('Không tìm thấy sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="pt-40 pb-24 px-6 flex flex-col items-center justify-center min-h-[60vh] text-[#1a6b4a]">
        <Loader2 size={40} className="animate-spin mb-4" />
        <p>Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-40 pb-24 px-6 text-center">
        <h2 className="text-2xl font-serif mb-4">{error || 'Không tìm thấy sản phẩm'}</h2>
        <Link to="/catalog" className="text-[#1a6b4a] font-bold hover:underline">Quay lại Cửa Hàng</Link>
      </div>
    );
  }

  const activeVariant = product.variants?.find((v: any) => v.id === selectedVariantId) || product.variants?.[0] || null;

  const basePrice = Number(product.base_price) || 0;
  const salePrice = Number(product.sale_price) || 0;
  const displayPrice = activeVariant?.price ? Number(activeVariant.price) : (salePrice > 0 ? salePrice : basePrice);

  const displayImage = activeVariant?.image_url || product.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400';

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/catalog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#1a6b4a] transition-colors mb-12 uppercase tracking-widest">
          <ArrowLeft size={16} />
          Trở về Bộ Sưu Tập
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
          {/* Images */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-sm overflow-hidden aspect-[4/5] bg-[#f7f7f5] border border-[#efefed]"
            >
              <img src={displayImage} alt={product.name} className="w-full h-full object-cover" />
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="aspect-square rounded-sm overflow-hidden bg-[#f7f7f5] cursor-pointer hover:ring-2 hover:ring-[#1a6b4a] transition-all border border-[#efefed]">
                  <img src={displayImage} alt={`${product.name} view ${i}`} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest font-bold text-[#1a6b4a] mb-4">{product.brand || product.category?.name || 'Thương hiệu'}</p>
              <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#1a1a1a] mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex text-[#e8a045]">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <span className="text-sm text-slate-400 font-medium">(24 đánh giá)</span>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-3xl font-serif font-bold text-[#d94f3d]">
                  {displayPrice.toLocaleString('vi-VN')}đ
                </p>
                {!activeVariant && salePrice > 0 && salePrice < basePrice && (
                  <p className="text-lg text-slate-400 line-through mb-1">
                    {basePrice.toLocaleString('vi-VN')}đ
                  </p>
                )}
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed mb-6 text-sm">
              {product.description || 'Sản phẩm nội thất tinh tế với thiết kế hiện đại, chất liệu bền bỉ và tính công năng cao. Tối ưu cho không gian sống hiện đại.'}
            </p>

            {/* Specifications Table */}
            <div className="bg-[#f9f9f7] p-5 rounded-sm mb-10 border border-[#e8e8e4]">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-4">Thông số chi tiết</h4>
              <ul className="text-sm text-slate-600 space-y-3">
                {(activeVariant?.sku || product.sku) && <li className="flex justify-between border-b border-[#efefed] pb-2"><span>Mã (SKU):</span> <span className="font-medium text-[#1a1a1a]">{activeVariant?.sku || product.sku}</span></li>}
                {product.brand && <li className="flex justify-between border-b border-[#efefed] pb-2"><span>Thương hiệu:</span> <span className="font-medium text-[#1a1a1a]">{product.brand}</span></li>}
                {product.category?.name && <li className="flex justify-between border-b border-[#efefed] pb-2"><span>Danh mục:</span> <span className="font-medium text-[#1a1a1a]">{product.category.name}</span></li>}
                {activeVariant?.color && <li className="flex justify-between border-b border-[#efefed] pb-2"><span>Màu sắc:</span> <span className="font-medium text-[#1a1a1a]">{activeVariant.color}</span></li>}
                {(activeVariant?.wood_type || product.material) && <li className="flex justify-between border-b border-[#efefed] pb-2"><span>Chất liệu:</span> <span className="font-medium text-[#1a1a1a]">{activeVariant?.wood_type || product.material}</span></li>}
                {activeVariant?.upholstery && <li className="flex justify-between border-b border-[#efefed] pb-2"><span>Chất liệu bọc:</span> <span className="font-medium text-[#1a1a1a]">{activeVariant.upholstery}</span></li>}
                {activeVariant?.finish && <li className="flex justify-between border-b border-[#efefed] pb-2"><span>Bề mặt (Finish):</span> <span className="font-medium text-[#1a1a1a]">{activeVariant.finish}</span></li>}
                {activeVariant?.size && <li className="flex justify-between border-b border-[#efefed] pb-2"><span>Kích thước:</span> <span className="font-medium text-[#1a1a1a]">{activeVariant.size}</span></li>}
                {activeVariant?.width_cm && <li className="flex justify-between border-b border-[#efefed] pb-2"><span>Chiều rộng:</span> <span className="font-medium text-[#1a1a1a]">{activeVariant.width_cm} cm</span></li>}
                {activeVariant?.depth_cm && <li className="flex justify-between border-b border-[#efefed] pb-2"><span>Chiều sâu:</span> <span className="font-medium text-[#1a1a1a]">{activeVariant.depth_cm} cm</span></li>}
                {activeVariant?.height_cm && <li className="flex justify-between border-b border-[#efefed] pb-2"><span>Chiều cao:</span> <span className="font-medium text-[#1a1a1a]">{activeVariant.height_cm} cm</span></li>}
                {activeVariant?.seat_height_cm && <li className="flex justify-between border-b border-[#efefed] pb-2"><span>Chiều cao đệm ngồi:</span> <span className="font-medium text-[#1a1a1a]">{activeVariant.seat_height_cm}</span></li>}
                {activeVariant?.weight_kg && <li className="flex justify-between border-b border-[#efefed] pb-2"><span>Trọng lượng:</span> <span className="font-medium text-[#1a1a1a]">{activeVariant.weight_kg} kg</span></li>}
                {activeVariant?.stock_quantity !== undefined && <li className="flex justify-between border-b border-[#efefed] pb-2"><span>Tồn kho:</span> <span className="font-medium text-[#1a1a1a]">{activeVariant.stock_quantity > 0 ? `${activeVariant.stock_quantity} sản phẩm` : 'Hết hàng'}</span></li>}
              </ul>
            </div>

            <div className="space-y-8 mb-12">
              {product.variants && product.variants.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-[#1a1a1a]">Phân Loại / Biến Thể</h4>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((v: any) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`px-6 py-3 rounded-sm text-sm font-medium transition-all border ${selectedVariantId === v.id
                            ? 'border-[#1a6b4a] bg-[#1a6b4a]/5 text-[#1a6b4a]'
                            : 'border-[#e8e8e4] text-slate-600 hover:border-slate-300'
                          }`}
                      >
                        {v.color || v.finish || v.sku || `Mẫu ${v.id}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 border border-[#e8e8e4] rounded-full px-4 py-2">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-1 hover:bg-[#f9f9f7] rounded-full transition-colors text-slate-600"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="text-lg font-bold w-8 text-center text-[#1a1a1a]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-1 hover:bg-[#f9f9f7] rounded-full transition-colors text-slate-600"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={async (e) => {
                      e.preventDefault();
                      if (!localStorage.getItem('token')) {
                        showNotification('Vui lòng đăng nhập để thêm vào danh sách yêu thích.', 'error');
                        return;
                      }
                      setLoadingWish(true);
                      try {
                        await toggleWishlistId(product.id);
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setLoadingWish(false);
                      }
                    }}
                    disabled={loadingWish}
                    className={`p-4 rounded-full border transition-all ${wished ? 'border-[#d94f3d] text-[#d94f3d] bg-[#d94f3d]/5' : 'border-[#e8e8e4] text-slate-600 hover:border-[#d94f3d] hover:text-[#d94f3d]'}`}
                    title="Yêu thích"
                  >
                    {loadingWish ? <Loader2 size={20} className="animate-spin" /> : <Heart size={20} fill={wished ? 'currentColor' : 'none'} />}
                  </button>
                  <button className="p-4 rounded-full border border-[#e8e8e4] hover:border-[#1a6b4a] hover:text-[#1a6b4a] transition-all text-slate-600">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={async () => {
                for(let i = 0; i < quantity; i++){
                  const finishOption = activeVariant ? (activeVariant.color || activeVariant.finish || activeVariant.sku) : undefined;
                  // Nếu dùng context thay vì function thô thì có thể await
                  onAddToCart(product, finishOption, activeVariant?.id);
                }
              }}
              className="w-full bg-[#1a6b4a] text-white py-5 rounded-sm font-bold text-sm uppercase tracking-widest hover:bg-[#0f4530] transition-colors mb-12 shadow-md"
            >
              Thêm Vào Giỏ Hàng
            </button>

            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-[#e8e8e4]">
              <div className="flex items-start gap-4">
                <div className="text-[#1a6b4a] mt-1"><Truck size={20} /></div>
                <div>
                  <h5 className="text-sm font-bold mb-1 text-[#1a1a1a]">Miễn Phí Vận Chuyển</h5>
                  <p className="text-xs text-slate-500">Cho đơn hàng trên 5.000.000đ</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-[#1a6b4a] mt-1"><Shield size={20} /></div>
                <div>
                  <h5 className="text-sm font-bold mb-1 text-[#1a1a1a]">Bảo Hành 24 Tháng</h5>
                  <p className="text-xs text-slate-500">Đảm bảo cấu trúc & chất lượng</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <h2 className="text-xl font-bold uppercase tracking-widest mb-12 text-[#1a1a1a] pb-4 border-b border-[#e8e8e4]">Gợi Ý Kết Hợp</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {recommendations.map((p) => (
                <ProductCard key={p.id} product={p} onAddToCart={(p) => onAddToCart(p)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
