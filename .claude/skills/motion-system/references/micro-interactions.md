# Micro-Interactions

Patterns for hover, click, focus, and other small interactive feedback. Read this when adding subtle motion to UI elements.

## Purpose of Micro-Interactions

1. **Feedback**: Confirm user action was received
2. **State**: Show current element state
3. **Affordance**: Indicate element is interactive
4. **Delight**: Add polish and personality

## Hover States

### Color Change (Most Common)

```tsx
// Background color change
<button className="transition-colors duration-150 hover:bg-slate-700">

// Text color change
<a className="transition-colors duration-150 hover:text-indigo-400">

// Border color change
<div className="transition-colors duration-150 hover:border-indigo-500">
```

### Scale

```tsx
// Subtle scale up (cards, images)
<div className="transition-transform duration-150 hover:scale-105">

// Very subtle (icons, small elements)
<div className="transition-transform duration-150 hover:scale-110">
```

### Shadow/Glow

```tsx
// Elevation increase
<div className="transition-shadow duration-200 hover:shadow-lg">

// Glow effect
<div className="transition-shadow duration-200 hover:shadow-[0_0_20px_rgba(107,124,240,0.3)]">
```

## Active/Press States

### Scale Down

```tsx
// Button press effect
<button className="transition-transform duration-100 active:scale-95">

// Subtle press
<button className="transition-transform duration-100 active:scale-[0.98]">
```

## Focus States

### Ring Pattern

```tsx
// Focus ring (accessibility standard)
<input className="
  transition-shadow duration-200
  focus:outline-none
  focus:ring-2 focus:ring-indigo-500/50
"/>
```

## Expand/Collapse

### Chevron Rotation

```tsx
<ChevronRight className={`
  transition-transform duration-200
  ${isOpen ? 'rotate-90' : ''}
`} />
```

### Content Reveal

```tsx
<div className={`
  overflow-hidden transition-all duration-200 ease-out
  ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
`}>
  {content}
</div>
```

## Timing Summary

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Hover color | 150ms | ease-out |
| Hover scale | 150ms | ease-out |
| Active press | 100ms | ease-out |
| Focus ring | 200ms | ease-out |
| Toggle | 300ms | ease-out |
| Expand/collapse | 200ms | ease-out |
