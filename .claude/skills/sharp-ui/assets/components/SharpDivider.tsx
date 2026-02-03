import React from 'react';

export interface SharpDividerProps {
  variant?: 'default' | 'accent';
  thickness?: 'sm' | 'md' | 'lg';
  className?: string;
}

const thicknessClasses = {
  sm: 'h-px',
  md: 'h-0.5',
  lg: 'h-1',
};

const variantClasses = {
  default: 'bg-sharp-border',
  accent: 'bg-sharp-accent',
};

/**
 * A horizontal divider with configurable thickness.
 *
 * @param variant - Color: 'default' (gray) or 'accent' (green)
 * @param thickness - Line thickness: 'sm' (1px), 'md' (2px), or 'lg' (4px)
 */
const SharpDivider: React.FC<SharpDividerProps> = ({
  variant = 'default',
  thickness = 'md',
  className = '',
}) => {
  return (
    <hr
      className={`
        w-full border-none
        ${thicknessClasses[thickness]}
        ${variantClasses[variant]}
        ${className}
      `}
    />
  );
};

export default SharpDivider;
