import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isAdmin = false }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  // Kiểm tra token cơ bản
  if (!token) {
    // Nếu không có token, chuyển hướng về trang login tương ứng
    const redirectPath = isAdmin ? '/admin' : '/auth';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Lưu ý: Việc kiểm tra quyền Admin thực sự (Role) nên được thực hiện sau khi fetchUser thành công.
  // Ở đây chúng ta cho phép vào, nếu Token sai thì API Interceptor sẽ tự động đá ra sau.
  return <>{children}</>;
};

export default ProtectedRoute;
