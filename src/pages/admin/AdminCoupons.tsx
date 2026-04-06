import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, X, Search, Ticket, Ban, Eye, Calendar, DollarSign, Percent, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';

export interface CouponData {
  id?: number | string;
  _id?: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  min_order_amount: number;
  max_discount: number;
  usage_limit: number;
  used_count: number;
  start_date: string;
  end_date: string;
  is_active: boolean | number;
  created_at?: string;
}

type ModalType = 'add' | 'edit' | 'view' | 'delete' | null;

export const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<CouponData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { showNotification } = useNotification();
  const { t, language } = useLanguage();

  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const defaultForm = {
    code: '',
    type: 'percent' as 'percent' | 'fixed',
    value: 0,
    min_order_amount: 0,
    max_discount: 0,
    usage_limit: 0,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    is_active: true
  };

  const [form, setForm] = useState(defaultForm);

  // ============ API ============

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/coupons');
      let data: CouponData[] = [];
      
      // Handle different API response structures common in Laravel/Express
      if (res.data?.data?.data && Array.isArray(res.data.data.data)) data = res.data.data.data;
      else if (res.data?.data && Array.isArray(res.data.data)) data = res.data.data;
      else if (res.data?.coupons && Array.isArray(res.data.coupons)) data = res.data.coupons;
      else if (Array.isArray(res.data)) data = res.data;
      
      setCoupons(data);
    } catch (error: any) {
      console.error('[FETCH COUPONS ERROR]', error);
      showNotification(error.response?.data?.message || t('loading_data'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  // ============ HELPERS ============

  const getCouponId = (c: CouponData) => c.id || c._id;

  const isActive = (val: any) => {
    if (val === undefined || val === null) return true;
    return val === 1 || val === true || String(val) === '1' || String(val) === 'true';
  };

  const extractErrors = (error: any): Record<string, string[]> =>
    error.response?.data?.errors || {};

  const getFirstError = (field: string): string | null =>
    validationErrors[field]?.[0] || null;

  const openModal = (type: ModalType, c: CouponData | null = null) => {
    setModalType(type);
    setSelectedCoupon(c);
    setValidationErrors({});
    if (type === 'add') {
      setForm(defaultForm);
    } else if (type === 'edit' && c) {
      setForm({
        code: c.code || '',
        type: (c.type as 'percent' | 'fixed') || 'percent',
        value: Number(c.value) || 0,
        min_order_amount: Number(c.min_order_amount) || 0,
        max_discount: Number(c.max_discount) || 0,
        usage_limit: Number(c.usage_limit) || 0,
        start_date: c.start_date || '',
        end_date: c.end_date || '',
        is_active: isActive(c.is_active)
      });
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedCoupon(null);
    setValidationErrors({});
  };

  // ============ CRUD ============

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setValidationErrors({});
      
      const payload = {
        ...form,
        is_active: form.is_active ? 1 : 0
      };

      if (modalType === 'add') {
        await api.post('/admin/coupons', payload);
        showNotification(t('create_success') || 'Tạo mã giảm giá thành công!', 'success');
      } else if (modalType === 'edit' && selectedCoupon) {
        await api.put(`/admin/coupons/${getCouponId(selectedCoupon)}`, payload);
        showNotification(t('update_success') || 'Cập nhật mã giảm giá thành công!', 'success');
      }
      
      closeModal();
      fetchCoupons();
    } catch (error: any) {
      console.error('[COUPON SUBMIT ERROR]', error.response?.data);
      const errs = extractErrors(error);
      setValidationErrors(errs);
      const msgs = Object.values(errs).flat();
      showNotification(
        msgs.length > 0 ? msgs.join(' | ') : (error.response?.data?.message || t('action_fail')),
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCoupon) return;
    try {
      setIsSubmitting(true);
      await api.delete(`/admin/coupons/${getCouponId(selectedCoupon)}`);
      showNotification(t('delete_success') || 'Đã xóa mã giảm giá thành công!', 'success');
      setCoupons(prev => prev.filter(c => getCouponId(c) !== getCouponId(selectedCoupon)));
      closeModal();
    } catch (error: any) {
      showNotification(error.response?.data?.message || t('delete_fail'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============ FILTER ============

  const filteredCoupons = coupons.filter(c => {
    const q = searchQuery.toLowerCase();
    return (c.code || '').toLowerCase().includes(q);
  });

  // ============ STYLE HELPERS ============

  const inputClass = "w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm text-slate-900 transition-colors shadow-sm placeholder:text-slate-400";
  const inputErrClass = "w-full bg-white border border-red-400 rounded-xl px-4 py-2.5 outline-none focus:border-red-400 focus:ring-1 focus:ring-red-300 text-sm text-slate-900 transition-colors shadow-sm placeholder:text-slate-400";
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5";

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: language === 'vi' ? 'VND' : 'USD'
    }).format(val);
  };

  // ============ JSX ============

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative min-h-[60vh] font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t('coupon_management')}</h2>
          <p className="text-slate-400 text-sm mt-1">{t('manage_coupons_desc')} ({coupons.length} {t('nav_coupons')})</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text" placeholder={t('coupon_code') + '...'}
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 outline-none focus:ring-1 focus:border-primary text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-colors"
            />
          </div>
          <button onClick={() => openModal('add')} className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-sm shrink-0">
            <Plus size={16} />
            <span className="hidden sm:block">{t('add_coupon')}</span>
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-20 flex-col gap-3 text-slate-400">
          <Loader2 className="animate-spin text-primary" size={36} />
          <p className="text-sm">{t('loading_data')}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 font-semibold rounded-l-xl">{t('coupon_code')}</th>
                <th className="px-4 py-3 font-semibold">{t('discount_value')}</th>
                <th className="px-4 py-3 font-semibold">{t('usage_limit')}</th>
                <th className="px-4 py-3 font-semibold">{t('expiry_date')}</th>
                <th className="px-4 py-3 font-semibold text-center">{t('status_col')}</th>
                <th className="px-4 py-3 font-semibold text-right rounded-r-xl">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-50">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <Ticket size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">{t('no_coupons_found')}</p>
                  </td>
                </tr>
              ) : filteredCoupons.map((c) => (
                <tr key={String(getCouponId(c))} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 shrink-0">
                        <Ticket size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 tracking-wider text-sm uppercase">{c.code}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{c.type === 'percent' ? t('percent') : t('fixed')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 font-bold text-primary">
                      {c.type === 'percent' ? (
                        <><span>{c.value}%</span> <Percent size={14} className="opacity-50" /></>
                      ) : (
                        <><span>{formatCurrency(Number(c.value))}</span> <DollarSign size={14} className="opacity-50" /></>
                      )}
                    </div>
                    <p className="text-slate-400 text-[10px] mt-1 italic">
                      Min: {formatCurrency(Number(c.min_order_amount))}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                       <span className="font-semibold text-slate-700">{c.used_count || 0}</span>
                       <span className="text-slate-300">/</span>
                       <span className="text-slate-400">{c.usage_limit || '∞'}</span>
                    </div>
                    <div className="w-20 h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${Math.min(100, ((c.used_count || 0) / (Number(c.usage_limit) || 1)) * 100)}%` }} 
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-500 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-300" />
                      <span className="text-xs">{c.end_date}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${isActive(c.is_active) ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                      {isActive(c.is_active) ? t('active') : t('locked')}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => openModal('view', c)} className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => openModal('edit', c)} className="p-2 hover:bg-blue-50 text-blue-500 rounded-xl transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => openModal('delete', c)} className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ============ MODALS ============ */}
      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              {/* === XOÁ === */}
              {modalType === 'delete' && (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-100">
                    <Ban size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{t('delete_coupon_title')}</h3>
                  <p className="text-slate-500 text-sm mb-7">
                    Bạn đang chuẩn bị xóa mã giảm giá <strong className="text-slate-900">{selectedCoupon?.code}</strong>. Hành động này không thể hoàn tác.
                  </p>
                  <div className="flex gap-3">
                    <button onClick={closeModal} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors">{t('cancel')}</button>
                    <button onClick={handleDelete} disabled={isSubmitting} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm disabled:opacity-50 transition-colors shadow-lg shadow-red-500/20">
                      {isSubmitting ? t('processing') : t('confirm_delete')}
                    </button>
                  </div>
                </div>
              )}

              {/* === XEM === */}
              {modalType === 'view' && selectedCoupon && (
                <div className="max-h-[85vh] overflow-y-auto">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                       <Ticket size={18} className="text-primary" />
                       <span>{t('coupon_management')}</span>
                    </h3>
                    <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
                  </div>
                  <div className="p-6">
                    <div className="bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-6 mb-6 text-white text-center shadow-xl shadow-primary/20 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                          <Ticket size={120} />
                       </div>
                       <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">{selectedCoupon.type === 'percent' ? 'PERCENTAGE OFF' : 'FIXED SAVINGS'}</p>
                       <h4 className="text-4xl font-black mb-1">{selectedCoupon.code}</h4>
                       <div className="flex items-center justify-center gap-2 text-xl font-bold mt-4">
                          {selectedCoupon.type === 'percent' ? (
                            <span>-{selectedCoupon.value}%</span>
                          ) : (
                            <span>-{formatCurrency(Number(selectedCoupon.value))}</span>
                          )}
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className={labelClass}>{t('min_order')}</p>
                        <p className="font-bold text-slate-900">{formatCurrency(Number(selectedCoupon.min_order_amount))}</p>
                      </div>
                      {selectedCoupon.type === 'percent' && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <p className={labelClass}>{t('max_discount')}</p>
                          <p className="font-bold text-slate-900">{formatCurrency(Number(selectedCoupon.max_discount))}</p>
                        </div>
                      )}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className={labelClass}>{t('usage_limit')}</p>
                        <p className="font-bold text-slate-900">{selectedCoupon.usage_limit || '---'}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className={labelClass}>{t('used_count')}</p>
                        <p className="font-bold text-slate-900">{selectedCoupon.used_count || 0}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar size={16} className="text-slate-400" />
                        <span className="text-slate-500">{t('start_date')}:</span>
                        <span className="font-semibold text-slate-900">{selectedCoupon.start_date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar size={16} className="text-slate-400" />
                        <span className="text-slate-500">{t('end_date')}:</span>
                        <span className="font-semibold text-slate-900">{selectedCoupon.end_date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Info size={16} className="text-slate-400" />
                        <span className="text-slate-500">{t('status_col')}:</span>
                        <span className={`font-bold ${isActive(selectedCoupon.is_active) ? 'text-emerald-600' : 'text-red-500'}`}>
                          {isActive(selectedCoupon.is_active) ? t('active') : t('locked')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                    <button onClick={closeModal} className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-sm transition-colors">{t('close')}</button>
                  </div>
                </div>
              )}

              {/* === THÊM / SỬA === */}
              {(modalType === 'add' || modalType === 'edit') && (
                <form onSubmit={handleSubmit} className="max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h3 className="font-bold text-slate-900">{modalType === 'add' ? t('create_coupon') : t('update_coupon')}</h3>
                    <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"><X size={18} /></button>
                  </div>
                  
                  <div className="p-6 space-y-5">
                    {/* Code */}
                    <div>
                      <label className={labelClass}>{t('coupon_code')} *</label>
                      <input 
                        required type="text" placeholder="Ví dụ: SUMMER2024"
                        value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                        className={getFirstError('code') ? inputErrClass : inputClass} 
                      />
                      {getFirstError('code') && <p className="text-red-500 text-[10px] mt-1 font-medium">{getFirstError('code')}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Type */}
                      <div>
                        <label className={labelClass}>{t('discount_type')}</label>
                        <select 
                          value={form.type} onChange={e => setForm({ ...form, type: e.target.value as 'percent' | 'fixed' })}
                          className={`${inputClass} cursor-pointer`}
                        >
                          <option value="percent">{t('percent')}</option>
                          <option value="fixed">{t('fixed')}</option>
                        </select>
                      </div>
                      {/* Value */}
                      <div>
                        <label className={labelClass}>{t('discount_value')} *</label>
                        <div className="relative">
                           <input 
                            required type="number" step="any"
                            value={form.value} onChange={e => setForm({ ...form, value: Number(e.target.value) })}
                            className={getFirstError('value') ? inputErrClass : inputClass} 
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            {form.type === 'percent' ? <Percent size={14} /> : <span className="text-xs font-bold">đ</span>}
                          </div>
                        </div>
                        {getFirstError('value') && <p className="text-red-500 text-[10px] mt-1 font-medium">{getFirstError('value')}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Min Order */}
                      <div>
                        <label className={labelClass}>{t('min_order')}</label>
                        <div className="relative">
                          <input 
                            type="number"
                            value={form.min_order_amount} onChange={e => setForm({ ...form, min_order_amount: Number(e.target.value) })}
                            className={getFirstError('min_order_amount') ? inputErrClass : inputClass} 
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold pointer-events-none">đ</span>
                        </div>
                        {getFirstError('min_order_amount') && <p className="text-red-500 text-[10px] mt-1 font-medium">{getFirstError('min_order_amount')}</p>}
                      </div>
                      {/* Max Discount */}
                      {form.type !== 'fixed' && (
                        <div>
                          <label className={labelClass}>{t('max_discount')}</label>
                          <div className="relative">
                            <input 
                              type="number"
                              value={form.max_discount} onChange={e => setForm({ ...form, max_discount: Number(e.target.value) })}
                              className={getFirstError('max_discount') ? inputErrClass : inputClass} 
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold pointer-events-none">đ</span>
                          </div>
                          {getFirstError('max_discount') && <p className="text-red-500 text-[10px] mt-1 font-medium">{getFirstError('max_discount')}</p>}
                        </div>
                      )}
                    </div>

                    {/* Limit */}
                    <div>
                      <label className={labelClass}>{t('usage_limit')} (0 = {t('unlimited') || 'Không giới hạn'})</label>
                      <input 
                        type="number"
                        value={form.usage_limit} onChange={e => setForm({ ...form, usage_limit: Number(e.target.value) })}
                        className={getFirstError('usage_limit') ? inputErrClass : inputClass} 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Start Date */}
                      <div>
                        <label className={labelClass}>{t('start_date')}</label>
                        <input 
                          type="date"
                          value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })}
                          className={getFirstError('start_date') ? inputErrClass : inputClass} 
                        />
                      </div>
                      {/* End Date */}
                      <div>
                        <label className={labelClass}>{t('end_date')}</label>
                        <input 
                          type="date"
                          value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })}
                          className={getFirstError('end_date') ? inputErrClass : inputClass} 
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                       <input 
                        type="checkbox" 
                        id="is_active"
                        checked={form.is_active} 
                        onChange={e => setForm({ ...form, is_active: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                       />
                       <label htmlFor="is_active" className="text-sm font-semibold text-slate-700 cursor-pointer select-none">
                         {t('active_status')}
                       </label>
                    </div>
                  </div>

                  <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3 sticky bottom-0">
                    <button type="button" onClick={closeModal} className="flex-1 py-3 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-sm transition-colors">{t('cancel')}</button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold text-sm disabled:opacity-50 transition-colors shadow-lg shadow-primary/20">
                      {isSubmitting ? t('processing') : (modalType === 'add' ? t('create_coupon') : t('save_changes'))}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
