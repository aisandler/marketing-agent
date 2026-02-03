import React from 'react';

interface RetroButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  pulse?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function RetroButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  pulse = false,
  onClick,
  type = 'button',
}: RetroButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const variantStyles = {
    primary: {
      base: 'bg-[#ff2d95] text-white',
      shadow: '0 0 20px rgba(255, 45, 149, 0.5), 0 0 40px rgba(255, 45, 149, 0.3)',
      hover: 'hover:bg-[#ff6eb4]',
      pixelShadow: 'bg-[#cc0066]',
    },
    secondary: {
      base: 'bg-[#161620] text-[#00f5ff] border-2 border-[#00f5ff]/50',
      shadow: '0 0 15px rgba(0, 245, 255, 0.3)',
      hover: 'hover:border-[#00f5ff] hover:bg-[#00f5ff]/10',
      pixelShadow: 'bg-[#00b8c4]',
    },
    ghost: {
      base: 'bg-transparent text-[#9090b0]',
      shadow: 'none',
      hover: 'hover:text-[#e0e0ff] hover:bg-white/5',
      pixelShadow: '',
    },
  };

  const styles = variantStyles[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative
        ${sizeClasses[size]}
        ${styles.base}
        font-bold uppercase tracking-wider
        rounded-[4px]
        ${styles.hover}
        hover:scale-105
        active:scale-95
        transition-transform duration-150
        [transition-timing-function:cubic-bezier(0.68,-0.55,0.265,1.55)]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        focus:outline-none focus:ring-2 focus:ring-[#ff2d95]/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0f]
        ${pulse ? 'animate-[retro-pulse-neon_2s_ease-in-out_infinite]' : ''}
        ${className}
      `}
      style={{
        boxShadow: styles.shadow,
      }}
    >
      {/* Pixel shadow offset (for primary/secondary) */}
      {variant !== 'ghost' && styles.pixelShadow && (
        <span className={`
          absolute inset-0
          ${styles.pixelShadow}
          rounded-[4px]
          translate-x-1 translate-y-1
          -z-10
        `} />
      )}

      <span className="relative">{children}</span>
    </button>
  );
}

export default RetroButton;
