# Loading States

Patterns for spinners, skeletons, progress indicators, and loading UX. Read this when implementing loading feedback.

## Loading State Types

| Type | Use When | Duration Hint |
|------|----------|---------------|
| **Spinner** | Unknown duration, small area | Indeterminate |
| **Skeleton** | Known layout, content loading | Indeterminate |
| **Progress bar** | Known progress percentage | Determinate |
| **Button loading** | Action in progress | Short (< 5s) |
| **Overlay** | Page-level blocking operation | Any |

## Spinner Patterns

### Basic Spinner

```tsx
import { Loader2 } from 'lucide-react';

// Simple spinner
<Loader2 className="animate-spin" size={16} />

// With text
<div className="flex items-center gap-2">
  <Loader2 className="animate-spin" size={16} />
  <span>Loading...</span>
</div>
```

### Delayed Spinner

Don't show spinner for fast operations:

```tsx
const DelayedSpinner = ({ delay = 200 }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;
  return <Loader2 className="animate-spin" size={16} />;
};
```

### Spinner Sizes

| Context | Size | Class |
|---------|------|-------|
| Inline text | 14-16px | `size={14}` |
| Button | 16-18px | `size={16}` |
| Card center | 24-32px | `size={24}` |
| Page center | 32-48px | `size={32}` |

## Skeleton Patterns

### Basic Skeleton

```tsx
// Text skeleton
<div className="animate-pulse">
  <div className="h-4 bg-slate-700 rounded w-3/4" />
  <div className="h-4 bg-slate-700 rounded w-1/2 mt-2" />
</div>

// Card skeleton
<div className="animate-pulse">
  <div className="aspect-video bg-slate-700 rounded-lg" />
  <div className="h-4 bg-slate-700 rounded w-3/4 mt-3" />
  <div className="h-3 bg-slate-700 rounded w-1/2 mt-2" />
</div>
```

### Skeleton with Shimmer

```css
/* Add shimmer effect */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.1) 50%,
    rgba(255,255,255,0) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

### Skeleton Component

```tsx
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height
}) => {
  const baseClasses = 'animate-pulse bg-slate-700';

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  );
};
```

## Progress Bar Patterns

### Determinate Progress

```tsx
interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, className = '' }) => (
  <div className={`h-1 bg-slate-700 rounded-full overflow-hidden ${className}`}>
    <div
      className="h-full bg-indigo-500 transition-all duration-300 ease-out"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);
```

### Indeterminate Progress

```tsx
const IndeterminateProgress = () => (
  <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
    <div className="h-full bg-indigo-500 animate-indeterminate" />
  </div>
);

// CSS
@keyframes indeterminate {
  0% { transform: translateX(-100%); width: 50%; }
  50% { width: 30%; }
  100% { transform: translateX(200%); width: 50%; }
}
.animate-indeterminate {
  animation: indeterminate 1.5s ease-in-out infinite;
}
```

## Button Loading State

### Pattern

```tsx
interface ButtonProps {
  isLoading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ isLoading, children, onClick }) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className="relative flex items-center justify-center px-4 py-2 disabled:opacity-50"
  >
    {isLoading && (
      <Loader2 className="absolute animate-spin" size={16} />
    )}
    <span className={isLoading ? 'invisible' : ''}>{children}</span>
  </button>
);
```

### Guidelines

1. Keep button same size during loading (use invisible text trick)
2. Disable button while loading
3. Center spinner in button
4. Optional: Change button text ("Save" → "Saving...")

## Loading State UX Guidelines

### Timing Thresholds

| Duration | Feedback |
|----------|----------|
| < 200ms | No feedback needed |
| 200ms - 1s | Subtle indicator (spinner) |
| 1s - 5s | Progress indicator if possible |
| > 5s | Progress + time estimate |

### Minimum Display Time

```tsx
// Prevent loading flash
const useMinimumLoadingTime = (isLoading: boolean, minTime = 500) => {
  const [showLoading, setShowLoading] = useState(false);
  const loadingStartRef = useRef<number>(0);

  useEffect(() => {
    if (isLoading) {
      loadingStartRef.current = Date.now();
      setShowLoading(true);
    } else {
      const elapsed = Date.now() - loadingStartRef.current;
      const remaining = Math.max(0, minTime - elapsed);
      setTimeout(() => setShowLoading(false), remaining);
    }
  }, [isLoading, minTime]);

  return showLoading;
};
```

### Content Preservation

- Use skeletons that match content layout
- Avoid layout shift when content loads
- Consider placeholder content for better LCP

## Anti-Patterns

1. **Showing spinner immediately** - Flash for fast responses
2. **Spinner disappears too quickly** - Jarring, hard to notice
3. **No loading state at all** - User thinks nothing is happening
4. **Blocking entire page** - Use inline spinners when possible
5. **Spinner without context** - Add text or contain to relevant area
6. **Layout shift on load** - Use skeletons that match content size
