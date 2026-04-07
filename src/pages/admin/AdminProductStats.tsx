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

// Interfaces for Price Stats
interface PriceRangeStat {
  range: string;
  min_price: number;
  max_price: number;
  product_count: number;
  total_quantity_sold: number;
  total_revenue: number;
  average_selling_price: number;
}

interface PriceStatsResponse {
  period_days: number;
  price_ranges: PriceRangeStat[];
}

// Interfaces for Brand Stats
interface BrandStat {
  brand: string | null;
  product_count: number;
  total_views: number;
  total_quantity_sold: number;
  total_revenue: number;
  average_price: number;
}

interface BrandStatsResponse {
  period_days: number;
  sort_by: string;
  brands: BrandStat[];
}

export const AdminProductStats: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'price' | 'brand'>('price');
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState<number>(30); // Default 30 days
  const [error, setError] = useState<string | null>(null);

  // States for Price Range Stats
  const [priceStats, setPriceStats] = useState<PriceStatsResponse | null>(null);

  // States for Brand Stats
  const [brandStats, setBrandStats] = useState<BrandStatsResponse | null>(null);
  const [brandLimit, setBrandLimit] = useState<number>(20);
  const [brandSortBy, setBrandSortBy] = useState<'revenue' | 'quantity' | 'views'>('revenue');

  const { showNotification } = useNotification();
  const { t } = useLanguage();

  useEffect(() => {
    if (activeTab === 'price') {
      fetchPriceStats();
    } else {
      fetchBrandStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, days, brandLimit, brandSortBy]);

  const fetchPriceStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/admin/products/stats/by-price?days=${days}`);
      setPriceStats(response.data.data || response.data);
    } catch (err: any) {
      console.error(err);
      setError(t('error_fetching_stats') || 'Không thể lấy dữ liệu thống kê');
      showNotification(t('error_fetching_stats') || 'Lỗi server khi fetch giá', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchBrandStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/admin/products/stats/by-brand?days=${days}&limit=${brandLimit}&sort_by=${brandSortBy}`);
      setBrandStats(response.data.data || response.data);
    } catch (err: any) {
      console.error(err);
      setError(t('error_fetching_stats') || 'Không thể lấy dữ liệu thống kê');
      showNotification(t('error_fetching_stats') || 'Lỗi server khi fetch Brand', 'error');
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

  // Tính toán global values (for Summary Cards)
  const totalRevenue = activeTab === 'price' 
    ? (priceStats?.price_ranges.reduce((sum, item) => sum + item.total_revenue, 0) || 0)
    : (brandStats?.brands.reduce((sum, item) => sum + item.total_revenue, 0) || 0);
    
  const totalSold = activeTab === 'price'
    ? (priceStats?.price_ranges.reduce((sum, item) => sum + item.total_quantity_sold, 0) || 0)
    : (brandStats?.brands.reduce((sum, item) => sum + item.total_quantity_sold, 0) || 0);

  // Tính Max Values để vẽ CSS Bars
  const maxPriceRevenue = priceStats?.price_ranges.reduce((max, item) => Math.max(max, item.total_revenue), 1) || 1;
  const maxBrandStatValue = brandStats?.brands.reduce((max, item) => {
    if (brandSortBy === 'revenue') return Math.max(max, item.total_revenue);
    if (brandSortBy === 'quantity') return Math.max(max, item.total_quantity_sold);
    return Math.max(max, item.total_views);
  }, 1) || 1;

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-inner">
            <BarChart size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('nav_product_stats') || 'Thống kê Sản phẩm'}</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Phân tích hiệu suất bán hàng qua các lăng kính đa chiều.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Calendar size={18} className="text-slate-400" />
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm"
          >
            <option value={7}>{t('last_7_days') || '7 ngày qua'}</option>
            <option value={30}>{t('last_30_days') || '30 ngày qua'}</option>
            <option value={90}>{t('last_90_days') || '90 ngày qua'}</option>
            <option value={365}>{t('last_365_days') || '1 năm qua'}</option>
            <option value={9999}>{t('all_time') || 'Tất cả thời gian'}</option>
          </select>
        </div>
      </div>

      {/* TABS NATIVE UI */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 w-max rounded-xl">
         <button 
           onClick={() => setActiveTab('price')} 
           className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
             activeTab === 'price' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
           }`}
         >
           <DollarSign size={16} /> {t('tab_by_price') || 'Theo Khoảng Giá'}
         </button>
         <button 
           onClick={() => setActiveTab('brand')} 
           className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
             activeTab === 'brand' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
           }`}
         >
           <Tag size={16} /> {t('tab_by_brand') || 'Theo Thương Hiệu'}
         </button>
      </div>

      {/* Summary Cards */}
      {(!loading || activeTab) && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{t('total_items_sold') || 'Tổng Sản phẩm Bán ra'}</p>
                <h3 className="text-3xl font-black text-slate-900">{formatNumber(totalSold)}</h3>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <Package size={24} className="text-emerald-600" />
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
          {/* ================= TAB 1: BY PRICE RANGE ================= */}
          {activeTab === 'price' && priceStats && (
            <motion.div 
              key="price-tab"
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="text-indigo-500" size={20} />
                  {t('revenue_by_price_range') || 'Doanh thu theo Phân khúc giá'}
                </h3>

                <div className="space-y-6">
                  {priceStats.price_ranges.map((item, index) => {
                    const revenuePercent = maxPriceRevenue > 0 ? (item.total_revenue / maxPriceRevenue) * 100 : 0;
                    
                    return (
                      <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="w-full md:w-48 shrink-0 flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm border border-slate-200">
                            {index + 1}
                          </span>
                          <span className="font-bold text-sm text-slate-700 whitespace-nowrap">
                            {item.range}
                          </span>
                        </div>
                        
                        <div className="flex-1 w-full">
                          <div className="flex justify-between items-end mb-1">
                            <span className="text-xs font-black text-indigo-700">{formatCurrency(item.total_revenue)}</span>
                            <span className="text-[10px] uppercase font-bold text-slate-400">{item.total_quantity_sold} {t('items_sold') || 'đã bán'}</span>
                          </div>
                          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
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
                  {priceStats.price_ranges.length === 0 && (
                    <div className="text-center py-8 text-slate-500 italic text-sm">{t('no_data_available') || 'Không có dữ liệu'}</div>
                  )}
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                  <h3 className="text-base font-black text-slate-900">{t('detailed_stats') || 'Bảng Số liệu Chi tiết'}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="px-6 py-4">{t('price_range') || 'Phân khúc giá'}</th>
                        <th className="px-6 py-4">{t('product_count') || 'Số mã SP'}</th>
                        <th className="px-6 py-4">{t('items_sold') || 'Đã bán'}</th>
                        <th className="px-6 py-4">{t('avg_price') || 'Giá bán TB'}</th>
                        <th className="px-6 py-4 text-right">{t('total_revenue') || 'Tổng Doanh Thu'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {priceStats.price_ranges.map((item, index) => (
                        <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-black text-slate-800">{item.range}</td>
                          <td className="px-6 py-4 text-slate-600 font-medium whitespace-nowrap">{item.product_count} SP</td>
                          <td className="px-6 py-4 font-bold text-emerald-600">+{item.total_quantity_sold}</td>
                          <td className="px-6 py-4 text-slate-600 font-medium">{formatCurrency(item.average_selling_price)}</td>
                          <td className="px-6 py-4 text-right font-black text-indigo-600">{formatCurrency(item.total_revenue)}</td>
                        </tr>
                      ))}
                      {priceStats.price_ranges.length === 0 && (
                         <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">{t('no_data_available') || 'Không có dữ liệu.'}</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= TAB 2: BY BRAND ================= */}
          {activeTab === 'brand' && brandStats && (
            <motion.div 
              key="brand-tab"
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              {/* Brand Extra Filters */}
              <div className="flex flex-col sm:flex-row gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm items-center justify-between">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="text-indigo-500" size={18} /> Lọc Top Thương hiệu
                </h3>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                   <div className="flex items-center gap-2">
                     <span className="text-xs font-bold text-slate-500 uppercase">{t('sort_by') || 'Sắp xếp theo:'}</span>
                     <select
                       value={brandSortBy}
                       onChange={(e) => setBrandSortBy(e.target.value as 'revenue' | 'quantity' | 'views')}
                       className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 cursor-pointer"
                     >
                       <option value="revenue">{t('sort_revenue') || 'Doanh thu'}</option>
                       <option value="quantity">{t('sort_quantity') || 'Bán chạy'}</option>
                       <option value="views">{t('sort_views') || 'Lượt xem'}</option>
                     </select>
                   </div>
                   
                   <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>

                   <div className="flex items-center gap-2">
                     <span className="text-xs font-bold text-slate-500 uppercase">{t('limit_label') || 'Hiển thị:'}</span>
                     <select
                       value={brandLimit}
                       onChange={(e) => setBrandLimit(Number(e.target.value))}
                       className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 cursor-pointer"
                     >
                       <option value={10}>Top 10</option>
                       <option value={20}>Top 20</option>
                       <option value={50}>Top 50</option>
                     </select>
                   </div>
                </div>
              </div>

              {/* Bar Chart relative to Sort Criterion */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="space-y-6">
                  {brandStats.brands.map((item, index) => {
                    let valueToRender = item.total_revenue;
                    let displayValue = formatCurrency(valueToRender);
                    let subDisplay = `${item.total_quantity_sold} đã bán`;

                    if (brandSortBy === 'quantity') {
                      valueToRender = item.total_quantity_sold;
                      displayValue = `${formatNumber(valueToRender)} S.Phẩm`;
                      subDisplay = formatCurrency(item.total_revenue);
                    } else if (brandSortBy === 'views') {
                      valueToRender = item.total_views || 0;
                      displayValue = `${formatNumber(valueToRender)} Lượt Xem`;
                      subDisplay = `${item.total_quantity_sold} đã bán`;
                    }

                    const barPercent = maxBrandStatValue > 0 ? (valueToRender / maxBrandStatValue) * 100 : 0;
                    
                    return (
                      <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="w-full md:w-48 shrink-0 flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${
                            index === 0 ? 'bg-amber-100 text-amber-600' : 
                            index === 1 ? 'bg-slate-200 text-slate-600' : 
                            index === 2 ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-400'
                          }`}>
                            #{index + 1}
                          </div>
                          <span className="font-bold text-sm text-slate-800 line-clamp-1" title={item.brand || 'No Brand'}>
                            {item.brand || 'Thương hiệu Khác'}
                          </span>
                        </div>
                        
                        <div className="flex-1 w-full">
                          <div className="flex justify-between items-end mb-1">
                            <span className="text-xs font-black text-indigo-700">{displayValue}</span>
                            <span className="text-[10px] uppercase font-bold text-slate-400">{subDisplay}</span>
                          </div>
                          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              className={`h-full rounded-full ${brandSortBy === 'views' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : brandSortBy === 'quantity' ? 'bg-gradient-to-r from-amber-400 to-amber-600' : 'bg-gradient-to-r from-indigo-500 to-blue-500'}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${barPercent}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {brandStats.brands.length === 0 && (
                    <div className="text-center py-8 text-slate-500 italic text-sm">{t('no_data_available') || 'Không có dữ liệu'}</div>
                  )}
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="px-6 py-4">#</th>
                        <th className="px-6 py-4">{t('brand_col') || 'Thương Hiệu'}</th>
                        <th className="px-6 py-4">{t('product_count') || 'Số Mã SP'}</th>
                        <th className="px-6 py-4">{t('views_col') || 'Lượt Xem'}</th>
                        <th className="px-6 py-4">{t('items_sold') || 'Đã Bán'}</th>
                        <th className="px-6 py-4 text-right">{t('total_revenue') || 'Tổng Doanh Thu'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {brandStats.brands.map((item, index) => (
                        <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-400">{index + 1}</td>
                          <td className="px-6 py-4 font-black text-slate-800">{item.brand || <span className="text-slate-400 italic">Khác</span>}</td>
                          <td className="px-6 py-4 text-slate-600 font-medium">{item.product_count}</td>
                          <td className="px-6 py-4 text-slate-600 font-medium flex items-center gap-1.5"><Eye size={14} className="text-slate-400"/> {formatNumber(item.total_views || 0)}</td>
                          <td className="px-6 py-4 font-bold text-emerald-600">+{item.total_quantity_sold}</td>
                          <td className="px-6 py-4 text-right font-black text-indigo-600">{formatCurrency(item.total_revenue)}</td>
                        </tr>
                      ))}
                      {brandStats.brands.length === 0 && (
                         <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">{t('no_data_available') || 'Không có dữ liệu.'}</td></tr>
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
