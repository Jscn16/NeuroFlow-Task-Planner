import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FrostOverlayProps {
  isVisible: boolean;
  message?: string;
}

/**
 * FrostOverlay - full screen "freeze" effect for calm resets.
 */
export const FrostOverlay: React.FC<FrostOverlayProps> = ({ isVisible, message = 'Chaos frozen. Fresh start.' }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none"
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, rgba(146, 172, 191, 0.25) 60%, rgba(15, 23, 42, 0.7) 100%)'
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="text-center px-6"
            >
              <div className="text-xl md:text-3xl font-light text-cyan-100 drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]">
                {message}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
