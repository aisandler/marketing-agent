/**
 * SkeletonLoader - Motion pattern template
 *
 * Placeholder content that preserves layout during loading.
 * Supports pulse (default) and shimmer animation styles.
 * Design-system agnostic - add colors from your visual system.
 */

import React from 'react';

interface SkeletonProps {
  /** Width of skeleton (string or number) */
  width?: string | number;
  /** Height of skeleton (string or number) */
  height?: string | number;
  /** Shape variant */
  variant?: 'text' | 'circular' | 'rectangular';
  /** Animation style */
  animation?: 'pulse' | 'shimmer' | 'none';
  /** Optional className for styling (add colors here) */
  className?: string;
}

/**
 * Base skeleton component
 */
const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  variant = 'text',
  animation = 'pulse',
  className = '',
}) => {
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    shimmer: 'skeleton-shimmer',
    none: '',
  };

  // Default background - override with className
  const bgClass = className.includes('bg-') ? '' : 'bg-slate-700';

  return (
    <div
      className={`${bgClass} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={{ width, height }}
    />
  );
};

// ============================================
// Pre-composed skeleton layouts
// ============================================

/**
 * Text block with multiple lines
 */
export const TextSkeleton: React.FC<{
  lines?: number;
  animation?: 'pulse' | 'shimmer';
  className?: string;
}> = ({ lines = 3, animation = 'pulse', className = '' }) => (
  <div className={`space-y-2 ${animation === 'pulse' ? 'animate-pulse' : ''}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        animation={animation === 'shimmer' ? 'shimmer' : 'none'}
        className={className}
        width={i === lines - 1 ? '60%' : '100%'}
      />
    ))}
  </div>
);

/**
 * Card with image and text
 */
export const CardSkeleton: React.FC<{
  animation?: 'pulse' | 'shimmer';
  className?: string;
}> = ({ animation = 'pulse', className = '' }) => (
  <div className={animation === 'pulse' ? 'animate-pulse' : ''}>
    <Skeleton variant="rectangular" className={`aspect-video ${className}`} animation={animation === 'shimmer' ? 'shimmer' : 'none'} />
    <Skeleton className={`w-3/4 mt-3 ${className}`} animation={animation === 'shimmer' ? 'shimmer' : 'none'} />
    <Skeleton className={`w-1/2 mt-2 h-3 ${className}`} animation={animation === 'shimmer' ? 'shimmer' : 'none'} />
  </div>
);

/**
 * Circular avatar
 */
export const AvatarSkeleton: React.FC<{
  size?: number;
  animation?: 'pulse' | 'shimmer';
  className?: string;
}> = ({ size = 40, animation = 'pulse', className = '' }) => (
  <Skeleton
    variant="circular"
    width={size}
    height={size}
    animation={animation}
    className={className}
  />
);

/**
 * List item with icon and text
 */
export const ListItemSkeleton: React.FC<{
  animation?: 'pulse' | 'shimmer';
  className?: string;
}> = ({ animation = 'pulse', className = '' }) => (
  <div className={`flex items-center gap-3 py-2 ${animation === 'pulse' ? 'animate-pulse' : ''}`}>
    <Skeleton variant="rectangular" width={32} height={32} animation={animation === 'shimmer' ? 'shimmer' : 'none'} className={className} />
    <div className="flex-1">
      <Skeleton className={`w-3/4 ${className}`} animation={animation === 'shimmer' ? 'shimmer' : 'none'} />
      <Skeleton className={`w-1/2 mt-1 h-3 ${className}`} animation={animation === 'shimmer' ? 'shimmer' : 'none'} />
    </div>
  </div>
);

/**
 * Table row
 */
export const TableRowSkeleton: React.FC<{
  columns?: number;
  animation?: 'pulse' | 'shimmer';
  className?: string;
}> = ({ columns = 4, animation = 'pulse', className = '' }) => (
  <div className={`flex items-center gap-4 py-3 ${animation === 'pulse' ? 'animate-pulse' : ''}`}>
    {Array.from({ length: columns }).map((_, i) => (
      <Skeleton
        key={i}
        className={`flex-1 ${className}`}
        animation={animation === 'shimmer' ? 'shimmer' : 'none'}
      />
    ))}
  </div>
);

/**
 * Form field (label + input)
 */
export const FormFieldSkeleton: React.FC<{
  animation?: 'pulse' | 'shimmer';
  className?: string;
}> = ({ animation = 'pulse', className = '' }) => (
  <div className={`space-y-2 ${animation === 'pulse' ? 'animate-pulse' : ''}`}>
    <Skeleton className={`w-1/4 h-3 ${className}`} animation={animation === 'shimmer' ? 'shimmer' : 'none'} />
    <Skeleton className={`w-full h-10 ${className}`} variant="rectangular" animation={animation === 'shimmer' ? 'shimmer' : 'none'} />
  </div>
);

/**
 * Navigation item
 */
export const NavItemSkeleton: React.FC<{
  animation?: 'pulse' | 'shimmer';
  className?: string;
}> = ({ animation = 'pulse', className = '' }) => (
  <div className={`flex items-center gap-3 py-2 ${animation === 'pulse' ? 'animate-pulse' : ''}`}>
    <Skeleton variant="rectangular" width={20} height={20} animation={animation === 'shimmer' ? 'shimmer' : 'none'} className={className} />
    <Skeleton className={`w-24 ${className}`} animation={animation === 'shimmer' ? 'shimmer' : 'none'} />
  </div>
);

export default Skeleton;

/**
 * USAGE:
 *
 * // Basic skeleton
 * <Skeleton width="100%" height={16} />
 *
 * // With shimmer animation
 * <Skeleton animation="shimmer" width="100%" height={16} />
 *
 * // Text block
 * <TextSkeleton lines={3} />
 *
 * // Card placeholder
 * <CardSkeleton />
 *
 * // List of items with shimmer
 * {Array.from({ length: 5 }).map((_, i) => (
 *   <ListItemSkeleton key={i} animation="shimmer" />
 * ))}
 *
 * // Table rows
 * {Array.from({ length: 10 }).map((_, i) => (
 *   <TableRowSkeleton key={i} columns={5} />
 * ))}
 *
 * // Form fields
 * <FormFieldSkeleton />
 * <FormFieldSkeleton />
 *
 * // Custom colors via className
 * <Skeleton className="bg-gray-200" />
 * <TextSkeleton className="bg-blue-100" />
 *
 * SHIMMER CSS (add to your global styles):
 *
 * @keyframes shimmer {
 *   0% { background-position: -200px 0; }
 *   100% { background-position: calc(200px + 100%) 0; }
 * }
 *
 * .skeleton-shimmer {
 *   background: linear-gradient(
 *     90deg,
 *     rgba(255, 255, 255, 0) 0%,
 *     rgba(255, 255, 255, 0.2) 50%,
 *     rgba(255, 255, 255, 0) 100%
 *   );
 *   background-size: 200px 100%;
 *   animation: shimmer 1.5s infinite;
 * }
 *
 * TIMING:
 *
 * - Pulse: 2s duration (Tailwind default)
 * - Shimmer: 1.5s duration
 * - No delay needed - skeletons should appear immediately
 * - Keep layout stable when real content loads
 */
