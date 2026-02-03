---
name: layout-system
description: Design-system agnostic layout patterns for panel-based interfaces. Use when building dashboards, workspaces, multi-panel UIs, or navigation trees. Use when user asks "how do I make a scrollable panel", "three column layout", "sidebar won't scroll", or "min-h-0 pattern". Provides composition rules for three-panel and single-panel layouts, scroll containment, spacing scales, and responsive breakpoints. Pairs with any visual design system (soft-ui, sharp-ui, etc.) - this skill handles structure, your visual system handles styling.
license: MIT - See LICENSE.txt
tags:
  - frontend
  - layout
  - ui-core
archetype: toolkit
---

# Layout System

A design-system agnostic skill for structural layout patterns. This skill handles WHERE things go; pair it with a visual system (soft-ui-system, etc.) for HOW they look.

## Layout Philosophy

### Design Principles

1. **Structure vs Styling Separation**
   - Layout patterns define widths, flex behavior, scroll containment
   - Visual systems add colors, shadows, borders, typography
   - This separation allows swapping visual systems without changing layout

2. **Composition Over Nesting**
   - Keep DOM hierarchy flat when possible
   - Each panel manages its own scroll context
   - Avoid deeply nested flex containers

3. **Fixed + Flexible Pattern**
   - Sidebars use fixed widths (`w-[280px]`, `w-[360px]`)
   - Main content uses flexible width (`flex-1 min-w-0`)
   - This prevents layout shifts and provides predictable behavior

4. **Scroll Containment**
   - Each panel is an isolated scroll context
   - Parent uses `overflow-hidden`, child uses `overflow-y-auto`
   - The `min-h-0` trick enables flex children to scroll

## Panel Composition

### ThreePanelLayout (Primary)

The standard layout for workspace applications:

```
+---------------+-------------------+---------------+
|   LEFT        |   CENTER          |   RIGHT       |
|   SIDEBAR     |   (main content)  |   SIDEBAR     |
|   280px       |   flex-1          |   360px       |
|   fixed       |   grows           |   optional    |
+---------------+-------------------+---------------+
```

**Structure (no colors):**
```tsx
<div className="flex h-full overflow-hidden">
  {/* Left Sidebar - Fixed 280px */}
  <div className="w-[280px] flex-shrink-0 flex flex-col overflow-hidden">
    {leftSidebar}
  </div>

  {/* Center Content - Flexible */}
  <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
    {children}
  </div>

  {/* Right Sidebar - Fixed 360px (optional) */}
  {rightSidebar && (
    <div className="w-[360px] flex-shrink-0 flex flex-col overflow-hidden">
      {rightSidebar}
    </div>
  )}
</div>
```

**Key classes:**
- `flex-shrink-0`: Prevents sidebars from shrinking
- `min-w-0`: Allows center to shrink below content width
- `overflow-hidden`: Contains scroll within each panel

**Full reference:** See `references/panel-patterns.md`

### OnePanelLayout (Alternative)

For simpler views with optional detail panel:

```
+-----------------------------------+---------------+
|   MAIN CONTENT                    |   RIGHT       |
|   (full width)                    |   SIDEBAR     |
|   flex-1                          |   320px       |
+-----------------------------------+---------------+
```

**Structure:**
```tsx
<div className="flex h-full overflow-hidden">
  <div className="flex-1 h-full overflow-hidden">
    {children}
  </div>
  {rightSidebar && (
    <div className="w-80 h-full overflow-hidden flex-shrink-0">
      {rightSidebar}
    </div>
  )}
</div>
```

### Mode-Based Content Switching

When a single route serves multiple modes (Studio, Library, Intelligence):

```tsx
// Pattern: Query parameter drives content
const { mode } = useSearchParams(); // 'studio' | 'library' | 'intelligence'

return (
  <ThreePanelLayout
    leftSidebar={<Sidebar mode={mode} />}
    rightSidebar={mode === 'library' ? <DetailsPanel /> : null}
  >
    {mode === 'studio' && <StudioMode />}
    {mode === 'library' && <LibraryMode />}
    {mode === 'intelligence' && <IntelligenceMode />}
  </ThreePanelLayout>
);
```

## Scroll & Overflow Rules

### The min-h-0 Pattern

**Problem:** Flex children cannot scroll when parent has unbounded height.

**Solution:** Add `min-h-0` to flex children that need to scroll.

```tsx
// WRONG - child cannot scroll
<div className="flex flex-col h-full">
  <div className="flex-1 overflow-y-auto">  {/* Won't scroll! */}
    {longContent}
  </div>
</div>

// CORRECT - child scrolls properly
<div className="flex flex-col h-full overflow-hidden">
  <div className="flex-1 min-h-0 overflow-y-auto">  {/* Scrolls! */}
    {longContent}
  </div>
</div>
```

**Why it works:** `min-h-0` overrides the default `min-height: auto` which prevents flex items from shrinking below their content.

### Nested Scroll Containment

For panels with multiple scrollable regions:

```tsx
<div className="flex flex-col h-full overflow-hidden">
  {/* Fixed header */}
  <div className="flex-shrink-0 px-4 py-3">
    <Header />
  </div>

  {/* Upper scroll region (fixed height) */}
  <div className="h-[200px] flex-shrink-0 overflow-y-auto">
    <TreeNavigation />
  </div>

  {/* Lower scroll region (fills remaining) */}
  <div className="flex-1 min-h-0 overflow-y-auto">
    <ImageGrid />
  </div>
</div>
```

### Sticky Headers Within Scroll

```tsx
<div className="overflow-y-auto">
  <div className="sticky top-0 z-10 px-4 py-2">
    {/* Add background via visual system */}
    Section Header
  </div>
  <div className="px-4">
    {content}
  </div>
</div>
```

**Full reference:** See `references/scroll-behavior.md`

## Spacing System

### Base Scale (4px)

Use Tailwind's default 4px base scale:

| Class | Size | Common Use |
|-------|------|------------|
| `gap-1` | 4px | Tight inline elements |
| `gap-2` | 8px | Related items, form fields |
| `gap-3` | 12px | List items, cards in grid |
| `gap-4` | 16px | Section separation |
| `gap-6` | 24px | Major section breaks |

### Section Padding Standards

| Density | Classes | Use Case |
|---------|---------|----------|
| Compact | `px-3 py-2` | Tree items, list rows |
| Default | `px-4 py-3` | Section headers, form sections |
| Spacious | `px-5 py-4` | Cards, modal content |
| Large | `px-6 py-5` | Page headers, hero sections |

### Panel Borders

Panels are separated by borders (visual system provides color):

```tsx
// Structure only - no color classes
<div className="border-r">  {/* Left sidebar right border */}
<div className="border-l">  {/* Right sidebar left border */}
<div className="border-b">  {/* Section divider */}
```

**Full reference:** See `references/spacing-scale.md`

## Responsive Breakpoints

### Breakpoint Definitions

| Name | Width | Behavior |
|------|-------|----------|
| Mobile | < 768px | Stack panels, hide sidebars |
| Tablet | 768px - 1024px | Collapse right sidebar to drawer |
| Desktop | > 1024px | Full three-panel layout |

### Panel Hiding Pattern

```tsx
// Hide left sidebar on mobile
<div className="hidden md:flex w-[280px] flex-shrink-0">
  {leftSidebar}
</div>

// Show mobile menu trigger
<button className="md:hidden">
  <MenuIcon />
</button>
```

### Responsive Grid Within Panels

```tsx
// Card grid that adapts to container width
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {cards.map(card => <Card key={card.id} {...card} />)}
</div>
```

**Full reference:** See `references/responsive-patterns.md`

## Navigation Tree Mechanics

### Indentation Formula

Tree items use a consistent indentation formula:

```tsx
const paddingLeft = depth * 16 + 12; // in pixels
// depth 0: 12px
// depth 1: 28px
// depth 2: 44px
// depth 3: 60px
```

### Tree Item Structure

```tsx
<div
  role="treeitem"
  aria-selected={isSelected}
  aria-expanded={hasChildren ? isExpanded : undefined}
  style={{ paddingLeft: `${depth * 16 + 12}px` }}
  className="flex items-center gap-2 pr-3 py-2"
>
  {/* Expand/Collapse Chevron */}
  {hasChildren ? (
    <button className="p-0.5">
      <ChevronRight className={isExpanded ? 'rotate-90' : ''} />
    </button>
  ) : (
    <span className="w-[18px]" /> {/* Spacer for alignment */}
  )}

  {/* Icon */}
  <Icon size={16} />

  {/* Label */}
  <span className="text-xs font-medium truncate flex-1">
    {label}
  </span>

  {/* Count Badge (optional) */}
  {count > 0 && (
    <span className="text-[10px] px-1.5 py-0.5 rounded-full">
      {count}
    </span>
  )}
</div>
```

### Consistent Behaviors

Trees should behave consistently across the application:

1. **Click**: Selects the item
2. **Double-click**: Expands/collapses if has children
3. **Chevron click**: Expands/collapses (doesn't select)
4. **Keyboard**: Arrow keys navigate, Enter selects, Space toggles
5. **Drag/drop**: Visual feedback on valid drop targets

**Full reference:** See `references/navigation-tree.md`

## Pairing with Visual Skills

This skill provides **structure**. Pair with any visual design skill for **styling**.

Visual skills control: colors, shadows, borders, surface effects, typography
Layout-system controls: panel widths, scroll containment, flex behavior, spacing

### Layering Pattern

1. Apply layout structure first (this skill)
2. Add visual styling second (your visual skill)

```tsx
// Layout structure (from layout-system)
<div className="flex h-full overflow-hidden">
  <div className="w-[280px] flex-shrink-0 overflow-hidden">
    {sidebar}
  </div>
  <div className="flex-1 min-w-0 overflow-y-auto">
    {content}
  </div>
</div>

// + Visual styling (from your visual skill)
<div className="flex h-full overflow-hidden">
  <div className="w-[280px] flex-shrink-0 overflow-hidden border-r border-[skill]-border bg-[skill]-dark-100">
    {sidebar}
  </div>
  <div className="flex-1 min-w-0 overflow-y-auto bg-[skill]-dark-200">
    {content}
  </div>
</div>
```

To load a visual skill: `/skill [visual-skill-name]`

### What Each Skill Provides

| layout-system | Your visual skill |
|--------------|-------------------|
| Panel widths (`w-[280px]`) | Background colors |
| Flex patterns (`flex-1 min-w-0`) | Border colors |
| Scroll behavior (`overflow-y-auto`) | Scrollbar styling |
| Spacing scale (`gap-4, px-4 py-3`) | Shadow tokens |
| Responsive breakpoints | Theme tokens (dark/light) |
| Tree indentation formula | Tree item styling (icons, colors) |

## Anti-Patterns

### NEVER:

1. **Missing min-h-0 on flex children**
   ```tsx
   // WRONG
   <div className="flex-1 overflow-y-auto">

   // CORRECT
   <div className="flex-1 min-h-0 overflow-y-auto">
   ```

2. **Nested overflow-auto without containment**
   ```tsx
   // WRONG - double scrollbars
   <div className="overflow-auto">
     <div className="overflow-auto">

   // CORRECT - parent contains, child scrolls
   <div className="overflow-hidden">
     <div className="overflow-y-auto">
   ```

3. **Using overflow: scroll instead of auto**
   ```tsx
   // WRONG - always shows scrollbar
   overflow: scroll

   // CORRECT - shows only when needed
   overflow-y-auto
   ```

4. **Mixing fixed and percentage widths incorrectly**
   ```tsx
   // WRONG - unpredictable
   <div className="w-[280px]">
   <div className="w-1/2">

   // CORRECT - fixed + flexible
   <div className="w-[280px] flex-shrink-0">
   <div className="flex-1 min-w-0">
   ```

5. **Missing flex-shrink-0 on fixed elements**
   ```tsx
   // WRONG - header may shrink
   <div className="h-16">Header</div>

   // CORRECT - header stays fixed
   <div className="h-16 flex-shrink-0">Header</div>
   ```

6. **Using height: 100% in flex contexts**
   ```tsx
   // WRONG - may not work in flex
   <div className="h-full">

   // CORRECT - explicit flex containment
   <div className="flex-1 min-h-0">
   ```

### ALWAYS:

1. Add `overflow-hidden` to panel containers
2. Add `min-h-0` to flex children that scroll
3. Add `flex-shrink-0` to fixed-size elements (headers, footers, sidebars)
4. Add `min-w-0` to flexible-width elements that might overflow
5. Use `gap-*` for spacing instead of margins on children
6. Test scroll behavior with long content

## File Reference

| File | Purpose |
|------|---------|
| `references/panel-patterns.md` | Detailed panel composition |
| `references/scroll-behavior.md` | Scroll containment patterns |
| `references/spacing-scale.md` | Spacing conventions |
| `references/responsive-patterns.md` | Breakpoints and mobile |
| `references/navigation-tree.md` | Tree consistency rules |
| `assets/layouts/ThreePanelLayout.tsx` | Three-panel template |
| `assets/layouts/OnePanelLayout.tsx` | Single-panel template |
| `assets/patterns/ScrollContainer.tsx` | Scroll containment template |
| `assets/patterns/SplitScrollPanel.tsx` | Dual scroll area template |
