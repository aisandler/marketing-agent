import React from 'react';

interface RetroBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  blink?: boolean;
  className?: string;
}

const variantStyles = {
  default: {
    bg: 'rgba(255, 45, 149, 0.2)',
    text: '#ff2d95',
    border: 'rgba(255, 45, 149, 0.5)',
    glow: 'rgba(255, 45, 149, 0.3)',
    dot: '#ff2d95',
  },
  success: {
    bg: 'rgba(57, 255, 20, 0.15)',
    text: '#39ff14',
    border: 'rgba(57, 255, 20, 0.5)',
    glow: 'rgba(57, 255, 20, 0.3)',
    dot: '#39ff14',
  },
  warning: {
    bg: 'rgba(240, 240, 0, 0.15)',
    text: '#f0f000',
    border: 'rgba(240, 240, 0, 0.5)',
    glow: 'rgba(240, 240, 0, 0.3)',
    dot: '#f0f000',
  },
  error: {
    bg: 'rgba(255, 51, 51, 0.15)',
    text: '#ff3333',
    border: 'rgba(255, 51, 51, 0.5)',
    glow: 'rgba(255, 51, 51, 0.3)',
    dot: '#ff3333',
  },
};

export function RetroBadge({
  children,
  variant = 'default',
  blink = true,
  className = '',
}: RetroBadgeProps) {
  const styles = variantStyles[variant];

  return (
    <span
      className={`
        relative
        inline-flex items-center gap-2
        px-3 py-1.5
        text-xs font-bold uppercase tracking-wider
        rounded-[4px]
        ${className}
      `}
      style={{
        backgroundColor: styles.bg,
        color: styles.text,
        border: `1px solid ${styles.border}`,
        boxShadow: `0 0 15px ${styles.glow}`,
      }}
    >
      {/* Blinking dot */}
      <span
        className={blink ? 'animate-[retro-blink_1s_steps(2,start)_infinite]' : ''}
        style={{
          width: '8px',
          height: '8px',
          backgroundColor: styles.dot,
          boxShadow: `0 0 8px ${styles.dot}`,
        }}
      />

      {children}
    </span>
  );
}

export default RetroBadge;
