import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartSidebar } from './components/CartSidebar';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { Auth } from './pages/Auth';
import { ResetPassword } from './pages/ResetPassword';
import { User } from './pages/User';
import { Profile } from './pages/Profile';
import { EditProfile } from './pages/EditProfile';
import { AddAddress } from './pages/AddAddress';
import { EditAddress } from './pages/EditAddress';
import { Checkout } from './pages/Checkout';
import { Wishlist } from './pages/Wishlist';
import { AdminLogin } from './pages/AdminLogin';
import { AdminLayout } from './components/AdminLayout';
import AdminRoute from './components/AdminRoute';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminEmployees } from './pages/admin/AdminEmployees';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminProfile } from './pages/admin/AdminProfile';
import { Product, ApiProduct, CartItem } from './types';
import { fetchCart, addToCartApi, updateCartItemApi, removeFromCartApi } from './services/api';

import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { WishlistProvider } from './context/WishlistContext';

const App: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Reload to let AuthProvider pick up the token
      window.location.reload();
    }
  }, []);

  // Fetch cart purely from API if token exists
  useEffect(() => {
    const loadCart = async () => {
      try {
        if (localStorage.getItem('token')) {
          const apiCart = await fetchCart();
          const mapped = apiCart.map((item: any) => ({
            cart_item_id: item.id, // Store specific cart item id for updates/deletes
            id: item.product_id || item.product?.id,
            name: item.product?.name || 'Sản phẩm',
            price: item.variant?.price || item.product?.sale_price || item.product?.base_price || item.price || 0,
            image: item.variant?.image_url || item.product?.image_url || '',
            quantity: item.quantity,
            selectedFinish: item.variant?.color || item.variant?.finish || undefined,
            variant_id: item.variant_id
          }));
          setCartItems(mapped);
        }
      } catch (err) {
        console.error("Cart fetch error:", err);
      }
    };
    loadCart();
  }, []);

  const addToCart = async (product: ApiProduct, finish?: string, variantId?: number) => {
    // 1. Network sync first
    if (localStorage.getItem('token')) {
      try {
        await addToCartApi({
          product_id: product.id,
          variant_id: variantId || null,
          quantity: 1
        });
      } catch (err) {
        console.error("Lỗi khi thêm vào giỏ API", err);
      }
    }

    // 2. UI Update (Optimistic mapping)
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedFinish === finish);
      if (existing) {
        return prev.map(item =>
          (item.id === product.id && item.selectedFinish === finish)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { 
        id: product.id,
        name: product.name,
        price: product.sale_price || product.base_price,
        image: product.image_url,
        quantity: 1, 
        selectedFinish: finish,
        variant_id: variantId
      }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = async (id: string, delta: number) => {
    // Tạm thời UI
    const itemToUpdate = cartItems.find(item => item.id === id);
    if (!itemToUpdate) return;
    
    const newQty = Math.max(1, itemToUpdate.quantity + delta);
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));

    // Yêu cầu API nếu đang đăng nhập
    if (localStorage.getItem('token') && (itemToUpdate as any).cart_item_id) {
       try {
         await updateCartItemApi((itemToUpdate as any).cart_item_id, newQty);
       } catch (err) { }
    }
  };

  const removeFromCart = async (id: string) => {
    const itemToRemove = cartItems.find(item => item.id === id);
    setCartItems(prev => prev.filter(item => item.id !== id));

    if (localStorage.getItem('token') && itemToRemove && (itemToRemove as any).cart_item_id) {
       try {
         await removeFromCartApi((itemToRemove as any).cart_item_id);
       } catch (err) { }
    }
  };

  return (
    <LanguageProvider>
      <NotificationProvider>
        <AuthProvider>
          <WishlistProvider>
            <Router>
              <div className="min-h-screen flex flex-col">
                <Routes>
                  <Route path="/users" element={<User />} />
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/employees" element={<AdminRoute><AdminLayout><AdminEmployees /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/products" element={<AdminRoute><AdminLayout><AdminProducts /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/categories" element={<AdminRoute><AdminLayout><AdminCategories /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/users" element={<AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/coupons" element={<AdminRoute><AdminLayout><AdminCoupons /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/profile" element={<AdminRoute><AdminLayout><AdminProfile /></AdminLayout></AdminRoute>} />
                  <Route path="/wishlist-test" element={<div style={{paddingTop: 100}}>Wishlist Test Page</div>} />
                  <Route path="/wishlist" element={<>
                    <Navbar cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} onOpenCart={() => setIsCartOpen(true)} />
                    <main className="flex-grow">
                      <Wishlist onAddToCart={addToCart} />
                    </main>
                    <Footer />
                  </>} />
                  <Route
                    path="*"
                    element={
                      <>
                        <Navbar
                          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                          onOpenCart={() => setIsCartOpen(true)}
                        />
                        <main className="flex-grow">
                          <Routes>
                            <Route path="/reset-password" element={<ResetPassword />} />
                            <Route path="/" element={<Home onAddToCart={addToCart} />} />
                            <Route path="/catalog" element={<Catalog onAddToCart={addToCart} />} />
                            <Route path="/product/:id" element={<ProductDetail onAddToCart={addToCart} />} />
                            <Route path="/auth" element={<Auth />} />
                            <Route path="/checkout" element={<Checkout cartItems={cartItems} />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/profile/edit" element={<EditProfile />} />
                            <Route path="/profile/address/new" element={<AddAddress />} />
                            <Route path="/profile/address/edit/:id" element={<EditAddress />} />
                          </Routes>
                        </main>
                        <Footer />
                      </>
                    }
                  />
                </Routes>

                <CartSidebar
                  isOpen={isCartOpen}
                  onClose={() => setIsCartOpen(false)}
                  items={cartItems}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              </div>
            </Router>
          </WishlistProvider>
        </AuthProvider>
      </NotificationProvider>
    </LanguageProvider>
  );
};

export default App;
