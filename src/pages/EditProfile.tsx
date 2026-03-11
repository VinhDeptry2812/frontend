import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  ArrowLeft,
  Save,
  Loader2,
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
    <div className="pt-32 pb-24 px-6 bg-slate-50 dark:bg-background-dark/50">
      <div className="max-w-2xl mx-auto">
        <motion.button
          onClick={() => navigate('/profile')}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 font-bold"
        >
          <ArrowLeft size={20} />
          Back to Profile
        </motion.button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm"
        >
          <h2 className="text-3xl font-serif font-bold mb-8">Edit Profile</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <User size={14} /> Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-50 dark:bg-background-dark border border-slate-100 dark:border-slate-800 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Mail size={14} /> Email Address
              </label>
              <input
                type="email"
                value={profile?.email}
                disabled
                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 px-6 text-slate-500 cursor-not-allowed"
              />
              <p className="text-[10px] text-slate-400">Email cannot be changed.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Phone size={14} /> Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-background-dark border border-slate-100 dark:border-slate-800 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <User size={14} /> Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 dark:bg-background-dark border border-slate-100 dark:border-slate-800 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Calendar size={14} /> Birthday
                </label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 dark:bg-background-dark border border-slate-100 dark:border-slate-800 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes
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
