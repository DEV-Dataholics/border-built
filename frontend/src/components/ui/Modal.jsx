import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[80]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className={`fixed inset-x-4 top-1/2 z-[90] max-w-lg mx-auto bg-card-dark border border-border-dark rounded-xl shadow-2xl overflow-hidden ${className}`}
            initial={{ opacity: 0, y: '-40%', scale: 0.95 }}
            animate={{ opacity: 1, y: '-50%', scale: 1 }}
            exit={{ opacity: 0, y: '-40%', scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <h3 className="text-white text-lg font-bold uppercase italic">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            )}

            {/* Content */}
            <div className="p-5">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
