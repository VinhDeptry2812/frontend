import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, Package, PackageX, Search, Filter, DollarSign, ArrowUpDown, X, Upload, Eye, ChevronLeft, ChevronRight, Calendar, Tag, Layers, Boxes, Percent } from 'lucide-react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';

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

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [categoriesList, setCategoriesList] = useState<{ id: string | number, name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const { showNotification } = useNotification();
  const { t, language } = useLanguage();

  // Pagination State
  const [cursorHistory, setCursorHistory] = useState<string[]>(['']);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // CRUD State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [currentProduct, setCurrentProduct] = useState<ProductData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_price: '',
    sale_price: '',
    sku: '',
    category_id: '',
    image: null as File | null
  });

  // Hàm Get chuẩn
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

      if (cursorToFetch) {
        params.cursor = cursorToFetch;
      }

      const response = await api.get('/products', { params });

      // Chống rủi ro lỗi cấu trúc do Backend hay thay đổi Format JSON (Pagination, Wrappers...)
      let data = [];
      if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
        data = response.data.data.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        data = response.data.data;
      } else if (response.data?.products && Array.isArray(response.data.products)) {
        data = response.data.products;
      } else if (Array.isArray(response.data)) {
        data = response.data;
      }

      // Vòng lặp lấy Variants để tính số tồn kho chuẩn
      const productsWithVariants = await Promise.all(
        data.map(async (prd: ProductData) => {
          try {
            const prdId = prd.id || prd.sku || prd._id;
            const varRes = await api.get(`/products/${prdId}/variants`);
            prd.variants = Array.isArray(varRes.data) ? varRes.data : (varRes.data?.data || []);
            return prd;
          } catch (e) {
            return prd;
          }
        })
      );

      setProducts(productsWithVariants);

      // Lưu trữ Next Cursor
      let nextC = response.data?.next_cursor || null;
      if (!nextC && response.data?.next_page_url) {
        try {
          nextC = new URL(response.data.next_page_url).searchParams.get('cursor');
        } catch (e) { }
      }
      setNextCursor(nextC);

    } catch (error: any) {
      console.error("Lỗi lấy danh sách sản phẩm:", error);
      showNotification("Không thể tải danh sách sản phẩm. " + (error.response?.data?.message || ""), "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data) {
        // Backend có thể trả về mảng trực tiếp hoặc bọc trong thuộc tính data
        setCategoriesList(Array.isArray(res.data) ? res.data : (res.data.data || []));
      }
    } catch (err) {
      console.error("Không tải được danh mục:", err);
    }
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

  const openCreateModal = () => {
    setModalMode('create');
    setCurrentProduct(null);
    setFormData({ name: '', description: '', base_price: '', sale_price: '', sku: '', category_id: '', image: null });
    setIsModalOpen(true);
  };

  const openEditModal = (prd: ProductData) => {
    setModalMode('edit');
    setCurrentProduct(prd);
    setFormData({
      name: prd.name || '',
      description: prd.description || '',
      base_price: prd.base_price?.toString() || '',
      sale_price: prd.sale_price?.toString() || '',
      sku: prd.sku || '',
      category_id: typeof prd.category === 'object' ? prd.category.id?.toString() : prd.category?.toString() || '',
      image: null
    });
    setIsModalOpen(true);
  };

  const openViewModal = async (prd: ProductData) => {
    try {
      setLoading(true);
      const prdId = getProductId(prd);
      const response = await api.get(`/products/${prdId}`);
      const detailedPrd = response.data?.data || response.data?.product || response.data;
      if (detailedPrd) {
        setCurrentProduct(detailedPrd);
      } else {
        setCurrentProduct(prd);
      }
      setModalMode('view');
      setIsModalOpen(true);
    } catch (error) {
      console.error("Lỗi lấy chi tiết sản phẩm:", error);
      setCurrentProduct(prd);
      setModalMode('view');
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        const payload = new FormData();
        payload.append('name', formData.name);
        if (formData.description) payload.append('description', formData.description);
        payload.append('base_price', formData.base_price.toString());
        if (formData.sale_price) payload.append('sale_price', formData.sale_price.toString());
        if (formData.sku) payload.append('sku', formData.sku);
        payload.append('category_id', formData.category_id.toString());
        if (formData.image) payload.append('image', formData.image);

        await api.post('/products/create', payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showNotification('Thêm sản phẩm thành công!', 'success');
      } else if (modalMode === 'edit' && currentProduct) {
        const payload = new FormData();
        payload.append('_method', 'PUT'); // Xử lý cập nhật file cho Laravel
        payload.append('name', formData.name);
        if (formData.description) payload.append('description', formData.description);
        payload.append('base_price', formData.base_price.toString());
        payload.append('category_id', formData.category_id.toString());
        if (formData.image) payload.append('image', formData.image);

        const prdId = getProductId(currentProduct);
        await api.post(`/products/${prdId}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showNotification('Cập nhật sản phẩm thành công!', 'success');
      }
      closeModal();
      fetchProducts();
    } catch (error: any) {
      console.error("Lỗi lưu sản phẩm:", error);
      showNotification("Có lỗi xảy ra: " + (error.response?.data?.message || error.message), 'error');
    }
  };

  const handleDelete = async (prd: ProductData) => {
    const prdId = getProductId(prd);
    const confirmMsg = language === 'vi'
      ? `Bạn có chắc muốn xóa sản phẩm ${prd.name}? Hành động này không thể hoàn tác.`
      : `Are you sure you want to delete ${prd.name}? This action cannot be undone.`;
    if (window.confirm(confirmMsg)) {
      try {
        await api.delete(`/products/${prdId}`);
        showNotification('Xóa sản phẩm thành công!', 'success');
        fetchProducts();
      } catch (error: any) {
        console.error("Lỗi xóa sản phẩm:", error);
        showNotification("Không thể xóa sản phẩm: " + (error.response?.data?.message || error.message), 'error');
      }
    }
  };

  const getProductId = (p: ProductData) => p.id || p._id || p.sku;

  const getProductStock = (p: ProductData) => {
    // Ưu tiên tính tổng hàng tồn kho từ mảng variations sau khi fetch từ API `/products/{id}/variants`
    if (p.variants && Array.isArray(p.variants) && p.variants.length > 0) {
      return p.variants.reduce((sum, v) => sum + Number(v.stock_quantity || v.stock || v.quantity || 0), 0);
    }
    return Number(p.stock !== undefined ? p.stock : (p.quantity || 0));
  };

  const getProductPrice = (p: ProductData) => p.sale_price || p.base_price || p.price || 0;

  const getProductCategory = (p: ProductData) => {
    // Trích xuất tên Category nếu Backend trả về mảng Object lồng (Nested Object)
    if (p.category && typeof p.category === 'object') return p.category.name;
    return p.category_name || p.category_id || '---';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '---';
    try {
      return new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(dateString));
    } catch (e) {
      return dateString;
    }
  };

  const calculateDiscount = (base?: number, sale?: number) => {
    if (!base || !sale || sale >= base) return null;
    const percent = Math.round(((base - sale) / base) * 100);
    return percent;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative min-h-[60vh] font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t('nav_products')}</h2>
          <p className="text-slate-400 text-sm mt-1">{t('product_management')} ({products.length} {t('total_col').toLowerCase()})</p>
        </div>
        <button onClick={openCreateModal} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-sm shrink-0">
          <Plus size={18} />
          {t('add_product')}
        </button>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder={language === 'vi' ? "Tìm theo tên hoặc mã SKU..." : "Search by name or SKU..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchProducts('', true)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-400 text-slate-900 shadow-sm"
            />
          </div>
          <div className="relative sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Filter size={18} />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-700 appearance-none cursor-pointer shadow-sm"
            >
              <option value="">{t('all_categories')}</option>
              {categoriesList.map((cat, idx) => (
                <option key={idx} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <DollarSign size={16} />
              </div>
              <input type="number" placeholder={t('min_price') || 'Giá tối thiểu'} value={minPrice} onChange={e => setMinPrice(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchProducts()} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-900 placeholder:text-slate-400 shadow-sm" />
            </div>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <DollarSign size={16} />
              </div>
              <input type="number" placeholder={t('max_price') || 'Giá tối đa'} value={maxPrice} onChange={e => setMaxPrice(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchProducts()} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-900 placeholder:text-slate-400 shadow-sm" />
            </div>
          </div>
          <div className="relative sm:w-48">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <ArrowUpDown size={16} />
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-700 appearance-none cursor-pointer shadow-sm">
              <option value="created_at">{t('latest_system_update') || 'Mới nhất'}</option>
              <option value="base_price">{t('price')}</option>
              <option value="name">{t('full_name') || 'Theo tên'}</option>
            </select>
          </div>
          <div className="relative sm:w-32">
            <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-700 appearance-none cursor-pointer shadow-sm">
              <option value="desc">{t('descending') || 'Giảm dần'}</option>
              <option value="asc">{t('ascending') || 'Tăng dần'}</option>
            </select>
          </div>
          <button onClick={() => fetchProducts('', true)} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-600 transition-all text-sm whitespace-nowrap shadow-sm">
            {t('filter_results') || 'Lọc kết quả'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 flex-col gap-4 text-slate-400">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-slate-400">Đang đồng bộ dữ liệu kho...</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 font-semibold rounded-l-xl">SKU</th>
                  <th className="px-4 py-3 font-semibold">{t('product_name')}</th>
                  <th className="px-4 py-3 font-semibold">{t('category')}</th>
                  <th className="px-4 py-3 font-semibold">{t('price')}</th>
                  <th className="px-4 py-3 font-semibold">{t('stock')}</th>
                  <th className="px-4 py-3 font-semibold text-right rounded-r-xl">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-50">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-slate-400">
                      <PackageX size={48} className="mx-auto mb-4 opacity-40" />
                      {t('no_products_found')}
                    </td>
                  </tr>
                ) : (
                  products.map((prd) => {
                    const stock = getProductStock(prd);
                    return (
                      <tr key={prd.id || prd.sku || prd._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-4 font-bold text-primary text-xs uppercase">{prd.sku || '---'}</td>
                        <td className="px-4 py-4 font-semibold text-slate-900">{prd.name}</td>
                        <td className="px-4 py-4 text-slate-500">{getProductCategory(prd)}</td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            {prd.sale_price ? (
                              <>
                                <span className="text-primary font-bold text-sm">
                                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prd.sale_price)}
                                </span>
                                <span className="text-slate-400 text-xs line-through">
                                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prd.base_price || 0)}
                                </span>
                              </>
                            ) : (
                              <span className="text-slate-900 font-bold text-sm">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prd.base_price || 0)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${stock > 10 ? 'bg-emerald-50 text-emerald-700' :
                              stock > 0 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'
                            }`}>
                            {stock > 0 ? `${stock} ${t('available')}` : t('out_of_stock_label')}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openViewModal(prd)} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-all text-xs font-bold">
                              <Eye size={13} /> Xem
                            </button>
                            <button onClick={() => openEditModal(prd)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all text-xs font-bold">
                              <Edit2 size={13} /> Sửa
                            </button>
                            <button onClick={() => handleDelete(prd)} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all text-xs font-bold">
                              <Trash2 size={13} /> Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {!loading && products.length > 0 && (
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
              <p className="text-sm text-slate-400">
                Trang <span className="text-slate-900 font-bold">{currentPage + 1}</span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === 0
                      ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                >
                  <ChevronLeft size={16} /> {t('back') || 'Quay về'}
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={!nextCursor}
                  className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold transition-all ${!nextCursor
                      ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-blue-600 shadow-sm'
                    }`}
                >
                  {t('next') || 'Trang tiếp'} <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {modalMode === 'create' ? 'Thêm Sản Phẩm Mới' : modalMode === 'edit' ? 'Cập Nhật Sản Phẩm' : 'Chi Tiết Sản Phẩm'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            {modalMode === 'view' && currentProduct ? (
              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                {/* Header Information */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3">
                    {currentProduct.image ? (
                      <img 
                        src={currentProduct.image} 
                        alt={currentProduct.name} 
                        className="w-full h-48 object-cover rounded-2xl border border-slate-200 shadow-sm" 
                      />
                    ) : (
                      <div className="w-full h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-2">
                        <Package size={40} strokeWidth={1} />
                        <span className="text-xs">Không có hình ảnh</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">ID: {currentProduct.id || '---'}</span>
                      {currentProduct.sku && (
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-primary/10 text-primary rounded-md">SKU: {currentProduct.sku}</span>
                      )}
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 leading-tight">{currentProduct.name}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{currentProduct.description || "Chưa có mô tả chi tiết."}</p>
                    <div className="flex items-center gap-2 pt-2">
                       <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
                         <Calendar size={12} /> Tạo: {formatDate(currentProduct.created_at)}
                       </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Price Card */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 scale-150 transition-all">
                      <DollarSign size={40} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Giá niêm yết</p>
                    <div className="space-y-1">
                      <p className={`font-black text-xl ${currentProduct.sale_price ? 'text-slate-400 line-through text-sm' : 'text-slate-900'}`}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentProduct.base_price || 0)}
                      </p>
                      {currentProduct.sale_price && (
                        <div className="flex items-center gap-2">
                           <p className="text-primary font-black text-xl">
                             {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentProduct.sale_price)}
                           </p>
                           <span className="bg-red-50 text-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                             -{calculateDiscount(currentProduct.base_price, currentProduct.sale_price)}%
                           </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stock Card */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 scale-150 transition-all">
                      <Layers size={40} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Quản lý kho</p>
                    <div className="flex items-end gap-2">
                      <p className="text-slate-900 font-black text-2xl">{getProductStock(currentProduct)}</p>
                      <span className="text-xs text-slate-400 mb-1">đơn vị</span>
                    </div>
                    <div className="mt-2 text-[10px] font-bold uppercase flex items-center gap-1">
                       <span className={getProductStock(currentProduct) > 0 ? 'text-emerald-500' : 'text-red-500'}>
                         ● {getProductStock(currentProduct) > 0 ? 'Còn hàng' : 'Hết hàng'}
                       </span>
                    </div>
                  </div>

                  {/* Category Card */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 scale-150 transition-all">
                      <Tag size={40} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Phân loại</p>
                    <p className="text-slate-900 font-bold text-sm truncate" title={getProductCategory(currentProduct)}>
                      {getProductCategory(currentProduct)}
                    </p>
                  </div>
                </div>

                {/* Variants List if available */}
                {currentProduct.variants && currentProduct.variants.length > 0 && (
                  <div className="pt-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1 flex items-center gap-2">
                      <Boxes size={14} className="text-primary" />
                      Danh sách biến thể ({currentProduct.variants.length})
                    </p>
                    <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100/50 text-slate-500 border-b border-slate-100">
                          <tr>
                            <th className="px-4 py-2 font-bold uppercase">Thuộc tính</th>
                            <th className="px-4 py-2 font-bold uppercase">SKU</th>
                            <th className="px-4 py-2 font-bold uppercase">Giá tùy chỉnh</th>
                            <th className="px-4 py-2 font-bold uppercase text-right">Tồn kho</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {currentProduct.variants.map((v: any, idx: number) => (
                            <tr key={v.id || idx} className="hover:bg-slate-100 transition-colors">
                              <td className="px-4 py-3 font-semibold text-slate-700">
                                {v.color || v.size || v.name || 'Mặc định'}
                              </td>
                              <td className="px-4 py-3 text-slate-400 font-mono italic">
                                {v.sku || '---'}
                              </td>
                              <td className="px-4 py-3 font-bold text-slate-900">
                                {v.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v.price) : 'Dùng giá gốc'}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className={`font-bold ${v.stock <= 5 ? 'text-orange-500' : 'text-slate-900'}`}>
                                  {v.stock || v.quantity || 0}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <form id="productForm" onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">{t('product_name')} *</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-slate-600 mb-1.5">{t('price')} *</label>
                    <input required type="number" value={formData.base_price} onChange={e => setFormData({ ...formData, base_price: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" placeholder="0" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-slate-600 mb-1.5">Sale {t('price')}</label>
                    <input 
                      type="number" 
                      disabled={modalMode === 'edit'}
                      value={formData.sale_price} 
                      onChange={e => setFormData({ ...formData, sale_price: e.target.value })} 
                      className={`w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary shadow-sm ${modalMode === 'edit' ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}`} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">SKU (Mã sản phẩm)</label>
                  <input 
                    type="text" 
                    disabled={modalMode === 'edit'}
                    value={formData.sku} 
                    onChange={e => setFormData({ ...formData, sku: e.target.value })} 
                    className={`w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary shadow-sm ${modalMode === 'edit' ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}`} 
                    placeholder="VD: SFA-001" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">{t('category')} *</label>
                  <select required value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary appearance-none shadow-sm">
                    <option value="" disabled>--- {t('all_categories')} ---</option>
                    {categoriesList.map(cat => (
                      <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">{t('description')}</label>
                  <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Hình ảnh bìa</label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl hover:border-primary/50 hover:bg-blue-50/30 transition-colors cursor-pointer group">
                      <input type="file" accept="image/*" onChange={e => setFormData({ ...formData, image: e.target.files ? e.target.files[0] : null })} className="hidden" />
                      <Upload className="text-slate-400 mb-2 group-hover:text-primary transition-colors" size={28} />
                      <span className="text-sm text-slate-400 font-medium group-hover:text-slate-600">{t('upload_image')}</span>
                      {formData.image && <span className="text-xs text-primary mt-2 font-semibold">{formData.image.name}</span>}
                    </label>
                  </div>
                </div>
              </form>
            )}

            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200">
                {modalMode === 'view' ? t('close') : t('cancel')}
              </button>
              {modalMode !== 'view' && (
                <button type="submit" form="productForm" className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-sm">
                  {modalMode === 'create' ? t('create_product') : t('update_product')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
