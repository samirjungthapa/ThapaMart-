import React, { useEffect, useState } from 'react';
import api from '../store/api.js';
import ProductCard from './ProductCard.jsx';
import { motion } from 'framer-motion';

const fallbackProducts = [
  {
    id: "prod-13",
    title: "Nebula OLED Gaming Monitor",
    description: "Immersive 34-inch curved OLED gaming display featuring a 240Hz refresh rate, 0.03ms response time, and stunning HDR600 contrast.",
    category: "electronics",
    price: 699.99,
    stock: 15,
    images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80"],
    ratings: 4.9
  },
  {
    id: "prod-14",
    title: "StudioPro Mechanical Keyboard",
    description: "Hot-swappable custom mechanical keyboard with gasket-mounted design, pre-lubed linear switches, and triple-mode wireless connectivity.",
    category: "electronics",
    price: 179.99,
    stock: 30,
    images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80"],
    ratings: 4.7
  },
  {
    id: "prod-15",
    title: "Sartorial Wool Blend Trench Coat",
    description: "An elegant, double-breasted trench coat tailored from a premium heavyweight wool blend. Features classic lapels and adjustable waist belt.",
    category: "fashion",
    price: 219.99,
    stock: 25,
    images: ["https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80"],
    ratings: 4.6
  },
  {
    id: "prod-20",
    title: "Velvet Petal Hydrating Lip Balm",
    description: "Nourishing lip treatment infused with rich organic shea butter, cold-pressed coconut oil, and a delicate vanilla rose aroma.",
    category: "beauty",
    price: 14.99,
    stock: 200,
    images: ["https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80"],
    ratings: 4.9
  }
];

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products?limit=4&sort=rating');
        setProducts(data.products || []);
      } catch (err) {
        console.warn("ℹ️ API fetch failed or backend is starting up. Using premium static featured fallbacks.");
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-16 bg-slate-50/50 dark:bg-slate-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Trending Products
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Our most-demanded and highly-reviewed products of the week.
            </p>
          </div>
        </div>

        {/* Loading Skeleton / Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse glass-card rounded-2xl p-5 h-96 space-y-4">
                <div className="bg-slate-200 dark:bg-slate-800 rounded-xl aspect-square w-full"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedProducts;
