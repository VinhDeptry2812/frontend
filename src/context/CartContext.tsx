import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Cart, CartItem } from '../types';
import * as cartService from '../services/cart';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  cartCount: number;
  fetchCart: () => Promise<void>;
  addItem: (product_id: number, product_variant_id: number | null, quantity: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearAll: () => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  isOpen: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchCart = useCallback(async () => {
    // Không fetch giỏ hàng nếu:
    // 1. Chưa đăng nhập (backend có thể ko cho phép guest cart)
    // 2. Là Admin (Back-end thường ko cấp giỏ hàng cho Admin, gây lỗi 401)
    // 3. Đang ở các path của Admin
    const isAdminPath = window.location.pathname.startsWith('/admin');
    if (!user || isAdminPath || user.role === 'admin' || user.role === 'staff') {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      const res = await cartService.getCart();
      if (res.data?.success) {
        setCart(res.data.data);
      }
    } catch (err) {
      console.error('Lỗi tải giỏ hàng:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (product_id: number, product_variant_id: number | null, quantity: number) => {
    try {
      await cartService.addToCart(product_id, product_variant_id, quantity);
      await fetchCart();
      setIsOpen(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Không thể thêm sản phẩm vào giỏ hàng';
      throw new Error(msg);
    }
  };

  const updateItem = async (itemId: number, quantity: number) => {
    try {
      await cartService.updateCartItem(itemId, quantity);
      await fetchCart();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Không thể cập nhật số lượng';
      throw new Error(msg);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await cartService.removeCartItem(itemId);
      await fetchCart();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Không thể xóa sản phẩm';
      throw new Error(msg);
    }
  };

  const clearAll = async () => {
    try {
      await cartService.clearCart();
      setCart(null);
    } catch (err) {
      console.error('Lỗi xóa giỏ hàng:', err);
    }
  };

  const cartCount = cart?.total_quantity || 0;

  return (
    <CartContext.Provider value={{
      cart, loading, cartCount, fetchCart,
      addItem, updateItem, removeItem, clearAll,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      isOpen,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart phải được dùng trong CartProvider');
  return ctx;
};
