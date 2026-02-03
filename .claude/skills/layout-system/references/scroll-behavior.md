# Scroll Behavior Patterns

Detailed documentation for scroll containment and overflow handling. Read this when implementing scrollable panels or debugging scroll issues.

## The Fundamental Problem

In CSS flexbox, flex children have `min-height: auto` by default, which means they won't shrink below their content height. This prevents `overflow-y: auto` from working.

## The min-h-0 Solution

### Basic Pattern

```tsx
// WRONG - content overflows, no scroll
<div className="flex flex-col h-full">
  <div className="flex-1 overflow-y-auto">
    {longContent}  {/* Overflows! */}
  </div>
</div>

// CORRECT - content scrolls
<div className="flex flex-col h-full overflow-hidden">
  <div className="flex-1 min-h-0 overflow-y-auto">
    {longContent}  {/* Scrolls properly */}
  </div>
</div>
```

### Why It Works

1. `overflow-hidden` on parent establishes scroll containment
2. `min-h-0` on child overrides `min-height: auto`
3. `flex-1` allows child to grow/shrink
4. `overflow-y-auto` enables scrolling when content overflows

## Scroll Container Template

### Standard Scrollable Panel

```tsx
interface ScrollContainerProps {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

const ScrollContainer: React.FC<ScrollContainerProps> = ({
  header,
  footer,
  children
}) => (
  <div className="flex flex-col h-full overflow-hidden">
    {/* Fixed header */}
    {header && (
      <div className="flex-shrink-0">
        {header}
      </div>
    )}

    {/* Scrollable content */}
    <div className="flex-1 min-h-0 overflow-y-auto">
      {children}
    </div>

    {/* Fixed footer */}
    {footer && (
      <div className="flex-shrink-0">
        {footer}
      </div>
    )}
  </div>
);
```

### Key Classes Explained

| Class | Purpose |
|-------|---------|
| `flex flex-col` | Vertical stacking |
| `h-full` | Fill parent height |
| `overflow-hidden` | Contain children |
| `flex-shrink-0` | Prevent header/footer from shrinking |
| `flex-1` | Scrollable area grows to fill |
| `min-h-0` | Allow shrinking below content |
| `overflow-y-auto` | Show scrollbar when needed |

## Split Scroll Panels

For sidebars with multiple scrollable regions (e.g., tree + grid):

### Pattern

```tsx
<div className="flex flex-col h-full overflow-hidden">
  {/* Search header - fixed */}
  <div className="flex-shrink-0 px-4 py-3">
    <SearchInput />
  </div>

  {/* Tree section - fixed height, scrolls */}
  <div className="h-[200px] flex-shrink-0 overflow-y-auto">
    <TreeNavigation />
  </div>

  {/* Divider */}
  <div className="flex-shrink-0 border-b" />

  {/* Grid section - fills remaining, scrolls */}
  <div className="flex-1 min-h-0 overflow-y-auto">
    <ImageGrid />
  </div>
</div>
```

### Proportional Split (50/50)

```tsx
<div className="flex flex-col h-full overflow-hidden">
  {/* Upper half */}
  <div className="flex-1 min-h-0 overflow-y-auto">
    {upperContent}
  </div>

  {/* Divider */}
  <div className="flex-shrink-0 border-b" />

  {/* Lower half */}
  <div className="flex-1 min-h-0 overflow-y-auto">
    {lowerContent}
  </div>
</div>
```

## Sticky Headers

### Within a Scroll Container

```tsx
<div className="overflow-y-auto">
  {/* Sticky section header */}
  <div className="sticky top-0 z-10 px-4 py-2">
    {/* Visual system adds background */}
    Section Title
  </div>

  {/* Scrollable content */}
  <div className="px-4">
    {content}
  </div>
</div>
```

### Multiple Sticky Sections

```tsx
<div className="overflow-y-auto">
  {sections.map(section => (
    <div key={section.id}>
      {/* Each section has sticky header */}
      <div className="sticky top-0 z-10 px-4 py-2">
        {section.title}
      </div>
      <div className="px-4">
        {section.content}
      </div>
    </div>
  ))}
</div>
```

## Scrollbar Styling

### Structure (visual system provides colors)

```tsx
// Tailwind scrollbar plugin classes (structure only)
<div className="overflow-y-auto scrollbar-thin">
  {content}
</div>
```

### Hiding Scrollbars (Use Sparingly)

```tsx
// Hide scrollbar but keep scroll functionality
<div className="overflow-y-auto scrollbar-none">
  {content}
</div>
```

## Horizontal Scroll

### Tab Bar Pattern

```tsx
<div className="flex-shrink-0 overflow-x-auto scrollbar-none">
  <div className="flex gap-2 px-4 py-2 min-w-max">
    {tabs.map(tab => (
      <button key={tab.id}>{tab.label}</button>
    ))}
  </div>
</div>
```

### Image Strip

```tsx
<div className="overflow-x-auto">
  <div className="flex gap-3 p-4">
    {images.map(img => (
      <div key={img.id} className="flex-shrink-0 w-24 h-24">
        <img src={img.src} />
      </div>
    ))}
  </div>
</div>
```

## Common Scroll Issues

### Issue: Double Scrollbars

**Cause:** Nested `overflow-auto` elements

```tsx
// WRONG
<div className="overflow-auto">
  <div className="overflow-auto">

// CORRECT - parent contains, child scrolls
<div className="overflow-hidden">
  <div className="overflow-y-auto">
```

### Issue: Scroll Not Working

**Cause:** Missing `min-h-0` on flex child

```tsx
// WRONG
<div className="flex-1 overflow-y-auto">

// CORRECT
<div className="flex-1 min-h-0 overflow-y-auto">
```

### Issue: Content Pushes Layout

**Cause:** Missing `overflow-hidden` on container

```tsx
// WRONG
<div className="flex flex-col h-full">

// CORRECT
<div className="flex flex-col h-full overflow-hidden">
```

### Issue: Scrollbar Always Visible

**Cause:** Using `overflow-scroll` instead of `overflow-auto`

```tsx
// WRONG - always shows scrollbar
className="overflow-scroll"

// CORRECT - shows only when needed
className="overflow-y-auto"
```

### Issue: Horizontal Scroll Appears Unexpectedly

**Cause:** Content wider than container

```tsx
// Add overflow-x-hidden if horizontal scroll not wanted
className="overflow-y-auto overflow-x-hidden"
```

## Testing Scroll Behavior

Always test with:
1. **Short content** - No scrollbar should appear
2. **Long content** - Scrollbar should appear, content should scroll
3. **Window resize** - Scroll behavior should adapt
4. **Different content lengths** - Layout should remain stable
