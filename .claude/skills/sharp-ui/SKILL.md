---
name: sharp-ui
description: Complete design system for building bold, brutalist interfaces with hard edges, offset shadows, glitch effects, and HUD-style corner accents. Provides 11 React/Tailwind components with dark and light theme support. Use when building technical dashboards, developer tools, admin panels, terminals, or any UI needing a bold, no-nonsense aesthetic with "wow factor". Includes design tokens, component library, premium effects guide, and philosophy documentation.
license: Complete terms in LICENSE.txt
tags:
  - design
  - frontend
  - react
  - ui-style
archetype: guidance
---

# Sharp UI Design System

A complete design system for creating bold, brutalist interfaces with hard edges, offset shadows, and technical aesthetics. Provides ready-to-use React components, Tailwind configuration, premium effects, and design philosophy guidance.

## Design Philosophy

The Sharp UI system creates interfaces that feel direct, technical, and impressive:

### Visual Identity

- **Hard Edges**: 0-4px border radius max creates a no-nonsense, technical feel
- **Offset Shadows**: Solid color offset shadows instead of soft shadows for bold depth
- **Electric Accents**: Neon green (#00ff88) and hot pink (#ff3366) for high energy
- **HUD Corners**: Technical corner brackets frame important elements
- **Grid Backgrounds**: Technical grid patterns for systems aesthetic

### Premium Effects

- **Offset Shadow Transforms**: Elements shift opposite to shadow on hover
- **Glitch Animation**: Quick shake effect for attention/errors
- **Scan Lines**: Retro-tech CRT overlay for terminal areas
- **Border Pulse**: Animated borders for pending states
- **Blinking Cursor**: Terminal cursor for typing aesthetic

### Interaction Patterns

- Snappy 150ms transitions with custom easing
- Hover states shift elements and change border colors
- Active states collapse offset shadows for "pressed" feel
- Focus states use accent-colored outline rings

**Full philosophy**: See `references/design-philosophy.md`
**Premium patterns**: See `references/premium-effects.md`

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
1. **Sharp UI Default** - The electric green/pink/blue palette
2. **Preset Theme** - Ocean / Sunset / Forest / Monochrome
3. **Brand Colors** - Provide your own colors"

**Color Input Formats Supported:**
- Hex codes: `#00ff88`, `#ff3366`
- RGB: `rgb(0, 255, 136)`
- HSL: `hsl(152, 100%, 50%)`
- Plain language: "electric green", "hot pink", "neon blue"
- CSS variables: `var(--brand-primary)`

**If user provides brand colors:**
- Map primary → accent color for interactive elements
- Map secondary → supporting color for backgrounds/borders
- Derive muted/glow variants automatically from provided colors
- Preserve Sharp UI's hard edges, offset shadows, and HUD corner patterns

**Preset Themes:**

| Theme | Primary | Secondary | Best For |
|-------|---------|-----------|----------|
| Default | Green (#00ff88) | Pink (#ff3366) | Standard use |
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
Activates when requests include style keywords like "sharp", "brutalist", "hard edges", "HUD" or component requests.

### Manual Invocation
```
/skill sharp-ui
```

### Combining Skills
When multiple skills active, precedence:
1. **Visual skill** (this) - colors, shadows, effects
2. **layout-system** - panels, scroll, spacing
3. **motion-system** - timing, easing, transforms
4. **form-patterns** - validation UX, field composition

## Quick Start

### 1. Add Tailwind Configuration

Copy the contents of `assets/tailwind.config.partial.js` to your `tailwind.config.js`:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        sharp: {
          bg: '#0a0a0a',
          surface: '#141414',
          border: '#333333',
          text: '#ffffff',
          'text-muted': '#888888',
          accent: { DEFAULT: '#00ff88', muted: 'rgba(0, 255, 136, 0.15)', glow: 'rgba(0, 255, 136, 0.6)' },
          'accent-alt': { DEFAULT: '#ff3366', muted: 'rgba(255, 51, 102, 0.15)', glow: 'rgba(255, 51, 102, 0.6)' },
          warning: { DEFAULT: '#ffcc00', muted: 'rgba(255, 204, 0, 0.15)' },
        }
      },
      boxShadow: {
        'sharp-offset': '4px 4px 0 0 #333333',
        'sharp-offset-lg': '6px 6px 0 0 #333333',
        'sharp-offset-accent': '4px 4px 0 0 #00ff88',
        'sharp-glow': '0 0 20px -4px rgba(0, 255, 136, 0.6)',
      },
      backgroundImage: {
        'sharp-grid': 'linear-gradient(rgba(51, 51, 51, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(51, 51, 51, 0.5) 1px, transparent 1px)',
        'sharp-scanlines': 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.15) 2px, rgba(0, 0, 0, 0.15) 4px)',
      },
      animation: {
        'sharp-glitch': 'sharp-glitch 0.3s ease-in-out',
        'sharp-blink': 'sharp-blink 1s step-end infinite',
        'sharp-border-pulse': 'sharp-border-pulse 2s ease-in-out infinite',
      }
    }
  }
}
```

### 2. Copy Components

Copy `assets/components/` to your project and import:

```tsx
import { SharpCard, SharpButton, SharpTabs, SharpSelect } from './components/sharp-ui';
```

### 3. Use Components

```tsx
<SharpCard variant="bordered">
  <SharpButton variant="primary">EXECUTE</SharpButton>
</SharpCard>
```

## Premium Effects

### Primary Button with Offset Shadow

```tsx
<button className="
  bg-sharp-accent text-sharp-bg
  border-sharp border-sharp-accent
  px-6 py-3
  font-bold uppercase tracking-wider
  shadow-sharp-offset-accent
  hover:-translate-x-1 hover:-translate-y-1
  hover:shadow-[6px_6px_0_0_#00ff88]
  active:translate-x-0 active:translate-y-0
  active:shadow-none
  transition-all duration-150 ease-sharp
">
  EXECUTE COMMAND
</button>
```

### Card with Corner Accents

```tsx
<div className="
  relative
  bg-sharp-surface
  border-sharp border-sharp-border
  shadow-sharp-offset
  hover:-translate-x-1 hover:-translate-y-1
  hover:shadow-sharp-offset-lg
  transition-all duration-150
">
  {/* HUD Corner accents */}
  <span className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-sharp-accent" />
  <span className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-sharp-accent" />
  <span className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-sharp-accent" />
  <span className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-sharp-accent" />

  <div className="p-4">Content</div>
</div>
```

### Status Badge with Glow

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
  <span className="w-2 h-2 bg-sharp-accent shadow-[0_0_8px_currentColor] animate-sharp-blink" />
  ONLINE
</span>
```

### Terminal with Scan Lines

```tsx
<div className="relative bg-sharp-surface border-sharp border-sharp-border">
  {/* Scan line overlay */}
  <div className="absolute inset-0 bg-sharp-scanlines opacity-30 pointer-events-none" />

  <div className="relative p-4 font-mono text-sharp-accent">
    $ system status<span className="animate-sharp-blink">_</span>
  </div>
</div>
```

### Grid Background

```tsx
<div className="bg-sharp-bg bg-sharp-grid bg-[size:40px_40px]">
  {/* Technical grid backdrop */}
</div>
```

**Complete patterns**: See `references/premium-effects.md`

## Component Library

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| **SharpCard** | Container with hard edges | `variant`: default, bordered, accent |
| **SharpButton** | Action button | `variant`: primary, secondary, ghost |
| **SharpTabs** | Tab navigation with underline | `tabs`, `value`, `onChange` |
| **SharpSelect** | Dropdown with hard edges | `options`, `value`, `onChange` |
| **SharpToggle** | Switch with square track | `checked`, `onChange` |
| **SharpInput** | Text input with thick border | `value`, `onChange`, `label` |
| **SharpBadge** | Status indicator with caps | `variant`, `children` |
| **SharpDivider** | Thick horizontal rule | `variant`: default, accent |
| **SharpSection** | Collapsible section | `title`, `defaultOpen`, `theme` |
| **SharpSearchInput** | Search input with icon | `value`, `onChange`, `theme` |
| **SharpTreeItem** | Tree navigation item | `id`, `label`, `depth`, `theme` |

**Detailed API**: See `references/component-api.md`

## Design Tokens

### Colors

```
Primary Accent:     #00ff88  (electric green)
Secondary Accent:   #ff3366  (hot pink)
Tertiary Accent:    #00ccff  (electric blue)

sharp-bg:           #0a0a0a  (near-black background)
sharp-surface:      #141414  (card surfaces)
sharp-border:       #333333  (visible borders)
sharp-text:         #ffffff  (pure white text)
sharp-text-muted:   #888888  (secondary text)
sharp-text-dim:     #555555  (coordinates, hints)
```

### Offset Shadows

```
sharp-offset:        4px 4px 0 0 #333333    (standard depth)
sharp-offset-lg:     6px 6px 0 0 #333333    (emphasized depth)
sharp-offset-accent: 4px 4px 0 0 #00ff88    (accent buttons)
sharp-offset-alt:    4px 4px 0 0 #ff3366    (destructive actions)
sharp-glow:          0 0 20px -4px rgba(0,255,136,0.6)  (status indicators)
```

### Border Radius

```
sharp:     0px   (default - truly sharp)
sharp-sm:  2px   (subtle softening)
sharp-md:  4px   (maximum allowed)
```

### Animations

```
sharp-glitch:       Quick shake for attention/errors
sharp-blink:        Terminal cursor blinking
sharp-border-pulse: Animated border color cycling
sharp-scan:         Moving scan line
```

## Usage Patterns

### Form Layout

```tsx
<SharpCard variant="bordered" padding="lg">
  <div className="space-y-4">
    <SharpInput
      label="API KEY"
      value={apiKey}
      onChange={setApiKey}
      placeholder="Enter your API key"
    />
    <SharpSelect
      label="ENVIRONMENT"
      options={envOptions}
      value={env}
      onChange={setEnv}
    />
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold uppercase tracking-wide text-sharp-text-muted">
        ENABLE DEBUG
      </span>
      <SharpToggle checked={debug} onChange={setDebug} />
    </div>
    <SharpDivider />
    <SharpButton variant="primary" className="w-full">
      SAVE CONFIGURATION
    </SharpButton>
  </div>
</SharpCard>
```

### Status Dashboard

```tsx
<div className="grid grid-cols-3 gap-4">
  <SharpBadge variant="success">
    <span className="w-2 h-2 bg-current animate-sharp-blink mr-2" />
    ONLINE
  </SharpBadge>
  <SharpBadge variant="warning">PENDING</SharpBadge>
  <SharpBadge variant="error">FAILED</SharpBadge>
</div>
```

## Creative Mode

When operating in creative mode, distinguish between what MUST be preserved and what CAN be interpreted.

### Hard Boundaries (Never Violate)

These define Sharp UI's structural identity. Violating these makes output "not Sharp UI":

- **Border-radius maximum**: 0-4px only (never rounded corners > 4px)
- **Offset shadows only**: Use solid offset shadows, never blurred drop shadows
- **Uppercase labels**: All labels/badges must be UPPERCASE with letter-spacing
- **Border weight**: Always 2-3px solid borders (never thin/light borders)
- **Typography**: Use font-mono for data/values, display fonts for headings
- **High contrast**: Maintain stark contrast between bg and accents

### Extendable Rules (Creative Territory)

Within hard boundaries, freely interpret these aspects:

- **Color palette**: Default is green/pink/blue electrics, but customize freely:
  - Use any HIGH-CONTRAST accent colors that stand out sharply
  - Match brand colors but keep them bold and punchy
  - Dark backgrounds (#0a0a0a style) or light backgrounds with dark elements
  - Accent colors should feel "electric" or "terminal-like"
  - **Pre-fab schemes available**: See `references/ui-color-schemes.md` for named aesthetics (Ocean, Sunset, Midnight, etc.), brand-inspired presets (Stripe, Linear, Notion), and functional themes (SaaS Dashboard, Marketing Landing, E-Commerce) — use high-contrast values
- **Corner accent patterns**: Invent new HUD bracket configurations (L-shaped, double-line, animated)
- **Grid background variations**: Vary grid size, create grid animations, use for creative layouts
- **Offset shadow choreography**: Animate shadow offset changes, create shadow "trails"
- **Scan line creativity**: Vary line spacing, add horizontal movement, use for transitions
- **Glitch variations**: Create system-specific glitch patterns, color-shift effects
- **Technical decorations**: Add coordinates, frame numbers, system codes, status text
- **Border patterns**: Dashed, double, animated borders within the thick style
- **Layout composition**: Unconventional grids, asymmetric arrangements, overlapping elements

### Paint-Over Guidance

When applying Sharp UI aesthetic to existing code:

**1. Analyze Existing Design**
- Map current elements to Sharp UI equivalents (cards, buttons, inputs)
- Identify layout structure to preserve
- Note grid background setup needed

**2. Transform Systematically**
- Colors → Sharp palette OR adapt brand colors to high-contrast variants
- Shadows → Offset solid (`shadow-sharp-offset`, `shadow-sharp-offset-lg`)
- Borders → Thick solid (`border-2`, `border-3`)
- Border-radius → Remove or reduce to 0-4px max
- Labels → Convert to UPPERCASE + tracking-wider

**3. Enhance Appropriately**
- Add corner accents to important cards
- Apply grid background to container
- Include offset shadow + hover transform on buttons
- Add scan lines to terminal/code areas
- Include blinking cursor for status

**Example transformation:**
```tsx
// Before: Generic button
<button className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">Save</button>

// After: Sharp UI button
<button className="
  bg-sharp-accent text-sharp-bg
  border-2 border-sharp-accent
  px-6 py-3
  font-bold uppercase tracking-wider
  shadow-sharp-offset-accent
  hover:-translate-x-1 hover:-translate-y-1
  hover:shadow-[6px_6px_0_0_#00ff88]
  active:translate-x-0 active:translate-y-0
  active:shadow-none
  transition-all duration-150 ease-sharp
">
  SAVE CONFIG
</button>
```

## Anti-Patterns

**NEVER:**

- Use border-radius greater than 4px - defeats the sharp aesthetic
- Use soft/gradient shadows - offset shadows only
- Skip offset shadow transforms on hover
- Use lowercase for labels - always UPPERCASE with tracking
- Mix soft/rounded components with sharp components
- Use thin/light borders - always 2-3px solid

**ALWAYS:**

- Use offset shadows that shift on hover (opposite direction)
- Apply UPPERCASE + tracking-wider to all labels
- Add corner accents to important cards
- Use grid backgrounds for technical areas
- Include glitch/blink effects for status indicators
- Use font-mono for data/values
- Add scan lines to terminal/console areas

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
- [ ] Coordinates/hints for technical feel

## Dependencies

**Required:**
- React 18+
- Tailwind CSS 3.4+

**Optional:**
- lucide-react (for default icons)
- JetBrains Mono / Fira Code (monospace fonts)
- Space Grotesk (display font)

## Alternative Token Formats

For non-Tailwind projects, use:
- `assets/tokens/css-variables.css` - CSS custom properties
- `assets/tokens/design-tokens.json` - Platform-agnostic JSON

## File Reference

| File | Purpose |
|------|---------|
| `assets/tailwind.config.partial.js` | Tailwind theme extension |
| `assets/tokens/css-variables.css` | CSS custom properties |
| `assets/tokens/design-tokens.json` | Platform-agnostic tokens |
| `assets/components/*.tsx` | React component library |
| `references/design-philosophy.md` | Brutalist principles |
| `references/premium-effects.md` | Premium patterns guide |
| `references/typography-guide.md` | Font weights, all-caps usage |
| `references/component-api.md` | Props documentation |
| `examples/dark-theme-demo.tsx` | Dark mode example |
| `examples/light-theme-demo.tsx` | Light mode example |
