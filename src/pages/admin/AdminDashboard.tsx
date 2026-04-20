import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  PackageCheck, 
  AlertCircle, 
  Loader2, 
  RefreshCw,
  ShoppingBag,
  ArrowUpRight,
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [paidPendingCount, setPaidPendingCount] = useState(0);
  const [unpaidPendingCount, setUnpaidPendingCount] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Revenue Stats (Year)
      const currentYear = new Date().getFullYear();
      const revenueRes = await api.get(`/admin/revenue/stats?period=year&year=${currentYear}`).catch(() => null);
      if (revenueRes?.data) {
        setRevenueData(revenueRes.data);
      }

      // 2. Fetch Orders to get Recent and Status breakdown
      const ordersRes = await api.get('/admin/orders').catch(() => null);
      if (ordersRes?.data?.data?.data || ordersRes?.data?.data) {
        const allOrders = (ordersRes.data.data.data || ordersRes.data.data).map((o: any) => ({
          ...o,
          order_status: o.order_status || 'pending',
          payment_status: o.payment_status || 'pending'
        }));
        
        setRecentOrders(allOrders.slice(0, 5));
        
        // Count pending and payment statuses
        const pendingOrders = allOrders.filter((o: any) => o.order_status === 'pending');
        setPendingOrdersCount(pendingOrders.length);
        
        const paid = pendingOrders.filter((o: any) => o.payment_status === 'paid' || o.payment_status === 'completed' || o.payment_status === 'Đã thanh toán').length;
        setPaidPendingCount(paid);
        setUnpaidPendingCount(pendingOrders.length - paid);
      }

      // 3. Fetch Total Users
      const usersRes = await api.get('/users').catch(() => null);
      const uTotal = usersRes?.data?.data?.total || usersRes?.data?.total || 0;
      setTotalUsers(uTotal);

      // 4. Fetch Products for Low Stock
      const prodRes = await api.get('/products').catch(() => null);
      let pList = prodRes?.data?.data?.data || prodRes?.data?.data || prodRes?.data || [];
      if (Array.isArray(pList)) {
        const lowStocks = pList.filter((p: any) => {
          let stock = p.stock_quantity ?? p.stock ?? p.quantity ?? 0;
          if (p.variants && p.variants.length > 0) {
            stock = p.variants.reduce((sum: number, v: any) => sum + Number(v.stock_quantity ?? v.stock ?? v.quantity ?? 0), 0);
          }
          return stock > 0 && stock <= 5;
        });
        setLowStockProducts(lowStocks.slice(0, 3));
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '---';
    try {
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit', month: '2-digit'
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || 'pending';
    switch (s) {
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-600"><RefreshCw size={12} className="animate-spin-slow" /> {t('status_pending') || 'Chờ xử lý'}</span>;
      case 'processing':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-600"><ShoppingBag size={12} /> {t('status_processing') || 'Đang chuẩn bị'}</span>;
      case 'shipped':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-600"><RefreshCw size={12} /> {t('status_shipped') || 'Đang giao'}</span>;
      case 'delivered':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600"><AlertCircle size={12} /> {t('status_delivered') || 'Đã giao'}</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-600"><AlertCircle size={12} /> {t('status_cancelled') || 'Đã hủy'}</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 uppercase">{s}</span>;
    }
  };

  const stats = [
    { 
      title: t('total_revenue') || 'Tổng doanh thu (Năm)', 
      value: formatCurrency(revenueData?.total_revenue || 0), 
      icon: <DollarSign size={20} />, 
      color: "from-indigo-500 to-blue-600",
      bgLight: "bg-indigo-50 text-indigo-600",
      link: "/admin/product-stats"
    },
    { 
      title: 'Đơn hàng cần duyệt', 
      value: pendingOrdersCount.toString(), 
      icon: <RefreshCw size={20} className={pendingOrdersCount > 0 ? "animate-pulse" : ""} />, 
      color: "from-amber-500 to-orange-600",
      bgLight: "bg-amber-50 text-amber-600",
      link: "/admin/orders",
      breakdown: [
        { label: "Đã thanh toán", count: paidPendingCount, color: "text-emerald-500" },
        { label: "Chưa thanh toán", count: unpaidPendingCount, color: "text-rose-500" }
      ]
    },
    { 
      title: t('new_customers') || 'Khách hàng', 
      value: totalUsers?.toString() || '0', 
      icon: <Users size={20} />, 
      color: "from-violet-500 to-purple-600",
      bgLight: "bg-violet-50 text-violet-600",
      link: "/admin/users"
    },
    { 
      title: t('avg_order_value') || 'Giá trị đơn TB', 
      value: formatCurrency(revenueData?.average_order_value || 0), 
      icon: <TrendingUp size={20} />, 
      color: "from-blue-500 to-cyan-600",
      bgLight: "bg-blue-50 text-blue-600",
      link: "/admin/product-stats"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200/50 border border-slate-100">
            <LayoutDashboard size={28} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Bảng Điều Khiển</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <p className="text-sm text-slate-400 font-medium">Hệ thống đang hoạt động ổn định</p>
            </div>
          </div>
        </div>

        <button 
          onClick={fetchDashboardData}
          disabled={loading}
          className="group flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-5 py-2.5 rounded-2xl transition-all font-black text-sm shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={18} className={`${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
          Làm mới dữ liệu
        </button>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="py-32 flex flex-col items-center justify-center gap-6 bg-white/50 backdrop-blur-md rounded-3xl border border-slate-100"
          >
             <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-8 h-8 bg-indigo-50 rounded-full"></div>
                </div>
             </div>
             <p className="text-slate-500 font-black tracking-widest uppercase text-xs">Đang đồng bộ dữ liệu...</p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Dynamic Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-white group rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity blur-2xl -mr-8 -mt-8`}></div>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl ${stat.bgLight} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                      {stat.icon}
                    </div>
                    <Link to={stat.link} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                  
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.1em] mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                  
                  {/* Breakdown section for Orders */}
                  {stat.breakdown && (
                    <div className="mt-3 flex gap-4 border-t border-slate-50 pt-3">
                      {stat.breakdown.map((item, idx) => (
                        <div key={idx} className="flex flex-col">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{item.label}</span>
                          <span className={`text-xs font-black ${item.color}`}>{item.count}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Link to={stat.link} className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between group/link">
                    <span className="text-[10px] font-bold text-slate-400 group-hover/link:text-indigo-600 transition-colors">Xem chi tiết</span>
                    <ChevronRight size={12} className="text-slate-300 group-hover/link:text-indigo-600 group-hover/link:translate-x-1 transition-all" />
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Orders - Visual Table */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">Đơn hàng vừa thực hiện</h2>
                    <p className="text-xs text-slate-400 font-medium mt-1">Cập nhật nhanh từ mạng lưới bán hàng</p>
                  </div>
                  <Link to="/admin/orders" className="text-xs font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-2 uppercase tracking-wide">
                    {t('view_all') || 'Tất cả'} <ChevronRight size={14} />
                  </Link>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-slate-400 text-[10px] uppercase font-black tracking-widest">
                        <th className="pb-4 pr-4">Mã đơn</th>
                        <th className="pb-4 px-4">Khách hàng</th>
                        <th className="pb-4 px-4">Ngày mua</th>
                        <th className="pb-4 px-4">Trạng thái</th>
                        <th className="pb-4 pl-4 text-right">Tổng tiền</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {recentOrders.length > 0 ? recentOrders.map((order, i) => (
                        <tr key={order.id || i} className="group hover:bg-slate-50/50 transition-colors border-t border-slate-50">
                          <td className="py-4 pr-4">
                            <span className="font-mono text-xs font-black text-indigo-600 bg-indigo-50/50 px-2 py-1 rounded-md">#{order.id}</span>
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-black text-slate-800 line-clamp-1">
                               {order.user?.full_name || order.user?.name || order.customer_name || 'Khách vãng lai'}
                            </p>
                          </td>
                          <td className="py-4 px-4 text-slate-400 font-bold text-xs">{formatDate(order.created_at)}</td>
                          <td className="py-4 px-4 text-center">
                            {getStatusBadge(order.order_status)}
                          </td>
                          <td className="py-4 pl-4 text-right font-black text-slate-900">{formatCurrency(order.total_amount || 0)}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="text-center py-16 text-slate-300 font-medium italic">Chưa có đơn hàng nào trong danh sách</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sidebar: Alerts & Status */}
              <div className="space-y-8">
                {/* Inventory Alerts */}
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500 opacity-[0.03] blur-3xl -mr-16 -mt-16"></div>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                      <AlertCircle size={20} />
                    </div>
                    <h2 className="text-base font-black text-slate-900 tracking-tight">Cảnh báo tồn kho</h2>
                  </div>

                  <div className="space-y-4">
                    {lowStockProducts.length > 0 ? (
                      lowStockProducts.map(p => (
                        <div key={p.id} className="p-4 rounded-2xl bg-white border border-slate-100 flex items-start gap-4 hover:border-red-200 hover:bg-red-50/10 transition-all group">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
                             {p.image_url ? <img src={p.image_url} alt="" className="w-full h-full object-cover" /> : <PackageCheck size={16} className="m-auto text-slate-300" />}
                          </div>
                          <div className="pt-0.5 flex-1 min-w-0">
                            <p className="font-black text-xs text-slate-800 truncate">{p.name || p.sku}</p>
                            <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-wider">
                              Còn lại: <span className="text-sm">{p.stock_quantity ?? p.stock ?? p.quantity ?? 0}</span> SP
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 rounded-2xl bg-emerald-50/30 border border-dashed border-emerald-100 text-center">
                         <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                            <PackageCheck size={20} className="text-emerald-500" />
                         </div>
                         <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">Kho hàng ổn định</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Info Box */}
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100/50">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 blur-3xl -mr-16 -mt-16"></div>
                   
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                         <Users size={20} className="text-indigo-300" />
                      </div>
                      <h2 className="text-base font-black tracking-tight">Cộng đồng</h2>
                   </div>

                   <p className="text-3xl font-black mb-2">{totalUsers}</p>
                   <p className="text-indigo-300/80 text-xs font-bold uppercase tracking-[0.2em] mb-6">Thành viên đăng ký</p>
                   
                   <Link to="/admin/products" className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group">
                      <span className="text-xs font-black uppercase tracking-wide">Quản lý sản phẩm</span>
                      <ChevronRight size={16} className="text-white/40 group-hover:translate-x-1 transition-transform" />
                   </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
