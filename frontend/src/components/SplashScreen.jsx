import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThapaMartLogo from './ThapaMartLogo.jsx';

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const duration = 1500;
    const interval = 30;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);
      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          onComplete();
          document.body.style.overflow = 'unset';
        }, 500);
      }
    }, interval);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = 'unset';
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
        style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF' }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <ThapaMartLogo size="xl" variant="full" animated={true} />
          
          <div style={{ marginTop: '3rem', width: '12rem' }}>
            <div style={{ width: '100%', height: '1px', background: '#E5E7EB', position: 'relative', overflow: 'hidden' }}>
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: `${progress - 100}%` }}
                transition={{ ease: "linear", duration: 0.1 }}
                style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '100%', background: '#09090B' }}
              />
            </div>
            <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#71717A' }}>
              {Math.round(progress)}%
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
