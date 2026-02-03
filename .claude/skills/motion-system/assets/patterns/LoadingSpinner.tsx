/**
 * LoadingSpinner - Motion pattern template
 *
 * Multiple spinner variants with delay to prevent flash for fast operations.
 * Design-system agnostic - add colors from your visual system.
 */

import React, { useState, useEffect } from 'react';

interface LoadingSpinnerProps {
  /** Spinner style variant */
  variant?: 'spin' | 'dots' | 'bars' | 'pulse';
  /** Size preset or custom pixel value */
  size?: 'sm' | 'md' | 'lg' | number;
  /** Delay before showing spinner (prevents flash) */
  delay?: number;
  /** Optional className for styling (add colors here) */
  className?: string;
  /** Optional text to show alongside spinner */
  text?: string;
  /** Text position relative to spinner */
  textPosition?: 'right' | 'below';
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
};

/**
 * Classic rotating spinner using CSS animation
 */
const SpinVariant: React.FC<{ size: number; className: string }> = ({ size, className }) => (
  <svg
    className={`animate-spin ${className}`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

/**
 * Three bouncing dots
 */
const DotsVariant: React.FC<{ size: number; className: string }> = ({ size, className }) => {
  const dotSize = size / 4;
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-full bg-current animate-bounce"
          style={{
            width: dotSize,
            height: dotSize,
            animationDelay: `${i * 0.15}s`,
            animationDuration: '0.6s',
          }}
        />
      ))}
    </div>
  );
};

/**
 * Three scaling bars
 */
const BarsVariant: React.FC<{ size: number; className: string }> = ({ size, className }) => {
  const barWidth = size / 6;
  const barHeight = size;
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="bg-current animate-pulse"
          style={{
            width: barWidth,
            height: barHeight,
            animationDelay: `${i * 0.15}s`,
            animationDuration: '0.8s',
            transform: `scaleY(${0.4 + (i === 1 ? 0.6 : 0.3)})`,
          }}
        />
      ))}
    </div>
  );
};

/**
 * Pulsing circle
 */
const PulseVariant: React.FC<{ size: number; className: string }> = ({ size, className }) => (
  <div
    className={`rounded-full bg-current animate-ping ${className}`}
    style={{ width: size * 0.5, height: size * 0.5 }}
  />
);

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  variant = 'spin',
  size = 'md',
  delay = 200,
  className = '',
  text,
  textPosition = 'right',
}) => {
  const [show, setShow] = useState(delay === 0);
  const resolvedSize = typeof size === 'number' ? size : sizeMap[size];

  useEffect(() => {
    if (delay === 0) return;
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;

  const SpinnerComponent = {
    spin: SpinVariant,
    dots: DotsVariant,
    bars: BarsVariant,
    pulse: PulseVariant,
  }[variant];

  const containerClass = textPosition === 'below'
    ? 'flex flex-col items-center gap-2'
    : 'flex items-center gap-2';

  return (
    <div className={containerClass}>
      <SpinnerComponent size={resolvedSize} className={className} />
      {text && <span className="text-sm">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;

/**
 * USAGE:
 *
 * // Classic spinner (default)
 * <LoadingSpinner />
 *
 * // Different variants
 * <LoadingSpinner variant="dots" />
 * <LoadingSpinner variant="bars" />
 * <LoadingSpinner variant="pulse" />
 *
 * // Size presets
 * <LoadingSpinner size="sm" />  // 16px
 * <LoadingSpinner size="md" />  // 24px (default)
 * <LoadingSpinner size="lg" />  // 32px
 *
 * // Custom size
 * <LoadingSpinner size={48} />
 *
 * // With text
 * <LoadingSpinner text="Loading..." />
 * <LoadingSpinner text="Please wait" textPosition="below" />
 *
 * // No delay (immediate)
 * <LoadingSpinner delay={0} />
 *
 * // Add colors via className
 * <LoadingSpinner className="text-blue-500" />
 * <LoadingSpinner className="text-white" />
 *
 * TIMING GUIDELINES:
 *
 * - delay={200}: Default, prevents flash for fast operations
 * - delay={0}: Use when loading state is expected to be long
 * - delay={500}: Use for background operations
 *
 * ACCESSIBILITY:
 *
 * Add aria-label for screen readers:
 * <div aria-label="Loading" aria-busy="true">
 *   <LoadingSpinner />
 * </div>
 */
