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
import { AdminLogin } from './pages/AdminLogin';
import { AdminLayout } from './components/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminEmployees } from './pages/admin/AdminEmployees';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminUsers } from './pages/admin/AdminUsers';
import { Product, CartItem } from './types';

import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';

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

  const addToCart = (product: Product, finish?: string) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedFinish === finish);
      if (existing) {
        return prev.map(item =>
          (item.id === product.id && item.selectedFinish === finish)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedFinish: finish }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <NotificationProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Routes>
              <Route path="/users" element={<User />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
              <Route path="/admin/employees" element={<AdminLayout><AdminEmployees /></AdminLayout>} />
              <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
              <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
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
      </AuthProvider>
    </NotificationProvider>
  );
};

export default App;
