# Premium Effects Guide - Retro UI

This guide covers the signature effects that make Retro UI feel like authentic 8-bit arcade interfaces and CRT monitors.

## 1. Dot Grid Patterns (Signature Effect)

The dot matrix pattern is the defining texture of Retro UI.

### Basic Dot Grid

```tsx
<div className="relative">
  {/* Content */}
  <div className="bg-retro-bg-elevated p-6">Content</div>

  {/* Dot overlay */}
  <div className="
    absolute inset-0
    bg-retro-dots bg-[length:16px_16px]
    opacity-40
    pointer-events-none
  " />
</div>
```

### Dot Density Options

```css
/* Standard - 16px spacing */
background-size: 16px 16px;

/* Dense - 8px spacing (more arcade feel) */
background-size: 8px 8px;

/* Sparse - 24px spacing (subtle) */
background-size: 24px 24px;
```

### Colored Dots

```tsx
// Pink dots for primary areas
<div className="bg-retro-dots-neon bg-[length:16px_16px]" />

// Cyan dots for secondary areas
<div className="bg-retro-dots-cyan bg-[length:16px_16px]" />
```

## 2. Scanlines (CRT Effect)

Horizontal lines simulating CRT monitor refresh.

### Static Scanlines

```tsx
<div className="relative overflow-hidden">
  {/* Content */}
  <div>{content}</div>

  {/* Scanlines overlay */}
  <div className="
    absolute inset-0
    bg-retro-scanlines
    opacity-20
    pointer-events-none
  " />
</div>
```

### Animated Scanlines

```tsx
<div className="
  absolute inset-0
  bg-retro-scanlines
  animate-retro-scanline
  opacity-15
  pointer-events-none
" />
```

### Scanline Intensity

```css
/* Strong - visible lines */
bg-retro-scanlines (2px gap, 30% black)

/* Subtle - barely visible */
bg-retro-scanlines-subtle (3px gap, 15% black)
```

## 3. CRT Vignette

Darkened corners like old monitors.

### Implementation

```tsx
<div className="relative min-h-screen">
  {/* Page content */}
  <div className="relative z-10">{children}</div>

  {/* Vignette overlay - always on top */}
  <div className="
    fixed inset-0
    bg-retro-vignette
    pointer-events-none
    z-50
  " />
</div>
```

### CSS Definition

```css
bg-retro-vignette: radial-gradient(
  ellipse at center,
  transparent 0%,
  transparent 60%,
  rgba(0, 0, 0, 0.4) 100%
);
```

## 4. Neon Glow Shadows

Bright, blooming colors that simulate neon lights.

### Standard Glow

```tsx
// Pink glow
<button className="shadow-retro-glow-pink">
  {/* 0 0 20px rgba(255, 45, 149, 0.5), 0 0 40px rgba(255, 45, 149, 0.3) */}
</button>

// Cyan glow
<div className="shadow-retro-glow-cyan">
  {/* 0 0 20px rgba(0, 245, 255, 0.5), 0 0 40px rgba(0, 245, 255, 0.3) */}
</div>

// Purple glow
<span className="shadow-retro-glow-purple">
  {/* 0 0 20px rgba(157, 78, 221, 0.5), 0 0 40px rgba(157, 78, 221, 0.3) */}
</span>
```

### Pulsing Glow Animation

```tsx
<button className="
  shadow-retro-glow-pink
  animate-retro-pulse-neon
">
  Pulsing neon button
</button>
```

### Text Glow

```tsx
<h1 className="
  text-retro-primary
  [text-shadow:0_0_10px_theme(colors.retro.primary.glow),0_0_20px_theme(colors.retro.primary.glow)]
">
  NEON TEXT
</h1>
```

## 5. Pixel Shadows (Offset)

Hard-edged shadows with no blur, offset like retro game sprites.

### Basic Pixel Shadow

```tsx
<div className="shadow-retro-pixel">
  {/* 4px 4px 0 0 rgba(0, 0, 0, 0.5) */}
</div>
```

### Colored Pixel Shadow

```tsx
// Pink offset
<div className="shadow-retro-pixel-neon">
  {/* 4px 4px 0 0 rgba(255, 45, 149, 0.4) */}
</div>

// Cyan offset
<div className="shadow-retro-pixel-cyan">
  {/* 4px 4px 0 0 rgba(0, 245, 255, 0.3) */}
</div>
```

### Stacked Pixel Shadow (More Depth)

```tsx
<div className="relative">
  {/* Shadow layer */}
  <div className="
    absolute inset-0
    bg-retro-primary-dark
    translate-x-1 translate-y-1
    rounded-retro-sm
  " />

  {/* Main element */}
  <div className="relative bg-retro-primary rounded-retro-sm">
    Content
  </div>
</div>
```

## 6. Stepped Gradients

8-bit color banding instead of smooth transitions.

### Vertical Stepped Gradient

```tsx
<div className="h-4 bg-retro-gradient-stepped">
  {/* 5-color bands: pink → purple variants → cyan */}
</div>
```

### Custom Stepped Gradient

```css
background: linear-gradient(
  180deg,
  #ff2d95 0%, #ff2d95 25%,    /* Band 1 */
  #9d4edd 25%, #9d4edd 50%,   /* Band 2 */
  #00f5ff 50%, #00f5ff 75%,   /* Band 3 */
  #39ff14 75%, #39ff14 100%   /* Band 4 */
);
```

### Stepped Progress Bar

```tsx
<div className="h-3 bg-retro-bg-surface rounded-retro-sm overflow-hidden">
  <div
    className="h-full"
    style={{
      width: `${progress}%`,
      background: `linear-gradient(90deg,
        #ff2d95 0%, #ff2d95 33%,
        #9d4edd 33%, #9d4edd 66%,
        #00f5ff 66%, #00f5ff 100%
      )`,
    }}
  />
</div>
```

## 7. Blink Animation

Classic on/off toggle like terminal cursors.

### Blinking Cursor

```tsx
<span className="
  inline-block w-2 h-5
  bg-retro-cyan
  shadow-[0_0_8px_theme(colors.retro.cyan.DEFAULT)]
  animate-retro-blink
" />
```

### Blinking Status Dot

```tsx
<span className="
  w-2 h-2 rounded-full
  bg-retro-success
  shadow-[0_0_8px_theme(colors.retro.success.DEFAULT)]
  animate-retro-blink
" />
```

### Keyframe Definition

```css
@keyframes retro-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Uses steps(2) for instant on/off */
animation: retro-blink 1s steps(2, start) infinite;
```

## 8. Glitch Effect

Random position jitter for headers and alerts.

### Implementation

```tsx
<h1 className="animate-retro-glitch">
  SYSTEM ERROR
</h1>
```

### Keyframe Definition

```css
@keyframes retro-glitch {
  0%, 90%, 100% { transform: translate(0); }
  91% { transform: translate(-2px, 1px); }
  92% { transform: translate(2px, -1px); }
  93% { transform: translate(-1px, 2px); }
  94% { transform: translate(1px, -2px); }
}
```

### Glitch with Color Shift

```tsx
<div className="relative">
  <h1 className="text-retro-text-primary">GLITCH</h1>

  {/* Cyan offset copy */}
  <h1 className="
    absolute inset-0
    text-retro-cyan
    opacity-70
    animate-retro-glitch
    [clip-path:inset(10%_0_80%_0)]
  ">
    GLITCH
  </h1>

  {/* Pink offset copy */}
  <h1 className="
    absolute inset-0
    text-retro-primary
    opacity-70
    animate-retro-glitch
    [animation-delay:50ms]
    [clip-path:inset(70%_0_10%_0)]
  ">
    GLITCH
  </h1>
</div>
```

## 9. Screen Flicker

Subtle opacity variation like old CRT monitors.

### Implementation

```tsx
<div className="relative">
  {/* Content */}
  <div>{content}</div>

  {/* Flicker overlay */}
  <div className="
    absolute inset-0
    bg-retro-primary/5
    animate-retro-flicker
    pointer-events-none
  " />
</div>
```

## 10. Complete CRT Monitor Component

Combining all effects for authentic CRT feel:

```tsx
<div className="
  relative
  bg-retro-bg-base
  border-4 border-retro-bg-hover
  rounded-retro-lg
  shadow-retro-inset
  overflow-hidden
">
  {/* Screen content */}
  <div className="relative p-6 z-10">
    {children}
  </div>

  {/* Dot pattern */}
  <div className="
    absolute inset-0
    bg-retro-dots bg-[length:8px_8px]
    opacity-20
    pointer-events-none
  " />

  {/* Scanlines */}
  <div className="
    absolute inset-0
    bg-retro-scanlines
    opacity-15
    pointer-events-none
  " />

  {/* Screen flicker */}
  <div className="
    absolute inset-0
    bg-white/[0.02]
    animate-retro-flicker
    pointer-events-none
  " />

  {/* Vignette */}
  <div className="
    absolute inset-0
    bg-retro-vignette
    pointer-events-none
  " />

  {/* Neon edge glow */}
  <div className="
    absolute inset-0
    border-2 border-retro-primary/20
    rounded-retro-lg
    shadow-[inset_0_0_30px_rgba(255,45,149,0.1)]
    pointer-events-none
  " />
</div>
```

## Animation Timing

### Use Steps for Authenticity

```css
/* Jerky, 8-bit feel */
transition-timing-function: steps(8, end);

/* Slightly smoother but still stepped */
transition-timing-function: steps(16, end);
```

### Example: Stepped Hover

```tsx
<button className="
  transition-all duration-300
  [transition-timing-function:steps(8,end)]
  hover:translate-x-1
  hover:bg-retro-primary
">
  STEPPED HOVER
</button>
```

## Checklist

- [ ] Page has dot grid pattern at 20-40% opacity
- [ ] Main container has scanlines overlay
- [ ] Page edges have CRT vignette
- [ ] Buttons have neon glow shadows
- [ ] Featured elements have pulsing neon animation
- [ ] Status indicators use blink animation
- [ ] Progress bars use stepped gradients
- [ ] Cards have pixel offset shadows
- [ ] Headers/alerts can use glitch effect
- [ ] Key animations use steps() timing
