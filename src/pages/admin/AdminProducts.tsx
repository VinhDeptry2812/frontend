import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, PackageX, Search, Filter, DollarSign, ArrowUpDown, X, Upload, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export interface ProductData {
  _id?: string | number;
  id?: string | number;
  name: string;
  price?: number | string;
  base_price?: number;
  sale_price?: number;
  stock?: number;
  quantity?: number;
  sku?: string;
  is_active?: boolean;
  category?: any;
  variants?: any[];
  [key: string]: any;
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [categoriesList, setCategoriesList] = useState<{id: string | number, name: string}[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const { showNotification } = useNotification();

  const [cursorHistory, setCursorHistory] = useState<string[]>(['']);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [currentProduct, setCurrentProduct] = useState<ProductData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_price: '',
    sale_price: '',
    category_id: '',
    image: null as File | null
  });

  const fetchProducts = async (cursorToFetch: string = cursorHistory[currentPage] || '', isReset: boolean = false) => {
    try {
      if (isReset) {
        cursorToFetch = '';
        setCurrentPage(0);
        setCursorHistory(['']);
      }
      setLoading(true);
      const params: any = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedCategory) params.category_id = selectedCategory;
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;
      if (sortBy) params.sort_by = sortBy;
      if (sortOrder) params.sort_order = sortOrder;
      if (cursorToFetch) params.cursor = cursorToFetch;

      const response = await api.get('/products', { params });
      let data = Array.isArray(response.data) ? response.data : (response.data?.data || response.data?.products || []);
      if (!Array.isArray(data) && response.data?.data?.data) data = response.data.data.data;
      
      setProducts(data);
      setNextCursor(response.data?.next_cursor || null);
    } catch (error: any) {
      showNotification("Không thể tải danh sách sản phẩm", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategoriesList(Array.isArray(res.data) ? res.data : (res.data?.data || []));
    } catch (err) {}
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleNextPage = () => {
    if (nextCursor) {
      const newPage = currentPage + 1;
      const newHistory = [...cursorHistory];
      newHistory[newPage] = nextCursor;
      setCursorHistory(newHistory);
      setCurrentPage(newPage);
      fetchProducts(nextCursor);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchProducts(cursorHistory[newPage]);
    }
  };

  const getProductId = (p: ProductData) => p.sku || p.id || p._id;

  return (
    <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm min-h-[60vh]">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold dark:text-white">Danh Sách Sản Phẩm</h2>
          <p className="text-slate-400 text-sm mt-1">Quản lý kho hàng ({products.length} sản phẩm)</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-blue-600 transition-all">
          + Thêm sản phẩm
        </button>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" placeholder="Tìm tên hoặc mã sản phẩm..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 flex-col gap-3 text-slate-400">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-gray-900/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 font-semibold">Tên sản phẩm</th>
                <th className="px-4 py-3 font-semibold">Giá bán</th>
                <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 dark:divide-gray-700">
              {products.length === 0 ? (
                <tr><td colSpan={3} className="py-20 text-center text-slate-400 font-bold opacity-30">Ối! Không có sản phẩm nào.</td></tr>
              ) : (
                products.map((prd) => (
                  <tr key={String(getProductId(prd))} className="hover:bg-slate-50 dark:hover:bg-gray-900/40 transition-colors">
                    <td className="px-4 py-4 font-bold dark:text-white">{prd.name}</td>
                    <td className="px-4 py-4 dark:text-slate-300">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prd.sale_price || prd.base_price || 0)}
                    </td>
                    <td className="px-4 py-4 text-right">
                       <button className="text-primary font-bold hover:underline">Sửa</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && products.length > 0 && (
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100 dark:border-gray-700">
           <button onClick={handlePrevPage} disabled={currentPage === 0} className="px-4 py-2 bg-slate-100 dark:bg-gray-700 rounded-lg text-sm font-bold disabled:opacity-30 flex items-center gap-1">
             <ChevronLeft size={16} /> Trước
           </button>
           <span className="text-sm dark:text-slate-400">Trang {currentPage + 1}</span>
           <button onClick={handleNextPage} disabled={!nextCursor} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold disabled:opacity-30 flex items-center gap-1">
             Tiếp <ChevronRight size={16} />
           </button>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
