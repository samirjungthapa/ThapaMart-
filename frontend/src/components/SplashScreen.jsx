import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500); // Trigger complete after full load
          return 100;
        }
        return prev + 2.5;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center select-none overflow-hidden">
      {/* Background ambient glowing spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex flex-col items-center space-y-8 max-w-sm w-full px-6">
        
        {/* Animated Brand Emblem */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-primary via-secondary to-accent flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.4)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="text-white text-4xl font-black tracking-tighter">T</span>
          </div>
        </motion.div>

        {/* Brand Name & Tagline */}
        <div className="text-center space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-3xl font-black text-white tracking-tight"
          >
            Thapa<span className="text-primary">Mart</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-xs text-slate-400 font-medium tracking-widest uppercase"
          >
            Shop Smarter. Live Better.
          </motion.p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full space-y-2.5">
          <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            <span>Core Modules</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SplashScreen;
