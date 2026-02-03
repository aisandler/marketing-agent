import React from 'react';

export interface SharpToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: {
    track: 'w-8 h-4',
    thumb: 'w-3 h-3',
    translate: 'translate-x-4',
  },
  md: {
    track: 'w-10 h-5',
    thumb: 'w-4 h-4',
    translate: 'translate-x-5',
  },
};

/**
 * A toggle switch with square track and hard edges.
 *
 * @param checked - Whether toggle is on
 * @param onChange - Callback when toggle state changes
 * @param label - Optional text label
 * @param size - Toggle size: 'sm' or 'md'
 */
const SharpToggle: React.FC<SharpToggleProps> = ({
  checked,
  onChange,
  label,
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const config = sizeConfig[size];

  return (
    <label
      className={`
        inline-flex items-center gap-3
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={`
            ${config.track}
            rounded-sharp
            border-2
            transition-all duration-150 ease-out
            ${checked
              ? 'bg-sharp-accent border-sharp-accent'
              : 'bg-sharp-surface border-sharp-border'
            }
          `}
        />
        <div
          className={`
            ${config.thumb}
            absolute top-0.5 left-0.5
            rounded-sharp
            transition-all duration-150 ease-out
            ${checked
              ? `bg-sharp-bg ${config.translate}`
              : 'bg-sharp-text-muted'
            }
          `}
        />
      </div>
      {label && (
        <span className="text-xs font-semibold uppercase tracking-wide text-sharp-text-muted">
          {label}
        </span>
      )}
    </label>
  );
};

export default SharpToggle;
