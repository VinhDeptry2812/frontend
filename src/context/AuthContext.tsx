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
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => void;
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

    try {
      const response = await api.get('/me');
      const fetchUserData = (response.data.success && response.data.user) ? response.data.user : (response.data.user || response.data);

      if (fetchUserData) {
        // Kiểm tra ngay lập tức nếu dữ liệu trả về báo tài khoản bị vô hiệu hóa
        const isActive = fetchUserData.is_active;
        if (isActive === 0 || isActive === false || String(isActive) === '0' || String(isActive) === 'false') {
          console.warn("Tài khoản đã bị khóa bởi Admin! Bắt buộc văng...");
          localStorage.removeItem('token');
          setUser(null);
          
          // Thêm thông báo nếu có thể hoặc đẩy thẳng về login (dùng window.location.href để xóa mảng bộ nhớ SPA)
          window.location.href = '/auth';
          return;
        }

        setUser(fetchUserData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    fetchUser();
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
