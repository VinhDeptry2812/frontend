import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2, 
  ChevronRight, 
  ChevronDown, 
  X,
  Search,
  Eye,
  EyeOff,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';

// Removed BASE_STORAGE_URL and getImageUrl logic for categories as requested

// Hàm loại bỏ dấu tiếng Việt để tìm kiếm gần đúng
const removeVietnameseTones = (str: string) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Một số bộ encode cũ có thể có lỗi, nên thêm phần này để chắc chắn
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // mũ â, mũ ă, móc ơ/ư
  return str.toLowerCase().trim();
};


interface Category {
  id: number;
  name: string;
  parent_id: number | null;
  description: string | null;
  image: string | null;
  is_active: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
  children?: Category[];
}

type ModalMode = 'create' | 'edit' | 'view';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  
  const { showNotification } = useNotification();
  const { t } = useLanguage();

  // Modal stats
  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Delete Modal states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    parent_id: '0',
    description: '',
    is_active: '1',
    sort_order: '0'
  });


  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
      setCategories(data);
      
      // Mặc định mở rộng tất cả các danh mục có con
      const parentIdsWithChildren = new Set<number>();
      data.forEach((cat: Category) => {
        if (cat.parent_id) {
          parentIdsWithChildren.add(Number(cat.parent_id));
        }
      });
      setExpandedIds(parentIdsWithChildren);
    } catch (error: any) {
      showNotification(t('error_loading_data') || "Lỗi tải dữ liệu", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Chuyển mảng phẳng thành cấu trúc cây
  const categoryTree = useMemo(() => {
    const map = new Map<number, Category>();
    const roots: Category[] = [];

    // Tạo bản sao và map
    categories.forEach(cat => {
      map.set(cat.id, { ...cat, children: [] });
    });

    categories.forEach(cat => {
      const node = map.get(cat.id)!;
      if (cat.parent_id && map.has(Number(cat.parent_id))) {
        map.get(Number(cat.parent_id))!.children?.push(node);
      } else {
        roots.push(node);
      }
    });

    // Sắp xếp theo sort_order
    const sortTree = (nodes: Category[]) => {
      nodes.sort((a, b) => a.sort_order - b.sort_order);
      nodes.forEach(node => {
        if (node.children?.length) sortTree(node.children);
      });
    };
    
    sortTree(roots);
    return roots;
  }, [categories]);

  // Tự động mở rộng các nhánh khi tìm kiếm
  useEffect(() => {
    if (!searchTerm.trim()) return;

    const normalizedSearch = removeVietnameseTones(searchTerm);
    const newExpandedIds = new Set<number>(expandedIds);
    let changed = false;

    const traverse = (node: Category) => {
      const isMatch = removeVietnameseTones(node.name).includes(normalizedSearch);
      let hasChildMatch = false;

      if (node.children?.length) {
        node.children.forEach(child => {
          if (traverse(child)) hasChildMatch = true;
        });
      }

      if (hasChildMatch || isMatch) {
        if (node.children?.length && !newExpandedIds.has(node.id)) {
          newExpandedIds.add(node.id);
          changed = true;
        }
        return true;
      }
      return false;
    };

    categoryTree.forEach(traverse);
    if (changed) setExpandedIds(newExpandedIds);
  }, [searchTerm, categoryTree]);

  const toggleExpand = (id: number) => {
    const next = new Set(expandedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedIds(next);
  };

  const handleOpenModal = (mode: ModalMode, category?: Category) => {
    setModalMode(mode);
    if (category) {
      setSelectedCategory(category);
      setFormData({
        name: category.name,
        parent_id: String(category.parent_id || 0),
        description: category.description || '',
        is_active: String(category.is_active),
        sort_order: String(category.sort_order)
      });
    } else {
      setSelectedCategory(null);
      setFormData({
        name: '',
        parent_id: '0',
        description: '',
        is_active: '1',
        sort_order: '0'
      });
    }
  };

  // Removed handleImageChange and compressImage as requested


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const data = new FormData();
      data.append('name', formData.name);
      
      // Nếu là danh mục gốc (0), một số backend yêu cầu gửi "" hoặc không gửi để tránh lỗi validation
      if (formData.parent_id !== '0') {
        data.append('parent_id', formData.parent_id);
      }
      data.append('description', formData.description);
      data.append('is_active', formData.is_active);
      data.append('sort_order', formData.sort_order);


      if (modalMode === 'create') {
        await api.post('/categories', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showNotification(t('add_success') || "Thêm thành công", "success");
      } else if (modalMode === 'edit' && selectedCategory) {
        data.append('_method', 'PUT');
        await api.post(`/categories/${selectedCategory.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showNotification(t('update_success') || "Cập nhật thành công", "success");
      }
      
      setModalMode(null);
      fetchCategories();
    } catch (error: any) {
      // Lấy thông tin lỗi chi tiết từ backend (validation errors)
      const errorData = error.response?.data;
      let errorMsg = t('error_saving') || "Lỗi khi lưu";

      if (errorData?.errors) {
        // Gom các lỗi validation thành một chuỗi
        errorMsg = Object.values(errorData.errors).flat().join(', ');
      } else if (errorData?.message) {
        errorMsg = errorData.message;
      }

      showNotification(errorMsg, "error");
      console.error("Full error:", error.response);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    
    try {
      await api.delete(`/categories/${categoryToDelete.id}`);
      showNotification(t('delete_success') || "Xóa thành công", "success");
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (error: any) {
      showNotification(error.response?.data?.message || t('error_deleting') || "Lỗi khi xóa", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Lọc phẳng phục vụ mục lục thả xuống và tìm kiếm
  const flatOptions = useMemo(() => {
    const options: { id: number, name: string, level: number }[] = [];
    const traverse = (nodes: Category[], level: number) => {
      nodes.forEach(node => {
        options.push({ id: node.id, name: node.name, level });
        if (node.children?.length) traverse(node.children, level + 1);
      });
    };
    traverse(categoryTree, 0);
    return options;
  }, [categoryTree]);

  // Logic kiểm tra xem một node có nên hiển thị hay không (bao gồm cả các tổ tiên của nó nếu con nó khớp)
  const shouldShowNode = (node: Category, search: string): boolean => {
    if (!search.trim()) return true;
    
    const normalizedSearch = removeVietnameseTones(search);
    const normalizedName = removeVietnameseTones(node.name);
    
    // Nếu chính nó khớp
    if (normalizedName.includes(normalizedSearch)) return true;
    
    // Nếu bất kỳ con nào của nó khớp (đệ quy)
    if (node.children?.length) {
      return node.children.some(child => shouldShowNode(child, search));
    }
    
    return false;
  };

  // Render Table Row Recursive
  const renderRows = (nodes: Category[], level: number = 0) => {
    return nodes
      .filter(node => shouldShowNode(node, searchTerm)) // Lọc bỏ các node không liên quan
      .map(node => {
        const isExpanded = expandedIds.has(node.id);
        const hasChildren = node.children && node.children.length > 0;
        const normalizedSearch = removeVietnameseTones(searchTerm);
        const matchesSearch = searchTerm ? removeVietnameseTones(node.name).includes(normalizedSearch) : false;
        
        return (
          <React.Fragment key={node.id}>
            <tr className={`border-b border-slate-50 hover:bg-slate-50/50 transition-all duration-200 ${matchesSearch ? 'bg-primary/5' : ''}`}>
              <td className="px-4 py-4 min-w-[200px]">
                <div className="flex items-center" style={{ paddingLeft: `${level * 28}px` }}>
                  {level > 0 && (
                    <div className="w-5 flex items-center justify-center text-slate-300">
                      <span className="w-4 h-px bg-slate-200" />
                    </div>
                  )}
                  {hasChildren ? (
                    <button 
                      onClick={() => toggleExpand(node.id)}
                      className="p-1 hover:bg-slate-200 rounded-md transition-colors mr-1 text-slate-500"
                    >
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  ) : (
                    <div className="w-5 mr-1" />
                  )}
                  <div className="flex flex-col">
                    <span className={`transition-colors ${matchesSearch ? 'text-primary font-extrabold' : 'font-bold text-slate-900 group-hover:text-primary'}`}>
                      {node.name}
                    </span>
                    {hasChildren && (
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                        {node.children?.length} {t('subcategories') || "danhmục con"}
                      </span>
                    )}
                  </div>

                </div>
              </td>
              <td className="px-4 py-4 text-slate-500 text-sm max-w-[300px] truncate">
                {node.description || '---'}
              </td>
              <td className="px-4 py-4">
                <span className="text-xs font-mono text-slate-400">#{node.sort_order}</span>
              </td>
              <td className="px-4 py-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  node.is_active === 1 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                }`}>
                  {node.is_active === 1 ? <Eye size={10} /> : <EyeOff size={10} />}
                  {node.is_active === 1 ? t('active_status') : t('hidden_status')}
                </span>
              </td>
              <td className="px-4 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button 
                    onClick={() => handleOpenModal('edit', node)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title={t('edit')}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(node)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title={t('delete')}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
            {isExpanded && node.children && renderRows(node.children, level + 1)}
          </React.Fragment>
        );
      });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative min-h-[60vh] font-sans">
      {/* Header with Search and Add Action */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-10 gap-6">
        <div className="flex-shrink-0">
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl shadow-sm">
              <Layers className="text-primary" size={24} />
            </div>
            {t('category_management')}
          </h2>
          <p className="text-slate-400 text-sm mt-1 ml-1 font-medium italic opacity-80">{t('latest_system_update') || "Cập nhật cấu trúc danh mục hệ thống"}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-max">
          {/* Enhanced Search Bar */}
          <div className="relative group w-full sm:min-w-[320px] lg:min-w-[400px]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-all duration-300">
              <Search size={18} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              placeholder={t('search_by_name') || "Tìm kiếm bằng tên..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-primary focus:bg-white focus:shadow-lg focus:shadow-primary/5 transition-all duration-300"
            />
          </div>

          <button 
            onClick={() => handleOpenModal('create')}
            className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 active:scale-95 transition-all shadow-md shadow-primary/20 hover:shadow-primary/30 whitespace-nowrap"
          >
            <Plus size={18} strokeWidth={2.5} />
            {t('add_category')}
          </button>
        </div>
      </div>


      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-slate-400 font-medium">{t('loading_data')}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4 rounded-l-xl">{t('category_name')}</th>

                <th className="px-4 py-3">{t('description')}</th>
                <th className="px-4 py-3">{t('sort_order')}</th>
                <th className="px-4 py-3">{t('status_col')}</th>
                <th className="px-4 py-3 text-right rounded-r-xl">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {categoryTree.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-400 italic">
                    {t('no_staff_found') || "Thư mục trống"}
                  </td>
                </tr>
              ) : (
                renderRows(categoryTree)
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* CRUD Modal */}
      <AnimatePresence>
        {modalMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl shadow-slate-900/10"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">
                  {modalMode === 'create' ? t('add_category') : t('edit')}
                </h3>
                <button 
                  onClick={() => setModalMode(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 p-2 rounded-xl"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {/* Image Upload section removed */}


                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">{t('category_name')} *</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm"
                      placeholder="vd: Nội thất phòng khách"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">{t('parent_category')}</label>
                    <select 
                      value={formData.parent_id}
                      onChange={e => setFormData({ ...formData, parent_id: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm appearance-none"
                    >
                      <option value="0">{t('root_category')}</option>
                      {flatOptions
                        .filter(opt => !selectedCategory || opt.id !== selectedCategory.id) // Không cho chọn chính nó
                        .map(opt => (
                          <option key={opt.id} value={opt.id}>
                            {'\u00A0'.repeat(opt.level * 4)} {opt.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">{t('description')}</label>
                    <textarea 
                      rows={3}
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm resize-none"
                      placeholder="Mô tả danh mục..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">{t('sort_order')}</label>
                      <input 
                        type="number" 
                        value={formData.sort_order}
                        onChange={e => setFormData({ ...formData, sort_order: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">{t('status_col')}</label>
                      <select 
                        value={formData.is_active}
                        onChange={e => setFormData({ ...formData, is_active: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm appearance-none"
                      >
                        <option value="1">{t('active_status')}</option>
                        <option value="0">{t('hidden_status')}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setModalMode(null)}
                    className="flex-1 px-6 py-3.5 rounded-2xl font-bold text-sm text-slate-500 hover:bg-slate-100 transition-colors border border-slate-200"
                  >
                    {t('cancel')}
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 bg-primary text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                    {modalMode === 'create' ? t('add_category') : t('save_changes')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteDialogOpen && categoryToDelete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white border border-slate-200 rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl"
            >
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle size={40} strokeWidth={1.5} />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {t('confirm_delete') || "Xác nhận xóa?"}
                </h3>
                
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  {t('delete_warning_prefix') || "Bạn có chắc chắn muốn xóa danh mục"} 
                  <span className="font-bold text-slate-900 px-1">"{categoryToDelete.name}"</span>? 
                  {t('delete_warning_suffix') || "Hành động này không thể hoàn tác và sẽ ảnh hưởng đến các sản phẩm thuộc danh mục này."}
                </p>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold text-sm hover:bg-red-600 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2"
                  >
                    {isDeleting ? <Loader2 className="animate-spin" size={18} /> : t('confirm_delete') || "Xác nhận xóa"}
                  </button>
                  
                  <button 
                    onClick={() => {
                      setIsDeleteDialogOpen(false);
                      setCategoryToDelete(null);
                    }}
                    disabled={isDeleting}
                    className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


    </div>
  );
};
