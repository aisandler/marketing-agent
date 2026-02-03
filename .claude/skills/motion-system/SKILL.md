---
name: motion-system
description: Design-system agnostic animation timing, easing, and motion patterns that create impressive, polished interactions. Use when adding transitions, loading states, micro-interactions, staggered entrances, or page animations. Provides timing scales, custom easing curves (including spring physics), stagger patterns, and accessibility support. Pairs with any visual system - this skill handles motion mechanics, your visual system handles colors and styling.
license: MIT - See LICENSE.txt
tags:
  - animation
  - frontend
  - ui-core
archetype: toolkit
---

# Motion System

A design-system agnostic skill for creating impressive animations and interactions. This skill handles WHEN, HOW FAST, and HOW things move; pair it with a visual system for colors and styling.

## Motion Philosophy

### Design Principles

1. **Purpose Over Decoration**
   - Every animation should serve a purpose: feedback, orientation, or continuity
   - If an animation doesn't help the user, remove it
   - Motion should feel natural, not distracting

2. **Premium Motion = Layered Effects**
   - Don't animate just one property - combine transform + opacity + shadow
   - Use shadow escalation alongside lift transforms
   - Stagger child elements for cascade effects

3. **Performance First**
   - Animate only `transform` and `opacity` (GPU-accelerated)
   - Avoid animating `width`, `height`, `top`, `left` (triggers layout)
   - Use `will-change` sparingly and remove after animation

4. **Accessibility is Required**
   - Always respect `prefers-reduced-motion`
   - Provide instant alternatives for all animations
   - Motion should never block functionality

## Timing Scale

### Standard Durations

| Token | Duration | Use Case | Example |
|-------|----------|----------|---------|
| `instant` | 0ms | Disable animation | Reduced motion mode |
| `fast` | 100-150ms | Hover, focus states | Button hover |
| `normal` | 200ms | Standard transitions | Dropdown open, section expand |
| `deliberate` | 300ms | Emphasis, state change | Toggle switch, modal open |
| `slow` | 400-500ms | Large movements | Page transitions, drawer slide |
| `loading` | 500ms+ | Progress indication | Spinner rotation cycle |

### Tailwind Classes

```tsx
// Fast - hover states, immediate feedback
"transition-colors duration-150"

// Normal - standard transitions (DEFAULT)
"transition-all duration-200 ease-out"

// Deliberate - toggles, emphasis, state changes
"transition-all duration-300 ease-out"

// Slow - page transitions, large movements
"transition-all duration-500 ease-out"
```

**Full reference:** See `references/timing-scale.md`

## Easing Functions

### Standard Easings

| Easing | CSS | Feel | Use Case |
|--------|-----|------|----------|
| `ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Smooth deceleration | **Default** - most UI |
| `ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Springy overshoot | Attention-grabbing |
| `ease-bounce` | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Bouncy | Playful interactions |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Smooth both ends | Looping animations |
| `linear` | `linear` | Constant | Progress bars, spinners |

### Premium Easing (Tailwind Config)

```javascript
// tailwind.config.js
{
  transitionTimingFunction: {
    'motion-out': 'cubic-bezier(0.16, 1, 0.3, 1)',      // Smooth deceleration
    'motion-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Springy
    'motion-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Bouncy
  }
}
```

### The Default: Motion-Out

**Always use smooth deceleration for UI transitions:**
- Objects in the real world decelerate when stopping
- The fast start gives immediate feedback
- The slow end lets users track the final state

```tsx
"transition-all duration-200 ease-motion-out"
```

**Full reference:** See `references/easing-functions.md`

## Premium Animation Patterns

### 1. Lift + Shadow Escalation

The most important pattern for impressive buttons and cards:

```tsx
// Button with lift effect
<button className="
  shadow-md
  hover:-translate-y-0.5 hover:scale-[1.02]
  hover:shadow-lg
  active:translate-y-0 active:scale-[0.98]
  active:shadow-md
  transition-all duration-200 ease-motion-out
">

// Card with lift effect
<div className="
  shadow-sm
  hover:-translate-y-1
  hover:shadow-lg
  transition-all duration-300 ease-motion-out
">
```

### 2. Staggered Entrance

Create cascade effects for lists and grids:

```tsx
// CSS-only stagger with animation-delay
<ul className="space-y-2">
  {items.map((item, i) => (
    <li
      key={item.id}
      className="animate-fade-in-up opacity-0"
      style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'forwards' }}
    >
      {item.name}
    </li>
  ))}
</ul>

// Keyframes
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 3. Icon Scale on Parent Hover

Icons should react to parent hover state:

```tsx
<button className="group flex items-center gap-2">
  <span className="
    transition-transform duration-200 ease-motion-spring
    group-hover:scale-110
  ">
    <PlusIcon className="w-4 h-4" />
  </span>
  <span>Add Item</span>
</button>
```

### 4. Focus Ring Animation

Focus states should appear smoothly:

```tsx
<input className="
  ring-0
  focus:ring-4 focus:ring-indigo-500/30
  transition-shadow duration-200 ease-motion-out
"/>
```

### 5. Blur Transitions

Add blur for premium enter/exit effects:

```tsx
// Modal entrance with blur
<div className={`
  transition-all duration-300 ease-motion-out
  ${isOpen
    ? 'opacity-100 blur-0 scale-100'
    : 'opacity-0 blur-sm scale-95'
  }
`}>
```

### 6. Glow Pulse for Status

Animated glow for "alive" indicators:

```tsx
<span className="
  inline-flex items-center gap-2
  bg-green-500/15 text-green-500
  shadow-[0_0_20px_-5px_rgba(52,211,153,0.4)]
">
  <span className="
    w-2 h-2 rounded-full
    bg-green-500
    shadow-[0_0_8px_currentColor]
    animate-pulse
  " />
  Active
</span>
```

### 7. Badge Bounce on Update

Animate badges when values change:

```tsx
const [bounce, setBounce] = useState(false);

useEffect(() => {
  setBounce(true);
  const timer = setTimeout(() => setBounce(false), 300);
  return () => clearTimeout(timer);
}, [count]);

<span className={`
  transition-transform duration-300 ease-motion-spring
  ${bounce ? 'scale-125' : 'scale-100'}
`}>
  {count}
</span>
```

**Full reference:** See `references/premium-patterns.md`

## Loading States

### Spinner Variants

```tsx
// Basic spin
<div className="animate-spin">
  <Loader2 className="w-5 h-5" />
</div>

// Pulse dots
<div className="flex gap-1">
  <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
  <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
  <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
</div>

// Bar loader
<div className="flex gap-0.5 h-4 items-end">
  <span className="w-1 bg-current animate-[bar-grow_1s_ease-in-out_infinite]" style={{ animationDelay: '0ms' }} />
  <span className="w-1 bg-current animate-[bar-grow_1s_ease-in-out_infinite]" style={{ animationDelay: '100ms' }} />
  <span className="w-1 bg-current animate-[bar-grow_1s_ease-in-out_infinite]" style={{ animationDelay: '200ms' }} />
</div>
```

### Shimmer Skeleton

```tsx
<div className="relative overflow-hidden bg-slate-800 rounded">
  {/* Base skeleton shape */}
  <div className="h-4 w-3/4" />

  {/* Shimmer overlay */}
  <div className="
    absolute inset-0
    -translate-x-full
    bg-gradient-to-r from-transparent via-white/10 to-transparent
    animate-[shimmer_2s_infinite]
  " />
</div>

// Keyframes
@keyframes shimmer {
  100% { transform: translateX(100%); }
}
```

### Progress with Glow

```tsx
<div className="h-1 bg-slate-700 rounded overflow-hidden">
  <div
    className="
      h-full bg-indigo-500
      shadow-[0_0_12px_rgba(99,102,241,0.5)]
      transition-all duration-300 ease-motion-out
    "
    style={{ width: `${progress}%` }}
  />
</div>
```

### Loading State Guidelines

1. Show spinner after 200ms delay (avoid flash for fast responses)
2. Minimum display time 500ms (prevent jarring flash)
3. Use skeleton for layout-preserving loading
4. Use spinner for indeterminate waits

**Full reference:** See `references/loading-states.md`

## Page Transitions

### Crossfade with Scale

```tsx
// Exiting page scales down slightly, entering scales up
const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 }
};

<motion.div
  variants={pageVariants}
  initial="initial"
  animate="animate"
  exit="exit"
  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
>
```

### Slide + Blur

```tsx
const panelVariants = {
  initial: { opacity: 0, x: 20, filter: 'blur(4px)' },
  animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, x: -20, filter: 'blur(4px)' }
};
```

### Staggered Content Reveal

```tsx
const containerVariants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 }
};

<motion.div variants={containerVariants} initial="initial" animate="animate">
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

**Full reference:** See `references/page-transitions.md`

## Micro-Interactions

### Hover Feedback

```tsx
// Color change (fast)
<button className="transition-colors duration-150 hover:bg-slate-700">

// Lift + scale (premium)
<div className="
  transition-all duration-200 ease-motion-out
  hover:-translate-y-1 hover:scale-[1.02]
">

// Glow/shadow
<div className="
  transition-shadow duration-200
  hover:shadow-lg hover:shadow-indigo-500/25
">
```

### Click/Active Feedback

```tsx
// Scale down on press
<button className="
  transition-transform duration-100
  active:scale-95
">

// Combined lift + press
<button className="
  hover:-translate-y-0.5
  active:translate-y-0
  transition-transform duration-150 ease-motion-out
">
```

### Expand/Collapse

```tsx
// Chevron rotation
<ChevronRight
  className={`
    transition-transform duration-200 ease-motion-out
    ${isOpen ? 'rotate-90' : ''}
  `}
/>

// Content reveal with clip
<div className={`
  transition-all duration-300 ease-motion-out overflow-hidden
  ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
`}>
```

**Full reference:** See `references/micro-interactions.md`

## Visual Skill Pairing

This skill provides **motion mechanics**. Pair with any visual design skill for **styling**.

### Layering Pattern

1. Apply motion (this skill): timing, easing, transforms
2. Apply visual (your visual skill): colors, shadows, effects

```tsx
// Motion structure (from motion-system)
<button className="hover:-translate-y-0.5 transition-all duration-200 ease-motion-out">

// + Visual styling (from your visual skill)
<button className="hover:-translate-y-0.5 transition-all duration-200 ease-motion-out
                   bg-[skill]-gradient shadow-[skill]-lift hover:shadow-[skill]-lift-lg">
```

### What Each Skill Provides

| motion-system | Your visual skill |
|---------------|-------------------|
| Timing (`duration-*`) | Shadow tokens |
| Easing functions | Color tokens |
| Transforms | Glow effects |
| Stagger patterns | Shine overlays |
| Reduced motion | Theme variants |

To load a visual skill: `/skill [visual-skill-name]`

## Accessibility

### Reduced Motion

**Always provide an instant alternative:**

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### React Hook Pattern

```tsx
const usePrefersReducedMotion = () => {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(query.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
};

// Usage
const prefersReduced = usePrefersReducedMotion();
const duration = prefersReduced ? 0 : 200;
```

## Anti-Patterns

### NEVER:

1. **Single-property animations** - always combine effects
   ```tsx
   // WRONG - flat, boring
   "hover:bg-slate-700"

   // CORRECT - layered, premium
   "hover:bg-slate-700 hover:-translate-y-0.5 hover:shadow-lg transition-all"
   ```

2. **Animations longer than 400ms for UI feedback**
   ```tsx
   // WRONG - too slow
   "duration-700"

   // CORRECT
   "duration-200"
   ```

3. **Animating layout properties**
   ```tsx
   // WRONG - triggers layout
   "transition-[width,height]"

   // CORRECT - GPU accelerated
   "transition-[transform,opacity,shadow]"
   ```

4. **Missing reduced motion support**

5. **Inconsistent timing for same interaction type**

### ALWAYS:

1. Use premium easing (`ease-motion-out`) for UI transitions
2. Combine lift + shadow escalation on hover
3. Add icon scale on parent hover
4. Include `prefers-reduced-motion` support
5. Stagger entrance animations for lists
6. Use blur for premium enter/exit effects

## Checklist for Impressive Motion

- [ ] Buttons have lift (-translate-y) + shadow escalation on hover
- [ ] Cards have lift transform + shadow escalation
- [ ] Icons scale on parent hover
- [ ] Lists use staggered entrance animation
- [ ] Focus states have animated ring appearance
- [ ] Status badges have pulsing glow
- [ ] Modals use blur + scale for enter/exit
- [ ] Progress bars have accent glow
- [ ] All transitions use premium easing (ease-motion-out)
- [ ] Reduced motion support is present

## File Reference

| File | Purpose |
|------|---------|
| `references/timing-scale.md` | Duration values and when to use |
| `references/easing-functions.md` | Easing curves and spring physics |
| `references/premium-patterns.md` | Lift, stagger, glow patterns |
| `references/loading-states.md` | Spinners, skeletons, progress |
| `references/micro-interactions.md` | Hover, click, focus feedback |
| `references/page-transitions.md` | Route and panel transitions |
| `assets/patterns/LoadingSpinner.tsx` | Spinner component variants |
| `assets/patterns/SkeletonLoader.tsx` | Shimmer skeleton component |
| `assets/patterns/FadeTransition.tsx` | Fade + blur transition wrapper |
| `assets/patterns/StaggeredList.tsx` | Staggered entrance component |
