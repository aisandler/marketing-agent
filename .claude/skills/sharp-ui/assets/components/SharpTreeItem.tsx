import React from 'react';

export interface SharpTreeItemProps {
  id: string;
  label: string;
  depth?: number;
  isSelected?: boolean;
  isExpanded?: boolean;
  hasChildren?: boolean;
  icon?: React.ReactNode;
  theme?: 'dark' | 'light';
  onClick?: () => void;
  onToggle?: () => void;
  className?: string;
}

/**
 * A tree navigation item with sharp edges and strong typography.
 *
 * @param id - Unique identifier
 * @param label - Display text
 * @param depth - Nesting level (affects indentation)
 * @param isSelected - Highlight state
 * @param isExpanded - Expand/collapse state for items with children
 * @param hasChildren - Show expand/collapse chevron
 * @param theme - Color theme
 */
const SharpTreeItem: React.FC<SharpTreeItemProps> = ({
  id,
  label,
  depth = 0,
  isSelected = false,
  isExpanded = false,
  hasChildren = false,
  icon,
  theme = 'dark',
  onClick,
  onToggle,
  className = '',
}) => {
  const paddingLeft = depth * 16 + 8;

  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-sharp-text' : 'text-gray-900';
  const mutedColor = isDark ? 'text-sharp-text-muted' : 'text-gray-500';
  const hoverBg = isDark ? 'hover:bg-sharp-hover' : 'hover:bg-gray-100';
  const selectedBg = isDark ? 'bg-sharp-active' : 'bg-gray-200';

  return (
    <div
      data-tree-item={id}
      className={`
        flex items-center gap-2 py-2 pr-3
        cursor-pointer select-none
        transition-colors duration-150
        ${hoverBg}
        ${isSelected ? `${selectedBg} border-l-2 border-sharp-accent` : 'border-l-2 border-transparent'}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      style={{ paddingLeft: `${paddingLeft}px` }}
      onClick={onClick}
    >
      {hasChildren ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.();
          }}
          className={`
            shrink-0 w-4 h-4 flex items-center justify-center
            ${mutedColor} hover:text-sharp-accent
            transition-colors duration-150
          `.trim().replace(/\s+/g, ' ')}
        >
          <svg
            className={`w-3 h-3 transition-transform duration-150 ${isExpanded ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="square" strokeLinejoin="miter" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      ) : (
        <span className="shrink-0 w-4" />
      )}

      {icon && <span className={`shrink-0 w-4 h-4 ${mutedColor}`}>{icon}</span>}

      <span
        className={`
          flex-1 text-sm font-medium uppercase tracking-wide truncate
          ${isSelected ? textColor : mutedColor}
        `.trim().replace(/\s+/g, ' ')}
      >
        {label}
      </span>
    </div>
  );
};

export default SharpTreeItem;
