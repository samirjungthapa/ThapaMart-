import React from 'react';
import { Link } from 'react-router-dom';
import ThapaMartLogo from './ThapaMartLogo.jsx';

const Footer = () => {
  return (
    <footer style={{ background: '#F9FAFB', borderTop: '1px solid #E5E7EB', paddingTop: '4rem', paddingBottom: '2rem' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <div style={{ marginBottom: '1.5rem' }}>
              <ThapaMartLogo size="md" variant="wordmark" />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#52525B', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Redefining luxury e-commerce in Nepal. We curate the finest apparel, electronics, and lifestyle products for the discerning individual.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#09090B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>Shop</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link to="/shop?category=fashion" style={{ fontSize: '0.8rem', color: '#71717A', textDecoration: 'none' }} onMouseEnter={e=>e.currentTarget.style.color='#09090B'} onMouseLeave={e=>e.currentTarget.style.color='#71717A'}>Fashion & Apparel</Link></li>
              <li><Link to="/shop?category=electronics" style={{ fontSize: '0.8rem', color: '#71717A', textDecoration: 'none' }} onMouseEnter={e=>e.currentTarget.style.color='#09090B'} onMouseLeave={e=>e.currentTarget.style.color='#71717A'}>Premium Electronics</Link></li>
              <li><Link to="/shop?category=home-living" style={{ fontSize: '0.8rem', color: '#71717A', textDecoration: 'none' }} onMouseEnter={e=>e.currentTarget.style.color='#09090B'} onMouseLeave={e=>e.currentTarget.style.color='#71717A'}>Home & Living</Link></li>
              <li><Link to="/shop?category=beauty" style={{ fontSize: '0.8rem', color: '#71717A', textDecoration: 'none' }} onMouseEnter={e=>e.currentTarget.style.color='#09090B'} onMouseLeave={e=>e.currentTarget.style.color='#71717A'}>Beauty & Wellness</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#09090B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>Client Care</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link to="/contact" style={{ fontSize: '0.8rem', color: '#71717A', textDecoration: 'none' }} onMouseEnter={e=>e.currentTarget.style.color='#09090B'} onMouseLeave={e=>e.currentTarget.style.color='#71717A'}>Contact Us</Link></li>
              <li><Link to="/shipping" style={{ fontSize: '0.8rem', color: '#71717A', textDecoration: 'none' }} onMouseEnter={e=>e.currentTarget.style.color='#09090B'} onMouseLeave={e=>e.currentTarget.style.color='#71717A'}>Shipping Policy</Link></li>
              <li><Link to="/returns" style={{ fontSize: '0.8rem', color: '#71717A', textDecoration: 'none' }} onMouseEnter={e=>e.currentTarget.style.color='#09090B'} onMouseLeave={e=>e.currentTarget.style.color='#71717A'}>Returns & Exchanges</Link></li>
              <li><Link to="/faq" style={{ fontSize: '0.8rem', color: '#71717A', textDecoration: 'none' }} onMouseEnter={e=>e.currentTarget.style.color='#09090B'} onMouseLeave={e=>e.currentTarget.style.color='#71717A'}>FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#09090B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link to="/privacy" style={{ fontSize: '0.8rem', color: '#71717A', textDecoration: 'none' }} onMouseEnter={e=>e.currentTarget.style.color='#09090B'} onMouseLeave={e=>e.currentTarget.style.color='#71717A'}>Privacy Policy</Link></li>
              <li><Link to="/terms" style={{ fontSize: '0.8rem', color: '#71717A', textDecoration: 'none' }} onMouseEnter={e=>e.currentTarget.style.color='#09090B'} onMouseLeave={e=>e.currentTarget.style.color='#71717A'}>Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem', display: 'flex', flexDirection: 'column', md: { flexDirection: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#71717A' }}>
            &copy; {new Date().getFullYear()} ThapaMart. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Instagram', 'Facebook', 'Twitter'].map(social => (
              <a key={social} href="#" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#09090B', textDecoration: 'none' }}>
                {social}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
