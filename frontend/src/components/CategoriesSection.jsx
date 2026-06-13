import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCpu, FiWatch, FiHome, FiSmile, FiActivity, FiTag, FiTv } from 'react-icons/fi';

const categories = [
  { name: 'Electronics', slug: 'electronics', icon: FiCpu, color: 'from-blue-500/10 to-indigo-500/10 text-blue-500' },
  { name: 'Fashion', slug: 'fashion', icon: FiTag, color: 'from-pink-500/10 to-rose-500/10 text-pink-500' },
  { name: 'Home & Living', slug: 'home-living', icon: FiHome, color: 'from-amber-500/10 to-orange-500/10 text-amber-500' },
  { name: 'Beauty', slug: 'beauty', icon: FiSmile, color: 'from-teal-500/10 to-emerald-500/10 text-teal-500' },
  { name: 'Sports', slug: 'sports', icon: FiActivity, color: 'from-purple-500/10 to-violet-500/10 text-purple-500' },
  { name: 'Gaming', slug: 'gaming', icon: FiTv, color: 'from-red-500/10 to-orange-500/10 text-red-500' },
  { name: 'Accessories', slug: 'electronics', icon: FiWatch, color: 'from-cyan-500/10 to-sky-500/10 text-cyan-500' }, // Map to electronics or accessories for simplicity
];

const CategoriesSection = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Curated Categories
          </h2>
          <p className="mt-2.5 text-sm text-slate-500 dark:text-slate-400">
            Explore our meticulously designed products tailored for your specific lifestyle and requirements.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.slug + index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  to={`/shop?category=${cat.slug}`}
                  className="flex flex-col items-center justify-center p-6 rounded-2xl glass-card border border-slate-100 dark:border-slate-800 shadow-premium hover:shadow-premium-hover transition-all text-center h-full group"
                >
                  <div className={`p-4 rounded-xl bg-gradient-to-tr ${cat.color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="mt-4.5 text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary dark:group-hover:text-accent transition-colors">
                    {cat.name}
                  </h3>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CategoriesSection;
