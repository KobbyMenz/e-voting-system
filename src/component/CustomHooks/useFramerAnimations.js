import { useState } from "react";

/**
 * Framer Motion Animation Hooks
 * Collection of reusable hooks for common animation patterns
 */

/**
 * Hook for button click animations
 */
export const useButtonAnimation = () => {
  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 0.5rem 1.5rem rgba(0, 0, 0, 0.3)",
    },
    tap: {
      scale: 0.95,
    },
  };

  return buttonVariants;
};

/**
 * Hook for container animations (lists, grids)
 */
export const useContainerAnimation = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return { containerVariants, itemVariants };
};

/**
 * Hook for page transition animations
 */
export const usePageAnimation = () => {
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  return pageVariants;
};

/**
 * Hook for card/element hover animations
 */
export const useCardAnimation = () => {
  const cardVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    hover: {
      y: -5,
      boxShadow: "0 1rem 3rem rgba(0, 0, 0, 0.2)",
      transition: {
        duration: 0.3,
      },
    },
  };

  return cardVariants;
};

/**
 * Hook for input field animations
 */
export const useInputAnimation = () => {
  const [isFocused, setIsFocused] = useState(false);

  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: "0 0 1.2rem rgba(33, 150, 243, 0.3)",
    },
    blur: {
      scale: 1,
      boxShadow: "0 0 0 rgba(33, 150, 243, 0)",
    },
  };

  return {
    isFocused,
    setIsFocused,
    inputVariants,
  };
};

/**
 * Hook for loading spinner animations
 */
export const useLoadingAnimation = () => {
  const spinnerVariants = {
    rotate: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const pulseVariants = {
    pulse: {
      opacity: [1, 0.5, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
  };

  return { spinnerVariants, pulseVariants };
};

/**
 * Hook for notification/toast animations
 */
export const useNotificationAnimation = () => {
  const notificationVariants = {
    initial: {
      opacity: 0,
      x: 400,
      y: 0,
    },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      x: 400,
      transition: {
        duration: 0.3,
      },
    },
  };

  return notificationVariants;
};

/**
 * Hook for accordion/panel animations
 */
export const useAccordionAnimation = () => {
  const accordionVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      overflow: "hidden",
    },
    expanded: {
      height: "auto",
      opacity: 1,
      overflow: "hidden",
      transition: {
        height: {
          duration: 0.3,
        },
        opacity: {
          duration: 0.25,
          delay: 0.05,
        },
      },
    },
  };

  return accordionVariants;
};

/**
 * Hook for modal animations with backdrop
 */
export const useModalAnimation = () => {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.75,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.75,
      y: 50,
      transition: { duration: 0.2 },
    },
  };

  return { backdropVariants, modalVariants };
};

/**
 * Hook for tab/navigation animations
 */
export const useTabAnimation = () => {
  const tabVariants = {
    initial: { opacity: 0, y: -10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const contentVariants = {
    initial: { opacity: 0, x: 10 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      x: -10,
      transition: { duration: 0.2 },
    },
  };

  return { tabVariants, contentVariants };
};

/**
 * Hook for drag animations
 */
export const useDragAnimation = () => {
  const dragConstraints = {
    top: -10,
    left: -10,
    right: 10,
    bottom: 10,
  };

  return { dragConstraints };
};

/**
 * Hook for tooltip/popover animations
 */
export const useTooltipAnimation = () => {
  const tooltipVariants = {
    initial: {
      opacity: 0,
      scale: 0.8,
      y: -10,
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -10,
      transition: { duration: 0.15 },
    },
  };

  return tooltipVariants;
};
