import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Star, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';

const Hero = () => {
  // Spotlight coords
  const [spotlightCoords, setSpotlightCoords] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlightCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Flagship Card 3D Tilt values
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const springRotateX = useSpring(useTransform(cardY, [-200, 200], [15, -15]), { damping: 20, stiffness: 120 });
  const springRotateY = useSpring(useTransform(cardX, [-200, 200], [-15, 15]), { damping: 20, stiffness: 120 });

  // Reflection gloss sheen position
  const sheenX = useSpring(useTransform(cardX, [-200, 200], ['-30%', '130%']), { damping: 20, stiffness: 120 });
  const sheenY = useSpring(useTransform(cardY, [-200, 200], ['-30%', '130%']), { damping: 20, stiffness: 120 });

  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    cardX.set(e.clientX - centerX);
    cardY.set(e.clientY - centerY);
  };

  const handleCardMouseLeave = () => {
    cardX.set(0);
    cardY.set(0);
  };

  // Magnetic Button 1 Physics
  const btn1X = useMotionValue(0);
  const btn1Y = useMotionValue(0);
  const springBtn1X = useSpring(btn1X, { damping: 15, stiffness: 150 });
  const springBtn1Y = useSpring(btn1Y, { damping: 15, stiffness: 150 });

  const handleBtn1Move = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;
    btn1X.set(mouseX * 0.4);
    btn1Y.set(mouseY * 0.4);
  };

  const handleBtn1Leave = () => {
    btn1X.set(0);
    btn1Y.set(0);
  };

  // Magnetic Button 2 Physics
  const btn2X = useMotionValue(0);
  const btn2Y = useMotionValue(0);
  const springBtn2X = useSpring(btn2X, { damping: 15, stiffness: 150 });
  const springBtn2Y = useSpring(btn2Y, { damping: 15, stiffness: 150 });

  const handleBtn2Move = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;
    btn2X.set(mouseX * 0.4);
    btn2Y.set(mouseY * 0.4);
  };

  const handleBtn2Leave = () => {
    btn2X.set(0);
    btn2Y.set(0);
  };

  // Stagger reveal animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const textItem = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 100 } }
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden min-h-screen flex items-center bg-[#FFFFFF] py-16 lg:py-24"
      style={{
        position: 'relative',
        boxSizing: 'border-box'
      }}
    >
      {/* Dynamic Cursor Spotlight Overlay */}
      <div 
        className="absolute pointer-events-none inset-0 z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${spotlightCoords.x}px ${spotlightCoords.y}px, rgba(16, 185, 129, 0.04), transparent 80%)`
        }}
      />

      {/* Dynamic Animated Aurora Background Orb */}
      <div 
        className="absolute right-[-10%] top-[30%] w-[55vw] h-[55vw] rounded-full z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.04) 0%, rgba(52, 211, 153, 0.01) 60%, transparent 100%)',
          filter: 'blur(80px)'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Text Column */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col space-y-6"
          >
            {/* New Season Badge */}
            <motion.div variants={textItem} className="flex items-center gap-3">
              <div className="px-3 py-1 border border-[#E5E7EB] rounded-full text-[10px] font-black uppercase tracking-wider text-black bg-[#F9FAFB]">
                New Season 2026
              </div>
              <div className="flex items-center gap-1.5 text-amber-500">
                <Star size={12} className="fill-amber-500" />
                <span className="text-[10px] font-extrabold uppercase tracking-wide text-zinc-500">Premium Quality Assured</span>
              </div>
            </motion.div>

            {/* Giant Luxury Typography Reveal */}
            <motion.h1 
              variants={textItem}
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#09090B] leading-[1.05] tracking-tight"
            >
              Redefining the <br />
              <span className="italic text-zinc-450 font-normal">Modern Luxury</span> <br />
              Shopping Experience.
            </motion.h1>

            {/* Sub-headline text */}
            <motion.p 
              variants={textItem}
              className="text-sm sm:text-base text-zinc-500 max-w-lg leading-relaxed"
            >
              Curated for the discerning eye. Discover an exclusive ecosystem of high-fashion attire, state-of-the-art tech items, and bespoke lifestyle statements.
            </motion.p>

            {/* Magnetic CTA Buttons */}
            <motion.div variants={textItem} className="flex flex-wrap items-center gap-4 pt-4">
              <motion.div
                style={{ x: springBtn1X, y: springBtn1Y }}
                onMouseMove={handleBtn1Move}
                onMouseLeave={handleBtn1Leave}
                className="relative"
              >
                <Link 
                  to="/shop" 
                  className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white hover:bg-black/90 text-xs font-black uppercase tracking-wider transition-colors shadow-sm"
                >
                  Explore Showcase <ArrowRight size={14} />
                </Link>
              </motion.div>

              <motion.div
                style={{ x: springBtn2X, y: springBtn2Y }}
                onMouseMove={handleBtn2Move}
                onMouseLeave={handleBtn2Leave}
                className="relative"
              >
                <Link 
                  to="/collections" 
                  className="inline-flex items-center gap-2 px-8 py-4 border border-[#E5E7EB] hover:border-black text-[#09090B] bg-white text-xs font-black uppercase tracking-wider transition-colors"
                >
                  Explore Lookbook
                </Link>
              </motion.div>
            </motion.div>

            {/* Floating Trust Statistics */}
            <motion.div 
              variants={textItem}
              className="grid grid-cols-3 gap-6 pt-10 border-t border-[#E5E7EB] max-w-md"
            >
              <div>
                <span className="block text-2xl font-black text-black">4.9★</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">12k+ Reviews</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-black">99.9%</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Delivery Rate</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-black">24h</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Nepal Support</span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right Product Column (3D Interactive Tilt Card) */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <motion.div
              style={{
                rotateX: springRotateX,
                rotateY: springRotateY,
                transformStyle: 'preserve-3d',
                perspective: 1000
              }}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative w-full max-w-[360px] aspect-[4/5] bg-white border border-[#E5E7EB] rounded-[32px] p-6 shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing group"
            >
              {/* Material Reflection Gloss Sheen Overlay */}
              <motion.div
                className="absolute inset-0 pointer-events-none z-30"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)',
                  width: '200%',
                  height: '200%',
                  x: sheenX,
                  y: sheenY
                }}
              />

              {/* Card Image Container */}
              <div 
                style={{ transform: 'translateZ(40px)' }}
                className="relative w-full h-[75%] rounded-[24px] overflow-hidden bg-[#F9FAFB] border border-[#E5E7EB]"
              >
                <img 
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=80" 
                  alt="Luxury Fashion Presentation" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Floating micro-badges */}
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                style={{ transform: 'translateZ(60px)' }}
                className="absolute bottom-[28%] left-[-16px] bg-black text-white p-3.5 flex items-center gap-3 shadow-lg"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                  <Star size={14} />
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-wider text-white/60">Featured Product</span>
                  <span className="text-xs font-black">Silk Luxury Edition</span>
                </div>
              </motion.div>

              {/* Card Title Block */}
              <div 
                style={{ transform: 'translateZ(30px)' }}
                className="mt-6 flex justify-between items-center"
              >
                <div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }} className="text-xl font-bold text-black">Silk Minimalist Gown</h3>
                  <span className="text-xs text-zinc-400">Accessories Collection</span>
                </div>
                <span className="text-sm font-extrabold text-black">$349.00</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
      
      {/* Animated Scrolling Wheel Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-20">
        <span className="text-[8px] uppercase font-black tracking-widest text-zinc-400">Scroll Down</span>
        <div className="w-5 h-8 border-2 border-zinc-200 rounded-full flex justify-center p-1">
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-1 h-2 bg-black rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
