import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard.jsx';
import api from '../store/api.js';

const FlashSales = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const fetchFlashSales = async () => {
      try {
        const { data } = await api.get('/products', { params: { limit: 4, sort: 'priceAsc' } });
        setProducts(data.products || []);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashSales();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section style={{ padding: '6rem 0', background: '#F9FAFB', overflow: 'hidden' }}>
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#EF4444', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
            <Clock size={14} /> Flash Sale
          </div>
          
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 900, color: '#09090B', letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
            Limited Time Offers
          </h2>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '4rem', height: '4rem', background: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: '#09090B', marginBottom: '0.5rem' }}>
                  {String(value).padStart(2, '0')}
                </div>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#71717A' }}>{unit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id || product._id} product={product} index={i} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <Link to="/shop?sort=priceAsc" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#09090B', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', textDecoration: 'none', borderBottom: '1px solid #09090B', paddingBottom: '0.25rem' }}>
            View All Offers <ArrowRight size={14} />
          </Link>
        </div>

      </motion.div>
    </section>
  );
};

export default FlashSales;
