import React from 'react';
import { motion } from 'motion/react';
import { Users, DollarSign, PackageCheck, TrendingUp, AlertCircle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const stats = [
    { title: "Tổng Doanh Thu", value: "840.500.000 ₫", icon: <DollarSign size={22} />, trend: "+12.5%", color: "bg-amber-50 text-amber-600" },
    { title: "Sản Phẩm Đã Bán", value: "1,245", icon: <PackageCheck size={22} />, trend: "+8.2%", color: "bg-emerald-50 text-emerald-600" },
    { title: "Khách Hàng Mới", value: "382", icon: <Users size={22} />, trend: "+2.4%", color: "bg-violet-50 text-violet-600" },
    { title: "Tăng Trưởng", value: "14.2%", icon: <TrendingUp size={22} />, trend: "+1.2%", color: "bg-blue-50 text-blue-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                {stat.icon}
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{stat.trend}</span>
            </div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{stat.title}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
           <h2 className="text-lg font-bold mb-4">Hoạt động gần đây</h2>
           <p className="text-sm text-slate-500">Toàn bộ hệ thống đang vận hành ổn định.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
           <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><AlertCircle size={20} className="text-red-500" /> Cảnh báo</h2>
           <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
              <p className="text-sm font-bold text-red-800 dark:text-red-400">Sắp hết hàng: Sofa Nordic</p>
              <p className="text-xs text-red-600 mt-1">Vui lòng nhập thêm hàng sớm.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
