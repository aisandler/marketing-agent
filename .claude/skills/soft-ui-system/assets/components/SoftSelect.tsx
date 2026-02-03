import React, { useState, useRef, useEffect } from 'react';
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

export interface SelectOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

export interface SoftSelectProps {
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
    theme?: SoftTheme;
}

const sizeClasses = {
    sm: {
        trigger: 'p-2.5 text-[11px]',
        option: 'px-3 py-2 text-[11px]',
        icon: 12,
    },
    md: {
        trigger: 'p-3.5 text-xs',
        option: 'px-3.5 py-2.5 text-xs',
        icon: 14,
    },
};

const triggerClasses = {
    dark: {
        base: 'bg-soft-dark-200 border-white/[0.06] text-slate-200',
        hover: 'hover:border-white/[0.12] hover:bg-soft-dark-300',
        focus: 'border-soft-indigo-500/50 ring-2 ring-soft-indigo-500/20',
        placeholder: 'text-slate-500',
        icon: 'text-slate-500',
    },
    light: {
        base: 'bg-white border-slate-200/60 text-slate-800',
        hover: 'hover:border-slate-300/80 hover:bg-soft-light-200',
        focus: 'border-soft-indigo-400/50 ring-2 ring-soft-indigo-400/15',
        placeholder: 'text-slate-400',
        icon: 'text-slate-400',
    },
};

const dropdownClasses = {
    dark: {
        container: 'bg-soft-dark-200 border-white/[0.08] shadow-soft-lg',
        optionActive: 'bg-soft-indigo-500/15 text-soft-indigo-300',
        optionInactive: 'text-slate-300 hover:bg-soft-dark-300 hover:text-white',
    },
    light: {
        container: 'bg-white border-slate-200/80 shadow-soft-light-lg',
        optionActive: 'bg-soft-indigo-50 text-soft-indigo-600',
        optionInactive: 'text-slate-700 hover:bg-soft-light-200 hover:text-slate-900',
    },
};

const labelClasses = {
    dark: 'text-slate-400',
    light: 'text-slate-600',
};

/**
 * A soft dropdown select component with portal-based positioning.
 *
 * @param value - Currently selected value
 * @param onChange - Callback when selection changes
 * @param options - Array of option objects with value, label, and optional icon
 * @param placeholder - Placeholder text when no selection
 * @param icon - Icon displayed in trigger button
 * @param chevronIcon - Custom chevron icon (defaults to built-in SVG)
 * @param checkIcon - Custom check icon for selected item (defaults to built-in SVG)
 * @param size - Select size: 'sm' or 'md'
 * @param theme - Color scheme: 'dark' (default) or 'light'
 */
const SoftSelect: React.FC<SoftSelectProps> = ({
    label,
    value,
    onChange,
    options,
    placeholder = "Select...",
    icon,
    chevronIcon,
    checkIcon,
    disabled = false,
    size = 'md',
    theme = 'dark',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const config = sizeClasses[size];
    const styles = triggerClasses[theme];
    const dropdownStyles = dropdownClasses[theme];

    const selectedOption = options.find(opt => opt.value === value);

    const ChevronElement = chevronIcon || <DefaultChevron size={config.icon} className={styles.icon} />;
    const CheckElement = checkIcon || <DefaultCheck size={12} className="text-soft-indigo-400" />;

    const handleToggle = () => {
        if (disabled) return;

        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + 8,
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
        <div className="space-y-2 w-full font-sans" ref={containerRef}>
            {label && (
                <label className={`text-[10px] font-medium block ${labelClasses[theme]}`}>
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
                        ${styles.base}
                        border
                        rounded-[14px]
                        ${config.trigger}
                        text-left
                        transition-all duration-200 ease-out
                        ${disabled
                            ? 'opacity-50 cursor-not-allowed'
                            : `${styles.hover} cursor-pointer`
                        }
                        ${isOpen ? styles.focus : ''}
                    `}
                    disabled={disabled}
                >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                        {icon && <span className={`${styles.icon} flex-shrink-0`}>{icon}</span>}
                        {selectedOption?.icon && <span className={`${styles.icon} flex-shrink-0`}>{selectedOption.icon}</span>}
                        <span className="truncate">
                            {selectedOption
                                ? selectedOption.label
                                : <span className={styles.placeholder}>{placeholder}</span>
                            }
                        </span>
                    </div>
                    <span
                        className={`
                            transition-transform duration-200 ease-out
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
                            ${dropdownStyles.container}
                            border
                            rounded-soft-lg
                            overflow-hidden
                            animate-in fade-in slide-in-from-top-1 duration-150
                        `}
                    >
                        <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-soft-dark-400 p-1.5">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className={`
                                        w-full flex items-center justify-between
                                        ${config.option}
                                        rounded-xl
                                        transition-all duration-150 ease-out
                                        ${option.value === value
                                            ? dropdownStyles.optionActive
                                            : dropdownStyles.optionInactive
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

export default SoftSelect;
