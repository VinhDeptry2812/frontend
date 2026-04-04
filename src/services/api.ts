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
        // Nếu gặp lỗi 401 (Unauthorized) hoặc 403 (Forbidden) - Có nghĩa là Token không hợp lệ hoặc hết hạn
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.warn("Phiên làm việc hết hạn hoặc không có quyền truy cập. Hệ thống sẽ đăng xuất tự động.");
            
            // Xóa token khỏi localStorage
            localStorage.removeItem('token');
            
            // Kiểm tra xem có đang ở khu vực Admin hay không để điều hướng về trang Login tương ứng
            const currentPath = window.location.pathname;
            if (currentPath.startsWith('/admin')) {
                // Nếu đang ở bất kỳ trang nào của admin (ngoại trừ trang login admin) thì đẩy về login admin
                if (currentPath !== '/admin') {
                    window.location.href = '/admin';
                }
            } else {
                // Nếu đang ở trang người dùng (và không phải trang login) thì đẩy về login
                if (currentPath !== '/auth') {
                    window.location.href = '/auth';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
