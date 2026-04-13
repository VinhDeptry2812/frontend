import api from './api';
import { CheckoutData } from '../types';

export const checkout = (data: CheckoutData) => {
  return api.post('/checkout', data);
};

export const getOrders = () => {
  return api.get('/orders');
};

export const getOrderById = (id: number) => {
  return api.get(`/orders/${id}`);
};

export const cancelOrder = (id: number) => {
  return api.post(`/orders/${id}/cancel`);
};
