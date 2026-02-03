# Sharp UI Design Philosophy

This document explains the aesthetic principles and design decisions behind the Sharp UI system.

## Origins and Inspiration

The Sharp UI aesthetic draws from several design movements:

- **Brutalist web design**: Raw, unpolished, functional aesthetics
- **Terminal/CLI interfaces**: Monospace fonts, high contrast, utilitarian feel
- **Industrial design**: Function over form, visible structure
- **Swiss/International style**: Grid-based, clean, no ornamentation

## Core Principles

### 1. Brutalism Through Hard Edges

Zero to minimal border-radius (0-4px max) creates a direct, no-nonsense feel. Rounded corners feel friendly; sharp corners feel serious and technical.

**Implementation:**
- `rounded-sharp` (0px): Default - truly sharp corners
- `rounded-sharp-sm` (2px): Subtle softening for specific cases
- `rounded-sharp-md` (4px): Maximum allowed - use sparingly

**Why it matters:** Developer tools, admin panels, and technical interfaces benefit from a professional, serious aesthetic. Sharp corners communicate precision and control.

### 2. High Contrast for Clarity

Near-black backgrounds (#0a0a0a) with pure white text (#ffffff) ensure maximum readability and a bold visual presence.

```css
/* Background progression */
sharp-bg:      #0a0a0a   /* Page background */
sharp-surface: #141414   /* Card surfaces */
sharp-hover:   #1a1a1a   /* Hover states */
sharp-active:  #222222   /* Pressed states */

/* Text */
sharp-text:       #ffffff   /* Primary - pure white */
sharp-text-muted: #888888   /* Secondary - mid gray */
```

**Why high contrast?**
- Maximum accessibility and readability
- Clear visual hierarchy without decoration
- Works in any lighting condition
- Reduces eye strain in dark environments

### 3. Strong Borders Over Shadows

In Sharp UI, borders do the work that shadows do in other systems. 2-3px solid borders provide clear element definition without any depth illusion.

```css
/* Border specification */
border-sharp:     2px solid #333333   /* Standard */
border-sharp-lg:  3px solid #333333   /* Emphasized */

/* No shadows - flat design */
box-shadow: none;
```

**Why borders over shadows?**
- Flat design feels more honest and direct
- Borders are more performant (no blur calculations)
- Creates a distinctive, recognizable aesthetic
- Aligns with brutalist and industrial design principles

### 4. Electric Green Accent

The `sharp-accent` (#00ff88) electric green was chosen for:

- **High visibility**: Pops dramatically against dark backgrounds
- **Technical associations**: Reminiscent of terminal prompts, matrix aesthetics
- **Energy**: Feels active, alive, and modern
- **Distinctiveness**: Not the overused blue or purple

**Usage guidelines:**
- Primary action buttons (border/text, not fill)
- Selected/active states
- Success indicators
- Focus outlines
- Never for large background areas

**Secondary accent:** `sharp-accent-alt` (#ff3366) hot pink for errors and destructive actions.

### 5. Bold Typography

All labels use uppercase with wide tracking to create a commanding, authoritative presence.

```css
/* Label treatment */
font-weight: 600;              /* Semi-bold */
text-transform: uppercase;
letter-spacing: 0.05em;        /* Wide tracking */
font-size: 10px or 11px;       /* Compact but readable */

/* Optional monospace */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

**Why uppercase labels?**
- Creates visual consistency across the interface
- Feels commanding and technical
- Works well at small sizes
- Clearly distinguishes labels from content

## Color Psychology

### The Dark Palette

The dark palette uses subtle gradations:

| Token | Hex | Purpose |
|-------|-----|---------|
| sharp-bg | #0a0a0a | Deepest - page background |
| sharp-surface | #141414 | Card/element surfaces |
| sharp-hover | #1a1a1a | Hover state feedback |
| sharp-active | #222222 | Pressed/active state |
| sharp-border | #333333 | Element boundaries |

**Key insight:** The progression is minimal. Unlike soft UIs with many surface levels, Sharp UI keeps surfaces nearly flat with borders doing the separation work.

### Accent Colors

| Token | Hex | Emotion/Usage |
|-------|-----|---------------|
| sharp-accent | #00ff88 | Energy, success, action |
| sharp-accent-alt | #ff3366 | Danger, error, attention |
| sharp-warning | #ffcc00 | Caution, pending states |

## Animation Philosophy

Sharp UI uses minimal, snappy animations:

```css
transition: all 150ms ease-out;
```

**Why 150ms?**
- Fast enough to feel instantaneous
- Slow enough to be perceived
- `ease-out` creates deceleration - feels responsive

**No decorative animations.** Sharp UI avoids:
- Bounces
- Elastic effects
- Long fade-ins
- Hover scale transforms

Interactions should feel immediate and precise.

## Accessibility Considerations

### Contrast Ratios

All text/background combinations exceed WCAG AAA standards:

| Combination | Ratio | Status |
|-------------|-------|--------|
| #ffffff on #0a0a0a | 19.5:1 | AAA |
| #ffffff on #141414 | 15.5:1 | AAA |
| #888888 on #0a0a0a | 6.5:1 | AA Large |
| #00ff88 on #0a0a0a | 12.4:1 | AAA |

### Focus States

High-visibility focus states using accent color:

```css
/* Focus ring */
outline: 2px solid #00ff88;
outline-offset: 2px;

/* Or border change */
border-color: #00ff88;
```

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

## When to Use Sharp UI

**Ideal for:**
- Developer tools and dashboards
- Admin panels and back-office interfaces
- Technical/engineering applications
- CLI-like web interfaces
- Data-heavy applications
- Monitoring and analytics dashboards

**Avoid for:**
- Consumer-facing products requiring warmth
- Children's applications
- Casual/entertainment apps
- Healthcare or wellness applications
- Anything requiring a soft, approachable feel

## Implementation Checklist

When building with Sharp UI, verify:

- [ ] Border radius never exceeds 4px
- [ ] All borders are 2-3px solid, visible
- [ ] No box shadows used (except focus rings)
- [ ] Labels are uppercase with tracking-wide
- [ ] Transitions are present (150ms ease-out)
- [ ] Focus states use accent color outline
- [ ] Text contrast exceeds 7:1 ratio
- [ ] Accent color used sparingly for emphasis
