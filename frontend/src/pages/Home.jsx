import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero.jsx';
import CategoriesSection from '../components/CategoriesSection.jsx';
import FeaturedProducts from '../components/FeaturedProducts.jsx';
import FlashSales from '../components/FlashSales.jsx';
import Testimonials from '../components/Testimonials.jsx';
import Newsletter from '../components/Newsletter.jsx';
import ProductCard from '../components/ProductCard.jsx';
import api from '../store/api.js';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products?limit=52');
        setProducts(data.products || []);
      } catch (err) {
        console.warn("ℹ️ Failed to fetch products for home page flash sale.");
      }
    };
    fetchProducts();

    // Load recently viewed
    const saved = localStorage.getItem('recentlyViewed');
    if (saved) {
      setRecentlyViewed(JSON.parse(saved).slice(0, 4));
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="premium-mesh-bg min-h-screen"
    >
      <Hero />
      <CategoriesSection />
      <FeaturedProducts />
      
      {products.length > 0 && <FlashSales products={products} />}

      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <section className="py-16 bg-slate-50/30 dark:bg-slate-900/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Recently Viewed
              </h2>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                Pick up right where you left off.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {recentlyViewed.map((prod) => (
                <ProductCard key={prod.id || prod._id} product={prod} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Testimonials />
      <Newsletter />
    </motion.div>
  );
};

export default Home;

