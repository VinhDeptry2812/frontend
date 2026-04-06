import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchWishlist, addToWishlistApi, removeFromWishlistApi } from '../services/api';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

interface WishlistContextType {
  wishlistIds: string[];
  loading: boolean;
  toggleWishlist: (productId: number | string) => Promise<void>;
  isInWishlist: (productId: number | string) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const refreshWishlist = async () => {
    if (!localStorage.getItem('token')) {
      setWishlistIds([]);
      return;
    }
    try {
      const data = await fetchWishlist();
      const ids = data.map((item: any) => {
        const product = item.product || (item.name ? item : null);
        const pid = product?.id || item.product_id || item.id;
        return pid ? String(pid) : null;
      }).filter(Boolean) as string[];
      setWishlistIds(ids);
    } catch (err) {
      console.error("Wishlist sync error:", err);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, [user]);

  const toggleWishlist = async (productId: number | string) => {
    if (!localStorage.getItem('token')) {
      showNotification('Vui lòng đăng nhập để thực hiện tác vụ này', 'error');
      return;
    }

    try {
      const sid = String(productId);
      const isExisting = wishlistIds.includes(sid);
      
      // Optimistic UI Update
      if (isExisting) {
        setWishlistIds(prev => prev.filter(id => id !== sid));
        await removeFromWishlistApi(productId);
        showNotification('Đã xóa khỏi danh sách yêu thích', 'success');
      } else {
        setWishlistIds(prev => [...prev, sid]);
        await addToWishlistApi(productId);
        showNotification('Đã thêm vào danh sách yêu thích', 'success');
      }
    } catch (err: any) {
      console.error("Wishlist toggle error:", err);
      // Rollback on error
      refreshWishlist();
      showNotification(err.response?.data?.message || 'Lỗi cập nhật yêu thích', 'error');
    }
  };

  const isInWishlist = (productId: number | string) => {
    if (!productId) return false;
    const sid = String(productId);
    return wishlistIds.includes(sid);
  };

  return (
    <WishlistContext.Provider value={{ wishlistIds, loading, toggleWishlist, isInWishlist, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
