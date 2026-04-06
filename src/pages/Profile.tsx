import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  ShieldCheck, 
  LogOut, 
  Camera,
  ChevronRight,
  Settings,
  Calendar,
  Trash2,
  CreditCard,
  Bell
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
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
}

interface UserAddress {
  id: number;
  user_id: number;
  receiver_name: string;
  receiver_phone: string;
  address_detail: string;
  is_default: boolean;
  type: string;
}

export const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/me');
        if (response.data.success && response.data.user) {
          setProfile(response.data.user);
        } else {
          setProfile(response.data.user || response.data);
        }
      } catch (error) {
        setProfile({
          id: '1',
          name: 'Nguyễn Văn A',
          email: localStorage.getItem('user_email') || 'khachhang@noithatxanh.vn',
          phone: '+84 901 234 567',
          gender: 'Nam',
          birthday: '1995-10-20',
          created_at: '2024-04-06T00:00:00.000Z'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    showNotification('Đã đăng xuất khỏi tài khoản', 'success');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="pt-40 flex items-center justify-center min-h-[60vh] text-[#1a6b4a]">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-10 h-10 border-4 border-[#1a6b4a] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 bg-[#fafaf9] min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[#1a1a1a] mb-2">Hồ sơ cá nhân</h1>
            <p className="text-slate-400 font-medium">Quản lý thông tin tài khoản và đơn hàng của bạn.</p>
          </div>
          <div className="flex gap-4">
             <button onClick={() => navigate('/profile/edit')} className="px-6 py-3 bg-white border border-[#e8e8e4] text-[#1a1a1a] font-bold text-xs uppercase tracking-widest rounded-sm hover:border-[#1a6b4a] transition-all flex items-center gap-2">
                <Settings size={14} /> Chỉnh sửa
             </button>
             <button onClick={handleLogout} className="px-6 py-3 bg-red-50 text-red-600 font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-red-100 transition-all flex items-center gap-2">
                <LogOut size={14} /> Đăng xuất
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Avatar & Summary */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-[#efefed] rounded-sm p-10 shadow-sm text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-[#1a6b4a]"></div>
              
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 ring-1 ring-[#efefed]">
                  <img 
                    src={profile?.avatar || `https://ui-avatars.com/api/?name=${profile?.name}&background=1a6b4a&color=fff&size=128`} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-1 right-1 p-2 bg-[#1a6b4a] text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                  <Camera size={16} />
                </button>
              </div>
              
              <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-1">{profile?.name}</h2>
              <span className="inline-block px-3 py-1 bg-[#1a6b4a]/5 text-[#1a6b4a] text-[10px] font-bold uppercase tracking-widest rounded-full mb-6">
                Thành viên kim cương
              </span>
              
              <div className="flex flex-col gap-3 pt-6 border-t border-[#f0f0ee]">
                <div className="flex items-center justify-between text-sm">
                   <span className="text-slate-400">Tham gia:</span>
                   <span className="font-bold text-[#1a1a1a]">Tháng 4, 2024</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                   <span className="text-slate-400">Đơn hàng:</span>
                   <span className="font-bold text-[#1a1a1a]">12 đơn thành công</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Links / Menu */}
            <div className="bg-white border border-[#efefed] rounded-sm overflow-hidden shadow-sm">
               <div className="p-4 bg-[#f9f9f7] border-b border-[#efefed]">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Tiện ích tài khoản</h3>
               </div>
               <div className="divide-y divide-[#f0f0ee]">
                  <MenuLink icon={<ShoppingBag size={18} />} label="Đơn hàng của tôi" count={12} />
                  <MenuLink icon={<CreditCard size={18} />} label="Phương thức thanh toán" />
                  <MenuLink icon={<Bell size={18} />} label="Thông báo" count={3} />
                  <MenuLink icon={<ShieldCheck size={18} />} label="Bảo mật & Mật khẩu" />
               </div>
            </div>
          </div>

          {/* Right Column: Detailed Info */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Info Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-[#efefed] rounded-sm p-8 md:p-10 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-10 pb-4 border-b border-[#f0f0ee]">
                 <div className="w-10 h-10 bg-[#1a6b4a]/5 flex items-center justify-center rounded-full text-[#1a6b4a]">
                    <User size={20} />
                 </div>
                 <h3 className="text-xl font-serif font-bold text-[#1a1a1a]">Thông tin cơ bản</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
                <DetailRow icon={<Mail size={18} />} label="Địa chỉ Email" value={profile?.email || 'N/A'} />
                <DetailRow icon={<Phone size={18} />} label="Số điện thoại" value={profile?.phone || 'Chưa cập nhật'} />
                <DetailRow icon={<User size={18} />} label="Giới tính" value={profile?.gender || 'N/A'} />
                <DetailRow icon={<Calendar size={18} />} label="Ngày sinh" value={profile?.birthday || 'N/A'} />
              </div>
            </motion.div>

            {/* Address Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-[#efefed] rounded-sm p-8 md:p-10 shadow-sm"
            >
              <div className="flex items-center justify-between mb-10 pb-4 border-b border-[#f0f0ee]">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#e8a045]/5 flex items-center justify-center rounded-full text-[#e8a045]">
                        <MapPin size={20} />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-[#1a1a1a]">Sổ địa chỉ</h3>
                 </div>
                 <button className="text-xs font-bold uppercase tracking-widest text-[#1a6b4a] hover:underline">
                    Thêm địa chỉ mới
                 </button>
              </div>
              
              <div className="space-y-6">
                <div className="p-6 bg-[#f9f9f7] border border-[#e8e8e4] rounded-sm relative">
                   <div className="absolute top-4 right-4 text-[10px] bg-[#1a6b4a] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Mặc định</div>
                   <h4 className="font-bold text-[#1a1a1a] mb-1">{profile?.name}</h4>
                   <p className="text-sm text-slate-500 mb-4">{profile?.phone}</p>
                   <p className="text-sm text-[#1a1a1a] leading-relaxed max-w-md">123 Đường Ba Tháng Hai, Phường 11, Quận 10, TP. Hồ Chí Minh</p>
                   
                   <div className="mt-6 pt-4 border-t border-[#efefed] flex gap-6">
                      <button className="text-xs font-bold text-[#1a6b4a] uppercase tracking-widest hover:underline">Chỉnh sửa</button>
                      <button className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-red-500">Xóa</button>
                   </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 group">
    <div className="mt-1 text-slate-300 group-hover:text-[#1a6b4a] transition-colors">{icon}</div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <p className="text-[#1a1a1a] font-medium leading-tight">{value}</p>
    </div>
  </div>
);

const MenuLink: React.FC<{ icon: React.ReactNode, label: string, count?: number }> = ({ icon, label, count }) => (
  <button className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors group">
    <div className="flex items-center gap-4">
      <span className="text-slate-400 group-hover:text-[#1a6b4a] transition-colors">{icon}</span>
      <span className="text-sm font-bold text-slate-600 group-hover:text-[#1a1a1a] transition-colors">{label}</span>
    </div>
    <div className="flex items-center gap-3">
       {count && <span className="w-5 h-5 bg-[#1a6b4a] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{count}</span>}
       <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
    </div>
  </button>
);
