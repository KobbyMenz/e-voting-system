import PropTypes from "prop-types";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

/**
 * AnimatedModal Component
 * A reusable modal wrapper with beautiful Framer Motion animations
 *
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback when modal should close
 * @param {ReactNode} children - Modal content
 * @param {string} className - Additional CSS classes
 * @param {string} animationType - Type of animation: 'spring', 'smooth', 'bounce', 'zoom'
 */
const AnimatedModal = ({
  isOpen,
  onClose,
  children,
  className = "",
  animationType = "spring",
  backdropClassName = "",
}) => {
  // Animation variants for different styles
  const animationVariants = {
    spring: {
      backdrop: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3 },
      },

      modal: {
        initial: {
          opacity: 0,
          scale: 0.75,
          y: 50,
        },

        animate: {
          opacity: 1,
          scale: 1,
          y: 0,
        },

        exit: {
          opacity: 0,
          scale: 0.75,
          y: 50,
        },

        transition: {
          type: "spring",
          stiffness: 260,
          damping: 20,
        },
      },
    },
    smooth: {
      backdrop: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.4, ease: "easeInOut" },
      },
      modal: {
        initial: {
          opacity: 0,
          y: 100,
        },
        animate: {
          opacity: 1,
          y: 0,
        },
        exit: {
          opacity: 0,
          y: 100,
        },
        transition: { duration: 0.4, ease: "easeOut" },
      },
    },
    bounce: {
      backdrop: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3 },
      },
      modal: {
        initial: {
          opacity: 0,
          scale: 0.5,
          y: 100,
        },
        animate: {
          opacity: 1,
          scale: 1,
          y: 0,
        },
        exit: {
          opacity: 0,
          scale: 0.5,
          y: 100,
        },
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 15,
          mass: 0.5,
        },
      },
    },
    zoom: {
      backdrop: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.25 },
      },
      modal: {
        initial: {
          opacity: 0,
          scale: 0,
          rotate: -10,
        },
        animate: {
          opacity: 1,
          scale: 1,
          rotate: 0,
        },
        exit: {
          opacity: 0,
          scale: 0,
          rotate: -10,
        },
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 25,
        },
      },
    },
  };

  const variant = animationVariants[animationType] || animationVariants.spring;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            {...variant.backdrop}
            className={backdropClassName}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            }}
          />

          {/* Modal */}
          <motion.div
            {...variant.modal}
            className={className}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              x: "-50%",
              y: "-50%",
              zIndex: 1001,
            }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

AnimatedModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  animationType: PropTypes.oneOf(["spring", "smooth", "bounce", "zoom"]),
  backdropClassName: PropTypes.string,
  modalClassName: PropTypes.string,
};

export default AnimatedModal;
