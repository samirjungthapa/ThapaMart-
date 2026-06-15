import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

const Hero = () => {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: '#FFFFFF', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
      
      {/* Background Graphic (Minimalist circle) */}
      <div style={{ position: 'absolute', right: '-10%', top: '50%', transform: 'translateY(-50%)', width: '60vw', height: '60vw', background: '#F9FAFB', borderRadius: '50%', zIndex: 0 }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full" style={{ position: 'relative', zIndex: 10 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <div style={{ padding: '0.25rem 0.75rem', border: '1px solid #E5E7EB', borderRadius: '99px', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#09090B' }}>
                New Collection 2026
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#D4AF37' }}>
                <Star size={12} style={{ fill: '#D4AF37' }} />
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#52525B' }}>Premium Quality</span>
              </div>
            </div>

            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '4.5rem', fontWeight: 900, color: '#09090B', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
              Redefining <br/><span style={{ fontStyle: 'italic', color: '#52525B' }}>Modern</span> Luxury.
            </h1>

            <p style={{ fontSize: '1rem', color: '#52525B', lineHeight: 1.6, maxWidth: '80%', marginBottom: '3rem' }}>
              Discover an exclusive curation of high-end fashion, state-of-the-art electronics, and sophisticated living essentials.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', background: '#000000', color: '#FFFFFF', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', textDecoration: 'none', transition: 'background 0.3s' }} onMouseEnter={e=>e.currentTarget.style.background='#27272A'} onMouseLeave={e=>e.currentTarget.style.background='#000000'}>
                Shop Collection <ArrowRight size={16} />
              </Link>
              <Link to="/collections" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', background: 'transparent', border: '1px solid #E5E7EB', color: '#09090B', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', textDecoration: 'none', transition: 'border-color 0.3s' }} onMouseEnter={e=>e.currentTarget.style.borderColor='#09090B'} onMouseLeave={e=>e.currentTarget.style.borderColor='#E5E7EB'}>
                Explore Lookbook
              </Link>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} style={{ position: 'relative' }}>
            <div style={{ position: 'relative', width: '100%', paddingBottom: '120%', overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=80" alt="Luxury Fashion Presentation" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            {/* Minimal floating badge */}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} style={{ position: 'absolute', bottom: '2rem', left: '-2rem', background: '#FFFFFF', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
              <div style={{ width: '3rem', height: '3rem', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={18} style={{ color: '#09090B' }} />
              </div>
              <div>
                <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#52525B', marginBottom: '0.25rem' }}>Featured Edition</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#09090B' }}>Silk Signature Collection</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
export default Hero;
