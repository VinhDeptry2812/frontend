import React, { useState, useEffect, useMemo } from 'react';
import { Search, Info, Ban, Plus, X, Edit2, Trash2, Loader2, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export interface UserData {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
  password?: string;
  status?: string;
  phone?: string;
  is_active?: boolean | number;
}

type ModalType = 'add' | 'edit' | 'view' | 'delete' | null;

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { showNotification } = useNotification();

  // Modal states
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState<Partial<UserData>>({
    name: '', email: '', role: 'user', password: '', phone: '', is_active: true
  });

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showNotification("Không tìm thấy token đăng nhập. Vui lòng đăng nhập lại!", "error");
        setLoading(false);
        return;
      }
      setLoading(true);
      const response = await api.get('/users');
      
      let data = [];
      if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
        data = response.data.data.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        data = response.data.data;
      } else if (response.data?.users && Array.isArray(response.data.users)) {
        data = response.data.users;
      } else if (Array.isArray(response.data)) {
        data = response.data;
      }
      setUsers(data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        showNotification("Phiên làm việc hết hạn. Vui lòng đăng nhập lại!", "error");
      } else {
        showNotification(error.response?.data?.message || "Không thể tải danh sách người dùng", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const q = searchQuery.toLowerCase();
      return (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q);
    });
  }, [users, searchQuery]);

  const openModal = (type: ModalType, user: UserData | null = null) => {
    setModalType(type);
    setSelectedUser(user);
    if (type === 'add') {
      setFormData({ name: '', email: '', role: 'user', password: '', phone: '', is_active: true });
    } else if (type === 'edit' && user) {
      setFormData({ 
        name: user.name, email: user.email, role: user.role || 'user',
        phone: user.phone || '', is_active: user.is_active === 1 || user.is_active === true
      });
    }
  };

  const closeModal = () => { setModalType(null); setSelectedUser(null); setFormData({}); };
  const getUserId = (u: UserData) => u._id || u.id;

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showNotification("Vui lòng nhập đủ thông tin bắt buộc", "error");
      return;
    }
    try {
      setIsSubmitting(true);
      if (modalType === 'add') {
        await api.post('/users', formData);
        showNotification("Thêm người dùng thành công", "success");
      } else if (modalType === 'edit' && selectedUser) {
        await api.put(`/users/${getUserId(selectedUser)}`, {
          name: formData.name, phone: formData.phone,
          is_active: formData.is_active ? true : false
        });
        showNotification("Cập nhật thông tin thành công", "success");
      }
      closeModal();
      fetchUsers();
    } catch (error: any) {
      showNotification(error.response?.data?.message || "Lưu thất bại!", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    const idToDelete = getUserId(selectedUser);
    try {
      setIsSubmitting(true);
      await api.delete(`/users/${idToDelete}`);
      showNotification("Đã xoá người dùng thành công", "success");
      closeModal();
      setUsers(prev => prev.filter(u => getUserId(u) !== idToDelete));
    } catch (error: any) {
      showNotification("Xoá tài khoản thất bại!", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('vi-VN').format(date);
  };

  const isUserActive = (status: any) => {
    if (status === undefined || status === null) return true;
    return status === 1 || String(status) === '1' || status === true || String(status) === 'true';
  };

  const inputClass = "w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm text-slate-900 transition-colors shadow-sm placeholder:text-slate-400";
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative min-h-[60vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Quản Lý Người Dùng</h2>
          <p className="text-slate-400 text-sm mt-1">Hệ thống thành viên, phân quyền và dữ liệu ({users.length} tài khoản)</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Tìm tên hoặc email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-1 focus:border-primary text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-colors"
            />
          </div>
          <button 
            onClick={() => openModal('add')}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-sm shrink-0"
          >
            <Plus size={16} />
            <span className="hidden sm:block">Thêm user</span>
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-20 flex-col gap-3 text-slate-400">
          <Loader2 className="animate-spin text-primary" size={36} />
          <p className="text-sm">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 font-semibold rounded-l-xl">Thành viên</th>
                <th className="px-4 py-3 font-semibold">Vai trò</th>
                <th className="px-4 py-3 font-semibold text-center">Trạng thái</th>
                <th className="px-4 py-3 font-semibold text-right rounded-r-xl">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-slate-400">
                    <Users size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Không tìm thấy người dùng nào.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={getUserId(u)} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0 uppercase">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{u.name}</p>
                          <p className="text-slate-400 text-xs mt-0.5">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {u.role === 'admin' ? (
                        <span className="inline-flex px-2.5 py-1 bg-violet-50 text-violet-700 rounded-lg text-xs font-semibold">Quản trị</span>
                      ) : (
                        <span className="inline-flex px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">Thành viên</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        isUserActive(u.is_active) ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                      }`}>
                        {isUserActive(u.is_active) ? 'Hoạt động' : 'Tạm khóa'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openModal('view', u)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-600 hover:text-white rounded-lg transition-all text-xs font-bold" title="Chi tiết">
                          <Info size={13} /> Xem
                        </button>
                        <button onClick={() => openModal('edit', u)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all text-xs font-bold" title="Sửa thông tin">
                          <Edit2 size={13} /> Sửa
                        </button>
                        <button onClick={() => openModal('delete', u)} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all text-xs font-bold" title="Xóa">
                          <Trash2 size={13} /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODALS */}
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
              {/* === Modal XOÁ === */}
              {modalType === 'delete' && (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-100">
                    <Ban size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Xoá người dùng?</h3>
                  <p className="text-slate-500 text-sm mb-7">
                    Bạn đang chuẩn bị xoá tài khoản <strong className="text-slate-900">{selectedUser?.email}</strong>. Hành động này không thể hoàn tác.
                  </p>
                  <div className="flex gap-3">
                    <button onClick={closeModal} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors text-sm">
                      Hủy bỏ
                    </button>
                    <button onClick={handleDeleteUser} disabled={isSubmitting} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors text-sm disabled:opacity-50">
                      {isSubmitting ? "Đang xóa..." : "Xác nhận xoá"}
                    </button>
                  </div>
                </div>
              )}

              {/* === Modal XEM CHI TIẾT === */}
              {modalType === 'view' && selectedUser && (
                <div>
                  <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Hồ Sơ Người Dùng</h3>
                    <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"><X size={18}/></button>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold border border-primary/20 shadow-sm">
                        {selectedUser.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-900">{selectedUser.name}</p>
                        <p className="text-slate-400 text-sm mt-0.5">{selectedUser.email}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Cương vị</span>
                        <span className="text-slate-900 font-semibold capitalize">{selectedUser.role || 'User'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Trạng thái</span>
                        <span className={`font-semibold text-xs px-2.5 py-1 rounded-lg ${isUserActive(selectedUser.is_active) ? 'text-emerald-700 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                          {isUserActive(selectedUser.is_active) ? 'Đang hoạt động' : 'Đã khóa'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Mã ID</span>
                        <span className="text-slate-500 font-mono text-xs">{getUserId(selectedUser) || '---'}</span>
                      </div>
                      {selectedUser.phone && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Điện thoại</span>
                          <span className="text-slate-900 font-medium text-sm">{selectedUser.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-5 border-t border-slate-100 bg-slate-50/50">
                    <button onClick={closeModal} className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold transition-colors text-sm">Đóng lại</button>
                  </div>
                </div>
              )}

              {/* === Modal THÊM / SỬA === */}
              {(modalType === 'add' || modalType === 'edit') && (
                <form onSubmit={handleSubmitForm}>
                  <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">
                      {modalType === 'add' ? 'Tạo Tài Khoản Mới' : 'Cập Nhật Tài Khoản'}
                    </h3>
                    <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"><X size={18}/></button>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div>
                      <label className={labelClass}>Họ và Tên *</label>
                      <input type="text" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass} placeholder="Nguyễn Văn A" />
                    </div>
                    <div>
                      <label className={labelClass}>Số Điện Thoại</label>
                      <input type="tel" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className={inputClass} placeholder="0123456789" />
                    </div>
                    <div>
                      <label className={labelClass}>Email Đăng Nhập *</label>
                      <input type="email" required value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className={`${inputClass} ${modalType === 'edit' ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : ''}`} placeholder="email@example.com" disabled={modalType === 'edit'} />
                    </div>
                    <div>
                      <label className={labelClass}>Trạng thái Hoạt động</label>
                      <select value={formData.is_active ? "true" : "false"} onChange={e => setFormData({...formData, is_active: e.target.value === "true"})} className={`${inputClass} appearance-none cursor-pointer`}>
                        <option value="true">Đang hoạt động</option>
                        <option value="false">Tạm Khóa</option>
                      </select>
                    </div>
                    {modalType === 'add' && (
                      <>
                        <div>
                          <label className={labelClass}>Quyền Hạn (Role)</label>
                          <select value={formData.role || 'user'} onChange={e => setFormData({...formData, role: e.target.value})} className={`${inputClass} appearance-none cursor-pointer`}>
                            <option value="user">Khách hàng thông thường (User)</option>
                            <option value="admin">Quản trị viên (Admin)</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>Mật khẩu *</label>
                          <input type="password" required value={formData.password || ''} onChange={e => setFormData({...formData, password: e.target.value})} className={inputClass} placeholder="Nhập tối thiểu 6 ký tự" />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="p-5 bg-slate-50/50 border-t border-slate-100 flex gap-3">
                    <button type="button" onClick={closeModal} className="flex-1 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-colors text-sm">
                      Hủy bỏ
                    </button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold transition-colors text-sm shadow-sm disabled:opacity-50">
                      {isSubmitting ? "Đang xử lý..." : "Lưu Thay Đổi"}
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
