import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiShoppingBag, FiStar } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice.js';

const FlashSales = ({ products }) => {
  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 32, seconds: 15 });

  // Filter products that have a discount of 15% or more
  const flashProducts = products
    .filter(p => p.discount && p.discount >= 15)
    .slice(0, 4);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return { hours: 0, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    dispatch(
      addToCart({
        product: product.id || product._id,
        title: product.title,
        price: Number((product.price * (1 - product.discount / 100)).toFixed(2)),
        image: product.images[0],
        stock: product.stock,
        quantity: 1,
      })
    );
  };

  if (flashProducts.length === 0) return null;

  return (
    <section className="py-16 bg-slate-900 text-white relative overflow-hidden rounded-[40px] my-16 mx-4 sm:mx-8 lg:mx-16 shadow-2xl">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
        
        {/* Header with Countdown */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 border-b border-white/10 pb-8 gap-6">
          <div>
            <span className="px-3.5 py-1.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
              ⚡ Limited Time Offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-3">
              Elite Flash Sale
            </h2>
          </div>

          <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/10 shadow-lg">
            <FiClock className="w-5 h-5 text-red-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ends In</span>
            <div className="flex space-x-2 text-xl font-mono font-black">
              <span className="bg-red-500 px-2 py-0.5 rounded text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-red-500">:</span>
              <span className="bg-red-500 px-2 py-0.5 rounded text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-red-500">:</span>
              <span className="bg-red-500 px-2 py-0.5 rounded text-white">{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {flashProducts.map((product, index) => {
            const discountedPrice = (product.price * (1 - product.discount / 100)).toFixed(2);
            return (
              <motion.div
                key={product.id || product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-premium relative group flex flex-col h-full p-4"
              >
                
                {/* Product Image */}
                <Link to={`/products/${product.id || product._id}`} className="block relative overflow-hidden aspect-square rounded-2xl mb-4 bg-slate-950">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {product.discount}% OFF
                  </div>
                </Link>

                {/* Content */}
                <div className="flex flex-col flex-grow">
                  <span className="text-[9px] font-bold text-accent uppercase tracking-wider mb-1.5">
                    {product.category}
                  </span>
                  
                  <Link to={`/products/${product.id || product._id}`} className="block mb-2">
                    <h3 className="text-sm font-semibold text-white group-hover:text-accent transition-colors line-clamp-1">
                      {product.title}
                    </h3>
                  </Link>

                  <div className="flex items-center space-x-1.5 mb-4">
                    <FiStar className="w-3.5 h-3.5 text-amber-400 fill-current" />
                    <span className="text-xs font-bold text-slate-300">{product.ratings || '5.0'}</span>
                  </div>

                  {/* Pricing and Cart Button */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/10">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 line-through">${product.price}</span>
                      <span className="text-base font-black text-white">${discountedPrice}</span>
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="p-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white transition-all duration-300 hover:scale-105"
                      aria-label="Buy Now"
                    >
                      <FiShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FlashSales;
