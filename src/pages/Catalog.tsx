import { motion } from "motion/react";
import { ChevronRight, Filter, ChevronDown, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import api from "../services/api";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: {
    name: string;
  };
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Intersection Observer hook
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px" // Bắt đầu load trước khi cuộn tới 200px
  });

  const fetchProducts = useCallback(async (cursor: string | null = null) => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      // Gửi cursor nếu có để lấy trang tiếp theo
      const url = cursor ? `/products?cursor=${cursor}` : '/products';
      const response = await api.get(url);

      const responseData = response.data;
      const newProducts = Array.isArray(responseData) ? responseData : (responseData.data || []);
      const nextPageUrl = responseData.next_page_url;

      setProducts(prev => {
        // Tránh bị lặp dữ liệu do React StrictMode gọi 2 lần
        const existingIds = new Set(prev.map(p => p.id));
        const filteredNewProducts = newProducts.filter((p: Product) => !existingIds.has(p.id));
        return [...prev, ...filteredNewProducts];
      });

      // Lấy cursor từ next_page_url
      if (nextPageUrl) {
        const urlParams = new URLSearchParams(nextPageUrl.split('?')[1]);
        setNextCursor(urlParams.get('cursor'));
      } else {
        setHasMore(false);
        setNextCursor(null);
      }
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore]);

  // Load trang đầu tiên khi mount
  useEffect(() => {
    setProducts([]);
    setNextCursor(null);
    setHasMore(true);
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy 1 lần lúc mount

  // Load trang tiếp theo khi cuộn tới cuối
  useEffect(() => {
    if (inView && hasMore && !isLoading && nextCursor) {
      fetchProducts(nextCursor);
    }
  }, [inView, hasMore, isLoading, nextCursor, fetchProducts]);

  return (
    <div className="pt-32 pb-24 bg-paper min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 micro-label text-slate-400 mb-12">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-primary cursor-pointer">Furniture</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-espresso font-bold">All Products</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 shrink-0 hidden md:block">
            <div className="sticky top-32 space-y-12">
              <div>
                <h3 className="editorial-title text-2xl font-bold border-b border-primary/20 pb-6 mb-8 uppercase tracking-wider">Filters</h3>

                <div className="mb-10">
                  <p className="micro-label mb-6">Categories</p>
                  <div className="space-y-4">
                    {["Sofas", "Chairs", "Tables", "Beds"].map((item) => (
                      <label key={item} className="flex items-center gap-4 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="rounded-none border-primary/30 text-primary focus:ring-primary h-4 w-4"
                        />
                        <span className="font-body text-sm group-hover:text-primary transition-colors">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Listing Area */}
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row justify-between items-baseline gap-6 mb-16">
              <div>
                <h2 className="editorial-title text-5xl md:text-6xl font-bold mb-4">Collection</h2>
                <p className="font-serif text-slate-500 italic text-lg">Khám phá bộ sưu tập nội thất cao cấp.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer"
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="relative aspect-[4/5] overflow-hidden bg-primary/5 mb-8">
                      <img
                        src={product.image_url ? `https://tttn-1.onrender.com/storage/${product.image_url}` : 'https://placehold.co/400x500?text=No+Image'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="editorial-title text-2xl mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                        <p className="micro-label text-slate-400">{product.category?.name || 'Uncategorized'}</p>
                      </div>
                      <span className="text-xl font-bold text-primary">${product.price}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Infinite Scroll Loader & Sentinel */}
            <div
              ref={ref}
              className="mt-20 flex justify-center items-center h-24"
            >
              {isLoading && (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="micro-label text-slate-500">Đang tải thêm sản phẩm...</p>
                </div>
              )}

              {!hasMore && products.length > 0 && (
                <div className="text-center py-10 border-t border-primary/10 w-full mt-10">
                  <p className="font-display text-xl text-espresso mb-2">You've seen it all</p>
                  <p className="micro-label text-slate-500">Hãy quay lại sau để xem thêm các mẫu mới.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

