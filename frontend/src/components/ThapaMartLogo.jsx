import React from 'react';
import { motion } from 'framer-motion';

const sizes = {
  sm: { mark: 28, text: '1rem'   },
  md: { mark: 36, text: '1.25rem'},
  lg: { mark: 48, text: '1.75rem'},
  xl: { mark: 64, text: '2.5rem' }
};

const ThapaMartLogo = ({ size = 'md', variant = 'full', animated = true, className = '' }) => {
  const currentSize = sizes[size] || sizes.md;

  const logoMark = (
    <motion.div
      style={{ position: 'relative', width: currentSize.mark, height: currentSize.mark }}
      initial={animated ? { rotate: -10, scale: 0.9 } : false}
      animate={animated ? { rotate: 0, scale: 1 } : false}
      transition={{ type: 'spring', stiffness: 200, damping: 10 }}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        {/* Sleek geometric T mark */}
        <path d="M20 25 H80 V40 H60 V85 H40 V40 H20 V25 Z" fill="#09090B" />
        <path d="M40 40 L60 25 V40 H40 Z" fill="#52525B" />
      </svg>
    </motion.div>
  );

  const wordMark = (
    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: variant === 'full' ? '0.75rem' : 0 }}>
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: currentSize.text, fontWeight: 900, color: '#09090B', letterSpacing: '0.05em', lineHeight: 1 }}>
        THAPAMART
      </span>
      {size !== 'sm' && (
        <span style={{ fontSize: '0.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#71717A', marginTop: '0.2rem' }}>
          Nepal
        </span>
      )}
    </div>
  );

  if (variant === 'mark') return <div className={className}>{logoMark}</div>;
  if (variant === 'wordmark') return <div className={className}>{wordMark}</div>;

  return (
    <div className={`flex items-center ${className}`} style={{ display: 'flex', alignItems: 'center' }}>
      {logoMark}
      {wordMark}
    </div>
  );
};

export default ThapaMartLogo;
