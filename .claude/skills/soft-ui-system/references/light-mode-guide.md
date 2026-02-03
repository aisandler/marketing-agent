# Light Mode Design Specification

This guide details the light mode color palette and component adaptations.

## Color Palette

### Surface Colors

| Token | Value | Dark Equivalent | Usage |
|-------|-------|-----------------|-------|
| soft-light-100 | #ffffff | soft-dark-300 | Card surfaces, modals |
| soft-light-200 | #f8fafc | soft-dark-200 | Page background |
| soft-light-300 | #f1f5f9 | soft-dark-400 | Hover states |
| soft-light-400 | #e2e8f0 | - | Borders, dividers |
| soft-light-500 | #cbd5e1 | - | Disabled states |

### Text Colors

| Usage | Dark Mode | Light Mode |
|-------|-----------|------------|
| Primary | text-slate-200 | text-slate-800 |
| Secondary | text-slate-400 | text-slate-500 |
| Muted | text-slate-500 | text-slate-400 |
| Disabled | text-slate-600 | text-slate-300 |

### Border Colors

| State | Dark Mode | Light Mode |
|-------|-----------|------------|
| Default | white/[0.06] | slate-200/60 |
| Hover | white/[0.12] | slate-300/80 |
| Focus | soft-indigo-500/50 | soft-indigo-400/50 |

### Accent Colors

The indigo accent palette remains unchanged between themes:

- `soft-indigo-500` (#6b7cf0) - Primary accent
- `soft-indigo-400` (#8b9cf8) - Hover accent
- `soft-indigo-600` (#5566e8) - Pressed accent

**Note:** In light mode, use `soft-indigo-600` for text on white backgrounds for better contrast.

## Shadow Adaptations

Light mode shadows have reduced opacity to maintain subtlety on light backgrounds:

| Shadow | Dark Mode | Light Mode |
|--------|-----------|------------|
| soft | rgba(0,0,0,0.12) | rgba(0,0,0,0.06) |
| soft-lg | rgba(0,0,0,0.16) | rgba(0,0,0,0.08) |
| soft-glow | rgba(107,124,240,0.3) | rgba(107,124,240,0.2) |

## Component Adaptations

### SoftCard

```tsx
// Dark mode (default)
<SoftCard variant="elevated">
  // bg-soft-dark-200 border-white/[0.08] shadow-soft
</SoftCard>

// Light mode
<SoftCard variant="elevated" theme="light">
  // bg-white border-slate-200/60 shadow-soft-light
</SoftCard>
```

**Glass variant special case:**
```tsx
// Dark: bg-soft-dark-200/80 backdrop-blur-md
// Light: bg-white/80 backdrop-blur-md
```

### PillButton

Primary variant stays the same (indigo on white text works in both themes).

Secondary and ghost variants adapt:

```tsx
// Dark secondary
bg-soft-dark-300 text-slate-200
hover:bg-soft-dark-400 hover:text-white

// Light secondary
bg-soft-light-300 text-slate-700
hover:bg-soft-light-400 hover:text-slate-900
```

### SoftSelect

The dropdown portal needs themed styling:

```tsx
// Dark dropdown
bg-soft-dark-200 border-white/[0.08]
option-active: bg-soft-indigo-500/15 text-soft-indigo-300
option-inactive: text-slate-300 hover:bg-soft-dark-300

// Light dropdown
bg-white border-slate-200/80
option-active: bg-soft-indigo-50 text-soft-indigo-600
option-inactive: text-slate-700 hover:bg-soft-light-200
```

### SoftToggle

Track and thumb colors adapt:

```tsx
// Dark
track-off: bg-soft-dark-300
track-on: bg-soft-indigo-500 shadow-soft-glow
thumb: bg-slate-400 -> bg-white

// Light
track-off: bg-soft-light-400
track-on: bg-soft-indigo-500 shadow-soft-glow-light
thumb: bg-white (always, with light shadow)
```

### SoftSlider

The gradient fill remains the same, but the track adapts:

```tsx
// Dark track
bg-soft-dark-300

// Light track
bg-soft-light-400
```

### SoftSection

Text colors adapt for readability:

```tsx
// Dark
title: text-slate-300 hover:text-slate-200
description: text-slate-500
chevron: text-slate-500

// Light
title: text-slate-700 hover:text-slate-800
description: text-slate-500
chevron: text-slate-400
```

### SoftTreeItem

Selection and hover states:

```tsx
// Dark
selected: bg-soft-dark-300 text-white border-l-soft-indigo-500
default: text-slate-400 hover:bg-soft-dark-200

// Light
selected: bg-soft-light-300 text-slate-800 border-l-soft-indigo-500
default: text-slate-600 hover:bg-soft-light-200
```

## Implementation Pattern

### Component-Level Theming

Each component accepts a `theme` prop:

```tsx
interface ThemeableProps {
  theme?: 'dark' | 'light';
}

// Usage
<SoftCard theme="light" variant="elevated">
  <PillButton theme="light" variant="primary">
    Save
  </PillButton>
</SoftCard>
```

### Context-Based Theming (Optional)

For app-wide theming, create a context:

```tsx
import { createContext, useContext } from 'react';

type Theme = 'dark' | 'light';

const ThemeContext = createContext<Theme>('dark');

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{
  theme: Theme;
  children: React.ReactNode;
}> = ({ theme, children }) => (
  <ThemeContext.Provider value={theme}>
    {children}
  </ThemeContext.Provider>
);
```

Then modify components to use context as fallback:

```tsx
const SoftCard: React.FC<SoftCardProps> = ({
  theme: propTheme,
  ...props
}) => {
  const contextTheme = useTheme();
  const theme = propTheme ?? contextTheme;
  // ...
};
```

## CSS Variable Approach

For runtime theme switching without re-renders:

```css
:root {
  --soft-bg: #252931;
  --soft-surface: #2d323c;
  --soft-text: #e2e8f0;
}

.light {
  --soft-bg: #f8fafc;
  --soft-surface: #ffffff;
  --soft-text: #1e293b;
}
```

Use variables in components:

```tsx
<div style={{ background: 'var(--soft-surface)' }}>
  ...
</div>
```

This approach is provided in `assets/tokens/css-variables.css`.

## Testing Light Mode

Checklist for light mode verification:

- [ ] All text passes WCAG AA contrast (4.5:1 for normal text)
- [ ] Focus rings are visible against light backgrounds
- [ ] Shadows are subtle but visible
- [ ] Borders provide sufficient separation
- [ ] Active states are clearly distinguishable
- [ ] Disabled states are clearly muted
- [ ] Glassmorphism still creates depth perception
- [ ] Glow effects are visible but not overpowering
