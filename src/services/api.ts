import axios from 'axios';

const api = axios.create({
    baseURL: 'https://tttn-1.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Thêm interceptor để tự động gắn Token vào thẻ headers
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Thêm interceptor BẮT LỖI RESPONSES (FORCE LOGOUT thông minh)
api.interceptors.response.use(
  (response) => {
      return response;
  },
  (error) => {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          const currentPath = window.location.pathname;
          
          // Kiểm tra xem có đang ở trang Admin hay không
          const isAdminPath = currentPath.startsWith('/admin');
          
          console.warn("Phiên kết thúc! Đang điều hướng về trang đăng nhập tương ứng...");
          
          // Xóa token
          localStorage.removeItem('token');
          
          // Điều hướng dựa trên ngữ cảnh (Quan trọng để tránh văng từ Admin sang User Login)
          if (isAdminPath) {
              if (currentPath !== '/admin') {
                  window.location.href = '/admin';
              }
          } else {
              if (currentPath !== '/auth') {
                  window.location.href = '/auth';
              }
          }
      }
      return Promise.reject(error);
  }
);

export default api;
