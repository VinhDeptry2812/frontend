import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import { motion } from 'motion/react';
import { ChevronLeft, CreditCard, Wallet, Banknote } from 'lucide-react';
import { checkoutApi, clearCartApi } from '../services/api';

interface CheckoutProps {
  cartItems: CartItem[];
}

export const Checkout: React.FC<CheckoutProps> = ({ cartItems }) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [formData, setFormData] = useState({
    shipping_name: '',
    shipping_phone: '',
    shipping_email: '',
    shipping_address: '',
    province: '',
    district: '',
    note: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const subtotalVnd = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingVnd = subtotalVnd > 0 ? (subtotalVnd > 5000000 ? 0 : 150000) : 0;
  const totalVnd = subtotalVnd + shippingVnd;

  if (cartItems.length === 0) {
    return (
      <div className="pt-32 pb-24 px-6 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <Wallet size={32} className="text-slate-300" />
        </div>
        <h2 className="text-2xl font-serif font-bold mb-4">Giỏ hàng trống</h2>
        <p className="text-slate-500 mb-8 max-w-md">Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy quay lại cửa hàng để tiếp tục mua sắm.</p>
        <Link to="/catalog" className="btn-primary" style={{ display: 'inline-flex', padding: '12px 28px', background: '#1a6b4a', color: 'white', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '2px', textDecoration: 'none' }}>
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!localStorage.getItem('token')) {
      alert('Vui lòng đăng nhập để tiến hành đặt hàng.');
      navigate('/auth');
      return;
    }
    
    try {
      const orderPayload = {
        ...formData,
        payment_method: paymentMethod,
        shipping_fee: shippingVnd,
        total_amount: totalVnd
      };
      
      await checkoutApi(orderPayload);
      
      alert('Đặt hàng thành công!');
      // Force reload to clear App.tsx state visually and navigate home
      window.location.href = '/';
    } catch (err: any) {
      alert('Có lỗi xảy ra khi đặt hàng: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-[#fafaf9] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Link to="/catalog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#1a6b4a] transition-colors mb-8">
          <ChevronLeft size={16} /> Quay lại cửa hàng
        </Link>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Form & Payment */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Delivery Form */}
            <div className="bg-white p-8 border border-[#efefed] rounded-sm">
              <h2 className="text-xl font-bold uppercase tracking-widest text-[#1a1a1a] mb-6">Địa Chỉ Giao Hàng</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Họ và tên *</label>
                  <input required type="text" name="shipping_name" value={formData.shipping_name} onChange={handleInputChange} placeholder="Nhập họ và tên" className="w-full bg-[#f9f9f7] border border-[#e8e8e4] px-4 py-3 text-sm outline-none focus:border-[#1a6b4a] transition-colors" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Số điện thoại *</label>
                    <input required type="tel" name="shipping_phone" value={formData.shipping_phone} onChange={handleInputChange} placeholder="Nhập số điện thoại" className="w-full bg-[#f9f9f7] border border-[#e8e8e4] px-4 py-3 text-sm outline-none focus:border-[#1a6b4a] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Địa chỉ email (tùy chọn)</label>
                    <input type="email" name="shipping_email" value={formData.shipping_email} onChange={handleInputChange} placeholder="Nhập địa chỉ email" className="w-full bg-[#f9f9f7] border border-[#e8e8e4] px-4 py-3 text-sm outline-none focus:border-[#1a6b4a] transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tỉnh / Thành phố *</label>
                    <select required name="province" value={formData.province} onChange={handleInputChange} className="w-full bg-[#f9f9f7] border border-[#e8e8e4] px-4 py-3 text-sm outline-none focus:border-[#1a6b4a] transition-colors appearance-none">
                      <option value="">Chọn tỉnh / thành phố</option>
                      <option value="HCM">TP. Hồ Chí Minh</option>
                      <option value="HN">Hà Nội</option>
                      <option value="DN">Đà Nẵng</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Quận / Huyện *</label>
                    <select required name="district" value={formData.district} onChange={handleInputChange} className="w-full bg-[#f9f9f7] border border-[#e8e8e4] px-4 py-3 text-sm outline-none focus:border-[#1a6b4a] transition-colors appearance-none">
                      <option value="">Chọn quận / huyện</option>
                      <option value="Q1">Quận 1</option>
                      <option value="Q2">Quận 2</option>
                      <option value="Q3">Quận 3</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Địa chỉ cụ thể *</label>
                  <input required type="text" name="shipping_address" value={formData.shipping_address} onChange={handleInputChange} placeholder="Số nhà, tên đường, phường/xã" className="w-full bg-[#f9f9f7] border border-[#e8e8e4] px-4 py-3 text-sm outline-none focus:border-[#1a6b4a] transition-colors" />
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white p-8 border border-[#efefed] rounded-sm">
              <h2 className="text-xl font-bold uppercase tracking-widest text-[#1a1a1a] mb-6">Thông Tin Thêm</h2>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Lưu ý cho đơn hàng (Tùy chọn)</label>
                <textarea name="note" value={formData.note} onChange={handleInputChange} rows={4} placeholder="Ghi chú thêm về thời gian giao hàng, hướng dẫn chỉ đường..." className="w-full bg-[#f9f9f7] border border-[#e8e8e4] px-4 py-3 text-sm outline-none focus:border-[#1a6b4a] transition-colors resize-none"></textarea>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white p-8 border border-[#efefed] rounded-sm">
              <h2 className="text-xl font-bold uppercase tracking-widest text-[#1a1a1a] mb-6">Phương Thức Thanh Toán</h2>
              <div className="space-y-4">
                
                <label className={`block border ${paymentMethod === 'cod' ? 'border-[#1a6b4a] bg-[#f8fdf9]' : 'border-[#e8e8e4]'} p-4 rounded-sm cursor-pointer transition-colors`}>
                  <div className="flex items-center gap-4">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod" 
                      checked={paymentMethod === 'cod'} 
                      onChange={() => setPaymentMethod('cod')}
                      className="w-4 h-4 accent-[#1a6b4a]" 
                    />
                    <div className="w-10 h-10 bg-white border border-[#e8e8e4] rounded-full flex items-center justify-center text-[#1a6b4a]">
                      <Banknote size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#1a1a1a]">Thanh toán khi nhận hàng (COD)</h4>
                      <p className="text-xs text-slate-500 mt-1">Thanh toán bằng tiền mặt khi hàng được giao đến</p>
                    </div>
                  </div>
                </label>

                <label className={`block border ${paymentMethod === 'transfer' ? 'border-[#1a6b4a] bg-[#f8fdf9]' : 'border-[#e8e8e4]'} p-4 rounded-sm cursor-pointer transition-colors`}>
                  <div className="flex items-center gap-4">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="transfer" 
                      checked={paymentMethod === 'transfer'} 
                      onChange={() => setPaymentMethod('transfer')}
                      className="w-4 h-4 accent-[#1a6b4a]" 
                    />
                    <div className="w-10 h-10 bg-white border border-[#e8e8e4] rounded-full flex items-center justify-center text-[#1a6b4a]">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#1a1a1a]">Chuyển khoản qua ngân hàng</h4>
                      <p className="text-xs text-slate-500 mt-1">Sử dụng ứng dụng ngân hàng hoặc quét Auto-QR Cáp</p>
                    </div>
                  </div>
                  {paymentMethod === 'transfer' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-[#e8e8e4] text-sm text-slate-600">
                      <p className="mb-2">Thông tin tài khoản:</p>
                      <p><strong>Ngân hàng:</strong> Vietcombank</p>
                      <p><strong>Số tài khoản:</strong> 0123 4567 8910</p>
                      <p><strong>Chủ tài khoản:</strong> CTY TNHH NOI THAT XANH</p>
                      <p className="mt-2 text-xs italic text-slate-400">Vui lòng ghi rõ Mã Đơn Hàng trong nội dung chuyển khoản.</p>
                    </motion.div>
                  )}
                </label>

              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 border border-[#efefed] rounded-sm sticky top-32">
              <h2 className="text-xl font-bold uppercase tracking-widest text-[#1a1a1a] mb-6">Tóm Tắt Đơn Hàng</h2>
              
              {/* Products */}
              <div className="space-y-4 mb-6 pb-6 border-b border-[#e8e8e4]">
                {cartItems.map(item => (
                  <div key={`${item.id}-${item.selectedFinish}`} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-[#f7f7f5] rounded-sm overflow-hidden flex-shrink-0 border border-[#efefed]">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-[#1a1a1a] line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-slate-500 mt-1">{item.selectedFinish}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#1a1a1a]">x {item.quantity}</p>
                      <p className="text-xs font-semibold text-[#d94f3d] mt-1">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">Thành tiền</span>
                  <span className="font-bold text-[#1a1a1a]">{subtotalVnd.toLocaleString('vi-VN')} VND</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium uppercase tracking-wider text-xs">Vận chuyển</span>
                  <span className="font-bold text-[#1a1a1a]">{shippingVnd === 0 ? 'Miễn phí' : `${shippingVnd.toLocaleString('vi-VN')} VND`}</span>
                </div>
                <div className="pt-4 border-t border-[#e8e8e4] flex justify-between items-center">
                  <span className="text-sm font-bold uppercase tracking-wider text-[#1a1a1a]">Tổng Cộng</span>
                  <span className="text-xl font-bold text-[#d94f3d]">{totalVnd.toLocaleString('vi-VN')} VND</span>
                </div>
              </div>

              <div className="text-xs text-slate-500 mb-6 italic leading-relaxed">
                Bằng việc "Hoàn tất đơn hàng", bạn đã đồng ý với <Link to="#" className="text-[#1a6b4a] underline">Điều khoản dịch vụ</Link> và <Link to="#" className="text-[#1a6b4a] underline">Chính sách xử lý dữ liệu cá nhân</Link> của chúng tôi.
              </div>

              <button type="submit" className="w-full py-4 bg-[#1a6b4a] text-white text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-[#0f4530] transition-colors">
                Hoàn Tất Đơn Hàng
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
