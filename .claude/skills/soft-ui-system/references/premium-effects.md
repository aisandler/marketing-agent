# Premium Effects Guide

This guide covers the "wow factor" effects that make Soft UI output impressive rather than just correct.

## 1. Gradient System

### Primary Gradient (Purple → Cyan)

The signature gradient creates visual energy and brand identity.

```css
/* Primary gradient - for CTAs, logos, accents */
background: linear-gradient(135deg, #7c5cff 0%, #06b6d4 100%);

/* Tailwind */
bg-soft-gradient
```

**Use for:**
- Primary buttons
- Logo marks
- Active navigation indicators
- Notification badges
- Chart elements

### Subtle Gradient (Muted for backgrounds)

```css
/* Subtle gradient - for card backgrounds, hover states */
background: linear-gradient(135deg, rgba(124, 92, 255, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%);

/* Tailwind */
bg-soft-gradient-subtle
```

**Use for:**
- Active nav item backgrounds
- Selected card states
- Feature highlight areas

### Gradient Text

```css
/* Gradient text for headlines */
background: linear-gradient(135deg, #7c5cff 0%, #06b6d4 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;

/* Tailwind */
bg-soft-gradient bg-clip-text text-transparent
```

**Use for:**
- Hero headlines
- Logo text
- KPI values on hover
- Feature highlights

## 2. Multi-Layer Shadows

Single shadows look flat. Layer multiple shadows for depth.

### Shadow Scale

```css
/* Small - subtle elevation */
--shadow-soft-sm: 0 2px 8px -2px rgba(0, 0, 0, 0.3);

/* Medium - cards, panels */
--shadow-soft:
  0 4px 16px -4px rgba(0, 0, 0, 0.4),
  0 2px 4px -2px rgba(0, 0, 0, 0.2);

/* Large - modals, dropdowns, hover states */
--shadow-soft-lg:
  0 8px 32px -8px rgba(0, 0, 0, 0.5),
  0 4px 8px -4px rgba(0, 0, 0, 0.3);

/* Extra large - hero elements */
--shadow-soft-xl:
  0 16px 48px -12px rgba(0, 0, 0, 0.6),
  0 8px 16px -8px rgba(0, 0, 0, 0.4);
```

### Glow Shadows

Add colored glow for emphasis and energy.

```css
/* Primary glow */
--shadow-soft-glow:
  0 0 40px -8px rgba(124, 92, 255, 0.5),
  0 0 20px -4px rgba(124, 92, 255, 0.3);

/* Combined lift + glow (for buttons) */
--shadow-soft-lift:
  0 4px 16px -4px rgba(0, 0, 0, 0.4),
  0 0 20px -4px rgba(124, 92, 255, 0.3);
```

### Shadow Escalation Pattern

Cards and buttons should escalate shadow on hover:

```tsx
// Card: soft → soft-lg on hover
<div className="
  shadow-soft hover:shadow-soft-lg
  transition-shadow duration-300
">

// Button: soft-lift → soft-lift-lg on hover
<button className="
  shadow-soft-lift hover:shadow-soft-lift-lg
  transition-shadow duration-200
">
```

## 3. Hover Transforms

Static hover states feel dead. Add physical transforms.

### Lift Effect

```tsx
// Card lift (4px)
<div className="
  hover:-translate-y-1
  transition-transform duration-300 ease-soft-out
">

// Button lift (2px) + scale
<button className="
  hover:-translate-y-0.5 hover:scale-[1.02]
  active:scale-[0.98]
  transition-all duration-200 ease-soft-out
">
```

### Icon Scale

```tsx
// Icons scale on parent hover
<div className="group">
  <div className="
    group-hover:scale-110
    transition-transform duration-200
  ">
    <Icon />
  </div>
</div>
```

### Combined Transform Pattern

The ideal button hover combines multiple effects:

```tsx
<button className="
  bg-soft-gradient
  shadow-soft-lift
  hover:-translate-y-0.5
  hover:scale-[1.02]
  hover:shadow-soft-lift-lg
  active:translate-y-0
  active:scale-[0.98]
  transition-all duration-200 ease-soft-out
">
```

## 4. Shine Overlay

Add a subtle light reflection for premium feel.

```css
/* Shine gradient */
.shine::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%);
  pointer-events: none;
}
```

**Use for:**
- Gradient buttons
- Avatar containers
- Logo marks
- Feature cards

```tsx
<button className="relative overflow-hidden bg-soft-gradient">
  <span className="absolute inset-0 bg-soft-shine" />
  <span className="relative">Button Text</span>
</button>
```

## 5. Grain Texture

Subtle noise adds premium, organic feel.

```css
/* Grain overlay at 3% opacity */
.grain::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,...");
  opacity: 0.03;
  pointer-events: none;
  z-index: 9999;
}
```

Apply to `body` or main container:

```tsx
<body className="relative soft-grain">
```

## 6. Status Indicators with Glow

Plain badges are boring. Add animated dots and outer glow.

```tsx
<span className="
  inline-flex items-center gap-2
  px-3 py-1.5 rounded-full
  bg-soft-success-muted text-soft-success
  shadow-[0_0_12px_-2px_rgba(52,211,153,0.4)]
">
  <span className="
    w-2 h-2 rounded-full
    bg-soft-success
    shadow-[0_0_8px_currentColor]
    animate-soft-pulse
  " />
  Active
</span>
```

## 7. Navigation Active States

Don't just change background color. Add multiple indicators:

```tsx
<a className="
  relative
  bg-soft-gradient-subtle
  border border-soft-primary/40
  shadow-soft-sm
">
  {/* Left accent bar */}
  <span className="
    absolute left-0 top-1/2 -translate-y-1/2
    w-[3px] h-6
    bg-soft-gradient
    rounded-r
    shadow-soft-glow
  " />

  Dashboard
</a>
```

## 8. Animation Timing Functions

Use custom easing for natural movement:

```css
/* Smooth deceleration - default for UI */
--ease-soft-out: cubic-bezier(0.16, 1, 0.3, 1);

/* Springy overshoot - for attention */
--ease-soft-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

```tsx
// Standard transitions
transition-all duration-200 ease-soft-out

// Springy animations (icons, notifications)
transition-transform duration-300 ease-soft-spring
```

## 9. Focus States with Glow Ring

Plain outlines look dated. Use glowing rings:

```tsx
<input className="
  focus:outline-none
  focus:border-soft-primary
  focus:ring-4 focus:ring-soft-primary-muted
  focus:shadow-soft-glow
  transition-all duration-200
"/>
```

## 10. Premium Typography

### Letter Spacing

```css
/* Headlines: slightly tighter */
letter-spacing: -0.02em;

/* Labels/badges: slightly wider */
letter-spacing: 0.05em;
text-transform: uppercase;
```

### Font Weight Scale

```css
/* Body text */
font-weight: 400;

/* Labels, secondary */
font-weight: 500;

/* Headings, emphasis */
font-weight: 600;

/* KPI values, hero */
font-weight: 700;
```

## Complete Premium Button Example

```tsx
<button className="
  relative overflow-hidden
  inline-flex items-center gap-2
  px-5 py-3
  bg-soft-gradient
  text-white font-semibold
  rounded-soft
  shadow-soft-lift
  hover:-translate-y-0.5 hover:scale-[1.02]
  hover:shadow-soft-lift-lg
  active:translate-y-0 active:scale-[0.98]
  transition-all duration-200 ease-soft-out
">
  {/* Shine overlay */}
  <span className="absolute inset-0 bg-soft-shine" />

  {/* Icon */}
  <span className="relative">
    <PlusIcon className="w-4 h-4" />
  </span>

  {/* Text */}
  <span className="relative">Add New</span>
</button>
```

## Complete Premium Card Example

```tsx
<div className="
  relative
  bg-soft-dark-300
  border border-white/[0.06]
  rounded-soft-lg
  shadow-soft
  hover:border-white/[0.12]
  hover:shadow-soft-lg
  hover:-translate-y-1
  transition-all duration-300 ease-soft-out
  overflow-hidden
">
  {/* Gradient top bar (appears on hover) */}
  <div className="
    absolute top-0 left-0 right-0 h-[2px]
    bg-soft-gradient
    opacity-0 hover:opacity-100
    transition-opacity duration-300
  " />

  {/* Content */}
  <div className="p-6">
    {/* ... */}
  </div>
</div>
```

## Checklist for Impressive Output

- [ ] Primary buttons use gradient + shine + lift
- [ ] Cards lift and escalate shadow on hover
- [ ] Status badges have pulsing dots and outer glow
- [ ] Navigation active states have accent bars
- [ ] Focus states use glowing rings
- [ ] Typography uses tighter letter-spacing on headlines
- [ ] Grain texture applied to body
- [ ] Custom easing (ease-soft-out) on all transitions
- [ ] Icons scale on hover within interactive elements
- [ ] KPI values use gradient text on hover
