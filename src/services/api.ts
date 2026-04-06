import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
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

export const fetchProducts = async (params: {
  category_id?: number | string;
  search?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: 'base_price' | 'name' | 'created_at';
  sort_order?: 'asc' | 'desc';
  cursor?: string;
  all?: boolean;
}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const fetchProductDetail = async (id: string | number) => {
  try {
    const response = await api.get(`/products/${id}`);
    // Handle standard layout and nested data wrapper
    const prd = response.data?.data || response.data?.product || response.data;
    if (!prd || !prd.id) throw new Error('Not found details');
    return prd;
  } catch(error) {
    // If not found, try getting through the list API as fallback:
    const params = { search: String(id) };
    const res = await api.get('/products', { params });
    const list = res.data?.data;
    if (list && list.length > 0) {
      // Find the best match
      const matched = list.find((p: any) => String(p.id) === String(id) || String(p.sku) === String(id) || String(p.slug) === String(id));
      if (matched) return matched;
      return list[0]; // fallback
    }
    throw error;
  }
};

export const fetchCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

// --- CART APIs ---
export const fetchCart = async () => {
  const response = await api.get('/cart');
  return response.data?.data || response.data || [];
};

export const addToCartApi = async (data: { product_id: string | number, variant_id?: string | number | null, quantity: number }) => {
  const response = await api.post('/cart/add', data);
  return response.data;
};

export const updateCartItemApi = async (itemId: string | number, quantity: number) => {
  // Use put or patch depending on backend, typically put for updates
  const response = await api.put(`/cart/update/${itemId}`, { quantity });
  return response.data;
};

export const removeFromCartApi = async (itemId: string | number) => {
  const response = await api.delete(`/cart/remove/${itemId}`);
  return response.data;
};

export const clearCartApi = async () => {
  const response = await api.delete('/cart/clear');
  return response.data;
};

// --- CHECKOUT & ORDERS ---
export const checkoutApi = async (orderData: any) => {
  const response = await api.post('/checkout', orderData);
  return response.data;
};

export const fetchOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const fetchOrderDetails = async (id: string | number) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

// --- WISHLIST APIs ---
export const fetchWishlist = async () => {
  try {
    const response = await api.get('/wishlist');
    const d = response.data;
    
    // Recursive search or multiple path checks to find the array
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.data)) return d.data;
    if (Array.isArray(d?.wishlist)) return d.wishlist;
    if (Array.isArray(d?.data?.data)) return d.data.data;
    if (Array.isArray(d?.items)) return d.items;
    
    // Check if it's an object that contains an array
    const possibleArray = Object.values(d || {}).find(val => Array.isArray(val));
    if (possibleArray) return possibleArray as any[];

    return [];
  } catch (err) {
    console.error("Fetch wishlist failed", err);
    return [];
  }
};

export const addToWishlistApi = async (productId: string | number) => {
  // Gửi cả product_id và hỗ trợ dự phòng nếu backend cần id
  const response = await api.post('/wishlist/add', { 
    product_id: productId,
    id: productId 
  });
  return response.data;
};

export const removeFromWishlistApi = async (productId: string | number) => {
  const response = await api.delete(`/wishlist/remove/${productId}`);
  return response.data;
};

export const clearWishlistApi = async () => {
  const response = await api.post('/wishlist/clear');
  return response.data;
};

// --- VARIANTS API ---
export const fetchProductVariants = async (productId: string | number) => {
  const response = await api.get(`/products/${productId}/variants`);
  return response.data?.data || response.data;
};

// --- STATS APIs (Admin) ---
export const fetchProductsByPriceStats = async () => {
  const response = await api.get('/admin/products/stats/by-price');
  return response.data?.data || response.data;
};

export const fetchProductsByBrandStats = async () => {
  const response = await api.get('/admin/products/stats/by-brand');
  return response.data?.data || response.data;
};

export const fetchAdminDashboardStats = async () => {
  // Typically we'd have a summary endpoint, but if not we can combine or just use what we have
  const orders = await api.get('/admin/orders');
  const users = await api.get('/users');
  const products = await api.get('/products', { params: { all: true } });
  
  return {
    orders: orders.data?.total || orders.data?.data?.length || 0,
    revenue: orders.data?.data?.reduce((sum: number, o: any) => sum + (Number(o.total_amount) || 0), 0) || 0,
    customers: users.data?.total || users.data?.data?.length || 0,
    products: products.data?.total || products.data?.data?.length || 0
  };
};

export default api;
