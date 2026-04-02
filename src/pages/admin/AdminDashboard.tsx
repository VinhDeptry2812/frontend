import React from 'react';
import { motion } from 'motion/react';
import { Users, DollarSign, TrendingUp, PackageCheck, AlertCircle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const stats = [
    { title: "Tổng Doanh Thu", value: "$42,500", icon: <DollarSign size={22} />, trend: "+12.5%", color: "bg-blue-50 text-blue-600" },
    { title: "Sản Phẩm Đã Bán", value: "1,245", icon: <PackageCheck size={22} />, trend: "+8.2%", color: "bg-emerald-50 text-emerald-600" },
    { title: "Khách Hàng Mới", value: "382", icon: <Users size={22} />, trend: "+2.4%", color: "bg-violet-50 text-violet-600" },
    { title: "Growth", value: "14.2%", icon: <TrendingUp size={22} />, trend: "+1.2%", color: "bg-amber-50 text-amber-600" },
  ];

  const recentOrders = [
    { id: "ORD-001", customer: "Nguyễn Văn A", product: "Sofa Elysium", date: "24/03/2026", status: "Hoàn thành", amount: "$2,400" },
    { id: "ORD-002", customer: "Trần Thị B", product: "Bàn Ăn Cẩm Thạch", date: "23/03/2026", status: "Đang xử lý", amount: "$1,850" },
    { id: "ORD-003", customer: "Lê Văn C", product: "Ghế Lười Thư Giãn", date: "22/03/2026", status: "Đang giao", amount: "$450" },
    { id: "ORD-004", customer: "Pham Minh D", product: "Đèn Cầu Lê", date: "22/03/2026", status: "Hoàn thành", amount: "$280" },
  ];

  return (
    <div className="space-y-6">
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
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{stat.title}</p>
            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
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
              <h2 className="text-base font-bold text-slate-900">Đơn Hàng Gần Đây</h2>
              <p className="text-xs text-slate-400 mt-0.5">Cập nhật mới nhất từ hệ thống</p>
            </div>
            <button className="text-primary text-sm font-semibold hover:text-blue-700 transition-colors">Xem tất cả →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Mã ĐH</th>
                  <th className="pb-3 font-semibold">Khách hàng</th>
                  <th className="pb-3 font-semibold">Sản phẩm</th>
                  <th className="pb-3 font-semibold">Ngày</th>
                  <th className="pb-3 font-semibold">Trạng thái</th>
                  <th className="pb-3 font-semibold text-right">Tổng</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-50">
                {recentOrders.map((order, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 text-slate-500 font-mono text-xs">{order.id}</td>
                    <td className="py-3.5 font-semibold text-slate-900">{order.customer}</td>
                    <td className="py-3.5 text-slate-600 text-sm">{order.product}</td>
                    <td className="py-3.5 text-slate-400 text-xs">{order.date}</td>
                    <td className="py-3.5">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        order.status === 'Hoàn thành' ? 'bg-emerald-50 text-emerald-700' :
                        order.status === 'Đang xử lý' ? 'bg-amber-50 text-amber-700' :
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
            <h2 className="text-base font-bold text-slate-900">Trạng Thái Hệ Thống</h2>
            <p className="text-xs text-slate-400 mt-0.5">Cảnh báo và thông báo mới</p>
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 hover:bg-red-100/70 transition-colors cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-white text-red-500 border border-red-100 flex items-center justify-center shrink-0 shadow-sm">
                <AlertCircle size={18} />
              </div>
              <div>
                <p className="font-semibold text-sm text-red-900">Hết hàng: Sofa Vilan</p>
                <p className="text-xs text-red-500 mt-0.5">Chỉ còn 0 sản phẩm trong kho.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3 hover:bg-blue-100/70 transition-colors cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-white text-blue-500 border border-blue-100 flex items-center justify-center shrink-0 shadow-sm">
                <Users size={18} />
              </div>
              <div>
                <p className="font-semibold text-sm text-blue-900">Yêu cầu đăng ký nhân viên mới</p>
                <p className="text-xs text-blue-500 mt-0.5">Nguyễn Thị E đã yêu cầu quyền truy cập admin.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
