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
  Trash2
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
  province_id: number;
  district_id: number;
  ward_id: number;
  address_detail: string;
  is_default: boolean;
  type: string;
  created_at: string;
  updated_at: string;
}

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

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
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

    const fetchAddresses = async () => {
      try {
        setLoadingAddresses(true);
        const response = await api.get('/user/addresses');
        const addressesData = Array.isArray(response.data) ? response.data : 
                             (Array.isArray(response.data?.data) ? response.data.data : []);
        setAddresses(addressesData);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchProfile();
    fetchAddresses();
  }, [showNotification]);

  const handleDeleteAddress = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      return;
    }
    try {
      setDeletingId(id);
      await api.delete(`/user/addresses/${id}`);
      setAddresses(prev => prev.filter(address => address.id !== id));
      showNotification('Đã xóa địa chỉ thành công', 'success');
    } catch (error) {
      showNotification('Không thể xóa địa chỉ. Vui lòng thử lại sau', 'error');
    } finally {
      setDeletingId(null);
    }
  };

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
          <div className="lg:col-span-1 space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/10">
                    <img src={profile?.avatar || `https://ui-avatars.com/api/?name=${profile?.name}&background=0D1117&color=fff&size=128`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                    <Camera size={18} />
                  </button>
                </div>
                <h2 className="text-2xl font-serif font-bold mb-1">{profile?.name}</h2>
                <p className="text-slate-500 text-sm mb-6 uppercase tracking-widest font-bold">Premium Member</p>
                <div className="w-full space-y-3">
                  <button onClick={() => navigate('/profile/edit')} className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"><Settings size={18} /> Edit Profile</button>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-serif font-bold mb-8">Personal Information</h3>
              <div className="space-y-6">
                <DetailItem icon={<User size={20} className="text-primary" />} label="Full Name" value={profile?.name || 'N/A'} />
                <DetailItem icon={<Mail size={20} className="text-primary" />} label="Email Address" value={profile?.email || 'N/A'} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
