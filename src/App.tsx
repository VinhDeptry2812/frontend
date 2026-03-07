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
import { Product, CartItem } from './types';

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
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
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
                    <Route path="/user" element={<User />} />
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
  );
};

export default App;
