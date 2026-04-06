import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  UserCircle, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  Languages,
  Ticket
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showNotification } = useNotification();
  const { language, setLanguage, t } = useLanguage();

  const handleLogout = () => {
    logout();
    showNotification(t('logout_success') || "Đã đăng xuất khỏi phiên Admin", "success");
    navigate('/admin');
  };

  const navItems = [
    { name: t('nav_dashboard'), path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: t('nav_employees'), path: '/admin/employees', icon: <UserCircle size={18} />, superOnly: true },
    { name: t('nav_products'), path: '/admin/products', icon: <Package size={18} /> },
    { name: t('nav_categories'), path: '/admin/categories', icon: <Menu size={18} /> },
    { name: t('nav_users'), path: '/admin/users', icon: <Users size={18} /> },
    { name: t('nav_coupons'), path: '/admin/coupons', icon: <Ticket size={18} /> },
  ].filter(item => !item.superOnly || user?.role === 'superadmin');

  const currentNav = navItems.find(item => item.path === location.pathname);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static top-0 left-0 z-50 h-full w-60 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out flex flex-col shadow-sm ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xs">FL</span>
            </div>
            <span className="text-slate-900 font-bold text-base tracking-tight">Furniture Luxury</span>
          </Link>
          <button 
            className="lg:hidden text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-3">{t('menu')}</p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold ${
                  isActive 
                    ? 'bg-primary text-white shadow-sm shadow-primary/30' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Footer logout */}
        <div className="p-3 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-semibold"
          >
            <LogOut size={18} />
            {t('logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 bg-white z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-slate-400 font-medium">{t('admin')}</span>
              {currentNav && (
                <>
                  <ChevronRight size={14} className="text-slate-300" />
                  <span className="text-slate-900 font-bold">{currentNav.name}</span>
                </>
              )}
              
              {user && (
                <>
                  <div className="h-4 w-[1px] bg-slate-300 mx-1 hidden sm:block" />
                  <div className="hidden sm:flex items-center gap-2 ml-1 text-xs">
                    <span className={`px-2 py-0.5 rounded-lg font-bold text-[10px] uppercase tracking-tight ${
                      user.role === 'superadmin' 
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm' 
                        : user.role === 'admin' 
                          ? 'bg-violet-100 text-violet-700' 
                          : 'bg-slate-100 text-slate-600'
                    }`}>
                      {t(`${user.role || 'staff'}_role`)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setLanguage('vi')}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${language === 'vi' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                VN
              </button>
              <button 
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${language === 'en' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                EN
              </button>
            </div>

            <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-3">
              <Link 
                to="/admin/profile" 
                className="hidden sm:flex items-center gap-3 hover:bg-slate-50 p-1.5 pr-3 rounded-2xl transition-all border border-transparent hover:border-slate-200"
              >
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 leading-tight">{user?.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{user?.email}</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-primary/10 uppercase shrink-0">
                  {user?.name?.substring(0, 2)}
                </div>
              </Link>
              
              {/* Mobile Avatar */}
              <Link 
                to="/admin/profile" 
                className="sm:hidden w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-primary/10 uppercase"
              >
                {user?.name?.substring(0, 2) || 'AD'}
              </Link>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 bg-slate-50/50">
          {children}
        </main>
      </div>
    </div>
  );
};
