import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, Heart, Clock, ArrowRight, LayoutDashboard } from 'lucide-react';
import ProductCard from './ProductCard.jsx';
import api from '../store/api.js';

const Storefront = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products?limit=8');
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();

    const saved = localStorage.getItem('recentlyViewed');
    if (saved) {
      setRecentlyViewed(JSON.parse(saved).slice(0, 4));
    }
  }, []);

  const categories = [
    { id: 'fashion', name: 'Fashion', icon: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80' },
    { id: 'electronics', name: 'Tech', icon: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80' },
    { id: 'beauty', name: 'Beauty', icon: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80' },
    { id: 'home-living', name: 'Home', icon: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
      style={{ background: '#FFFFFF', minHeight: '100vh', padding: '3rem 0 6rem 0' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header / Greeting */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #E5E7EB', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#71717A', display: 'block', marginBottom: '0.5rem' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', fontWeight: 900, color: '#09090B', lineHeight: 1.1 }}>
              Welcome back, {userInfo?.name?.split(' ')[0]}.
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {userInfo?.role === 'admin' && (
              <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: '#000000', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', textDecoration: 'none' }}>
                <LayoutDashboard size={14} /> Admin Panel
              </Link>
            )}
            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#09090B', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', textDecoration: 'none' }}>
              <Package size={14} /> Orders
            </Link>
            <Link to="/wishlist" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: '#000000', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', textDecoration: 'none' }}>
              <Heart size={14} /> Wishlist
            </Link>
          </div>
        </div>

        {/* Functional Categories Grid */}
        <div style={{ marginBottom: '4rem' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <motion.div 
                key={cat.id} 
                whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(0,0,0,0.06)' }} 
                transition={{ duration: 0.25, ease: 'easeOut' }}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer'
                }}
              >
                <Link to={`/shop?category=${cat.id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ position: 'relative', width: '100%', height: '150px', overflow: 'hidden', background: '#F9FAFB' }}>
                    <img 
                      src={cat.icon} 
                      alt={cat.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 40%)', pointerEvents: 'none' }} />
                  </div>
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', background: '#FFFFFF' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#09090B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {cat.name}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#71717A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Shop Collection <ArrowRight size={10} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recently Viewed (If any) */}
        {recentlyViewed.length > 0 && (
          <div style={{ marginBottom: '5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#09090B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Jump Back In
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyViewed.map(prod => (
                <ProductCard key={prod.id || prod._id} product={prod} />
              ))}
            </div>
          </div>
        )}

        {/* Recommended for You */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#09090B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              New Arrivals
            </h2>
            <Link to="/shop" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#09090B', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', textDecoration: 'none', borderBottom: '1px solid #09090B' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map(prod => (
              <ProductCard key={prod.id || prod._id} product={prod} />
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Storefront;
