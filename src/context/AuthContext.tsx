import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

interface User {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  birthday?: string;
  avatar?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Xác định endpoint dựa trên đường dẫn hiện tại
    const isAdminPath = window.location.pathname.startsWith('/admin');
    const endpoint = isAdminPath ? '/admin/me' : '/me';

    try {
      const response = await api.get(endpoint);
      const data = response.data;
      const fetchUserData = (data.success && (data.admin || data.user)) ? (data.admin || data.user) : (data.admin || data.user || data);

      if (fetchUserData) {
        // Bổ sung ảnh đại diện cứu hộ nếu Server không lưu được
        const rescueAvatar = localStorage.getItem('rescue_avatar');
        if (rescueAvatar && (!fetchUserData.avatar || fetchUserData.avatar === '')) {
          fetchUserData.avatar = rescueAvatar;
        }

        // Kiểm tra ngay lập tức nếu dữ liệu trả về báo tài khoản bị vô hiệu hóa
        const isActive = fetchUserData.is_active;
        if (isActive === 0 || isActive === false || String(isActive) === '0' || String(isActive) === 'false') {
          console.warn("Tài khoản đã bị khóa bởi Admin! Bắt buộc văng...");
          localStorage.removeItem('token');
          setUser(null);
          
          window.location.href = isAdminPath ? '/admin' : '/auth';
          return;
        }

        setUser(fetchUserData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      // Xóa user state, việc xóa token và redirect đã được interceptor trong api.ts xử lý nếu là lỗi 401/403
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (token: string) => {
    localStorage.setItem('token', token);
    setLoading(true);
    await fetchUser();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
