import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, ChevronDown, ArrowRight, Loader2 } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';
import { ApiProduct } from '../types';
import { fetchProducts, fetchCategories } from '../services/api';

interface CatalogProps {
  onAddToCart: (product: ApiProduct) => void;
}

const sortOptions = [
  { label: 'Mặc định (Mới nhất)', sortBy: 'created_at', sortOrder: 'desc' },
  { label: 'Giá tăng dần', sortBy: 'base_price', sortOrder: 'asc' },
  { label: 'Giá giảm dần', sortBy: 'base_price', sortOrder: 'desc' },
  { label: 'Tên A-Z', sortBy: 'name', sortOrder: 'asc' },
];

export const Catalog: React.FC<CatalogProps> = ({ onAddToCart }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category_id') || '';
  const searchParam = searchParams.get('search') || '';

  const [activeCategoryId, setActiveCategoryId] = useState<string>(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [activeSortIndex, setActiveSortIndex] = useState(0);

  const [categoryList, setCategoryList] = useState<any[]>([]);

  // Update active category and search when URL changes
  useEffect(() => {
    setActiveCategoryId(categoryParam);
    setSearchQuery(searchParam);
  }, [categoryParam, searchParam]);

  useEffect(() => {
    fetchCategories().then(data => setCategoryList(data)).catch(console.error);
  }, []);

  const CATEGORY_TABS = [
    { name: 'Tất Cả', id: '' },
    ...categoryList.map(c => ({ name: c.name, id: String(c.id) }))
  ];

  const handleCategoryClick = (id: string) => {
    setActiveCategoryId(id);
    if (id) {
       searchParams.set('category_id', id);
    } else {
       searchParams.delete('category_id');
    }
    setSearchParams(searchParams);
  };

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadProducts = async (isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
        setProducts([]);
      } else {
        setLoadingMore(true);
      }

      const sortData = sortOptions[activeSortIndex];
      const params: any = {
        sort_by: sortData.sortBy,
        sort_order: sortData.sortOrder
      };
      
      if (activeCategoryId) params.category_id = activeCategoryId;
      if (searchQuery.trim() !== '') params.search = searchQuery;
      if (isLoadMore && nextCursor) params.cursor = nextCursor;

      const response = await fetchProducts(params);
      
      if (response && response.data) {
        if (isLoadMore) {
          setProducts(prev => [...prev, ...response.data]);
        } else {
          setProducts(response.data);
        }
        setNextCursor(response.next_cursor || null);
      }
    } catch (err: any) {
      console.error('Error fetching products:', err);
      // Determine error specific message
      const msg = err.response?.data?.message || err.message || JSON.stringify(err);
      setError(`Không thể tải dữ liệu: ${msg}`);
    } finally {
      if (!isLoadMore) setLoading(false);
      setLoadingMore(false);
    }
  };

  // Re-fetch when filters change
  useEffect(() => {
    const delayDebounceTimeout = setTimeout(() => {
      loadProducts();
    }, 400); // debounce search query

    return () => clearTimeout(delayDebounceTimeout);
  }, [activeCategoryId, searchQuery, activeSortIndex]);

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf9' }}>
      {/* Page Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #efefed', padding: '32px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#aaa', marginBottom: 12 }}>
            <a href="/" style={{ color: '#aaa', textDecoration: 'none' }}>Trang Chủ</a>
            <span>/</span>
            <span style={{ color: '#333' }}>Sản Phẩm</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#1a6b4a', display: 'block', marginBottom: 6 }}>
                Cửa Hàng
              </span>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 600, color: '#1a1a1a', margin: 0 }}>
                {activeCategoryId === '' ? 'Tất Cả Sản Phẩm' : CATEGORY_TABS.find(c => c.id === activeCategoryId)?.name}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: 'white', borderBottom: '1px solid #efefed', padding: '0 24px', position: 'sticky', top: 100, zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, padding: '14px 0' }}>
          {/* Category tabs */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {CATEGORY_TABS.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                style={{
                  padding: '7px 18px',
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  border: '1px solid',
                  borderColor: activeCategoryId === cat.id ? '#1a6b4a' : '#e8e8e4',
                  borderRadius: 2,
                  background: activeCategoryId === cat.id ? '#1a6b4a' : 'white',
                  color: activeCategoryId === cat.id ? 'white' : '#555',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Right: Search + Sort */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={15} style={{ position: 'absolute', left: 12, color: '#aaa' }} />
              <input
                type="text"
                placeholder="Tìm sản phẩm (vd: giường, sofa...)"
                value={searchQuery}
                onChange={e => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  if (val.trim()) {
                    searchParams.set('search', val);
                  } else {
                    searchParams.delete('search');
                  }
                  setSearchParams(searchParams);
                }}
                style={{
                  paddingLeft: 36, paddingRight: 14, paddingTop: 8, paddingBottom: 8,
                  border: '1px solid #e8e8e4', borderRadius: 2, fontSize: 13, color: '#333',
                  background: '#f9f9f7', outline: 'none', width: 220,
                }}
              />
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <select
                value={activeSortIndex}
                onChange={e => setActiveSortIndex(Number(e.target.value))}
                style={{
                  appearance: 'none', padding: '8px 32px 8px 14px', border: '1px solid #e8e8e4',
                  borderRadius: 2, fontSize: 12, fontWeight: 700, color: '#555', background: 'white',
                  cursor: 'pointer', outline: 'none',
                }}
              >
                {sortOptions.map((opt, idx) => <option key={idx} value={idx}>{opt.label}</option>)}
              </select>
              <ChevronDown size={13} style={{ position: 'absolute', right: 10, color: '#aaa', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px 80px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '100px 0', color: '#1a6b4a' }}>
            <Loader2 size={32} className="animate-spin" />
            <p style={{ marginTop: 12, fontSize: 14, color: '#888' }}>Đang tải sản phẩm...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#d94f3d' }}>
            <p>{error}</p>
            <button onClick={() => loadProducts()} style={{ marginTop: 16, padding: '10px 24px', background: '#1a6b4a', color: 'white', border: 'none', borderRadius: 2, cursor: 'pointer' }}>
              Thử Lại
            </button>
          </div>
        ) : products.length > 0 ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {products.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  showBadge={product.sale_price > 0 && product.sale_price < product.base_price ? 'sale' : product.is_featured ? 'new' : null}
                  salePercent={product.base_price > 0 && product.sale_price > 0 ? Math.round((product.base_price - product.sale_price) / product.base_price * 100) : undefined}
                />
              ))}
            </div>
            
            {/* Load More Pagination */}
            {nextCursor && (
               <div style={{ marginTop: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <button 
                  onClick={() => loadProducts(true)}
                  disabled={loadingMore}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: 6, padding: '12px 32px', background: 'transparent', 
                    border: '1px solid #1a6b4a', color: '#1a6b4a', fontSize: 12, fontWeight: 700, 
                    cursor: loadingMore ? 'not-allowed' : 'pointer', borderRadius: 2,
                    textTransform: 'uppercase', letterSpacing: '0.1em'
                  }}
                >
                  {loadingMore ? <Loader2 size={16} className="animate-spin" /> : 'Xem thêm'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#aaa' }}>
            <p style={{ fontSize: 18, fontFamily: "'Cormorant Garamond', serif" }}>Không tìm thấy sản phẩm phù hợp</p>
            <button
              onClick={() => { handleCategoryClick(''); setSearchQuery(''); }}
              style={{ marginTop: 16, padding: '10px 24px', background: '#1a6b4a', color: 'white', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', borderRadius: 2 }}
            >
              Hủy Bộ Lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
