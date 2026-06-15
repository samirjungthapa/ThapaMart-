import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck } from 'lucide-react';

const testimonials = [
  {
    name: 'Samir Thapa',
    location: 'Kathmandu',
    text: 'The sheer quality of the products is unmatched in Nepal. Delivery was prompt and the packaging felt incredibly premium. ThapaMart is now my go-to for luxury essentials.',
    rating: 5,
  },
  {
    name: 'Priya Shrestha',
    location: 'Pokhara',
    text: 'A truly elevated shopping experience. I was looking for authentic high-end electronics and the customer service guided me flawlessly. Highly recommended.',
    rating: 5,
  },
  {
    name: 'Rahul Maharjan',
    location: 'Lalitpur',
    text: 'From the UI to the actual product delivery, everything feels world-class. Finally, an e-commerce platform that understands the luxury segment.',
    rating: 4,
  }
];

const Testimonials = () => {
  return (
    <section style={{ padding: '6rem 0', background: '#F9FAFB', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', overflow: 'hidden' }}>
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 900, color: '#09090B', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Client Testimonials
          </h2>
          <p style={{ color: '#52525B', fontSize: '0.875rem' }}>Hear from our most valued customers across Nepal.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ background: '#FFFFFF', padding: '2rem', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column' }}>
              
              <div style={{ display: 'flex', color: '#D4AF37', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} size={14} style={{ fill: idx < t.rating ? '#D4AF37' : 'transparent' }} />
                ))}
              </div>

              <p style={{ fontSize: '0.875rem', color: '#52525B', lineHeight: 1.8, marginBottom: '2rem', flexGrow: 1, fontStyle: 'italic' }}>
                "{t.text}"
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E5E7EB', paddingTop: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#09090B' }}>{t.name}</h4>
                  <span style={{ fontSize: '0.65rem', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#09090B' }}>
                  <ShieldCheck size={14} />
                  <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', marginTop: '4rem', paddingTop: '4rem', borderTop: '1px solid #E5E7EB' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', fontFamily: "'Cormorant Garamond', serif", fontWeight: 900, color: '#09090B' }}>10k+</p>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#71717A' }}>Satisfied Clients</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', fontFamily: "'Cormorant Garamond', serif", fontWeight: 900, color: '#09090B' }}>100%</p>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#71717A' }}>Authenticity Guarantee</p>
          </div>
        </div>

      </motion.div>
    </section>
  );
};

export default Testimonials;
