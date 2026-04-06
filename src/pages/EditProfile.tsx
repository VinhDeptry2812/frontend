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
  Layers
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
        // Fallback for demo
        setFormData({
            name: 'Nguyễn Văn A',
            phone: '0901234567',
            gender: 'male',
            birthday: '1995-10-20'
        });
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
      <div className="pt-40 flex items-center justify-center min-h-[60vh] text-[#1a6b4a]">
        <Loader2 size={40} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 bg-[#fafaf9] min-h-screen">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/profile')}
          className="group flex items-center gap-2 text-slate-400 hover:text-[#1a6b4a] transition-colors mb-10 font-bold text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Trở lại hồ sơ
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#efefed] rounded-sm p-10 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#1a6b4a]"></div>
          
          <h2 className="text-3xl font-serif font-bold text-[#1a1a1a] mb-2">Chỉnh sửa hồ sơ</h2>
          <p className="text-slate-400 text-sm mb-12">Cập nhật thông tin cá nhân của bạn để nhận dịch vụ tốt nhất.</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Full Name */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#1a6b4a] flex items-center gap-2">
                <User size={14} /> Họ và tên
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full bg-white border border-[#e8e8e4] rounded-sm py-4 px-6 outline-none focus:border-[#1a6b4a] focus:ring-1 focus:ring-[#1a6b4a]/10 transition-all text-[#1a1a1a] font-medium"
                placeholder="Nhập họ tên của bạn"
              />
            </div>

            {/* Email Address - Locked */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Mail size={14} /> Địa chỉ Email
              </label>
              <div className="relative">
                <input
                    type="email"
                    value={profile?.email || 'khachhang@noithatxanh.vn'}
                    disabled
                    className="w-full bg-[#f9f9f7] border border-[#efefed] rounded-sm py-4 px-6 text-slate-400 cursor-not-allowed font-medium"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase tracking-tighter text-slate-300">Không thể thay đổi</span>
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#1a6b4a] flex items-center gap-2">
                <Phone size={14} /> Số điện thoại
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-white border border-[#e8e8e4] rounded-sm py-4 px-6 outline-none focus:border-[#1a6b4a] focus:ring-1 focus:ring-[#1a6b4a]/10 transition-all text-[#1a1a1a] font-medium"
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Gender */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#1a6b4a] flex items-center gap-2">
                  <Layers size={14} /> Giới tính
                </label>
                <div className="relative">
                    <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-[#e8e8e4] rounded-sm py-4 px-6 outline-none focus:border-[#1a6b4a] appearance-none text-[#1a1a1a] font-medium"
                    >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <motion.div animate={{ y: [0, 2, 0] }} transition={{ repeat: Infinity, duration: 2 }}>↓</motion.div>
                    </div>
                </div>
              </div>

              {/* Birthday */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#1a6b4a] flex items-center gap-2">
                  <Calendar size={14} /> Ngày sinh
                </label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-[#e8e8e4] rounded-sm py-4 px-6 outline-none focus:border-[#1a6b4a] text-[#1a1a1a] font-medium"
                />
              </div>
            </div>

            <div className="pt-8">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-5 rounded-sm bg-[#1a6b4a] text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#0f4530] transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#1a6b4a]/10 disabled:opacity-70 group"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Đang lưu thay đổi...
                  </>
                ) : (
                  <>
                    <Save size={16} className="group-hover:scale-110 transition-transform" />
                    Lưu thông tin hồ sơ
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
