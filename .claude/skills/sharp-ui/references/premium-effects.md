# Premium Effects Guide - Sharp UI

This guide covers the "wow factor" effects that make Sharp UI output impressive and bold rather than just functional.

## 1. Offset Shadow System

Sharp UI uses offset shadows instead of soft shadows for depth. This creates a bold, graphic design feel.

### Offset Shadow Scale

```css
/* Standard offset - cards, containers */
--shadow-sharp-offset: 4px 4px 0 0 #333333;

/* Large offset - emphasized elements */
--shadow-sharp-offset-lg: 6px 6px 0 0 #333333;

/* Accent offset - primary buttons, CTAs */
--shadow-sharp-offset-accent: 4px 4px 0 0 #00ff88;

/* Alt accent offset - destructive actions */
--shadow-sharp-offset-alt: 4px 4px 0 0 #ff3366;
```

### Offset Hover Pattern

Elements shift opposite to their shadow direction on hover:

```tsx
<button className="
  shadow-sharp-offset-accent
  hover:-translate-x-1 hover:-translate-y-1
  hover:shadow-[6px_6px_0_0_#00ff88]
  active:translate-x-0 active:translate-y-0
  active:shadow-none
  transition-all duration-150 ease-sharp
">
  EXECUTE
</button>
```

**Use for:**
- Primary buttons
- Card hover states
- Navigation items
- Interactive elements

## 2. Corner Accents (HUD Style)

Technical, heads-up-display style corner brackets create a bold framing effect.

```tsx
<div className="relative p-6">
  {/* Top-left corner */}
  <span className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-sharp-accent" />
  {/* Top-right corner */}
  <span className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-sharp-accent" />
  {/* Bottom-left corner */}
  <span className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-sharp-accent" />
  {/* Bottom-right corner */}
  <span className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-sharp-accent" />

  {/* Content */}
  <div className="px-4">
    Content here
  </div>
</div>
```

**Use for:**
- Hero sections
- Featured cards
- Important notices
- Data displays

## 3. Grid Backgrounds

Technical grid patterns add depth and a systems/engineering feel.

```tsx
// Page background with grid
<div className="bg-sharp-bg bg-sharp-grid bg-grid-md">

// Smaller grid for cards
<div className="bg-sharp-surface bg-sharp-grid bg-grid-sm">

// Large grid for hero areas
<div className="bg-sharp-bg bg-sharp-grid bg-grid-lg">
```

**Grid sizes:**
- `bg-grid-sm`: 20x20px (detailed, data-heavy areas)
- `bg-grid-md`: 40x40px (standard backgrounds)
- `bg-grid-lg`: 80x80px (hero sections, sparse content)

## 4. Scan Line Overlay

Retro-tech scan line effect for CRT/terminal aesthetic.

```tsx
<div className="relative">
  {/* Scan lines overlay */}
  <div className="
    absolute inset-0
    bg-sharp-scanlines
    pointer-events-none
    opacity-30
  " />

  {/* Moving scan line */}
  <div className="
    absolute left-0 right-0 h-[2px]
    bg-sharp-accent/30
    animate-sharp-scan
    pointer-events-none
  " />

  {/* Content */}
  <div className="relative">{content}</div>
</div>
```

**Use for:**
- Terminal/console displays
- Hero sections
- Loading states
- Retro-tech themed areas

## 5. Glitch Effect

Quick glitch animation for attention-grabbing interactions.

```tsx
// Glitch on hover
<span className="hover:animate-sharp-glitch">
  SYSTEM ONLINE
</span>

// Glitch on focus
<input className="focus:animate-sharp-glitch" />

// Triggered glitch (via class toggle)
<div className={isError ? 'animate-sharp-glitch' : ''}>
```

**Use sparingly for:**
- Error states
- Important alerts
- Interactive hover effects
- Transition moments

## 6. Status Indicators with Glow

Badges with accent-colored glow for "alive" feel.

```tsx
<span className="
  inline-flex items-center gap-2
  px-3 py-1.5
  bg-sharp-accent-muted
  text-sharp-accent
  border border-sharp-accent/50
  shadow-sharp-glow
  font-mono uppercase tracking-wider text-xs
">
  <span className="
    w-2 h-2
    bg-sharp-accent
    shadow-[0_0_8px_currentColor]
    animate-sharp-blink
  " />
  ONLINE
</span>
```

**Glow shadows:**
- `shadow-sharp-glow`: Green glow for success/active
- `shadow-sharp-glow-alt`: Pink glow for alerts/warnings

## 7. Terminal Cursor

Blinking cursor for terminal/typing aesthetic.

```tsx
// Static blinking cursor
<span className="text-sharp-accent animate-sharp-blink">_</span>

// After text element
<h1 className="font-mono">
  INITIALIZING<span className="animate-sharp-blink">_</span>
</h1>

// In input placeholder
<div className="flex items-center">
  <span className="text-sharp-text-muted">$</span>
  <span className="text-sharp-text">command here</span>
  <span className="animate-sharp-blink text-sharp-accent">|</span>
</div>
```

## 8. Border Pulse Animation

Animated border for attention without being aggressive.

```tsx
<div className="
  border-sharp border-sharp-border
  animate-sharp-border-pulse
">
  Awaiting input...
</div>
```

**Use for:**
- Waiting/pending states
- Items requiring attention
- Active selections
- Tutorial highlights

## 9. Bold Typography System

Sharp UI uses aggressive typography for impact.

### Headlines

```tsx
<h1 className="
  text-4xl font-bold
  uppercase tracking-wider
  text-sharp-text
">
  SYSTEM STATUS
</h1>
```

### Labels (Always Uppercase)

```tsx
<label className="
  text-xs font-semibold
  uppercase tracking-widest
  text-sharp-text-muted
">
  API ENDPOINT
</label>
```

### Monospace for Data

```tsx
<span className="
  font-mono text-sm
  text-sharp-accent
">
  0x7f4a2b8c
</span>
```

### Coordinates/Hints

```tsx
<span className="
  font-mono text-xs
  text-sharp-text-dim
  tracking-wide
">
  [12,48]
</span>
```

## 10. Double Border Effect

Layered borders for extra visual weight.

```tsx
<div className="
  bg-sharp-surface
  shadow-sharp-double
  p-4
">
  Double bordered content
</div>
```

## Complete Premium Button Example

```tsx
<button className="
  relative
  bg-sharp-accent text-sharp-bg
  border-sharp border-sharp-accent
  px-6 py-3
  font-bold uppercase tracking-wider
  shadow-sharp-offset-accent
  hover:-translate-x-1 hover:-translate-y-1
  hover:shadow-[6px_6px_0_0_#00ff88]
  active:translate-x-0 active:translate-y-0
  active:shadow-none
  focus:outline-none focus:ring-2 focus:ring-sharp-accent focus:ring-offset-2 focus:ring-offset-sharp-bg
  transition-all duration-150 ease-sharp
">
  EXECUTE COMMAND
</button>
```

## Complete Premium Card Example

```tsx
<div className="
  relative
  bg-sharp-surface
  border-sharp border-sharp-border
  shadow-sharp-offset
  hover:-translate-x-1 hover:-translate-y-1
  hover:shadow-sharp-offset-lg
  hover:border-sharp-accent
  transition-all duration-150 ease-sharp
">
  {/* Corner accents */}
  <span className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-sharp-accent" />
  <span className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-sharp-accent" />
  <span className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-sharp-accent" />
  <span className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-sharp-accent" />

  {/* Header */}
  <div className="px-4 py-3 border-b-2 border-sharp-border">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold uppercase tracking-widest text-sharp-text-muted">
        NODE STATUS
      </span>
      <span className="text-xs font-mono text-sharp-text-dim">[001]</span>
    </div>
  </div>

  {/* Content */}
  <div className="p-4">
    <div className="flex items-center gap-3">
      <span className="
        w-2 h-2 bg-sharp-accent
        shadow-[0_0_8px_#00ff88]
        animate-sharp-blink
      " />
      <span className="font-mono text-sharp-accent">OPERATIONAL</span>
    </div>
  </div>
</div>
```

## Complete Dashboard Header Example

```tsx
<header className="
  bg-sharp-surface
  border-b-sharp border-sharp-border
  relative
">
  {/* Scan line effect */}
  <div className="absolute inset-0 bg-sharp-scanlines opacity-20 pointer-events-none" />

  <div className="relative flex items-center justify-between px-6 py-4">
    {/* Logo with glitch */}
    <div className="flex items-center gap-3">
      <span className="
        text-xl font-bold uppercase tracking-widest
        text-sharp-text
        hover:animate-sharp-glitch
      ">
        TERMINAL
      </span>
      <span className="animate-sharp-blink text-sharp-accent">_</span>
    </div>

    {/* Status */}
    <div className="flex items-center gap-4">
      <span className="
        px-3 py-1
        bg-sharp-accent-muted
        text-sharp-accent
        border border-sharp-accent/30
        shadow-sharp-glow
        font-mono text-xs uppercase tracking-wider
      ">
        <span className="inline-block w-1.5 h-1.5 bg-sharp-accent rounded-none mr-2 animate-sharp-blink" />
        CONNECTED
      </span>
    </div>
  </div>
</header>
```

## Checklist for Impressive Output

- [ ] Primary buttons use offset shadows + hover transform
- [ ] Cards have corner accents on important items
- [ ] Grid background on page or sections
- [ ] Status badges have glow + blinking indicators
- [ ] All labels are UPPERCASE with tracking-wider
- [ ] Data/values use font-mono
- [ ] Hover states include border color changes
- [ ] Scan lines on terminal/console areas
- [ ] Glitch effect on key interactions
- [ ] Coordinates/hints in text-dim for technical feel
