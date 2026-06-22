import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', padding: '6rem 0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '6rem' }}
        >
          <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#71717A', marginBottom: '1rem', display: 'block' }}>
            Our Heritage
          </span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '4rem', fontWeight: 900, color: '#09090B', letterSpacing: '-0.02em', marginBottom: '1.5rem', lineHeight: 1.1 }}>
            Elevating the Standard <br/> of Living in Nepal.
          </h1>
          <div style={{ width: '3rem', height: '1px', background: '#09090B', margin: '0 auto' }} />
        </motion.div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-16">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div style={{ aspectRatio: '4/5', background: '#F9FAFB', overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&auto=format&fit=crop&q=80" alt="Editorial Fashion" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#09090B', marginBottom: '1.5rem' }}>The Vision</h2>
            <p style={{ fontSize: '1rem', color: '#52525B', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              Founded with an uncompromising commitment to quality, ThapaMart bridges the gap between global luxury and the discerning Nepalese consumer. We meticulously curate every piece in our collection, ensuring it meets our rigorous standards for craftsmanship, design, and durability.
            </p>
            <p style={{ fontSize: '1rem', color: '#52525B', lineHeight: 1.8, marginBottom: '2rem' }}>
              Whether it is high-end electronics that redefine your daily workflow or premium fashion essentials that articulate your personal brand, our mission is to provide an unparalleled retail experience.
            </p>
            <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#09090B', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', textDecoration: 'none', borderBottom: '1px solid #09090B', paddingBottom: '0.25rem' }}>
              Explore the Collection <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        {/* Values Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', padding: '5rem 3rem', textAlign: 'center', marginTop: '8rem' }}
        >
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 900, color: '#09090B', marginBottom: '3rem' }}>Our Core Pillars</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Authenticity', text: 'We source directly from premium global houses to guarantee absolute authenticity.' },
              { title: 'Curation', text: 'Quality over quantity. Every item is hand-selected by our editorial team.' },
              { title: 'Service', text: 'White-glove delivery and unparalleled client support across the Kathmandu valley.' }
            ].map((value, index) => (
              <div key={index} style={{ borderTop: '1px solid #09090B', paddingTop: '1.5rem', textAlign: 'left' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#09090B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>{value.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#52525B', lineHeight: 1.6 }}>{value.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default About;
