import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  MapPin, User, Phone, CreditCard, ShoppingBag,
  ChevronRight, CheckCircle, Loader, Tag, X, Trash2
} from 'lucide-react';
import { checkout } from '../services/orders';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { CheckoutData } from '../types';
import { applyCoupon, ApplyCouponResponse } from '../services/coupons';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

// Simple province data for demo - in production use a real address API
const PROVINCES = [
  { id: 79, name: 'TP. Hồ Chí Minh' },
  { id: 1, name: 'Hà Nội' },
  { id: 48, name: 'Đà Nẵng' },
  { id: 31, name: 'Hải Phòng' },
  { id: 70, name: 'Bình Dương' },
  { id: 75, name: 'Đồng Nai' },
  { id: 92, name: 'Cần Thơ' },
  { id: 68, name: 'Lâm Đồng' },
];

export const Checkout: React.FC = () => {
  const { cart, clearAll } = useCart();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<ApplyCouponResponse | null>(null);

  const [form, setForm] = useState<CheckoutData>({
    receiver_name: user?.name || '',
    receiver_phone: user?.phone || '',
    province_id: 79,
    district_id: 1,
    ward_id: 1,
    address_detail: '',
    payment_method: 'cod',
    coupon_code: '',
    note: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutData, string>>>({});

  const items = cart?.items || [];
  const total = cart?.total_price || 0;

  const validate = () => {
    const newErrors: Partial<Record<keyof CheckoutData, string>> = {};
    if (!form.receiver_name.trim()) newErrors.receiver_name = 'Vui lòng nhập họ tên';
    if (!form.receiver_phone.trim()) newErrors.receiver_phone = 'Vui lòng nhập số điện thoại';
    if (!/^(0|\+84)[0-9]{8,9}$/.test(form.receiver_phone.replace(/\s/g, ''))) {
      newErrors.receiver_phone = 'Số điện thoại không hợp lệ';
    }
    if (!form.address_detail.trim()) newErrors.address_detail = 'Vui lòng nhập địa chỉ cụ thể';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (items.length === 0) {
      showNotification('Giỏ hàng của bạn đang trống', 'error');
      return;
    }

    if (!user) {
      showNotification('Vui lòng đăng nhập để đặt hàng', 'error');
      navigate('/auth');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        receiver_name: form.receiver_name,
        receiver_phone: form.receiver_phone,
        province_id: form.province_id,
        district_id: form.district_id,
        ward_id: form.ward_id,
        address_detail: form.address_detail,
        payment_method: form.payment_method,
        note: form.note || undefined,
        coupon_code: couponCode || undefined,
        items: items.map(item => {
          const product = item.product;
          const variant = item.variant;
          const price = variant?.price ?? product?.base_price ?? 0;
          
          const mappedItem: any = {
            product_id: item.product_id,
            quantity: item.quantity,
            price: price
          };
          
          if (variant && variant.id) {
            mappedItem.product_variant_id = variant.id;
          }
          
          return mappedItem;
        })
      };
      const res = await checkout(payload);
      // The API might return the order differently (e.g. res.data.data.order or res.data.order or res.data.id)
      const order = res.data?.order || res.data?.data || res.data;
      setOrderId(order?.id || order?.order_id || null);
      setOrderSuccess(true);
      await clearAll();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      showNotification('Vui lòng nhập mã giảm giá', 'error');
      return;
    }
    setCouponLoading(true);
    try {
      const res = await applyCoupon(couponCode, total);
      if (res.success) {
        setAppliedCoupon(res);
        showNotification(res.message, 'success');
      } else {
        setAppliedCoupon(null);
        showNotification(res.message, 'error');
      }
    } catch (err: any) {
      setAppliedCoupon(null);
      showNotification(err.response?.data?.message || 'Không thể kiểm tra mã giảm giá', 'error');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleChange = (field: keyof CheckoutData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  // Success screen
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-bg-ivory flex items-center justify-center px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-12 text-center max-w-md w-full shadow-lg"
        >
          <div className="w-20 h-20 bg-bg-blue-light rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-primary" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-text-dark mb-3">Đặt hàng thành công!</h2>
          {orderId && (
            <p className="text-text-muted mb-2 text-sm">Mã đơn hàng: <strong className="text-text-dark">#{orderId}</strong></p>
          )}
          <p className="text-text-muted mb-8 text-sm leading-relaxed">
            Cảm ơn bạn đã mua hàng tại Nội Thất Xanh. Chúng tôi sẽ liên hệ xác nhận đơn hàng trong thời gian sớm nhất.
          </p>
          <div className="space-y-3">
            <Link to="/profile" className="w-full btn-primary flex items-center justify-center gap-2">
              <ShoppingBag size={18} />
              Xem đơn hàng của tôi
            </Link>
            <Link to="/" className="w-full btn-outline flex items-center justify-center gap-2 mt-3">
              Tiếp tục mua sắm
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-36 pb-24 bg-bg-ivory min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <span className="section-label">Thanh toán</span>
          <h1 className="section-title">Xác Nhận Đơn Hàng</h1>
        </div>

        {!user && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <User size={18} className="text-amber-600 flex-shrink-0" />
            <p className="text-amber-800 text-sm">
              Bạn cần <Link to="/auth" className="font-bold underline">đăng nhập</Link> để đặt hàng.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ===== LEFT: Form ===== */}
            <div className="lg:col-span-2 space-y-6">
              {/* Thông tin người nhận */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-serif font-bold text-xl text-text-dark mb-5 flex items-center gap-2">
                  <User size={20} className="text-primary" />
                  Thông tin người nhận
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1.5">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.receiver_name}
                      onChange={handleChange('receiver_name')}
                      placeholder="Nguyễn Văn A"
                      className={`w-full border ${errors.receiver_name ? 'border-red-400 bg-red-50' : 'border-stone-200'} rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all`}
                    />
                    {errors.receiver_name && <p className="text-red-500 text-xs mt-1">{errors.receiver_name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1.5">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={form.receiver_phone}
                      onChange={handleChange('receiver_phone')}
                      placeholder="0901 234 567"
                      className={`w-full border ${errors.receiver_phone ? 'border-red-400 bg-red-50' : 'border-stone-200'} rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all`}
                    />
                    {errors.receiver_phone && <p className="text-red-500 text-xs mt-1">{errors.receiver_phone}</p>}
                  </div>
                </div>
              </div>

              {/* Địa chỉ giao hàng */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-serif font-bold text-xl text-text-dark mb-5 flex items-center gap-2">
                  <MapPin size={20} className="text-primary" />
                  Địa chỉ giao hàng
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1.5">Tỉnh / Thành phố</label>
                    <select
                      value={form.province_id}
                      onChange={e => setForm(p => ({ ...p, province_id: Number(e.target.value), district_id: 1, ward_id: 1 }))}
                      className="w-full border border-stone-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    >
                      {PROVINCES.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-dark mb-1.5">Quận / Huyện</label>
                      <input
                        type="text"
                        placeholder="Nhập quận/huyện"
                        onChange={e => {
                          // For demo purposes - in production use address API
                          setForm(p => ({ ...p, district_id: 1 }));
                        }}
                        className="w-full border border-stone-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-dark mb-1.5">Phường / Xã</label>
                      <input
                        type="text"
                        placeholder="Nhập phường/xã"
                        onChange={e => {
                          setForm(p => ({ ...p, ward_id: 1 }));
                        }}
                        className="w-full border border-stone-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1.5">
                      Địa chỉ cụ thể <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.address_detail}
                      onChange={handleChange('address_detail')}
                      placeholder="Số nhà, tên đường..."
                      className={`w-full border ${errors.address_detail ? 'border-red-400 bg-red-50' : 'border-stone-200'} rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all`}
                    />
                    {errors.address_detail && <p className="text-red-500 text-xs mt-1">{errors.address_detail}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1.5">Ghi chú đơn hàng</label>
                    <textarea
                      value={form.note}
                      onChange={handleChange('note')}
                      placeholder="Ghi chú cho người giao hàng (nếu có)..."
                      rows={3}
                      className="w-full border border-stone-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-serif font-bold text-xl text-text-dark mb-5 flex items-center gap-2">
                  <CreditCard size={20} className="text-primary" />
                  Phương thức thanh toán
                </h2>
                <div className="space-y-3">
                  {[
                    { value: 'cod', label: 'Thanh toán khi nhận hàng (COD)', desc: 'Trả tiền mặt khi nhận hàng', icon: '💵' },
                    { value: 'bank_transfer', label: 'Chuyển khoản ngân hàng', desc: 'Chuyển khoản trước khi giao hàng', icon: '🏦' },
                  ].map(opt => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${form.payment_method === opt.value ? 'border-primary bg-bg-blue-light' : 'border-stone-200 hover:border-stone-300'
                        }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={opt.value}
                        checked={form.payment_method === opt.value}
                        onChange={handleChange('payment_method')}
                        className="accent-primary"
                      />
                      <span className="text-2xl">{opt.icon}</span>
                      <div>
                        <p className="font-semibold text-text-dark text-sm">{opt.label}</p>
                        <p className="text-text-muted text-xs">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ===== RIGHT: Order Summary ===== */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-32">
                <h2 className="font-serif font-bold text-xl text-text-dark mb-5 flex items-center gap-2">
                  <ShoppingBag size={20} className="text-primary" />
                  Đơn hàng ({items.length})
                </h2>

                {/* Items */}
                <div className="space-y-4 mb-5 max-h-64 overflow-y-auto custom-scrollbar">
                  {items.map(item => {
                    const product = item.product;
                    const variant = item.variant;
                    const price = variant?.price ?? product?.base_price ?? 0;
                    return (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                          {(variant?.image_url || product?.image_url) ? (
                            <img src={variant?.image_url || product?.image_url} alt={product?.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-bg-warm" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-text-dark truncate">{product?.name}</p>
                          {variant && <p className="text-xs text-text-muted">{variant.color || variant.size}</p>}
                          <p className="text-xs font-semibold text-primary mt-0.5">
                            {formatPrice(price)} × {item.quantity}
                          </p>
                        </div>
                        <p className="text-xs font-bold text-text-dark flex-shrink-0">
                          {formatPrice(price * item.quantity)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Coupon */}
                <div className="mb-5">
                  <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Mã giảm giá</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="NHAP MA GIAM GIA"
                        className="w-full border border-stone-200 rounded-xl py-2.5 pl-9 pr-3 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="bg-primary/10 text-primary font-semibold px-4 rounded-xl text-sm hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
                    >
                      {couponLoading ? <Loader size={14} className="animate-spin" /> : 'Áp dụng'}
                    </button>
                  </div>
                  {appliedCoupon && (
                    <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                      <span>✓ Đã áp dụng: {appliedCoupon.coupon_code}</span>
                      <button type="button" onClick={() => { setAppliedCoupon(null); setCouponCode(''); }} className="hover:text-emerald-800"><X size={12} /></button>
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-2 border-t border-stone-100 pt-4 mb-5">
                  <div className="flex justify-between text-sm text-text-muted">
                    <span>Tạm tính</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-text-muted">
                    <span>Phí vận chuyển</span>
                    <span className="text-primary font-medium">Miễn phí</span>
                  </div>
                  {appliedCoupon && appliedCoupon.discount_amount && (
                    <div className="flex justify-between text-sm text-emerald-600 font-medium">
                      <span>Giảm giá</span>
                      <span>-{formatPrice(appliedCoupon.discount_amount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-stone-100 text-text-dark">
                    <span className="font-serif">Tổng thanh toán</span>
                    <span className="text-primary font-serif text-lg">
                      {appliedCoupon?.final_amount ? formatPrice(appliedCoupon.final_amount) : formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || items.length === 0}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-base rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><Loader size={18} className="animate-spin" /> Đang xử lý...</>
                  ) : (
                    <>Xác nhận đặt hàng <ChevronRight size={18} /></>
                  )}
                </button>

                <p className="text-xs text-center text-text-muted mt-3">
                  🔒 Thông tin của bạn được bảo mật an toàn
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
