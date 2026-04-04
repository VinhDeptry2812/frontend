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

const AdminEmployees: React.FC = () => {
  const [staff, setStaff] = useState<StaffData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { showNotification } = useNotification();

  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/staff');
      setStaff(Array.isArray(res.data) ? res.data : (res.data?.data || []));
    } catch (error: any) {
      showNotification('Không thể tải danh sách nhân viên', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  const filteredStaff = staff.filter(s => {
    const q = searchQuery.toLowerCase();
    return (s.name || '').toLowerCase().includes(q) || (s.email || '').toLowerCase().includes(q);
  });

  return (
    <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold dark:text-white">Danh Sách Nhân Viên</h2>
          <p className="text-slate-400 text-sm mt-1">Tổng cộng {staff.length} nhân viên</p>
        </div>
        <button onClick={() => setModalType('add')} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm">
          + Thêm nhân viên
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" placeholder="Tìm theo tên hoặc email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-gray-900/50 text-slate-400 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 font-semibold">Nhân viên</th>
              <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100 dark:divide-gray-700">
            {filteredStaff.map(s => (
              <tr key={String(s.id || s._id)} className="hover:bg-slate-50 dark:hover:bg-gray-900/40 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                      {s.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <p className="font-bold dark:text-white">{s.name}</p>
                      <p className="text-slate-500 text-xs">{s.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  <button className="text-primary font-bold hover:underline">Sửa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEmployees;
