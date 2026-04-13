import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, X, Grid3X3, List, ArrowLeft, ArrowRight } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { getProducts } from '../services/products';
import { getCategories } from '../services/categories';
import { Product, Category, ProductFilters } from '../types';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export const Catalog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Cursor-based pagination
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevCursors, setPrevCursors] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(false);

  // Đọc filter từ URL
  const urlSearch = searchParams.get('search') || '';
  const urlCategoryId = searchParams.get('category_id') ? Number(searchParams.get('category_id')) : undefined;
  const urlSortBy = (searchParams.get('sort_by') as any) || 'created_at';
  const urlSortOrder = (searchParams.get('sort_order') as any) || 'desc';
  const urlMinPrice = searchParams.get('min_price') || '';
  const urlMaxPrice = searchParams.get('max_price') || '';
  const urlOnSale = searchParams.get('on_sale') === 'true';

  // Local state cho form filter
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [categoryId, setCategoryId] = useState<number | undefined>(urlCategoryId);
  const [sortBy, setSortBy] = useState<'base_price' | 'name' | 'created_at'>(urlSortBy);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(urlSortOrder);
  const [minPrice, setMinPrice] = useState(urlMinPrice);
  const [maxPrice, setMaxPrice] = useState(urlMaxPrice);
  const [onSale, setOnSale] = useState(urlOnSale);

  // Sync khi URL thay đổi (từ navbar search hoặc navigation)
  const prevUrlSearch = useRef(urlSearch);
  useEffect(() => {
    if (urlSearch !== prevUrlSearch.current) {
      prevUrlSearch.current = urlSearch;
      setSearchInput(urlSearch);
      setPrevCursors([]);
    }
    if (urlCategoryId !== categoryId) {
      setCategoryId(urlCategoryId);
      setPrevCursors([]);
    }
    if (urlOnSale !== onSale) {
      setOnSale(urlOnSale);
      setPrevCursors([]);
    }
  }, [urlSearch, urlCategoryId, urlOnSale]);

  // Load categories
  useEffect(() => {
    getCategories(false).then(res => {
      setCategories(Array.isArray(res.data) ? res.data : []);
    }).catch(() => {});
  }, []);

  // Load products
  const fetchProducts = useCallback(async (cursor?: string) => {
    setLoading(true);
    try {
      const filters: ProductFilters = {
        sort_by: sortBy,
        sort_order: sortOrder,
      };
      const active_search = searchInput.trim() || urlSearch.trim();
      if (active_search) filters.search = active_search;
      if (categoryId) filters.category_id = categoryId;
      if (minPrice) filters.min_price = Number(minPrice);
      if (maxPrice) filters.max_price = Number(maxPrice);
      if (onSale) (filters as any).on_sale = true;
      if (cursor) filters.cursor = cursor;

      const res = await getProducts(filters);
      const data = res.data;
      let newProducts: Product[] = data?.data || [];
      
      // Client-side fallback if API doesn't support on_sale filter
      if (onSale) {
        newProducts = newProducts.filter(p => p.sale_price && p.sale_price < p.base_price);
      }

      setProducts(newProducts);
      setNextCursor(data?.next_cursor || null);
      setHasMore(!!data?.next_cursor);
    } catch (err) {
      console.error('Lỗi tải sản phẩm:', err);
    } finally {
      setLoading(false);
    }
  }, [searchInput, categoryId, sortBy, sortOrder, minPrice, maxPrice, urlSearch]);

  // Re-fetch khi filter thay đổi
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Cập nhật URL khi filter thay đổi
  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchInput) params.search = searchInput;
    if (categoryId) params.category_id = String(categoryId);
    if (sortBy !== 'created_at') params.sort_by = sortBy;
    if (sortOrder !== 'desc') params.sort_order = sortOrder;
    if (minPrice) params.min_price = minPrice;
    if (maxPrice) params.max_price = maxPrice;
    if (onSale) params.on_sale = 'true';
    setSearchParams(params, { replace: true });
  }, [searchInput, categoryId, sortBy, sortOrder, minPrice, maxPrice, onSale]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPrevCursors([]);
    fetchProducts();
  };

  const handleNextPage = () => {
    if (nextCursor) {
      setPrevCursors(p => [...p, nextCursor]);
      fetchProducts(nextCursor);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    const newPrev = [...prevCursors];
    newPrev.pop();
    const cursor = newPrev[newPrev.length - 1];
    setPrevCursors(newPrev);
    fetchProducts(cursor);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setCategoryId(undefined);
    setSortBy('created_at');
    setSortOrder('desc');
    setMinPrice('');
    setMaxPrice('');
    setOnSale(false);
    setPrevCursors([]);
  };

  const hasFilters = !!(searchInput || categoryId || minPrice || maxPrice || sortBy !== 'created_at' || sortOrder !== 'desc');
  const selectedCategory = categories.find(c => c.id === categoryId);
  const pageNumber = prevCursors.length + 1;

  return (
    <div className="pt-28 md:pt-36 pb-24 min-h-screen bg-bg-ivory">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-8">
          <span className="section-label">Cửa hàng</span>
          <h1 className="section-title mb-4">
            {onSale ? 'Sản Phẩm Đang Khuyến Mãi' : selectedCategory ? selectedCategory.name : searchInput ? `Kết quả: "${searchInput}"` : 'Tất Cả Sản Phẩm'}
          </h1>

          {/* Search + Filter Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-y border-stone-200 py-4 mt-4">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={17} />
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Tìm sofa, giường, bàn ăn..."
                className="w-full bg-white border border-stone-200 rounded-full py-2.5 pl-11 pr-10 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
              />
              {searchInput && (
                <button type="button" onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-dark">
                  <X size={16} />
                </button>
              )}
            </form>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Quick Category Tabs */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => { setCategoryId(undefined); setSearchInput(''); setPrevCursors([]); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${!categoryId && !searchInput ? 'bg-primary text-white border-primary' : 'bg-white border-stone-200 text-text-dark hover:border-primary hover:text-primary'}`}
                >
                  Tất cả
                </button>
                {categories.slice(0, 5).map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setCategoryId(cat.id === categoryId ? undefined : cat.id); setSearchInput(''); setPrevCursors([]); }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${categoryId === cat.id ? 'bg-primary text-white border-primary' : 'bg-white border-stone-200 text-text-dark hover:border-primary hover:text-primary'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={e => {
                  const [by, order] = e.target.value.split('-') as ['base_price' | 'name' | 'created_at', 'asc' | 'desc'];
                  setSortBy(by); setSortOrder(order); setPrevCursors([]);
                }}
                className="bg-white border border-stone-200 rounded-full py-2 px-3 text-xs text-text-dark focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none cursor-pointer"
              >
                <option value="created_at-desc">Mới nhất</option>
                <option value="created_at-asc">Cũ nhất</option>
                <option value="base_price-asc">Giá thấp → cao</option>
                <option value="base_price-desc">Giá cao → thấp</option>
                <option value="name-asc">Tên A → Z</option>
              </select>

              <button
                onClick={() => setIsFilterOpen(p => !p)}
                className={`flex items-center gap-1.5 text-xs font-semibold border rounded-full px-3 py-2 transition-all ${hasFilters ? 'bg-primary text-white border-primary' : 'bg-white border-stone-200 text-text-dark hover:border-primary hover:text-primary'}`}
              >
                <SlidersHorizontal size={14} /> Lọc {hasFilters && '✓'}
              </button>

              <div className="hidden md:flex border border-stone-200 rounded-full overflow-hidden">
                <button onClick={() => setViewMode('grid')} className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-muted bg-white hover:text-text-dark'}`}>
                  <Grid3X3 size={14} />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'text-text-muted bg-white hover:text-text-dark'}`}>
                  <List size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-stone-200 p-5 mt-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Danh mục</label>
                  <select
                    value={categoryId || ''}
                    onChange={e => { setCategoryId(e.target.value ? Number(e.target.value) : undefined); setPrevCursors([]); }}
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                  >
                    <option value="">Tất cả danh mục</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Khoảng giá</label>
                  <div className="flex items-center gap-2">
                    <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Từ (đ)" className="flex-1 border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                    <span className="text-text-muted text-sm">—</span>
                    <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Đến (đ)" className="flex-1 border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
                <button onClick={handleClearFilters} className="border-2 border-red-200 text-red-500 font-semibold py-2.5 px-4 rounded-xl hover:bg-red-50 transition-colors text-sm">
                  Xóa bộ lọc
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span className="text-xs text-text-muted">Đang lọc:</span>
            {searchInput && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full font-medium">
                Tìm: "{searchInput}" <button onClick={() => setSearchInput('')}><X size={11} /></button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full font-medium">
                {selectedCategory.name} <button onClick={() => setCategoryId(undefined)}><X size={11} /></button>
              </span>
            )}
            {minPrice && <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full font-medium">Từ {formatPrice(Number(minPrice))} <button onClick={() => setMinPrice('')}><X size={11} /></button></span>}
            {maxPrice && <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full font-medium">Đến {formatPrice(Number(maxPrice))} <button onClick={() => setMaxPrice('')}><X size={11} /></button></span>}

          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="skeleton aspect-[4/3]" />
                <div className="p-4 space-y-2">
                  <div className="skeleton h-3 w-1/3" />
                  <div className="skeleton h-4 w-4/5" />
                  <div className="skeleton h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-bg-warm rounded-full flex items-center justify-center mx-auto mb-5">
              <Search size={32} className="text-text-muted" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-text-dark mb-3">Không tìm thấy sản phẩm</h3>
            <p className="text-text-muted mb-6">Thử thay đổi từ khóa hoặc xóa bộ lọc</p>
            <button onClick={handleClearFilters} className="btn-primary">Xóa bộ lọc</button>
          </div>
        ) : (
          <>
            <p className="text-xs text-text-muted mb-4">Tìm thấy {products.length} sản phẩm (Trang {pageNumber})</p>
            <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
              {products.map(product => <ProductCard key={product.id} product={product} />)}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-12">
              <button onClick={handlePrevPage} disabled={prevCursors.length === 0}
                className="flex items-center gap-2 px-6 py-3 border border-stone-200 rounded-full text-sm font-medium text-text-dark hover:border-primary hover:text-primary bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                <ArrowLeft size={16} /> Trang trước
              </button>
              <span className="text-sm text-text-muted px-3">Trang {pageNumber}</span>
              <button onClick={handleNextPage} disabled={!hasMore}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                Trang sau <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
