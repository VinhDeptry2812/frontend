import axios from 'axios';

const api = axios.create({
    baseURL: 'https://tttn-1.onrender.com/api', // Production Render
    // baseURL: 'http://127.0.0.1:8000/api', // Local - bỏ comment khi dev local
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Thêm interceptor để tự động gắn Token vào mỗi request nếu có
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
