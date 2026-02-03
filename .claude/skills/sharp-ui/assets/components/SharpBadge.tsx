import React from 'react';

export interface SharpBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  className?: string;
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[9px]',
  md: 'px-2.5 py-1 text-[10px]',
};

const variantClasses = {
  default: 'bg-sharp-surface border-sharp-border text-sharp-text-muted',
  success: 'bg-transparent border-sharp-accent text-sharp-accent',
  warning: 'bg-transparent border-sharp-warning text-sharp-warning',
  error: 'bg-transparent border-sharp-accent-alt text-sharp-accent-alt',
};

/**
 * A status indicator badge with uppercase text.
 *
 * @param variant - Visual style: 'default', 'success' (green), 'warning' (yellow), 'error' (pink)
 * @param size - Badge size: 'sm' or 'md'
 */
const SharpBadge: React.FC<SharpBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center
        rounded-sharp
        border-2
        font-bold uppercase tracking-wide
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default SharpBadge;
