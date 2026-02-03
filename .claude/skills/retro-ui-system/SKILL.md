---
name: retro-ui-system
description: 8-bit aesthetic design system with dot grids, stepped gradients, scanlines, and CRT effects. Synthwave-inspired neon colors (magenta, cyan, purple). Use for gaming dashboards, retro-themed apps, synthwave aesthetics, creative tools, or any UI wanting nostalgic pixel vibes. Includes pixel shadows, blink animations, glitch effects, and neon glow patterns.
license: MIT - See LICENSE.txt
tags:
  - ui-style
  - design
  - frontend
  - react
archetype: guidance
---

# Retro UI Design System

An 8-bit aesthetic design system inspired by arcade games, CRT monitors, and synthwave visuals. Creates interfaces with nostalgic pixel vibes and neon glow effects.

## Design Philosophy

### Visual Identity

Retro UI creates interfaces that feel like **arcade cabinets and CRT monitors**:

- **Dot Grid Patterns**: Subtle dot matrices as backgrounds
- **Stepped Gradients**: Color banding instead of smooth transitions
- **Scanlines**: Horizontal lines simulating CRT displays
- **Neon Glows**: Bright, blooming colors with halos
- **Pixel Shadows**: Hard offset shadows (no blur)
- **Blink/Flicker**: Animated elements like old displays

### Color Philosophy

Synthwave-inspired palette with high contrast neons:

```
Primary:   #ff2d95 (Hot Pink/Magenta)
Secondary: #00f5ff (Electric Cyan)
Tertiary:  #9d4edd (Synthwave Purple)

Neon Accents:
- Yellow:  #f0f000
- Green:   #39ff14
- Orange:  #ff6600
```

### How It Differs

| Aspect | Soft/Glossy UI | Sharp UI | **Retro UI** |
|--------|----------------|----------|--------------|
| Gradients | Smooth | None (flat) | **Stepped/banded** |
| Shadows | Blurred layers | Offset solid | **Offset + neon glow** |
| Patterns | Grain texture | Grid lines | **Dot matrix** |
| Animation | Smooth easing | Precise | **Stepped/blink** |
| Corners | Rounded | Sharp | **Sharp or minimal** |

## Mode Selection

**REQUIRED GATE** - Determine mode before generating any output.

### STOP AND ASK if mode is unclear

| Mode | Triggers | Action |
|------|----------|--------|
| **Template** | "exact", "copy", "template", "standard", "give me a [Component]" | Copy from `assets/` verbatim |
| **Creative** | "creative", "interpret", "paint over", "apply to existing" | Honor Hard Boundaries, interpret freely |
| **New Design** | "from scratch", "new", "build me", "create a" | Full creative freedom within system |

**If Unclear, Ask**: "Would you like (1) exact template patterns, (2) creative interpretation applied to existing code, or (3) a new design from scratch?"

## Skill Protocol

Complete these steps before generating output:

### Step 1: Confirm Mode (REQUIRED)

Do not proceed without explicit mode determination. If ambiguous, ask.

### Step 2: Determine Colors (REQUIRED)

**Ask the user about color preferences:**

"Would you like to use:
1. **Retro UI Default** - The synthwave magenta/cyan/purple palette
2. **Preset Theme** - Ocean / Sunset / Forest / Monochrome
3. **Brand Colors** - Provide your own colors"

**Color Input Formats Supported:**
- Hex codes: `#ff2d95`, `#00f5ff`
- RGB: `rgb(255, 45, 149)`
- HSL: `hsl(330, 100%, 59%)`
- Plain language: "hot pink", "electric cyan", "neon purple"
- CSS variables: `var(--brand-primary)`

**If user provides brand colors:**
- Map primary → accent color for interactive elements
- Map secondary → supporting color for backgrounds/borders
- Derive muted/glow variants automatically from provided colors
- Preserve Retro UI's dot patterns, scanlines, and neon glow effects

**Preset Themes:**

| Theme | Primary | Secondary | Best For |
|-------|---------|-----------|----------|
| Default | Magenta (#ff2d95) | Cyan (#00f5ff) | Standard use |
| Ocean | Deep blue (#0066cc) | Teal (#00a3a3) | Corporate, trust |
| Sunset | Coral (#ff6b6b) | Gold (#ffd93d) | Warm, energetic |
| Forest | Emerald (#10b981) | Sage (#84cc16) | Natural, growth |
| Monochrome | Slate (#475569) | Gray (#94a3b8) | Minimal, professional |

### Step 3: Identify Companion Skills (RECOMMENDED)

| Skill | When to Recommend | Invoke |
|-------|-------------------|--------|
| `layout-system` | Multi-panel layouts, dashboards, scroll containment | `/skill layout-system` |
| `motion-system` | Animations, transitions, micro-interactions | `/skill motion-system` |
| `form-patterns` | Forms, validation, input handling | `/skill form-patterns` |

Suggest: "This design includes [panels/animations/forms]. Would you like me to load [skill] for best practices?"

### Step 4: Proceed with Implementation

With mode and colors confirmed, companions offered, continue to Quick Start.

## Invoking This Skill

### Automatic Detection
Activates when requests include style keywords like "retro", "8-bit", "synthwave", "neon", "CRT" or component requests.

### Manual Invocation
```
/skill retro-ui-system
```

### Combining Skills
When multiple skills active, precedence:
1. **Visual skill** (this) - colors, shadows, effects
2. **layout-system** - panels, scroll, spacing
3. **motion-system** - timing, easing, transforms
4. **form-patterns** - validation UX, field composition

## Quick Start

### 1. Add Tailwind Configuration

```javascript
// tailwind.config.js
const retroConfig = require('./retro-ui/tailwind.config.partial.js');

module.exports = {
  theme: {
    extend: {
      ...retroConfig.theme.extend,
    }
  }
}
```

### 2. Set Up CRT Background

```tsx
<div className="min-h-screen bg-retro-bg-deep relative overflow-hidden">
  {/* Dot grid pattern */}
  <div className="
    fixed inset-0
    bg-retro-dots bg-retro-dots
    opacity-50
    pointer-events-none
  " />

  {/* Scanlines overlay */}
  <div className="
    fixed inset-0
    bg-retro-scanlines-subtle
    pointer-events-none
    z-40
  " />

  {/* CRT vignette */}
  <div className="
    fixed inset-0
    bg-retro-vignette
    pointer-events-none
    z-50
  " />

  {/* Content */}
  <div className="relative z-10">{children}</div>
</div>
```

## Premium Patterns

### 1. The Retro Card

Card with dot pattern, pixel shadow, and neon border glow:

```tsx
<div className="
  relative
  bg-retro-bg-elevated
  border-2 border-retro-border-neon
  rounded-retro-sm
  shadow-retro-card
  hover:shadow-retro-card-hover
  hover:border-retro-primary
  transition-all duration-200
  overflow-hidden
">
  {/* Dot pattern background */}
  <div className="
    absolute inset-0
    bg-retro-dots bg-retro-dots
    opacity-30
    pointer-events-none
  " />

  {/* Neon top edge */}
  <div className="
    absolute top-0 left-0 right-0 h-0.5
    bg-retro-gradient-horizontal
    shadow-retro-glow-pink
  " />

  <div className="relative p-6">{content}</div>
</div>
```

### 2. Neon Button with Glow

Button with pulsing neon glow effect:

```tsx
<button className="
  relative
  px-6 py-3
  bg-retro-primary
  text-white font-bold
  rounded-retro-sm
  shadow-retro-glow-pink
  animate-retro-pulse-neon
  hover:bg-retro-primary-light
  hover:scale-105
  active:scale-95
  transition-transform duration-150 ease-retro-bounce
">
  {/* Pixel shadow offset */}
  <span className="
    absolute inset-0
    bg-retro-primary-dark
    rounded-retro-sm
    translate-x-1 translate-y-1
    -z-10
  " />

  <span className="relative">START GAME</span>
</button>
```

### 3. Stepped Gradient Bar

Progress bar with 8-bit color banding:

```tsx
<div className="h-4 bg-retro-bg-surface rounded-retro-sm overflow-hidden">
  <div
    className="h-full bg-retro-gradient-stepped"
    style={{ width: `${progress}%` }}
  />

  {/* Scanline overlay */}
  <div className="absolute inset-0 bg-retro-scanlines opacity-30" />
</div>
```

### 4. Blinking Cursor/Caret

Classic terminal-style blink:

```tsx
<span className="
  inline-block w-2 h-5
  bg-retro-cyan
  shadow-retro-glow-cyan
  animate-retro-blink
" />
```

### 5. Glitch Text Effect

Text with occasional glitch animation:

```tsx
<h1 className="
  text-4xl font-bold
  text-retro-text-primary
  animate-retro-glitch
  [text-shadow:0_0_10px_theme(colors.retro.primary.glow)]
">
  SYSTEM ONLINE
</h1>
```

### 6. Dot Matrix Status Badge

Status indicator with dot pattern:

```tsx
<span className="
  relative
  inline-flex items-center gap-2
  px-3 py-1.5
  bg-retro-success-muted
  border border-retro-success/50
  rounded-retro-sm
  text-retro-success text-sm font-bold
  shadow-[0_0_15px_rgba(57,255,20,0.3)]
">
  {/* Blinking dot */}
  <span className="
    w-2 h-2
    bg-retro-success
    shadow-[0_0_8px_theme(colors.retro.success.DEFAULT)]
    animate-retro-blink
  " />
  ACTIVE
</span>
```

### 7. CRT Monitor Frame

Container styled like a CRT monitor:

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
  <div className="p-6">
    {content}
  </div>

  {/* Scanlines */}
  <div className="
    absolute inset-0
    bg-retro-scanlines
    opacity-20
    pointer-events-none
  " />

  {/* Screen flicker */}
  <div className="
    absolute inset-0
    bg-retro-primary/5
    animate-retro-flicker
    pointer-events-none
  " />

  {/* Vignette */}
  <div className="
    absolute inset-0
    bg-retro-vignette
    pointer-events-none
  " />
</div>
```

### 8. Neon Border Tabs

Tab navigation with neon underline:

```tsx
<div className="flex gap-1 border-b-2 border-retro-border-subtle">
  {tabs.map(tab => (
    <button
      key={tab.id}
      className={`
        px-6 py-3
        font-bold text-sm
        transition-colors duration-150
        ${tab.active
          ? 'text-retro-cyan border-b-2 border-retro-cyan shadow-[0_2px_10px_rgba(0,245,255,0.5)] -mb-0.5'
          : 'text-retro-text-secondary hover:text-retro-text-primary'
        }
      `}
    >
      {tab.label}
    </button>
  ))}
</div>
```

### 9. Pixel Art Avatar

Avatar with pixel shadow offset:

```tsx
<div className="relative inline-block">
  {/* Pixel shadow */}
  <div className="
    absolute inset-0
    bg-retro-primary-dark
    rounded-retro-sm
    translate-x-1 translate-y-1
  " />

  {/* Avatar */}
  <div className="
    relative
    w-12 h-12
    bg-retro-gradient
    rounded-retro-sm
    flex items-center justify-center
    font-bold text-white
    border-2 border-white/20
  ">
    JD
  </div>
</div>
```

### 10. Data Grid with Dot Pattern

Table with retro styling:

```tsx
<div className="relative overflow-hidden rounded-retro">
  {/* Dot background */}
  <div className="absolute inset-0 bg-retro-dots bg-retro-dots-sm opacity-20" />

  <table className="relative w-full">
    <thead>
      <tr className="border-b-2 border-retro-primary/30">
        <th className="
          px-4 py-3
          text-left text-xs font-bold
          text-retro-primary
          uppercase tracking-wider
        ">
          Column
        </th>
      </tr>
    </thead>
    <tbody>
      <tr className="
        border-b border-retro-border-subtle
        hover:bg-retro-primary/10
        transition-colors
      ">
        <td className="px-4 py-3 text-retro-text-primary">Data</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Animation System

### Stepped Animations

Use `steps()` timing for authentic 8-bit feel:

```css
/* Stepped transitions */
transition-timing-function: steps(8, end);

/* Or smoother */
transition-timing-function: steps(16, end);
```

### Signature Animations

| Animation | Effect | Use Case |
|-----------|--------|----------|
| `retro-blink` | On/off toggle | Cursors, status dots |
| `retro-pulse-neon` | Glow intensity | Buttons, featured items |
| `retro-scanline` | Moving scanlines | CRT effect |
| `retro-glitch` | Position jitter | Headers, alerts |
| `retro-flicker` | Opacity variation | Screen flicker |
| `retro-float` | Vertical bob | Hero elements |

## Color Combinations

### High Impact (Primary)

```tsx
// Hot pink on dark
className="bg-retro-bg-deep text-retro-primary shadow-retro-glow-pink"
```

### Cool Tech (Secondary)

```tsx
// Cyan accents
className="border-retro-cyan text-retro-cyan shadow-retro-glow-cyan"
```

### Full Synthwave

```tsx
// Gradient with all colors
className="bg-retro-gradient text-white"
```

## Creative Mode

When operating in creative mode, distinguish between what MUST be preserved and what CAN be interpreted.

### Hard Boundaries (Never Violate)

These define Retro UI's structural identity. Violating these makes output "not Retro UI":

- **No smooth gradients**: Always use stepped/banded gradients (never smooth transitions)
- **No blur shadows**: Use only hard offset shadows + neon glow (never blurred drop shadows)
- **Dot pattern required**: Major surfaces must have dot matrix texture
- **Sharp or minimal corners**: 0-4px border-radius only (never rounded corners > 4px)
- **Stepped timing**: Use `steps()` timing function for signature animations (never smooth easing for key effects)
- **Neon glow effect**: Glowing colors are essential to the aesthetic

### Extendable Rules (Creative Territory)

Within hard boundaries, freely interpret these aspects:

- **Color palette**: Default is pink/cyan/purple synthwave, but customize freely:
  - Use any NEON/BRIGHT colors that glow well (not pastels or muted tones)
  - Create new neon combinations (lime/orange, blue/yellow, etc.)
  - Match brand colors but keep them vibrant and glow-capable
  - Dark backgrounds required for neon to pop
  - **Pre-fab schemes available**: See `references/ui-color-schemes.md` for named aesthetics (Ocean, Sunset, Midnight, etc.), brand-inspired presets (Stripe, Linear, Notion), and functional themes (SaaS Dashboard, Marketing Landing, E-Commerce) — adapt to neon brightness
- **Dot pattern variations**: Scale, density, and color variations of the dot matrix
- **Scanline creativity**: Angled scanlines, animated sweep directions, varying line spacing
- **Neon combinations**: Layer multiple glow colors, create new neon color sequences
- **CRT effects expansion**: Invent new vignette shapes, flicker patterns, phosphor trail effects
- **Stepped timing variations**: Vary `steps()` count for different animation feels (8, 12, 16)
- **Glitch creativity**: Invent new displacement patterns, color-shift glitch variations
- **Pixel art integration**: Create decorative 8-bit elements, icons, borders
- **Grid layouts**: Design unconventional arrangements that feel like arcade UI

### Paint-Over Guidance

When applying Retro UI aesthetic to existing code:

**1. Analyze Existing Design**
- Map current elements to Retro UI equivalents (cards, buttons, inputs)
- Identify layout structure to preserve
- Note CRT background setup needed

**2. Transform Systematically**
- Colors → Neon palette OR adapt brand colors to glow-capable variants
- Shadows → Pixel offset + neon glow (remove all blur shadows)
- Gradients → Convert to stepped/banded
- Border-radius → Reduce to 0-4px
- Backgrounds → Add dot matrix pattern

**3. Enhance Appropriately**
- Add CRT background layers (dots, scanlines, vignette)
- Apply neon glow to primary buttons
- Include blink animation on status indicators
- Add pixel shadow offset to elevated elements

**Example transformation:**
```tsx
// Before: Generic button
<button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">Save</button>

// After: Retro UI button
<button className="
  relative
  px-6 py-3
  bg-retro-primary
  text-white font-bold
  rounded-retro-sm
  shadow-retro-glow-pink
  animate-retro-pulse-neon
  hover:scale-105
  active:scale-95
  transition-transform duration-150 ease-retro-bounce
">
  <span className="
    absolute inset-0
    bg-retro-primary-dark
    rounded-retro-sm
    translate-x-1 translate-y-1
    -z-10
  " />
  <span className="relative">SAVE GAME</span>
</button>
```

## Anti-Patterns

### NEVER:

1. **Use smooth gradients** - always use stepped or solid
   ```tsx
   // WRONG
   className="bg-gradient-to-r from-pink-500 to-cyan-500"

   // CORRECT
   className="bg-retro-gradient-stepped"
   ```

2. **Use soft blurred shadows** - use hard offset or neon glow
   ```tsx
   // WRONG
   className="shadow-lg"

   // CORRECT
   className="shadow-retro-pixel-neon"
   ```

3. **Skip the dot pattern** - it's the signature texture

4. **Forget scanlines on large areas** - adds CRT authenticity

5. **Use smooth easing for key animations** - use `steps()` timing

### ALWAYS:

1. Add dot grid pattern to backgrounds
2. Use neon glow shadows on interactive elements
3. Include scanlines overlay on containers
4. Use pixel/offset shadows for depth
5. Add blink animation to status indicators
6. Use stepped timing for animations
7. Include CRT vignette on page backgrounds

## Checklist for Impressive Output

- [ ] Page has dot grid pattern background
- [ ] Scanlines overlay on main container
- [ ] CRT vignette effect on page edges
- [ ] Buttons have neon glow + pixel shadow
- [ ] Active states use pulsing neon animation
- [ ] Status badges have blinking dots
- [ ] Cards have dot pattern + neon border
- [ ] Tables have colored header borders
- [ ] Gradients use stepped/banded style
- [ ] Animations use steps() timing function

## Component Library

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| **RetroCard** | Container with dots | `glow`: pink, cyan, purple |
| **RetroButton** | Neon action button | `variant`: primary, secondary, ghost |
| **RetroTabs** | Tab navigation | `tabs`, `value`, `onChange` |
| **RetroInput** | Form input | `value`, `onChange` |
| **RetroToggle** | Boolean switch | `checked`, `onChange` |
| **RetroBadge** | Status indicator | `variant`, `blink` |
| **RetroProgress** | Stepped progress bar | `value`, `stepped` |
| **RetroMonitor** | CRT frame container | `scanlines`, `vignette` |

## File Reference

| File | Purpose |
|------|---------|
| `assets/tailwind.config.partial.js` | Tailwind theme extension |
| `assets/components/*.tsx` | React components |
| `references/premium-effects.md` | CRT, scanlines, glow patterns |
| `references/animation-guide.md` | Stepped animation patterns |
| `examples/arcade-dashboard.tsx` | Full dashboard example |
