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

const EditProfile: React.FC = () => {
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
      showNotification('Cập nhật thành công', 'success');
      await fetchUser();
      navigate('/profile');
    } catch (error: any) {
      showNotification('Cập nhật thất bại', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="pt-32 flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="pt-32 pb-24 px-6 bg-slate-50 dark:bg-background-dark/50">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/profile')} className="flex items-center gap-2 mb-8 font-bold"><ArrowLeft size={20}/> Back</button>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm">
          <h2 className="text-3xl font-serif font-bold mb-8">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-4 bg-slate-50 dark:bg-gray-900 border rounded-2xl" placeholder="Full Name" />
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-4 bg-slate-50 dark:bg-gray-900 border rounded-2xl" placeholder="Phone" />
            <button type="submit" disabled={saving} className="w-full py-4 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 shadow-lg">
               {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />} Save Changes
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProfile;
