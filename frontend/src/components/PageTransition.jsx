import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 12,
      scale: 0.985,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 85,
        damping: 15,
        mass: 0.8,
        staggerChildren: 0.08,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.99,
      transition: {
        duration: 0.25,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="w-full h-full flex flex-col"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
