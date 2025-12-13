import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

interface MobileFABProps {
    onClick: () => void;
    label?: string;
}

/**
 * MobileFAB - Floating Action Button for mobile quick actions
 * 
 * Position: Bottom-right, above nav bar
 * Follows material design guidelines for FAB
 */
export const MobileFAB: React.FC<MobileFABProps> = ({
    onClick,
    label = 'Add task'
}) => {
    return (
        <motion.button
            onClick={onClick}
            className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
            style={{
                background: 'linear-gradient(135deg, var(--accent), #3b82f6)',
                boxShadow: '0 8px 32px rgba(34, 211, 238, 0.35)'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
                delay: 0.3
            }}
            aria-label={label}
        >
            <Plus size={28} className="text-white" strokeWidth={2.5} />

            {/* Pulse animation */}
            <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: 'linear-gradient(135deg, var(--accent), #3b82f6)' }}
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{
                    scale: [1, 1.4, 1.4],
                    opacity: [0.5, 0, 0]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeOut'
                }}
            />
        </motion.button>
    );
};

MobileFAB.displayName = 'MobileFAB';
