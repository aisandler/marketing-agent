# Spacing Scale

Standard spacing conventions for consistent layouts. This skill uses Tailwind's default 4px base scale.

## Base Scale Reference

| Class | Pixels | Rems | Common Use |
|-------|--------|------|------------|
| `0` | 0px | 0 | No spacing |
| `px` | 1px | 0.0625rem | Hairline borders |
| `0.5` | 2px | 0.125rem | Micro spacing |
| `1` | 4px | 0.25rem | Tight inline |
| `1.5` | 6px | 0.375rem | Compact spacing |
| `2` | 8px | 0.5rem | Default inline |
| `2.5` | 10px | 0.625rem | Slight padding |
| `3` | 12px | 0.75rem | Default padding |
| `3.5` | 14px | 0.875rem | Medium padding |
| `4` | 16px | 1rem | Standard padding |
| `5` | 20px | 1.25rem | Comfortable padding |
| `6` | 24px | 1.5rem | Section spacing |
| `8` | 32px | 2rem | Large spacing |
| `10` | 40px | 2.5rem | Extra large |
| `12` | 48px | 3rem | Hero spacing |

## Gap Patterns

Use `gap-*` for spacing between flex/grid children instead of margins.

### Horizontal Layouts (flex row)

```tsx
// Tight - inline buttons, tags
<div className="flex gap-1">

// Default - form elements, nav items
<div className="flex gap-2">

// Comfortable - card actions
<div className="flex gap-3">

// Spacious - major sections
<div className="flex gap-4">
```

### Vertical Layouts (flex col)

```tsx
// Tight - list items
<div className="flex flex-col gap-1">

// Default - form fields
<div className="flex flex-col gap-2">

// Comfortable - sections within a card
<div className="flex flex-col gap-3">

// Spacious - major sections
<div className="flex flex-col gap-4">
```

### Grid Layouts

```tsx
// Card grid - comfortable gap
<div className="grid grid-cols-4 gap-4">

// Tight thumbnail grid
<div className="grid grid-cols-6 gap-2">

// Image gallery
<div className="grid grid-cols-3 gap-3">
```

## Padding Patterns

### Section Padding Standards

| Density | Classes | Use Case |
|---------|---------|----------|
| Compact | `px-3 py-2` | Tree items, list rows, inline controls |
| Default | `px-4 py-3` | Section headers, form sections, card headers |
| Spacious | `px-5 py-4` or `p-5` | Card content, modal body |
| Large | `px-6 py-5` or `p-6` | Page headers, hero sections |

### Component Padding

```tsx
// Tree item
<div className="px-3 py-2">

// Section header
<div className="px-4 py-3">

// Card content
<div className="p-5">

// Modal content
<div className="p-6">
```

### Asymmetric Padding

```tsx
// More horizontal than vertical (buttons)
<button className="px-4 py-2">

// More vertical than horizontal (list items)
<div className="px-3 py-4">

// Panel with side padding only
<div className="px-4">
```

## Margin Patterns

Prefer `gap-*` over margins when possible. Use margins for:

### Negative Space

```tsx
// Section separation
<div className="mt-6">

// After dividers
<div className="mt-4">
```

### Centering

```tsx
// Horizontal centering
<div className="mx-auto max-w-4xl">
```

## Panel Spacing

### Sidebar Panels

```tsx
<div className="flex flex-col h-full">
  {/* Header - standard padding */}
  <div className="flex-shrink-0 px-4 py-3 border-b">
    <Header />
  </div>

  {/* Content - may have its own padding */}
  <div className="flex-1 min-h-0 overflow-y-auto">
    {/* Individual items handle their own padding */}
    {items.map(item => (
      <div key={item.id} className="px-3 py-2">
        {item.label}
      </div>
    ))}
  </div>

  {/* Footer - standard padding */}
  <div className="flex-shrink-0 px-4 py-3 border-t">
    <Footer />
  </div>
</div>
```

### Cards

```tsx
<div className="rounded-lg">
  {/* Card header - with border */}
  <div className="px-4 py-3 border-b">
    <h3>Title</h3>
  </div>

  {/* Card body - comfortable padding */}
  <div className="p-5">
    {content}
  </div>

  {/* Card footer - with border */}
  <div className="px-4 py-3 border-t">
    <Actions />
  </div>
</div>
```

## Consistent Spacing Rules

### Rule 1: Use gap for sibling spacing

```tsx
// GOOD
<div className="flex gap-2">
  <Button />
  <Button />
</div>

// AVOID
<div className="flex">
  <Button className="mr-2" />
  <Button />
</div>
```

### Rule 2: Padding on containers, not children

```tsx
// GOOD
<div className="p-4">
  <Child />
  <Child />
</div>

// AVOID
<div>
  <Child className="m-4" />
  <Child className="m-4" />
</div>
```

### Rule 3: Consistent density per area

```tsx
// GOOD - entire sidebar uses compact density
<Sidebar className="[&_*]:px-3 [&_*]:py-2">

// AVOID - mixing densities randomly
<Sidebar>
  <Item className="px-3 py-2" />
  <Item className="px-5 py-4" />
  <Item className="px-2 py-1" />
</Sidebar>
```

### Rule 4: Border placement affects padding

When using borders, account for visual balance:

```tsx
// With bottom border - reduce bottom padding
<div className="px-4 pt-3 pb-2 border-b">

// Or use symmetric padding
<div className="px-4 py-3 border-b">
```

## Fixed Spacing Values

Some layouts use fixed pixel values:

### Tree Indentation

```tsx
// Base padding + (depth * indent)
const paddingLeft = 12 + (depth * 16);
```

### Icon Alignment

```tsx
// Icon size + gap
<div className="flex items-center gap-2">
  <Icon size={16} />
  <span>Label</span>
</div>
```

### Sidebar Widths

```tsx
// Fixed panel widths (not spacing, but related)
const LEFT_SIDEBAR_WIDTH = 280;
const RIGHT_SIDEBAR_WIDTH = 360;
```
