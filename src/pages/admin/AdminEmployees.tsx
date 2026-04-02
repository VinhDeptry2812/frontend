import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, X, Search, UserCircle, Ban, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export interface StaffData {
  id?: number | string;
  _id?: string;
  name: string;
  email: string;
  role?: string;
  is_active?: boolean | number;
  phone?: string;
  created_at?: string;
}

type ModalType = 'add' | 'edit' | 'view' | 'delete' | null;

export const AdminEmployees: React.FC = () => {
  const [staff, setStaff] = useState<StaffData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { showNotification } = useNotification();

  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const [addForm, setAddForm] = useState({
    name: '', email: '', password: '', password_confirmation: '', role: 'staff', is_active: 1 as 0 | 1
  });

  const [editForm, setEditForm] = useState({
    name: '', email: '', role: 'staff', is_active: true as boolean
  });

  // ============ API ============

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/staff');
      let data: StaffData[] = [];
      if (res.data?.data?.data && Array.isArray(res.data.data.data)) data = res.data.data.data;
      else if (res.data?.data && Array.isArray(res.data.data)) data = res.data.data;
      else if (res.data?.staff && Array.isArray(res.data.staff)) data = res.data.staff;
      else if (Array.isArray(res.data)) data = res.data;
      setStaff(data);
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Không thể tải danh sách nhân viên', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  // ============ HELPERS ============

  const getStaffId = (s: StaffData) => s.id || s._id;

  const isActive = (val: any) => {
    if (val === undefined || val === null) return true;
    return val === 1 || val === true || String(val) === '1' || String(val) === 'true';
  };

  // Trich xuat loi validation Laravel 422
  const extractErrors = (error: any): Record<string, string[]> =>
    error.response?.data?.errors || {};

  const getFirstError = (field: string): string | null =>
    validationErrors[field]?.[0] || null;

  const openModal = (type: ModalType, s: StaffData | null = null) => {
    setModalType(type);
    setSelectedStaff(s);
    setValidationErrors({});
    if (type === 'add') {
      setAddForm({ name: '', email: '', password: '', password_confirmation: '', role: 'staff', is_active: 1 });
    } else if (type === 'edit' && s) {
      setEditForm({
        name: s.name || '', email: s.email || '',
        role: s.role || 'staff', is_active: isActive(s.is_active)
      });
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedStaff(null);
    setValidationErrors({});
  };

  // ============ CRUD ============

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (addForm.password !== addForm.password_confirmation) {
      showNotification('Mật khẩu xác nhận không khớp!', 'error');
      return;
    }
    try {
      setIsSubmitting(true);
      setValidationErrors({});
      await api.post('/admin/staff', {
        name: addForm.name,
        email: addForm.email,
        password: addForm.password,
        password_confirmation: addForm.password_confirmation,
        role: addForm.role,
        is_active: Number(addForm.is_active)
      });
      showNotification('Thêm nhân viên thành công!', 'success');
      closeModal();
      fetchStaff();
    } catch (error: any) {
      console.error('[ADD STAFF ERROR]', error.response?.data);
      const errs = extractErrors(error);
      setValidationErrors(errs);
      const msgs = Object.values(errs).flat();
      showNotification(
        msgs.length > 0 ? msgs.join(' | ') : (error.response?.data?.message || 'Thêm nhân viên thất bại!'),
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;
    try {
      setIsSubmitting(true);
      setValidationErrors({});
      await api.put(`/admin/staff/${getStaffId(selectedStaff)}`, {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
        is_active: editForm.is_active
      });
      showNotification('Cập nhật nhân viên thành công!', 'success');
      closeModal();
      fetchStaff();
    } catch (error: any) {
      console.error('[EDIT STAFF ERROR]', error.response?.data);
      const errs = extractErrors(error);
      setValidationErrors(errs);
      const msgs = Object.values(errs).flat();
      showNotification(
        msgs.length > 0 ? msgs.join(' | ') : (error.response?.data?.message || 'Cập nhật thất bại!'),
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStaff) return;
    try {
      setIsSubmitting(true);
      await api.delete(`/admin/staff/${getStaffId(selectedStaff)}`);
      showNotification('Đã xóa nhân viên thành công!', 'success');
      setStaff(prev => prev.filter(s => getStaffId(s) !== getStaffId(selectedStaff)));
      closeModal();
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Xóa nhân viên thất bại!', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============ FILTER ============

  const filteredStaff = staff.filter(s => {
    const q = searchQuery.toLowerCase();
    return (s.name || '').toLowerCase().includes(q) || (s.email || '').toLowerCase().includes(q);
  });

  // ============ STYLE HELPERS ============

  const inputClass = "w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm text-slate-900 transition-colors shadow-sm placeholder:text-slate-400";
  const inputErrClass = "w-full bg-white border border-red-400 rounded-xl px-4 py-2.5 outline-none focus:border-red-400 focus:ring-1 focus:ring-red-300 text-sm text-slate-900 transition-colors shadow-sm placeholder:text-slate-400";
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5";

  const roleLabel = (role?: string) => {
    switch (role) {
      case 'admin':   return { text: 'Quản trị',  cls: 'bg-violet-50 text-violet-700' };
      case 'manager': return { text: 'Quản lý',   cls: 'bg-blue-50 text-blue-700' };
      default:        return { text: 'Nhân viên', cls: 'bg-slate-100 text-slate-600' };
    }
  };

  // ============ JSX ============

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative min-h-[60vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Danh sách Nhân viên</h2>
          <p className="text-slate-400 text-sm mt-1">Quản lý tài khoản và phân quyền hệ thống ({staff.length} nhân viên)</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text" placeholder="Tìm tên hoặc email..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 outline-none focus:ring-1 focus:border-primary text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-colors"
            />
          </div>
          <button onClick={() => openModal('add')} className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-sm shrink-0">
            <Plus size={16} />
            <span className="hidden sm:block">Thêm NV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-20 flex-col gap-3 text-slate-400">
          <Loader2 className="animate-spin text-primary" size={36} />
          <p className="text-sm">Đang tải dữ liệu nhân viên...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 font-semibold rounded-l-xl">Nhân viên</th>
                <th className="px-4 py-3 font-semibold">Vai trò</th>
                <th className="px-4 py-3 font-semibold text-center">Trạng thái</th>
                <th className="px-4 py-3 font-semibold text-right rounded-r-xl">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-50">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-slate-400">
                    <UserCircle size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Không tìm thấy nhân viên nào.</p>
                  </td>
                </tr>
              ) : filteredStaff.map((s) => {
                const role = roleLabel(s.role);
                return (
                  <tr key={String(getStaffId(s))} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0 uppercase">
                          {s.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{s.name}</p>
                          <p className="text-slate-400 text-xs mt-0.5">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${role.cls}`}>{role.text}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${isActive(s.is_active) ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                        {isActive(s.is_active) ? 'Hoạt động' : 'Tạm khóa'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openModal('view', s)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-600 hover:text-white rounded-lg transition-all text-xs font-bold">
                          <Eye size={13} /> Xem
                        </button>
                        <button onClick={() => openModal('edit', s)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all text-xs font-bold">
                          <Edit2 size={13} /> Sửa
                        </button>
                        <button onClick={() => openModal('delete', s)} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all text-xs font-bold">
                          <Trash2 size={13} /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ============ MODALS ============ */}
      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              {/* === XOÁ === */}
              {modalType === 'delete' && (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-100">
                    <Ban size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Xóa nhân viên?</h3>
                  <p className="text-slate-500 text-sm mb-7">
                    Bạn đang chuẩn bị xóa <strong className="text-slate-900">{selectedStaff?.email}</strong>. Hành động này không thể hoàn tác.
                  </p>
                  <div className="flex gap-3">
                    <button onClick={closeModal} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm">Hủy bỏ</button>
                    <button onClick={handleDelete} disabled={isSubmitting} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm disabled:opacity-50">
                      {isSubmitting ? 'Đang xóa...' : 'Xác nhận xóa'}
                    </button>
                  </div>
                </div>
              )}

              {/* === XEM === */}
              {modalType === 'view' && selectedStaff && (
                <div>
                  <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Hồ Sơ Nhân Viên</h3>
                    <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold border border-primary/20">
                        {selectedStaff.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-900">{selectedStaff.name}</p>
                        <p className="text-slate-400 text-sm mt-0.5">{selectedStaff.email}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                      {[
                        { label: 'Vai trò', value: roleLabel(selectedStaff.role).text },
                        { label: 'Trạng thái', value: isActive(selectedStaff.is_active) ? 'Đang hoạt động' : 'Đã khóa', badge: true, active: isActive(selectedStaff.is_active) },
                        { label: 'Mã ID', value: String(getStaffId(selectedStaff) || '---'), mono: true },
                      ].map((row, i) => (
                        <div key={i} className="flex justify-between items-center text-sm">
                          <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider">{row.label}</span>
                          {row.badge ? (
                            <span className={`font-semibold text-xs px-2.5 py-1 rounded-lg ${row.active ? 'text-emerald-700 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>{row.value}</span>
                          ) : (
                            <span className={`text-slate-900 font-semibold ${row.mono ? 'font-mono text-xs text-slate-500' : ''}`}>{row.value}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-5 border-t border-slate-100 bg-slate-50/50">
                    <button onClick={closeModal} className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-sm">Đóng lại</button>
                  </div>
                </div>
              )}

              {/* === THÊM MỚI === */}
              {modalType === 'add' && (
                <form onSubmit={handleAdd}>
                  <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Thêm Nhân Viên Mới</h3>
                    <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
                  </div>
                  <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                    {/* Tên */}
                    <div>
                      <label className={labelClass}>Họ và tên *</label>
                      <input required type="text" value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                        className={getFirstError('name') ? inputErrClass : inputClass} placeholder="Nguyễn Văn A" />
                      {getFirstError('name') && <p className="text-red-500 text-xs mt-1">{getFirstError('name')}</p>}
                    </div>
                    {/* Email */}
                    <div>
                      <label className={labelClass}>Email *</label>
                      <input required type="email" value={addForm.email} onChange={e => setAddForm({ ...addForm, email: e.target.value })}
                        className={getFirstError('email') ? inputErrClass : inputClass} placeholder="staff@example.com" />
                      {getFirstError('email') && <p className="text-red-500 text-xs mt-1">{getFirstError('email')}</p>}
                    </div>
                    {/* Password */}
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className={labelClass}>Mật khẩu *</label>
                        <input required type="password" value={addForm.password} onChange={e => setAddForm({ ...addForm, password: e.target.value })}
                          className={getFirstError('password') ? inputErrClass : inputClass} placeholder="••••••••" />
                        {getFirstError('password') && <p className="text-red-500 text-xs mt-1">{getFirstError('password')}</p>}
                      </div>
                      <div className="flex-1">
                        <label className={labelClass}>Xác nhận MK *</label>
                        <input required type="password" value={addForm.password_confirmation} onChange={e => setAddForm({ ...addForm, password_confirmation: e.target.value })}
                          className={inputClass} placeholder="••••••••" />
                      </div>
                    </div>
                    {/* Role */}
                    <div>
                      <label className={labelClass}>Vai trò</label>
                      <select value={addForm.role} onChange={e => setAddForm({ ...addForm, role: e.target.value })} className={`${inputClass} appearance-none cursor-pointer`}>
                        <option value="staff">Nhân viên (staff)</option>
                        <option value="manager">Quản lý (manager)</option>
                        <option value="admin">Quản trị viên (admin)</option>
                      </select>
                    </div>
                    {/* Status */}
                    <div>
                      <label className={labelClass}>Trạng thái</label>
                      <select value={addForm.is_active} onChange={e => setAddForm({ ...addForm, is_active: Number(e.target.value) as 0 | 1 })} className={`${inputClass} appearance-none cursor-pointer`}>
                        <option value={1}>Đang hoạt động</option>
                        <option value={0}>Tạm khóa</option>
                      </select>
                    </div>
                  </div>
                  <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex gap-3">
                    <button type="button" onClick={closeModal} className="flex-1 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-sm">Hủy bỏ</button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold text-sm disabled:opacity-50 shadow-sm">
                      {isSubmitting ? 'Đang xử lý...' : 'Tạo Nhân Viên'}
                    </button>
                  </div>
                </form>
              )}

              {/* === CHỈNH SỬA === */}
              {modalType === 'edit' && selectedStaff && (
                <form onSubmit={handleEdit}>
                  <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Cập Nhật Nhân Viên</h3>
                    <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className={labelClass}>Họ và tên *</label>
                      <input required type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                        className={getFirstError('name') ? inputErrClass : inputClass} placeholder="Nguyễn Văn A" />
                      {getFirstError('name') && <p className="text-red-500 text-xs mt-1">{getFirstError('name')}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Email *</label>
                      <input required type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                        className={getFirstError('email') ? inputErrClass : inputClass} placeholder="staff@example.com" />
                      {getFirstError('email') && <p className="text-red-500 text-xs mt-1">{getFirstError('email')}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Vai trò</label>
                      <select value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })} className={`${inputClass} appearance-none cursor-pointer`}>
                        <option value="staff">Nhân viên (staff)</option>
                        <option value="manager">Quản lý (manager)</option>
                        <option value="admin">Quản trị viên (admin)</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Trạng thái</label>
                      <select value={editForm.is_active ? 'true' : 'false'} onChange={e => setEditForm({ ...editForm, is_active: e.target.value === 'true' })} className={`${inputClass} appearance-none cursor-pointer`}>
                        <option value="true">Đang hoạt động</option>
                        <option value="false">Tạm khóa</option>
                      </select>
                    </div>
                  </div>
                  <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex gap-3">
                    <button type="button" onClick={closeModal} className="flex-1 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-sm">Hủy bỏ</button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold text-sm disabled:opacity-50 shadow-sm">
                      {isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
