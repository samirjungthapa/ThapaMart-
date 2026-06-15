import React, { useState, createContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout Components
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import CompareDrawer from './components/CompareDrawer.jsx';
import SplashScreen from './components/SplashScreen.jsx';
import PageTransition from './components/PageTransition.jsx';

// Pages
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Shop from './pages/Shop.jsx';
import Categories from './pages/Categories.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import OrderFailed from './pages/OrderFailed.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

export const CompareContext = createContext();

function AppContent({ compareList, removeFromCompare, clearCompare }) {
  const location = useLocation();

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
            <Route path="/categories" element={<PageTransition><Categories /></PageTransition>} />
            <Route path="/products/:id" element={<PageTransition><ProductDetails /></PageTransition>} />
            <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
            <Route path="/wishlist" element={<PageTransition><Wishlist /></PageTransition>} />
            <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
            <Route path="/order-success" element={<PageTransition><OrderSuccess /></PageTransition>} />
            <Route path="/order-failed" element={<PageTransition><OrderFailed /></PageTransition>} />
            <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
            <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Global Product Comparison Drawer */}
      <CompareDrawer
        compareList={compareList}
        removeFromCompare={removeFromCompare}
        clearCompare={clearCompare}
      />

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
