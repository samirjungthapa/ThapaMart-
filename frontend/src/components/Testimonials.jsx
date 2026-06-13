import React from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

const reviews = [
  {
    name: 'Sarah Jenkins',
    role: 'Tech Enthusiast',
    comment: 'The wireless sound headphones exceed all expectations! Active noise canceling is perfect for my daily commute. Will definitely buy again.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    rating: 5,
  },
  {
    name: 'David Kojo',
    role: 'Creative Director',
    comment: 'Exceptional service and extremely fast shipping! The leather smartwatch looks incredibly premium and fits perfectly into my professional styling.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
  },
  {
    name: 'Emily Smith',
    role: 'Interior Designer',
    comment: 'ThapaMart has become my go-to shop for home décor. The desk chair is highly adjustable, comfortable, and beautifully constructed.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-white dark:bg-bg-dark transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Loved By Customers
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            See what our verified global community has to say about their premium purchases.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, index) => (
            <motion.div
              key={rev.name + index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="glass-card rounded-2xl p-6 shadow-premium hover:shadow-premium-hover border border-slate-100 dark:border-slate-800 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Rating */}
                <div className="flex text-amber-400 mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <FiStar key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center space-x-3.5 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">{rev.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{rev.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
