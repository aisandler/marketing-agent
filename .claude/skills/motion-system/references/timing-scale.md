# Timing Scale

Detailed documentation for animation duration values. Read this when deciding how long an animation should be.

## The Scale

| Token | Duration | Tailwind | Description |
|-------|----------|----------|-------------|
| `instant` | 0ms | `duration-0` | No animation (reduced motion) |
| `micro` | 50ms | `duration-50` | Imperceptible, state sync |
| `fast` | 100-150ms | `duration-100`, `duration-150` | Hover, focus feedback |
| `normal` | 200ms | `duration-200` | **Default** - most transitions |
| `deliberate` | 300ms | `duration-300` | Emphasis, user should notice |
| `slow` | 400-500ms | `duration-500` | Large movements, page transitions |
| `loading` | 1000ms+ | Custom | Spinner cycles, progress |

## Duration by Interaction Type

### Immediate Feedback (100-150ms)

For micro-interactions where users expect instant response:

- Hover state color changes
- Focus ring appearance
- Button press feedback
- Icon state changes
- Tooltip appearance

```tsx
// Hover color
"transition-colors duration-150"

// Focus ring
"transition-shadow duration-100"

// Active state
"transition-transform duration-100 active:scale-95"
```

### Standard Transitions (200ms)

The default for most UI animations:

- Dropdown open/close
- Section expand/collapse
- Modal backdrop fade
- Tab content switch
- Sidebar toggle

```tsx
// The universal default
"transition-all duration-200 ease-out"

// Dropdown menu
"transition-opacity duration-200"

// Expanding section
"transition-[max-height] duration-200"
```

### Deliberate Motion (300ms)

For state changes users should notice:

- Toggle switch sliding
- Checkbox check animation
- Drawer sliding open
- Accordion expansion
- Important state changes

```tsx
// Toggle switch
"transition-transform duration-300"

// Drawer
"transition-transform duration-300"

// Accordion content
"transition-all duration-300"
```

### Large Movements (400-500ms)

For significant layout changes:

- Page transitions
- Full-screen modal open
- Navigation drawer slide
- Hero section animations
- Onboarding steps

```tsx
// Page transition
"transition-all duration-500"

// Full-screen overlay
"transition-opacity duration-500"
```

### Loading Animations (500ms+)

For continuous or cyclical animations:

- Spinner rotation (typically 1s per cycle)
- Pulse effects (1-2s)
- Progress bar updates (300-500ms per segment)
- Skeleton shimmer (1.5-2s)

```tsx
// Spinner
"animate-spin" // Default 1s

// Pulse
"animate-pulse" // Default 2s

// Custom spinner timing
style={{ animationDuration: '0.8s' }}
```

## The 200ms Rule

**When in doubt, use 200ms with ease-out.**

This works because:
- Fast enough to feel responsive (< 100ms feels instant)
- Slow enough to be perceived (> 300ms feels sluggish)
- ease-out provides natural deceleration

```tsx
// The safe default
"transition-all duration-200 ease-out"
```

## Timing by Screen Size

Larger movements need more time to feel natural:

| Element Size | Duration |
|--------------|----------|
| Small (< 100px) | 150-200ms |
| Medium (100-300px) | 200-300ms |
| Large (> 300px) | 300-500ms |
| Full screen | 400-500ms |

## Perception Thresholds

| Duration | User Perception |
|----------|-----------------|
| < 100ms | Instant, unnoticeable |
| 100-200ms | Quick, responsive |
| 200-300ms | Normal, comfortable |
| 300-500ms | Noticeable, deliberate |
| > 500ms | Slow, potentially frustrating |
| > 1000ms | Very slow, needs justification |

## Delay Considerations

### When to Use Delays

- **Stagger children**: 50-100ms between items
- **Loading spinner delay**: 200ms before showing
- **Tooltip delay**: 300-500ms before showing
- **Auto-dismiss**: 3000-5000ms for notifications

### Stagger Pattern

```tsx
// Stagger list items
{items.map((item, i) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.05 }} // 50ms stagger
  />
))}
```

### Loading Delay Pattern

```tsx
// Don't show spinner for fast responses
const [showSpinner, setShowSpinner] = useState(false);

useEffect(() => {
  const timer = setTimeout(() => setShowSpinner(true), 200);
  return () => clearTimeout(timer);
}, []);

// Only render after delay
{isLoading && showSpinner && <Spinner />}
```

## Testing Timing

1. **Slow motion test**: View at 0.25x speed in DevTools
2. **Rapid interaction**: Click/hover quickly to check for glitches
3. **Side-by-side**: Compare similar elements for consistency
4. **Reduced motion**: Test with `prefers-reduced-motion: reduce`
