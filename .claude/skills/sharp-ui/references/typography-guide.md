# Sharp UI Typography Guide

Typography in Sharp UI follows a strict system designed for technical interfaces. This guide covers font weights, text transforms, and spacing.

## Font Stack

Sharp UI works with any sans-serif font but recommends system fonts for performance:

```css
/* Default stack */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Optional monospace for technical aesthetic */
font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
```

### Recommended Fonts

**Sans-serif options:**
- Inter (geometric, clean)
- IBM Plex Sans (industrial feel)
- Space Grotesk (technical, modern)
- Archivo (strong, reliable)

**Monospace options:**
- JetBrains Mono (excellent readability)
- Fira Code (ligatures support)
- IBM Plex Mono (industrial)
- Space Mono (pairs with Space Grotesk)

## Type Scale

Sharp UI uses a compact type scale appropriate for dense interfaces:

| Token | Size | Usage |
|-------|------|-------|
| xs | 10px | Smallest labels, badges |
| sm | 11px | Secondary labels, hints |
| base | 12px | Default body text |
| md | 13px | Emphasized body |
| lg | 14px | Section headers |
| xl | 16px | Major headings |
| 2xl | 20px | Page titles |

## Label Treatment

Labels are the cornerstone of Sharp UI typography. All labels follow this pattern:

```css
.sharp-label {
  font-size: 10px;
  font-weight: 600;           /* Semi-bold */
  text-transform: uppercase;
  letter-spacing: 0.05em;     /* Wide tracking */
  color: #888888;             /* Muted color */
}
```

### Tailwind Classes

```html
<label class="text-[10px] font-semibold uppercase tracking-wide text-sharp-text-muted">
  FIELD LABEL
</label>
```

### When to Use Uppercase

**Always uppercase:**
- Form field labels
- Tab labels
- Button text
- Badge text
- Section headers (optional)
- Navigation items

**Never uppercase:**
- Body text / paragraphs
- Long-form content
- Error messages (beyond first word)
- User-generated content

## Font Weights

Sharp UI uses bold weights for emphasis:

| Weight | Value | Usage |
|--------|-------|-------|
| normal | 400 | Body text, descriptions |
| medium | 500 | Emphasized body, selected items |
| semibold | 600 | Labels, buttons |
| bold | 700 | Headings, strong emphasis |

### Examples

```html
<!-- Label -->
<span class="font-semibold uppercase tracking-wide">CONFIG</span>

<!-- Button -->
<button class="font-semibold uppercase tracking-wide">EXECUTE</button>

<!-- Heading -->
<h2 class="font-bold tracking-tight">System Settings</h2>

<!-- Body -->
<p class="font-normal">Configure your application settings below.</p>
```

## Letter Spacing

Strategic letter spacing reinforces the Sharp UI aesthetic:

| Token | Value | Usage |
|-------|-------|-------|
| tracking-tight | -0.01em | Large headings (16px+) |
| tracking-normal | 0 | Body text |
| tracking-wide | 0.05em | Labels, buttons |
| tracking-wider | 0.1em | Extra emphasis (rare) |

### Rules

1. **Uppercase text always gets wide tracking** - improves readability
2. **Large headings get tight tracking** - feels more impactful
3. **Body text uses normal tracking** - best for reading

## Heading Hierarchy

```html
<!-- Page title -->
<h1 class="text-xl font-bold tracking-tight text-sharp-text">
  Dashboard
</h1>

<!-- Section header -->
<h2 class="text-lg font-bold tracking-tight text-sharp-text">
  Active Sessions
</h2>

<!-- Subsection - can be uppercase -->
<h3 class="text-xs font-semibold uppercase tracking-wide text-sharp-text-muted">
  RECENT ACTIVITY
</h3>

<!-- Card header -->
<h4 class="text-sm font-semibold text-sharp-text">
  User Details
</h4>
```

## Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| sharp-text | #ffffff | Primary text, headings |
| sharp-text-muted | #888888 | Secondary text, labels |
| sharp-accent | #00ff88 | Links, emphasis, active states |
| sharp-accent-alt | #ff3366 | Errors, destructive actions |
| sharp-warning | #ffcc00 | Warnings, cautions |

## Monospace Usage

Monospace fonts are optional but recommended for:

- Code snippets
- API keys and tokens
- Technical values (IDs, hashes)
- Terminal-style output
- Data tables with aligned values

```html
<!-- Code value -->
<code class="font-mono text-sharp-accent bg-sharp-surface px-1.5 py-0.5">
  sk_live_abc123
</code>

<!-- Terminal output -->
<pre class="font-mono text-sm text-sharp-text bg-sharp-bg p-4 border-2 border-sharp-border">
$ npm run build
> Building production bundle...
> Done in 3.2s
</pre>
```

## Responsive Typography

Sharp UI maintains readability across screen sizes:

```css
/* Mobile (default) */
.sharp-heading { font-size: 16px; }
.sharp-body { font-size: 12px; }
.sharp-label { font-size: 10px; }

/* Tablet and up */
@media (min-width: 768px) {
  .sharp-heading { font-size: 20px; }
  .sharp-body { font-size: 13px; }
  .sharp-label { font-size: 10px; } /* Labels stay small */
}
```

## Common Patterns

### Form Field

```html
<div class="space-y-2">
  <label class="text-[10px] font-semibold uppercase tracking-wide text-sharp-text-muted block">
    API KEY
  </label>
  <input
    type="text"
    class="w-full bg-sharp-bg border-2 border-sharp-border text-sharp-text font-mono p-3"
    placeholder="sk_live_..."
  />
</div>
```

### Status with Badge

```html
<div class="flex items-center gap-2">
  <span class="text-[10px] font-bold uppercase tracking-wide px-2 py-1 border-2 border-sharp-accent text-sharp-accent">
    ACTIVE
  </span>
  <span class="text-sm text-sharp-text">Production Server</span>
</div>
```

### Section Header with Divider

```html
<div class="space-y-3">
  <h3 class="text-xs font-semibold uppercase tracking-wide text-sharp-text-muted">
    CONFIGURATION
  </h3>
  <hr class="h-0.5 bg-sharp-border border-none" />
</div>
```

## Anti-Patterns

**NEVER:**
- Use thin font weights (300 or below)
- Mix uppercase and sentence case labels
- Use decorative fonts
- Apply drop shadows to text
- Use colored backgrounds behind text
- Center-align form labels

**ALWAYS:**
- Maintain consistent weight hierarchy
- Apply wide tracking to uppercase text
- Use the approved color palette
- Keep label sizes small (10-11px)
- Left-align text (except for centered buttons)
