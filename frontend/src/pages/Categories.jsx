import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCpu, FiTag, FiHome, FiSmile, FiActivity, FiTv, FiArrowRight, FiWatch, FiBriefcase } from 'react-icons/fi';

const categoriesList = [
  {
    name: 'Electronics',
    slug: 'electronics',
    icon: FiCpu,
    description: 'Next-generation tech, smart devices, and high-performance engineering.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    count: '10 Items',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    name: 'Fashion Essentials',
    slug: 'fashion',
    icon: FiTag,
    description: 'Curated premium garments, designer apparel, and timeless wardrobe mainstays.',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
    count: '10 Items',
    color: 'from-pink-500 to-rose-600'
  },
  {
    name: 'Home & Living',
    slug: 'home-living',
    icon: FiHome,
    description: 'Sleek workspace setups, organic weighted comfort, and artistic enhancements.',
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=600&auto=format&fit=crop&q=80',
    count: '10 Items',
    color: 'from-amber-500 to-orange-600'
  },
  {
    name: 'Beauty & Skincare',
    slug: 'beauty',
    icon: FiSmile,
    description: 'Pure organic botanicals, plumping serums, and luxury cosmetic brushes.',
    image: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?w=600&auto=format&fit=crop&q=80',
    count: '8 Items',
    color: 'from-teal-500 to-emerald-600'
  },
  {
    name: 'Sports & Outdoors',
    slug: 'sports',
    icon: FiActivity,
    description: 'Responsive athletic gear, carbon road racing, and smart fitness kettlebells.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    count: '8 Items',
    color: 'from-purple-500 to-violet-600'
  },
  {
    name: 'Gaming Universe',
    slug: 'gaming',
    icon: FiTv,
    description: 'Ray-traced console bundles, custom mechanical keys, and tactile gaming mice.',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80',
    count: '6 Items',
    color: 'from-red-500 to-orange-600'
  },
  {
    name: 'Accessories & Watches',
    slug: 'accessories',
    icon: FiWatch,
    description: 'Exquisite chronographs, luxury leather wallets, and elegant style accents.',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&auto=format&fit=crop&q=80',
    count: '5 Items',
    color: 'from-fuchsia-500 to-purple-600'
  },
  {
    name: 'Smart Office & Books',
    slug: 'office',
    icon: FiBriefcase,
    description: 'Walnut desk organizers, professional stands, smart writing sets, and lighting.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    count: '5 Items',
    color: 'from-cyan-500 to-teal-600'
  }
];

const Categories = () => {
  return (
    <div className="premium-mesh-bg min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="px-3.5 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent text-xs font-bold uppercase tracking-wider">
            Explore Collections
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mt-4 tracking-tight">
            Curated Categories
          </h1>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Browse our meticulously designed collections tailored for your tech, style, and wellness needs.
          </p>
        </div>

        {/* Categories List/Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoriesList.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ y: -8 }}
                className="glass-card rounded-[32px] overflow-hidden shadow-premium hover:shadow-premium-hover border border-slate-100 dark:border-slate-800/60 transition-all duration-300 relative group flex flex-col min-h-[380px]"
              >
                {/* Background Image Banner */}
                <div className="h-44 relative overflow-hidden bg-slate-900">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10"></div>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                    loading="lazy"
                  />
                  
                  {/* Icon Badge */}
                  <div className={`absolute top-4 left-4 p-3.5 rounded-2xl bg-gradient-to-tr ${cat.color} text-white shadow-lg z-20`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Count Indicator */}
                  <div className="absolute bottom-4 left-6 z-20">
                    <span className="text-[10px] font-black text-accent uppercase tracking-wider bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                      {cat.count}
                    </span>
                  </div>
                </div>

                {/* Content body */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div className="space-y-2.5">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-accent transition-colors">
                      {cat.name}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-6">
                    <Link
                      to={`/shop?category=${cat.slug}`}
                      className="flex items-center text-xs font-bold text-primary dark:text-accent group-hover:text-primary-dark transition-colors"
                    >
                      Shop Collection <FiArrowRight className="ml-1.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Categories;
