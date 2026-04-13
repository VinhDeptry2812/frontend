import api from './api';

// Tạo hoặc lấy Session ID cho khách vãng lai
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
};

const cartHeaders = () => ({
  'X-Session-ID': getSessionId(),
});

export const getCart = () => {
  return api.get('/cart', { headers: cartHeaders() });
};

export const addToCart = (
  product_id: number,
  product_variant_id: number | null,
  quantity: number
) => {
  return api.post(
    '/cart/add',
    { product_id, product_variant_id, quantity },
    { headers: cartHeaders() }
  );
};

export const updateCartItem = (itemId: number, quantity: number) => {
  return api.put(
    `/cart/update/${itemId}`,
    { quantity },
    { headers: cartHeaders() }
  );
};

export const removeCartItem = (itemId: number) => {
  return api.delete(`/cart/remove/${itemId}`, { headers: cartHeaders() });
};

export const clearCart = () => {
  return api.delete('/cart/clear', { headers: cartHeaders() });
};
