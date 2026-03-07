# 🎬 Framer Motion Animations Guide

Your e-voting system now has beautiful Framer Motion animations! This guide shows you how to use them.

## Installation ✅

Framer Motion is already installed. Just import and use!

```bash
npm install framer-motion  # Already done ✓
```

## Quick Start

### 1. Basic Motion Component

```jsx
import { motion } from "framer-motion";

export default function MyComponent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      This fades in smoothly!
    </motion.div>
  );
}
```

### 2. Animated Modal (Your Updated AddElectionModal)

The `AddElectionModal` now has beautiful spring animations:

- ✨ Backdrop fades in
- ✨ Modal scales up with spring bounce
- ✨ Smooth exit animation

### 3. Using AnimatedModal Component

For other modals in your project, use the reusable `AnimatedModal`:

```jsx
import { useState } from "react";
import AnimatedModal from "../Layout/AnimatedModal";

export default function MyFeature() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>

      <AnimatedModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        animationType="spring" // or "smooth", "bounce", "zoom"
        className={classes.modal}
      >
        <div>Modal Content</div>
      </AnimatedModal>
    </>
  );
}
```

## Animation Types

### Spring Animation (Default)

```jsx
<motion.div
  initial={{ opacity: 0, scale: 0.75 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{
    type: "spring",
    stiffness: 260,
    damping: 20,
  }}
>
  Bouncy spring effect!
</motion.div>
```

### Smooth Animation

```jsx
<motion.div
  initial={{ opacity: 0, y: 100 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
>
  Smooth easing
</motion.div>
```

### Bounce Animation

```jsx
<motion.div
  initial={{ scale: 0.5 }}
  animate={{ scale: 1 }}
  transition={{
    type: "spring",
    stiffness: 300,
    damping: 15,
    mass: 0.5,
  }}
>
  Bouncy effect!
</motion.div>
```

### Zoom Animation

```jsx
<motion.div
  initial={{ opacity: 0, scale: 0, rotate: -10 }}
  animate={{ opacity: 1, scale: 1, rotate: 0 }}
  transition={{
    type: "spring",
    stiffness: 400,
    damping: 25,
  }}
>
  Zoom in rotating
</motion.div>
```

## Using Hooks

Import hooks from `useFramerAnimations.js`:

### Button Animation Hook

```jsx
import { useButtonAnimation } from "../CustomHooks/useFramerAnimations";
import { motion } from "framer-motion";

export default function MyButton() {
  const buttonVariants = useButtonAnimation();

  return (
    <motion.button whileHover="hover" whileTap="tap" variants={buttonVariants}>
      Click Me
    </motion.button>
  );
}
```

### Container/List Animation

```jsx
import { useContainerAnimation } from "../CustomHooks/useFramerAnimations";
import { motion } from "framer-motion";

export default function ItemList({ items }) {
  const { containerVariants, itemVariants } = useContainerAnimation();

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {items.map((item, i) => (
        <motion.div key={i} variants={itemVariants}>
          {item.name}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

### Card Animation

```jsx
import { useCardAnimation } from "../CustomHooks/useFramerAnimations";
import { motion } from "framer-motion";

export default function Card({ data }) {
  const cardVariants = useCardAnimation();

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      {data}
    </motion.div>
  );
}
```

### Loading Spinner

```jsx
import { useLoadingAnimation } from "../CustomHooks/useFramerAnimations";
import { motion } from "framer-motion";

export default function LoadingSpinner() {
  const { spinnerVariants } = useLoadingAnimation();

  return (
    <motion.div
      variants={spinnerVariants}
      animate="rotate"
      style={{
        width: "2rem",
        height: "2rem",
        border: "3px solid #0066cc",
        borderTop: "3px solid transparent",
        borderRadius: "50%",
      }}
    />
  );
}
```

### Notification Animation

```jsx
import { useNotificationAnimation } from "../CustomHooks/useFramerAnimations";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ message, isVisible, onClose }) {
  const notificationVariants = useNotificationAnimation();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={notificationVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onAnimationComplete={() => {
            setTimeout(onClose, 3000);
          }}
          style={{
            position: "fixed",
            top: "2rem",
            right: "2rem",
            background: "#4caf50",
            color: "white",
            padding: "1rem 2rem",
            borderRadius: "0.5rem",
            zIndex: 9999,
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

## Common Patterns

### Pattern 1: Hover Effects

```jsx
<motion.div
  whileHover={{ scale: 1.05, y: -5 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 300 }}
>
  Hover me!
</motion.div>
```

### Pattern 2: Staggered List

```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 0.1s delay between items
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export default function List({ items }) {
  return (
    <motion.ul variants={containerVariants} initial="hidden" animate="visible">
      {items.map((item, i) => (
        <motion.li key={i} variants={itemVariants}>
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

### Pattern 3: Page Transitions

```jsx
import { motion } from "framer-motion";

export default function Page() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      Page Content
    </motion.div>
  );
}
```

### Pattern 4: Conditional Rendering with AnimatePresence

```jsx
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function ToggleBox() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <button onClick={() => setIsVisible(!isVisible)}>Toggle</button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            Hidden content appears here!
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

### Pattern 5: Drag Animation

```jsx
import { motion } from "framer-motion";

export default function DraggableBox() {
  return (
    <motion.div
      drag
      dragConstraints={{
        top: -10,
        left: -10,
        right: 10,
        bottom: 10,
      }}
      whileDrag={{ scale: 1.1 }}
      style={{
        width: "100px",
        height: "100px",
        background: "#0066cc",
        borderRadius: "0.5rem",
        cursor: "grab",
      }}
    />
  );
}
```

## Transition Options

### Duration

```jsx
transition={{ duration: 0.5 }}  // seconds
```

### Easing

```jsx
transition={{ ease: "easeInOut" }}
// Options: "easeIn", "easeOut", "easeInOut", "linear", "circIn", "circOut", "backIn", "backOut"
```

### Type

```jsx
// Spring (bouncy)
transition={{ type: "spring", stiffness: 260, damping: 20 }}

// Tween (linear interpolation)
transition={{ type: "tween", duration: 0.5 }}

// Inertia (momentum based)
transition={{ type: "inertia", velocity: 100 }}
```

### Spring Physics

- `stiffness` - Higher = more bouncy (default: 100)
- `damping` - Higher = less bouncy (default: 10)
- `mass` - Higher = heavier feel (default: 1)
- `velocity` - Initial velocity

```jsx
transition={{
  type: "spring",
  stiffness: 260,    // Very bouncy
  damping: 20,       // Some resistance
  mass: 1,           // Normal weight
}}
```

## Variants

Define animations once, reuse everywhere:

```jsx
const screenVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function Screen({ items }) {
  return (
    <motion.div variants={screenVariants} initial="hidden" animate="visible">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item, i) => (
          <motion.div key={i} variants={itemVariants}>
            {item}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
```

## AnimatePresence

Use for animations when components mount/unmount:

```jsx
import { AnimatePresence } from "framer-motion";

export default function App({ visibleItems }) {
  return (
    <AnimatePresence>
      {visibleItems.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {item.name}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
```

## Your Current Implementations

### 1. AddElectionModal

✅ Uses spring animation with:

- Backdrop fade-in
- Modal scale + translate entrance
- Spring bounce effect on open
- Smooth exit animation

### 2. AnimatedModal Component

✅ Reusable modal with 4 animation types:

- **spring** - Bouncy spring effect
- **smooth** - Smooth easing
- **bounce** - Extra bouncy
- **zoom** - Rotate + zoom effect

Usage:

```jsx
<AnimatedModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  animationType="spring"
>
  <YourModalContent />
</AnimatedModal>
```

### 3. useFramerAnimations Hook

✅ 10+ pre-defined animation hooks for common patterns

## Tips & Best Practices

✅ **Do:**

- Use `AnimatePresence` for mount/unmount animations
- Keep animations under 1 second for best feel
- Use spring for interactive elements (feels responsive)
- Use tween for precise timing
- Reuse variants across components
- Test on actual devices/networks

❌ **Don't:**

- Animate too many elements simultaneously
- Use very long durations (feels sluggish)
- Animate layout-shifting properties excessively
- Forget `AnimatePresence` when removing elements
- Nest too many levels of animations

## Resources

- **Official Docs**: https://www.framer.com/motion/
- **API Reference**: https://www.framer.com/motion/animation/
- **Examples**: https://www.framer.com/motion/examples/
- **Easing Visualizer**: https://easings.net/

## Next Steps

1. ✅ Modal animations implemented
2. 🔄 Apply AnimatedModal to other modals in your app
3. 🔄 Add animations to form inputs
4. 🔄 Animate list items with stagger effect
5. 🔄 Add loading spinner animations
6. 🔄 Toast notification animations

---

**Your e-voting system now has beautiful, professional animations! 🎉**

Start using `AnimatedModal`, `useFramerAnimations`, and motion components throughout your app for a polished user experience.
