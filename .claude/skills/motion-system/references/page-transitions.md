# Page Transitions

Patterns for route changes, panel transitions, and large-scale motion. Read this when implementing navigation animations.

## Transition Types

| Type | Duration | Use Case |
|------|----------|----------|
| Fade | 150-200ms | Tab content, modal content |
| Slide + Fade | 200-300ms | Panel transitions, routes |
| Scale | 200-300ms | Modal open/close |

## Fade Transition

### Framer Motion

```tsx
import { motion, AnimatePresence } from 'framer-motion';

<AnimatePresence mode="wait">
  <motion.div
    key={contentKey}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
  >
    {content}
  </motion.div>
</AnimatePresence>
```

## Slide + Fade (Panel Transition)

```tsx
const panelVariants = {
  initial: { opacity: 0, filter: 'blur(4px)' },
  animate: { opacity: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, filter: 'blur(4px)' }
};

<motion.div
  variants={panelVariants}
  initial="initial"
  animate="animate"
  exit="exit"
  transition={{ duration: 0.2 }}
/>
```

## Modal Transitions

### Scale + Fade

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
  {modalContent}
</motion.div>
```

## Reduced Motion Support

```tsx
const prefersReducedMotion = usePrefersReducedMotion();

<motion.div
  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
>
```
