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


import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { setCartItems } from './store/slices/cartSlice.js';
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

  useEffect(() => {
    if (userInfo) {
      api.get('/auth/cart')
        .then(({ data }) => {
          if (data) dispatch(setCartItems(data));
        })
        .catch((err) => console.error('Error fetching user cart:', err));
    }
  }, [userInfo, dispatch]);

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor:'#FFFFFF', color:'#09090B' }}>
      
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

      {/* Footer */}
      <Footer />

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
