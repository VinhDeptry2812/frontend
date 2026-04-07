import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, DollarSign, TrendingUp, PackageCheck, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProductsSold, setTotalProductsSold] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Revenue & Products Sold from product stats (last 30 days)
      const statsRes = await api.get('/admin/products/stats/by-price?days=30').catch(() => null);
      if (statsRes?.data?.data?.price_ranges) {
        const ranges = statsRes.data.data.price_ranges;
        const rev = ranges.reduce((acc: number, cur: any) => acc + (cur.total_revenue || 0), 0);
        const sold = ranges.reduce((acc: number, cur: any) => acc + (cur.total_quantity_sold || 0), 0);
        setTotalRevenue(rev);
        setTotalProductsSold(sold);
      }

      // 2. Fetch Recent Orders
      const ordersRes = await api.get('/admin/orders').catch(() => null);
      if (ordersRes?.data?.data?.data) {
        setRecentOrders(ordersRes.data.data.data.slice(0, 5)); // Get top 5
      } else if (ordersRes?.data?.data) { // fallback
         setRecentOrders(ordersRes.data.data.slice(0, 5));
      } else if (Array.isArray(ordersRes?.data)) {
        setRecentOrders(ordersRes.data.slice(0, 5));
      }

      // 3. Fetch Total Users
      const usersRes = await api.get('/users').catch(() => null);
      if (usersRes?.data?.data?.total) {
        setTotalUsers(usersRes.data.data.total);
      } else if (usersRes?.data?.total) {
        setTotalUsers(usersRes.data.total);
      } else if (Array.isArray(usersRes?.data?.data?.data)) {
        setTotalUsers(usersRes.data.data.data.length);
      } else if (Array.isArray(usersRes?.data)) {
        setTotalUsers(usersRes.data.length);
      }

      // 4. Fetch Products to find Low Stock items (Fake Alert logic using first page)
      const prodRes = await api.get('/products').catch(() => null);
      let pList = [];
      if (prodRes?.data?.data?.data) pList = prodRes.data.data.data;
      else if (prodRes?.data?.data) pList = prodRes.data.data;
      else if (Array.isArray(prodRes?.data)) pList = prodRes.data;

      const lowStocks = pList.filter((p: any) => {
        let stock = p.stock_quantity ?? p.stock ?? p.quantity ?? 0;
        // If it has variants, we might need deep check, but for dashboard simple check is enough
        if (p.variants && p.variants.length > 0) {
           stock = p.variants.reduce((sum: number, v: any) => sum + Number(v.stock_quantity ?? v.stock ?? v.quantity ?? 0), 0);
        }
        return stock > 0 && stock <= 5; // near empty
      });
      setLowStockProducts(lowStocks.slice(0, 3)); // Show top 3 alerts

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '---';
    try {
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  const formatOrderStatus = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang chuẩn bị';
      case 'shipped': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const stats = [
    { title: t('total_revenue') || 'Tổng Doanh Thu (30 Ngày)', value: formatCurrency(totalRevenue), icon: <DollarSign size={22} />, trend: "", color: "bg-blue-50 text-blue-600" },
    { title: t('products_sold') || 'Sản Phẩm Đã Bán', value: totalProductsSold.toString(), icon: <PackageCheck size={22} />, trend: "", color: "bg-emerald-50 text-emerald-600" },
    { title: t('new_customers') || 'Tổng Khách Hàng', value: totalUsers ? totalUsers.toString() : '---', icon: <Users size={22} />, trend: "", color: "bg-violet-50 text-violet-600" },
    { title: t('growth_rate') || 'Đơn hàng gần đây', value: recentOrders.length.toString(), icon: <TrendingUp size={22} />, trend: "", color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tổng Quan Hệ Thống</h1>
          <p className="text-sm text-slate-500 font-medium">Theo dõi các chỉ số quan trọng và thông báo mới nhất.</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 px-4 py-2 rounded-xl transition-all font-bold text-sm shadow-sm active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Làm mới
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
           <Loader2 className="animate-spin text-primary" size={40} />
           <p className="text-slate-500 font-medium tracking-wide">Đang đồng bộ dữ liệu hệ thống...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center shadow-inner`}>
                    {stat.icon}
                  </div>
                  {stat.trend && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{stat.trend}</span>
                  )}
                </div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">{stat.title}</p>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight line-clamp-1">{stat.value}</h3>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900">{t('recent_orders') || 'Đơn hàng gần đây'}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{t('latest_system_update') || 'Cập nhật mới nhất từ hệ thống'}</p>
                </div>
                <Link to="/admin/orders" className="text-primary text-sm font-semibold hover:text-blue-700 transition-colors flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg">
                  {t('view_all') || 'Xem tất cả'} <span className="text-lg">→</span>
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-wider">
                      <th className="px-4 py-3 font-bold rounded-l-xl opacity-80">{t('order_id') || 'Mã Đơn'}</th>
                      <th className="px-4 py-3 font-bold opacity-80">{t('customer_col') || 'Khách hàng'}</th>
                      <th className="px-4 py-3 font-bold opacity-80">{t('date_col') || 'Ngày'}</th>
                      <th className="px-4 py-3 font-bold opacity-80">{t('status_col') || 'Trạng thái'}</th>
                      <th className="px-4 py-3 font-bold text-right rounded-r-xl opacity-80">{t('total_col') || 'Tổng'}</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-50">
                    {recentOrders.length > 0 ? recentOrders.map((order, i) => (
                      <tr key={order.id || i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4 text-primary font-mono text-xs font-bold">#{order.id}</td>
                        <td className="px-4 py-4 font-semibold text-slate-900">
                           {order.user?.full_name || order.user?.name || order.customer_name || 'Khách vãng lai'}
                        </td>
                        <td className="px-4 py-4 text-slate-500 font-medium text-xs">{formatDate(order.created_at)}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${
                            order.order_status === 'delivered' || order.order_status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            order.order_status === 'processing' || order.order_status === 'shipped' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                            order.order_status === 'cancelled' ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {formatOrderStatus(order.order_status)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right font-black text-slate-900">{formatCurrency(order.total_amount || 0)}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-slate-400">Không có đơn hàng nào gần đây.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* System Status / Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col"
            >
              <div className="mb-5">
                <h2 className="text-base font-bold text-slate-900">{t('system_status') || 'Trạng thái Hệ thống'}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{t('alerts_notifications') || 'Cảnh báo và thông báo mới'}</p>
              </div>
              <div className="space-y-4 flex-1">
                {lowStockProducts.length > 0 ? (
                  lowStockProducts.map(p => (
                    <div key={p.id} className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 hover:bg-red-100 transition-colors group">
                      <div className="w-10 h-10 rounded-xl bg-white text-red-500 border border-red-100 flex items-center justify-center shrink-0 shadow-sm">
                        <AlertCircle size={20} />
                      </div>
                      <div className="pt-0.5">
                        <p className="font-bold text-sm text-red-900 line-clamp-1">{p.name || p.sku}</p>
                        <p className="text-xs text-red-600 font-medium mt-1">
                          Sắp hết hàng. Chỉ còn: <span className="font-bold text-red-700 mx-1">{p.stock_quantity ?? p.stock ?? p.quantity ?? 0}</span> sản phẩm
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                   <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white text-emerald-500 border border-emerald-100 flex items-center justify-center shrink-0 shadow-sm">
                         <PackageCheck size={20} />
                      </div>
                      <div className="pt-0.5">
                         <p className="font-bold text-sm text-emerald-900">Kho hàng ổn định</p>
                         <p className="text-xs text-emerald-600 font-medium mt-1">Không có sản phẩm nào sắp hết hàng.</p>
                      </div>
                   </div>
                )}

                {/* Gợi ý tĩnh cho Users */}
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-start gap-3 mt-4">
                   <div className="w-10 h-10 rounded-xl bg-white text-indigo-500 border border-indigo-100 flex items-center justify-center shrink-0 shadow-sm">
                      <Users size={20} />
                   </div>
                   <div className="pt-0.5">
                      <p className="font-bold text-sm text-indigo-900">Cổng truy cập tốt</p>
                      <p className="text-xs text-indigo-600 font-medium mt-1">Đang có {totalUsers} người dùng đăng ký trong hệ thống.</p>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};
