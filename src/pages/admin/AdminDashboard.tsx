import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, DollarSign, TrendingUp, PackageCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import api, { fetchAdminDashboardStats } from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    products: 0,
    customers: 0,
    orders: 0,
    revenue: 0,
    recentOrders: []
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const stats = await fetchAdminDashboardStats();
        const ordersRes = await api.get('/admin/orders');
        
        setData({
          ...stats,
          recentOrders: ordersRes.data?.data?.slice(0, 5) || []
        });
      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const stats = [
    { title: t('total_revenue'), value: `${data.revenue.toLocaleString('vi-VN')} VND`, icon: <DollarSign size={22} />, trend: "+12.5%", color: "bg-blue-50 text-blue-600" },
    { title: "Tổng Sản Phẩm", value: data.products, icon: <PackageCheck size={22} />, trend: "+8.2%", color: "bg-emerald-50 text-emerald-600" },
    { title: t('new_customers'), value: data.customers, icon: <Users size={22} />, trend: "+2.4%", color: "bg-violet-50 text-violet-600" },
    { title: "Đơn Hàng", value: data.orders, icon: <TrendingUp size={22} />, trend: "+1.2%", color: "bg-amber-50 text-amber-600" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-[#1a6b4a]">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
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
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                {stat.icon}
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{stat.trend}</span>
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">{stat.title}</p>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">{t('recent_orders')}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{t('latest_system_update')}</p>
            </div>
            <button className="text-primary text-sm font-semibold hover:text-blue-700 transition-colors flex items-center gap-1">
              {t('view_all')} <span className="text-lg">→</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase tracking-wider">
                  <th className="pb-3 font-bold">{t('order_id')}</th>
                  <th className="pb-3 font-bold">{t('customer_col')}</th>
                  <th className="pb-3 font-bold">{t('product_col')}</th>
                  <th className="pb-3 font-bold">{t('date_col')}</th>
                  <th className="pb-3 font-bold">{t('status_col')}</th>
                  <th className="pb-3 font-bold text-right">{t('total_col')}</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-50">
                {data.recentOrders.map((order: any, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 text-slate-500 font-mono text-xs">{order.id}</td>
                    <td className="py-3.5 font-semibold text-slate-900">{order.shipping_name || 'Khách hàng'}</td>
                    <td className="py-3.5 text-slate-600 text-sm">Đơn hàng #{order.id}</td>
                    <td className="py-3.5 text-slate-400 text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="py-3.5">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${
                        (order.status === t('completed_status')) ? 'bg-emerald-50 text-emerald-700' :
                        (order.status === t('processing')) ? 'bg-amber-50 text-amber-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-bold text-slate-900">{order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
        >
          <div className="mb-5">
            <h2 className="text-base font-bold text-slate-900">{t('system_status')}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{t('alerts_notifications')}</p>
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 hover:bg-red-100/70 transition-colors cursor-pointer group">
              <div className="w-9 h-9 rounded-xl bg-white text-red-500 border border-red-100 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
                <AlertCircle size={18} />
              </div>
              <div>
                <p className="font-bold text-sm text-red-900">{t('out_of_stock')}: Sofa Vilan</p>
                <p className="text-xs text-red-500 mt-0.5">{t('out_of_stock_desc')}</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3 hover:bg-blue-100/70 transition-colors cursor-pointer group">
              <div className="w-9 h-9 rounded-xl bg-white text-blue-500 border border-blue-100 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
                <Users size={18} />
              </div>
              <div>
                <p className="font-bold text-sm text-blue-900">{t('new_staff_request')}</p>
                <p className="text-xs text-blue-500 mt-0.5">Nguyễn Thị E {t('new_staff_request_desc')}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
