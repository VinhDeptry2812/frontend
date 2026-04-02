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
        config.headers.Authorization = `Bearer ${token}`; // Hoặc cấu trúc Backend mà bạn cài đặt
    }
    return config;
});

// Thêm interceptor BẮT LỖI RESPONSES (Quan trọng để FORCE LOGOUT)
api.interceptors.response.use(
  (response) => {
      return response;
  },
  (error) => {
      // Nếu tài khoản bị Admin khóa, Backend sẽ trả về 401 Unauthorized hoặc 403 Forbidden
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.warn("Phiên kết thúc vì tài khoản bị khóa hoặc token hết hạn!");
          // Xóa token khỏi máy người bị khóa
          localStorage.removeItem('token');
          
          // Điều hướng văng thẳng ra ngoài màn hình login
          // (Dùng window.location vì không nằm trong context Component React)
          window.location.href = '/auth'; // Đường dẫn tới trang đăng nhập
      }
      return Promise.reject(error);
  }
);

export default api;
