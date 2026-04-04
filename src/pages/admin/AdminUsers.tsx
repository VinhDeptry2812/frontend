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

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { showNotification } = useNotification();

  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<UserData>>({
    name: '', email: '', role: 'user', password: '', phone: '', is_active: true
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(Array.isArray(response.data) ? response.data : (response.data?.data || []));
    } catch (error: any) {
      showNotification("Không thể tải danh sách người dùng", "error");
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
    setIsSubmitting(true);
    try {
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold dark:text-white">Quản Lý Thành Viên</h2>
          <p className="text-slate-400 text-sm mt-1">Tổng cộng {users.length} tài khoản</p>
        </div>
        <button onClick={() => openModal('add')} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm">
          + Thêm user
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" placeholder="Tìm tên hoặc email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-gray-900/50 text-slate-400 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 font-semibold">Thành viên</th>
              <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100 dark:divide-gray-700">
            {filteredUsers.map(u => (
              <tr key={getUserId(u)} className="hover:bg-slate-50 dark:hover:bg-gray-900/40 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {u.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-bold dark:text-white">{u.name}</p>
                      <p className="text-slate-500 text-xs">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  <button onClick={() => openModal('edit', u)} className="text-primary font-bold hover:underline mr-4">Sửa</button>
                  <button className="text-red-500 font-bold hover:underline">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
