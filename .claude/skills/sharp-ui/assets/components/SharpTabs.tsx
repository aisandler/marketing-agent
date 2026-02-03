import React from 'react';

export interface Tab {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface SharpTabsProps {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md';
  className?: string;
}

const sizeClasses = {
  sm: 'text-[10px] px-3 py-2',
  md: 'text-xs px-4 py-2.5',
};

/**
 * A tab navigation component with underline indicator.
 *
 * @param tabs - Array of tab objects with value, label, and optional icon
 * @param value - Currently selected tab value
 * @param onChange - Callback when tab selection changes
 * @param size - Tab size: 'sm' or 'md'
 */
const SharpTabs: React.FC<SharpTabsProps> = ({
  tabs,
  value,
  onChange,
  size = 'md',
  className = '',
}) => {
  return (
    <div
      className={`
        inline-flex items-stretch
        border-b-2 border-sharp-border
        ${className}
      `}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`
              inline-flex items-center justify-center gap-1.5
              font-semibold uppercase tracking-wide
              transition-all duration-150 ease-out
              border-b-2 -mb-[2px]
              ${sizeClasses[size]}
              ${isActive
                ? 'text-sharp-accent border-sharp-accent'
                : 'text-sharp-text-muted border-transparent hover:text-sharp-text hover:border-sharp-text-muted'
              }
            `}
          >
            {tab.icon && (
              <span className="flex-shrink-0">{tab.icon}</span>
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default SharpTabs;
