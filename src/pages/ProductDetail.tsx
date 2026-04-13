import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, Share2, Minus, Plus, ShoppingBag, Shield, Truck, Star, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { getProductById, getProducts } from '../services/products';
import { Product, ProductVariant } from '../types';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  const { addItem } = useCart();
  const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlist();
  const { showNotification } = useNotification();
  const { user } = useAuth();
  const { openAuthModal } = useAuthModal();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProductById(id)
      .then(res => {
        const prod: Product = res.data?.data || res.data;
        setProduct(prod);
        if (prod.variants?.length > 0) {
          const firstAvail = prod.variants.find(v => v.is_available) || prod.variants[0];
          setSelectedVariant(firstAvail);
        }
        // Load related
        getProducts({ category_id: prod.category_id }).then(relRes => {
          const allProds: Product[] = relRes.data?.data || [];
          setRelated(allProds.filter(p => p.id !== prod.id).slice(0, 4));
        });
      })
      .catch(() => {
        showNotification('Không tìm thấy sản phẩm', 'error');
        navigate('/catalog');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      await addItem(product.id, selectedVariant?.id ?? null, quantity);
      showNotification(`Đã thêm "${product.name}" vào giỏ hàng`, 'success');
    } catch (err: any) {
      showNotification(err.message || 'Không thể thêm vào giỏ hàng', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    if (!product) return;

    if (!user) {
      openAuthModal('Vui lòng đăng nhập để lưu sản phẩm vào danh sách yêu thích');
      return;
    }

    const inWishlist = isInWishlist(product.id);
    try {
      if (inWishlist) {
        await removeWishlist(product.id);
        showNotification('Đã xóa khỏi danh sách yêu thích', 'success');
      } else {
        await addWishlist(product.id);
        showNotification('Đã thêm vào danh sách yêu thích ❤️', 'success');
      }
    } catch (err: any) {
      showNotification(err.message || 'Đã có lỗi xảy ra', 'error');
    }
  };

  if (loading) {
    return (
      <div className="pt-28 md:pt-36 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-4">
            <div className="skeleton aspect-[4/3] rounded-2xl" />
            <div className="grid grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton aspect-square rounded-xl" />)}
            </div>
          </div>
          <div className="space-y-4">
            <div className="skeleton h-4 w-1/4" />
            <div className="skeleton h-10 w-3/4" />
            <div className="skeleton h-6 w-1/3" />
            <div className="skeleton h-24 w-full" />
            <div className="skeleton h-14 w-full rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const displayPrice = selectedVariant?.price ?? product.sale_price ?? product.base_price;
  const hasDiscount = product.sale_price && product.sale_price < product.base_price;
  const discountPct = hasDiscount ? Math.round(((product.base_price - (product.sale_price || 0)) / product.base_price) * 100) : 0;
  const inWishlist = isInWishlist(product.id);

  // Build image list
  const images = [
    product.image_url,
    ...(product.variants || []).map(v => v.image_url).filter(Boolean),
  ].filter(Boolean).slice(0, 5);

  const activeImage = images[activeImageIdx] || product.image_url;

  return (
    <div className="pt-28 md:pt-36 pb-24 bg-bg-ivory">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-muted mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link to="/catalog" className="hover:text-primary transition-colors">Sản phẩm</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link to={`/catalog?category_id=${product.category_id}`} className="hover:text-primary transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-text-dark font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* ===== IMAGES ===== */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-white shadow-sm mb-4"
            >
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {hasDiscount && (
                <div className="absolute top-4 left-4 badge-sale text-sm px-3 py-1">
                  -{discountPct}%
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIdx(p => (p - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 glass-card rounded-full flex items-center justify-center text-text-dark hover:bg-white transition-colors shadow-sm"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setActiveImageIdx(p => (p + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 glass-card rounded-full flex items-center justify-center text-text-dark hover:bg-white transition-colors shadow-sm"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </motion.div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIdx === i ? 'border-primary ring-2 ring-primary/20' : 'border-stone-100 hover:border-stone-300'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===== PRODUCT INFO ===== */}
          <div>
            {product.category && (
              <Link to={`/catalog?category_id=${product.category_id}`} className="section-label hover:text-primary-dark">
                {product.category.name}
              </Link>
            )}

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-text-dark leading-tight mt-2 mb-3">
              {product.name}
            </h1>

            {product.brand && (
              <p className="text-sm text-text-muted mb-4">Thương hiệu: <span className="font-semibold text-text-dark">{product.brand}</span></p>
            )}

            {/* Price */}
            <div className="flex items-end gap-3 mb-6">
              <span className="font-serif text-3xl font-bold text-primary">{formatPrice(displayPrice)}</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-text-muted line-through">{formatPrice(product.base_price)}</span>
                  <span className="badge-sale text-sm">-{discountPct}%</span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-text-muted leading-relaxed mb-6 text-sm">{product.description}</p>
            )}

            {/* Material */}
            {product.material && (
              <div className="flex items-center gap-2 text-sm mb-6">
                <span className="font-semibold text-text-dark">Chất liệu:</span>
                <span className="text-text-muted">{product.material}</span>
              </div>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-3">Phiên bản</h4>
                <div className="space-y-2">
                  {product.variants.map(variant => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={!variant.is_available}
                      className={`w-full text-left p-3 rounded-xl border-2 transition-all text-sm ${
                        selectedVariant?.id === variant.id
                          ? 'border-primary bg-bg-blue-light'
                          : variant.is_available
                            ? 'border-stone-200 hover:border-stone-300'
                            : 'border-stone-100 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {selectedVariant?.id === variant.id && (
                            <Check size={14} className="text-primary flex-shrink-0" />
                          )}
                          <span className="font-medium text-text-dark">
                            {[variant.color, variant.size].filter(Boolean).join(' · ')}
                          </span>
                          {variant.finish && (
                            <span className="text-text-muted text-xs">| {variant.finish}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-primary">{formatPrice(variant.price)}</span>
                          {!variant.is_available && (
                            <span className="text-xs text-red-500">Hết hàng</span>
                          )}
                          {variant.is_available && variant.stock_quantity <= 5 && (
                            <span className="text-xs text-orange-500">Còn {variant.stock_quantity}</span>
                          )}
                        </div>
                      </div>
                      {variant.wood_type && (
                        <div className="text-xs text-text-muted mt-0.5 pl-5">
                          Gỗ: {variant.wood_type}
                          {variant.width_cm && ` · Kích thước: ${variant.width_cm}×${variant.depth_cm}×${variant.height_cm} cm`}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Actions */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3 border-2 border-stone-200 rounded-full px-4 py-2">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-1 hover:bg-stone-100 rounded-full transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="text-lg font-bold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-1 hover:bg-stone-100 rounded-full transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleWishlist}
                className={`p-3 rounded-full border-2 transition-all ${
                  inWishlist ? 'border-red-400 text-red-500 bg-red-50' : 'border-stone-200 text-text-muted hover:border-red-300 hover:text-red-400'
                }`}
              >
                <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  showNotification('Đã sao chép link sản phẩm', 'success');
                }}
                className="p-3 rounded-full border-2 border-stone-200 text-text-muted hover:border-primary hover:text-primary transition-all"
              >
                <Share2 size={20} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addingToCart || (selectedVariant !== null && !selectedVariant?.is_available)}
              className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-base rounded-xl mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {addingToCart ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Đang thêm...</>
              ) : (
                <><ShoppingBag size={20} /> Thêm vào giỏ hàng</>
              )}
            </button>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-stone-100">
              <div className="flex items-start gap-3">
                <Truck size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-text-dark">Giao hàng miễn phí</p>
                  <p className="text-xs text-text-muted">Lắp đặt tận nơi</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-text-dark">Bảo hành 5 năm</p>
                  <p className="text-xs text-text-muted">Đảm bảo kết cấu</p>
                </div>
              </div>
            </div>

            {/* SKU */}
            <p className="text-xs text-text-muted mt-4">
              SKU: <span className="font-mono">{selectedVariant?.sku || product.sku || ''}</span>
            </p>
          </div>
        </div>

        {/* ===== DETAILED SPECS & DESCRIPTION ===== */}
        <div className="bg-white rounded-2xl p-8 border border-stone-100 shadow-sm mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h3 className="font-serif text-2xl font-bold text-text-dark mb-6">Mô tả sản phẩm</h3>
              <div className="text-text-muted leading-relaxed space-y-4 text-sm md:text-base">
                {product.description?.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                )) || <p>Chưa có mô tả cho sản phẩm này.</p>}
              </div>

              {product.brand && (
                <div className="mt-8 pt-8 border-t border-stone-100">
                  <h4 className="font-semibold text-text-dark mb-2">Thương hiệu</h4>
                  <p className="text-text-muted">{product.brand}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold text-text-dark mb-6">Thông số kỹ thuật</h3>
              <div className="space-y-4">
                {product.material && (
                  <div className="flex justify-between py-3 border-b border-stone-100">
                    <span className="text-text-muted">Chất liệu chính</span>
                    <span className="font-medium text-text-dark text-right">{product.material}</span>
                  </div>
                )}
                
                {selectedVariant?.color && (
                  <div className="flex justify-between py-3 border-b border-stone-100">
                    <span className="text-text-muted">Màu sắc</span>
                    <span className="font-medium text-text-dark text-right">{selectedVariant.color}</span>
                  </div>
                )}

                {selectedVariant?.size && (
                  <div className="flex justify-between py-3 border-b border-stone-100">
                    <span className="text-text-muted">Kích thước</span>
                    <span className="font-medium text-text-dark text-right">{selectedVariant.size}</span>
                  </div>
                )}

                {(!!selectedVariant?.width_cm || !!selectedVariant?.depth_cm || !!selectedVariant?.height_cm) && (
                  <div className="flex justify-between py-3 border-b border-stone-100">
                    <span className="text-text-muted">D x R x C (cm)</span>
                    <span className="font-medium text-text-dark text-right">
                      {[selectedVariant?.width_cm, selectedVariant?.depth_cm, selectedVariant?.height_cm].filter(Boolean).join(' x ')}
                    </span>
                  </div>
                )}

                {selectedVariant?.weight_kg && (
                  <div className="flex justify-between py-3 border-b border-stone-100">
                    <span className="text-text-muted">Trọng lượng (kg)</span>
                    <span className="font-medium text-text-dark text-right">{selectedVariant.weight_kg}</span>
                  </div>
                )}

                {selectedVariant?.wood_type && (
                  <div className="flex justify-between py-3 border-b border-stone-100">
                    <span className="text-text-muted">Loại gỗ</span>
                    <span className="font-medium text-text-dark text-right">{selectedVariant.wood_type}</span>
                  </div>
                )}

                {selectedVariant?.upholstery && (
                  <div className="flex justify-between py-3 border-b border-stone-100">
                    <span className="text-text-muted">Chất liệu bọc</span>
                    <span className="font-medium text-text-dark text-right">{selectedVariant.upholstery}</span>
                  </div>
                )}

                {selectedVariant?.finish && (
                  <div className="flex justify-between py-3 border-b border-stone-100">
                    <span className="text-text-muted">Hoàn thiện</span>
                    <span className="font-medium text-text-dark text-right">{selectedVariant.finish}</span>
                  </div>
                )}

                {selectedVariant?.seat_height_cm && (
                  <div className="flex justify-between py-3 border-b border-stone-100">
                    <span className="text-text-muted">Chiều cao đệm (cm)</span>
                    <span className="font-medium text-text-dark text-right">{selectedVariant.seat_height_cm}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===== RELATED PRODUCTS ===== */}
        {related.length > 0 && (
          <div>
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="section-label">Gợi ý cho bạn</span>
                <h2 className="section-title">Sản Phẩm Liên Quan</h2>
              </div>
              <Link to={`/catalog?category_id=${product.category_id}`} className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                Xem thêm
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
