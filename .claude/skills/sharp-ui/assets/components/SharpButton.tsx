import React from 'react';

export interface SharpButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-[10px] gap-1.5',
  md: 'px-4 py-2 text-xs gap-2',
  lg: 'px-5 py-2.5 text-sm gap-2',
};

const variantClasses = {
  primary: `
    bg-transparent text-sharp-accent border-2 border-sharp-accent
    hover:bg-sharp-accent hover:text-sharp-bg
    active:bg-sharp-accent/80 active:text-sharp-bg
  `,
  secondary: `
    bg-sharp-surface text-sharp-text border-2 border-sharp-border
    hover:bg-sharp-hover hover:border-sharp-text-muted
    active:bg-sharp-active
  `,
  ghost: `
    bg-transparent text-sharp-text-muted border-2 border-transparent
    hover:text-sharp-text hover:border-sharp-border
    active:bg-sharp-surface
  `,
};

const activeClasses = 'bg-sharp-accent text-sharp-bg border-sharp-accent';

/**
 * A button with hard edges and bold typography.
 *
 * @param variant - Visual style: 'primary' (accent border), 'secondary' (subtle), or 'ghost' (minimal)
 * @param size - Button size: 'sm', 'md', or 'lg'
 * @param icon - Optional icon element to display before children
 * @param active - Whether button is in active/selected state
 */
const SharpButton: React.FC<SharpButtonProps> = ({
  children,
  onClick,
  variant = 'secondary',
  size = 'md',
  icon,
  active = false,
  disabled = false,
  className = '',
  type = 'button',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        rounded-sharp
        font-semibold uppercase tracking-wide
        transition-all duration-150 ease-out
        ${sizeClasses[size]}
        ${active ? activeClasses : variantClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

export default SharpButton;
