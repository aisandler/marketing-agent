# Responsive Patterns

Breakpoint definitions and responsive layout strategies. Read this when implementing mobile/tablet adaptations or panel collapsing behavior.

## Breakpoint Definitions

### Standard Breakpoints

| Name | Tailwind | Width | Description |
|------|----------|-------|-------------|
| Mobile | `sm` | < 640px | Single column, no sidebars |
| Mobile Large | `md` | 640px - 768px | Single column, optional drawer |
| Tablet | `lg` | 768px - 1024px | Two columns, collapsed right |
| Desktop | `xl` | 1024px - 1280px | Full three-panel layout |
| Wide | `2xl` | > 1280px | Three-panel with extra space |

### Application to Layouts

```
Mobile (< 768px):      Tablet (768-1024px):     Desktop (> 1024px):
+---------------+      +--------+---------+     +-----+-------+-----+
|               |      | LEFT   | CENTER  |     |LEFT |CENTER |RIGHT|
|    CENTER     |      | 240px  | flex-1  |     |280px|flex-1 |360px|
|  (full width) |      |        |         |     |     |       |     |
+---------------+      +--------+---------+     +-----+-------+-----+
```

## Panel Visibility Patterns

### Hide Left Sidebar on Mobile

```tsx
<div className="flex h-full overflow-hidden">
  {/* Hidden on mobile, visible on tablet+ */}
  <div className="hidden md:flex w-[280px] flex-shrink-0 flex-col overflow-hidden">
    {leftSidebar}
  </div>

  {/* Full width on mobile, flexible on desktop */}
  <div className="flex-1 min-w-0 overflow-hidden">
    {children}
  </div>
</div>
```

### Hide Right Sidebar on Tablet

```tsx
{/* Hidden on mobile/tablet, visible on desktop */}
{rightSidebar && (
  <div className="hidden lg:flex w-[360px] flex-shrink-0 flex-col overflow-hidden">
    {rightSidebar}
  </div>
)}
```

### Full Responsive Layout

```tsx
const ResponsiveLayout: React.FC<Props> = ({
  leftSidebar,
  rightSidebar,
  children
}) => (
  <div className="flex h-full overflow-hidden">
    {/* Left: hidden mobile, 240px tablet, 280px desktop */}
    <div className="
      hidden md:flex
      md:w-60 lg:w-[280px]
      flex-shrink-0 flex-col overflow-hidden
    ">
      {leftSidebar}
    </div>

    {/* Center: always visible, grows */}
    <div className="flex-1 min-w-0 overflow-hidden">
      {children}
    </div>

    {/* Right: hidden until desktop */}
    {rightSidebar && (
      <div className="
        hidden lg:flex
        w-80 lg:w-[360px]
        flex-shrink-0 flex-col overflow-hidden
      ">
        {rightSidebar}
      </div>
    )}
  </div>
);
```

## Mobile Menu Pattern

### Hamburger Trigger

```tsx
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

<>
  {/* Mobile menu button - only on mobile */}
  <button
    className="md:hidden p-2"
    onClick={() => setIsMobileMenuOpen(true)}
  >
    <MenuIcon size={24} />
  </button>

  {/* Desktop sidebar - hidden on mobile */}
  <div className="hidden md:flex w-[280px]">
    <Sidebar />
  </div>

  {/* Mobile drawer */}
  {isMobileMenuOpen && (
    <MobileDrawer onClose={() => setIsMobileMenuOpen(false)}>
      <Sidebar />
    </MobileDrawer>
  )}
</>
```

### Slide-in Drawer

```tsx
interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  children
}) => (
  <>
    {/* Backdrop */}
    <div
      className={`
        fixed inset-0 z-40 transition-opacity
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
      onClick={onClose}
    />

    {/* Drawer */}
    <div
      className={`
        fixed inset-y-0 left-0 z-50 w-[280px]
        transform transition-transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {children}
    </div>
  </>
);
```

## Responsive Grids

### Card Grids

```tsx
// 1 column mobile → 2 tablet → 4 desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {cards.map(card => <Card key={card.id} {...card} />)}
</div>

// Image grid: tighter on mobile
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
  {images.map(img => <Thumbnail key={img.id} {...img} />)}
</div>
```

### Dashboard Grids

```tsx
// Stats row: stack on mobile
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard title="Users" value={1234} />
  <StatCard title="Revenue" value="$5,678" />
  <StatCard title="Orders" value={89} />
  <StatCard title="Growth" value="+12%" />
</div>
```

## Responsive Spacing

### Padding Adjustments

```tsx
// Less padding on mobile
<div className="p-4 md:p-6 lg:p-8">

// Tighter gaps on mobile
<div className="gap-2 md:gap-4 lg:gap-6">
```

### Max Width Containers

```tsx
// Centered container with responsive max-width
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {content}
</div>
```

## Responsive Typography

### Heading Sizes

```tsx
// Smaller on mobile, larger on desktop
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Page Title
</h1>

// Body text adjustments
<p className="text-sm md:text-base">
  Content
</p>
```

## Collapsible Sidebar Pattern

For sidebars that collapse to icons rather than fully hide:

```tsx
const [isCollapsed, setIsCollapsed] = useState(false);

<div
  className={`
    flex-shrink-0 flex flex-col overflow-hidden
    transition-all duration-300
    ${isCollapsed ? 'w-16' : 'w-[280px]'}
  `}
>
  {/* Toggle button */}
  <button onClick={() => setIsCollapsed(!isCollapsed)}>
    {isCollapsed ? <ExpandIcon /> : <CollapseIcon />}
  </button>

  {/* Sidebar content */}
  {isCollapsed ? (
    <IconOnlySidebar />
  ) : (
    <FullSidebar />
  )}
</div>
```

## Bottom Sheet Pattern (Mobile)

For detail panels on mobile:

```tsx
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children
}) => (
  <div
    className={`
      fixed inset-x-0 bottom-0 z-50
      transform transition-transform
      ${isOpen ? 'translate-y-0' : 'translate-y-full'}
      max-h-[80vh] rounded-t-2xl overflow-hidden
    `}
  >
    {/* Drag handle */}
    <div className="flex justify-center py-2">
      <div className="w-10 h-1 rounded-full" />
    </div>

    {/* Content */}
    <div className="overflow-y-auto max-h-[calc(80vh-24px)]">
      {children}
    </div>
  </div>
);
```

## Testing Responsive Layouts

### Breakpoint Testing Checklist

- [ ] 375px (iPhone SE) - All content visible, no horizontal scroll
- [ ] 414px (iPhone Plus) - Comfortable touch targets
- [ ] 768px (iPad Portrait) - Two-column layout works
- [ ] 1024px (iPad Landscape/Desktop) - Three-panel visible
- [ ] 1440px (Large Desktop) - Extra space handled gracefully
- [ ] 1920px+ (Wide screens) - No excessive stretching

### Common Issues

1. **Text truncation** - Ensure important text doesn't cut off
2. **Touch targets** - Minimum 44px for tappable elements
3. **Overflow** - Check for horizontal scroll at each breakpoint
4. **Panel collapse** - Verify transitions are smooth
5. **Content reflow** - Layout should adjust, not break
