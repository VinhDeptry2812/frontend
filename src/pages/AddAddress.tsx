import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Save, MapPin, Building, Home, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';

const AddAddress: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.post('/user/addresses', formData);
      showNotification('Thêm địa chỉ mới thành công', 'success');
      navigate('/profile');
    } catch (error) {
      showNotification('Thêm địa chỉ thất bại', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-slate-50 dark:bg-background-dark/50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate('/profile')} className="flex items-center gap-2 mb-8 font-bold"><ArrowLeft size={20}/> Back</button>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm">
          <h2 className="text-3xl font-serif font-bold mb-8">Add New Address</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input name="receiver_name" value={formData.receiver_name} onChange={handleChange} className="w-full p-4 bg-slate-50 dark:bg-gray-900 border rounded-xl" placeholder="Full Name" />
            <input name="receiver_phone" value={formData.receiver_phone} onChange={handleChange} className="w-full p-4 bg-slate-50 dark:bg-gray-900 border rounded-xl" placeholder="Phone" />
            <textarea name="address_detail" value={formData.address_detail} onChange={handleChange} className="w-full p-4 bg-slate-50 dark:bg-gray-900 border rounded-xl" placeholder="Address Detail" />
            <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-2 shadow-lg">
               {isSubmitting ? "..." : <Save size={20} />} Save Address
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddAddress;
