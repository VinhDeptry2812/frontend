import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartSidebar } from './components/CartSidebar';

// Pages - User
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

// Pages - Admin (KHÔNG SỬA)
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
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminProductStats } from './pages/admin/AdminProductStats';

// Contexts
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthModalProvider } from './context/AuthModalContext';

const App: React.FC = () => {
  // Handle OAuth token in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, document.title, window.location.pathname);
      window.location.reload();
    }
  }, []);

  return (
    <LanguageProvider>
      <NotificationProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Router>
                <AuthModalProvider>
                  <div className="min-h-screen flex flex-col">
                  <Routes>
                    {/* ===== ADMIN ROUTES (KHÔNG ĐỤNG) ===== */}
                    <Route path="/users" element={<User />} />
                    <Route path="/admin" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
                    <Route path="/admin/employees" element={<AdminRoute><AdminLayout><AdminEmployees /></AdminLayout></AdminRoute>} />
                    <Route path="/admin/products" element={<AdminRoute><AdminLayout><AdminProducts /></AdminLayout></AdminRoute>} />
                    <Route path="/admin/product-stats" element={<AdminRoute><AdminLayout><AdminProductStats /></AdminLayout></AdminRoute>} />
                    <Route path="/admin/categories" element={<AdminRoute><AdminLayout><AdminCategories /></AdminLayout></AdminRoute>} />
                    <Route path="/admin/users" element={<AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>} />
                    <Route path="/admin/coupons" element={<AdminRoute><AdminLayout><AdminCoupons /></AdminLayout></AdminRoute>} />
                    <Route path="/admin/orders" element={<AdminRoute><AdminLayout><AdminOrders /></AdminLayout></AdminRoute>} />
                    <Route path="/admin/profile" element={<AdminRoute><AdminLayout><AdminProfile /></AdminLayout></AdminRoute>} />

                    {/* ===== USER ROUTES ===== */}
                    <Route
                      path="*"
                      element={
                        <>
                          <Navbar />
                          <main className="flex-grow">
                            <Routes>
                              <Route path="/" element={<Home />} />
                              <Route path="/catalog" element={<Catalog />} />
                              <Route path="/product/:id" element={<ProductDetail />} />
                              <Route path="/checkout" element={<Checkout />} />
                              <Route path="/auth" element={<Auth />} />
                              <Route path="/reset-password" element={<ResetPassword />} />
                              <Route path="/profile" element={<Profile />} />
                              <Route path="/profile/edit" element={<EditProfile />} />
                              <Route path="/profile/address/new" element={<AddAddress />} />
                              <Route path="/profile/address/edit/:id" element={<EditAddress />} />
                            </Routes>
                          </main>
                          <Footer />
                          <CartSidebar />
                        </>
                      }
                    />
                  </Routes>
                </div>
              </AuthModalProvider>
            </Router>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </NotificationProvider>
    </LanguageProvider>
  );
};

export default App;
