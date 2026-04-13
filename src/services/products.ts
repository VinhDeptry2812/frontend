import api from './api';
import { ProductFilters } from '../types';

export const getProducts = (filters: ProductFilters = {}) => {
  return api.get('/products', { params: filters });
};

export const getProductById = (id: number | string) => {
  return api.get(`/products/${id}`);
};

export const getFeaturedProducts = () => {
  return api.get('/products', {
    params: { sort_by: 'created_at', sort_order: 'desc' }
  });
};

export const searchProducts = (query: string) => {
  return api.get('/products', { params: { search: query } });
};
