import React, { useState, useCallback } from 'react';
import type { SoftTheme } from './SoftCard';

// Default icons - can be overridden
const DefaultChevronRight: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="m9 18 6-6-6-6" />
    </svg>
);

const DefaultMoreHorizontal: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
    </svg>
);

// Icon colors by node type
const LEVEL_COLORS = {
    brand: 'text-teal-400',
    product: 'text-soft-indigo-400',
    variant: 'text-violet-400',
    group: 'text-amber-400',
} as const;

export type TreeNodeType = keyof typeof LEVEL_COLORS;

export interface SoftTreeItemProps {
    id: string;
    type: TreeNodeType;
    label: string;
    count?: number;
    depth?: number;
    isSelected?: boolean;
    isExpanded?: boolean;
    hasChildren?: boolean;
    isDragOver?: boolean;
    icon?: React.ReactNode;
    chevronIcon?: React.ReactNode;
    moreIcon?: React.ReactNode;
    onSelect?: (id: string) => void;
    onToggle?: (id: string) => void;
    onAction?: (id: string, action: string) => void;
    onDragOver?: (e: React.DragEvent) => void;
    onDragLeave?: (e: React.DragEvent) => void;
    onDrop?: (e: React.DragEvent, id: string) => void;
    theme?: SoftTheme;
    children?: React.ReactNode;
    className?: string;
}

const itemClasses = {
    dark: {
        selected: 'bg-soft-dark-300 text-white border-l-2 border-soft-indigo-500',
        default: 'text-slate-400 hover:bg-soft-dark-200 hover:text-slate-200 border-l-2 border-transparent',
        dragOver: 'bg-soft-indigo-500/10 ring-2 ring-soft-indigo-500/20 scale-[1.01]',
    },
    light: {
        selected: 'bg-soft-light-300 text-slate-800 border-l-2 border-soft-indigo-500',
        default: 'text-slate-600 hover:bg-soft-light-200 hover:text-slate-800 border-l-2 border-transparent',
        dragOver: 'bg-soft-indigo-50 ring-2 ring-soft-indigo-400/20 scale-[1.01]',
    },
};

const chevronClasses = {
    dark: 'text-slate-500 hover:text-slate-300 hover:bg-soft-dark-400',
    light: 'text-slate-400 hover:text-slate-600 hover:bg-soft-light-300',
};

const countClasses = {
    dark: 'bg-soft-dark-300 text-slate-500 group-hover:bg-soft-dark-400',
    light: 'bg-soft-light-300 text-slate-500 group-hover:bg-soft-light-400',
};

const actionClasses = {
    dark: 'hover:bg-soft-dark-400 text-slate-500 hover:text-slate-300',
    light: 'hover:bg-soft-light-300 text-slate-400 hover:text-slate-600',
};

/**
 * A soft tree item component for hierarchical navigation.
 *
 * @param id - Unique identifier
 * @param type - Node type determines icon color: 'brand', 'product', 'variant', 'group'
 * @param label - Display text
 * @param count - Optional count badge
 * @param depth - Nesting level for indentation
 * @param isSelected - Whether item is currently selected
 * @param isExpanded - Whether children are visible
 * @param hasChildren - Whether item has children (shows chevron)
 * @param icon - Custom type icon (defaults based on type)
 * @param chevronIcon - Custom expand/collapse chevron
 * @param moreIcon - Custom actions menu icon
 * @param theme - Color scheme: 'dark' (default) or 'light'
 */
const SoftTreeItem: React.FC<SoftTreeItemProps> = ({
    id,
    type,
    label,
    count,
    depth = 0,
    isSelected = false,
    isExpanded = false,
    hasChildren = false,
    isDragOver = false,
    icon,
    chevronIcon,
    moreIcon,
    onSelect,
    onToggle,
    onAction,
    onDragOver,
    onDragLeave,
    onDrop,
    theme = 'dark',
    children,
    className = '',
}) => {
    const [showActions, setShowActions] = useState(false);
    const iconColor = LEVEL_COLORS[type];
    const styles = itemClasses[theme];

    const ChevronIcon = chevronIcon || <DefaultChevronRight size={14} />;
    const MoreIcon = moreIcon || <DefaultMoreHorizontal size={12} />;

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect?.(id);
    }, [id, onSelect]);

    const handleToggle = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onToggle?.(id);
    }, [id, onToggle]);

    const handleDoubleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (hasChildren) {
            onToggle?.(id);
        }
    }, [id, hasChildren, onToggle]);

    const handleActionClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onAction?.(id, 'menu');
    }, [id, onAction]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onDragOver?.(e);
    }, [onDragOver]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.stopPropagation();
        onDragLeave?.(e);
    }, [onDragLeave]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onDrop?.(e, id);
    }, [id, onDrop]);

    const paddingLeft = depth * 16 + 12;

    return (
        <div className={className}>
            <div
                role="treeitem"
                aria-selected={isSelected}
                aria-expanded={hasChildren ? isExpanded : undefined}
                tabIndex={0}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
                onMouseEnter={() => setShowActions(true)}
                onMouseLeave={() => setShowActions(false)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{ paddingLeft: `${paddingLeft}px` }}
                className={`
                    group flex items-center gap-2
                    pr-3 py-2
                    rounded-soft
                    cursor-pointer
                    transition-all duration-200
                    outline-none
                    focus-visible:ring-2 focus-visible:ring-soft-indigo-500/50
                    ${isSelected ? styles.selected : styles.default}
                    ${isDragOver ? styles.dragOver : ''}
                `}
            >
                {hasChildren ? (
                    <button
                        onClick={handleToggle}
                        className={`
                            p-0.5 rounded
                            ${chevronClasses[theme]}
                            transition-transform duration-200
                            ${isExpanded ? 'rotate-90' : ''}
                        `}
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                        {ChevronIcon}
                    </button>
                ) : (
                    <span className="w-[18px]" />
                )}

                {icon ? (
                    <span className={`flex-shrink-0 ${iconColor}`}>{icon}</span>
                ) : (
                    <span className={`flex-shrink-0 w-4 h-4 rounded ${iconColor} bg-current opacity-60`} />
                )}

                <span className="text-xs font-medium truncate flex-1">
                    {label}
                </span>

                {count !== undefined && count > 0 && (
                    <span className={`
                        text-[10px] px-1.5 py-0.5
                        rounded-full
                        ${countClasses[theme]}
                        transition-colors
                    `}>
                        {count}
                    </span>
                )}

                <button
                    onClick={handleActionClick}
                    className={`
                        p-1 rounded
                        ${actionClasses[theme]}
                        transition-opacity duration-150
                        ${showActions || isSelected ? 'opacity-100' : 'opacity-0'}
                    `}
                    aria-label="More actions"
                >
                    {MoreIcon}
                </button>
            </div>

            {hasChildren && isExpanded && children && (
                <div
                    role="group"
                    className="animate-in fade-in slide-in-from-top-1 duration-200"
                >
                    {children}
                </div>
            )}
        </div>
    );
};

export default SoftTreeItem;
