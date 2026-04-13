import api from './api';

export const getWishlist = (params: { search?: string; category_id?: number; order?: 'asc' | 'desc'; per_page?: number } = {}) => {
  return api.get('/wishlist', { params });
};

export const addToWishlist = (product_id: number) => {
  return api.post('/wishlist/add', { product_id });
};

export const removeFromWishlist = (product_id: number) => {
  return api.delete(`/wishlist/remove/${product_id}`);
};

export const clearWishlist = () => {
  return api.delete('/wishlist/clear');
};
