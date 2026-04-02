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
  ChevronRight
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleLogout = () => {
    localStorage.removeItem('token');
    showNotification("Đã đăng xuất khỏi phiên Admin", "success");
    navigate('/admin');
  };

  const navItems = [
    { name: 'Tổng quan', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Nhân viên', path: '/admin/employees', icon: <UserCircle size={18} /> },
    { name: 'Sản phẩm', path: '/admin/products', icon: <Package size={18} /> },
    { name: 'Người dùng', path: '/admin/users', icon: <Users size={18} /> },
  ];

  const currentNav = navItems.find(item => item.path === location.pathname);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
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
              <span className="text-white font-bold text-xs">AU</span>
            </div>
            <span className="text-slate-900 font-bold text-base tracking-tight">Aurelius</span>
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
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-3">Menu</p>
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
            Đăng xuất
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
              <span className="text-slate-400 font-medium">Admin</span>
              {currentNav && (
                <>
                  <ChevronRight size={14} className="text-slate-300" />
                  <span className="text-slate-900 font-bold">{currentNav.name}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">Administrator</p>
                <p className="text-xs text-slate-400">admin@aurelius.com</p>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-sm shadow-sm">
              AD
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
};
