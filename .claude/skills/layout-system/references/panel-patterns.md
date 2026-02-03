# Panel Composition Patterns

Detailed documentation for panel-based layouts. Read this when implementing complex panel compositions or troubleshooting layout issues.

## ThreePanelLayout

### Standard Configuration

```
+---------------+-------------------+---------------+
|   LEFT        |   CENTER          |   RIGHT       |
|   SIDEBAR     |   (main content)  |   SIDEBAR     |
|   280px       |   flex-1          |   360px       |
+---------------+-------------------+---------------+
```

### Full Implementation (Structure Only)

```tsx
import React, { ReactNode } from 'react';

interface ThreePanelLayoutProps {
  leftSidebar: ReactNode;
  rightSidebar?: ReactNode;
  children: ReactNode;
}

const ThreePanelLayout: React.FC<ThreePanelLayoutProps> = ({
  leftSidebar,
  rightSidebar,
  children
}) => {
  return (
    <div className="flex flex-1 h-full overflow-hidden min-h-0">
      {/* Left Sidebar - Fixed 280px */}
      <div className="w-[280px] flex-shrink-0 flex flex-col overflow-hidden">
        <div className="h-full overflow-hidden flex flex-col">
          {leftSidebar}
        </div>
      </div>

      {/* Center Content - Flexible */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 relative flex flex-col min-w-0 h-full overflow-hidden">
          {children}
        </div>
      </div>

      {/* Right Sidebar - Fixed 360px (optional) */}
      {rightSidebar && (
        <div className="w-[360px] flex-shrink-0 flex flex-col overflow-hidden">
          <div className="h-full overflow-hidden flex flex-col">
            {rightSidebar}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreePanelLayout;
```

### Key Structural Classes

| Element | Classes | Purpose |
|---------|---------|---------|
| Container | `flex flex-1 h-full overflow-hidden min-h-0` | Horizontal flex, fills parent, contains scroll |
| Left sidebar | `w-[280px] flex-shrink-0 flex flex-col overflow-hidden` | Fixed width, doesn't shrink, vertical flex |
| Center | `flex-1 flex flex-col min-w-0 overflow-hidden` | Grows to fill, allows shrinking below content |
| Right sidebar | `w-[360px] flex-shrink-0 flex flex-col overflow-hidden` | Fixed width, doesn't shrink |

### Width Recommendations

| Panel | Width | Rationale |
|-------|-------|-----------|
| Left sidebar | 280px | Fits navigation trees with 3-4 depth levels |
| Right sidebar | 360px | Fits form controls, detail panels |
| Right sidebar (compact) | 320px | For simpler detail views |
| Minimum center | 400px | Ensures readable content area |

## OnePanelLayout

### Standard Configuration

```
+-----------------------------------+---------------+
|   MAIN CONTENT                    |   RIGHT       |
|   (full width)                    |   SIDEBAR     |
|   flex-1                          |   320px       |
+-----------------------------------+---------------+
```

### Full Implementation (Structure Only)

```tsx
import React, { ReactNode } from 'react';

interface OnePanelLayoutProps {
  children: ReactNode;
  rightSidebar?: ReactNode;
}

const OnePanelLayout: React.FC<OnePanelLayoutProps> = ({
  children,
  rightSidebar
}) => {
  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Main Content - Full Width */}
      <div className="flex-1 h-full overflow-hidden relative">
        {children}
      </div>

      {/* Optional Right Sidebar */}
      {rightSidebar && (
        <div className="w-80 h-full overflow-hidden flex-shrink-0">
          {rightSidebar}
        </div>
      )}
    </div>
  );
};

export default OnePanelLayout;
```

## Panel Transitions

When switching panel content based on mode:

### Animated Transitions (with framer-motion)

```tsx
import { motion, AnimatePresence } from 'framer-motion';

const panelVariants = {
  initial: { opacity: 0, filter: 'blur(4px)' },
  animate: { opacity: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, filter: 'blur(4px)' }
};

const PanelTransition: React.FC<{ children: ReactNode }> = ({ children }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={/* unique key based on content */}
      variants={panelVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      {children}
    </motion.div>
  </AnimatePresence>
);
```

### Without Animation

```tsx
// Simple conditional rendering
{mode === 'studio' && <StudioPanel />}
{mode === 'library' && <LibraryPanel />}
{mode === 'intelligence' && <IntelligencePanel />}
```

## Conditional Sidebars

### Right Sidebar Visibility

```tsx
// Pattern: Mode determines sidebar visibility
const getRightSidebar = (mode: string, selection: any) => {
  switch (mode) {
    case 'library':
      return selection ? <DetailsPanel item={selection} /> : null;
    case 'studio':
      return <ControlPanel />;
    case 'intelligence':
      return null; // Full-width mode
    default:
      return null;
  }
};

// Usage
<ThreePanelLayout
  leftSidebar={<Navigation />}
  rightSidebar={getRightSidebar(mode, selectedItem)}
>
  <MainContent mode={mode} />
</ThreePanelLayout>
```

### Collapsible Sidebar Pattern

```tsx
const [isSidebarOpen, setIsSidebarOpen] = useState(true);

<div className="flex h-full overflow-hidden">
  {/* Collapsible sidebar */}
  <div
    className={`
      flex-shrink-0 flex flex-col overflow-hidden
      transition-all duration-300
      ${isSidebarOpen ? 'w-[280px]' : 'w-0'}
    `}
  >
    {isSidebarOpen && <SidebarContent />}
  </div>

  {/* Main content */}
  <div className="flex-1 min-w-0 overflow-hidden">
    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
      Toggle Sidebar
    </button>
    {children}
  </div>
</div>
```

## Panel Border Placement

### Convention

- Left sidebar: right border (`border-r`)
- Right sidebar: left border (`border-l`)
- Sections within panels: bottom border (`border-b`)

```tsx
// Visual system adds the colors
// Structure just places the borders
<div className="w-[280px] border-r">  {/* Left sidebar */}
<div className="w-[360px] border-l">  {/* Right sidebar */}
<div className="px-4 py-3 border-b">  {/* Section header */}
```

## Common Issues

### Issue: Center panel doesn't fill space

**Cause:** Missing `flex-1` or `min-w-0`

```tsx
// WRONG
<div className="overflow-hidden">

// CORRECT
<div className="flex-1 min-w-0 overflow-hidden">
```

### Issue: Sidebar shrinks when content is wide

**Cause:** Missing `flex-shrink-0`

```tsx
// WRONG
<div className="w-[280px]">

// CORRECT
<div className="w-[280px] flex-shrink-0">
```

### Issue: Content overflows panel

**Cause:** Missing `overflow-hidden` on container

```tsx
// WRONG
<div className="flex h-full">

// CORRECT
<div className="flex h-full overflow-hidden">
```
