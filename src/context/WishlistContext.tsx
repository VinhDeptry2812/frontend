import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WishlistItem, Product } from '../types';
import * as wishlistService from '../services/wishlist';
import { getProductById } from '../services/products';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: WishlistItem[];
  loading: boolean;
  fetchWishlist: () => Promise<void>;
  addItem: (product_id: number) => Promise<void>;
  removeItem: (product_id: number) => Promise<void>;
  isInWishlist: (product_id: number) => boolean;
  clearAll: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchWishlist = useCallback(async () => {
    const isAdminPath = window.location.pathname.startsWith('/admin');
    if (!user || isAdminPath || user.role === 'admin' || user.role === 'staff') {
      setWishlist([]); 
      return; 
    }
    try {
      setLoading(true);
      const res = await wishlistService.getWishlist({ per_page: 100 });

      // Handle various paginated response shapes
      let items: WishlistItem[] = [];
      const d = res.data;
      if (d?.data?.data && Array.isArray(d.data.data)) {
        items = d.data.data;           // { data: { data: [...] } }
      } else if (d?.data && Array.isArray(d.data)) {
        items = d.data;                // { data: [...] }
      } else if (Array.isArray(d)) {
        items = d;                     // [...]
      }

      // Nếu items không có product thì fetch riêng từng cái
      const missingProduct = items.filter(item => !item.product && item.product_id);
      if (missingProduct.length > 0) {
        const productResults = await Promise.allSettled(
          missingProduct.map(item => getProductById(item.product_id))
        );
        items = items.map((item, idx) => {
          const resultIdx = missingProduct.findIndex(m => m.product_id === item.product_id);
          if (resultIdx !== -1) {
            const result = productResults[resultIdx];
            if (result.status === 'fulfilled') {
              const prod: Product = result.value.data?.data || result.value.data;
              return { ...item, product: prod };
            }
          }
          return item;
        });
      }

      setWishlist(items);
    } catch (err) {
      console.error('Lỗi tải danh sách yêu thích:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const addItem = async (product_id: number) => {
    if (!user) throw new Error('Vui lòng đăng nhập để sử dụng tính năng này');
    try {
      await wishlistService.addToWishlist(product_id);
      await fetchWishlist();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Không thể thêm vào danh sách yêu thích';
      throw new Error(msg);
    }
  };

  const removeItem = async (product_id: number) => {
    try {
      await wishlistService.removeFromWishlist(product_id);
      setWishlist(prev => prev.filter(w => w.product_id !== product_id));
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Không thể xóa khỏi danh sách yêu thích';
      throw new Error(msg);
    }
  };

  const clearAll = async () => {
    try {
      await wishlistService.clearWishlist();
      setWishlist([]);
    } catch {}
  };

  const isInWishlist = (product_id: number) =>
    wishlist.some(w => w.product_id === product_id);

  return (
    <WishlistContext.Provider value={{ wishlist, loading, fetchWishlist, addItem, removeItem, isInWishlist, clearAll }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist phải được dùng trong WishlistProvider');
  return ctx;
};
