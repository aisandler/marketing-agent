import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { SoftTheme } from './SoftCard';

// Default icons - can be overridden via props
const DefaultChevron: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
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
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export interface DropdownOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
    description?: string;
}

export interface CompactDropdownProps {
    value: string;
    options: DropdownOption[];
    onChange: (value: string) => void;
    chevronIcon?: React.ReactNode;
    checkIcon?: React.ReactNode;
    theme?: SoftTheme;
    className?: string;
}

const triggerClasses = {
    dark: {
        base: 'bg-soft-dark-300 border-white/[0.08] text-slate-200',
        hover: 'hover:bg-soft-dark-400 hover:border-white/[0.12]',
        focus: 'ring-1 ring-soft-indigo-500/30 border-soft-indigo-500/40',
        icon: 'text-slate-400',
        chevron: 'text-slate-500',
    },
    light: {
        base: 'bg-soft-light-200 border-slate-200/60 text-slate-700',
        hover: 'hover:bg-soft-light-300 hover:border-slate-300/80',
        focus: 'ring-1 ring-soft-indigo-400/25 border-soft-indigo-400/40',
        icon: 'text-slate-500',
        chevron: 'text-slate-400',
    },
};

const dropdownClasses = {
    dark: {
        container: 'bg-soft-dark-200 border-white/[0.08] shadow-soft-lg',
        optionActive: 'bg-soft-indigo-500/15 text-soft-indigo-300',
        optionInactive: 'text-slate-300 hover:bg-soft-dark-300 hover:text-white',
        iconActive: 'text-soft-indigo-400',
        iconInactive: 'text-slate-500',
        description: 'text-slate-500',
    },
    light: {
        container: 'bg-white border-slate-200/80 shadow-soft-light-lg',
        optionActive: 'bg-soft-indigo-50 text-soft-indigo-600',
        optionInactive: 'text-slate-700 hover:bg-soft-light-200 hover:text-slate-900',
        iconActive: 'text-soft-indigo-500',
        iconInactive: 'text-slate-400',
        description: 'text-slate-500',
    },
};

/**
 * A compact inline dropdown with smart viewport positioning.
 *
 * @param value - Currently selected value
 * @param options - Array of option objects
 * @param onChange - Callback when selection changes
 * @param chevronIcon - Custom chevron icon
 * @param checkIcon - Custom check icon
 * @param theme - Color scheme: 'dark' (default) or 'light'
 */
const CompactDropdown: React.FC<CompactDropdownProps> = ({
    value,
    options,
    onChange,
    chevronIcon,
    checkIcon,
    theme = 'dark',
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<{ top: number; left: number; openUpward: boolean } | null>(null);

    const styles = triggerClasses[theme];
    const dropdownStyles = dropdownClasses[theme];
    const currentOption = options.find(o => o.value === value);

    const ChevronElement = chevronIcon || <DefaultChevron size={12} className={styles.chevron} />;
    const CheckElement = checkIcon || <DefaultCheck size={14} className={dropdownStyles.iconActive} />;

    const calculatePosition = useCallback(() => {
        if (!triggerRef.current) return null;

        const rect = triggerRef.current.getBoundingClientRect();
        const dropdownHeight = options.length * 44 + 8;
        const dropdownWidth = 180;
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const spaceBelow = viewportHeight - rect.bottom - 8;
        const spaceAbove = rect.top - 8;

        const openUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

        let left = rect.left;
        if (rect.left + dropdownWidth > viewportWidth - 8) {
            left = Math.max(8, rect.right - dropdownWidth);
        }

        return {
            top: openUpward ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
            left,
            openUpward
        };
    }, [options.length]);

    const handleToggle = useCallback(() => {
        if (!isOpen) {
            const pos = calculatePosition();
            setPosition(pos);
        }
        setIsOpen(!isOpen);
    }, [isOpen, calculatePosition]);

    useEffect(() => {
        if (!isOpen) return;

        const updatePosition = () => {
            const pos = calculatePosition();
            if (pos) setPosition(pos);
        };

        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);
        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isOpen, calculatePosition]);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (
                triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
                dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    return (
        <>
            <button
                ref={triggerRef}
                onClick={handleToggle}
                className={`
                    flex items-center gap-1.5 px-2.5 py-1.5
                    ${styles.base} border
                    rounded-lg text-xs font-medium
                    ${styles.hover}
                    transition-all duration-200
                    ${isOpen ? styles.focus : ''}
                    ${className}
                `}
            >
                {currentOption?.icon && (
                    <span className={styles.icon}>{currentOption.icon}</span>
                )}
                <span>{currentOption?.label || value}</span>
                <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    {ChevronElement}
                </span>
            </button>

            {isOpen && position && createPortal(
                <div
                    ref={dropdownRef}
                    style={{ top: position.top, left: position.left }}
                    className={`
                        fixed z-[100] ${dropdownStyles.container} border
                        rounded-lg overflow-hidden min-w-[180px]
                        transition-opacity duration-100
                        ${position.openUpward ? 'origin-bottom' : 'origin-top'}
                    `}
                >
                    <div className="py-1 max-h-[280px] overflow-y-auto">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`
                                    w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors duration-150
                                    ${option.value === value
                                        ? dropdownStyles.optionActive
                                        : dropdownStyles.optionInactive
                                    }
                                `}
                            >
                                {option.icon && (
                                    <span className={`flex-shrink-0 ${option.value === value ? dropdownStyles.iconActive : dropdownStyles.iconInactive}`}>
                                        {option.icon}
                                    </span>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium">{option.label}</div>
                                    {option.description && (
                                        <div className={`text-[10px] truncate ${dropdownStyles.description}`}>{option.description}</div>
                                    )}
                                </div>
                                {option.value === value && (
                                    <span className="flex-shrink-0">{CheckElement}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default CompactDropdown;
