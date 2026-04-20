import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Mail, Phone, MapPin, ShoppingBag, LogOut,
  Camera, Calendar, Trash2, Heart, Package, Edit3,
  Plus, Clock, ChevronRight, Home, Briefcase
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';
import { getOrders } from '../services/orders';

interface UserProfile {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  birthday?: string;
  avatar?: string;
  created_at: string;
}

interface UserAddress {
  id: number;
  receiver_name: string;
  receiver_phone: string;
  address_detail: string;
  is_default: boolean;
  type: string;
}

interface Order {
  id: number;
  status: string;
  total_price?: number;
  total_amount?: number;
  created_at: string;
}

const formatPrice = (p: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

const STATUS_MAP: Record<string, { label: string; dot: string; text: string }> = {
  pending: { label: 'Chờ xác nhận', dot: 'bg-amber-500', text: 'text-amber-700' },
  confirmed: { label: 'Đã xác nhận', dot: 'bg-blue-500', text: 'text-blue-700' },
  shipping: { label: 'Đang giao hàng', dot: 'bg-purple-500', text: 'text-purple-700' },
  delivered: { label: 'Đã giao', dot: 'bg-green-500', text: 'text-green-700' },
  cancelled: { label: 'Đã hủy', dot: 'bg-red-500', text: 'text-red-700' },
};

const genderLabel = (g?: string) => g === 'male' ? 'Nam' : g === 'female' ? 'Nữ' : 'Chưa cập nhật';

type Tab = 'info' | 'address' | 'orders' | 'wishlist';

export const Profile: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab') as Tab | null;
  const [activeTab, setActiveTab] = useState<Tab>(urlTab && ['info', 'address', 'orders', 'wishlist'].includes(urlTab) ? urlTab : 'info');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { showNotification } = useNotification();
  const { logout } = useAuth();
  const { wishlist, removeItem: removeWishlist, loading: wishlistLoading } = useWishlist();
  const navigate = useNavigate();

  // Sync tab with URL
  useEffect(() => {
    if (urlTab && urlTab !== activeTab && ['info', 'address', 'orders', 'wishlist'].includes(urlTab)) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  useEffect(() => {
    Promise.all([
      api.get('/me').then(res => setProfile(res.data?.user || res.data)).catch(() => {}),
      api.get('/user/addresses').then(res => {
        const d = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setAddresses(d);
      }).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'orders' && orders.length === 0) {
      setLoadingOrders(true);
      getOrders().then(res => {
        let d = [];
        if (Array.isArray(res.data?.data?.data)) d = res.data.data.data;
        else if (Array.isArray(res.data?.data)) d = res.data.data;
        else if (Array.isArray(res.data)) d = res.data;
        else if (Array.isArray(res.data?.data?.orders)) d = res.data.data.orders;
        else if (Array.isArray(res.data?.orders)) d = res.data.orders;
        setOrders(d);
      }).catch(() => {}).finally(() => setLoadingOrders(false));
    }
  }, [activeTab]);

  const handleDeleteAddress = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;
    try {
      setDeletingId(id);
      await api.delete(`/user/addresses/${id}`);
      setAddresses(p => p.filter(a => a.id !== id));
      showNotification('Đã xóa địa chỉ thành công', 'success');
    } catch { showNotification('Không thể xóa địa chỉ. Vui lòng thử lại.', 'error'); }
    finally { setDeletingId(null); }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: 'info', label: 'Thông tin chung', icon: <User size={18} strokeWidth={1.5} /> },
    { key: 'orders', label: 'Đơn hàng của tôi', icon: <Package size={18} strokeWidth={1.5} /> },
    { key: 'wishlist', label: 'Danh sách yêu thích', icon: <Heart size={18} strokeWidth={1.5} />, count: wishlist.length },
    { key: 'address', label: 'Sổ địa chỉ', icon: <MapPin size={18} strokeWidth={1.5} />, count: addresses.length },
  ];

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const initials = profile?.name?.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase() || 'U';

  return (
    <div className="pt-28 md:pt-36 pb-24 bg-bg-ivory min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-text-muted mb-8 uppercase tracking-widest font-medium">
          <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <span className="text-stone-300">/</span>
          <span className="text-primary font-bold">Tài khoản</span>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          
          {/* ----- SIDEBAR ----- */}
          <div className="w-full md:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm mb-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-stone-100 shadow-sm bg-stone-50">
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-stone-400 font-serif text-3xl font-light">{initials}</span>
                    </div>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 p-1.5 bg-white border border-stone-200 text-text-dark rounded-full shadow-sm hover:text-primary transition-colors">
                  <Camera size={14} />
                </button>
              </div>
              <h1 className="font-serif font-bold text-xl text-text-dark leading-tight">{profile?.name || 'Thành viên'}</h1>
              <p className="text-text-muted text-sm mt-1">{profile?.email}</p>
            </div>

            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              <nav className="flex flex-col">
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => handleTabChange(tab.key)}
                    className={`flex items-center justify-between px-6 py-4 text-sm font-medium transition-colors border-l-2 ${
                      activeTab === tab.key
                        ? 'border-primary bg-bg-blue-light/50 text-primary'
                        : 'border-transparent text-text-muted hover:bg-stone-50 hover:text-text-dark'
                    } ${tab.key !== tabs[tabs.length - 1].key ? 'border-b border-stone-50' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={activeTab === tab.key ? 'text-primary' : 'text-stone-400'}>{tab.icon}</span>
                      {tab.label}
                    </div>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className="text-xs bg-stone-100 text-text-muted px-2 py-0.5 rounded-full font-bold">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
                <div className="border-t border-stone-100" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-6 py-4 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={18} strokeWidth={1.5} />
                  Đăng xuất
                </button>
              </nav>
            </div>
          </div>

          {/* ----- MAIN CONTENT ----- */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                
                {/* --- THÔNG TIN CHUNG --- */}
                {activeTab === 'info' && (
                  <div>
                    <div className="flex items-end justify-between mb-6 pb-4 border-b border-stone-200">
                      <div>
                        <h2 className="font-serif text-2xl font-bold text-text-dark">Hồ sơ cá nhân</h2>
                        <p className="text-text-muted text-sm mt-1">Quản lý thông tin liên hệ và bảo mật</p>
                      </div>
                      <button onClick={() => navigate('/profile/edit')} className="flex items-center gap-1.5 text-sm text-text-dark font-semibold border border-stone-200 bg-white px-4 py-2 rounded-full hover:border-primary hover:text-primary transition-colors shadow-sm">
                        <Edit3 size={14} /> Chỉnh sửa
                      </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-100">
                        <div className="p-8">
                          <h3 className="text-xs uppercase tracking-widest font-bold text-stone-400 mb-6">Thông tin liên lạc</h3>
                          <div className="space-y-6">
                            <div>
                              <p className="text-xs text-text-muted mb-1">Họ và tên</p>
                              <p className="font-semibold text-text-dark">{profile?.name || 'Chưa cập nhật'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-text-muted mb-1">Email</p>
                              <p className="font-semibold text-text-dark">{profile?.email || 'Chưa cập nhật'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-text-muted mb-1">Số điện thoại</p>
                              <p className="font-semibold text-text-dark">{profile?.phone || 'Chưa cập nhật'}</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-8">
                          <h3 className="text-xs uppercase tracking-widest font-bold text-stone-400 mb-6">Thông tin bổ sung</h3>
                          <div className="space-y-6">
                            <div>
                              <p className="text-xs text-text-muted mb-1">Giới tính</p>
                              <p className="font-semibold text-text-dark">{genderLabel(profile?.gender)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-text-muted mb-1">Ngày sinh</p>
                              <p className="font-semibold text-text-dark">{profile?.birthday ? new Date(profile.birthday).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-text-muted mb-1">Ngày tham gia</p>
                              <p className="font-semibold text-text-dark">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString('vi-VN') : '--'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- ĐƠN HÀNG --- */}
                {activeTab === 'orders' && (
                  <div>
                    <div className="mb-6 pb-4 border-b border-stone-200">
                      <h2 className="font-serif text-2xl font-bold text-text-dark">Lịch sử đơn hàng</h2>
                      <p className="text-text-muted text-sm mt-1">Theo dõi các giao dịch mua sắm của bạn</p>
                    </div>

                    {loadingOrders ? (
                      <div className="py-16 flex justify-center">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm py-20 text-center">
                        <Package size={40} className="text-stone-300 mx-auto mb-4" strokeWidth={1} />
                        <h3 className="font-serif text-xl font-bold text-text-dark mb-2">Chưa có đơn hàng</h3>
                        <p className="text-text-muted mb-6">Bạn chưa thực hiện giao dịch nào.</p>
                        <Link to="/catalog" className="btn-primary inline-block">Bắt đầu mua sắm</Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map(order => {
                          const s = STATUS_MAP[order.status] || { label: order.status, dot: 'bg-stone-400', text: 'text-stone-600' };
                          return (
                            <div key={order.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="font-bold text-text-dark">Đơn hàng #{order.id}</span>
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium bg-stone-50 px-2.5 py-1 rounded-full ${s.text}`}>
                                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                                      {s.label}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-text-muted">
                                    <span className="flex items-center gap-1"><Clock size={14} /> {new Date(order.created_at).toLocaleDateString('vi-VN')}</span>
                                  </div>
                                </div>
                                <div className="text-left md:text-right">
                                  <p className="text-xs text-text-muted mb-1 uppercase tracking-wider">Tổng tiền</p>
                                  <p className="font-serif font-bold text-lg text-primary">{formatPrice(order.total_price || order.total_amount || 0)}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* --- ĐỊA CHỈ --- */}
                {activeTab === 'address' && (
                  <div>
                    <div className="flex items-end justify-between mb-6 pb-4 border-b border-stone-200">
                      <div>
                        <h2 className="font-serif text-2xl font-bold text-text-dark">Sổ địa chỉ</h2>
                        <p className="text-text-muted text-sm mt-1">Quản lý địa chỉ giao hàng của bạn</p>
                      </div>
                      <button onClick={() => navigate('/profile/address/new')}
                        className="flex items-center gap-1.5 text-sm font-semibold bg-text-dark text-white px-5 py-2.5 rounded-full hover:bg-black transition-colors shadow-sm">
                        <Plus size={14} /> Thêm địa chỉ
                      </button>
                    </div>

                    {addresses.length === 0 ? (
                      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm py-20 text-center">
                        <MapPin size={40} className="text-stone-300 mx-auto mb-4" strokeWidth={1} />
                        <h3 className="font-serif text-xl font-bold text-text-dark mb-2">Chưa có địa chỉ</h3>
                        <p className="text-text-muted mb-6">Thêm địa chỉ để thanh toán nhanh hơn</p>
                        <button onClick={() => navigate('/profile/address/new')} className="btn-primary inline-block">Thêm địa chỉ ngay</button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map(addr => (
                          <div key={addr.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 relative group">
                            {addr.is_default && (
                              <div className="absolute top-0 right-0 bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                                Mặc định
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2 mb-3">
                              <span className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-400">
                                {addr.type === 'home' ? <Home size={14} /> : addr.type === 'office' ? <Briefcase size={14} /> : <MapPin size={14} />}
                              </span>
                              <div>
                                <h4 className="font-bold text-text-dark leading-tight">{addr.receiver_name}</h4>
                                <p className="text-xs text-text-muted">{addr.receiver_phone}</p>
                              </div>
                            </div>
                            
                            <p className="text-sm text-text-muted mb-6 leading-relaxed min-h-[40px]">{addr.address_detail}</p>
                            
                            <div className="flex items-center gap-2 border-t border-stone-100 pt-4">
                              <button onClick={() => navigate(`/profile/address/edit/${addr.id}`)} className="text-xs font-bold text-text-dark hover:text-primary transition-colors flex items-center gap-1">
                                <Edit3 size={12} /> Sửa
                              </button>
                              <span className="text-stone-200">|</span>
                              <button onClick={() => handleDeleteAddress(addr.id)} disabled={deletingId === addr.id}
                                className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 disabled:opacity-50">
                                {deletingId === addr.id ? <div className="w-3 h-3 border border-red-500 border-t-transparent rounded-full animate-spin" /> : <Trash2 size={12} />} Xóa
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* --- YÊU THÍCH --- */}
                {activeTab === 'wishlist' && (
                  <div>
                    <div className="flex items-end justify-between mb-6 pb-4 border-b border-stone-200">
                      <div>
                        <h2 className="font-serif text-2xl font-bold text-text-dark">Sản phẩm yêu thích</h2>
                        <p className="text-text-muted text-sm mt-1">{wishlist.length} sản phẩm đã lưu</p>
                      </div>
                      {wishlist.length > 0 && (
                        <Link to="/catalog" className="text-xs font-bold text-text-dark border-b border-text-dark pb-0.5 hover:text-primary hover:border-primary transition-colors uppercase tracking-widest">
                          Mua sắm thêm
                        </Link>
                      )}
                    </div>

                    {wishlistLoading ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="bg-white rounded-2xl overflow-hidden border border-stone-100">
                            <div className="skeleton aspect-[4/3]" />
                            <div className="p-5 space-y-2">
                              <div className="skeleton h-3 w-1/3" />
                              <div className="skeleton h-4 w-4/5" />
                              <div className="skeleton h-4 w-1/2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : wishlist.length === 0 ? (
                      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm py-20 text-center">
                         <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Heart size={24} className="text-red-400" strokeWidth={1.5} />
                        </div>
                        <h3 className="font-serif text-xl font-bold text-text-dark mb-2">Chưa có sản phẩm yêu thích</h3>
                        <p className="text-text-muted mb-6">Nhấn vào biểu tượng trái tim trên sản phẩm để lưu vào đây.</p>
                        <Link to="/catalog" className="btn-primary inline-block">Khám phá sản phẩm</Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist.map(item => {
                          if (item.product) {
                            // Tranh thủ chỉnh sửa chút style nếu ProductCard không viền
                            return (
                              <div key={item.id || item.product_id} className="relative group">
                                <ProductCard product={item.product} />
                              </div>
                            );
                          }
                          return (
                            <div key={item.id || item.product_id} className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                              <div className="bg-stone-50 aspect-[4/3] flex items-center justify-center">
                                <ShoppingBag size={24} className="text-stone-300" />
                              </div>
                              <div className="p-4 flex items-center justify-between border-t border-stone-50">
                                <Link to={`/product/${item.product_id}`} className="text-sm font-medium text-text-dark hover:text-primary">
                                  Xem sản phẩm #{item.product_id}
                                </Link>
                                <button onClick={() => removeWishlist(item.product_id)} className="text-stone-300 hover:text-red-500 transition-colors">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
};
