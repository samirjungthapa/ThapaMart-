import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <section style={{ padding: '6rem 0', background: '#FFFFFF', overflow: 'hidden' }}>
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 900, color: '#09090B', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Join The Inner Circle
          </h2>
          <p style={{ color: '#52525B', fontSize: '0.875rem', marginBottom: '3rem', maxWidth: '80%', margin: '0 auto 3rem' }}>
            Subscribe to receive exclusive access to early product launches, private sales, and curated editorial content.
          </p>

          <form onSubmit={handleSubmit} style={{ position: 'relative', display: 'flex', maxWidth: '28rem', margin: '0 auto' }}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
              style={{ width: '100%', background: '#F9FAFB', border: '1px solid #E5E7EB', padding: '1rem 1rem 1rem 1.5rem', fontSize: '0.875rem', color: '#09090B', outline: 'none' }}
              onFocus={e => e.currentTarget.style.borderColor = '#09090B'}
              onBlur={e => e.currentTarget.style.borderColor = '#E5E7EB'}
            />
            <button 
              type="submit" 
              style={{ background: '#000000', color: '#FFFFFF', padding: '0 2rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', cursor: 'pointer', transition: 'background 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#27272A'}
              onMouseLeave={e => e.currentTarget.style.background = '#000000'}
            >
              Subscribe
            </button>
          </form>

          {subscribed && (
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ color: '#09090B', fontSize: '0.75rem', fontWeight: 700, marginTop: '1.5rem' }}>
              Welcome to the Inner Circle.
            </motion.p>
          )}
        </div>

      </motion.div>
    </section>
  );
};

export default Newsletter;
