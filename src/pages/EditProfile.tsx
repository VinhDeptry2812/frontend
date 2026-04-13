import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  ArrowLeft,
  Save,
  Loader2,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

interface UserProfile {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  birthday?: string;
  avatar?: string;
}

export const EditProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showNotification } = useNotification();
  const { fetchUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    birthday: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/me');
        const user = response.data.user || response.data;
        setProfile(user);
        setFormData({
          name: user.name || '',
          phone: user.phone || '',
          gender: user.gender || 'male',
          birthday: user.birthday || ''
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        showNotification('Không thể tải thông tin hồ sơ', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [showNotification]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await api.put('/update-profile', formData);
      if (response.data.success) {
        showNotification(response.data.message || 'Cập nhật thành công', 'success');
        await fetchUser();
        navigate('/profile');
      } else {
        showNotification(response.data.message || 'Cập nhật thất bại', 'error');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      showNotification(error.response?.data?.message || 'Đã có lỗi xảy ra', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 bg-bg-ivory min-h-screen">
      <div className="max-w-2xl mx-auto">
        <motion.button
          onClick={() => navigate('/profile')}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-8 font-bold text-sm uppercase tracking-wider"
        >
          <ArrowLeft size={18} />
          Quay lại hồ sơ
        </motion.button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-stone-100 rounded-[2rem] p-10 shadow-sm shadow-stone-200/50"
        >
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-serif font-bold text-text-dark mb-2">Chỉnh sửa hồ sơ</h2>
            <p className="text-text-muted text-sm">Cập nhật thông tin cá nhân của bạn để có trải nghiệm tốt hơn</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted flex items-center gap-2 ml-1">
                <User size={13} className="text-primary" /> Họ và tên
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all text-text-dark font-medium"
                placeholder="Nhập họ và tên của bạn"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted flex items-center gap-2 ml-1">
                <Mail size={13} className="text-primary" /> Địa chỉ Email
              </label>
              <div className="relative group">
                <input
                  type="email"
                  value={profile?.email}
                  disabled
                  className="w-full bg-stone-100/50 border border-stone-100 rounded-2xl py-4 px-6 text-text-muted cursor-not-allowed font-medium"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                   <span className="text-[10px] bg-stone-200 text-stone-500 px-2 py-1 rounded-md font-bold uppercase">Cố định</span>
                </div>
              </div>
              <p className="text-[10px] text-stone-400 ml-1">Email là định danh duy nhất và không thể thay đổi.</p>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted flex items-center gap-2 ml-1">
                <Phone size={13} className="text-primary" /> Số điện thoại
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all text-text-dark font-medium"
                placeholder="Nhập số điện thoại của bạn"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted flex items-center gap-2 ml-1">
                  <User size={13} className="text-primary" /> Giới tính
                </label>
                <div className="relative">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all text-text-dark font-medium appearance-none"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted flex items-center gap-2 ml-1">
                  <Calendar size={13} className="text-primary" /> Ngày sinh
                </label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all text-text-dark font-medium custom-date-input"
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-70 active:scale-[0.98]"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Đang lưu thay đổi...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
