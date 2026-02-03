# Easing Functions

Detailed documentation for animation easing curves. Read this when choosing how an animation should accelerate/decelerate.

## Standard Easings

### ease-out (Default)

**Use for: Most UI transitions**

```css
transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
```

```tsx
"ease-out" // Tailwind shorthand
```

**Why it's the default:**
- Fast start provides immediate feedback
- Slow end lets users track final state
- Mimics real-world object deceleration
- Feels responsive and natural

**Use for:**
- Button hover/focus
- Dropdown open
- Modal appear
- Section expand
- Element enter

### ease-in

**Use for: Elements leaving/exiting**

```css
transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
```

```tsx
"ease-in" // Tailwind shorthand
```

**Characteristics:**
- Slow start, fast end
- Accelerating motion
- Feels like "falling away"

**Use for:**
- Element exit animations
- Notifications dismissing
- Drawers closing (sometimes)

### ease-in-out

**Use for: Looping or symmetric animations**

```css
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
```

```tsx
"ease-in-out" // Tailwind shorthand
```

**Characteristics:**
- Slow start, fast middle, slow end
- Symmetric acceleration/deceleration
- Smooth, continuous feel

**Use for:**
- Looping animations
- Back-and-forth motion
- Loading indicators
- Pulse effects

### linear

**Use for: Constant-speed animations**

```css
transition-timing-function: linear;
```

```tsx
"ease-linear" // Tailwind shorthand
```

**Characteristics:**
- Constant speed throughout
- No acceleration or deceleration
- Mechanical, predictable

**Use for:**
- Progress bars
- Spinner rotation
- Countdown timers
- Scroll position indicators

## Custom Cubic Beziers

### Snappy

```css
cubic-bezier(0.2, 0, 0, 1)
```

More aggressive than ease-out. Very fast start, very slow end.

**Use for:** Quick UI feedback, tooltips

### Smooth

```css
cubic-bezier(0.4, 0, 0.2, 1)
```

Gentler than ease-out. More balanced acceleration.

**Use for:** Page transitions, large movements

### Bounce End

```css
cubic-bezier(0.34, 1.56, 0.64, 1)
```

Overshoots target then settles back.

**Use for:** Playful UI, emphasis, attention-grabbing

## Spring Physics (Framer Motion)

For more natural, physical motion:

### Standard Spring

```tsx
transition={{ type: "spring", stiffness: 300, damping: 20 }}
```

**Parameters:**
- `stiffness`: How "tight" the spring (higher = faster)
- `damping`: How quickly it settles (higher = less bounce)

### Common Presets

```tsx
// Snappy, minimal bounce
{ type: "spring", stiffness: 500, damping: 30 }

// Bouncy
{ type: "spring", stiffness: 300, damping: 10 }

// Smooth, gentle
{ type: "spring", stiffness: 100, damping: 20 }

// Quick settle
{ type: "spring", stiffness: 400, damping: 40 }
```

### When to Use Springs

- Draggable elements snapping back
- Modal/drawer bounce effect
- List item reordering
- Physical-feeling interactions
- Playful UI elements

## Easing by Context

| Context | Recommended Easing |
|---------|-------------------|
| Hover state | `ease-out` 150ms |
| Click feedback | `ease-out` 100ms |
| Dropdown open | `ease-out` 200ms |
| Dropdown close | `ease-in` 150ms |
| Modal appear | `ease-out` 300ms |
| Modal dismiss | `ease-in` 200ms |
| Page enter | `ease-out` 300ms |
| Page exit | `ease-in` 200ms |
| Progress bar | `linear` |
| Spinner | `linear` |
| Toggle switch | `ease-out` 300ms |
| Accordion | `ease-out` 200ms |

## Visual Reference

```
ease-out (default for entering):
╭─────────────╮
│    ╱        │  Fast start, slow end
│   ╱         │
│  ╱          │
│ ╱           │
╰─────────────╯

ease-in (for exiting):
╭─────────────╮
│          ╱  │  Slow start, fast end
│         ╱   │
│        ╱    │
│       ╱     │
╰─────────────╯

ease-in-out (for looping):
╭─────────────╮
│      ╱      │  Slow-fast-slow
│     ╱       │
│    ╱        │
│   ╱         │
╰─────────────╯

linear (for progress):
╭─────────────╮
│      ╱      │  Constant speed
│     ╱       │
│    ╱        │
│   ╱         │
╰─────────────╯
```

## Anti-Patterns

1. **Using ease-in for entering elements** - Feels sluggish
2. **Using ease-out for exiting elements** - Feels like it's fighting to stay
3. **Linear for UI transitions** - Feels mechanical, unnatural
4. **Different easings for similar interactions** - Inconsistent feel
