import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart,
  Calendar,
  DollarSign,
  Package,
  TrendingUp,
  Loader2,
  AlertCircle,
  Tag,
  Eye,
  Filter
} from 'lucide-react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';

// Interfaces for Revenue Stats (New API)
interface RevenueStatItem {
  date?: string;
  hour?: number;
  month?: number;
  quarter?: number;
  label: string;
  revenue: number;
  order_count: number;
  average_order_value: number;
}

interface RevenueStatsResponse {
  period: string;
  period_label: string;
  total_revenue: number;
  total_orders: number;
  average_order_value: number;
  data: RevenueStatItem[];
}

export const AdminProductStats: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // States for Revenue Selection
  const [period, setPeriod] = useState<'day' | 'month' | 'quarter' | 'year'>('month');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedQuarter, setSelectedQuarter] = useState<number>(Math.floor(new Date().getMonth() / 3) + 1);

  // States for Revenue Stats
  const [revenueStats, setRevenueStats] = useState<RevenueStatsResponse | null>(null);

  const { showNotification } = useNotification();
  const { t } = useLanguage();

  useEffect(() => {
    fetchRevenueStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]); // Chỉ tự động tải khi đổi chế độ chính (Ngày/Tháng/Quý/Năm)

  const fetchRevenueStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let params: any = { period };
      if (period === 'day') params.date = selectedDate;
      if (period === 'month') { params.year = selectedYear; params.month = selectedMonth; }
      if (period === 'quarter') { params.year = selectedYear; params.quarter = selectedQuarter; }
      if (period === 'year') params.year = selectedYear;

      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/admin/revenue/stats?${queryString}`);
      // Lưu toàn bộ đối tượng phản hồi vì nó chứa total_revenue, total_orders, v.v. ở cấp cao nhất
      setRevenueStats(response.data);
    } catch (err: any) {
      console.error(err);
      setError(t('error_fetching_stats') || 'Không thể lấy dữ liệu thống kê');
      showNotification(t('error_fetching_stats') || 'Lỗi server khi fetch doanh thu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  // Trích xuất dữ liệu an toàn để sử dụng trong render
  const statsData = revenueStats?.data || [];
  const totalRevenue = revenueStats?.total_revenue || 0;
  const totalOrders = revenueStats?.total_orders || 0;
  const averageOrderValue = revenueStats?.average_order_value || 0;

  // Tính Max Values để vẽ CSS Bars cho xu hướng
  const maxRevenueValue = statsData.reduce((max, item) => Math.max(max, item.revenue), 1) || 1;

  return (
    <div className="space-y-6">
      {/* Row 1: Page Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
            <BarChart size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('nav_product_stats') || 'Thống kê Doanh thu'}</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Phân tích và theo dõi xu hướng doanh thu từ các đơn hàng đã thanh toán.
            </p>
          </div>
        </div>
      </div>

      {/* Row 2: Dedicated Filter Bar */}
      <div className="bg-white p-4 px-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
        {/* Left: Mode Selection */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200 shadow-inner w-full lg:w-auto overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => setPeriod('day')} 
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 ${period === 'day' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {t('day_mode') || 'Theo Ngày'}
          </button>
          <button 
            onClick={() => setPeriod('month')} 
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 ${period === 'month' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {t('month_mode') || 'Theo Tháng'}
          </button>
          <button 
            onClick={() => setPeriod('quarter')} 
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 ${period === 'quarter' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {t('quarter_mode') || 'Theo Quý'}
          </button>
          <button 
            onClick={() => setPeriod('year')} 
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 ${period === 'year' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {t('year_mode') || 'Theo Năm'}
          </button>
        </div>

        {/* Right: Detailed Filters & Confirm Button */}
        <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-3 bg-slate-50/50 px-4 py-1.5 rounded-2xl border border-dashed border-slate-200">
            <Calendar size={16} className="text-slate-400" />
            
            {period === 'day' && (
              <input 
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-none text-sm font-black text-slate-700 focus:ring-0 cursor-pointer p-0"
              />
            )}

            {(period === 'month' || period === 'quarter' || period === 'year') && (
              <div className="flex items-center gap-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">{t('year') || 'Năm'}</span>
                <input
                  type="number"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  min={2000}
                  max={2100}
                  className="w-16 bg-transparent border-none text-sm font-black text-slate-700 focus:ring-0 p-0"
                />
              </div>
            )}

            {period === 'month' && (
              <>
                <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="bg-transparent border-none text-sm font-black text-slate-700 focus:ring-0 cursor-pointer p-0 pr-6"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>{t('month') || 'Tháng'} {m}</option>
                  ))}
                </select>
              </>
            )}

            {period === 'quarter' && (
              <>
                <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>
                <select
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter(Number(e.target.value))}
                  className="bg-transparent border-none text-sm font-black text-slate-700 focus:ring-0 cursor-pointer p-0 pr-6"
                >
                  {[1, 2, 3, 4].map(q => (
                    <option key={q} value={q}>{t('quarter') || 'Quý'} {q}</option>
                  ))}
                </select>
              </>
            )}
          </div>

          <button
            onClick={fetchRevenueStats}
            disabled={loading}
            className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-2xl text-sm font-black transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 min-w-[140px] group"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Eye size={18} className="group-hover:scale-110 transition-transform" />}
            {t('confirm') || 'Xem kết quả'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-6 shadow-lg shadow-indigo-200 text-white"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/80 text-sm font-bold uppercase tracking-wider mb-1">{t('total_revenue_period') || 'Tổng Doanh thu'}</p>
                <h3 className="text-3xl font-black">{formatCurrency(totalRevenue)}</h3>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <DollarSign size={24} className="text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{t('total_orders_count') || 'Tổng Đơn hàng'}</p>
                <h3 className="text-3xl font-black text-slate-900">{formatNumber(totalOrders)}</h3>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <Package size={24} className="text-emerald-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{t('avg_order_value') || 'Giá trị đơn TB'}</p>
                <h3 className="text-3xl font-black text-slate-900">{formatCurrency(averageOrderValue)}</h3>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <TrendingUp size={24} className="text-amber-600" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-indigo-600" size={48} />
          <p className="text-slate-500 font-medium">{t('loading_data') || 'Đang tải dữ liệu...'}</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex items-center justify-center gap-2 border border-red-100 font-bold">
          <AlertCircle size={20} />
          {error}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {/* ================= REVENUE TREND CHART ================= */}
          {revenueStats && (
            <motion.div 
              key={`${period}-${revenueStats.period_label}`}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="text-indigo-500" size={20} />
                  {t('revenue_trend') || 'Biểu đồ xu hướng doanh thu'}: {revenueStats.period_label}
                </h3>

                <div className="space-y-6">
                  {statsData.map((item, index) => {
                    const revenuePercent = maxRevenueValue > 0 ? (item.revenue / maxRevenueValue) * 100 : 0;
                    
                    return (
                      <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="w-full md:w-32 shrink-0 flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-700 whitespace-nowrap">
                            {item.label}
                          </span>
                        </div>
                        
                        <div className="flex-1 w-full">
                          <div className="flex justify-between items-end mb-1">
                            <span className="text-xs font-black text-indigo-700">{formatCurrency(item.revenue)}</span>
                            <span className="text-[10px] uppercase font-bold text-slate-400">{item.order_count} {t('total_orders_count') || 'đơn hàng'}</span>
                          </div>
                          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex items-center p-0.5">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${revenuePercent}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {statsData.length === 0 && (
                    <div className="text-center py-8 text-slate-500 italic text-sm">{t('no_data_available') || 'Không có dữ liệu'}</div>
                  )}
                </div>
              </div>

              {/* Dòng này hiển thị các năm dưới dạng các nút bấm nếu đang chọn chế độ Năm */}
              {period === 'year' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                    <Calendar size={16} className="text-indigo-500" /> {t('select_year') || 'Chọn năm thống kê'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 11 }, (_, i) => 2020 + i).map(y => (
                      <button 
                        key={y}
                        onClick={() => setSelectedYear(y)}
                        className={`px-5 py-2.5 rounded-xl border text-sm font-black transition-all duration-300 ${
                          selectedYear === y 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100 scale-105' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-400 hover:text-indigo-600 hover:bg-white'
                        }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Data Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                  <h3 className="text-base font-black text-slate-900">{t('detailed_stats') || 'Bảng Số liệu Chi tiết'}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="px-6 py-4">{t('time_col') || 'Thời gian'}</th>
                        <th className="px-6 py-4">{t('total_orders_count') || 'Số đơn hàng'}</th>
                        <th className="px-6 py-4">{t('avg_order_value') || 'Giá trị TB'}</th>
                        <th className="px-6 py-4 text-right">{t('total_revenue') || 'Tổng Doanh Thu'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {statsData.map((item, index) => (
                        <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-black text-slate-800">{item.label}</td>
                          <td className="px-6 py-4 text-slate-600 font-bold whitespace-nowrap">{item.order_count}</td>
                          <td className="px-6 py-4 text-slate-600 font-medium">{formatCurrency(item.average_order_value)}</td>
                          <td className="px-6 py-4 text-right font-black text-indigo-600">{formatCurrency(item.revenue)}</td>
                        </tr>
                      ))}
                      {statsData.length === 0 && (
                         <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">{t('no_data_available') || 'Không có dữ liệu.'}</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};
