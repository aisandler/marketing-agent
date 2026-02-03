# Soft UI Design Philosophy

This document explains the aesthetic principles and design decisions behind the Soft UI system.

## Origins and Inspiration

The Soft UI aesthetic draws from several modern design movements:

- **Figma's native interface**: Clean, functional, yet warm and approachable
- **Evolved Neumorphism**: Soft depth without the accessibility issues of early neumorphic designs
- **Modern Glassmorphism**: Subtle backdrop blur for layered interfaces
- **Spatial Computing**: Influences from visionOS with soft, floating elements

## Core Principles

### 1. Approachability Through Curves

Generous border-radius values (12-20px) create a friendly, inviting feel. Sharp corners feel aggressive and clinical; soft curves feel welcoming.

**Implementation:**
- `rounded-soft` (12px): Small elements - buttons, inputs, badges
- `rounded-soft-lg` (16px): Medium elements - cards, sections
- `rounded-soft-xl` (20px): Large elements - modals, dialogs

**Why it matters:** Users spend extended time in dashboard and control panel interfaces. Soft curves reduce visual fatigue and create a sense of comfort.

### 2. Depth Through Opacity

Instead of heavy borders or stark color differences, we use opacity-based separation:

```css
/* Dark mode borders */
border-white/[0.06]   /* Subtle - default state */
border-white/[0.08]   /* Medium - elevated cards */
border-white/[0.12]   /* Strong - hover/focus states */

/* Light mode borders */
border-slate-200/60   /* Subtle - default state */
border-slate-300/80   /* Strong - hover/focus states */
```

**Why opacity?**
- Creates visual hierarchy without harsh lines
- Maintains cohesion across the design
- Feels more natural and organic
- Adapts gracefully to different background colors

### 3. Indigo as the Accent Color

The `soft-indigo-500` (#6b7cf0) accent was chosen for:

- **Trust and professionalism**: Indigo conveys reliability
- **Distinctiveness**: Not the overused blue or purple gradients
- **Glow potential**: Works beautifully with soft glow effects
- **Dark mode harmony**: Pops on dark backgrounds without being jarring

**Usage guidelines:**
- Primary buttons and active states
- Focus rings and selection indicators
- Progress indicators and highlights
- Never for large background areas

### 4. Animation Philosophy

All transitions use a consistent timing function:

```css
transition-all duration-200 ease-out
```

**Why 200ms?**
- Fast enough to feel responsive
- Slow enough to be perceived (not jarring)
- `ease-out` creates deceleration - mimics real-world physics

**Exceptions:**
- Toggles use 300ms for smoother state changes
- Hover states on colors can use 150ms for snappiness

## Color Psychology

### Dark Mode Palette

The dark palette progresses from deep to light:

| Token | Hex | Purpose |
|-------|-----|---------|
| soft-dark-500 | #14171d | Deepest - canvas background |
| soft-dark-200 | #252931 | Standard card background |
| soft-dark-300 | #2d323c | Hover states |
| soft-dark-400 | #363c48 | Active/pressed states |
| soft-dark-100 | #1e2128 | Sidebar backgrounds |

**Key insight:** The progression isn't linear. `soft-dark-200` is the "home base" - most cards sit here. Darker values are for canvas/backdrop, lighter values for interaction feedback.

### Light Mode Palette

Light mode inverts the hierarchy while maintaining the same relationships:

| Token | Hex | Purpose |
|-------|-----|---------|
| soft-light-200 | #f8fafc | Page background (warm off-white) |
| soft-light-100 | #ffffff | Card surfaces |
| soft-light-300 | #f1f5f9 | Hover states |
| soft-light-400 | #e2e8f0 | Borders, dividers |
| soft-light-500 | #cbd5e1 | Disabled states |

**Important:** We use Tailwind's slate scale for light mode to ensure ecosystem compatibility and familiar tokens.

## The Glow Effect

The signature `shadow-soft-glow` creates an ethereal, "magical" feel:

```css
shadow-soft-glow: 0 0 20px -4px rgba(107, 124, 240, 0.3)
```

**When to use:**
- Focus states on primary interactive elements
- Active/selected toggles
- Important call-to-action buttons

**When NOT to use:**
- Disabled states
- Background elements
- Multiple elements simultaneously (creates visual noise)

## Glassmorphism Guidelines

The `glass` variant adds depth through translucency:

```css
bg-soft-dark-200/80 backdrop-blur-md border border-white/[0.06]
```

**Rules for glassmorphism:**
1. Only use on elements that have content behind them
2. Never stack glass elements on top of each other
3. Always pair with a border for definition
4. Reduce contrast slightly in text for harmony

## Accessibility Considerations

### Contrast Ratios

All text/background combinations meet WCAG AA standards:

| Combination | Ratio | Status |
|-------------|-------|--------|
| slate-200 on soft-dark-200 | 7.2:1 | AAA |
| slate-400 on soft-dark-200 | 4.8:1 | AA |
| slate-800 on white | 12.6:1 | AAA |
| slate-500 on white | 5.1:1 | AA |

### Motion Sensitivity

For users with `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

### Focus States

Ring-based focus states are visible but not jarring:

```css
ring-2 ring-soft-indigo-500/20  /* Subtle glow ring */
border-soft-indigo-500/50       /* Colored border */
```

This provides clear focus indication without the harsh default browser outlines.

## Implementation Checklist

When building with Soft UI, verify:

- [ ] Border radius is consistent (no sharp corners mixed with soft)
- [ ] Transitions are present on all interactive elements
- [ ] Focus states are visible and use the ring pattern
- [ ] Text contrast meets AA standards minimum
- [ ] Opacity-based borders are used instead of solid colors
- [ ] Glow effects are reserved for primary actions only
- [ ] Theme prop is passed consistently if supporting light mode
