import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Product, CartItem } from './types';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';

// Layouts
import { MainLayout } from './components/layout/MainLayout';
import { AdminLayout } from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Shared Components
import { CartSidebar } from './components/CartSidebar';

// Lazy Pages
const Home = React.lazy(() => import('./pages/Home'));
const Category = React.lazy(() => import('./pages/Category'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const SearchResults = React.lazy(() => import('./pages/SearchResults'));
const Brands = React.lazy(() => import('./pages/Brands'));
const Compare = React.lazy(() => import('./pages/Compare'));
const FlashSale = React.lazy(() => import('./pages/FlashSale'));
const NewArrivals = React.lazy(() => import('./pages/NewArrivals'));
const BestSellers = React.lazy(() => import('./pages/BestSellers'));
const Catalog = React.lazy(() => import('./pages/Catalog'));

// Auth & Profile
const Auth = React.lazy(() => import('./pages/Auth'));
const Profile = React.lazy(() => import('./pages/Profile'));
const EditProfile = React.lazy(() => import('./pages/EditProfile'));
const AddAddress = React.lazy(() => import('./pages/AddAddress'));
const EditAddress = React.lazy(() => import('./pages/EditAddress'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));

// Admin Pages
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = React.lazy(() => import('./pages/admin/AdminProducts'));
const AdminEmployees = React.lazy(() => import('./pages/admin/AdminEmployees'));
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const App: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, document.title, window.location.pathname);
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
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Admin Routes with Protected Guard */}
                <Route path="/admin">
                  <Route index element={<AdminLogin />} />
                  <Route path="dashboard" element={<ProtectedRoute isAdmin><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
                  <Route path="products" element={<ProtectedRoute isAdmin><AdminLayout><AdminProducts /></AdminLayout></ProtectedRoute>} />
                  <Route path="employees" element={<ProtectedRoute isAdmin><AdminLayout><AdminEmployees /></AdminLayout></ProtectedRoute>} />
                  <Route path="users" element={<ProtectedRoute isAdmin><AdminLayout><AdminUsers /></AdminLayout></ProtectedRoute>} />
                </Route>
                
                {/* Main Application with New Layout */}
                <Route path="/" element={
                  <MainLayout 
                    cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    onOpenCart={() => setIsCartOpen(true)}
                  />
                }>
                  <Route index element={<Home onAddToCart={addToCart} />} />
                  <Route path="catalog" element={<Catalog onAddToCart={addToCart} />} />
                  <Route path="category" element={<Category onAddToCart={addToCart} />} />
                  <Route path="product/:id" element={<ProductDetail onAddToCart={addToCart} />} />
                  <Route path="search" element={<SearchResults onAddToCart={addToCart} />} />
                  <Route path="brands" element={<Brands onAddToCart={addToCart} />} />
                  <Route path="compare" element={<Compare />} />
                  <Route path="flash-sale" element={<FlashSale onAddToCart={addToCart} />} />
                  <Route path="new-arrivals" element={<NewArrivals onAddToCart={addToCart} />} />
                  <Route path="best-sellers" element={<BestSellers onAddToCart={addToCart} />} />
                  
                  {/* Auth & Profile */}
                  <Route path="auth" element={<Auth />} />
                  <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                  <Route path="profile/addresses/add" element={<ProtectedRoute><AddAddress /></ProtectedRoute>} />
                  <Route path="profile/addresses/edit/:id" element={<ProtectedRoute><EditAddress /></ProtectedRoute>} />
                  <Route path="reset-password" element={<ResetPassword />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>

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
