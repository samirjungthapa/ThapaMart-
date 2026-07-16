import React, { useState, createContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout Components
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import CompareDrawer from './components/CompareDrawer.jsx';
import SplashScreen from './components/SplashScreen.jsx';
import PageTransition from './components/PageTransition.jsx';
import SpinWheel from './components/SpinWheel.jsx';
import MartAI from './components/MartAI.jsx';
import CollaborativeShop from './components/CollaborativeShop.jsx';
import SoundscapeEngine from './components/SoundscapeEngine.jsx';


import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { setCartItems } from './store/slices/cartSlice.js';
import { logout } from './store/slices/authSlice.js';
import api from './store/api.js';

// Pages
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Shop from './pages/Shop.jsx';
import Collections from './pages/Collections.jsx';
import About from './pages/About.jsx';
import Categories from './pages/Categories.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import OrderFailed from './pages/OrderFailed.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import PaymentGateway from './pages/PaymentGateway.jsx';

export const CompareContext = createContext();

function AppContent({ compareList, removeFromCompare, clearCompare }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [toast, setToast] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      const needsSync = localStorage.getItem('cartNeedsSync');
      if (needsSync === 'true' && userInfo) {
        api.put('/auth/cart', { cartItems })
          .then(() => {
            console.log('✅ Cart successfully synchronized with server.');
            localStorage.removeItem('cartNeedsSync');
          })
          .catch((err) => console.error('Failed to retry syncing cart:', err));
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [userInfo, cartItems]);

  useEffect(() => {
    const handleAuthLogout = () => {
      dispatch(logout());
    };
    window.addEventListener('auth_logout', handleAuthLogout);
    return () => {
      window.removeEventListener('auth_logout', handleAuthLogout);
    };
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) {
      api.get('/auth/cart')
        .then(({ data }) => {
          if (data) dispatch(setCartItems(data));
        })
        .catch((err) => console.error('Error fetching user cart:', err));
    }
  }, [userInfo, dispatch]);

  useEffect(() => {
    if (!isOnline) return;

    const eventSource = new EventSource('/api/live-updates');

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'PRODUCT_CREATED') {
          setToast(`🎉 New Product: ${payload.data.title}`);
        } else if (payload.type === 'PRODUCT_UPDATED') {
          setToast(`🔄 Updated: ${payload.data.title}`);
        } else if (payload.type === 'ORDER_UPDATED') {
          setToast(`📦 Order Status: Order #${payload.data._id || payload.data.id} is now ${payload.data.orderStatus}!`);
        }
      } catch (e) {
        console.error('SSE Error:', e);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [isOnline]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor:'var(--bg-primary)', color:'var(--text-primary)', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      
      {!isOnline && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.15)',
          backdropFilter: 'blur(10px)',
          color: '#f59e0b',
          borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
          textAlign: 'center',
          padding: '0.5rem',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.05em',
          zIndex: 10000,
          position: 'sticky',
          top: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%', display: 'inline-block' }} />
          ⚠️ Operating in high-performance local offline mode. Orders and profiles will sync once back online.
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow relative">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/shop" element={<PageTransition><Shop /></PageTransition>} />
            <Route path="/collections" element={<PageTransition><Collections /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/categories" element={<PageTransition><Categories /></PageTransition>} />
            <Route path="/products/:id" element={<PageTransition><ProductDetails /></PageTransition>} />
            <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
            <Route path="/wishlist" element={<PageTransition><Wishlist /></PageTransition>} />
            <Route path="/checkout" element={<PageTransition><ProtectedRoute><Checkout /></ProtectedRoute></PageTransition>} />
            <Route path="/order-success" element={<PageTransition><ProtectedRoute><OrderSuccess /></ProtectedRoute></PageTransition>} />
            <Route path="/payment-gateway" element={<PageTransition><ProtectedRoute><PaymentGateway /></ProtectedRoute></PageTransition>} />
            <Route path="/order-failed" element={<PageTransition><ProtectedRoute><OrderFailed /></ProtectedRoute></PageTransition>} />
            <Route path="/dashboard" element={<PageTransition><ProtectedRoute><Dashboard /></ProtectedRoute></PageTransition>} />
            <Route path="/profile" element={<PageTransition><ProtectedRoute><Dashboard /></ProtectedRoute></PageTransition>} />
            <Route path="/admin" element={<PageTransition><AdminRoute><AdminDashboard /></AdminRoute></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Global Product Comparison Drawer */}
      <CompareDrawer
        compareList={compareList}
        removeFromCompare={removeFromCompare}
        clearCompare={clearCompare}
      />

      {/* Gamified Rewards */}
      {location.pathname === '/checkout' && <SpinWheel />}

      {/* Conversational Assistant */}
      <MartAI />

      {/* Real-time Collaborative shopping */}
      <CollaborativeShop />

      {/* Ambient Soundscapes */}
      <SoundscapeEngine />

      {/* Footer */}
      <Footer />

      {/* Real-time SSE Notification Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#09090B',
          color: '#FFFFFF',
          padding: '1rem 1.5rem',
          border: '1px solid #3b82f6',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
          zIndex: 9999,
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          animation: 'slideUp 0.3s ease-out'
        }}>
          <span style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%', display: 'inline-block' }} />
          {toast}
        </div>
      )}

    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [compareList, setCompareList] = useState([]);

  const addToCompare = (product) => {
    if (compareList.length >= 4) {
      alert("You can compare up to 4 products at once!");
      return;
    }
    if (!compareList.some(p => (p.id || p._id) === (product.id || product._id))) {
      setCompareList(prev => [...prev, product]);
    }
  };

  const removeFromCompare = (productId) => {
    setCompareList(prev => prev.filter(p => (p.id || p._id) !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare }}>
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <Router>
          <AppContent
            compareList={compareList}
            removeFromCompare={removeFromCompare}
            clearCompare={clearCompare}
          />
        </Router>
      )}
    </CompareContext.Provider>
  );
}

export default App;
