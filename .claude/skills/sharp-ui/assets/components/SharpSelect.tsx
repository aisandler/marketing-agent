import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

// Default icons - can be overridden via props
const DefaultChevron: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="square"
    strokeLinejoin="miter"
    className={className}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const DefaultCheck: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="square"
    strokeLinejoin="miter"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface SharpSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  icon?: React.ReactNode;
  chevronIcon?: React.ReactNode;
  checkIcon?: React.ReactNode;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const sizeClasses = {
  sm: {
    trigger: 'p-2.5 text-[11px]',
    option: 'px-3 py-2 text-[11px]',
    icon: 12,
  },
  md: {
    trigger: 'p-3 text-xs',
    option: 'px-3 py-2.5 text-xs',
    icon: 14,
  },
};

/**
 * A dropdown select component with hard edges.
 *
 * @param value - Currently selected value
 * @param onChange - Callback when selection changes
 * @param options - Array of option objects with value, label, and optional icon
 * @param placeholder - Placeholder text when no selection
 * @param size - Select size: 'sm' or 'md'
 */
const SharpSelect: React.FC<SharpSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'SELECT...',
  icon,
  chevronIcon,
  checkIcon,
  disabled = false,
  size = 'md',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const config = sizeClasses[size];

  const selectedOption = options.find(opt => opt.value === value);

  const ChevronElement = chevronIcon || <DefaultChevron size={config.icon} className="text-sharp-text-muted" />;
  const CheckElement = checkIcon || <DefaultCheck size={12} className="text-sharp-accent" />;

  const handleToggle = () => {
    if (disabled) return;

    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current && !containerRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    if (disabled) return;
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`space-y-2 w-full font-sans ${className}`} ref={containerRef}>
      {label && (
        <label className="text-[10px] font-semibold uppercase tracking-wide text-sharp-text-muted block">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={handleToggle}
          className={`
            w-full flex items-center justify-between
            bg-sharp-bg border-2 border-sharp-border text-sharp-text
            rounded-sharp
            ${config.trigger}
            text-left
            transition-all duration-150 ease-out
            ${disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:border-sharp-text-muted cursor-pointer'
            }
            ${isOpen ? 'border-sharp-accent' : ''}
          `}
          disabled={disabled}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            {icon && <span className="text-sharp-text-muted flex-shrink-0">{icon}</span>}
            {selectedOption?.icon && <span className="text-sharp-text-muted flex-shrink-0">{selectedOption.icon}</span>}
            <span className="truncate uppercase tracking-wide font-medium">
              {selectedOption
                ? selectedOption.label
                : <span className="text-sharp-text-muted">{placeholder}</span>
              }
            </span>
          </div>
          <span
            className={`
              transition-transform duration-150 ease-out
              ${isOpen ? 'rotate-180' : ''}
            `}
          >
            {ChevronElement}
          </span>
        </button>

        {isOpen && dropdownPosition && createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'fixed',
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              zIndex: 9999,
            }}
            className={`
              bg-sharp-surface border-2 border-sharp-border
              rounded-sharp
              overflow-hidden
            `}
          >
            <div className="max-h-60 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full flex items-center justify-between
                    ${config.option}
                    transition-all duration-150 ease-out
                    uppercase tracking-wide font-medium
                    ${option.value === value
                      ? 'bg-sharp-active text-sharp-accent'
                      : 'text-sharp-text hover:bg-sharp-hover'
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    {option.icon && (
                      <span className="flex-shrink-0">{option.icon}</span>
                    )}
                    <span>{option.label}</span>
                  </div>
                  {option.value === value && CheckElement}
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
};

export default SharpSelect;
