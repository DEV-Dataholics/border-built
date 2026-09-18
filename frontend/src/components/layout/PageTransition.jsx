import React from 'react';
import { motion } from 'framer-motion';

/**
 * Page transition wrapper using Framer Motion
 */
const PageTransition = ({ children, className = '' }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
