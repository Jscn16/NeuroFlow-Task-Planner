import { Variants } from 'framer-motion';

// Spring physics for natural motion
export const springConfig = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
    mass: 0.8,
};

// Smooth easing curves
export const smoothEase = [0.16, 1, 0.3, 1];
export const gentleEase = [0.4, 0, 0.2, 1];

// Task card animations
export const taskCardVariants: Variants = {
    initial: {
        opacity: 0,
        scale: 0.95,
        y: 8,
    },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            ...springConfig,
            duration: 0.3,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: -8,
        transition: {
            duration: 0.2,
            ease: smoothEase,
        },
    },
    hover: {
        scale: 1.02,
        y: -2,
        transition: {
            duration: 0.2,
            ease: smoothEase,
        },
    },
};

// Completion animation
export const completionVariants: Variants = {
    initial: {
        scale: 0.8,
        opacity: 0,
    },
    animate: {
        scale: [0.8, 1.1, 1],
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: smoothEase,
        },
    },
};

// Stagger animation for lists
export const staggerContainer: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        },
    },
};

// Drag and drop animations
export const dragVariants: Variants = {
    drag: {
        scale: 1.05,
        rotate: 2,
        transition: {
            duration: 0.2,
        },
    },
    dragEnd: {
        scale: 1,
        rotate: 0,
        transition: springConfig,
    },
};

// Modal animations
export const modalVariants: Variants = {
    initial: {
        opacity: 0,
        scale: 0.95,
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.2,
            ease: smoothEase,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: 0.15,
            ease: smoothEase,
        },
    },
};

// Week navigation slide
export const slideVariants: Variants = {
    initial: (direction: number) => ({
        x: direction > 0 ? 100 : -100,
        opacity: 0,
    }),
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.3,
            ease: smoothEase,
        },
    },
    exit: (direction: number) => ({
        x: direction > 0 ? -100 : 100,
        opacity: 0,
        transition: {
            duration: 0.2,
            ease: smoothEase,
        },
    }),
};

// Fade in animation
export const fadeInVariants: Variants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.2,
            ease: smoothEase,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.15,
        },
    },
};

