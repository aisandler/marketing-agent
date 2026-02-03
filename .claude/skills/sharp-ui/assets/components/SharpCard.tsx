import React from 'react';

export interface SharpCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'accent';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  id?: string;
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
};

const variantClasses = {
  default: 'bg-sharp-surface border-2 border-sharp-border',
  bordered: 'bg-sharp-surface border-2 border-sharp-border hover:border-sharp-text-muted',
  accent: 'bg-sharp-surface border-2 border-sharp-accent',
};

/**
 * A container component with hard edges and strong borders.
 *
 * @param variant - Visual style: 'default', 'bordered' (hover effect), or 'accent' (green border)
 * @param padding - Internal padding: 'none', 'sm', 'md', or 'lg'
 */
const SharpCard: React.FC<SharpCardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  id,
}) => {
  return (
    <div
      id={id}
      className={`
        rounded-sharp
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        transition-all duration-150 ease-out
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </div>
  );
};

export default SharpCard;
