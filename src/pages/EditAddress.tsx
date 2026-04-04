import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';

const EditAddress: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    receiver_name: '',
    receiver_phone: '',
    province_id: '',
    district_id: '',
    ward_id: '',
    address_detail: '',
    type: 'home',
    is_default: false,
  });

  useEffect(() => {
    const fetchAddressDetails = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/user/addresses');
        const addressesData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        const address = addressesData.find((a: any) => a.id.toString() === id);
        if (address) {
          setFormData({
            receiver_name: address.receiver_name || '',
            receiver_phone: address.receiver_phone || '',
            province_id: address.province_id?.toString() || '',
            district_id: address.district_id?.toString() || '',
            ward_id: address.ward_id?.toString() || '',
            address_detail: address.address_detail || '',
            type: address.type || 'home',
            is_default: address.is_default || false,
          });
        }
      } catch (error) {
        showNotification('Không thể tải thông tin địa chỉ', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchAddressDetails();
  }, [id, showNotification]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.put(`/user/addresses/${id}`, formData);
      showNotification('Cập nhật địa chỉ thành công', 'success');
      navigate('/profile');
    } catch (error) {
      showNotification('Cập nhật địa chỉ thất bại', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="pt-32 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="pt-32 pb-24 px-6 bg-slate-50 dark:bg-background-dark/50">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/profile')} className="p-3 bg-white dark:bg-surface-dark border rounded-full"><ArrowLeft size={20}/></button>
            <h1 className="text-3xl font-serif font-bold">Edit Address</h1>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <input name="receiver_name" value={formData.receiver_name} onChange={handleChange} className="w-full p-4 bg-slate-50 dark:bg-gray-900 border rounded-xl" placeholder="Full Name" />
            <input name="receiver_phone" value={formData.receiver_phone} onChange={handleChange} className="w-full p-4 bg-slate-50 dark:bg-gray-900 border rounded-xl" placeholder="Phone" />
            <textarea name="address_detail" value={formData.address_detail} onChange={handleChange} className="w-full p-4 bg-slate-50 dark:bg-gray-900 border rounded-xl" placeholder="Address Detail" />
            <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-2">
               {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />} Update
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditAddress;
