import React from 'react';

export interface SharpInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'url';
  disabled?: boolean;
  error?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const sizeClasses = {
  sm: 'p-2.5 text-[11px]',
  md: 'p-3 text-xs',
};

/**
 * A text input with hard edges and thick border.
 *
 * @param value - Current input value
 * @param onChange - Callback when value changes
 * @param label - Optional label above input (uppercase)
 * @param placeholder - Placeholder text
 * @param type - Input type
 * @param error - Error message to display
 * @param icon - Optional icon inside input
 * @param size - Input size: 'sm' or 'md'
 */
const SharpInput: React.FC<SharpInputProps> = ({
  value,
  onChange,
  label,
  placeholder = '',
  type = 'text',
  disabled = false,
  error,
  icon,
  size = 'md',
  className = '',
  id,
  name,
  autoComplete,
  autoFocus,
  onFocus,
  onBlur,
  onKeyDown,
}) => {
  return (
    <div className={`space-y-2 w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-[10px] font-semibold uppercase tracking-wide text-sharp-text-muted block"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sharp-text-muted">
            {icon}
          </span>
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          className={`
            w-full
            bg-sharp-bg border-2 text-sharp-text
            rounded-sharp
            ${sizeClasses[size]}
            ${icon ? 'pl-10' : ''}
            placeholder:text-sharp-text-muted placeholder:uppercase placeholder:tracking-wide
            transition-all duration-150 ease-out
            focus:outline-none focus:border-sharp-accent
            ${error
              ? 'border-sharp-accent-alt'
              : 'border-sharp-border hover:border-sharp-text-muted'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
      </div>

      {error && (
        <p className="text-[10px] font-semibold uppercase tracking-wide text-sharp-accent-alt">
          {error}
        </p>
      )}
    </div>
  );
};

export default SharpInput;
