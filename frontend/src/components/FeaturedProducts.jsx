import React, { useEffect, useState } from 'react';
import api from '../store/api.js';
import ProductCard from './ProductCard.jsx';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/products', { params: { limit: 8, sort: 'rating' } });
        setProducts(data.products || []);
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section style={{ padding: '6rem 0', background: '#FFFFFF', overflow: 'hidden' }}>
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#71717A', marginBottom: '1rem' }}>
            The Edit
          </span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 900, color: '#09090B', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Featured Essentials
          </h2>
          <div style={{ width: '2rem', height: '2px', background: '#09090B' }} />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '1rem' }}>
                <div style={{ aspectRatio: '4/5', background: '#F9FAFB', animation: 'pulse 2s infinite', marginBottom: '1rem' }} />
                <div style={{ height: '1rem', width: '70%', background: '#F9FAFB', animation: 'pulse 2s infinite', marginBottom: '0.5rem' }} />
                <div style={{ height: '0.75rem', width: '40%', background: '#F9FAFB', animation: 'pulse 2s infinite' }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id || product._id} product={product} index={i} />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#09090B', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', textDecoration: 'none', borderBottom: '1px solid #09090B', paddingBottom: '0.25rem' }}>
            View Full Collection <ArrowRight size={14} />
          </Link>
        </div>

      </motion.div>
    </section>
  );
};

export default FeaturedProducts;
