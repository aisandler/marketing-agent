---
name: soft-ui-system
description: Complete design system for building impressive, premium interfaces with signature gradients, multi-layer shadows, hover transforms, and micro-interactions. Provides 10 React/Tailwind components with dark and light themes. Use when building dashboards, control panels, settings interfaces, or any UI needing a refined, modern aesthetic with "wow factor". Includes design tokens, component library, premium effects guide, and philosophy documentation.
license: Complete terms in LICENSE.txt
tags:
  - design
  - frontend
  - react
  - ui-style
archetype: guidance
---

# Soft UI Design System

A complete design system for creating impressive, premium interfaces that feel approachable yet visually stunning. Provides ready-to-use React components, Tailwind configuration, premium effects, and design philosophy guidance.

## Design Philosophy

The Soft UI system creates interfaces that look impressive AND feel approachable:

### Visual Identity

- **Signature Gradient**: Purple (#7c5cff) to Cyan (#06b6d4) for brand energy
- **Soft Curves**: Generous border-radius (12-24px) creates friendly, approachable forms
- **Depth Through Opacity**: Layered transparency (`white/[0.06]` to `white/[0.12]`) instead of stark borders
- **Premium Glow**: Active states use colored glow effects for visual energy

### Premium Effects

- **Multi-layer Shadows**: Stacked shadows create realistic depth (not single flat shadows)
- **Hover Transforms**: Elements lift (`-translate-y-1`) and scale (`1.02`) on hover
- **Shine Overlays**: Subtle light reflections on buttons and cards
- **Grain Texture**: Organic noise overlay at 3% opacity for premium feel
- **Animated Status**: Pulsing dots with outer glow for live indicators

### Interaction Patterns

- Custom easing `ease-soft-out` (cubic-bezier(0.16, 1, 0.3, 1)) for smooth deceleration
- Springy easing `ease-soft-spring` for attention-grabbing animations
- Shadow escalation on hover (soft → soft-lg)
- Active states use scale(0.98) for tactile feedback

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
1. **Soft UI Default** - The signature purple-to-cyan gradient palette
2. **Preset Theme** - Ocean / Sunset / Forest / Monochrome
3. **Brand Colors** - Provide your own colors"

**Color Input Formats Supported:**
- Hex codes: `#7c5cff`, `#06b6d4`
- RGB: `rgb(124, 92, 255)`
- HSL: `hsl(252, 100%, 69%)`
- Plain language: "ocean blue", "warm coral", "forest green"
- CSS variables: `var(--brand-primary)`

**If user provides brand colors:**
- Map primary → accent color for interactive elements
- Map secondary → supporting color for backgrounds/borders
- Derive muted/glow variants automatically from provided colors
- Preserve Soft UI's shadow, border-radius, and effect patterns

**Preset Themes:**

| Theme | Primary | Secondary | Best For |
|-------|---------|-----------|----------|
| Default | Purple (#7c5cff) | Cyan (#06b6d4) | Standard use |
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
Activates when requests include style keywords like "soft", "neumorphism", "gradient shadows" or component requests.

### Manual Invocation
```
/skill soft-ui-system
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
        soft: {
          primary: {
            DEFAULT: '#7c5cff',
            light: '#a78bfa',
            dark: '#6344ff',
            muted: 'rgba(124, 92, 255, 0.15)',
            glow: 'rgba(124, 92, 255, 0.5)',
          },
          secondary: {
            DEFAULT: '#06b6d4',
            muted: 'rgba(6, 182, 212, 0.15)',
            glow: 'rgba(6, 182, 212, 0.4)',
          },
          dark: {
            50: '#0c0d12', 100: '#12141a', 200: '#1a1d25',
            300: '#22262f', 400: '#2a2f3a', 500: '#343a47',
          },
          success: { DEFAULT: '#34d399', muted: 'rgba(52, 211, 153, 0.15)' },
          warning: { DEFAULT: '#fbbf24', muted: 'rgba(251, 191, 36, 0.15)' },
          error: { DEFAULT: '#f87171', muted: 'rgba(248, 113, 113, 0.15)' },
        }
      },
      backgroundImage: {
        'soft-gradient': 'linear-gradient(135deg, #7c5cff 0%, #06b6d4 100%)',
        'soft-gradient-subtle': 'linear-gradient(135deg, rgba(124, 92, 255, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)',
        'soft-shine': 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(0, 0, 0, 0.3)',
        'soft': '0 4px 16px -4px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
        'soft-lg': '0 8px 32px -8px rgba(0, 0, 0, 0.5), 0 4px 8px -4px rgba(0, 0, 0, 0.3)',
        'soft-glow': '0 0 40px -8px rgba(124, 92, 255, 0.5), 0 0 20px -4px rgba(124, 92, 255, 0.3)',
        'soft-lift': '0 4px 16px -4px rgba(0, 0, 0, 0.4), 0 0 20px -4px rgba(124, 92, 255, 0.3)',
        'soft-lift-lg': '0 8px 32px -8px rgba(0, 0, 0, 0.5), 0 0 40px -8px rgba(124, 92, 255, 0.4)',
      },
      transitionTimingFunction: {
        'soft-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'soft-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'soft-pulse': 'soft-pulse 2s ease-in-out infinite',
        'soft-glow': 'soft-glow-pulse 2s ease-in-out infinite',
      }
    }
  }
}
```

### 2. Copy Components

Copy `assets/components/` to your project and import:

```tsx
import { SoftCard, PillButton, PillTabs, SoftSelect } from './components/soft-ui';
```

### 3. Choose Theme Mode

**Dark mode** (default):
```tsx
<SoftCard variant="elevated">Dark theme content</SoftCard>
```

**Light mode** - pass `theme="light"`:
```tsx
<SoftCard variant="elevated" theme="light">Light theme content</SoftCard>
```

## Premium Effects

### Gradient Button (Primary CTA)

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
  <span className="relative">Button Text</span>
</button>
```

### Premium Card with Hover

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
    opacity-0 group-hover:opacity-100
    transition-opacity duration-300
  " />
  <div className="p-6">Content</div>
</div>
```

### Status Badge with Pulse

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

### Gradient Text (Hero Headlines)

```tsx
<h1 className="
  text-4xl font-bold tracking-tight
  bg-soft-gradient bg-clip-text text-transparent
">
  Dashboard
</h1>
```

**Complete patterns**: See `references/premium-effects.md`

## Component Library

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| **SoftCard** | Container/card | `variant`: default, elevated, glass |
| **PillButton** | Action button | `variant`: primary, secondary, ghost |
| **PillTabs** | Tab navigation | `tabs`, `activeTab`, `onTabChange` |
| **SoftSelect** | Dropdown select | `options`, `value`, `onChange` |
| **SoftToggle** | Boolean switch | `checked`, `onChange` |
| **SoftSlider** | Range input | `value`, `min`, `max`, `onChange` |
| **SoftSection** | Collapsible section | `title`, `icon`, `defaultOpen` |
| **CompactDropdown** | Inline dropdown | `options`, `value`, `onChange` |
| **SoftSearchInput** | Search field | `value`, `onChange`, `placeholder` |
| **SoftTreeItem** | Tree navigation | `node`, `onSelect`, `depth` |

**Detailed API**: See `references/component-api.md`

## Design Tokens

### Colors

```
Primary:     #7c5cff  (purple - gradient start)
Secondary:   #06b6d4  (cyan - gradient end)

soft-dark-50:  #0c0d12   (deepest canvas)
soft-dark-100: #12141a   (main background)
soft-dark-200: #1a1d25   (elevated surfaces)
soft-dark-300: #22262f   (cards, panels)
soft-dark-400: #2a2f3a   (hover state)
soft-dark-500: #343a47   (active/pressed)

Semantic:
success: #34d399  (green)
warning: #fbbf24  (amber)
error:   #f87171  (red)
```

### Multi-Layer Shadows

```
soft-sm:      0 2px 8px -2px rgba(0,0,0,0.3)
soft:         0 4px 16px -4px rgba(0,0,0,0.4), 0 2px 4px -2px rgba(0,0,0,0.2)
soft-lg:      0 8px 32px -8px rgba(0,0,0,0.5), 0 4px 8px -4px rgba(0,0,0,0.3)
soft-xl:      0 16px 48px -12px rgba(0,0,0,0.6), 0 8px 16px -8px rgba(0,0,0,0.4)

soft-glow:    0 0 40px -8px rgba(124,92,255,0.5), 0 0 20px -4px rgba(124,92,255,0.3)
soft-lift:    0 4px 16px -4px rgba(0,0,0,0.4), 0 0 20px -4px rgba(124,92,255,0.3)
soft-lift-lg: 0 8px 32px -8px rgba(0,0,0,0.5), 0 0 40px -8px rgba(124,92,255,0.4)
```

### Border Radius

```
soft-sm:  8px   (badges, small elements)
soft:     12px  (buttons, inputs)
soft-lg:  16px  (cards, sections)
soft-xl:  24px  (modals, large containers)
```

### Timing Functions

```
ease-soft-out:    cubic-bezier(0.16, 1, 0.3, 1)   (smooth deceleration)
ease-soft-spring: cubic-bezier(0.34, 1.56, 0.64, 1) (springy overshoot)
```

## Usage Patterns

### Form Layout

```tsx
<SoftCard padding="lg">
  <div className="space-y-4">
    <SoftSearchInput placeholder="Search..." />
    <SoftSelect options={options} value={value} onChange={setValue} />
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-300">Enable feature</span>
      <SoftToggle checked={enabled} onChange={setEnabled} />
    </div>
    <SoftSlider value={50} min={0} max={100} onChange={setValue} />
    <PillButton variant="primary" className="w-full">Save Changes</PillButton>
  </div>
</SoftCard>
```

### Navigation with Active State

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

## Creative Mode

When operating in creative mode, distinguish between what MUST be preserved and what CAN be interpreted.

### Hard Boundaries (Never Violate)

These define Soft UI's structural identity. Violating these makes output "not Soft UI":

- **Border-radius range**: 8-24px only (no sharp corners < 8px)
- **Shadow structure**: Always multi-layer shadows (never single-layer flat shadows)
- **Easing functions**: Always use `ease-soft-out` or `ease-soft-spring` (never linear or ease-in)
- **Opacity borders**: Use rgba white/black borders (never solid color borders)
- **Gradient direction**: 135deg diagonal for any gradient
- **Depth through opacity**: Layered transparency for visual hierarchy

### Extendable Rules (Creative Territory)

Within hard boundaries, freely interpret these aspects:

- **Color palette**: Default is purple/cyan (#7c5cff → #06b6d4), but customize freely:
  - Match brand colors when provided by user
  - Maintain contrast ratios (dark bg + light text, or light bg + dark text)
  - Create harmonious primary → secondary gradient pairs
  - Apply semantic colors (success/warning/error) that complement the primary
  - **Pre-fab schemes available**: See `references/ui-color-schemes.md` for named aesthetics (Ocean, Sunset, Midnight, etc.), brand-inspired presets (Stripe, Linear, Notion), and functional themes (SaaS Dashboard, Marketing Landing, E-Commerce)
- **Layout composition**: Arrange components in novel configurations (asymmetric, overlapping, unconventional grids, unexpected whitespace)
- **Animation choreography**: Invent new transitions using the approved timing functions (staggered reveals, parallax effects, orchestrated sequences)
- **Gradient application**: Apply gradients to unexpected elements (borders, text paths, progress bars, decorative shapes)
- **Shadow combinations**: Mix glow + lift patterns in new ways (ambient glows, directional emphasis, depth layering)
- **Component fusion**: Combine component patterns creatively (card-within-card, tabs-as-navigation, nested sections)
- **Scale variations**: Create micro or macro versions of standard patterns
- **State invention**: Design novel hover/active/focus states beyond the documented patterns
- **Decorative elements**: Add gradient accents, floating shapes, or ambient effects

### Paint-Over Guidance

When applying Soft UI aesthetic to existing code:

**1. Analyze Existing Design**
- Map current elements to Soft UI equivalents (buttons, cards, inputs, navigation)
- Identify layout structure to preserve (grid, flexbox, spacing rhythm)
- Note effects to replace vs enhance

**2. Transform Systematically**
- Colors → Soft UI palette OR adapt to existing brand colors
- Shadows → Multi-layer system (`shadow-soft`, `shadow-soft-lg`)
- Borders → Opacity-based (`border-white/[0.06]`)
- Border-radius → Soft range (12-24px: `rounded-soft`, `rounded-soft-lg`)
- Transitions → Add `ease-soft-out` timing

**3. Enhance Appropriately**
- Add gradient background to primary CTAs
- Apply shine overlay to gradient buttons
- Include lift + shadow escalation on hover for cards
- Add glow ring to focus states

**Example transformation:**
```tsx
// Before: Generic button
<button className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>

// After: Soft UI button
<button className="
  relative overflow-hidden
  bg-soft-gradient text-white font-semibold
  px-5 py-3 rounded-soft
  shadow-soft-lift
  hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-soft-lift-lg
  active:scale-[0.98]
  transition-all duration-200 ease-soft-out
">
  <span className="absolute inset-0 bg-soft-shine" />
  <span className="relative">Save</span>
</button>
```

## Anti-Patterns

**NEVER:**

- Use single-layer flat shadows - always use multi-layer shadows
- Skip hover transforms on interactive elements
- Use plain text for hero headlines - use gradient text
- Omit glow effects on status indicators
- Use linear easing - use ease-soft-out or ease-soft-spring
- Mix sharp corners (< 8px) with soft components
- Use saturated colors outside the defined palette

**ALWAYS:**

- Use gradient backgrounds for primary CTAs
- Include shine overlay on gradient buttons
- Add lift (-translate-y) + shadow escalation on hover
- Use pulsing animated dots for status indicators
- Apply grain texture overlay for premium feel
- Use custom timing functions for natural movement
- Include focus states with glow rings

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
- [ ] KPI values use gradient text

## Dependencies

**Required:**
- React 18+
- Tailwind CSS 3.4+

**Optional:**
- lucide-react (for default icons)

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
| `references/design-philosophy.md` | Aesthetic principles |
| `references/premium-effects.md` | Premium patterns guide |
| `references/light-mode-guide.md` | Light theme specs |
| `references/component-api.md` | Props documentation |
| `examples/dark-theme-demo.tsx` | Dark mode example |
| `examples/light-theme-demo.tsx` | Light mode example |
