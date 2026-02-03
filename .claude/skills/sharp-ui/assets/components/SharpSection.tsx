import React, { useState } from 'react';

export interface SharpSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
  theme?: 'dark' | 'light';
  className?: string;
}

/**
 * A collapsible section with sharp edges and strong typography.
 *
 * @param title - Section header text
 * @param defaultOpen - Initial expanded state
 * @param icon - Optional icon before title
 * @param theme - Color theme
 */
const SharpSection: React.FC<SharpSectionProps> = ({
  title,
  children,
  defaultOpen = true,
  icon,
  theme = 'dark',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const isDark = theme === 'dark';
  const borderColor = isDark ? 'border-sharp-border' : 'border-gray-300';
  const textColor = isDark ? 'text-sharp-text' : 'text-gray-900';
  const mutedColor = isDark ? 'text-sharp-text-muted' : 'text-gray-500';
  const hoverBg = isDark ? 'hover:bg-sharp-hover' : 'hover:bg-gray-100';

  return (
    <div className={`border-b-2 ${borderColor} ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between py-3 px-1
          transition-colors duration-150
          ${hoverBg}
          focus:outline-none focus:ring-2 focus:ring-sharp-accent/30 focus:ring-inset
        `.trim().replace(/\s+/g, ' ')}
      >
        <div className="flex items-center gap-3">
          {icon && <span className={`w-5 h-5 ${mutedColor}`}>{icon}</span>}
          <span className={`font-bold uppercase text-sm tracking-wider ${textColor}`}>
            {title}
          </span>
        </div>
        <svg
          className={`
            w-4 h-4 ${mutedColor}
            transition-transform duration-150
            ${isOpen ? 'rotate-180' : ''}
          `.trim().replace(/\s+/g, ' ')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="square" strokeLinejoin="miter" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`
          overflow-hidden transition-all duration-150 ease-out
          ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
        `.trim().replace(/\s+/g, ' ')}
      >
        <div className="py-3 px-1">{children}</div>
      </div>
    </div>
  );
};

export default SharpSection;
