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

export const AdminProducts: React.FC = () => {
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
        } catch (e) {}
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
    setFormData({ name: '', description: '', base_price: '', sale_price: '', category_id: '', image: null });
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
      category_id: typeof prd.category === 'object' ? prd.category.id?.toString() : prd.category?.toString() || '',
      image: null
    });
    setIsModalOpen(true);
  };

  const openViewModal = (prd: ProductData) => {
    setModalMode('view');
    setCurrentProduct(prd);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      if (formData.description) payload.append('description', formData.description);
      payload.append('base_price', formData.base_price.toString());
      if (formData.sale_price) payload.append('sale_price', formData.sale_price.toString());
      payload.append('category_id', formData.category_id.toString());
      if (formData.image) payload.append('image', formData.image);

      if (modalMode === 'create') {
        await api.post('/products', payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showNotification('Thêm sản phẩm thành công!', 'success');
      } else if (modalMode === 'edit' && currentProduct) {
        payload.append('_method', 'PUT'); // Xử lý cập nhật file cho Laravel
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
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm ${prd.name}? Hành động này không thể hoàn tác.`)) {
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

  const getProductId = (p: ProductData) => p.sku || p.id || p._id;
  
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
    return p.category || 'Chưa phân loại';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative min-h-[60vh]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Danh sách Sản phẩm</h2>
          <p className="text-slate-400 text-sm mt-1">Điều chỉnh giá, tồn kho và mặt hàng ({products.length} kết quả)</p>
        </div>
        <button onClick={openCreateModal} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-sm shrink-0">
          <Plus size={18} />
          Thêm Sản Phẩm
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
              placeholder="Tìm theo mã hoặc tên sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
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
              <option value="">Tất cả danh mục</option>
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
              <input type="number" placeholder="Giá tối thiểu" value={minPrice} onChange={e => setMinPrice(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchProducts()} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-900 placeholder:text-slate-400 shadow-sm" />
            </div>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <DollarSign size={16} />
              </div>
              <input type="number" placeholder="Giá tối đa" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchProducts()} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-900 placeholder:text-slate-400 shadow-sm" />
            </div>
          </div>
          <div className="relative sm:w-48">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <ArrowUpDown size={16} />
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-700 appearance-none cursor-pointer shadow-sm">
              <option value="created_at">Mới nhất</option>
              <option value="base_price">Theo giá</option>
              <option value="name">Theo tên</option>
            </select>
          </div>
          <div className="relative sm:w-32">
            <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-700 appearance-none cursor-pointer shadow-sm">
              <option value="desc">Giảm dần</option>
              <option value="asc">Tăng dần</option>
            </select>
          </div>
          <button onClick={() => fetchProducts('', true)} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-600 transition-all text-sm whitespace-nowrap shadow-sm">
            Lọc kết quả
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
                <th className="px-4 py-3 font-semibold rounded-l-xl">Mã SP</th>
                <th className="px-4 py-3 font-semibold">Tên Sản Phẩm</th>
                <th className="px-4 py-3 font-semibold">Danh Mục</th>
                <th className="px-4 py-3 font-semibold">Giá bán</th>
                <th className="px-4 py-3 font-semibold">Kho</th>
                <th className="px-4 py-3 font-semibold text-right rounded-r-xl">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-slate-400">
                    <PackageX size={48} className="mx-auto mb-4 opacity-40" />
                    Không tìm thấy sản phẩm nào phù hợp.
                  </td>
                </tr>
              ) : (
                products.map((prd) => {
                  const stock = getProductStock(prd);
                  return (
                    <tr key={prd.id || prd.sku || prd._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-4 text-slate-400 font-mono text-xs max-w-[120px] truncate" title={String(getProductId(prd))}>
                        {getProductId(prd)}
                      </td>
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
                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          stock > 10 ? 'bg-emerald-50 text-emerald-700' : 
                          stock > 0 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'
                        }`}>
                          {stock > 0 ? `${stock} có sẵn` : 'Hết hàng'}
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
                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  currentPage === 0
                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <ChevronLeft size={16} /> Quay về
              </button>
              <button
                onClick={handleNextPage}
                disabled={!nextCursor}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  !nextCursor
                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-blue-600 shadow-sm'
                }`}
              >
                Trang tiếp <ChevronRight size={16} />
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
              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                 {currentProduct.image && (
                    <img src={currentProduct.image} alt={currentProduct.name} className="w-full h-48 object-cover rounded-xl border border-slate-200 shadow-sm" />
                 )}
                 <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">{currentProduct.name}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-wrap">{currentProduct.description || "Chưa có mô tả chi tiết cho sản phẩm này."}</p>
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-center">
                       <p className="text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">Giá bán cơ bản</p>
                       <p className="text-slate-900 font-bold text-lg">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentProduct.base_price || 0)}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-center">
                       <p className="text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">Giá khuyến mãi</p>
                       <p className="text-primary font-bold text-lg">{currentProduct.sale_price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentProduct.sale_price) : 'Không áp dụng'}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-center">
                       <p className="text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">Danh mục phân loại</p>
                       <p className="text-slate-900 font-bold">{getProductCategory(currentProduct)}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-center">
                       <p className="text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">Tổng tồn kho</p>
                       <p className="text-slate-900 font-bold flex items-center gap-2">
                         {getProductStock(currentProduct)} 
                         <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">Sẵn sàng</span>
                       </p>
                    </div>
                 </div>
              </div>
            ) : (
            <form id="productForm" onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Tên sản phẩm *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" placeholder="Nhập tên sản phẩm..." />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Giá bán cơ bản *</label>
                  <input required type="number" value={formData.base_price} onChange={e => setFormData({...formData, base_price: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" placeholder="0" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Giá khuyến mãi</label>
                  <input type="number" value={formData.sale_price} onChange={e => setFormData({...formData, sale_price: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" placeholder="Bỏ trống nếu không có" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Danh mục *</label>
                <select required value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary appearance-none shadow-sm">
                  <option value="" disabled>--- Chọn danh mục ---</option>
                  {categoriesList.map(cat => (
                    <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Mô tả chi tiết</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" placeholder="Mô tả sản phẩm..." />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Hình ảnh bìa</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl hover:border-primary/50 hover:bg-blue-50/30 transition-colors cursor-pointer group">
                    <input type="file" accept="image/*" onChange={e => setFormData({...formData, image: e.target.files ? e.target.files[0] : null})} className="hidden" />
                    <Upload className="text-slate-400 mb-2 group-hover:text-primary transition-colors" size={28} />
                    <span className="text-sm text-slate-400 font-medium group-hover:text-slate-600">Nhấp để chọn ảnh lên (Để trống nếu ko đổi)</span>
                    {formData.image && <span className="text-xs text-primary mt-2 font-semibold">{formData.image.name}</span>}
                  </label>
                </div>
              </div>
            </form>
            )}

            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200">
                {modalMode === 'view' ? 'Đóng' : 'Hủy bỏ'}
              </button>
              {modalMode !== 'view' && (
                <button type="submit" form="productForm" className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-sm">
                  {modalMode === 'create' ? 'Tạo Sản Phẩm' : 'Lưu Thay Đổi'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
