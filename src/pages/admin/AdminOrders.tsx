import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ClipboardList,
  Search,
  Eye,
  Filter,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Ban,
  Calendar,
  MapPin,
  CreditCard,
  User
} from 'lucide-react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  variant_id: number | null;
  quantity: number;
  price: number;
  product_name?: string;
  image?: string;
}

interface OrderData {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_status: string;
  shipping_address: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  user?: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
}

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showNotification } = useNotification();
  const { t } = useLanguage();

  useEffect(() => {
    fetchOrders(0);
  }, []);

  const fetchOrders = async (page: number, cursor?: string | null) => {
    try {
      setLoading(true);
      const url = cursor 
        ? `/admin/orders?cursor=${cursor}` 
        : `/admin/orders?page=${page + 1}`;
      
      const response = await api.get(url);
      const data = response.data.data ? response.data.data : response.data;
      
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
         setOrders(data.orders || []);
      }

      setNextCursor(response.data.next_cursor || null);
    } catch (err: any) {
      console.error(err);
      showNotification('Không thể lấy danh sách đơn hàng', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (nextCursor) {
      setCurrentPage(prev => prev + 1);
      fetchOrders(currentPage + 1, nextCursor);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      fetchOrders(currentPage - 1);
    }
  };

  const openOrderDetail = async (order: OrderData) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    try {
      setLoadingDetail(true);
      const response = await api.get(`/admin/orders/${order.id}`);
      setSelectedOrder(response.data.data || response.data);
    } catch (err: any) {
      console.error(err);
      showNotification('Không thể lấy chi tiết đơn hàng', 'error');
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = async (orderId: number, field: 'order_status' | 'payment_status', value: string) => {
    try {
      setIsSubmitting(true);
      const currentOrder = orders.find(o => o.id === orderId) || selectedOrder;
      
      const payload = {
        order_status: currentOrder?.status,
        payment_status: currentOrder?.payment_status,
        [field]: value
      };
      
      if (field === 'order_status') payload.order_status = value;
      if (field === 'payment_status') payload.payment_status = value;

      await api.put(`/admin/orders/${orderId}/status`, payload);
      
      showNotification('Đã cập nhật trạng thái đơn hàng', 'success');
      
      // Update local state
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: payload.order_status || selectedOrder.status, payment_status: payload.payment_status || selectedOrder.payment_status });
      }
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: payload.order_status || o.status, payment_status: payload.payment_status || o.payment_status } : o));
    } catch (err: any) {
      console.error(err);
      showNotification('Lỗi khi cập nhật trạng thái', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-600"><Clock size={12} /> {t('status_pending') || 'Chờ xử lý'}</span>;
      case 'processing':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-600"><Package size={12} /> {t('status_processing') || 'Đang chuẩn bị'}</span>;
      case 'shipped':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-600"><Truck size={12} /> {t('status_shipped') || 'Đang giao'}</span>;
      case 'delivered':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600"><CheckCircle size={12} /> {t('status_delivered') || 'Đã giao'}</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-600"><Ban size={12} /> {t('status_cancelled') || 'Đã hủy'}</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600">{status}</span>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-700">{t('payment_pending') || 'Chưa thanh toán'}</span>;
      case 'paid':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">{t('payment_paid') || 'Đã thanh toán'}</span>;
      case 'failed':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700">{t('payment_failed') || 'Lỗi'}</span>;
      case 'refunded':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">{t('payment_refunded') || 'Đã hoàn tiền'}</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600">{status}</span>;
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toString().includes(searchQuery) ||
    (o.user && o.user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (o.user && o.user.phone.includes(searchQuery))
  );

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner">
            <ClipboardList size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('manage_orders') || 'Quản lý Đơn hàng'}</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              {t('manage_orders_desc') || 'Theo dõi và cập nhật trạng thái các đơn đặt hàng'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={t('search_orders') || "Tìm mã đơn, tên, sđt..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium shadow-sm"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-6 py-4">{t('order_id') || 'Mã ĐH'}</th>
                    <th className="px-6 py-4">{t('customer') || 'Khách hàng'}</th>
                    <th className="px-6 py-4">{t('order_date') || 'Ngày đặt'}</th>
                    <th className="px-6 py-4">{t('total_amount') || 'Tổng tiền'}</th>
                    <th className="px-6 py-4">{t('payment_status') || 'Trạng thái phí'}</th>
                    <th className="px-6 py-4">{t('shipping_status') || 'Trạng thái Giao'}</th>
                    <th className="px-6 py-4 text-right">{t('actions') || 'Thao tác'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <ClipboardList size={48} className="text-slate-300 mb-2" />
                          <p className="font-semibold text-base">{t('no_orders_found') || 'Không tìm thấy đơn hàng nào'}</p>
                          <p className="text-sm">{t('try_different_search') || 'Hãy thử tìm kiếm với từ khóa khác.'}</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            #{order.id}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {order.user ? (
                            <div>
                              <p className="font-bold text-slate-900">{order.user.name}</p>
                              <p className="text-xs text-slate-500">{order.user.phone}</p>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Khách vãng lai</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium text-xs">
                          {new Date(order.created_at).toLocaleDateString('vi-VN', {
                            day: '2-digit', month: '2-digit', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4 font-black text-blue-600">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.total_amount))}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1 items-start">
                            {getPaymentBadge(order.payment_status)}
                            <span className="text-[10px] text-slate-400 font-semibold">{order.payment_method?.toUpperCase()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => openOrderDetail(order)} 
                            className="inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-xs font-bold"
                          >
                            <Eye size={14} /> Chi tiết
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Footer */}
            {!loading && orders.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
                <p className="text-sm text-slate-500 font-medium">
                  {t('page') || 'Trang'} <span className="text-slate-900 font-bold">{currentPage + 1}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                      currentPage === 0 ? 'text-slate-400 bg-slate-100 cursor-not-allowed' : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <ChevronLeft size={16} /> {t('back') || 'Quay lại'}
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={!nextCursor}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                      !nextCursor ? 'text-slate-400 bg-slate-100 cursor-not-allowed' : 'text-blue-600 bg-blue-50 border border-transparent hover:bg-blue-100'
                    }`}
                  >
                    {t('next') || 'Trang tiếp'} <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
                <div>
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    {t('order_details') || 'Chi tiết Đơn hàng'} <span className="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">#{selectedOrder.id}</span>
                  </h3>
                  <p className="text-sm text-slate-500 font-medium mt-1 flex items-center gap-1">
                    <Calendar size={14} /> 
                    {new Date(selectedOrder.created_at).toLocaleString('vi-VN')}
                  </p>
                </div>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50 custom-scrollbar">
                {loadingDetail ? (
                  <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column (Main Info) */}
                    <div className="lg:col-span-2 space-y-6">
                      
                      {/* Customer Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm">
                              <User size={16} className="text-blue-500" /> Thông tin Khách hàng
                            </h4>
                            <div className="space-y-3 text-sm">
                              <div>
                                <span className="text-slate-500 block text-xs">Họ tên</span>
                                <span className="font-bold text-slate-900">{selectedOrder.user?.name || "N/A"}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block text-xs">Email</span>
                                <span className="font-medium text-slate-900">{selectedOrder.user?.email || "N/A"}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block text-xs">Số điện thoại</span>
                                <span className="font-medium text-slate-900">{selectedOrder.user?.phone || "N/A"}</span>
                              </div>
                            </div>
                         </div>
                         <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm">
                              <MapPin size={16} className="text-blue-500" /> Địa chỉ Giao hàng
                            </h4>
                            <p className="text-sm font-medium text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                              {selectedOrder.shipping_address || "Chưa cung cấp"}
                            </p>
                         </div>
                      </div>

                      {/* Products List */}
                      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 font-bold text-slate-900 flex items-center gap-2">
                          <Package size={18} className="text-blue-500" /> Sản phẩm ({selectedOrder.items?.length || 0})
                        </div>
                        <div className="divide-y divide-slate-100">
                          {selectedOrder.items && selectedOrder.items.length > 0 ? (
                            selectedOrder.items.map((item) => (
                              <div key={item.id} className="p-4 flex items-center gap-4">
                                <div className="w-16 h-16 bg-slate-100 rounded-xl shrink-0 overflow-hidden border border-slate-200">
                                  {item.image ? (
                                    <img src={item.image} alt="Sản phẩm" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300"><Package size={24} /></div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-slate-900 text-sm leading-tight">{item.product_name || `Sản phẩm #${item.product_id}`}</h4>
                                  <div className="text-xs text-slate-500 mt-1 font-medium">SL: {item.quantity} {item.variant_id ? `| Biến thể #${item.variant_id}` : ''}</div>
                                </div>
                                <div className="text-right">
                                  <div className="font-black text-slate-900">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(item.price))}
                                  </div>
                                  <div className="text-xs text-slate-400 font-medium">
                                    Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(item.price) * item.quantity)}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-8 text-center text-slate-500 italic text-sm">Không có thông tin sản phẩm.</div>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Right Column (Status & Payment) */}
                    <div className="space-y-6">
                      
                      {/* Status Update Card */}
                      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 border-t-4 border-t-blue-500">
                        <h4 className="font-black text-slate-900 mb-5 text-base">Cập nhật Trạng thái</h4>
                        
                        <div className="space-y-5">
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Trạng thái Giao hàng</label>
                            <select 
                              value={selectedOrder.status}
                              onChange={(e) => handleStatusChange(selectedOrder.id, 'order_status', e.target.value)}
                              disabled={isSubmitting}
                              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                            >
                              <option value="pending">⏳ Chờ xử lý</option>
                              <option value="processing">📦 Đang chuẩn bị hàng</option>
                              <option value="shipped">🚚 Đang giao</option>
                              <option value="delivered">✅ Đã giao thành công</option>
                              <option value="cancelled">❌ Đã hủy</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Trạng thái Thanh toán</label>
                            <select 
                              value={selectedOrder.payment_status}
                              onChange={(e) => handleStatusChange(selectedOrder.id, 'payment_status', e.target.value)}
                              disabled={isSubmitting}
                              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                            >
                              <option value="pending">Chưa thanh toán</option>
                              <option value="paid">Đã thanh toán</option>
                              <option value="failed">Thanh toán thất bại</option>
                              <option value="refunded">Đã hoàn tiền</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Payment Summary */}
                      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-sm p-6 text-white">
                         <h4 className="font-bold flex items-center gap-2 text-sm text-slate-300 mb-4 opacity-80">
                           <CreditCard size={16} /> Thanh toán
                         </h4>
                         
                         <div className="space-y-3 mb-6">
                           <div className="flex justify-between text-sm">
                             <span className="text-slate-400">Phương thức</span>
                             <span className="font-bold uppercase tracking-wider">{selectedOrder.payment_method || 'COD'}</span>
                           </div>
                           <div className="flex justify-between text-sm">
                             <span className="text-slate-400">Trạng thái</span>
                             <span>
                               {selectedOrder.payment_status === 'paid' ? <span className="text-emerald-400 font-bold">Đã thanh toán</span> : 
                                selectedOrder.payment_status === 'pending' ? <span className="text-amber-400 font-bold">Chưa thanh toán</span> : 
                                <span className="text-red-400 font-bold">{selectedOrder.payment_status}</span>}
                             </span>
                           </div>
                         </div>
                         
                         <div className="pt-4 border-t border-slate-700/50">
                           <div className="flex justify-between items-end">
                             <span className="text-slate-400 text-sm font-medium">Tổng thanh toán</span>
                             <span className="text-2xl font-black text-white leading-none">
                               {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(selectedOrder.total_amount))}
                             </span>
                           </div>
                         </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
