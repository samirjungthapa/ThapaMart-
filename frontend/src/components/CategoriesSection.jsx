import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  { id: 'fashion', name: 'Fashion & Apparel', bgImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80' },
  { id: 'electronics', name: 'Electronics', bgImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80' },
  { id: 'beauty', name: 'Beauty & Wellness', bgImage: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&auto=format&fit=crop&q=80' },
  { id: 'home-living', name: 'Home & Living', bgImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop&q=80' }
];

const CategoriesSection = () => {
  return (
    <section style={{ padding: '6rem 0', background: '#FFFFFF', overflow: 'hidden' }}>
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 900, color: '#09090B', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Curated Collections</h2>
            <p style={{ color: '#52525B', fontSize: '0.875rem' }}>Explore our handpicked premium categories.</p>
          </div>
          <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#09090B', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', textDecoration: 'none', borderBottom: '1px solid #09090B', paddingBottom: '0.25rem' }}>
            View All <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat, i) => (
            <Link key={cat.id} to={`/shop?category=${cat.id}`} style={{ position: 'relative', height: i === 0 || i === 3 ? '400px' : '300px', overflow: 'hidden', display: 'block', textDecoration: 'none' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${cat.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.7s ease' }} 
                   onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} 
                   onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                
                {/* Subtle dark gradient just at the bottom so text is readable */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
                
                <div style={{ position: 'absolute', bottom: '2rem', left: '2rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>{cat.name}</h3>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Shop Now <ArrowUpRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </motion.div>
    </section>
  );
};
export default CategoriesSection;
