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
  Calendar
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

export const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Giả sử có endpoint /me hoặc /profile
        // Nếu không có, ta sẽ lấy thông tin từ token (giả định payload có info) 
        // hoặc tạm thời hiển thị dữ liệu mẫu nếu API fail
        const response = await api.get('/me');
        if (response.data.success && response.data.user) {
          setProfile(response.data.user);
        } else {
          setProfile(response.data.user || response.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // showNotification('Không thể tải thông tin hồ sơ', 'error');
        // Dữ liệu mẫu để demo giao diện nếu API chưa sẵn sàng
        setProfile({
          id: '1',
          name: 'Aurelius Member',
          email: localStorage.getItem('user_email') || 'member@aurelius.com',
          phone: '+84 901 234 567',
          gender: 'male',
          birthday: '1990-01-01',
          created_at: '2024-01-15T00:00:00.000Z'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [showNotification]);

  const handleLogout = () => {
    logout();
    showNotification('Đã đăng xuất thành công', 'success');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 bg-slate-50 dark:bg-background-dark/50">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar - Profile Summary */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/10">
                    <img 
                      src={profile?.avatar || `https://ui-avatars.com/api/?name=${profile?.name}&background=0D1117&color=fff&size=128`} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                    <Camera size={18} />
                  </button>
                </div>
                
                <h2 className="text-2xl font-serif font-bold mb-1">{profile?.name}</h2>
                <p className="text-slate-500 text-sm mb-6 uppercase tracking-widest font-bold">Premium Member</p>
                
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-8">
                  <Calendar size={14} />
                  <span>Joined {new Date(profile?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>

                <div className="w-full space-y-3">
                  <button 
                    onClick={() => navigate('/profile/edit')}
                    className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                  >
                    <Settings size={18} />
                    Edit Profile
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm"
            >
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Account Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-background-dark rounded-2xl">
                  <p className="text-2xl font-bold mb-0">12</p>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Orders</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-background-dark rounded-2xl">
                  <p className="text-2xl font-bold mb-0">5</p>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Wishlist</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content - Details */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm"
            >
              <h3 className="text-xl font-serif font-bold mb-8">Personal Information</h3>
              
              <div className="space-y-6">
                <DetailItem 
                  icon={<User size={20} className="text-primary" />} 
                  label="Full Name" 
                  value={profile?.name || 'N/A'} 
                />
                <DetailItem 
                  icon={<Mail size={20} className="text-primary" />} 
                  label="Email Address" 
                  value={profile?.email || 'N/A'} 
                />
                <DetailItem 
                  icon={<Phone size={20} className="text-primary" />} 
                  label="Phone Number" 
                  value={profile?.phone || 'Not provided'} 
                />
                <DetailItem 
                  icon={<User size={20} className="text-primary" />} 
                  label="Gender" 
                  value={profile?.gender || 'Not provided'} 
                />
                <DetailItem 
                  icon={<Calendar size={20} className="text-primary" />} 
                  label="Birthday" 
                  value={profile?.birthday || 'Not provided'} 
                />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-xl font-serif font-bold">Recent Orders</h3>
                <button className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                  View All <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <OrderItem 
                  id="#ORD-9821" 
                  date="Mar 08, 2024" 
                  status="Delivered" 
                  amount="$1,250.00" 
                />
                <OrderItem 
                  id="#ORD-9754" 
                  date="Feb 24, 2024" 
                  status="In Transit" 
                  amount="$890.00" 
                />
                <OrderItem 
                  id="#ORD-9612" 
                  date="Jan 30, 2024" 
                  status="Processing" 
                  amount="$2,100.00" 
                />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm"
            >
              <h3 className="text-xl font-serif font-bold mb-6">Security</h3>
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-background-dark/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Two-Factor Authentication</p>
                    <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">
                  Enable
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
    <div className="mt-1">{icon}</div>
    <div>
      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">{label}</p>
      <p className="font-medium text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  </div>
);

const OrderItem: React.FC<{ id: string, date: string, status: string, amount: string }> = ({ id, date, status, amount }) => (
  <div className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
        <ShoppingBag size={20} className="text-slate-400" />
      </div>
      <div>
        <p className="font-bold text-sm">{id}</p>
        <p className="text-xs text-slate-500">{date}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-bold text-sm mb-1">{amount}</p>
      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
        status === 'Delivered' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
        status === 'In Transit' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' :
        'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30'
      }`}>
        {status}
      </span>
    </div>
  </div>
);
