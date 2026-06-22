import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowUpRight } from 'lucide-react';

const collectionsData = [
  { id: 'fashion', title: 'The Summer Edit', desc: 'Lightweight essentials and premium silk pieces.', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80' },
  { id: 'electronics', title: 'Studio Setup', desc: 'High-fidelity audio and minimalist workspace tech.', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80' },
  { id: 'home-living', title: 'Modern Living', desc: 'Curated ceramics and brutalist decor.', img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80' },
  { id: 'beauty', title: 'Apothecary', desc: 'Organic serums and signature fragrances.', img: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80' }
];

const Collections = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/collections');
    }
  }, [userInfo, navigate]);
  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', padding: '6rem 0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '6rem' }}
        >
          <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#71717A', marginBottom: '1rem', display: 'block' }}>
            Lookbooks
          </span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '4rem', fontWeight: 900, color: '#09090B', letterSpacing: '-0.02em', marginBottom: '1.5rem', lineHeight: 1.1 }}>
            Curated Collections.
          </h1>
          <div style={{ width: '3rem', height: '1px', background: '#09090B', margin: '0 auto' }} />
        </motion.div>

        {/* Collections Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem' }}>
          {collectionsData.map((col, idx) => (
            <motion.div 
              key={col.id} 
              initial={{ opacity: 0, y: 40 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, margin: "-100px" }} 
              transition={{ duration: 0.8 }}
              className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${idx % 2 !== 0 ? 'md:grid-flow-col-dense' : ''}`}
            >
              <div style={{ order: idx % 2 !== 0 ? 2 : 1 }}>
                <Link to={`/shop?category=${col.id}`} style={{ display: 'block', aspectRatio: '4/5', overflow: 'hidden', background: '#F9FAFB' }}>
                  <motion.img 
                    whileHover={{ scale: 1.05 }} transition={{ duration: 0.7 }}
                    src={col.img} alt={col.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </Link>
              </div>
              
              <div style={{ order: idx % 2 !== 0 ? 1 : 2, padding: idx % 2 !== 0 ? '0 4rem 0 0' : '0 0 0 4rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#71717A', display: 'block', marginBottom: '1rem' }}>Edition 0{idx + 1}</span>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', fontWeight: 900, color: '#09090B', marginBottom: '1rem', lineHeight: 1.1 }}>{col.title}</h2>
                <p style={{ fontSize: '1rem', color: '#52525B', lineHeight: 1.6, marginBottom: '2.5rem' }}>{col.desc}</p>
                <Link to={`/shop?category=${col.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#09090B', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', textDecoration: 'none', borderBottom: '1px solid #09090B', paddingBottom: '0.25rem' }}>
                  Shop Collection <ArrowUpRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Collections;
