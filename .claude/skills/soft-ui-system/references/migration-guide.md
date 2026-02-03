# Migration Guide: Using Soft UI Without Tailwind

This guide covers using Soft UI design tokens and components outside of Tailwind CSS projects.

## CSS Custom Properties

The `assets/tokens/css-variables.css` file provides all design tokens as CSS custom properties.

### Installation

1. Copy `css-variables.css` to your project
2. Import it in your main CSS or HTML:

```html
<link rel="stylesheet" href="css-variables.css">
```

Or in CSS:
```css
@import 'css-variables.css';
```

### Available Variables

#### Colors
```css
--soft-bg           /* Page background */
--soft-surface      /* Card surfaces */
--soft-surface-hover /* Hover state */
--soft-border       /* Default borders */
--soft-border-hover /* Hover borders */
--soft-border-focus /* Focus borders */
--soft-text-primary /* Main text */
--soft-text-secondary /* Secondary text */
--soft-text-muted   /* Muted text */
--soft-accent       /* Primary accent */
--soft-accent-hover /* Accent hover */
--soft-accent-active /* Accent pressed */
```

#### Layout
```css
--radius-soft       /* 12px - buttons, inputs */
--radius-soft-lg    /* 16px - cards */
--radius-soft-xl    /* 20px - modals */
```

#### Effects
```css
--shadow-soft       /* Standard elevation */
--shadow-soft-lg    /* Large elevation */
--shadow-soft-glow  /* Indigo glow */
--transition-soft   /* 200ms ease-out */
```

### Theme Switching

Add `light` class or `data-theme="light"` to switch themes:

```html
<!-- Dark theme (default) -->
<body>...</body>

<!-- Light theme -->
<body class="light">...</body>

<!-- or -->
<body data-theme="light">...</body>
```

### Usage Example

```css
.my-card {
  background: var(--soft-surface);
  border: 1px solid var(--soft-border);
  border-radius: var(--radius-soft-lg);
  box-shadow: var(--shadow-soft);
  transition: all var(--transition-soft);
}

.my-card:hover {
  border-color: var(--soft-border-hover);
}

.my-button {
  background: var(--soft-accent);
  color: white;
  border-radius: var(--radius-soft);
  padding: 8px 16px;
  transition: all var(--transition-soft);
}

.my-button:hover {
  background: var(--soft-accent-hover);
}
```

## Design Tokens JSON

The `assets/tokens/design-tokens.json` file exports tokens in the W3C Design Tokens format, compatible with tools like:

- Style Dictionary
- Tokens Studio
- Figma Tokens

### Structure

```json
{
  "color": {
    "soft": {
      "indigo": {
        "500": { "value": "#6b7cf0", "type": "color" }
      }
    }
  },
  "borderRadius": {
    "soft": { "value": "12px", "type": "dimension" }
  }
}
```

### Using with Style Dictionary

Create a `config.json`:

```json
{
  "source": ["design-tokens.json"],
  "platforms": {
    "css": {
      "transformGroup": "css",
      "buildPath": "build/",
      "files": [{
        "destination": "variables.css",
        "format": "css/variables"
      }]
    },
    "scss": {
      "transformGroup": "scss",
      "buildPath": "build/",
      "files": [{
        "destination": "_variables.scss",
        "format": "scss/variables"
      }]
    }
  }
}
```

Run:
```bash
npx style-dictionary build
```

## Converting Components

### From Tailwind to CSS Modules

**Original Tailwind:**
```tsx
<div className="bg-soft-dark-200 border border-white/[0.06] rounded-soft-lg p-4">
```

**CSS Modules:**
```tsx
// SoftCard.module.css
.card {
  background: var(--soft-surface);
  border: 1px solid var(--soft-border);
  border-radius: var(--radius-soft-lg);
  padding: 1rem;
}

// SoftCard.tsx
import styles from './SoftCard.module.css';
<div className={styles.card}>
```

### From Tailwind to Styled Components

```tsx
import styled from 'styled-components';

const Card = styled.div`
  background: var(--soft-surface);
  border: 1px solid var(--soft-border);
  border-radius: var(--radius-soft-lg);
  padding: 1rem;
  transition: all var(--transition-soft);

  &:hover {
    border-color: var(--soft-border-hover);
  }
`;
```

### From Tailwind to Emotion

```tsx
import { css } from '@emotion/react';

const cardStyles = css`
  background: var(--soft-surface);
  border: 1px solid var(--soft-border);
  border-radius: var(--radius-soft-lg);
  padding: 1rem;
`;
```

## Icon Dependencies

Components that use icons have optional icon props:

| Component | Icons Used | Props |
|-----------|------------|-------|
| SoftSelect | Chevron, Check | `chevronIcon`, `checkIcon` |
| SoftSection | Chevron | `chevronIcon` |
| CompactDropdown | Chevron, Check | `chevronIcon`, `checkIcon` |
| SoftSearchInput | Search, X, Command | `searchIcon`, `clearIcon`, `commandIcon` |
| SoftTreeItem | ChevronRight, MoreHorizontal | `chevronIcon`, `moreIcon` |

### Using Without lucide-react

Components include built-in SVG icons as defaults. If you're not using lucide-react, the components work out of the box.

### Using Custom Icons

Pass your own icon components:

```tsx
import { FaChevronDown, FaCheck } from 'react-icons/fa';

<SoftSelect
  chevronIcon={<FaChevronDown size={14} />}
  checkIcon={<FaCheck size={12} />}
  {...props}
/>
```

### Icon Requirements

Custom icons should:
- Accept `size` prop (number)
- Accept `className` prop for styling
- Be SVG-based for best scaling

## Portal Components

`SoftSelect` and `CompactDropdown` use React portals for dropdown positioning.

### Requirements

- React 18+ (for `createPortal`)
- A `<body>` element to portal into

### Z-Index Convention

Portaled dropdowns use `z-index: 9999` by default. If you have higher z-index elements, adjust your CSS:

```css
.soft-dropdown-portal {
  z-index: 10000; /* Higher than your existing elements */
}
```

## Framework-Specific Notes

### Next.js

CSS variables work with Next.js App Router. Import in `app/layout.tsx`:

```tsx
import './css-variables.css';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

### Remix

Import in `app/root.tsx`:

```tsx
import styles from './css-variables.css';

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}
```

### Vue

Import in main entry:

```js
// main.js
import './css-variables.css';
```

Use variables in Vue components:

```vue
<style>
.card {
  background: var(--soft-surface);
}
</style>
```

### Svelte

Import in `+layout.svelte`:

```svelte
<script>
  import '../css-variables.css';
</script>
```

## Troubleshooting

### Variables Not Applying

1. Ensure CSS file is imported before component styles
2. Check for CSS specificity conflicts
3. Verify theme class is on correct parent element

### Dark Mode Not Working

1. Variables default to dark mode
2. Add `class="light"` to switch to light mode
3. For system preference detection:

```js
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.body.classList.toggle('light', !prefersDark);
```

### Portal Z-Index Issues

1. Check your app's z-index scale
2. Adjust portal z-index if needed
3. Ensure no `overflow: hidden` on parent containers
