import React from 'react';

export interface SharpSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  theme?: 'dark' | 'light';
  className?: string;
  onClear?: () => void;
}

/**
 * A search input with sharp edges and thick borders.
 *
 * @param value - Current input value
 * @param onChange - Change handler
 * @param placeholder - Placeholder text
 * @param theme - Color theme
 * @param onClear - Optional clear button handler
 */
const SharpSearchInput: React.FC<SharpSearchInputProps> = ({
  value,
  onChange,
  placeholder = 'SEARCH...',
  theme = 'dark',
  className = '',
  onClear,
}) => {
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-sharp-surface' : 'bg-white';
  const borderColor = isDark ? 'border-sharp-border' : 'border-gray-400';
  const textColor = isDark ? 'text-sharp-text' : 'text-gray-900';
  const placeholderColor = isDark ? 'placeholder:text-sharp-text-muted' : 'placeholder:text-gray-400';
  const iconColor = isDark ? 'text-sharp-text-muted' : 'text-gray-400';

  return (
    <div
      className={`
        relative flex items-center gap-2 px-3 py-2
        border-2 rounded-sharp
        transition-all duration-150
        focus-within:border-sharp-accent
        ${bgColor} ${borderColor}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      <svg
        className={`w-4 h-4 shrink-0 ${iconColor}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
      >
        <path
          strokeLinecap="square"
          strokeLinejoin="miter"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          flex-1 bg-transparent outline-none
          text-sm font-medium uppercase tracking-wide
          ${textColor} ${placeholderColor}
        `.trim().replace(/\s+/g, ' ')}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className={`
            shrink-0 p-0.5
            ${iconColor} hover:text-sharp-accent
            transition-colors duration-150
            focus:outline-none
          `.trim().replace(/\s+/g, ' ')}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="square" strokeLinejoin="miter" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SharpSearchInput;
