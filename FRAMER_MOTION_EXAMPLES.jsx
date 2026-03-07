import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  useButtonAnimation,
  useContainerAnimation,
  useCardAnimation,
  useLoadingAnimation,
  useNotificationAnimation,
  useAccordionAnimation,
} from "../CustomHooks/useFramerAnimations";

/**
 * FRAMER MOTION - COPY-PASTE EXAMPLES
 * Ready-to-use components with beautiful animations
 */

// ============================================
// EXAMPLE 1: Animated Button with Hover
// ============================================
export function AnimatedButton({ children = "Click Me", onClick = () => {} }) {
  const buttonVariants = useButtonAnimation();

  return (
    <motion.button
      whileHover="hover"
      whileTap="tap"
      variants={buttonVariants}
      onClick={onClick}
      style={{
        padding: "0.75rem 1.5rem",
        background: "#0066cc",
        color: "white",
        border: "none",
        borderRadius: "0.5rem",
        fontSize: "1rem",
        cursor: "pointer",
      }}
    >
      {children}
    </motion.button>
  );
}

// ============================================
// EXAMPLE 2: Staggered List Animation
// ============================================
export function StaggeredList({ items = [] }) {
  const { containerVariants, itemVariants } = useContainerAnimation();

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {items.map((item, i) => (
        <motion.div
          key={i}
          variants={itemVariants}
          style={{
            padding: "1rem",
            margin: "0.5rem 0",
            background: "#f5f5f5",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
          whileHover={{ x: 10, background: "#e0e0e0" }}
        >
          {typeof item === "string" ? item : item.name}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ============================================
// EXAMPLE 3: Animated Cards Grid
// ============================================
export function AnimatedCardGrid({ cards = [] }) {
  const cardVariants = useCardAnimation();

  return (
    <motion.div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))",
        gap: "2rem",
        padding: "2rem",
      }}
    >
      {cards.map((card, i) => (
        <motion.div
          key={i}
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          style={{
            padding: "1.5rem",
            background: "white",
            borderRadius: "1rem",
            boxShadow: "0 0.2rem 1rem rgba(0,0,0,0.1)",
            cursor: "pointer",
          }}
        >
          <h3>{card.title}</h3>
          <p>{card.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ============================================
// EXAMPLE 4: Loading Spinner
// ============================================
export function LoadingSpinner() {
  const { spinnerVariants } = useLoadingAnimation();

  return (
    <motion.div
      variants={spinnerVariants}
      animate="rotate"
      style={{
        width: "3rem",
        height: "3rem",
        border: "4px solid #f3f3f3",
        borderTop: "4px solid #0066cc",
        borderRadius: "50%",
        margin: "2rem auto",
      }}
    />
  );
}

// ============================================
// EXAMPLE 5: Toast Notification
// ============================================
export function ToastNotification({ message, type = "success", isVisible }) {
  const notificationVariants = useNotificationAnimation();

  const bgColor = {
    success: "#4caf50",
    error: "#f44336",
    warning: "#ff9800",
    info: "#2196f3",
  }[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={notificationVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{
            position: "fixed",
            top: "2rem",
            right: "2rem",
            background: bgColor,
            color: "white",
            padding: "1rem 2rem",
            borderRadius: "0.5rem",
            zIndex: 9999,
            fontSize: "1rem",
            fontWeight: "500",
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================
// EXAMPLE 6: Accordion/Collapsible Panel
// ============================================
export function AccordionPanel({
  title = "Section",
  children,
  defaultOpen = false,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const accordionVariants = useAccordionAnimation();

  return (
    <div
      style={{
        marginBottom: "1rem",
        border: "1px solid #ddd",
        borderRadius: "0.5rem",
      }}
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "1rem",
          background: "#f5f5f5",
          border: "none",
          textAlign: "left",
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        whileHover={{ background: "#e8e8e8" }}
      >
        {title}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ▼
        </motion.span>
      </motion.button>

      <motion.div
        variants={accordionVariants}
        initial="collapsed"
        animate={isOpen ? "expanded" : "collapsed"}
        style={{ overflow: "hidden" }}
      >
        <div style={{ padding: "1rem", borderTop: "1px solid #eee" }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// EXAMPLE 7: Tab Navigation
// ============================================
export function TabNavigation({ tabs = [] }) {
  const [activeTab, setActiveTab] = useState(0);

  const tabVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const contentVariants = {
    initial: { opacity: 0, x: 10 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -10, transition: { duration: 0.2 } },
  };

  return (
    <div>
      <div style={{ display: "flex", borderBottom: "2px solid #ddd" }}>
        {tabs.map((tab, i) => (
          <motion.button
            key={i}
            onClick={() => setActiveTab(i)}
            variants={tabVariants}
            initial="initial"
            animate="animate"
            style={{
              padding: "1rem 2rem",
              background: activeTab === i ? "#0066cc" : "transparent",
              color: activeTab === i ? "white" : "#333",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem",
              position: "relative",
            }}
          >
            {tab.label}
            {activeTab === i && (
              <motion.div
                layoutId="tab-indicator"
                style={{
                  position: "absolute",
                  bottom: "-2px",
                  left: 0,
                  right: 0,
                  height: "2px",
                  background: "#0066cc",
                }}
              />
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={contentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ padding: "2rem" }}
        >
          {tabs[activeTab].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ============================================
// EXAMPLE 8: Modal with Backdrop Click
// ============================================
export function ModalWithAnimation({
  isOpen,
  onClose,
  title = "Modal",
  children,
}) {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.75, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 260, damping: 20 },
    },
    exit: { opacity: 0, scale: 0.75, y: 50, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            }}
          />
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              x: "-50%",
              y: "-50%",
              background: "white",
              padding: "2rem",
              borderRadius: "1rem",
              minWidth: "25rem",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
              zIndex: 1001,
              boxShadow: "0 1rem 3rem rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h2>{title}</h2>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                }}
              >
                ✕
              </motion.button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================
// EXAMPLE 9: Animated Form
// ============================================
export function AnimatedForm({ fields = [], onSubmit = () => {} }) {
  const { containerVariants, itemVariants } = useContainerAnimation();

  return (
    <motion.form
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onSubmit={onSubmit}
      style={{ maxWidth: "30rem" }}
    >
      {fields.map((field, i) => (
        <motion.div
          key={i}
          variants={itemVariants}
          style={{ marginBottom: "1.5rem" }}
        >
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
            }}
          >
            {field.label}
          </label>
          <motion.input
            type={field.type || "text"}
            placeholder={field.placeholder}
            whileFocus={{
              scale: 1.02,
              boxShadow: "0 0 1.2rem rgba(0, 102, 204, 0.3)",
            }}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ccc",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              boxSizing: "border-box",
            }}
          />
        </motion.div>
      ))}
      <motion.button
        type="submit"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: "100%",
          padding: "0.75rem",
          background: "#0066cc",
          color: "white",
          border: "none",
          borderRadius: "0.5rem",
          fontSize: "1rem",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Submit
      </motion.button>
    </motion.form>
  );
}

// ============================================
// EXAMPLE 10: Floating Action Button (FAB)
// ============================================
export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  const fabVariants = {
    closed: {
      rotate: 0,
      scale: 1,
    },
    open: {
      rotate: 45,
      scale: 1.1,
    },
  };

  const menuVariants = {
    closed: { opacity: 0, scale: 0 },
    open: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.05,
      },
    }),
  };

  const actions = [
    { label: "Add", icon: "➕" },
    { label: "Edit", icon: "✏️" },
    { label: "Delete", icon: "🗑️" },
  ];

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
            }}
          />
        )}
      </AnimatePresence>

      {/* Menu Items */}
      <AnimatePresence>
        {isOpen &&
          actions.map((action, i) => (
            <motion.button
              key={i}
              custom={i}
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              style={{
                position: "fixed",
                bottom: `${2 + (i + 1) * 4}rem`,
                right: "2rem",
                width: "3rem",
                height: "3rem",
                borderRadius: "50%",
                background: "#666",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "1.5rem",
                zIndex: 999,
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {action.icon}
            </motion.button>
          ))}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        variants={fabVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          width: "3.5rem",
          height: "3.5rem",
          borderRadius: "50%",
          background: "#0066cc",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "2rem",
          zIndex: 1000,
          boxShadow: "0 0.5rem 1.5rem rgba(0, 102, 204, 0.4)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        +
      </motion.button>
    </div>
  );
}

// ============================================
// EXAMPLE 11: Page Transition
// ============================================
export function PageWithAnimation({ title, children }) {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <h1>{title}</h1>
      {children}
    </motion.div>
  );
}

// ============================================
// EXAMPLE 12: Hover Reveal Animation
// ============================================
export function HoverReveal({ preview, revealed }) {
  const [isHovered, setIsHovered] = useState(false);

  const revealVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: "1.5rem",
        background: "#f5f5f5",
        borderRadius: "0.5rem",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
      whileHover={{ background: "#efefef" }}
    >
      <motion.div layout>{preview}</motion.div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            variants={revealVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{ marginTop: "1rem" }}
          >
            {revealed}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
