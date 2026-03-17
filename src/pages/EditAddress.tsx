import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Save, MapPin, Building, Home, Map } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';

export const EditAddress: React.FC = () => {
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
        // GET /user/addresses
        const response = await api.get('/user/addresses');
        const addressesData = Array.isArray(response.data) ? response.data : 
                             (Array.isArray(response.data?.data) ? response.data.data : []);
                             
        // Find by id
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
        } else {
            showNotification('Không tìm thấy địa chỉ', 'error');
            navigate('/profile');
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin địa chỉ:', error);
        showNotification('Không thể tải thông tin địa chỉ', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
        fetchAddressDetails();
    }
  }, [id, navigate, showNotification]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.receiver_name || !formData.receiver_phone || !formData.address_detail) {
      showNotification('Vui lòng điền đầy đủ các thông tin bắt buộc', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      // Ensure IDs are sent as numbers to match API spec
      const payload = {
        ...formData,
        province_id: parseInt(formData.province_id) || 0,
        district_id: parseInt(formData.district_id) || 0,
        ward_id: parseInt(formData.ward_id) || 0,
      };
      
      await api.put(`/user/addresses/${id}`, payload);
      showNotification('Cập nhật địa chỉ thành công', 'success');
      navigate('/profile');
    } catch (error) {
      console.error('Lỗi khi cập nhật địa chỉ:', error);
      showNotification('Cập nhật địa chỉ thất bại. Vui lòng thử lại sau', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
      return (
        <div className="pt-32 pb-24 flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
  }

  return (
    <div className="pt-32 pb-24 px-6 bg-slate-50 dark:bg-background-dark/50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/profile')}
              className="p-3 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-serif font-bold">Chỉnh Sửa Địa Chỉ</h1>
              <p className="text-slate-500 mt-1">Cập nhật thông tin giao hàng của bạn</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section: Thông tin liên hệ */}
            <div>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <MapPin className="text-primary" size={20} /> 
                Thông Tin Liên Hệ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Họ & Tên Người Nhận *</label>
                  <input 
                    type="text"
                    name="receiver_name"
                    value={formData.receiver_name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="VD: Nguyễn Văn A"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Số Điện Thoại *</label>
                  <input 
                    type="tel"
                    name="receiver_phone"
                    value={formData.receiver_phone}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="VD: 0987654321"
                    required
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            {/* Section: Chi tiết địa chỉ */}
            <div>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Map className="text-primary" size={20} /> 
                Chi Tiết Địa Chỉ
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tỉnh / Thành Phố</label>
                  <input 
                    type="number"
                    name="province_id"
                    value={formData.province_id}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="ID Tỉnh (VD: 202)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Quận / Huyện</label>
                  <input 
                    type="number"
                    name="district_id"
                    value={formData.district_id}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="ID Quận/Huyện"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Khóm / Xã / Phường</label>
                  <input 
                    type="number"
                    name="ward_id"
                    value={formData.ward_id}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="ID Xã/Phường"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Địa Chỉ Cụ Thể (Số nhà, đường...) *</label>
                <input 
                  type="text"
                  name="address_detail"
                  value={formData.address_detail}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="VD: Số 123, Phố Wall, Tòa nhà Landmark"
                  required
                />
              </div>
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />
            
            {/* Section: Cài đặt bổ sung */}
            <div>
              <h3 className="text-lg font-bold mb-6">Cài Đặt Thêm</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Loại Địa Chỉ</label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.type === 'home' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-primary/50'}`}>
                    <input type="radio" name="type" value="home" checked={formData.type === 'home'} onChange={handleChange} className="hidden" />
                    <Home size={20} />
                    <span className="font-bold">Nhà Riêng</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.type === 'office' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-primary/50'}`}>
                    <input type="radio" name="type" value="office" checked={formData.type === 'office'} onChange={handleChange} className="hidden" />
                    <Building size={20} />
                    <span className="font-bold">Văn Phòng</span>
                  </label>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-6 h-6 rounded flex items-center justify-center border transition-colors ${formData.is_default ? 'bg-primary border-primary text-white' : 'border-slate-300 dark:border-slate-600 group-hover:border-primary'}`}>
                  {formData.is_default && <span className="text-white text-sm font-bold">✓</span>}
                </div>
                <input 
                  type="checkbox" 
                  name="is_default" 
                  checked={formData.is_default}
                  onChange={handleChange}
                  className="hidden" 
                />
                <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">
                  Đặt làm địa chỉ mặc định
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="pt-6 flex gap-4">
              <button 
                type="button"
                onClick={() => navigate('/profile')}
                className="flex-1 py-4 px-6 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] py-4 px-6 rounded-xl font-bold bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={20} />
                    Cập Nhật
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
