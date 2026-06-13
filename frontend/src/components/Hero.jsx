import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const slides = [
  {
    tagline: "✨ Future of Online Shopping",
    title: "Experience the Future of Online Shopping",
    subtitle: "Premium products. Exceptional experiences. Delivered seamlessly.",
    price: "$1,199.99",
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80",
    bgGradient: "from-primary/10 via-secondary/5 to-transparent",
    actionLink: "/shop"
  },
  {
    tagline: "👔 Modern Minimalist Fashion",
    title: "Sartorial Wool Blend Trench Coat",
    subtitle: "An elegant, double-breasted trench coat tailored from a premium wool blend.",
    price: "$219.99",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
    bgGradient: "from-secondary/10 via-primary/5 to-transparent",
    actionLink: "/products/prod-15"
  },
  {
    tagline: "🎮 Ultimate Battle Station",
    title: "PlayStation 5 Pro Console",
    subtitle: "Play your favorite games with enhanced ray tracing and advanced SSD speeds.",
    price: "$699.99",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80",
    bgGradient: "from-secondary/15 via-accent/5 to-transparent",
    actionLink: "/products/prod-47"
  }
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Safe offset calculation
  const parallaxX = (coords.x - 400) * 0.04;
  const parallaxY = (coords.y - 300) * 0.04;

  return (
    <div className="relative overflow-hidden py-12 sm:py-20 lg:py-24 border-b border-slate-100 dark:border-slate-800/40 aurora-bg">
      
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div 
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setCoords({ x: 0, y: 0 });
          }}
          className="relative group glass-panel rounded-[32px] p-8 sm:p-12 lg:p-16 shadow-premium border border-white/50 dark:border-white/5 overflow-hidden"
        >
          
          {/* Dynamic Spotlight */}
          {isHovered && (
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                background: `radial-gradient(600px circle at ${coords.x}px ${coords.y}px, rgba(59, 130, 246, 0.12), transparent 45%)`,
                zIndex: 1
              }}
            />
          )}

          {/* Animated slides */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[350px]">
            
            {/* Slide Details */}
            <div className="lg:col-span-6 space-y-6 z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent text-xs font-semibold tracking-wide uppercase">
                    {slides[current].tagline}
                  </span>
                  
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    {slides[current].title}
                  </h1>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-md">
                    {slides[current].subtitle}
                  </p>
 
                  <div className="pt-2 flex items-baseline space-x-2">
                    <span className="text-xs text-slate-400 font-bold uppercase">Featured at</span>
                    <span className="text-2xl font-black text-primary dark:text-accent">{slides[current].price}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
 
              {/* Call to Actions */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/shop"
                  className="flex items-center justify-center px-7 py-3 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold text-xs shadow-premium transition-all duration-300 hover:scale-105"
                >
                  Start Shopping
                  <FiArrowRight className="ml-2 w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/shop"
                  className="flex items-center justify-center px-7 py-3 rounded-full bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-800 shadow-premium transition-all duration-300 hover:scale-105"
                >
                  Explore Collection
                </Link>
              </div>
            </div>

            {/* Slide Image Showcase */}
            <div className="lg:col-span-6 flex justify-center z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    x: isHovered ? parallaxX : 0,
                    y: isHovered ? parallaxY : 0
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 90, damping: 20 }}
                  className="relative w-full max-w-sm"
                >
                  <div className="overflow-hidden rounded-3xl aspect-square flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/40 p-4 border border-slate-100 dark:border-slate-850 shadow-premium">
                    <img
                      src={slides[current].image}
                      alt={slides[current].title}
                      className="max-h-72 object-contain drop-shadow-2xl hover:rotate-3 transition-transform duration-500"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          {/* Navigation controls */}
          <div className="absolute bottom-6 right-8 flex space-x-2 z-20">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-150 dark:border-slate-800 shadow-md transition-all hover:scale-110"
              aria-label="Previous Slide"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-150 dark:border-slate-800 shadow-md transition-all hover:scale-110"
              aria-label="Next Slide"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pagination Indicators */}
          <div className="absolute bottom-6 left-8 flex space-x-1.5 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-1.5 rounded-full transition-all duration-350 ${current === idx ? 'w-6 bg-primary' : 'w-1.5 bg-slate-300 dark:bg-slate-700'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};

export default Hero;
