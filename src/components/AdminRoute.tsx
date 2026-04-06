import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Đang xác thực quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Nếu chưa đăng nhập (và LOADING ĐÃ XONG mà vẫn không có user)
  if (!user && !loading) {
    console.warn("Truy cập bị chặn: Yêu cầu đăng nhập quản trị.");
    // Chuyển hướng về trang login admin và lưu lại vị trí hiện tại
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  // Nếu gọi được /admin/me thành công (tức là user hợp lệ ở trang admin)
  return <>{children}</>;
};

export default AdminRoute;
