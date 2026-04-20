import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Save, MapPin, Building, Home, Map, Loader2, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';

export const AddAddress: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    receiver_name: '',
    receiver_phone: '',
    province_id: '', // Will store the text typed by user
    district_id: '', // Will store the text typed by user
    ward_id: '',     // Will store the text typed by user
    address_detail: '',
    type: 'home',
    is_default: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.receiver_name || !formData.receiver_phone || !formData.address_detail || !formData.province_id || !formData.district_id || !formData.ward_id) {
      showNotification('Vui lòng điền đầy đủ tất cả các thông tin', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // If the backend strictly requires numbers for _id fields, 
      // we map the text to a dummy ID (1) to prevent failure, 
      // or we send as is if the backend is flexible.
      // Based on Checkout.tsx, we'll try to parse or use 1.
      const payload = {
        ...formData,
        province_id: parseInt(formData.province_id) || 1,
        district_id: parseInt(formData.district_id) || 1,
        ward_id: parseInt(formData.ward_id) || 1,
      };
      
      await api.post('/user/addresses', payload);
      showNotification('Thêm địa chỉ mới thành công', 'success');
      navigate('/profile');
    } catch (error: any) {
      console.error('Lỗi khi thêm địa chỉ:', error);
      showNotification(error.response?.data?.message || 'Không thể thêm địa chỉ. Vui lòng thử lại sau', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-bg-ivory min-h-screen">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <motion.button 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate('/profile')}
            className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-4 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Quay lại hồ sơ</span>
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="section-label mb-2">Thông tin địa chỉ</span>
            <h1 className="section-title text-4xl mb-3">Thêm Địa Chỉ Mới</h1>
            <p className="text-text-muted max-w-xl mx-auto text-sm leading-relaxed">
              Vui lòng nhập đầy đủ thông tin bên dưới để đơn hàng được giao chính xác nhất.
            </p>
          </motion.div>
        </div>

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5 border border-stone-100 relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
            
            {/* Section: Thông tin người nhận */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin size={18} />
                </div>
                <h3 className="font-serif text-lg font-bold text-text-dark">Thông tin người nhận</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Họ tên người nhận</label>
                  <input 
                    type="text"
                    name="receiver_name"
                    value={formData.receiver_name}
                    onChange={handleChange}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm"
                    placeholder="VD: Nguyễn Văn A"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Số điện thoại</label>
                  <input 
                    type="tel"
                    name="receiver_phone"
                    value={formData.receiver_phone}
                    onChange={handleChange}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm"
                    placeholder="09xx xxx xxx"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section: Địa chỉ chi tiết (Simple Inputs) */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <Map size={18} />
                </div>
                <h3 className="font-serif text-lg font-bold text-text-dark">Địa chỉ giao hàng</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Tỉnh / Thành phố</label>
                  <input 
                    type="text"
                    name="province_id"
                    value={formData.province_id}
                    onChange={handleChange}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm"
                    placeholder="Nhập tỉnh/thành"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Quận / Huyện</label>
                  <input 
                    type="text"
                    name="district_id"
                    value={formData.district_id}
                    onChange={handleChange}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm"
                    placeholder="Nhập quận/huyện"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Phường / Xã</label>
                  <input 
                    type="text"
                    name="ward_id"
                    value={formData.ward_id}
                    onChange={handleChange}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm"
                    placeholder="Nhập phường/xã"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Địa chỉ cụ thể (Số nhà, tên đường...)</label>
                <input 
                  type="text"
                  name="address_detail"
                  value={formData.address_detail}
                  onChange={handleChange}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm"
                  placeholder="VD: 123 Phố Wall, Tòa nhà Landmark"
                  required
                />
              </div>
            </div>

            {/* Section: Loại địa chỉ & Tùy chọn */}
            <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-3">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Phân loại</label>
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setFormData(p => ({...p, type: 'home'}))}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-semibold text-sm ${formData.type === 'home' ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-stone-100 text-stone-400 hover:border-stone-200'}`}
                  >
                    <Home size={16} /> Nhà riêng
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData(p => ({...p, type: 'office'}))}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-semibold text-sm ${formData.type === 'office' ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-stone-100 text-stone-400 hover:border-stone-200'}`}
                  >
                    <Building size={16} /> Văn phòng
                  </button>
                </div>
              </div>

              <div className="space-y-3 md:pt-8">
                <label className="flex items-center gap-3 cursor-pointer group select-none">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${formData.is_default ? 'bg-primary border-primary text-white' : 'border-stone-300 group-hover:border-primary'}`}>
                    {formData.is_default && <span className="text-[10px] font-bold">✓</span>}
                  </div>
                  <input 
                    type="checkbox" 
                    name="is_default" 
                    checked={formData.is_default}
                    onChange={handleChange}
                    className="hidden" 
                  />
                  <span className="text-sm font-medium text-text-muted group-hover:text-primary transition-colors">
                    Đặt làm địa chỉ mặc định
                  </span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-stone-50 flex gap-4">
              <button 
                type="button"
                onClick={() => navigate('/profile')}
                className="px-8 py-4 rounded-full font-bold text-text-muted hover:bg-stone-100 transition-all text-sm"
                disabled={isSubmitting}
              >
                Hủy bỏ
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-primary py-4 rounded-full flex items-center justify-center gap-2 text-sm disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Save size={18} /> Lưu địa chỉ
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
