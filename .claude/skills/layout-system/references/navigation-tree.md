# Navigation Tree Patterns

Consistent rules for tree-based navigation components. Read this when implementing hierarchical navigation or ensuring tree consistency across the application.

## Core Principles

1. **Consistent indentation** - Same formula across all trees
2. **Predictable interactions** - Click, double-click, keyboard work the same
3. **Visual alignment** - Icons, labels, badges align across depth levels
4. **Accessible** - Proper ARIA attributes and keyboard navigation

## Indentation Formula

### The Standard

```tsx
const paddingLeft = depth * 16 + 12; // in pixels

// Results:
// depth 0: 12px  (root items)
// depth 1: 28px  (first children)
// depth 2: 44px  (grandchildren)
// depth 3: 60px  (great-grandchildren)
```

### Implementation

```tsx
<div
  style={{ paddingLeft: `${depth * 16 + 12}px` }}
  className="flex items-center gap-2 pr-3 py-2"
>
  {/* Content */}
</div>
```

### Why This Formula?

- **12px base**: Aligns root items with panel padding (`px-3`)
- **16px increment**: One rem, divisible, readable hierarchy
- **Practical limit**: 4 levels before horizontal scroll risk

## Tree Item Structure

### Standard Layout

```
[padding][chevron][icon][label.............][badge][actions]
         18px     16px   flex-1              auto   hover
```

### Implementation

```tsx
interface TreeItemProps {
  id: string;
  label: string;
  depth: number;
  hasChildren: boolean;
  isExpanded: boolean;
  isSelected: boolean;
  count?: number;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
}

const TreeItem: React.FC<TreeItemProps> = ({
  id,
  label,
  depth,
  hasChildren,
  isExpanded,
  isSelected,
  count,
  onSelect,
  onToggle
}) => {
  const paddingLeft = depth * 16 + 12;

  return (
    <div
      role="treeitem"
      aria-selected={isSelected}
      aria-expanded={hasChildren ? isExpanded : undefined}
      tabIndex={0}
      onClick={() => onSelect(id)}
      onDoubleClick={() => hasChildren && onToggle(id)}
      style={{ paddingLeft: `${paddingLeft}px` }}
      className="flex items-center gap-2 pr-3 py-2 cursor-pointer"
    >
      {/* Expand/Collapse Chevron */}
      {hasChildren ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(id);
          }}
          className={`p-0.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
        >
          <ChevronRight size={14} />
        </button>
      ) : (
        <span className="w-[18px]" /> {/* Alignment spacer */}
      )}

      {/* Icon */}
      <Icon size={16} className="flex-shrink-0" />

      {/* Label */}
      <span className="text-xs font-medium truncate flex-1">
        {label}
      </span>

      {/* Count Badge (optional) */}
      {count !== undefined && count > 0 && (
        <span className="text-[10px] px-1.5 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </div>
  );
};
```

## Interaction Patterns

### Click Behaviors

| Action | Behavior | Handler |
|--------|----------|---------|
| Single click | Select item | `onSelect(id)` |
| Double click | Toggle expand (if has children) | `onToggle(id)` |
| Chevron click | Toggle expand only (no select) | `onToggle(id)` with `stopPropagation` |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `ArrowDown` | Move to next visible item |
| `ArrowUp` | Move to previous visible item |
| `ArrowRight` | Expand (if collapsed) or move to first child |
| `ArrowLeft` | Collapse (if expanded) or move to parent |
| `Enter` | Select focused item |
| `Space` | Toggle expand/collapse |
| `Home` | Move to first item |
| `End` | Move to last visible item |

### Keyboard Implementation

```tsx
const handleKeyDown = (e: React.KeyboardEvent, item: TreeNode) => {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      focusNextItem();
      break;
    case 'ArrowUp':
      e.preventDefault();
      focusPreviousItem();
      break;
    case 'ArrowRight':
      e.preventDefault();
      if (item.hasChildren && !item.isExpanded) {
        onToggle(item.id);
      } else if (item.hasChildren && item.isExpanded) {
        focusFirstChild(item.id);
      }
      break;
    case 'ArrowLeft':
      e.preventDefault();
      if (item.hasChildren && item.isExpanded) {
        onToggle(item.id);
      } else {
        focusParent(item.id);
      }
      break;
    case 'Enter':
      onSelect(item.id);
      break;
    case ' ':
      e.preventDefault();
      if (item.hasChildren) {
        onToggle(item.id);
      }
      break;
  }
};
```

## Visual States

### State Classes (structure only)

```tsx
// Base item
"flex items-center gap-2 pr-3 py-2 cursor-pointer transition-all"

// Selected state (visual system adds colors)
"/* selected styles */"

// Hover state (visual system adds colors)
"/* hover styles */"

// Drag over state
"scale-[1.01]"

// Disabled state
"opacity-50 cursor-not-allowed"
```

## Expand/Collapse Animation

### Chevron Rotation

```tsx
<button
  className={`
    p-0.5
    transition-transform duration-200
    ${isExpanded ? 'rotate-90' : ''}
  `}
>
  <ChevronRight size={14} />
</button>
```

### Children Animation

```tsx
{hasChildren && isExpanded && (
  <div
    role="group"
    className="animate-in fade-in slide-in-from-top-1 duration-200"
  >
    {children}
  </div>
)}
```

## Count Badge Positioning

Badges appear after the label, before actions:

```tsx
<span className="flex items-center gap-2 flex-1 min-w-0">
  <span className="truncate">{label}</span>
  {count > 0 && (
    <span className="flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded-full">
      {count}
    </span>
  )}
</span>
```

## Context Menu / Actions

Actions appear on hover:

```tsx
const [showActions, setShowActions] = useState(false);

<div
  onMouseEnter={() => setShowActions(true)}
  onMouseLeave={() => setShowActions(false)}
>
  {/* ... item content ... */}

  <button
    onClick={(e) => {
      e.stopPropagation();
      openContextMenu(e, id);
    }}
    className={`
      p-1 rounded
      transition-opacity duration-150
      ${showActions || isSelected ? 'opacity-100' : 'opacity-0'}
    `}
  >
    <MoreHorizontal size={12} />
  </button>
</div>
```

## Drag and Drop

### Drop Target Feedback

```tsx
const [isDragOver, setIsDragOver] = useState(false);

<div
  onDragOver={(e) => {
    e.preventDefault();
    setIsDragOver(true);
  }}
  onDragLeave={() => setIsDragOver(false)}
  onDrop={(e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleDrop(e, id);
  }}
  className={isDragOver ? 'scale-[1.01]' : ''}
>
```

## ARIA Attributes

### Required Attributes

```tsx
<div role="tree">
  <div
    role="treeitem"
    aria-selected={isSelected}
    aria-expanded={hasChildren ? isExpanded : undefined}
    aria-level={depth + 1}
    aria-setsize={siblingCount}
    aria-posinset={positionInSet}
    tabIndex={isFocused ? 0 : -1}
  >
    {/* Item content */}

    {hasChildren && isExpanded && (
      <div role="group">
        {/* Children */}
      </div>
    )}
  </div>
</div>
```

## Consistency Checklist

When implementing tree navigation:

- [ ] Uses `depth * 16 + 12` indentation formula
- [ ] Chevron rotates 90° when expanded
- [ ] Single click selects, double click expands
- [ ] Chevron click only toggles (doesn't select)
- [ ] Keyboard navigation works (arrows, enter, space)
- [ ] Count badges align vertically across items
- [ ] Actions appear on hover, stay visible when selected
- [ ] Drag/drop has visual feedback
- [ ] ARIA attributes are present
- [ ] Animation timing is consistent (200ms default)
