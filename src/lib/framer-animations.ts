import { Variants } from "framer-motion";

// Fade in animation (bottom to top)
export const fadeInUp: Variants = {
  initial: {
    y: 20,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.33, 1, 0.68, 1], // Custom cubic-bezier for Apple-like ease
    },
  },
};

// Fade in animation (left to right)
export const fadeInLeft: Variants = {
  initial: {
    x: -20,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.33, 1, 0.68, 1],
    },
  },
};

// Fade in animation (with scale)
export const fadeInScale: Variants = {
  initial: {
    scale: 0.96,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.33, 1, 0.68, 1],
    },
  },
};

// Staggered children animation
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Card hover animation
export const cardHover: Variants = {
  initial: {
    y: 0,
  },
  hover: {
    y: -8,
    transition: {
      duration: 0.3,
      ease: [0.33, 1, 0.68, 1],
    },
  },
};

// Image zoom on hover
export const imageZoom: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.4,
      ease: [0.33, 1, 0.68, 1],
    },
  },
};

// Button hover effect
export const buttonHover: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.03,
    transition: {
      duration: 0.2,
      ease: [0.33, 1, 0.68, 1],
    },
  },
  tap: {
    scale: 0.97,
  },
};

// Page transition
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.33, 1, 0.68, 1],
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.33, 1, 0.68, 1],
    },
  },
};

export const modalVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95, transition: { duration: 0.3 } },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } },
};
