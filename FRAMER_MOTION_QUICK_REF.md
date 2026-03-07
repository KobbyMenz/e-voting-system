# 🎬 Framer Motion Quick Reference

Quick lookup for common Framer Motion patterns in your e-voting system.

## Installation ✅

```bash
npm install framer-motion
# Already installed in your project!
```

## Most Common Use Cases

### 1. **Simple Fade In**

```jsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Fades in
</motion.div>;
```

### 2. **Spring Animation (Bouncy)**

```jsx
<motion.div
  initial={{ scale: 0.8 }}
  animate={{ scale: 1 }}
  transition={{
    type: "spring",
    stiffness: 260,
    damping: 20,
  }}
>
  Springs up!
</motion.div>
```

### 3. **Hover Effect**

```jsx
<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
  Click me
</motion.button>
```

### 4. **Exit Animation (with AnimatePresence)**

```jsx
import { motion, AnimatePresence } from "framer-motion";

<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      Content
    </motion.div>
  )}
</AnimatePresence>;
```

### 5. **Staggered List**

```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map((item, i) => (
    <motion.div key={i} variants={itemVariants}>
      {item}
    </motion.div>
  ))}
</motion.div>;
```

## Your Modal (AddElectionModal)

✅ Already animated with:

```jsx
<motion.div
  initial={{ opacity: 0, scale: 0.75, y: 50 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.75, y: 50 }}
  transition={{
    type: "spring",
    stiffness: 260,
    damping: 20,
  }}
>
  Modal bounces in with spring effect
</motion.div>
```

## Reusable Components

### AnimatedModal (Use in other modals)

```jsx
import AnimatedModal from "../Layout/AnimatedModal";

<AnimatedModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  animationType="spring" // spring, smooth, bounce, zoom
>
  <div>Modal content</div>
</AnimatedModal>;
```

### Animation Hooks

```jsx
import {
  useButtonAnimation,
  useContainerAnimation,
  useCardAnimation,
  useLoadingAnimation,
  useNotificationAnimation,
  useAccordionAnimation,
} from "../CustomHooks/useFramerAnimations";
```

## Properties Reference

### Initial / Animate / Exit

```jsx
initial={{ opacity: 0, scale: 0 }}      // Start state
animate={{ opacity: 1, scale: 1 }}      // End state
exit={{ opacity: 0, scale: 0 }}         // When removed
exit={{ opacity: 0, y: -20 }}           // Slide out
```

### Gesture Animations

```jsx
whileHover={{ scale: 1.1 }}             // Mouse hover
whileTap={{ scale: 0.9 }}               // Mouse click
whileFocus={{ scale: 1.05 }}            // Input focus
whileInView={{ opacity: 1, y: 0 }}      // Scroll into view
drag                                     // Enable dragging
dragElastic={0.2}                        // Drag elasticity
dragConstraints={{ top: 0, left: 0 }}   // Drag limits
```

### Transitions

**Duration**

```jsx
transition={{ duration: 0.5 }}          // In seconds
```

**Type**

```jsx
transition={{ type: "spring" }}         // Bouncy
transition={{ type: "tween" }}          // Linear
transition={{ type: "inertia" }}        // Momentum
```

**Spring Physics**

```jsx
transition={{
  type: "spring",
  stiffness: 260,    // 0-1000 (higher = bouncier)
  damping: 20,       // 0-100 (higher = less bouncy)
  mass: 1,           // > 0 (higher = heavier)
  velocity: 2,       // Initial velocity
}}
```

**Easing**

```jsx
transition={{
  ease: "easeInOut",     // Default
  duration: 0.5,
}}
// Options: "linear", "easeIn", "easeOut", "easeInOut",
//          "circIn", "circOut", "backIn", "backOut",
//          "anticipate"
```

**Delay**

```jsx
transition={{ delay: 0.2, duration: 0.5 }}
transition={{ delayChildren: 0.1 }}      // For variants
transition={{ staggerChildren: 0.1 }}    // For variants
```

## Variants (Reusable Animations)

Define once, use many times:

```jsx
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

// Use everywhere
<motion.div
  variants={variants}
  initial="hidden"
  animate="visible"
  whileHover="hover"
  whileTap="tap"
/>;
```

## Common Patterns

### Fade In On Load

```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
/>
```

### Slide In From Left

```jsx
<motion.div
  initial={{ opacity: 0, x: -50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5 }}
/>
```

### Scale Up Entry

```jsx
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ type: "spring", stiffness: 300 }}
/>
```

### Modal with Backdrop

```jsx
<AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: "fixed", inset: 0 }}
      />
      <motion.div
        initial={{ scale: 0.75, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.75, y: 50 }}
      >
        Modal content
      </motion.div>
    </>
  )}
</AnimatePresence>
```

### Conditional Rendering

```jsx
<AnimatePresence mode="wait">
  {condition ? (
    <motion.div key="a">Option A</motion.div>
  ) : (
    <motion.div key="b">Option B</motion.div>
  )}
</AnimatePresence>
```

### Staggered Children

```jsx
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 0.1s between each child
      delayChildren: 0.2, // Delay before starting
    },
  },
};

const child = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

<motion.div variants={container} initial="hidden" animate="visible">
  {items.map((item) => (
    <motion.div key={item.id} variants={child}>
      {item.name}
    </motion.div>
  ))}
</motion.div>;
```

## Layout Animation

```jsx
<motion.div layout>
  {/* Content repositions smoothly when layout changes */}
</motion.div>
```

## Drag & Drop

```jsx
<motion.div
  drag
  dragConstraints={{ top: -100, left: -100, right: 100, bottom: 100 }}
  dragElastic={0.2}
  whileDrag={{ scale: 1.1 }}
>
  Draggable element
</motion.div>
```

## Your Files Reference

| File                         | Purpose                | Use Cases                   |
| ---------------------------- | ---------------------- | --------------------------- |
| `AddElectionModal.jsx`       | Modal with animations  | Spring entrance/exit        |
| `AnimatedModal.jsx`          | Reusable modal wrapper | Any modal in your app       |
| `useFramerAnimations.js`     | Animation hooks        | Buttons, cards, lists, etc. |
| `FRAMER_MOTION_EXAMPLES.jsx` | Copy-paste components  | 12 ready-to-use examples    |

## Examples from FRAMER_MOTION_EXAMPLES.jsx

```
1. AnimatedButton - Hover/tap animations
2. StaggeredList - List with staggered delays
3. AnimatedCardGrid - Cards with grid layout
4. LoadingSpinner - Rotating spinner
5. ToastNotification - Toast notifications
6. AccordionPanel - Expandable sections
7. TabNavigation - Animated tabs
8. ModalWithAnimation - Full modal example
9. AnimatedForm - Form with animations
10. FloatingActionButton - FAB with menu
11. PageWithAnimation - Page transitions
12. HoverReveal - Reveal on hover
```

## Tips

✅ **Use Spring For:**

- Interactive buttons
- Modal entrances
- User feedback animations

✅ **Use Tween For:**

- Precise timing
- Sequential animations
- Non-interactive transitions

✅ **Always Use AnimatePresence For:**

- Element removal with exit animations
- Conditional rendering
- Lists that change

✅ **Performance:**

- Use `transform` and `opacity` (GPU accelerated)
- Avoid `width`, `height`, `left`, `top`
- Keep stagger delays small (< 0.2s)
- Test on real devices

## Common Gotchas

❌ **Forgot AnimatePresence?**

```jsx
// ❌ Wrong - exit animation won't work
{
  isOpen && <motion.div exit={{ opacity: 0 }} />;
}

// ✅ Correct
<AnimatePresence>
  {isOpen && <motion.div exit={{ opacity: 0 }} />}
</AnimatePresence>;
```

❌ **Multiple Keys?**

```jsx
// ❌ Wrong - animations might not trigger
<motion.div key={item.id}>

// ✅ Correct - use stable key
<motion.div key={`item-${item.id}`}>
```

❌ **Animating Layout Properties?**

```jsx
// ❌ Wrong - janky animation
animate={{ width: 500 }}

// ✅ Correct - use transform
animate={{ scaleX: 1.1 }}
```

## Resources

- **Docs**: https://www.framer.com/motion/
- **API**: https://www.framer.com/motion/animation/
- **Examples**: https://www.framer.com/motion/examples/
- **Easing**: https://easings.net/

---

**Your modal is ready! 🎉 Start using AnimatedModal in other modals or animate individual components with Motion.**
