import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WeekFluxLogo } from '../../brand/WeekFluxLogo';

interface SplashScreenProps {
    isLoggedIn: boolean;
    onComplete: () => void;
}

/**
 * SplashScreen - Animated NeuroFlow branding intro
 * 
 * Shows for 1.8s for new users, 0.6s for returning logged-in users
 */
export const SplashScreen: React.FC<SplashScreenProps> = ({ isLoggedIn, onComplete }) => {
    const [show, setShow] = useState(true);

    // Hide the HTML app loader after a tiny delay to ensure React splash renders first
    useEffect(() => {
        const timer = setTimeout(() => {
            document.body.classList.add('loaded');
        }, 50);
        return () => clearTimeout(timer);
    }, []);

    // Transition timing based on login status
    useEffect(() => {
        const duration = isLoggedIn ? 600 : 1800;
        const timer = setTimeout(() => {
            setShow(false);
        }, duration);
        return () => clearTimeout(timer);
    }, [isLoggedIn]);

    // Call onComplete after exit animation
    useEffect(() => {
        if (!show) {
            const timer = setTimeout(onComplete, 400);
            return () => clearTimeout(timer);
        }
    }, [show, onComplete]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 z-[100] overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                >
                    {/* Animated background gradients */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0ea5e9,transparent_40%)]"
                    />
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,#22d3ee,transparent_35%)]"
                    />

                    <motion.div
                        className="flex flex-col items-center justify-center gap-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    >
                        {/* Logo Icon with Glow */}
                        <WeekFluxLogo size="5xl" showIcon={true} layout="vertical" />
                        <motion.p
                            className="text-white/50 text-sm mt-2 tracking-widest uppercase"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                        >
                            {isLoggedIn ? 'Welcome back' : ''}
                        </motion.p>
                    </motion.div>

                    {/* Loading dots - only for non-logged-in users */}
                    {!isLoggedIn && (
                        <motion.div
                            className="flex gap-1.5 mt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-2 h-2 rounded-full bg-cyan-400/60"
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                                />
                            ))}
                        </motion.div>
                    )}
                </motion.div>
                </motion.div>
    )
}
        </AnimatePresence >
    );
};
